import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getWatchlist, removeFromWatchlist } from "../../src/services/library";
import type { Movie } from "../../src/data/mockMovies";
import { colors } from "../../src/theme";

export default function Library() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setMovies(await getWatchlist());
    setLoading(false);
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
  }, [load]));

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accent} />
        <Text style={styles.muted}>Loading your library…</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>YOUR CINEMA</Text>
          <Text style={styles.title}>Watchlist</Text>
        </View>
        <View style={styles.count}>
          <Text style={styles.countText}>{movies.length}</Text>
        </View>
      </View>

      {movies.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons name="bookmark-multiple-outline" size={32} color={colors.watchlist} />
          </View>
          <Text style={styles.emptyTitle}>Your watchlist is empty</Text>
          <Text style={styles.muted}>Swipe ↑ on movies you want to watch later.</Text>
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
              {item.poster ? (
                <Image source={{ uri: item.poster }} style={styles.poster} resizeMode="cover" />
              ) : (
                <View style={[styles.poster, styles.posterFallback]}>
                  <MaterialCommunityIcons name="movie-open-outline" size={28} color={colors.muted} />
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
                <Text style={styles.meta}>{item.year} • {item.rating.toFixed(1)}</Text>
                <Pressable
                  style={styles.remove}
                  onPress={() => {
                    void removeFromWatchlist(item.id).then(load);
                  }}
                  accessibilityLabel={`Remove ${item.title} from watchlist`}
                >
                  <MaterialCommunityIcons name="bookmark-remove-outline" size={16} color={colors.secondary} />
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
  center: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", gap: 10 },
  muted: { color: colors.secondary, fontSize: 13 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  kicker: { color: colors.accent, fontSize: 9, fontWeight: "900", letterSpacing: 1.5 },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", marginTop: 3 },
  count: { width: 42, height: 42, borderRadius: 21, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,185,95,0.10)", borderWidth: 1, borderColor: "rgba(255,185,95,0.20)" },
  countText: { color: colors.watchlist, fontSize: 15, fontWeight: "900" },
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
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,185,95,0.08)", marginBottom: 18 },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: "900" },
});
