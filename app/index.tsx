import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { getSession } from "../src/services/auth";
import { getMyProfile } from "../src/services/profile";
import { AuthScreen } from "../src/screens/AuthScreen";
import { colors } from "../src/theme";

type Destination = "loading" | "auth" | "onboarding" | "discover" | "error";

export default function Index() {
  const [destination, setDestination] = useState<Destination>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function resolve() {
      setErrorMessage("");

      try {
        const session = await getSession();
        if (!session) {
          if (active) setDestination("auth");
          return;
        }

        const profile = await getMyProfile();
        if (active) {
          setDestination(profile?.onboarding_completed ? "discover" : "onboarding");
        }
      } catch (error) {
        if (active) {
          setErrorMessage(
            error instanceof Error ? error.message : "Could not load your profile."
          );
          setDestination("error");
        }
      }
    }

    void resolve();
    return () => {
      active = false;
    };
  }, [attempt]);

  if (destination === "loading") {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  if (destination === "auth") return <AuthScreen />;
  if (destination === "onboarding") return <Redirect href="/onboarding" />;
  if (destination === "discover") return <Redirect href="/(tabs)/discover" />;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Text style={{ color: colors.text, fontSize: 24, fontWeight: "800", textAlign: "center" }}>
        Could not load your profile
      </Text>
      <Text style={{ color: colors.secondary, fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 10 }}>
        {errorMessage}
      </Text>
      <Pressable
        onPress={() => {
          setDestination("loading");
          setAttempt((value) => value + 1);
        }}
        style={{
          marginTop: 24,
          paddingHorizontal: 24,
          height: 48,
          borderRadius: 14,
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#111319", fontWeight: "900", letterSpacing: 1 }}>
          RETRY
        </Text>
      </Pressable>
    </View>
  );
}
