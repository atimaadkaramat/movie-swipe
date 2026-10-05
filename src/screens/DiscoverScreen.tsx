import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { SwipeCard, type SwipeAction } from "../components/SwipeCard";
import { mockMovies, type Movie } from "../data/mockMovies";
import { fetchDiscoverMovies } from "../services/tmdb";
import { addToWatchlist } from "../services/library";
import { getMovieMatch, recordTasteAction } from "../services/taste";
import { colors } from "../theme";

export function DiscoverScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<SwipeAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [matches, setMatches] = useState<Record<string, number>>({});
  const pageRef = useRef(0);
  const feedbackOpacity = useRef(new Animated.Value(0)).current;
  const feedbackScale = useRef(new Animated.Value(0.82)).current;
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadPage(page: number, replace: boolean) {
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    setError(false);

    try {
      const result = await fetchDiscoverMovies(page);
      setHasMore(result.page < result.totalPages);
      pageRef.current = result.page;

      setMovies((current) => {
        if (replace) return result.movies.length ? result.movies : current;
        const seen = new Set(current.map((movie) => movie.id));
        return [...current, ...result.movies.filter((movie) => !seen.has(movie.id))];
      });
    } catch {
      setError(true);
    } finally {
      if (page === 1) setLoading(false);
      else setLoadingMore(false);
    }
  }

  useEffect(() => {
    void loadPage(1, true);
  }, []);

  useEffect(() => {
    if (!hasMore || loadingMore || movies.length - index > 5) return;
    void loadPage(pageRef.current + 1, false);
  }, [index, movies.length, hasMore, loadingMore]);

  useEffect(() => {
    let mounted = true;

    Promise.all(
      movies.slice(index, index + 8).map(async (item) => {
        return [item.id, await getMovieMatch(item)] as const;
      }),
    ).then((values) => {
      if (mounted) {
        setMatches((current) => ({
          ...current,
          ...Object.fromEntries(values),
        }));
      }
    });

    return () => {
      mounted = false;
    };
  }, [movies, index]);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const movie = movies[index];
  const nextMovie = movies[index + 1];
  const nextNextMovie = movies[index + 2];

  const handleAction = (action: SwipeAction) => {
    if (!movie) return;
    const selectedMovie = movie;

    setLastAction(action);
    feedbackOpacity.setValue(0);
    feedbackScale.setValue(0.82);
    Animated.parallel([
      Animated.spring(feedbackScale, {
        toValue: 1,
        friction: 6,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(feedbackOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => {
      Animated.timing(feedbackOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }).start(() => setLastAction(null));
    }, 520);

    if (action === "details") {
      router.push({
        pathname: "/movie/[id]",
        params: { id: selectedMovie.id },
      });
      return;
    }

    setIndex((value) => value + 1);

    void (async () => {
      try {
        if (action === "watchlist") {
          await addToWatchlist(selectedMovie);
        }
        await recordTasteAction(selectedMovie, action);
      } catch {
        // Discovery remains usable if local persistence fails.
      }
    })();
  };

  if (!movie) {
    return (
      <View style={styles.center}>
        {loadingMore || (hasMore && !error) ? (
          <>
            <ActivityIndicator color={colors.accent} size="large" />
            <Text style={styles.emptyBody}>Loading more movies…</Text>
          </>
        ) : (
          <>
            <MaterialCommunityIcons name="movie-off-outline" size={42} color={colors.muted} />
            <Text style={styles.emptyTitle}>No more movies</Text>
            <Text style={styles.emptyBody}>
              We reached the end of the available discovery queue.
            </Text>
            <Pressable style={styles.retry} onPress={() => router.replace("/(tabs)/discover")}>
              <Text style={styles.retryText}>RETRY</Text>
            </Pressable>
          </>
        )}
      </View>
    );
  }

  const feedbackConfig: Record<SwipeAction, { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; color: string }> = {
    like: { icon: "heart", label: "LIKED", color: colors.like },
    pass: { icon: "close", label: "PASSED", color: colors.pass },
    watchlist: { icon: "bookmark", label: "WATCHLIST", color: colors.watchlist },
    details: { icon: "information-outline", label: "DETAILS", color: colors.details },
  };

  const feedback = lastAction ? feedbackConfig[lastAction] : null;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#211A3A", "#151721", colors.background]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.ambientGlow} />

      <BlurView intensity={28} tint="dark" style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoMark}>
            <MaterialCommunityIcons name="movie-open-outline" size={17} color={colors.accent} />
          </View>
          <View>
            <Text style={styles.brand}>CineSwipe</Text>
            <Text style={styles.kicker}>DISCOVER SWIPE</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} accessibilityLabel="Filter tastes">
            <MaterialCommunityIcons name="tune-variant" size={19} color={colors.text} />
          </Pressable>
          <Pressable style={styles.avatar} accessibilityLabel="Profile" onPress={() => router.push("/profile")}>
            <MaterialCommunityIcons name="account-circle" size={34} color={colors.accent} />
          </Pressable>
        </View>
      </BlurView>

      <View style={styles.content}>
        <View style={styles.hudTop}>
          <MaterialCommunityIcons name="bookmark-outline" size={15} color={colors.watchlist} />
          <Text style={styles.hudText}>WATCHLIST</Text>
        </View>

        <View style={styles.hudBottom}>
          <MaterialCommunityIcons name="information-outline" size={15} color={colors.details} />
          <Text style={styles.hudText}>DETAILS</Text>
        </View>

        <View style={styles.hudLeft}>
          <MaterialCommunityIcons name="close" size={18} color={colors.pass} />
        </View>

        <View style={styles.hudRight}>
          <MaterialCommunityIcons name="heart-outline" size={18} color={colors.like} />
        </View>

        <SwipeCard movie={nextNextMovie} stackIndex={2} onAction={handleAction} />
        <SwipeCard movie={nextMovie} stackIndex={1} onAction={handleAction} />
        <SwipeCard
          movie={movie}
          onAction={handleAction}
          match={matches[movie.id] ?? movie.match}
        />

        <Text style={styles.gestureHint}>
          ← PASS   •   LIKE →
          {"\n"}↑ WATCHLIST   •   ↓ DETAILS
        </Text>

        {(loading || loadingMore) && (
          <View style={styles.status}>
            <ActivityIndicator color={colors.accent} />
            <Text style={styles.statusText}>{loading ? "Loading movies…" : "Loading more…"}</Text>
          </View>
        )}

        {error && !loading && !loadingMore && (
          <View style={styles.offline}>
            <Text style={styles.statusText}>TMDB unavailable · using local fallback</Text>
          </View>
        )}

        {feedback && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.feedback,
              {
                opacity: feedbackOpacity,
                transform: [{ scale: feedbackScale }],
                borderColor: feedback.color,
              },
            ]}
          >
            <MaterialCommunityIcons name={feedback.icon} size={58} color={feedback.color} />
            <Text style={[styles.feedbackText, { color: feedback.color }]}>{feedback.label}</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  ambientGlow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -70,
    alignSelf: "center",
    backgroundColor: "rgba(208,188,255,0.14)",
    shadowColor: colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 70,
  },
  header: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 5,
    borderBottomColor: "rgba(255,255,255,.05)",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  brandGroup: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoMark: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(208,188,255,.12)",
  },
  brand: { color: colors.text, fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  kicker: { color: colors.accent, fontSize: 10, fontWeight: "800", letterSpacing: 0.5, marginTop: 1 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 4 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: colors.surfaceGlass,
  },
  avatar: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 36,
  },
  hudTop: {
    position: "absolute",
    top: 8,
    backgroundColor: "rgba(12,14,20,.68)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 5,
    opacity: 0.5,
  },
  hudBottom: {
    position: "absolute",
    bottom: 7,
    backgroundColor: "rgba(12,14,20,.68)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    flexDirection: "row",
    gap: 5,
    opacity: 0.5,
  },
  hudLeft: {
    position: "absolute",
    left: 8,
    top: "48%",
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(12,14,20,.48)",
    opacity: 0.5,
  },
  hudRight: {
    position: "absolute",
    right: 8,
    top: "48%",
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(12,14,20,.48)",
    opacity: 0.5,
  },
  hudText: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 0.6 },
  gestureHint: {
    position: "absolute",
    bottom: 27,
    color: colors.muted,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 15,
    letterSpacing: 0.2,
  },
  feedback: {
    position: "absolute",
    top: "38%",
    width: 132,
    height: 132,
    borderRadius: 66,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(8,10,16,0.96)",
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 30,
    elevation: 18,
    zIndex: 50,
  },
  feedbackText: { fontSize: 11, fontWeight: "900", letterSpacing: 1.4 },
  status: { position: "absolute", top: 68, alignItems: "center", gap: 6 },
  statusText: { color: colors.secondary, fontSize: 11 },
  offline: {
    position: "absolute",
    top: 68,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(12,14,20,.75)",
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 28,
  },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "900", marginTop: 14 },
  emptyBody: { color: colors.secondary, fontSize: 13, marginTop: 6, textAlign: "center" },
  retry: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
  },
  retryText: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
});
