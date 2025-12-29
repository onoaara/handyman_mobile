import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

type SkeletonProps = {
  width: number;
  height: number;
  borderRadius?: number;
};

function Skeleton({ width, height, borderRadius = 4 }: SkeletonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startAnimation();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.icon,
          opacity,
        },
      ]}
    />
  );
}

type ServiceCardSkeletonProps = {
  count?: number;
};

export function ServiceCardSkeleton({ count = 6 }: ServiceCardSkeletonProps) {
  const scheme = useColorScheme();
  const colors = Colors[scheme ?? "light"];

  const skeletonCards = Array.from({ length: count }, (_, index) => (
    <View key={index} style={styles.skeletonCard}>
      <View style={[styles.skeletonCardContainer, { borderColor: colors.icon }]}>
        {/* Image skeleton */}
        <Skeleton width={180} height={200} borderRadius={12} />
        {/* Label skeleton */}
        <View style={styles.skeletonLabel}>
          <Skeleton width={120} height={16} borderRadius={8} />
        </View>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      {/* First row */}
      <View style={styles.row}>
        {skeletonCards.slice(0, 2)}
      </View>
      {/* Second row */}
      <View style={styles.row}>
        {skeletonCards.slice(2, 4)}
      </View>
      {/* Third row */}
      <View style={styles.row}>
        {skeletonCards.slice(4, 6)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  skeletonCard: {
    flex: 1,
  },
  skeletonCardContainer: {
    borderWidth: 1,
    borderRadius: 12,
    height: 200,
    width: 180,
    position: "relative",
  },
  skeletonLabel: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    alignItems: "center",
  },
  skeleton: {
    // Styles applied dynamically
  },
});