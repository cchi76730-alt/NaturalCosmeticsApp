import { Image, StyleSheet, Text, View } from "react-native";
import { Product } from "../services/product.service";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>
        {product.price.toLocaleString()} đ
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#2a002a",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },
  name: {
    color: "#fff",
    marginTop: 8,
    fontWeight: "bold",
  },
  price: {
    color: "#FFB6C1",
    marginTop: 4,
  },
});
