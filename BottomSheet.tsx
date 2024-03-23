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

interface BottomSheetProps {
  headerComponent?: React.ReactNode;
  children?: React.ReactNode;
}

const MAX_TRANSLATE_RANGE_Y = -CONFIG.SCREEN_HEIGHT + 80;
const CENTERED_POSITION_BETWEEN_RANGE_Y = -CONFIG.SCREEN_HEIGHT * 0.6;
const MIN_TRANSLATE_RANGE_Y = -CONFIG.SCREEN_HEIGHT * 0.15;

export const BottomSheet = (props: BottomSheetProps) => {
  const currentTranslateY = useSharedValue(0);
  const currentContext = useSharedValue({ y: 0 });
  const swipeDirection = useSharedValue("idle");

  const replaceSheetTo = useCallback((y: number) => {
    "worklet";
    currentTranslateY.value = withTiming(y, {
      duration: 350,
    });
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      currentContext.value = { y: currentTranslateY.value };
    })
    .onUpdate((scrollY) => {
      currentTranslateY.value = scrollY.translationY + currentContext.value.y;
      currentTranslateY.value = Math.max(
        currentTranslateY.value,
        MAX_TRANSLATE_RANGE_Y,
      );
      currentTranslateY.value > currentContext.value.y
        ? (swipeDirection.value = "DOWN")
        : (swipeDirection.value = "UP");
    })

    .onEnd((scrollY) => {
      if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        currentContext.value.y > MIN_TRANSLATE_RANGE_Y
      ) {
        replaceSheetTo(MIN_TRANSLATE_RANGE_Y);
      } else if (
        swipeDirection.value === "DOWN" &&
        scrollY.translationY > 1 &&
        currentTranslateY.value > CENTERED_POSITION_BETWEEN_RANGE_Y
      ) {
        replaceSheetTo(MIN_TRANSLATE_RANGE_Y);
      } else if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        currentTranslateY.value > -CONFIG.SCREEN_HEIGHT * 0.5
      ) {
        replaceSheetTo(CENTERED_POSITION_BETWEEN_RANGE_Y);
      } else if (
        swipeDirection.value === "DOWN" &&
        scrollY.translationY > 1 &&
        currentTranslateY.value > MAX_TRANSLATE_RANGE_Y
      ) {
        replaceSheetTo(CENTERED_POSITION_BETWEEN_RANGE_Y);
      } else if (
        swipeDirection.value === "UP" &&
        scrollY.translationY < 1 &&
        currentTranslateY.value < -CONFIG.SCREEN_HEIGHT * 0.5
      ) {
        replaceSheetTo(MAX_TRANSLATE_RANGE_Y);
      }
    });

  useEffect(() => {
    replaceSheetTo(MIN_TRANSLATE_RANGE_Y);
  }, []);

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: currentTranslateY.value }],
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
