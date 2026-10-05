import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getRatings, getTasteEvents, getWatchedMovies, removeTasteAction, removeWatched, type TasteAction } from "../../src/services/taste";
import type { Movie } from "../../src/data/mockMovies";
import { colors } from "../../src/theme";

type LibraryFilter = "watchlist" | "like" | "pass" | "watched" | "rated";
const FILTERS: { key: LibraryFilter; label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { key: "watchlist", label: "Saved", icon: "bookmark" },
  { key: "like", label: "Liked", icon: "heart" },
  { key: "pass", label: "Passed", icon: "close" },
  { key: "watched", label: "Watched", icon: "check-circle" },
  { key: "rated", label: "Rated", icon: "star" },
];

export default function Library() {
  const [filter, setFilter] = useState<LibraryFilter>("watchlist");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [counts, setCounts] = useState<Record<LibraryFilter, number>>({ watchlist: 0, like: 0, pass: 0, watched: 0, rated: 0 });
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [events, watched, rated] = await Promise.all([getTasteEvents(), getWatchedMovies(), getRatings()]);
      const ratingMap = Object.fromEntries(rated.map((item) => [item.movieId, item.rating]));
      setRatings(ratingMap);
      setCounts({
        watchlist: events.filter((event) => event.action === "watchlist").length,
        like: events.filter((event) => event.action === "like").length,
        pass: events.filter((event) => event.action === "pass").length,
        watched: watched.length,
        rated: rated.length,
      });
      setMovies(filter === "watched" ? watched : filter === "rated" ? rated.map((item) => item.movie) : events.filter((event) => event.action === filter).map((event) => event.movie));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useFocusEffect(useCallback(() => { void load(); }, [load]));

  const current = FILTERS.find((item) => item.key === filter)!;

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>YOUR CINEMA</Text>
          <Text style={styles.title}>{current.label}</Text>
        </View>
        <View style={styles.count}><Text style={styles.countText}>{counts[filter]}</Text></View>
      </View>

      <View style={styles.filters}>
        {FILTERS.map((item) => (
          <Pressable key={item.key} onPress={() => setFilter(item.key)} style={[styles.filter, filter === item.key && styles.filterActive]}>
            <MaterialCommunityIcons name={item.icon} size={15} color={filter === item.key ? colors.accent : colors.muted} />
            <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>{item.label}</Text>
            <Text style={styles.filterCount}>{counts[item.key]}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color={colors.accent} /><Text style={styles.muted}>Loading your library…</Text></View>
      ) : movies.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}><MaterialCommunityIcons name={current.icon} size={32} color={colors.accent} /></View>
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.muted}>
            {filter === "watchlist" ? "Swipe ↑ on movies you want to watch later." : filter === "like" ? "Swipe → on movies you want to keep." : filter === "passed" ? "Passed movies will appear here." : filter === "watched" ? "Movies you have watched will appear here." : "Movies you have rated will appear here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.item}>
              {item.poster ? <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" /> : <View style={[styles.poster, styles.posterFallback]}><MaterialCommunityIcons name="movie-open-outline" size={28} color={colors.muted} /></View>}
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.year} • {item.rating.toFixed(1)}{filter === "rated" && ratings[item.id] ? ` • ${ratings[item.id]}/10` : ""}</Text>
                <Pressable
                  style={styles.remove}
                  onPress={() => { void (filter === "watched" ? removeWatched(item.id) : removeTasteAction(item.id)).then(load); }}
                  accessibilityLabel={`Remove ${item.title} from library`}
                >
                  <MaterialCommunityIcons name="trash-can-outline" size={16} color={colors.secondary} />
                  <Text style={styles.removeText}>REMOVE</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 18, paddingTop: 22 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  muted: { color: colors.secondary, fontSize: 13, textAlign: "center" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  kicker: { color: colors.accent, fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 3 },
  count: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(208,188,255,0.10)", borderWidth: 1, borderColor: "rgba(208,188,255,0.20)" },
  countText: { color: colors.accent, fontSize: 15, fontWeight: "900" },
  filters: { flexDirection: "row", gap: 7, marginBottom: 14 },
  filter: { flex: 1, minHeight: 42, borderRadius: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 5 },
  filterActive: { borderColor: "rgba(208,188,255,.28)", backgroundColor: "rgba(208,188,255,.08)" },
  filterText: { color: colors.muted, fontSize: 9, fontWeight: "900", letterSpacing: 0.4 },
  filterTextActive: { color: colors.text },
  filterCount: { color: colors.secondary, fontSize: 9, fontWeight: "800" },
  grid: { paddingBottom: 30 },
  row: { gap: 12, marginBottom: 16 },
  item: { flex: 1, minWidth: 0 },
  poster: { width: "100%", aspectRatio: 0.67, borderRadius: 18, backgroundColor: colors.surface },
  posterFallback: { alignItems: "center", justifyContent: "center" },
  itemInfo: { paddingTop: 8 },
  movieTitle: { color: colors.text, fontSize: 14, fontWeight: "800" },
  meta: { color: colors.muted, fontSize: 11, marginTop: 3 },
  remove: { marginTop: 7, flexDirection: "row", alignItems: "center", gap: 5 },
  removeText: { color: colors.secondary, fontSize: 9, fontWeight: "800", letterSpacing: 0.8 },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 70 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(208,188,255,0.08)", marginBottom: 18 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "900" },
});
