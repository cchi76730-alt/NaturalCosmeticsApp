import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useCart } from "./components/context/CartContext";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProductById, Product } from "./services/product.service";

const { width } = Dimensions.get("window");

/* ✅ GIỐNG ProductCard */
const getLocalImage = (image?: string) => {
  switch (image) {
    case "sua-rua-mat.jpg":
      return require("../assets/images/sua-rua-mat.jpg");
    case "chong-nang.jpg":
      return require("../assets/images/chong-nang.jpg");
    case "son_ruby_rose.jpg":
      return require("../assets/images/son_ruby_rose.jpg");
    case "mascara.jpg":
      return require("../assets/images/mascara.jpg");
    case "kem-duong-am.jpg":
      return require("../assets/images/kem-duong-am.jpg");
    case "dau-goi.jpg":
      return require("../assets/images/dau-goi.jpg");
    case "sua-tam.jpg":
      return require("../assets/images/sua-tam.jpg");
    case "nuoc-hoa-nu.jpg":
      return require("../assets/images/nuoc-hoa-nu.jpg");
    case "nuoc-hoa-nam.jpg":
      return require("../assets/images/nuoc-hoa-nam.jpg");
    default:
      return require("../assets/images/sua-rua-mat.jpg");
  }
};

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, clearCart } = useCart();
const { items } = useCart();


  useEffect(() => {
    if (!id) return;

    getProductById(Number(id))
      .then(setProduct)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
  if (!product) return;

  for (let i = 0; i < quantity; i++) {
    addToCart(product);
  }

  Alert.alert(
    "Thành công",
    `Đã thêm ${quantity} sản phẩm vào giỏ hàng 🛒`
  );
};


 const handleBuyNow = () => {
  if (!product) return;

  // Clear giỏ để tránh lẫn đơn cũ
  clearCart();

  // Thêm đúng số lượng
  for (let i = 0; i < quantity; i++) {
    addToCart(product);
  }

  // Điều hướng sang Checkout
  router.push("/CheckoutScreen");
};


  const increaseQuantity = () => {
    if (quantity < (product?.stock ?? 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const totalItems = items.reduce(
  (sum, item) => sum + item.quantity,
  0
);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF1493" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
  style={styles.cartIconWrapper}
  onPress={() => router.push("/cart")}
>
  <Ionicons name="cart-outline" size={26} color="#fff" />

  {totalItems > 0 && (
    <View style={styles.cartBadge}>
      <Text style={styles.cartBadgeText}>
        {totalItems}
      </Text>
    </View>
  )}
</TouchableOpacity>

        </View>

        {/* IMAGE */}
        <View style={styles.imageBox}>
          <Image
            source={
              product.image?.startsWith("http")
                ? { uri: product.image }
                : getLocalImage(product.image)
            }
            style={styles.image}
          />

          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}

          {(product.stock ?? 0) < 10 && (product.stock ?? 0) > 0 && (
            <View style={styles.hotBadge}>
              <Text style={styles.hotText}>⚡ Sắp hết</Text>
            </View>
          )}
        </View>

        {/* INFO */}
        <View style={styles.infoBox}>
          {/* Category */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {product.category?.name || "Mỹ phẩm"}
            </Text>
          </View>

          {/* Name */}
          <Text style={styles.name}>{product.name}</Text>

          {/* Rating & Sold */}
          <View style={styles.statsRow}>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>
                ⭐ {product.rating ?? 4.5}
              </Text>
            </View>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.reviews}>286 đánh giá</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.sold}>Đã bán 1.2k</Text>
          </View>

          {/* Price */}
          <View style={styles.priceBox}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {Math.round(finalPrice).toLocaleString()}₫
              </Text>
              {discount > 0 && (
                <>
                  <Text style={styles.originalPrice}>
                    {price.toLocaleString()}₫
                  </Text>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>
                      Tiết kiệm {Math.round(price - finalPrice).toLocaleString()}₫
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Stock */}
          <View style={styles.stockRow}>
            <Text style={styles.stockLabel}>Tình trạng:</Text>
            <Text
              style={[
                styles.stock,
                (product.stock ?? 0) === 0 && styles.outOfStock,
              ]}
            >
              {(product.stock ?? 0) > 0
                ? `✓ Còn ${product.stock} sản phẩm`
                : "✗ Hết hàng"}
            </Text>
          </View>

          {/* Quantity */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Số lượng:</Text>
            <View style={styles.quantityBox}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={increaseQuantity}
                disabled={quantity >= (product.stock ?? 0)}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features */}
          <View style={styles.featuresBox}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🌿</Text>
              <Text style={styles.featureText}>Tự nhiên</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>✅</Text>
              <Text style={styles.featureText}>Chứng nhận</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚫</Text>
              <Text style={styles.featureText}>No Paraben</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🐰</Text>
              <Text style={styles.featureText}>Cruelty-free</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Mô tả sản phẩm</Text>
            <Text style={styles.description}>
              {product.description ||
                "Sản phẩm chăm sóc da cao cấp với thành phần tự nhiên, an toàn và hiệu quả. Phù hợp cho mọi loại da, đặc biệt là da nhạy cảm."}
            </Text>

            <View style={styles.benefitsList}>
              <Text style={styles.benefitTitle}>🎯 Công dụng chính:</Text>
              <Text style={styles.benefitItem}>• Làm sạch sâu, loại bỏ bụi bẩn</Text>
              <Text style={styles.benefitItem}>• Cấp ẩm và dưỡng da</Text>
              <Text style={styles.benefitItem}>• Làm dịu, giảm kích ứng</Text>
            </View>
          </View>

          {/* Shipping Info */}
          <View style={styles.shippingBox}>
            <Text style={styles.shippingTitle}>🚚 Thông tin vận chuyển</Text>
            <View style={styles.shippingItem}>
              <Text style={styles.shippingIcon}>📦</Text>
              <Text style={styles.shippingText}>
                Miễn phí ship cho đơn từ 300.000₫
              </Text>
            </View>
            <View style={styles.shippingItem}>
              <Text style={styles.shippingIcon}>⚡</Text>
              <Text style={styles.shippingText}>
                Giao hàng 2-3 ngày trong nội thành
              </Text>
            </View>
            <View style={styles.shippingItem}>
              <Text style={styles.shippingIcon}>🔄</Text>
              <Text style={styles.shippingText}>
                Đổi trả trong 30 ngày
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {(finalPrice * quantity).toLocaleString()}₫
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartText}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buyBtn} onPress={handleBuyNow}>
            <Text style={styles.buyText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#120012" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#120012",
  },
  loadingText: { color: "#FF69B4", marginTop: 12, fontSize: 16 },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#120012",
  },
  errorText: { color: "#FF1493", fontSize: 18 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26, 0, 26, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  backText: { fontSize: 20, color: "#fff" },
  likeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(26, 0, 26, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  likeText: { fontSize: 20 },

  // Image
  imageBox: {
    alignItems: "center",
    paddingVertical: 40,
    paddingTop: 100,
    backgroundColor: "#1a001a",
  },
  image: { width: width * 0.8, height: 260, resizeMode: "contain" },
  discountBadge: {
    position: "absolute",
    top: 110,
    left: 20,
    backgroundColor: "#FF1493",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  discountText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  hotBadge: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "#FF8C00",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  hotText: { color: "#fff", fontWeight: "bold", fontSize: 12 },

  // Info Box
  infoBox: {
    backgroundColor: "#1f001f",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    marginTop: -20,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#2a002a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  categoryText: { color: "#FF69B4", fontSize: 12, fontWeight: "600" },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    lineHeight: 30,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBox: {
    backgroundColor: "#2a002a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: { color: "#FFD700", fontWeight: "bold", fontSize: 14 },
  separator: { color: "#555", marginHorizontal: 8 },
  reviews: { color: "#aaa", fontSize: 13 },
  sold: { color: "#aaa", fontSize: 13 },

  // Price
  priceBox: {
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  priceRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  price: { color: "#00FF7F", fontSize: 26, fontWeight: "bold", marginRight: 10 },
  originalPrice: {
    color: "#888",
    fontSize: 15,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  saveBadge: {
    backgroundColor: "#FF1493",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  saveText: { color: "#fff", fontSize: 11, fontWeight: "bold" },

  // Stock
  stockRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  stockLabel: { color: "#aaa", marginRight: 8, fontSize: 14 },
  stock: { color: "#00FF7F", fontWeight: "600", fontSize: 14 },
  outOfStock: { color: "#FF4444" },

  // Quantity
  quantitySection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  quantityLabel: { color: "#fff", fontSize: 15, fontWeight: "600" },
  quantityBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a001a",
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#FF1493",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  qtyValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },

  // Features
  featuresBox: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#2a002a",
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
  },
  featureItem: { alignItems: "center" },
  featureIcon: { fontSize: 24, marginBottom: 4 },
  featureText: { color: "#ccc", fontSize: 11 },

  // Description
  section: {
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FF69B4",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: { color: "#ddd", lineHeight: 22, marginBottom: 12, fontSize: 14 },
  benefitsList: { marginTop: 8 },
  benefitTitle: { color: "#FF69B4", fontSize: 14, fontWeight: "600", marginBottom: 6 },
  benefitItem: { color: "#ccc", lineHeight: 22, fontSize: 13 },

  // Shipping
  shippingBox: {
    backgroundColor: "#2a002a",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  shippingTitle: {
    color: "#FF69B4",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  shippingItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  shippingIcon: { fontSize: 18, marginRight: 10, width: 24 },
  shippingText: { color: "#ccc", fontSize: 13, flex: 1 },

  // Bottom Bar
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1a001a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a003a",
    elevation: 10,
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  totalLabel: { color: "#aaa", fontSize: 13 },
  totalPrice: { color: "#00FF7F", fontSize: 18, fontWeight: "bold" },
  actionRow: { flexDirection: "row", gap: 12 },
  cartBtn: {
    width: 56,
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cartText: { fontSize: 20 },
  buyBtn: {
    flex: 1,
    backgroundColor: "#FF8C00",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buyText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  cartIconWrapper: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "rgba(26,0,26,0.9)",
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#FF69B4",
  position: "relative",
},

cartBadge: {
  position: "absolute",
  top: -4,
  right: -4,
  backgroundColor: "#FF3B30",
  borderRadius: 10,
  minWidth: 18,
  height: 18,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 4,
},

cartBadgeText: {
  color: "#fff",
  fontSize: 11,
  fontWeight: "bold",
},

});