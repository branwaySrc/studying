// useNavigation<any> 에서 stackParamList declared type으로 바꾸기

import { useNavigation } from "@react-navigation/native";
import { EnumScreenLayer } from "@/Manager/Type/Reference/DefinedScreenRegistry";

type EliminateEmptyValue<T> = {
  [V in keyof T]: T[V] extends undefined | unknown | null ? never : T[V];
};
type NavigatingParams = {
  screen?: keyof typeof EnumScreenLayer;
  params?: EliminateEmptyValue<Record<string | number | symbol, any>>;
};

export function useScreenNavigation() {
  const navigation = useNavigation<any>();

  function _send(applicable: NavigatingParams) {
    if (!applicable.screen) {
      _showUnknownError();
    } else {
      navigation.navigate(applicable.screen, applicable.params);
    }
  }

  function open(selected: NavigatingParams) {
    switch (selected.screen) {
      case EnumScreenLayer.PreviousScreen:
        navigation.goBack();
        break;

      case EnumScreenLayer.HomeScreen:
      case EnumScreenLayer.MapPanelScreen:
      case EnumScreenLayer.DiscoverScreen:
      case EnumScreenLayer.ContentPanelScreen:
      case EnumScreenLayer.ContentHubScreen:
        _send(selected);
        break;

      default:
        _showInvalidError();
    }
  }

  return { open };
}

function _showUnknownError() {
  console.error("어느 스크린으로 갈지 정의되지 않았어요.");
}

function _showInvalidError() {
  console.error("지금 입력하신 스크린은 존재하지 않아요.");
}

// const navigation = useScreenNavigation();
// navigation.open({ screen: "ContentHubScreen", params: "" });
