import axios from "axios";
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

/* =====================
   CONFIG API
===================== */
const API_URL = "http://10.0.2.2:8080/api";

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

type Feature = {
  id: number;
  icon: string;
  title: string;
  description: string;
};

type Benefit = {
  id: number;
  title: string;
  description: string;
  color: string;
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
   ĐẶC ĐIỂM NỔI BẬT
===================== */
const features: Feature[] = [
  {
    id: 1,
    icon: "🌿",
    title: "100% Tự nhiên",
    description: "Chiết xuất từ thiên nhiên, an toàn cho mọi loại da",
  },
  {
    id: 2,
    icon: "🧪",
    title: "Đã kiểm nghiệm",
    description: "Được chứng nhận bởi các tổ chức uy tín quốc tế",
  },
  {
    id: 3,
    icon: "🐰",
    title: "Không test động vật",
    description: "Cam kết không thử nghiệm trên động vật",
  },
  {
    id: 4,
    icon: "♻️",
    title: "Thân thiện môi trường",
    description: "Bao bì có thể tái chế, bảo vệ hành tinh xanh",
  },
];

/* =====================
   LỢI ÍCH KHÁCH HÀNG
===================== */
const benefits: Benefit[] = [
  {
    id: 1,
    title: "Miễn phí vận chuyển",
    description: "Cho đơn hàng từ 300.000đ",
    color: "#FF1493",
  },
  {
    id: 2,
    title: "Đổi trả trong 30 ngày",
    description: "Hoàn tiền 100% nếu không hài lòng",
    color: "#FF69B4",
  },
  {
    id: 3,
    title: "Tích điểm thưởng",
    description: "Nhận ưu đãi mỗi lần mua hàng",
    color: "#FFB6C1",
  },
  {
    id: 4,
    title: "Tư vấn miễn phí",
    description: "Chuyên gia da liễu hỗ trợ 24/7",
    color: "#FF1493",
  },
];

/* =====================
   MAP IMAGE LOCAL
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
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/products/featured`);

      console.log("📦 DATA:", res.data); // debug

      setFeaturedProducts(res.data);
      setSaleProducts(res.data.slice(0, 5));
    } catch (error) {
      console.log("❌ Lỗi load sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ===== BANNER ===== */}
      <View style={styles.bannerWrapper}>
        <BannerSlider />
      </View>

      {/* ===== HERO ===== */}
      <View style={styles.hero}>
        <Text style={styles.title}>🌸 Cindy Cosmetics</Text>
        <Text style={styles.subtitle}>Nâng niu vẻ đẹp tự nhiên của bạn</Text>
        <Text style={styles.heroDescription}>
          Khám phá bộ sưu tập mỹ phẩm thiên nhiên cao cấp, an toàn và hiệu quả
          cho làn da Việt
        </Text>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/(tabs)/products")}
        >
          <Text style={styles.buttonText}>Khám phá ngay</Text>
        </TouchableOpacity>
      </View>

      {/* ===== GIỚI THIỆU THƯƠNG HIỆU ===== */}
      <View style={styles.brandIntro}>
        <Text style={styles.brandTitle}>Về Cindy Cosmetics</Text>
        <Text style={styles.brandText}>
          Natural Cosmetics là thương hiệu mỹ phẩm thuần chay hàng đầu Việt
          Nam, chuyên cung cấp các sản phẩm chăm sóc da và làm đẹp từ thiên
          nhiên. Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến những
          sản phẩm chất lượng cao, an toàn và thân thiện với môi trường.
        </Text>
        <View style={styles.statsContainer}>
          
        </View>
      </View>

      {/* ===== ĐẶC ĐIỂM NỔI BẬT ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Đặc điểm nổi bật</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature) => (
            <View key={feature.id} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>
                {feature.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ===== DANH MỤC NỔI BẬT ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⭐ Danh mục nổi bật</Text>
        <Text style={styles.sectionSubtitle}>
          Khám phá các dòng sản phẩm chăm sóc toàn diện
        </Text>

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
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/products",
              params: { type: "featured" },
            })
          }
        >
          <Text style={styles.sectionTitle}>🔥 Sản phẩm nổi bật</Text>
          <Text style={styles.sectionSubtitle}>
            Được yêu thích nhất bởi khách hàng
          </Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="large" color="#FF1493" />}

        {!loading && (
          <FlatList
            data={featuredProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/products",
                    params: { type: "featured" },
                  })
                }
              >
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
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* ===== SALE ===== */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(tabs)/products",
              params: { type: "sale" },
            })
          }
        >
          <Text style={styles.sectionTitle}>💥 Ưu đãi đặc biệt</Text>
          <Text style={styles.sectionSubtitle}>
            Giảm giá lên đến 30% - Số lượng có hạn
          </Text>
        </TouchableOpacity>

        {!loading && (
          <FlatList
            data={saleProducts}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `sale-${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.saleCard}
                onPress={() =>
                  router.push({
                    pathname: "/(tabs)/products",
                    params: { type: "sale" },
                  })
                }
              >
                <View style={styles.imageBox}>
                  <Image
                    source={getLocalImage(item.image)}
                    style={styles.image}
                  />
                  <View style={styles.saleBadge}>
                    <Text style={styles.saleText}>-20%</Text>
                  </View>
                </View>

                <Text style={styles.name} numberOfLines={2}>
                  {item.name}
                </Text>

                <Text style={styles.oldPrice}>
                  {(item.price * 1.2).toLocaleString()} ₫
                </Text>

                <Text style={styles.price}>
                  {item.price.toLocaleString()} ₫
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* ===== LỢI ÍCH KHÁCH HÀNG ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎁 Quyền lợi của bạn</Text>
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit) => (
            <View
              key={benefit.id}
              style={[styles.benefitCard, { borderColor: benefit.color }]}
            >
              <Text style={[styles.benefitTitle, { color: benefit.color }]}>
                {benefit.title}
              </Text>
              <Text style={styles.benefitDescription}>
                {benefit.description}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* ===== ĐÁNH GIÁ KHÁCH HÀNG ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💬 Khách hàng nói gì về chúng tôi</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.reviewText}>
              "Sản phẩm rất tốt, làn da mình cải thiện rõ rệt sau 2 tuần sử
              dụng. Sẽ ủng hộ lâu dài!"
            </Text>
            <Text style={styles.reviewAuthor}>- Thu Hà, Hà Nội</Text>
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.reviewText}>
              "Mình tin tưởng Natural Cosmetics vì sản phẩm thiên nhiên, an
              toàn cho da nhạy cảm."
            </Text>
            <Text style={styles.reviewAuthor}>- Minh Anh, TP.HCM</Text>
          </View>

          <View style={styles.reviewCard}>
            <Text style={styles.reviewStars}>⭐⭐⭐⭐⭐</Text>
            <Text style={styles.reviewText}>
              "Dịch vụ giao hàng nhanh, đóng gói cẩn thận. Sản phẩm chất lượng
              tuyệt vời!"
            </Text>
            <Text style={styles.reviewAuthor}>- Phương Linh, Đà Nẵng</Text>
          </View>
        </ScrollView>
      </View>

      {/* ===== NEWSLETTER ===== */}
      <View style={styles.newsletter}>
        <Text style={styles.newsletterTitle}>
          💌 Đăng ký nhận ưu đãi đặc biệt
        </Text>
        <Text style={styles.newsletterText}>
          Nhận ngay mã giảm 15% cho đơn hàng đầu tiên và cập nhật những sản
          phẩm mới nhất
        </Text>
        <TouchableOpacity style={styles.newsletterButton}>
          <Text style={styles.buttonText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>

      {/* ===== FOOTER ===== */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Natural Cosmetics</Text>
        <Text style={styles.footerText}>
          🏢 Địa chỉ: 123 Nguyễn Huệ, Q.1, TP.HCM
        </Text>
        <Text style={styles.footerText}>📞 Hotline: 1900 1234</Text>
        <Text style={styles.footerText}>📧 Email: hello@naturalcosmetics.vn</Text>
        <Text style={styles.footerText}>⏰ Giờ làm việc: 8:00 - 22:00 hàng ngày</Text>
        <View style={styles.socialContainer}>
          <Text style={styles.socialText}>Kết nối với chúng tôi:</Text>
          <Text style={styles.socialIcons}>📘 📷 🐦</Text>
        </View>
        <Text style={styles.copyright}>© 2025 Natural Cosmetics. All rights reserved.</Text>
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
  
  // Hero section
  hero: { padding: 55, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#FF1493", textAlign: "center" },
  subtitle: { color: "#FFB6C1", marginTop: 8, fontSize: 16, textAlign: "center" },
  heroDescription: {
    color: "#ccc",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  mainButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 14,
    paddingHorizontal: 45,
    borderRadius: 30,
    marginTop: 20,
    elevation: 5,
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Brand intro
  brandIntro: {
    backgroundColor: "#2a002a",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF1493",
    marginBottom: 12,
    textAlign: "center",
  },
  brandText: {
    color: "#ddd",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#FF1493" },
  statLabel: { color: "#FFB6C1", marginTop: 4, fontSize: 12 },

  // Section
  section: { padding: 16 },
  sectionTitle: {
    color: "#FF69B4",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  sectionSubtitle: {
    color: "#aaa",
    fontSize: 14,
    marginBottom: 16,
  },

  // Features
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  featureIcon: { fontSize: 36, marginBottom: 8 },
  featureTitle: {
    color: "#FF69B4",
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    color: "#ccc",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },

  // Categories
  categoryCard: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#2a002a",
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  categoryText: { color: "#FFB6C1", fontWeight: "600", fontSize: 15 },

  // Products
  card: {
    width: 140,
    backgroundColor: "#2a002a",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  saleCard: {
    width: 140,
    backgroundColor: "#3a002a",
    borderRadius: 14,
    padding: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FF1493",
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
  saleBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#FF1493",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  saleText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  name: { color: "#fff", fontSize: 14, marginBottom: 4 },
  price: { color: "#FF1493", fontWeight: "bold", fontSize: 15 },
  oldPrice: {
    color: "#888",
    fontSize: 12,
    textDecorationLine: "line-through",
    marginBottom: 2,
  },

  // Benefits
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  benefitCard: {
    width: "48%",
    backgroundColor: "#2a002a",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
  },
  benefitTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 14,
  },
  benefitDescription: {
    color: "#ccc",
    fontSize: 12,
    lineHeight: 18,
  },

  // Reviews
  reviewCard: {
    width: 280,
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  reviewStars: { fontSize: 18, marginBottom: 8 },
  reviewText: {
    color: "#ddd",
    lineHeight: 20,
    marginBottom: 12,
    fontStyle: "italic",
  },
  reviewAuthor: { color: "#FF69B4", fontWeight: "600" },

  // Newsletter
  newsletter: {
    backgroundColor: "#2a002a",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FF1493",
  },
  newsletterTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF1493",
    marginBottom: 12,
    textAlign: "center",
  },
  newsletterText: {
    color: "#ddd",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  newsletterButton: {
    backgroundColor: "#FF1493",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },

  // Footer
  footer: { alignItems: "center", padding: 24, backgroundColor: "#0d000d" },
  footerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF1493",
    marginBottom: 16,
  },
  footerText: { color: "#aaa", fontSize: 14, marginBottom: 8 },
  socialContainer: { alignItems: "center", marginTop: 16, marginBottom: 12 },
  socialText: { color: "#FFB6C1", marginBottom: 8 },
  socialIcons: { fontSize: 24 },
  copyright: { color: "#666", fontSize: 12, marginTop: 16 },
});