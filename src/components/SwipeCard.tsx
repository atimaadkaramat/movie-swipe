import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { Movie } from "../data/mockMovies";

export type SwipeAction = "pass" | "like" | "watchlist" | "details";

type Props = {
  movie: Movie;
  onAction: (action: SwipeAction) => void;
  stackIndex?: number;
  match?: number;
};

export function SwipeCard({ movie, onAction, stackIndex = 0, match }: Props) {
  const { width, height } = useWindowDimensions();
  const isActive = stackIndex === 0;
  const [imageFailed, setImageFailed] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  useEffect(() => {
    setImageFailed(false);
    position.setValue({ x: 0, y: 0 });
  }, [movie.id, position]);

  const xThreshold = width * 0.22;
  const yThreshold = height * 0.14;

  const actionFor = (x: number, y: number): SwipeAction => {
    const horizontalProgress = Math.abs(x) / xThreshold;
    const verticalProgress = Math.abs(y) / yThreshold;

    if (horizontalProgress >= verticalProgress) {
      return x >= 0 ? "like" : "pass";
    }

    return y < 0 ? "watchlist" : "details";
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        isActive && (Math.abs(gesture.dx) > 7 || Math.abs(gesture.dy) > 7),
      onPanResponderMove: (_, gesture) => {
        if (isActive) {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (!isActive) return;

        const action = actionFor(gesture.dx, gesture.dy);
        const committed =
          action === "like" || action === "pass"
            ? Math.abs(gesture.dx) >= xThreshold
            : Math.abs(gesture.dy) >= yThreshold;

        if (!committed) {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 7,
            tension: 70,
            useNativeDriver: true,
          }).start();
          return;
        }

        const destinationX =
          action === "like"
            ? width * 1.45
            : action === "pass"
              ? -width * 1.45
              : gesture.dx * 0.45;
        const destinationY =
          action === "watchlist"
            ? -height * 1.1
            : action === "details"
              ? height * 1.1
              : gesture.dy;

        Animated.timing(position, {
          toValue: { x: destinationX, y: destinationY },
          duration: 210,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            position.setValue({ x: 0, y: 0 });
            onActionRef.current(action);
          }
        });
      },
    }),
  ).current;

  const rotate = position.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-9deg", "0deg", "9deg"],
    extrapolate: "clamp",
  });

  const likeOpacity = position.x.interpolate({
    inputRange: [-xThreshold, 0, xThreshold],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });
  const passOpacity = position.x.interpolate({
    inputRange: [-xThreshold, 0, xThreshold],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const watchlistOpacity = position.y.interpolate({
    inputRange: [-yThreshold, 0, yThreshold],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const detailsOpacity = position.y.interpolate({
    inputRange: [-yThreshold, 0, yThreshold],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const stackStyle = isActive
    ? {
        opacity: 1,
        transform: [
          { translateX: position.x },
          { translateY: position.y },
          { rotate },
        ],
      }
    : {
        opacity: stackIndex === 1 ? 0.78 : 0.52,
        transform: [
          { scale: stackIndex === 1 ? 0.965 : 0.93 },
          { translateY: stackIndex === 1 ? 9 : 18 },
        ],
      };

  return (
    <Animated.View
      {...(isActive ? panResponder.panHandlers : {})}
      pointerEvents={isActive ? "auto" : "none"}
      style={[styles.card, stackStyle]}
      accessibilityLabel={isActive ? movie.title : undefined}
    >
      <View style={styles.poster}>
        {movie.poster && !imageFailed ? (
          <Image
            source={{ uri: movie.poster }}
            style={styles.posterImage}
            resizeMode="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.fallback}>
            <MaterialCommunityIcons
              name="movie-open-outline"
              size={42}
              color={colors.muted}
            />
            <Text style={styles.fallbackText}>CINESWIPE</Text>
          </View>
        )}

        <View style={styles.scrim} />

        {isActive && (
          <>
            <Animated.View style={[styles.directionBadge, styles.likeBadge, { opacity: likeOpacity }]}>
              <MaterialCommunityIcons name="heart" size={17} color={colors.like} />
              <Text style={[styles.actionText, { color: colors.like }]}>LIKE</Text>
            </Animated.View>

            <Animated.View style={[styles.directionBadge, styles.passBadge, { opacity: passOpacity }]}>
              <MaterialCommunityIcons name="close" size={18} color={colors.pass} />
              <Text style={[styles.actionText, { color: colors.pass }]}>PASS</Text>
            </Animated.View>

            <Animated.View style={[styles.directionBadge, styles.watchBadge, { opacity: watchlistOpacity }]}>
              <MaterialCommunityIcons name="bookmark" size={17} color={colors.watchlist} />
              <Text style={[styles.actionText, { color: colors.watchlist }]}>WATCHLIST</Text>
            </Animated.View>

            <Animated.View style={[styles.directionBadge, styles.detailsBadge, { opacity: detailsOpacity }]}>
              <MaterialCommunityIcons name="information-outline" size={17} color={colors.details} />
              <Text style={[styles.actionText, { color: colors.details }]}>DETAILS</Text>
            </Animated.View>

            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>{match ?? movie.match}% MATCH</Text>
            </View>

            <View style={styles.metaBar}>
              <View style={styles.metaCopy}>
                <Text numberOfLines={1} style={styles.metaText}>
                  {movie.year}  •  {movie.genres.slice(0, 3).join("  •  ")}
                </Text>
                <Text style={styles.metaSubtext}>Swipe to decide</Text>
              </View>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={14} color={colors.watchlist} />
                <Text style={styles.ratingText}>{movie.rating.toFixed(1)}</Text>
              </View>
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: "86%",
    height: "70%",
    alignSelf: "center",
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 16,
  },
  poster: {
    flex: 1,
    backgroundColor: "#171923",
  },
  posterImage: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  fallback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  fallbackText: {
    color: colors.muted,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.16)",
  },
  directionBadge: {
    position: "absolute",
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "rgba(10,12,18,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  likeBadge: { right: 16, top: "46%" },
  passBadge: { left: 16, top: "46%" },
  watchBadge: { alignSelf: "center", top: 16 },
  detailsBadge: { alignSelf: "center", bottom: 104 },
  actionText: { fontSize: 9, fontWeight: "900", letterSpacing: 0.8 },
  matchBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "rgba(10,12,18,0.82)",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(208,188,255,0.12)",
  },
  matchText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },
  metaBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: 14,
    minHeight: 58,
    borderRadius: 17,
    paddingHorizontal: 13,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(8,10,15,0.78)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  metaCopy: { flex: 1, minWidth: 0, paddingRight: 10 },
  metaText: { color: colors.text, fontSize: 11, fontWeight: "800" },
  metaSubtext: { color: colors.muted, fontSize: 9, marginTop: 3 },
  rating: { flexDirection: "row", alignItems: "center", gap: 4 },
  ratingText: { color: colors.text, fontSize: 13, fontWeight: "900" },
});
