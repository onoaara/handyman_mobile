import { supabase, supabaseConfigOk } from "@/lib/supabase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Role = "handyman" | "user";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role | null;
  location: string | null;
  photoUrl: string | null;
};

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
          const response = await fetch(profilePictureUri);
          const blob = await response.blob();
          const ext =
            blob.type === "image/png"
              ? "png"
              : blob.type === "image/webp"
              ? "webp"
              : "jpg";
          const path = `${data.user.id}.${ext}`;
          const upload = await supabase.storage
            .from("profile-pictures")
            .upload(path, blob, {
              upsert: true,
              contentType: blob.type || undefined,
            });
          if (!upload.error) {
            const url = supabase.storage
              .from("profile-pictures")
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

export const signOutThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/signOut", async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to sign out";
    return rejectWithValue(message);
  }
});

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
        state.error = action.payload ?? "Failed to sign out";
      });
  },
});

export const { setUser, setInitializing, setAuthError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
