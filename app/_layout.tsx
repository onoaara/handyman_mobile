import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider } from "react-redux";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { firebaseAuth, firebaseDb } from "@/lib/firebase";
import { setAuthError, setInitializing, setUser } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { store } from "@/store/store";

export const unstable_settings = {
  anchor: "(auth)/login",
};

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutInner />
    </Provider>
  );
}

function RootLayoutInner() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      dispatch(setInitializing(true));

      if (!user) {
        dispatch(setUser(null));
        dispatch(setInitializing(false));
        return;
      }

      const baseUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: null,
      } as const;

      (async () => {
        try {
          const userDocRef = doc(firebaseDb, "users", user.uid);
          let snap = await getDoc(userDocRef);

          if (!active) return;

          if (!snap.exists()) {
            const existingStateUser = store.getState().auth.user;
            const existingRole =
              existingStateUser?.uid === user.uid
                ? existingStateUser.role
                : null;

            if (existingRole === "user" || existingRole === "handyman") {
              dispatch(setUser({ ...baseUser, role: existingRole }));
              return;
            }

            for (let attempt = 0; attempt < 6; attempt++) {
              await new Promise((r) => setTimeout(r, 250));
              snap = await getDoc(userDocRef);
              if (!active) return;
              if (!snap.exists()) continue;

              const role = snap.data()?.role as unknown;
              if (role === "user" || role === "handyman") {
                dispatch(setUser({ ...baseUser, role }));
                return;
              }

              dispatch(setAuthError("Invalid role"));
              await firebaseAuth.signOut();
              dispatch(setUser(null));
              return;
            }

            dispatch(setAuthError("Unable to load role"));
            await firebaseAuth.signOut();
            dispatch(setUser(null));
            return;
          }

          const role = snap.data()?.role as unknown;

          if (role === "user" || role === "handyman") {
            dispatch(setUser({ ...baseUser, role }));
          } else {
            dispatch(setAuthError("Invalid role"));
            await firebaseAuth.signOut();
            dispatch(setUser(null));
          }
        } catch {
          dispatch(setAuthError("Unable to load role"));
          await firebaseAuth.signOut();
          dispatch(setUser(null));
        } finally {
          if (active) dispatch(setInitializing(false));
        }
      })();
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="handyman" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
