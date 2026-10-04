import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SwipeCard } from "../components/SwipeCard";
import { mockMovies } from "../data/mockMovies";
import { colors } from "../theme";
import { useRouter } from "expo-router";

export function DiscoverScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const movie = mockMovies[index % mockMovies.length];

  const handleAction = (action: "pass" | "like" | "watchlist" | "details") => {
    setLastAction(action);
    if (action === "details") {
      router.push(`/movie/${movie.id}`);
      return;
    }
    setIndex((value) => value + 1);
  };

  const actionLabel = lastAction === "like" ? "LIKE →" : lastAction === "pass" ? "← PASS" : lastAction === "watchlist" ? "↑ WATCHLIST" : null;

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#1B1630", colors.background, colors.background]} style={StyleSheet.absoluteFillObject} />
      <BlurView intensity={24} tint="dark" style={styles.header}>
        <View>
          <Text style={styles.brand}>CineSwipe</Text>
          <Text style={styles.kicker}>DISCOVER SWIPE</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} accessibilityLabel="Filter tastes"><MaterialCommunityIcons name="tune-variant" size={20} color={colors.text} /></Pressable>
          <Pressable style={styles.avatar}><MaterialCommunityIcons name="account-circle" size={34} color={colors.accent} /></Pressable>
        </View>
      </BlurView>

      <View style={styles.content}>
        <View style={styles.hudTop}><MaterialCommunityIcons name="bookmark-outline" size={16} color={colors.watchlist} /><Text style={styles.hudText}>WATCHLIST</Text></View>
        <View style={styles.hudBottom}><MaterialCommunityIcons name="information-outline" size={16} color={colors.details} /><Text style={styles.hudText}>DETAILS</Text></View>
        <View style={styles.hudLeft}><MaterialCommunityIcons name="close" size={18} color={colors.pass} /></View>
        <View style={styles.hudRight}><MaterialCommunityIcons name="heart-outline" size={18} color={colors.like} /></View>

        <SwipeCard movie={movie} onAction={handleAction} />
        <Text style={styles.gestureHint}>← PASS   •   LIKE →{"\n"}↑ WATCHLIST   •   ↓ DETAILS</Text>

        {lastAction && <View style={styles.feedback}><Text style={styles.feedbackText}>{actionLabel}</Text></View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: { height: 74, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between", zIndex: 5, borderBottomColor: "rgba(255,255,255,0.06)", borderBottomWidth: StyleSheet.hairlineWidth },
  brand: { color: colors.text, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  kicker: { color: colors.accent, fontSize: 9, fontWeight: "800", letterSpacing: 1, marginTop: 2 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 999, backgroundColor: colors.surfaceGlass },
  avatar: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 34 },
  hudTop: { position: "absolute", top: 10, backgroundColor: "rgba(12,14,20,0.55)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, flexDirection: "row", gap: 5, opacity: 0.85 },
  hudBottom: { position: "absolute", bottom: 6, backgroundColor: "rgba(12,14,20,0.55)", borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, flexDirection: "row", gap: 5, opacity: 0.85 },
  hudLeft: { position: "absolute", left: 8, top: "48%", width: 38, height: 38, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(12,14,20,0.5)" },
  hudRight: { position: "absolute", right: 8, top: "48%", width: 38, height: 38, borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(12,14,20,0.5)" },
  hudText: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 0.6 },
  gestureHint: { position: "absolute", bottom: 30, color: colors.muted, fontSize: 10, fontWeight: "700", textAlign: "center", lineHeight: 16 },
  feedback: { position: "absolute", top: "12%", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: "rgba(12,14,20,0.8)" },
  feedbackText: { color: colors.accent, fontSize: 12, fontWeight: "900", letterSpacing: 1 },
});