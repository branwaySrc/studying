import React, { useMemo } from "react";
import {
  Text as DefaultText,
  TextProps as DefaultTextProps,
  useWindowDimensions,
} from "react-native";
import { DEVELOP_FONT_SIZES, DEVELOP_ENV_FONT_SCALE } from "@/constants/constants";

const PretendardFont = {
  black: "PretendardBlack",
  bold: "PretendardBold",
  regular: "PretendardRegular",
};

function useFontScaleDimensions() {
  const baseScale = DEVELOP_ENV_FONT_SCALE; //1
  const { fontScale: currentDeviceFontScale } = useWindowDimensions();
  let adjustedFontScale = currentDeviceFontScale;
  const scaleDeficiency = ((baseScale - currentDeviceFontScale) / baseScale) * 100;
  adjustedFontScale = scaleDeficiency / 100;
  let roundedAdjustedFontScale = parseFloat(adjustedFontScale.toFixed(3));
  let roundedPixelDeficiency = roundedAdjustedFontScale;
  const deficiencyXs = roundedPixelDeficiency * DEVELOP_FONT_SIZES.xs; //10
  const deficiencySm = roundedPixelDeficiency * DEVELOP_FONT_SIZES.sm; //13
  const deficiencyBase = roundedPixelDeficiency * DEVELOP_FONT_SIZES.base; //15
  const deficiencyMd = roundedPixelDeficiency * DEVELOP_FONT_SIZES.md; //18
  const deficiencyLg = roundedPixelDeficiency * DEVELOP_FONT_SIZES.lg; //21
  const deficiencyXl = roundedPixelDeficiency * DEVELOP_FONT_SIZES.xl; //26

  return [deficiencyXs, deficiencySm, deficiencyBase, deficiencyMd, deficiencyLg, deficiencyXl];
}

function GetTextScale() {
  const deficiencyScales = useFontScaleDimensions();
  const dynamicFontSize = useMemo(() => {
    //TODO
    //여기에 콘솔로그 시 매번 다른 컴포넌트들이 리렌더링 될때마다, 다시 재랜더링됨, 확인필요
    //Find the Reason!
    return {
      xs: DEVELOP_FONT_SIZES.sm + deficiencyScales[0],
      sm: DEVELOP_FONT_SIZES.sm + deficiencyScales[1],
      base: DEVELOP_FONT_SIZES.base + deficiencyScales[2],
      md: DEVELOP_FONT_SIZES.md + deficiencyScales[3],
      lg: DEVELOP_FONT_SIZES.lg + deficiencyScales[4],
      xl: DEVELOP_FONT_SIZES.xl + deficiencyScales[5],
    };
  }, []);
  return dynamicFontSize;
}

export function Text(props: TextProps) {
  const dynamicFontSize = GetTextScale();
  const { style, fontWeight, fontSize, ...otherProps } = props;
  const selectedFontWeight = fontWeight || "regular";

  const selectedFontSize = fontSize || "sm";
  return (
    <DefaultText
      numberOfLines={props.numberOfLines || 2}
      ellipsizeMode={props.ellipsizeMode || "tail"}
      style={[
        style,
        {
          fontFamily: PretendardFont[selectedFontWeight],
          fontSize: dynamicFontSize[selectedFontSize],
          textAlign: props.textAlign,
        },
      ]}
      {...otherProps}
    />
  );
}

export type TextProps = DefaultTextProps & {
  fontWeight?: keyof typeof PretendardFont;
  fontSize?: keyof typeof DEVELOP_FONT_SIZES;
  textAlign?: "auto" | "center" | "left" | "right";
  numberOfLines?: number;
  ellipsizeMode?: "tail" | "head" | "middle" | undefined;
};
