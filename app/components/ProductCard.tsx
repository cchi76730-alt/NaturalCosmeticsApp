import { useRouter } from "expo-router";
import React from "react";

import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "../services/product.service";

interface ProductCardProps {
  product: Product;
  cartQuantity?: number;
  isFavorite?: boolean;
  onAddToCart?: () => void;
  onRemoveFromCart?: () => void;
  onToggleFavorite?: () => void;
}

export default function ProductCard({
  product,
  cartQuantity = 0,
  isFavorite = false,
  onAddToCart,
  onRemoveFromCart,
  onToggleFavorite,
}: ProductCardProps) {
  const stock = Number(product.stock) || 0;
  const price = Number(product.price) || 0;
  const discount = Number(product.discount) || 0;
  const rating =
    product.rating !== undefined && product.rating !== null
      ? Number(product.rating)
      : null;

  const discountedPrice =
    discount > 0 ? price * (1 - discount / 100) : price;

  const imageSource =
    typeof product.image === "string" && product.image.startsWith("http")
      ? { uri: product.image }
      : getLocalImage(product.image);

  const router = useRouter();

return (
  <TouchableOpacity
    style={styles.card}
    activeOpacity={0.85}
    onPress={() => {
  router.push({
    pathname: "/product-detail",
    params: { id: String(product.id) },
  });
}}


    
  >
    {discount > 0 && (
      <View style={styles.discountBadge}>
        <Text style={styles.discountText}>-{discount}%</Text>
      </View>
    )}

    <TouchableOpacity
      style={styles.favoriteBtn}
      onPress={(e) => {
        e.stopPropagation(); // ✅ tránh click lan
        onToggleFavorite?.();
      }}
    >
      <Text style={styles.favoriteIcon}>
        {isFavorite ? "❤️" : "🤍"}
      </Text>
    </TouchableOpacity>

    <Image source={imageSource} style={styles.image} />

    <View style={styles.cardContent}>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      {rating !== null && (
        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.rating}>{rating}</Text>
        </View>
      )}

      <View style={styles.priceContainer}>
        {discount > 0 && (
          <Text style={styles.originalPrice}>
            {price.toLocaleString()} ₫
          </Text>
        )}
        <Text style={styles.price}>
          {Math.round(discountedPrice).toLocaleString()} ₫
        </Text>
      </View>

      <View style={styles.footer}>
        <Text
          style={[
            styles.stock,
            stock > 0 ? styles.inStock : styles.outStock,
          ]}
        >
          {stock > 0 ? `Còn ${stock}` : "Hết hàng"}
        </Text>

        {stock > 0 &&
          (cartQuantity > 0 ? (
            <View style={styles.cartControls}>
              <TouchableOpacity
                style={styles.cartBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onRemoveFromCart?.();
                }}
              >
                <Text style={styles.cartBtnText}>−</Text>
              </TouchableOpacity>

              <Text style={styles.cartQty}>{cartQuantity}</Text>

              <TouchableOpacity
                style={styles.cartBtn}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart?.();
                }}
              >
                <Text style={styles.cartBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addCartBtn}
              onPress={(e) => {
                e.stopPropagation();
                onAddToCart?.();
              }}
            >
              <Text style={styles.addCartText}>🛒</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  </TouchableOpacity>
);

}

const getLocalImage = (image?: string) => {
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
    case "kem-duong- the.jpg":
      return require("../../assets/images/kem-duong- the.jpg");
     case "nuoc-tay-trang.jpg":
      return require("../../assets/images/nuoc-tay-trang.jpg");

    default:
      return require("../../assets/images/sua-rua-mat.jpg");
  }
};

const styles = StyleSheet.create({
  card: {
    width: 170,
    backgroundColor: "#2a002a",
    borderRadius: 16,
    margin: 8,
    overflow: "hidden",
  },
  discountBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#FF1493",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  discountText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  favoriteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
  },
  favoriteIcon: { fontSize: 18 },
  image: { width: "100%", height: 150 },
  cardContent: { padding: 12 },
  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
    minHeight: 36,
  },
  ratingContainer: { flexDirection: "row", alignItems: "center" },
  starIcon: { fontSize: 12, marginRight: 4 },
  rating: { color: "#FFD700", fontSize: 12 },
  priceContainer: { marginBottom: 8 },
  originalPrice: {
    color: "#999",
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  price: { color: "#FFB6C1", fontWeight: "bold", fontSize: 16 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stock: { fontSize: 11, fontWeight: "bold" },
  inStock: { color: "#00FF7F" },
  outStock: { color: "#FF4500" },
  addCartBtn: {
    backgroundColor: "#FF1493",
    padding: 6,
    borderRadius: 8,
  },
  addCartText: { fontSize: 16 },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a003a",
    borderRadius: 8,
  },
  cartBtn: {
    backgroundColor: "#FF1493",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cartBtnText: { color: "#fff", fontSize: 16 },
  cartQty: {
    color: "#fff",
    paddingHorizontal: 10,
    fontWeight: "bold",
    fontSize: 12,
  },
});
