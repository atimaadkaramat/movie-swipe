import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme";

export function MovieDetailsScreen({ movieId }: { movieId: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>DEEP DIVE</Text>
      <Text style={styles.title}>{movieId.replaceAll("-", " ")}</Text>
      <Text style={styles.body}>Movie details will be populated from TMDB in Phase 4.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24, paddingTop: 72 },
  kicker: { color: colors.accent, fontSize: 11, fontWeight: "800", letterSpacing: 2 },
  title: { color: colors.text, fontSize: 32, fontWeight: "900", marginTop: 8, textTransform: "uppercase" },
  body: { color: colors.secondary, fontSize: 15, lineHeight: 23, marginTop: 16 },
});