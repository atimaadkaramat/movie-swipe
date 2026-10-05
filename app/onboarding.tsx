import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { colors } from "../src/theme";
import { updateMyProfile } from "../src/services/profile";

export default function Onboarding() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit() {
    setMessage("");
    setBusy(true);
    try {
      await updateMyProfile({ username, displayName, bio });
      router.replace("/(tabs)/discover");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.glow} />
      <View style={styles.content}>
        <Text style={styles.logo}>CINESWIPE</Text>
        <Text style={styles.kicker}>FIRST THINGS FIRST</Text>
        <Text style={styles.title}>Create your profile.</Text>
        <Text style={styles.subtitle}>
          This is how people will see you when CineSwipe becomes social.
        </Text>

        <View style={styles.form}>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Display name"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TextInput
            value={username}
            onChangeText={(value) => setUsername(value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Username"
            placeholderTextColor={colors.muted}
            style={styles.input}
          />
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Short bio (optional)"
            placeholderTextColor={colors.muted}
            multiline
            maxLength={140}
            style={[styles.input, styles.bio]}
          />

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable style={[styles.primary, busy && styles.disabled]} onPress={submit} disabled={busy}>
            {busy ? <ActivityIndicator color="#111319" /> : <Text style={styles.primaryText}>CONTINUE</Text>}
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
  kicker: { color: colors.accent, fontSize: 9, fontWeight: "900", letterSpacing: 1.5, marginTop: 30 },
  title: { color: colors.text, fontSize: 34, lineHeight: 40, fontWeight: "900", marginTop: 7 },
  subtitle: { color: colors.secondary, fontSize: 14, lineHeight: 21, marginTop: 10 },
  form: { marginTop: 28, gap: 12 },
  input: { height: 56, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, paddingHorizontal: 16, fontSize: 15 },
  bio: { height: 92, paddingTop: 16, textAlignVertical: "top" },
  message: { color: colors.secondary, fontSize: 12, lineHeight: 18 },
  primary: { height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: colors.accent, marginTop: 4 },
  disabled: { opacity: 0.65 },
  primaryText: { color: "#111319", fontSize: 12, fontWeight: "900", letterSpacing: 1 },
});
