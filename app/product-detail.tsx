import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { addToCart, buyNow } from "./services/cart.service";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getProductById, Product } from "./services/product.service";

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    getProductById(Number(id))
      .then(setProduct)
      .catch(console.log)
      .finally(() => setLoading(false));
  }, [id]);

    const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, 1);
      Alert.alert("Thành công", "Đã thêm vào giỏ hàng 🛒");
    } catch (e) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập");
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await buyNow(product.id, 1);
      Alert.alert("Thành công", "Đặt hàng thành công 🎉");
    } catch (e) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 80 }} />;
  }

  if (!product) {
    return <Text style={{ color: "#fff" }}>Không tìm thấy sản phẩm</Text>;
  }

  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const finalPrice =
    discount > 0 ? price * (1 - discount / 100) : price;

  return (
    <ScrollView style={styles.container}>
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
      </View>

      {/* INFO */}
      <View style={styles.infoBox}>
        <Text style={styles.name}>{product.name}</Text>

        <Text style={styles.rating}>
          ⭐ {product.rating ?? 4.5} | 286 đánh giá
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {Math.round(finalPrice).toLocaleString()} ₫
          </Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>
              {price.toLocaleString()} ₫
            </Text>
          )}
        </View>

        <Text style={styles.stock}>
          {(product.stock ?? 0) > 0
            ? `Còn ${product.stock}`
            : "Hết hàng"}
        </Text>

        {/* DESCRIPTION */}
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
  <Text style={styles.description}>
    {product.description || "Đang cập nhật mô tả..."}
  </Text>
</View>

      </View>

      {/* ACTION */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={handleAddToCart}
        >
          <Text style={styles.cartText}>🛒 Thêm giỏ hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buyBtn}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
      

    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120012",
  },
  imageBox: {
    alignItems: "center",
    paddingVertical: 20,
  },
  image: {
    width: "80%",
    height: 220,
    resizeMode: "contain",
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#FF1493",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: "#fff",
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#1f001f",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  rating: {
    color: "#FFD700",
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  price: {
    color: "#00FF7F",
    fontSize: 22,
    fontWeight: "bold",
    marginRight: 10,
  },
  originalPrice: {
    color: "#aaa",
    textDecorationLine: "line-through",
  },
  stock: {
    color: "#00FF7F",
    marginBottom: 12,
  },
  description: {
    color: "#ccc",
    lineHeight: 22,
  },
  actionRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buyBtn: {
    flex: 1,
    backgroundColor: "#FF8C00",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  section: {
  marginTop: 20,
  paddingTop: 16,
  borderTopWidth: 1,
  borderTopColor: "#2a002a",
},
sectionTitle: {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 10,
},
addCartBtn: {
  backgroundColor: "#ff9800",
  paddingVertical: 14,
  borderRadius: 8,
  marginBottom: 10,
},
buyNowBtn: {
  backgroundColor: "#e53935",
  paddingVertical: 14,
  borderRadius: 8,
},
btnText: {
  color: "#fff",
  textAlign: "center",
  fontSize: 16,
  fontWeight: "600",
},


});
