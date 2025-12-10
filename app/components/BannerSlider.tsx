import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";

const { width, height } = Dimensions.get("window");

export default function BannerSlider() {
  const banners = [
    require("../../assets/images/banner1.png"),
    require("../../assets/images/banner2.png"),
    require("../../assets/images/banner3.png"),
  ];

  return (
    <View style={styles.container}>
      <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop showPagination={false}>
        {banners.map((img, index) => (
          <Image key={index} source={img} style={styles.banner} />
        ))}
      </SwiperFlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject, // full screen background
    zIndex: -1,
  },
  banner: {
    width: width,
    height: height,
    resizeMode: "cover",
  },
});
