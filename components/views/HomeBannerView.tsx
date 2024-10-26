import React, { useState, useEffect } from "react";
import { View, Pressable, SafeAreaView } from "react-native";
import { Image } from "expo-image";
import PagerView from "react-native-pager-view";
import { ThemedView } from "@/components/ThemedView";
import { useRouter } from "expo-router";
import { loadHehroSlidersFromDatoCMS } from "@/utils/api/datocms/home";
import { useLanguage } from "@/contexts/LanguageContext";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

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

export default function HomeBannerView() {
  const { locale } = useLanguage();
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const sliders = await loadHehroSlidersFromDatoCMS(locale);
        setBanners(sliders);
        setImageLoading(false);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  const handleBannerChange = (index: number) => {
    setCurrentBanner(index);
  };

  const handlePress = (id: string) => {
    router.push(`/(home)/details?id=${id}`);
  };

  return (
    <SafeAreaView className="flex-1">
      {banners?.length > 0 && (
        <PagerView
          className="h-64"
          initialPage={0}
          onPageSelected={(event) =>
            handleBannerChange(event.nativeEvent.position)
          }
        >
          {banners.map((item, index) => (
            <ThemedView
              key={index}
              className="flex-1 justify-center items-center"
            >
              <Pressable
                onPress={() => handlePress(item.productId)}
                className="w-full h-full px-4 py-2"
              >
                {imageLoading ? (
                  <ThemedView className="w-full h-full rounded-2xl bg-gray-200 flex items-center justify-center"></ThemedView>
                ) : (
                  <Image
                    source={{ uri: item.image.responsiveImage.src }}
                    className="w-full h-full rounded-2xl"
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    transition={500}
                  />
                )}
              </Pressable>
            </ThemedView>
          ))}
        </PagerView>
      )}
      {banners?.length > 1 && (
        <View className="absolute bottom-6 w-full flex-row justify-center">
          {banners.map((_, index) => (
            <ThemedView
              key={index}
              className={`h-2 rounded-full mx-1 ${
                currentBanner === index ? "w-4 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}
