import { supabase, supabaseConfigOk } from "@/lib/supabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { RootState } from "./store";

export type Role = "handyman" | "user";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role | null;
  location: string | null;
  photoUrl: string | null;
};

const PROFILE_PICTURES_BUCKET = "pictures";

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

function toAuthUser(user: SupabaseUser): AuthUser {
  const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role =
    meta.role === "user" || meta.role === "handyman" ? meta.role : null;
  const displayName =
    typeof meta.displayName === "string"
      ? meta.displayName
      : typeof meta.full_name === "string"
      ? meta.full_name
      : null;
  const location = typeof meta.location === "string" ? meta.location : null;
  const photoUrl = typeof meta.photoUrl === "string" ? meta.photoUrl : null;

  return {
    uid: user.id,
    email: user.email ?? null,
    displayName,
    role,
    location,
    photoUrl,
  };
}

function guessImageInfoFromUri(uri: string): {
  ext: "png" | "webp" | "jpg";
  contentType: string;
} {
  const normalized = uri.split("?")[0]?.toLowerCase() ?? "";
  if (normalized.endsWith(".png"))
    return { ext: "png", contentType: "image/png" };
  if (normalized.endsWith(".webp"))
    return { ext: "webp", contentType: "image/webp" };
  if (normalized.endsWith(".jpeg"))
    return { ext: "jpg", contentType: "image/jpeg" };
  if (normalized.endsWith(".jpg"))
    return { ext: "jpg", contentType: "image/jpeg" };
  return { ext: "jpg", contentType: "image/jpeg" };
}

function formatStoragePolicyHint(bucket: string) {
  return [
    "Storage upload blocked by Supabase RLS.",
    `Create Storage policies for bucket "${bucket}" (or rename the bucket to match).`,
    "Example policies (SQL Editor):",
    `create policy "upload own file" on storage.objects for insert to authenticated with check (bucket_id = '${bucket}' and name like auth.uid()::text || '.%');`,
    `create policy "update own file" on storage.objects for update to authenticated using (bucket_id = '${bucket}' and name like auth.uid()::text || '.%') with check (bucket_id = '${bucket}' and name like auth.uid()::text || '.%');`,
  ].join("\n");
}

export const signInThunk = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    if (!supabaseConfigOk)
      return rejectWithValue(
        "Missing Supabase key (set EXPO_PUBLIC_SUPABASE_ANON_KEY)"
      );
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    if (!data.user) return rejectWithValue("Unable to load user session");
    return toAuthUser(data.user);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to sign in";
    return rejectWithValue(message);
  }
});

export const signUpThunk = createAsyncThunk<
  AuthUser,
  {
    name: string;
    email: string;
    password: string;
    role: Role;
    location?: string;
    profilePictureUri?: string | null;
  },
  { rejectValue: string }
>(
  "auth/signUp",
  async (
    { name, email, password, role, location, profilePictureUri },
    { rejectWithValue }
  ) => {
    try {
      if (!supabaseConfigOk)
        return rejectWithValue(
          "Missing Supabase key (set EXPO_PUBLIC_SUPABASE_ANON_KEY)"
        );
      const displayName = name.trim();
      const trimmedLocation = location?.trim() || null;
      let photoUrl: string | null = null;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            displayName: displayName || null,
            role,
            location: trimmedLocation,
            photoUrl: null,
          },
        },
      });
      if (error) throw error;
      if (!data.user)
        return rejectWithValue("Signup succeeded but no user was returned");
      if (!data.session)
        return rejectWithValue("Check your email to confirm your account");

      if (profilePictureUri) {
        try {
          const { ext, contentType } = guessImageInfoFromUri(profilePictureUri);
          const response = await fetch(profilePictureUri);
          const arrayBuffer = await response.arrayBuffer();
          const path = `${data.user.id}.${ext}`;
          const upload = await supabase.storage
            .from(PROFILE_PICTURES_BUCKET)
            .upload(path, arrayBuffer, {
              upsert: true,
              contentType,
            });
          if (!upload.error) {
            const url = supabase.storage
              .from(PROFILE_PICTURES_BUCKET)
              .getPublicUrl(path);
            photoUrl = url.data.publicUrl || null;
            if (photoUrl) {
              await supabase.auth.updateUser({ data: { photoUrl } });
            }
          }
        } catch {
          photoUrl = null;
        }
      }

      return {
        uid: data.user.id,
        email: data.user.email ?? null,
        displayName: displayName || null,
        role,
        location: trimmedLocation,
        photoUrl,
      };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to sign up";
      return rejectWithValue(message);
    }
  }
);

export const signOutThunk = createAsyncThunk<void, void>(
  "auth/signOut",
  async () => {
    try {
      await supabase.auth.signOut({ scope: "local" });
    } catch {
      try {
        await supabase.auth.signOut();
      } catch {
        return;
      }
    }
  }
);

export const updateProfileThunk = createAsyncThunk<
  AuthUser,
  { displayName: string; location: string; profilePictureUri?: string | null },
  { state: RootState; rejectValue: string }
>(
  "auth/updateProfile",
  async (
    { displayName, location, profilePictureUri },
    { getState, rejectWithValue }
  ) => {
    try {
      if (!supabaseConfigOk)
        return rejectWithValue(
          "Missing Supabase key (set EXPO_PUBLIC_SUPABASE_ANON_KEY)"
        );
      const current = getState().auth.user;
      if (!current) return rejectWithValue("Not signed in");

      const nextDisplayName = displayName.trim() || null;
      const nextLocation = location.trim() || null;
      let nextPhotoUrl: string | null = current.photoUrl;

      if (profilePictureUri) {
        const response = await fetch(profilePictureUri);
        const { ext, contentType } = guessImageInfoFromUri(profilePictureUri);
        const arrayBuffer = await response.arrayBuffer();
        const path = `${current.uid}.${ext}`;
        const upload = await supabase.storage
          .from(PROFILE_PICTURES_BUCKET)
          .upload(path, arrayBuffer, {
            upsert: true,
            contentType,
          });
        if (upload.error) {
          const msg = upload.error.message ?? "Storage upload failed";
          if (msg.toLowerCase().includes("row-level security"))
            return rejectWithValue(
              formatStoragePolicyHint(PROFILE_PICTURES_BUCKET)
            );
          return rejectWithValue(msg);
        }
        const url = supabase.storage
          .from(PROFILE_PICTURES_BUCKET)
          .getPublicUrl(path);
        nextPhotoUrl = url.data.publicUrl || null;
      }

      const { data, error } = await supabase.auth.updateUser({
        data: {
          role: current.role,
          displayName: nextDisplayName,
          location: nextLocation,
          photoUrl: nextPhotoUrl,
        },
      });
      if (error) throw error;

      if (data.user) return toAuthUser(data.user);
      return {
        ...current,
        displayName: nextDisplayName,
        location: nextLocation,
        photoUrl: nextPhotoUrl,
      };
    } catch (e: unknown) {
      const message =
        e instanceof Error ? e.message : "Failed to update profile";
      return rejectWithValue(message);
    }
  }
);

const initialState: AuthState = {
  user: null,
  initializing: true,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    setInitializing(state, action: PayloadAction<boolean>) {
      state.initializing = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signInThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signInThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to sign in";
      })
      .addCase(signUpThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signUpThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to sign up";
      })
      .addCase(signOutThunk.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      })
      .addCase(signOutThunk.rejected, (state, action) => {
        state.user = null;
        state.status = "idle";
        state.error = action.error.message ?? "Failed to sign out";
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to update profile";
      });
  },
});

export const { setUser, setInitializing, setAuthError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
