import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { fetchMovieCredits, fetchMovieDetails, fetchSimilarMovies, type MovieCredit } from "../services/tmdb";
import { getMovieMatch } from "../services/taste";
import type { Movie } from "../data/mockMovies";
import { colors } from "../theme";

export function MovieDetailsScreen({ movieId }: { movieId: string }) {
  const router = useRouter();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [match, setMatch] = useState(70);
  const [credits, setCredits] = useState<MovieCredit[]>([]);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    Promise.all([
      fetchMovieDetails(movieId),
      fetchMovieCredits(movieId).catch(() => [] as MovieCredit[]),
      fetchSimilarMovies(movieId).then((result) => result.movies).catch(() => [] as Movie[]),
    ])
      .then(async ([item, movieCredits, similarMovies]) => {
        if (!mounted) return;
        setMovie(item);
        setCredits(movieCredits);
        setSimilar(similarMovies.slice(0, 12));
        const score = await getMovieMatch(item);
        if (mounted) setMatch(score);
      })
      .catch(() => {
        if (mounted) setMovie(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [movieId, retryKey]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} size="large" />
        <Text style={styles.loading}>Loading movie details…</Text>
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <MaterialCommunityIcons name="cloud-alert-outline" size={42} color={colors.muted} />
        <Text style={styles.errorTitle}>Couldn’t load this movie</Text>
        <Text style={styles.errorBody}>Check your connection and try again.</Text>
        <View style={styles.errorActions}>
          <Pressable style={styles.retry} onPress={() => setRetryKey((value) => value + 1)}>
            <Text style={styles.retryText}>TRY AGAIN</Text>
          </Pressable>
          <Pressable style={styles.secondaryAction} onPress={() => router.back()}>
            <Text style={styles.secondaryActionText}>GO BACK</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const cast = credits.filter((person) => person.department === "Acting").slice(0, 8);
  const crew = credits.filter((person) => person.department !== "Acting").slice(0, 6);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          {movie.backdrop ? <Image source={{ uri: movie.backdrop }} style={styles.backdrop} resizeMode="cover" /> : null}
          <LinearGradient colors={["rgba(8,9,13,0.04)", "rgba(8,9,13,0.30)", colors.background]} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFillObject} />
          <Pressable style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.text} />
          </Pressable>
          <View style={styles.heroContent}>
            <Text style={styles.kicker}>MOVIE DEEP DIVE</Text>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.meta}>{movie.year} • {movie.genres.join(" • ")}</Text>
          </View>
        </View>

        <View style={styles.posterRow}>
          {movie.poster ? <Image source={{ uri: movie.poster }} style={styles.poster} /> : null}
          <View style={styles.stats}>
            <View style={styles.matchCard}>
              <Text style={styles.statLabel}>YOUR TASTE MATCH</Text>
              <Text style={styles.matchValue}>{match}%</Text>
              <Text style={styles.statHint}>Based on your current taste profile</Text>
            </View>
            <View style={styles.ratingCard}>
              <Text style={styles.statLabel}>TMDB RATING</Text>
              <View style={styles.ratingRow}>
                <MaterialCommunityIcons name="star" size={16} color={colors.watchlist} />
                <Text style={styles.ratingValue}>{movie.rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About the movie</Text>
          <Text style={styles.synopsis}>{movie.synopsis || "No synopsis is available for this title."}</Text>
        </View>

        {cast.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {cast.map((person) => (
                <View key={person.id + person.name} style={styles.personCard}>
                  {person.profilePath ? <Image source={{ uri: person.profilePath }} style={styles.personImage} /> : <View style={styles.personPlaceholder}><MaterialCommunityIcons name="account" size={24} color={colors.muted} /></View>}
                  <Text style={styles.personName} numberOfLines={2}>{person.name}</Text>
                  <Text style={styles.personRole} numberOfLines={2}>{person.character || "Cast"}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {crew.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Crew</Text>
            <View style={styles.crewWrap}>
              {crew.map((person) => (
                <View key={person.id + (person.job ?? "")} style={styles.crewChip}>
                  <Text style={styles.crewName}>{person.name}</Text>
                  <Text style={styles.crewJob}>{person.job}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {similar.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Similar movies</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
              {similar.map((item) => (
                <Pressable key={item.id} style={styles.similarCard} onPress={() => router.push({ pathname: "/movie/[id]", params: { id: item.id } })}>
                  {item.poster ? <Image source={{ uri: item.poster }} style={styles.similarPoster} /> : <View style={styles.similarPoster} />}
                  <Text style={styles.similarTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.similarMeta}>{item.year} • {item.rating.toFixed(1)}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.gestureCard}>
          <MaterialCommunityIcons name="gesture-swipe" size={22} color={colors.accent} />
          <View style={styles.gestureCopy}>
            <Text style={styles.gestureTitle}>Ready to decide?</Text>
            <Text style={styles.gestureBody}>Swipe down to return to Discover and keep exploring.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", padding: 28 },
  loading: { color: colors.secondary, marginTop: 12, fontSize: 13 },
  errorTitle: { color: colors.text, fontSize: 22, fontWeight: "900", marginTop: 16 },
  errorBody: { color: colors.secondary, fontSize: 14, marginTop: 8, textAlign: "center" },
  errorActions: { flexDirection: "row", gap: 10, marginTop: 20 },
  retry: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.accent },
  secondaryAction: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  retryText: { color: colors.background, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  secondaryActionText: { color: colors.accent, fontSize: 11, fontWeight: "900", letterSpacing: 1 },
  scroll: { paddingBottom: 36 },
  hero: { height: 430, overflow: "hidden" },
  backdrop: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
  backButton: { position: "absolute", top: 54, left: 16, width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(10,11,15,0.62)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  heroContent: { position: "absolute", left: 20, right: 20, bottom: 28 },
  kicker: { color: colors.accent, fontSize: 10, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 36, lineHeight: 40, fontWeight: "900", letterSpacing: -1, marginTop: 7 },
  meta: { color: colors.secondary, fontSize: 13, marginTop: 8 },
  posterRow: { flexDirection: "row", gap: 16, paddingHorizontal: 20, marginTop: -42, zIndex: 2 },
  poster: { width: 104, height: 156, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  stats: { flex: 1, gap: 10 },
  matchCard: { flex: 1, padding: 14, borderRadius: 18, backgroundColor: "rgba(29,31,38,0.94)", borderWidth: 1, borderColor: "rgba(208,188,255,0.12)" },
  ratingCard: { padding: 12, borderRadius: 18, backgroundColor: colors.surface },
  statLabel: { color: colors.muted, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  matchValue: { color: colors.accent, fontSize: 28, fontWeight: "900", marginTop: 4 },
  statHint: { color: colors.secondary, fontSize: 10, lineHeight: 14, marginTop: 3 },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 },
  ratingValue: { color: colors.text, fontSize: 18, fontWeight: "900" },
  section: { paddingHorizontal: 20, marginTop: 28 },
  sectionTitle: { color: colors.text, fontSize: 19, fontWeight: "900" },
  synopsis: { color: colors.secondary, fontSize: 14, lineHeight: 22, marginTop: 9 },
  horizontalList: { gap: 10, paddingTop: 12, paddingRight: 20 },
  personCard: { width: 92 },
  personImage: { width: 92, height: 120, borderRadius: 14, backgroundColor: colors.surface },
  personPlaceholder: { width: 92, height: 120, borderRadius: 14, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center" },
  personName: { color: colors.text, fontSize: 11, fontWeight: "800", marginTop: 7 },
  personRole: { color: colors.muted, fontSize: 9, lineHeight: 13, marginTop: 2 },
  crewWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  crewChip: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  crewName: { color: colors.text, fontSize: 10, fontWeight: "800" },
  crewJob: { color: colors.muted, fontSize: 9, marginTop: 2 },
  similarCard: { width: 104 },
  similarPoster: { width: 104, height: 150, borderRadius: 14, backgroundColor: colors.surface },
  similarTitle: { color: colors.text, fontSize: 11, fontWeight: "800", marginTop: 7 },
  similarMeta: { color: colors.muted, fontSize: 9, marginTop: 2 },
  gestureCard: { marginHorizontal: 20, marginTop: 28, padding: 16, borderRadius: 20, flexDirection: "row", gap: 12, alignItems: "center", backgroundColor: "rgba(208,188,255,0.07)", borderWidth: 1, borderColor: "rgba(208,188,255,0.12)" },
  gestureCopy: { flex: 1 },
  gestureTitle: { color: colors.text, fontSize: 14, fontWeight: "900" },
  gestureBody: { color: colors.secondary, fontSize: 12, lineHeight: 17, marginTop: 3 },
});
