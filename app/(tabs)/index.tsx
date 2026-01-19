import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import BannerSlider from "../components/BannerSlider";


export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerWrapper}>
              <BannerSlider />
            </View>
      {/* HERO */}
      <View style={styles.hero}>
        <Text style={styles.title}>🌸 Natural Cosmetics</Text>
        <Text style={styles.subtitle}>
          Nâng niu vẻ đẹp tự nhiên của bạn
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/products")}
        >
          <Text style={styles.buttonText}>Xem sản phẩm</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORIES */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💄 Danh mục nổi bật</Text>

        <View style={styles.categoryRow}>
          <Category name="Son môi" />
          <Category name="Chăm sóc da" />
          <Category name="Trang điểm" />
          <Category name="Nước hoa" />
        </View>
      </View>

      {/* FEATURED PRODUCTS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 Sản phẩm nổi bật</Text>

        <View style={styles.productCard}>
          <Text style={styles.productName}>Son lì thiên nhiên</Text>
          <Text style={styles.productPrice}>250.000 ₫</Text>
        </View>

        <View style={styles.productCard}>
          <Text style={styles.productName}>Sữa rửa mặt thảo mộc</Text>
          <Text style={styles.productPrice}>180.000 ₫</Text>
        </View>
      </View>

      {/* COMMITMENT */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Cam kết của chúng tôi</Text>

        <Text style={styles.commit}>🌿 Thành phần thiên nhiên</Text>
        <Text style={styles.commit}>🚚 Giao hàng nhanh toàn quốc</Text>
        <Text style={styles.commit}>🔐 Mỹ phẩm chính hãng</Text>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>📞 Hotline: 1900 1234</Text>
        <Text style={styles.footerText}>© 2025 Natural Cosmetics</Text>
      </View>
    </ScrollView>
  );
}

/* COMPONENT CATEGORY */
function Category({ name }: { name: string }) {
  return (
    <View style={styles.category}>
      <Text style={styles.categoryText}>{name}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a001a",
  },
   bannerWrapper: {
    width: "100%",
    height: 200,
    overflow: "hidden",
  },

  hero: {
    padding: 45,
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FF1493",
  },

  subtitle: {
    color: "#FFB6C1",
    fontSize: 16,
    marginVertical: 10,
    textAlign: "center",
  },

  mainButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 20,
    paddingHorizontal: 45,
    borderRadius: 30,
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    color: "#FF69B4",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  category: {
    backgroundColor: "#2a002a",
    width: "48%",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
  },

  categoryText: {
    color: "#fff",
    fontWeight: "bold",
  },

  productCard: {
    backgroundColor: "#2a002a",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
  },

  productName: {
    color: "#fff",
    fontSize: 16,
  },

  productPrice: {
    color: "#FF1493",
    fontWeight: "bold",
    marginTop: 5,
  },

  commit: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 5,
  },

  footer: {
    alignItems: "center",
    padding: 20,
  },

  footerText: {
    color: "#aaa",
    fontSize: 14,
  },
});
