import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { supabase } from "../src/services/supabase";

export default function RootLayout() {
  const url = Linking.useLinkingURL();

  useEffect(() => {
    if (!url || !supabase) return;

    const handleAuthLink = async () => {
      const hash = url.includes("#") ? url.split("#")[1] : "";
      const query = url.includes("?") ? url.split("?")[1].split("#")[0] : "";
      const params = new URLSearchParams(hash || query);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const type = params.get("type");

      if (!accessToken || !refreshToken) return;

      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) return;

      if (type === "recovery") {
        router.replace("/reset-password");
      } else {
        router.replace("/");
      }
    };

    void handleAuthLink();
  }, [url]);

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
