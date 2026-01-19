import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const { width } = Dimensions.get("window");
const BANNER_HEIGHT = 250; // 🔥 PHẢI TRÙNG với bannerWrapper

export default function BannerSlider() {
  const banners = [
    require("../../assets/images/banner1.png"),
    require("../../assets/images/banner2.png"),
    require("../../assets/images/banner3.png"),
  ];

  return (
    <View style={styles.container}>
      <SwiperFlatList
        autoplay
        autoplayDelay={3}
        autoplayLoop
        showPagination={false}
        style={{ height: BANNER_HEIGHT }}   // ✅ QUAN TRỌNG
      >
        {banners.map((img, index) => (
          <View key={index} style={styles.slide}>
            <Image source={img} style={styles.banner} />
          </View>
        ))}
      </SwiperFlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: BANNER_HEIGHT,
  },
  slide: {
    width: width,
    height: BANNER_HEIGHT,  // ✅ ép height cho từng slide
  },
  banner: {
    width: "100%",
    height: "100%",         // ✅ phủ kín
    resizeMode: "cover",
  },
});
