import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { SwipeCard, type SwipeAction } from "../components/SwipeCard";
import { mockMovies, type Movie } from "../data/mockMovies";
import { fetchDiscoverMovies } from "../services/tmdb";
import { colors } from "../theme";
import { useRouter } from "expo-router";
import { addToWatchlist } from "../services/library";
import { getMovieMatch, recordTasteAction } from "../services/taste";

export function DiscoverScreen() {
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>(mockMovies);
  const [index, setIndex] = useState(0);
  const [lastAction, setLastAction] = useState<SwipeAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [matches, setMatches] = useState<Record<string, number>>({});
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchDiscoverMovies()
      .then((items) => { if (mounted && items.length) setMovies(items); })
      .catch(() => { if (mounted) setError(true); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const movie = movies[index % movies.length];
  const nextMovie = movies[(index + 1) % movies.length];
  const nextNextMovie = movies[(index + 2) % movies.length];

  const handleAction = async (action: SwipeAction) => {
    setLastAction(action);
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setLastAction(null), 650);

    if (action === "details") {
      router.push(`/movie/${movie.id}`);
      return;
    }

    if (action === "watchlist") {
      await addToWatchlist(movie);
    }

    await recordTasteAction(movie, action);
    setIndex((value) => value + 1);
  };

  const feedback =
    lastAction === "like"
      ? "LIKE"
      : lastAction === "pass"
        ? "PASS"
        : lastAction === "watchlist"
          ? "WATCHLIST"
          : lastAction === "details"
            ? "DETAILS"
            : null;

  return (
    <View style={styles.root}>
      <LinearGradient colors={["#211A3A", "#151721", colors.background]} style={StyleSheet.absoluteFillObject} />
      <View style={styles.ambientGlow} />

      <BlurView intensity={28} tint="dark" style={styles.header}>
        <View style={styles.brandGroup}>
          <View style={styles.logoMark}><MaterialCommunityIcons name="movie-open-outline" size={17} color={colors.accent} /></View>
          <View><Text style={styles.brand}>CineSwipe</Text><Text style={styles.kicker}>DISCOVER SWIPE</Text></View>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} accessibilityLabel="Filter tastes"><MaterialCommunityIcons name="tune-variant" size={19} color={colors.text} /></Pressable>
          <Pressable style={styles.avatar} accessibilityLabel="Profile"><MaterialCommunityIcons name="account-circle" size={52} color={colors.accent} /></Pressable>
        </View>
      </BlurView>

      <View style={styles.content}>
        <View style={styles.hudTop}><MaterialCommunityIcons name="bookmark-outline" size={15} color={colors.watchlist}/><Text style={styles.hudText}>WATCHLIST</Text></View>
        <View style={styles.hudBottom}><MaterialCommunityIcons name="information-outline" size={15} color={colors.details}/><Text style={styles.hudText}>DETAILS</Text></View>
        <View style={styles.hudLeft}><MaterialCommunityIcons name="close" size={18} color={colors.pass}/></View>
        <View style={styles.hudRight}><MaterialCommunityIcons name="heart-outline" size={18} color={colors.like}/></View>

        <SwipeCard movie={nextNextMovie} stackIndex={2} onAction={handleAction} />
        <SwipeCard movie={nextMovie} stackIndex={1} onAction={handleAction} />
        <SwipeCard movie={movie} onAction={handleAction} match={matches[movie.id]} />

        <Text style={styles.gestureHint}>← PASS   •   LIKE →{"\n"}↑ WATCHLIST   •   ↓ DETAILS</Text>

        {loading && <View style={styles.status}><ActivityIndicator color={colors.accent}/><Text style={styles.statusText}>Loading movies…</Text></View>}
        {error && !loading && <View style={styles.offline}><Text style={styles.statusText}>TMDB unavailable · using local fallback</Text></View>}
        {feedback && (
          <View style={[
            styles.feedback,
            feedback === "LIKE" ? styles.likeFeedback : undefined,
            feedback === "PASS" ? styles.passFeedback : undefined,
          ]}>
            <MaterialCommunityIcons
              name={feedback === "LIKE" ? "heart" : feedback === "PASS" ? "close" : feedback === "WATCHLIST" ? "bookmark" : "information-outline"}
              size={34}
              color={feedback === "LIKE" ? colors.like : feedback === "PASS" ? colors.pass : feedback === "WATCHLIST" ? colors.watchlist : colors.details}
            />
            <Text style={styles.feedbackText}>{feedback}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{flex:1,backgroundColor:colors.background},
  ambientGlow:{position:"absolute",width:300,height:300,borderRadius:150,top:-70,alignSelf:"center",backgroundColor:"rgba(208,188,255,0.14)",shadowColor:colors.accent,shadowOpacity:.3,shadowRadius:70},
  header:{height:56,paddingHorizontal:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between",zIndex:5,borderBottomColor:"rgba(255,255,255,.05)",borderBottomWidth:StyleSheet.hairlineWidth},
  brandGroup:{flexDirection:"row",alignItems:"center",gap:8},logoMark:{width:32,height:32,borderRadius:10,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(208,188,255,.12)"},
  brand:{color:colors.text,fontSize:20,fontWeight:"800",letterSpacing:-.5},kicker:{color:colors.accent,fontSize:10,fontWeight:"800",letterSpacing:.5,marginTop:1},
  headerActions:{flexDirection:"row",alignItems:"center",gap:4},iconButton:{width:44,height:44,alignItems:"center",justifyContent:"center",borderRadius:999,backgroundColor:colors.surfaceGlass},avatar:{width:44,height:44,alignItems:"center",justifyContent:"center"},
  content:{flex:1,alignItems:"center",justifyContent:"center",paddingBottom:52},
  hudTop:{position:"absolute",top:8,backgroundColor:"rgba(12,14,20,.68)",borderRadius:999,paddingHorizontal:12,paddingVertical:5,flexDirection:"row",gap:5,opacity:.55},
  hudBottom:{position:"absolute",bottom:8,backgroundColor:"rgba(12,14,20,.68)",borderRadius:999,paddingHorizontal:12,paddingVertical:5,flexDirection:"row",gap:5,opacity:.55},
  hudLeft:{position:"absolute",left:8,top:"48%",width:38,height:38,borderRadius:999,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(12,14,20,.48)",opacity:.55},
  hudRight:{position:"absolute",right:8,top:"48%",width:38,height:38,borderRadius:999,alignItems:"center",justifyContent:"center",backgroundColor:"rgba(12,14,20,.48)",opacity:.55},
  hudText:{color:colors.secondary,fontSize:9,fontWeight:"800",letterSpacing:.6},
  gestureHint:{position:"absolute",bottom:12,color:colors.muted,fontSize:10,fontWeight:"700",textAlign:"center",lineHeight:16,letterSpacing:.2},
  feedback:{position:"absolute",top:"39%",width:132,height:132,borderRadius:66,alignItems:"center",justifyContent:"center",gap:5,backgroundColor:"rgba(8,10,16,.97)",borderWidth:2,borderColor:"rgba(255,255,255,.16)",shadowColor:"#000",shadowOpacity:.55,shadowRadius:30,elevation:18,zIndex:50},
  likeFeedback:{borderColor:"rgba(255,122,158,.35)"},
  passFeedback:{borderColor:"rgba(255,107,117,.35)"},
  feedbackText:{color:colors.text,fontSize:12,fontWeight:"900",letterSpacing:1.5},
  status:{position:"absolute",top:72,alignItems:"center",gap:6},statusText:{color:colors.secondary,fontSize:11},
  offline:{position:"absolute",top:72,paddingHorizontal:12,paddingVertical:6,borderRadius:999,backgroundColor:"rgba(12,14,20,.75)"}
});
