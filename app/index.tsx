import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getSession } from "../src/services/auth";
import { AuthScreen } from "../src/screens/AuthScreen";
import { colors } from "../src/theme";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(false);

  useEffect(() => {
    void getSession().then((value) => {
      setSession(Boolean(value));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}><ActivityIndicator color={colors.accent} /></View>;
  }

  if (session) return <Redirect href="/(tabs)/discover" />;
  return <AuthScreen />;
}
