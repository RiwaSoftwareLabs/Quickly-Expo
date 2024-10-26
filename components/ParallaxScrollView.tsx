import type { PropsWithChildren } from "react";
import { View, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import { ThemedView } from "@/components/ThemedView";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const HEADER_HEIGHT = 280;

interface Banner {
  id: string;
  image: {
    responsiveImage: {
      src: string;
      alt?: string;
      width: number;
      height: number;
      sizes: string;
      base64: string;
    };
  };
  productId: string;
  subHeading: string;
  title: string;
}

type Props = PropsWithChildren<{
  banners: Banner[];
  onPress: (id: string) => void;
}>;

export default function ParallaxScrollView({
  children,
  banners,
  onPress,
}: Props) {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { getColor } = useThemeColor();

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75],
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1],
          ),
        },
      ],
    };
  });

  const handleBannerChange = (index: number) => {
    setCurrentBanner(index);
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Animated.View
            style={[
              {
                width: "100%",
                height: HEADER_HEIGHT,
                paddingTop: 20,
              },
              headerAnimatedStyle,
            ]}
          >
            {banners?.length > 0 && (
              <PagerView
                style={{ flex: 1, borderRadius: 30 }}
                initialPage={0}
                onPageSelected={(event) =>
                  handleBannerChange(event.nativeEvent.position)
                }
              >
                {banners.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Pressable
                      onPress={() => onPress(item.productId)}
                      style={{ padding: 4 }}
                    >
                      <Image
                        source={{ uri: item.image.responsiveImage.src }}
                        style={{
                          width: item.image.responsiveImage.width * 0.9,
                          height: item.image.responsiveImage.height * 0.9,
                          borderRadius: 16,
                        }}
                        placeholder={{ blurhash }}
                        contentFit="contain"
                        transition={500}
                      />
                    </Pressable>
                  </View>
                ))}
              </PagerView>
            )}
            {banners?.length > 1 && (
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {banners.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      height: 8,
                      width: currentBanner === index ? 16 : 8,
                      backgroundColor:
                        currentBanner === index
                          ? "#fff"
                          : "rgba(255, 255, 255, 0.5)",
                      borderRadius: 4,
                      marginHorizontal: 4,
                    }}
                  />
                ))}
              </View>
            )}
          </Animated.View>
          <ThemedView style={{ flex: 1, padding: 16 }}>{children}</ThemedView>
        </Animated.ScrollView>
      </GestureHandlerRootView>
    </ThemedView>
  );
}
