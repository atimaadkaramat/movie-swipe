import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../src/theme";
import { updatePassword } from "../src/services/auth";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setMessage("");
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setMessage("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const result = await updatePassword(password);
      if (result.error) throw result.error;
      router.replace("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.glow} />
      <View style={styles.content}>
        <Text style={styles.logo}>CINESWIPE</Text>
        <Text style={styles.title}>Choose a new password.</Text>
        <Text style={styles.subtitle}>Your password reset link has been verified. Set a new password below.</Text>

        <View style={styles.form}>
          <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="New password" placeholderTextColor={colors.muted} style={styles.input} />
          <TextInput value={confirmation} onChangeText={setConfirmation} secureTextEntry placeholder="Confirm password" placeholderTextColor={colors.muted} style={styles.input} />
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Pressable style={[styles.primary, busy && styles.disabled]} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#111319" /> : <Text style={styles.primaryText}>UPDATE PASSWORD</Text>}
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  glow: { position: "absolute", width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(208,188,255,0.09)", top: -90, right: -100 },
  content: { flex: 1, justifyContent: "center", padding: 24 },
  logo: { color: colors.accent, fontSize: 13, fontWeight: "900", letterSpacing: 4 },
  title: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: "900", marginTop: 18 },
  subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 21, marginTop: 10 },
  form: { marginTop: 28, gap: 12 },
  input: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 16, fontSize: 15 },
  message: { color: colors.secondary, fontSize: 12, lineHeight: 18 },
  primary: { height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, marginTop: 4 },
  disabled: { opacity: 0.65 },
  primaryText: { color: "#111319", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
});
