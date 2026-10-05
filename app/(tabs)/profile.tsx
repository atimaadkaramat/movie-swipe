import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getTasteSummary } from "../../src/services/taste";
import { getWatchlist } from "../../src/services/library";
import { signOut } from "../../src/services/auth";
import { router } from "expo-router";
import { colors } from "../../src/theme";

type Summary = {
  total: number;
  liked: number;
  passed: number;
  watchlisted: number;
  topGenres: string[];
};

export default function Profile() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [watchlistCount, setWatchlistCount] = useState(0);

  const load = useCallback(async () => {
    const [taste, watchlist] = await Promise.all([getTasteSummary(), getWatchlist()]);
    setSummary(taste);
    setWatchlistCount(watchlist.length);
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  if (!summary) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={42} color={colors.accent} />
        </View>
        <Text style={styles.kicker}>YOUR TASTE DNA</Text>
        <Text style={styles.title}>CineSwipe Profile</Text>
        <Text style={styles.subtitle}>
          Every swipe helps CineSwipe understand your movie taste.
        </Text>
      </View>

      <View style={styles.statsGrid}>
        <Stat icon="heart" label="Liked" value={summary.liked} color={colors.like} />
        <Stat icon="close" label="Passed" value={summary.passed} color={colors.pass} />
        <Stat icon="bookmark" label="Watchlist" value={watchlistCount} color={colors.watchlist} />
        <Stat icon="gesture-swipe" label="Swipes" value={summary.total} color={colors.accent} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Taste DNA</Text>
        {summary.topGenres.length ? (
          <View style={styles.genreWrap}>
            {summary.topGenres.map((genre) => (
              <View key={genre} style={styles.genre}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.body}>
            Start swiping to build your taste profile. Your strongest genres will appear here.
          </Text>
        )}
      </View>

      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="brain" size={22} color={colors.accent} />
        <View style={styles.infoCopy}>
          <Text style={styles.infoTitle}>Personalization is starting</Text>
          <Text style={styles.body}>
            CineSwipe currently uses your swipe history to build local taste signals. Later, these signals will power personalized recommendations and Movie Twin compatibility.
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.logout}
        onPress={() => {
          void signOut().then(() => router.replace("/"));
        }}
        accessibilityRole="button"
        accessibilityLabel="Log out"
      >
        <MaterialCommunityIcons name="logout" size={18} color={colors.pass} />
        <Text style={styles.logoutText}>LOG OUT</Text>
      </Pressable>
    </ScrollView>
  );
}

function Stat({ icon, label, value, color }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      <MaterialCommunityIcons name={icon} size={19} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 36 },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  hero: { alignItems: "center", paddingTop: 24 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(208,188,255,.10)", borderWidth: 1, borderColor: "rgba(208,188,255,.18)", marginBottom: 18 },
  kicker: { color: colors.accent, fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 27, fontWeight: "900", marginTop: 5 },
  subtitle: { color: colors.secondary, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 7, maxWidth: 310 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 26 },
  stat: { width: "48%", minHeight: 88, borderRadius: 20, padding: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.text, fontSize: 24, fontWeight: "900", marginTop: 7 },
  statLabel: { color: colors.muted, fontSize: 10, fontWeight: "800", marginTop: 2 },
  section: { marginTop: 26 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: "900" },
  genreWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  genre: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(208,188,255,.08)", borderWidth: 1, borderColor: "rgba(208,188,255,.14)" },
  genreText: { color: colors.secondary, fontSize: 11, fontWeight: "800" },
  body: { color: colors.secondary, fontSize: 12, lineHeight: 18, marginTop: 7 },
  infoCard: { flexDirection: "row", gap: 12, marginTop: 24, padding: 16, borderRadius: 20, backgroundColor: "rgba(208,188,255,.06)", borderWidth: 1, borderColor: "rgba(208,188,255,.12)" },
  infoCopy: { flex: 1 },
  infoTitle: { color: colors.text, fontSize: 14, fontWeight: "900" },
  logout: { height: 50, borderRadius: 15, borderWidth: 1, borderColor: "rgba(255,107,117,0.24)", backgroundColor: "rgba(255,107,117,0.06)", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 18 },
  logoutText: { color: colors.pass, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
});
