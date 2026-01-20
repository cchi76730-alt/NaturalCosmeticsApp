import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BannerSlider from "../components/BannerSlider";
import api from "../services/api"; // ✅ DÙNG API CHUNG

/* =====================
   TYPES
===================== */
type Product = {
  id: number;
  name: string;
  price: number;
  image?: string;
};

type Category = {
  id: number;
  name: string;
};

/* =====================
   DANH MỤC NỔI BẬT
===================== */
const featuredCategories: Category[] = [
  { id: 1, name: "Chăm sóc da" },
  { id: 2, name: "Trang điểm" },
  { id: 3, name: "Chăm sóc tóc" },
  { id: 4, name: "Nước hoa" },
  { id: 5, name: "Body care" },
];

/* =====================
   MAP IMAGE LOCAL (DEMO)
===================== */
const getLocalImage = (image?: string): ImageSourcePropType => {
  switch (image) {
    case "sua-rua-mat.jpg":
      return require("../../assets/images/sua-rua-mat.jpg");
    case "chong-nang.jpg":
      return require("../../assets/images/chong-nang.jpg");
    case "son_ruby_rose.jpg":
      return require("../../assets/images/son_ruby_rose.jpg");
    case "mascara.jpg":
      return require("../../assets/images/mascara.jpg");
    case "kem-duong-am.jpg":
      return require("../../assets/images/kem-duong-am.jpg");
    case "dau-goi.jpg":
      return require("../../assets/images/dau-goi.jpg");
    case "sua-tam.jpg":
      return require("../../assets/images/sua-tam.jpg");
    case "nuoc-hoa-nu.jpg":
      return require("../../assets/images/nuoc-hoa-nu.jpg");
    case "nuoc-hoa-nam.jpg":
      return require("../../assets/images/nuoc-hoa-nam.jpg");
    default:
      return require("../../assets/images/sua-rua-mat.jpg");
  }
};

/* =====================
   HOME SCREEN
===================== */
export default function HomeScreen() {
  const router = useRouter();

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products/featured") // ✅ KHÔNG localhost
      .then((res) => {
        setFeaturedProducts(res.data);
        setSaleProducts(res.data.slice(0, 5));
      })
      .catch((err) => console.log("❌ Lỗi load sản phẩm:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== BANNER ===== */}
      <View style={styles.bannerWrapper}>
        <BannerSlider />
      </View>

      {/* ===== HERO ===== */}
      <View style={styles.hero}>
        <Text style={styles.title}>🌸 Natural Cosmetics</Text>
        <Text style={styles.subtitle}>Nâng niu vẻ đẹp tự nhiên của bạn</Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/products")}
        >
          <Text style={styles.buttonText}>Xem sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* ===== DANH MỤC NỔI BẬT ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Danh mục nổi bật</Text>

        <FlatList
          data={featuredCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/products",
                  params: {
                    categoryId: item.id,
                    categoryName: item.name,
                  },
                })
              }
            >
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ===== SẢN PHẨM NỔI BẬT ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Sản phẩm nổi bật</Text>

        {loading && <ActivityIndicator size="large" color="#FF1493" />}

        {!loading && (
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.imageBox}>
                  <Image
                    source={getLocalImage(item.image)}
                    style={styles.image}
                  />
                </View>

                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.price}>
                  {item.price.toLocaleString()} ₫
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📞 Hotline: 1900 1234</Text>
        <Text style={styles.footerText}>© 2025 Natural Cosmetics</Text>
      </View>
    </ScrollView>
  );
}

/* =====================
   STYLES
===================== */
const styles = StyleSheet.create({
  container: { backgroundColor: "#1a001a" },
  bannerWrapper: { height: 200 },
  hero: { padding: 60, alignItems: "center" },
  title: { fontSize: 26, fontWeight: "bold", color: "#FF1493" },
  subtitle: { color: "#FFB6C1", marginTop: 6 },
  mainButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 30,
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  section: { padding: 16 },
  sectionTitle: {
    color: "#FF69B4",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  categoryCard: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#2a002a",
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  categoryText: { color: "#FFB6C1", fontWeight: "600" },
  card: {
    width: 140,
    backgroundColor: "#2a002a",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
  },
  imageBox: {
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: { width: "70%", height: "70%", resizeMode: "contain" },
  name: { color: "#fff", fontSize: 14 },
  price: { color: "#FF1493", fontWeight: "bold", marginTop: 4 },
  footer: { alignItems: "center", padding: 20 },
  footerText: { color: "#aaa", fontSize: 13 },
});
