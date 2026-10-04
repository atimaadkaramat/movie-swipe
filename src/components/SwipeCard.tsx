import { useRef } from "react";
import { Animated, Dimensions, PanResponder, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "../theme";
import type { Movie } from "../data/mockMovies";

export type SwipeAction = "pass" | "like" | "watchlist" | "details";
const { width, height } = Dimensions.get("window");
const X_THRESHOLD = width * 0.28;
const Y_THRESHOLD = height * 0.18;

export function SwipeCard({ movie, onAction, stackIndex = 0 }: { movie: Movie; onAction: (action: SwipeAction) => void; stackIndex?: number }) {
  const position = useRef(new Animated.ValueXY()).current;
  const actionFor = (x: number, y: number): SwipeAction => Math.abs(x) >= Math.abs(y) ? (x > 0 ? "like" : "pass") : y < 0 ? "watchlist" : "details";
  const panResponder = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
    onPanResponderMove: (_, g) => position.setValue({ x: g.dx, y: g.dy }),
    onPanResponderRelease: (_, g) => {
      const action = actionFor(g.dx, g.dy);
      const committed = (action === "like" || action === "pass") ? Math.abs(g.dx) > X_THRESHOLD : Math.abs(g.dy) > Y_THRESHOLD;
      if (!committed) {
        Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 7, tension: 70, useNativeDriver: true }).start();
        return;
      }
      const x = action === "like" ? width * 1.35 : action === "pass" ? -width * 1.35 : g.dx * 0.8;
      const y = action === "watchlist" ? -height * 1.05 : action === "details" ? height * 1.05 : g.dy;
      Animated.timing(position, { toValue: { x, y }, duration: 220, useNativeDriver: true }).start(({ finished }) => {
        if (finished) { position.setValue({ x: 0, y: 0 }); onAction(action); }
      });
    },
  })).current;
  const rotate = position.x.interpolate({ inputRange: [-width, 0, width], outputRange: ["-10deg", "0deg", "10deg"], extrapolate: "clamp" });
  const h = position.x.interpolate({ inputRange: [-X_THRESHOLD, 0, X_THRESHOLD], outputRange: [1, 0, 1], extrapolate: "clamp" });
  const v = position.y.interpolate({ inputRange: [-Y_THRESHOLD, 0, Y_THRESHOLD], outputRange: [1, 0, 1], extrapolate: "clamp" });
  return <Animated.View {...(stackIndex === 0 ? panResponder.panHandlers : {})} style={[styles.card, { opacity: stackIndex ? 0.62 : 1, transform: stackIndex ? [{ scale: 1 - stackIndex * 0.035 }, { translateY: stackIndex * 10 }] : [{ translateX: position.x }, { translateY: position.y }, { rotate }] }]}>
    <View style={styles.poster}>
      <View style={styles.fallback}><MaterialCommunityIcons name="movie-open-outline" size={54} color={colors.accent}/><Text style={styles.posterText}>TMDB POSTER</Text></View>
      <View style={styles.scrim}/>
      <Animated.View style={[styles.badge, styles.like, {opacity:h}]}><MaterialCommunityIcons name="heart" size={18} color={colors.like}/><Text style={[styles.action,{color:colors.like}]}>LIKE</Text></Animated.View>
      <Animated.View style={[styles.badge, styles.pass, {opacity:h}]}><MaterialCommunityIcons name="close" size={18} color={colors.pass}/><Text style={[styles.action,{color:colors.pass}]}>PASS</Text></Animated.View>
      <Animated.View style={[styles.badge, styles.watch, {opacity:v}]}><MaterialCommunityIcons name="bookmark" size={18} color={colors.watchlist}/><Text style={[styles.action,{color:colors.watchlist}]}>WATCHLIST</Text></Animated.View>
      <Animated.View style={[styles.badge, styles.details, {opacity:v}]}><MaterialCommunityIcons name="information-outline" size={18} color={colors.details}/><Text style={[styles.action,{color:colors.details}]}>DETAILS</Text></Animated.View>
      <View style={styles.match}><Text style={styles.matchText}>{movie.match}% MATCH</Text></View>
      <View style={styles.info}><Text style={styles.title}>{movie.title}</Text><Text style={styles.meta}>{movie.year}  •  {movie.genres.join("  •  ")}</Text><Text style={styles.rating}>★ {movie.rating.toFixed(1)}</Text></View>
    </View>
  </Animated.View>;
}
const styles=StyleSheet.create({
 card:{position:"absolute",width:"84%",height:"72%",alignSelf:"center",borderRadius:28,overflow:"hidden",backgroundColor:colors.surface,shadowColor:"#000",shadowOpacity:.55,shadowRadius:24,shadowOffset:{width:0,height:14},elevation:16},
 poster:{flex:1,backgroundColor:"#171923"},fallback:{flex:1,alignItems:"center",justifyContent:"center",gap:10},posterText:{color:colors.muted,fontSize:10,fontWeight:"800",letterSpacing:2},scrim:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(0,0,0,.26)"},
 badge:{position:"absolute",zIndex:3,flexDirection:"row",alignItems:"center",gap:6,borderRadius:999,paddingHorizontal:13,paddingVertical:8,backgroundColor:"rgba(12,14,20,.78)"},like:{right:18,top:"47%"},pass:{left:18,top:"47%"},watch:{alignSelf:"center",top:18},details:{alignSelf:"center",bottom:112},action:{fontSize:10,fontWeight:"900",letterSpacing:.8},
 match:{position:"absolute",top:18,left:18,backgroundColor:"rgba(12,14,20,.76)",borderRadius:999,paddingHorizontal:12,paddingVertical:7},matchText:{color:colors.accent,fontSize:11,fontWeight:"900",letterSpacing:.7},
 info:{position:"absolute",left:20,right:20,bottom:22},title:{color:colors.text,fontSize:30,fontWeight:"900",letterSpacing:-.6},meta:{color:colors.secondary,marginTop:6,fontSize:12},rating:{color:colors.watchlist,marginTop:10,fontWeight:"800"}
});