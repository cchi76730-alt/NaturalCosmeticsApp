import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity } from "react-native";
import api from "../services/api";

export default function ProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data));
  }, []);

  return (
    <FlatList
      style={{ backgroundColor: "#1a001a" }}
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            router.push(`/product-detail?id=${item.id}`)
          }
        >
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.price}>{item.price} ₫</Text>
        </TouchableOpacity>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a002a",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  name: { color: "#fff", fontSize: 16 },
  price: { color: "#FF1493", fontWeight: "bold" },
});
