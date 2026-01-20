import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useCart } from "../components/context/CartContext";

import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { CATEGORIES } from "../services/category.service";
import { Product } from "../services/product.service";

const { width } = Dimensions.get("window");
const FEATURED_CARD_WIDTH = width * 0.7;

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { addToCart, removeFromCart, getQuantity, totalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = Array.isArray(res.data) ? res.data : [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (e) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== "all") {
      result = result.filter(
        (p) => p.category?.id === Number(selectedCategory)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(q)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery, products]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text style={{ color: "#fff" }}>⏳ Đang tải...</Text>
      </SafeAreaView>
    );
  }

  /* ================= HEADER LIST ================= */
  const ListHeaderComponent = () => (
    <>
      {/* SEARCH */}
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* ===== FEATURED CATEGORY ===== */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
      >
        <TouchableOpacity
          style={styles.catTag}
          onPress={() => setSelectedCategory("all")}
        >
          <Text style={styles.catText}>🔥 Nổi bật</Text>
        </TouchableOpacity>

        {CATEGORIES.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.catTag}
            onPress={() => setSelectedCategory(String(c.id))}
          >
            <Text style={styles.catText}>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      
    </>
  );
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>Cindy Beauty</Text>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <Text style={styles.cart}>🛒 {totalItems}</Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={filteredProducts}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            cartQuantity={getQuantity(item.id)}
            onAddToCart={() => addToCart(item)}
            onRemoveFromCart={() => removeFromCart(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a001a" },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    padding: 16,
    backgroundColor: "#2a002a",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  cart: { color: "#fff", fontSize: 18 },

  searchBox: {
    backgroundColor: "#2a002a",
    margin: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: { color: "#fff", height: 44 },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
    marginVertical: 8,
  },

  catTag: {
    backgroundColor: "#FF1493",
    marginHorizontal: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  catText: { color: "#fff", fontWeight: "600" },

  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    backgroundColor: "#2a002a",
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 16,
  },
  saleBadge: {
    color: "#fff",
    backgroundColor: "#FF1493",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
  },
  featuredName: {
    color: "#fff",
    fontSize: 16,
    marginTop: 8,
  },
  featuredPrice: {
    color: "#FFB6C1",
    fontWeight: "bold",
    marginTop: 4,
  },
});
