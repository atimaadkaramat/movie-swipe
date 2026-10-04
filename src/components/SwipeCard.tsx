import { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { Movie } from "../data/mockMovies";

type Action = "pass" | "like" | "watchlist" | "details";

const { width, height } = Dimensions.get("window");
const X_THRESHOLD = width * 0.28;
const Y_THRESHOLD = height * 0.18;

export function SwipeCard({ movie, onAction }: { movie: Movie; onAction: (action: Action) => void }) {
  const position = useRef(new Animated.ValueXY()).current;

  const actionFor = (x: number, y: number): Action => {
    if (Math.abs(x) >= Math.abs(y)) return x > 0 ? "like" : "pass";
    return y < 0 ? "watchlist" : "details";
  };

  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
    onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
    onPanResponderRelease: (_, g) => {
      const action = actionFor(g.dx, g.dy);
      const committed = action === "like" || action === "pass"
        ? Math.abs(g.dx) > X_THRESHOLD
        : Math.abs(g.dy) > Y_THRESHOLD;

      if (!committed) {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
        return;
      }

      const destination = action === "like" ? width * 1.3
        : action === "pass" ? -width * 1.3
        : action === "watchlist" ? -width * 0.2
        : width * 0.2;

      const destinationY = action === "watchlist" ? -height : action === "details" ? height : g.dy;

      Animated.timing(position, {
        toValue: { x: destination, y: destinationY },
        duration: 220,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          position.setValue({ x: 0, y: 0 });
          onAction(action);
        }
      });
    },
  })).current;

  const rotate = position.x.interpolate({ inputRange: [-width, 0, width], outputRange: ["-9deg", "0deg", "9deg"], extrapolate: "clamp" });

  return (
    <Animated.View {...panResponder.panHandlers} style={[styles.card, { transform: [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}>
      <View style={styles.poster}>
        <View style={styles.posterFallback}>
          <MaterialCommunityIcons name="movie-open-outline" size={54} color={colors.accent} />
          <Text style={styles.posterText}>TMDB POSTER</Text>
        </View>
        <View style={styles.scrim} />
        <View style={styles.match}>
          <Text style={styles.matchText}>{movie.match}% MATCH</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{movie.title}</Text>
          <Text style={styles.meta}>{movie.year}  •  {movie.genres.join("  •  ")}</Text>
          <Text style={styles.rating}>★ {movie.rating.toFixed(1)}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { position: "absolute", width: "86%", height: "74%", alignSelf: "center", borderRadius: 28, overflow: "hidden", backgroundColor: colors.surface, shadowColor: "#000", shadowOpacity: 0.5, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 14 },
  poster: { flex: 1, backgroundColor: "#171923" },
  posterFallback: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  posterText: { color: colors.muted, fontSize: 10, fontWeight: "800", letterSpacing: 2 },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)" },
  match: { position: "absolute", top: 18, left: 18, backgroundColor: "rgba(12,14,20,0.75)", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  matchText: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 0.7 },
  info: { position: "absolute", left: 20, right: 20, bottom: 22 },
  title: { color: colors.text, fontSize: 30, fontWeight: "900" },
  meta: { color: colors.secondary, marginTop: 6, fontSize: 12 },
  rating: { color: colors.watchlist, marginTop: 10, fontWeight: "800" },
});