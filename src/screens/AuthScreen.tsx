import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../theme";
import { getSession, signIn, signUp } from "../services/auth";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getSession().then((session) => {
      if (session) router.replace("/(tabs)/discover");
    });
  }, []);

  async function submit() {
    setMessage("");
    if (!email.trim() || password.length < 6) {
      setMessage("Enter a valid email and a password with at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      const result = mode === "login"
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) throw result.error;

      if (mode === "signup" && !result.data.session) {
        setMessage("Account created. Check your email to verify your account, then sign in.");
      } else {
        router.replace("/(tabs)/discover");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.glow} />
      <View style={styles.content}>
        <Text style={styles.logo}>CINESWIPE</Text>
        <Text style={styles.title}>{mode === "login" ? "Welcome back." : "Find your movie taste."}</Text>
        <Text style={styles.subtitle}>
          Swipe movies. Build your taste. Find people who get your cinema.
        </Text>

        <View style={styles.form}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="Email"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Password"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable style={[styles.primary, busy && styles.disabled]} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#111319" /> : <Text style={styles.primaryText}>{mode === "login" ? "LOG IN" : "CREATE ACCOUNT"}</Text>}
          </Pressable>

          <Pressable onPress={() => { setMode(mode === "login" ? "signup" : "login"); setMessage(""); }}>
            <Text style={styles.switch}>
              {mode === "login" ? "New to CineSwipe? Create an account" : "Already have an account? Log in"}
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  glow: { position: "absolute", width: 280, height: 280, borderRadius: 140, backgroundColor: "rgba(208,188,255,0.10)", top: 40, right: -120 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  logo: { color: colors.accent, fontSize: 13, fontWeight: "900", letterSpacing: 4 },
  title: { color: colors.text, fontSize: 36, lineHeight: 42, fontWeight: "900", marginTop: 18 },
  subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 340 },
  form: { marginTop: 34, gap: 12 },
  input: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 16, fontSize: 15 },
  message: { color: colors.secondary, fontSize: 12, lineHeight: 18 },
  primary: { height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, marginTop: 4 },
  disabled: { opacity: 0.65 },
  primaryText: { color: "#111319", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
  switch: { color: colors.secondary, textAlign: "center", fontSize: 12, paddingVertical: 10 },
});
