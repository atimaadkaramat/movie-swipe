import { Stack, useLocalSearchParams } from "expo-router";
import { MovieDetailsScreen } from "../../../src/screens/MovieDetailsScreen";

export default function MovieRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <MovieDetailsScreen movieId={id ?? "unknown"} />
    </>
  );
}
