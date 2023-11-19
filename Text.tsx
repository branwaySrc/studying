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

// baseScale은 simulator 기준으로 useWindowDimension fontScale이 1 입니다. 그래서 이것을 기준으로 했습니다.
// fontScale을 useWindowDimension으로 접속기기의 fontScale을 가져왔습니다.
// 그리고 기준이 되는 baseScale과 현재 접속 기기의 fontScale 값 차이를 구했습니다.
// 이는 baseScale기준과 현재 기기의 fontScale 배율 차이를 구하기 위함입니다.(음수일 경우, 마이너스 배율)
// 그리고 소수점이 많아서 3자리수까지만 짤랐습니다.
// DEVELOP_FONT_SIZES는 디자인에 사용된 고정 폰트 값입니다.
// 그리고 그 배율을 각각 기준폰트와 곱해서 추가해야하는 사이즈 수를 구했습니다.

function useFontScaleDimensions() {
  const baseScale = DEVELOP_ENV_FONT_SCALE; //1
  const { fontScale: currentDeviceFontScale } = useWindowDimensions();
  // const scaleDeficiency = ((baseScale - currentDeviceFontScale) / baseScale) ;
  const scaleDeficiency = parseFloat(((baseScale - currentDeviceFontScale) / baseScale).toFixed(3));
  const roundedPixelDeficiency = scaleDeficiency;
  const deficiencyXs = roundedPixelDeficiency * DEVELOP_FONT_SIZES.xs; //10
  const deficiencySm = roundedPixelDeficiency * DEVELOP_FONT_SIZES.sm; //13
  const deficiencyBase = roundedPixelDeficiency * DEVELOP_FONT_SIZES.base; //15
  const deficiencyMd = roundedPixelDeficiency * DEVELOP_FONT_SIZES.md; //18
  const deficiencyLg = roundedPixelDeficiency * DEVELOP_FONT_SIZES.lg; //21
  const deficiencyXl = roundedPixelDeficiency * DEVELOP_FONT_SIZES.xl; //26

  return [deficiencyXs, deficiencySm, deficiencyBase, deficiencyMd, deficiencyLg, deficiencyXl];
}

// 이제 그 값들을 모두 기준 폰트에 더해줬습니다 :)
// useMemo를 사용한 이유는 한 번 구해진 값을 더이상 다시 구할 필요가 없기에 사용했습니다.
// (구글링해보니 useMemo를 사용해야할거 같았습니다..!)

// 다른 예시들을 보았는데, useMemo안에 콘솔로그를 보면, 한번만 찍히고, 값이 변하지 않는 이상
// 실행되지 않는다고 했는데,, 저의 경우 다른 컴포넌트를 누를 때마다 계속 useMemo안에 있는 로그가
// 찍혀나오는 것을 발견했습니다.. 의도와 다르게 흘러갔습니다..ㅠ 

function GetDynmicText() {
  const deficiencyPixel = useFontScaleDimensions();
  const dynamicFontSize = useMemo(() => {
    //TODO
    //여기에 콘솔로그 시 매번 다른 컴포넌트들이 리렌더링 될때마다, 다시 재랜더링됨..
     return {
      xs: DEVELOP_FONT_SIZES.sm + deficiencyPixel[0],
      sm: DEVELOP_FONT_SIZES.sm + deficiencyPixel[1],
      base: DEVELOP_FONT_SIZES.base + deficiencyPixel[2],
      md: DEVELOP_FONT_SIZES.md + deficiencyPixel[3],
      lg: DEVELOP_FONT_SIZES.lg + deficiencyPixel[4],
      xl: DEVELOP_FONT_SIZES.xl + deficiencyPixel[5],
    };
  }, []);
  return dynamicFontSize;
}

// 그리고 이제 React-native Text가 아닌, 제가 커스텀한 Text를 사용하기 위해 컴포넌트로 만들었습니다.

export function Text(props: TextProps) {
  const dynamicFontSize = GetDynmicText();
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
