import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function PlaceholderScreen({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>CINESWIPE</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>This section is scaffolded for the next implementation phase.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 24 },
  kicker: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: colors.text, fontSize: 30, fontWeight: "800", marginTop: 8 },
  body: { color: colors.secondary, textAlign: "center", marginTop: 12, lineHeight: 22 },
});