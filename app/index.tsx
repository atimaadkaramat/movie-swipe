import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSession } from "../src/services/auth";
import { getMyProfile } from "../src/services/profile";
import { AuthScreen } from "../src/screens/AuthScreen";
import { colors } from "../src/theme";

type Destination = "loading" | "auth" | "onboarding" | "discover";

export default function Index() {
  const [destination, setDestination] = useState<Destination>("loading");

  useEffect(() => {
    let active = true;

    async function resolve() {
      try {
        const session = await getSession();
        if (!session) {
          if (active) setDestination("auth");
          return;
        }

        const profile = await getMyProfile();
        if (active) setDestination(profile?.onboarding_completed ? "discover" : "onboarding");
      } catch {
        if (active) setDestination("discover");
      }
    }

    void resolve();
    return () => { active = false; };
  }, []);

  if (destination === "loading") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (destination === "auth") return <AuthScreen />;
  if (destination === "onboarding") return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)/discover" />;
}
