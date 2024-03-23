/*
*@Expo 환경에서 Reanimated로 만든 BottomShit!
**/

import { useCallback, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { COLOR, CONFIG } from "@/manager/statics/@";
import { LinearGradient } from "expo-linear-gradient";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { NavHeightDummy } from "./NavHeightDummy";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface BottomSheet {
  headerComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const MAX_TRANSLATE_Y = -CONFIG.SCREEN_HEIGHT + 80;
const CENTER_TRANSLATE_Y = -CONFIG.SCREEN_HEIGHT * 0.6;
const MIN_TRANSLATE_Y = -CONFIG.SCREEN_HEIGHT * 0.15;

export const BottomSheet = (props: BottomSheet) => {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const swipeDirection = useSharedValue("idle");
  
  const scrollTo = useCallback((destination: number) => {
    "worklet";
    translateY.value = withTiming(destination, { duration: 350 });
  }, []);
  
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((scrollY) => {
      translateY.value = scrollY.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
      translateY.value > context.value.y
        ? (swipeDirection.value = "DOWN")
        : (swipeDirection.value = "UP");
    })

    .onEnd((scrollY) => {
      if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        context.value.y > MIN_TRANSLATE_Y
      ) {
        scrollTo(MIN_TRANSLATE_Y);
      } else if (
        swipeDirection.value === "DOWN" &&
        scrollY.translationY > 1 &&
        translateY.value > CENTER_TRANSLATE_Y
      ) {
        scrollTo(MIN_TRANSLATE_Y);
      } else if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        translateY.value > -CONFIG.SCREEN_HEIGHT * 0.5
      ) {
        scrollTo(CENTER_TRANSLATE_Y);
      } else if (
        swipeDirection.value === "DOWN" &&
        scrollY.translationY > 1 &&
        translateY.value > MAX_TRANSLATE_Y
      ) {
        scrollTo(CENTER_TRANSLATE_Y);
      } else if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        translateY.value < -CONFIG.SCREEN_HEIGHT * 0.5
      ) {
        scrollTo(MAX_TRANSLATE_Y);
      }
    });

  useEffect(() => {
    scrollTo(MIN_TRANSLATE_Y);
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.container, rBottomSheetStyle]}>
        <View style={styles.wrapper}>
          <View style={styles.draggableWrapper}>
            <View style={styles.draggableButton} />
          </View>
          <View>{props.headerComponent}</View>
          <View style={{ flex: 1, alignItems: "center", marginTop: 150 }}>
            {props.children}
          </View>
          <NavHeightDummy />
        </View>
        <LinearGradient
          colors={["#FFFFFF00", "#000000", "#000000"]}
          style={styles.shadow}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: CONFIG.SCREEN_HEIGHT,
  },
  wrapper: {
    width: CONFIG.SCREEN_WIDTH,
    height: CONFIG.SCREEN_HEIGHT,
    backgroundColor: COLOR.WHITE_100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: COLOR.WHITE_200,
    zIndex: 99,
    overflow: "hidden",
  },
  draggableWrapper: {
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: COLOR.GRAY100,
  },
  draggableButton: {
    backgroundColor: COLOR.GRAY100,
    width: CONFIG.SCREEN_WIDTH * 0.2,
    borderRadius: 10,
    height: 4,
    marginVertical: 15,
  },
  shadow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 98,
    top: -30,
  },
});
