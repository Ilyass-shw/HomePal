import React, { useEffect } from "react";
import { StatusBar, StyleSheet, useWindowDimensions, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

// Animation configuration constants
const ANIMATION_CONFIG = {
  DURATIONS: {
    MOVE_UP: 600, // Time to move rectangle up to center
    GROW: 600, // Time to grow rectangle to 1.3x scale
    SHRINK: 800, // Time to shrink rectangle to small circle
    ROTATE: 300, // Time for 360° rotation
    MOVE_RIGHT: 1000, // Time to move circle horizontally
    TEXT_APPEAR: 800, // Time for text slide-in animation
    SCREEN_COVER: 700, // Time to grow circle to cover screen
    OPACITY_FADE: 600, // Time for opacity transition
  },

  // Animation delays (in milliseconds)
  DELAYS: {
    INITIAL: 800, // Delay before grow/rotate starts
    MOVE_RIGHT: 2200, // Delay before horizontal movement
    TEXT_APPEAR: 2500, // Delay before text appears
    SCREEN_COVER: 1400, // Delay before screen coverage
    OPACITY_FADE: 400, // Delay before opacity change
  },

  // Animation values
  VALUES: {
    INITIAL_Y: 100, // Starting Y position (below center)
    FINAL_Y: 10, // Final Y position (slightly below center)
    GROW_SCALE: 1.3, // Scale when growing
    SHRINK_SCALE: 0.16, // Scale when shrinking to circle
    MOVE_RIGHT_X: 115, // Final X position after horizontal move
    TEXT_INITIAL_X: -30, // Starting X position for text (off-screen left)
  },

  // Border radius values
  BORDER_RADIUS: {
    RECTANGLE: 10, // Border radius for rectangle shape
    CIRCLE: 50, // Border radius for circle shape
  },

  // Scale thresholds for shape changes
  SCALE_THRESHOLDS: {
    SMALL: 0.5, // Below this = circle
    LARGE: 1.3, // Above this = circle
  },
} as const;

const SplashScreen: React.FC = () => {
  // Get screen dimensions for responsive scaling
  const { width, height } = useWindowDimensions();
  // Calculate scale to cover entire screen including status bar
  const maxDimension = Math.max(width, height);
  const screenScale = (maxDimension * 1.2) / 100; // 20% extra to ensure complete coverage of the entire screen including status bar

  // Shared values - must be at top level per Rules of Hooks
  const translateY = useSharedValue<number>(ANIMATION_CONFIG.VALUES.INITIAL_Y);
  const translateX = useSharedValue<number>(0);
  const scale = useSharedValue<number>(1);
  const rotate = useSharedValue<number>(0);
  const opacity = useSharedValue<number>(0.4);
  const textTranslateX = useSharedValue<number>(
    ANIMATION_CONFIG.VALUES.TEXT_INITIAL_X
  );
  const textOpacity = useSharedValue<number>(0);

  // ===== ANIMATED STYLES =====
  // Main rectangle/circle animation styles
  const animatedStyle = useAnimatedStyle(() => {
    // Determine border radius based on scale
    const isSmall = scale.value < ANIMATION_CONFIG.SCALE_THRESHOLDS.SMALL;
    const isLarge = scale.value > ANIMATION_CONFIG.SCALE_THRESHOLDS.LARGE;
    const borderRadius =
      isSmall || isLarge
        ? ANIMATION_CONFIG.BORDER_RADIUS.CIRCLE
        : ANIMATION_CONFIG.BORDER_RADIUS.RECTANGLE;

    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
      opacity: opacity.value,
      borderRadius,
    };
  });

  // Text animation styles
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: textTranslateX.value }],
      opacity: textOpacity.value,
    };
  });

  // ===== ANIMATION SETUP =====
  useEffect(() => {
    // Phase 1: Move rectangle up to center
    translateY.value = withTiming(ANIMATION_CONFIG.VALUES.FINAL_Y, {
      duration: ANIMATION_CONFIG.DURATIONS.MOVE_UP,
      easing: Easing.out(Easing.cubic),
    });

    // Phase 2: Grow, shrink, and screen coverage sequence
    scale.value = withDelay(
      ANIMATION_CONFIG.DELAYS.INITIAL,
      withSequence(
        // 2a: Grow to 1.3x scale
        withTiming(ANIMATION_CONFIG.VALUES.GROW_SCALE, {
          duration: ANIMATION_CONFIG.DURATIONS.GROW,
          easing: Easing.out(Easing.cubic),
        }),
        // 2b: Shrink to small circle
        withTiming(ANIMATION_CONFIG.VALUES.SHRINK_SCALE, {
          duration: ANIMATION_CONFIG.DURATIONS.SHRINK,
          easing: Easing.inOut(Easing.cubic),
        }),
        // 2c: Grow to cover entire screen
        withDelay(
          ANIMATION_CONFIG.DELAYS.SCREEN_COVER,
          withTiming(screenScale, {
            duration: ANIMATION_CONFIG.DURATIONS.SCREEN_COVER,
            easing: Easing.out(Easing.cubic),
          })
        )
      )
    );

    // Phase 3: 360° rotation (happens simultaneously with grow/shrink)
    rotate.value = withDelay(
      ANIMATION_CONFIG.DELAYS.INITIAL,
      withTiming(360, {
        duration: ANIMATION_CONFIG.DURATIONS.ROTATE,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Phase 4: Horizontal movement
    translateX.value = withDelay(
      ANIMATION_CONFIG.DELAYS.MOVE_RIGHT,
      withTiming(ANIMATION_CONFIG.VALUES.MOVE_RIGHT_X, {
        duration: ANIMATION_CONFIG.DURATIONS.MOVE_RIGHT,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Phase 5: Opacity fade-in
    opacity.value = withDelay(
      ANIMATION_CONFIG.DELAYS.OPACITY_FADE,
      withTiming(1, {
        duration: ANIMATION_CONFIG.DURATIONS.OPACITY_FADE,
        easing: Easing.out(Easing.quad),
      })
    );

    // Phase 6: Text appearance (slide in from left)
    textTranslateX.value = withDelay(
      ANIMATION_CONFIG.DELAYS.TEXT_APPEAR,
      withTiming(0, {
        duration: ANIMATION_CONFIG.DURATIONS.TEXT_APPEAR,
        easing: Easing.out(Easing.cubic),
      })
    );

    textOpacity.value = withDelay(
      ANIMATION_CONFIG.DELAYS.TEXT_APPEAR,
      withTiming(1, {
        duration: ANIMATION_CONFIG.DURATIONS.TEXT_APPEAR,
        easing: Easing.out(Easing.cubic),
      })
    );

    // ===== CLEANUP =====
    return () => {
      cancelAnimation(translateY);
      cancelAnimation(translateX);
      cancelAnimation(scale);
      cancelAnimation(rotate);
      cancelAnimation(opacity);
      cancelAnimation(textTranslateX);
      cancelAnimation(textOpacity);
    };
  }, []);

  // ===== RENDER =====
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A0026" />
      <Animated.View style={[styles.gradientContainer, animatedStyle]} />
      <Animated.Text style={[styles.text, animatedTextStyle]}>
        HomePal
      </Animated.Text>
    </View>
  );
};

// ===== STYLES =====
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A0026",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  text: {
    position: "absolute",
    fontSize: 50,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});

export default SplashScreen;
