import { firebaseAuth, firebaseDb, firebaseStorage } from "@/lib/firebase";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export type Role = "handyman" | "user";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: Role | null;
};

type AuthState = {
  user: AuthUser | null;
  initializing: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    role: null,
  };
}

export const signInThunk = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/signIn", async ({ email, password }, { rejectWithValue }) => {
  try {
    const cred = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    return toAuthUser(cred.user);
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
      const cred = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      const displayName = name.trim();
      const trimmedLocation = location?.trim() || null;
      let profilePictureUrl: string | null = null;
      const userRef = doc(firebaseDb, "users", cred.user.uid);

      await setDoc(
        userRef,
        {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: displayName || cred.user.displayName || null,
          location: trimmedLocation,
          role,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (profilePictureUri) {
        const response = await fetch(profilePictureUri);
        const blob = await response.blob();
        const storageRef = ref(
          firebaseStorage,
          `profilePictures/${cred.user.uid}`
        );
        await uploadBytes(storageRef, blob);
        profilePictureUrl = await getDownloadURL(storageRef);
      }

      if (displayName || profilePictureUrl) {
        await updateProfile(cred.user, {
          ...(displayName ? { displayName } : {}),
          ...(profilePictureUrl ? { photoURL: profilePictureUrl } : {}),
        });
      }

      await setDoc(
        userRef,
        {
          displayName: displayName || cred.user.displayName || null,
          profilePicture: profilePictureUrl ?? cred.user.photoURL ?? null,
          location: trimmedLocation,
          role,
        },
        { merge: true }
      );

      return {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName || cred.user.displayName || null,
        role,
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
    await signOut(firebaseAuth);
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
