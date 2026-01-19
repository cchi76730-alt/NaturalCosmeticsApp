import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useCart } from "../components/context/CartContext";

import {
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import ProductCard from "../components/ProductCard";
import api from "../services/api";
import { CATEGORIES } from "../services/category.service";
import { Product } from "../services/product.service";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);

  const router = useRouter();
  const { addToCart, removeFromCart, getQuantity, totalItems } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = Array.isArray(res.data) ? res.data : [];
      console.log("📦 Fetched products:", data.length);
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("❌ Fetch error:", error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.id === Number(selectedCategory)
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q)
      );
    }

    console.log("🔍 Filtered products:", filtered.length);
    setFilteredProducts(filtered);
  }, [selectedCategory, searchQuery, products]);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>⏳ Đang tải sản phẩm...</Text>
      </SafeAreaView>
    );
  }

  // ✅ HEADER COMPONENT - Tách ra để dùng trong FlatList
  const ListHeaderComponent = () => (
    <>
      {/* SEARCH */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* CATEGORIES */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryBtn,
            selectedCategory === "all" && styles.categoryBtnActive,
          ]}
          onPress={() => setSelectedCategory("all")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.categoryText,
              selectedCategory === "all" && styles.categoryTextActive,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryBtn,
              selectedCategory === String(cat.id) && styles.categoryBtnActive,
            ]}
            onPress={() => setSelectedCategory(String(cat.id))}
            activeOpacity={0.7}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === String(cat.id) &&
                  styles.categoryTextActive,
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PRODUCT COUNT */}
      <View style={styles.productCountContainer}>
        <Text style={styles.productCountText}>
          {filteredProducts.length} sản phẩm
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a002a" />

      {/* ===== HEADER - CỐ ĐỊNH ===== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Cindy Beauty</Text>
          <Text style={styles.headerSubtitle}>
            Khám phá vẻ đẹp của bạn ✨
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartIconContainer}
          onPress={() => router.push("/cart")}
          activeOpacity={0.7}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {totalItems > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ===== PRODUCTS LIST - ĐÃ BAO GỒM SEARCH + CATEGORIES ===== */}
      {filteredProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyText}>Không tìm thấy sản phẩm</Text>
          <Text style={styles.emptySubText}>Thử tìm kiếm với từ khóa khác</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={ListHeaderComponent} // ✅ SEARCH + CATEGORIES Ở ĐÂY
          stickyHeaderIndices={[0]} // ✅ OPTIONAL: Làm header sticky
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ width: CARD_WIDTH }}>
              <ProductCard
                product={item}
                cartQuantity={getQuantity(item.id)}
                isFavorite={favorites.includes(item.id)}
                onAddToCart={() => addToCart(item)}
                onRemoveFromCart={() => removeFromCart(item.id)}
                onToggleFavorite={() => toggleFavorite(item.id)}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#1a001a",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#fff",
    fontSize: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#2a002a",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  headerLeft: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },

  headerSubtitle: {
    color: "#FFB6C1",
    marginTop: 4,
    fontSize: 14,
  },

  cartIconContainer: {
    position: "relative",
    padding: 8,
    marginLeft: 12,
  },

  cartIcon: {
    fontSize: 28,
  },

  cartBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF1493",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2a002a",
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a002a",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: "#fff",
    paddingVertical: 14,
    fontSize: 15,
  },

  clearIcon: {
    color: "#999",
    fontSize: 20,
    paddingHorizontal: 8,
  },

  categoriesScroll: {
    marginTop: 8,
    marginBottom: 8,
  },

  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },

  categoryBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a002a",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },

  categoryBtnActive: {
    backgroundColor: "#FF1493",
    borderColor: "#FF1493",
    ...Platform.select({
      ios: {
        shadowColor: "#FF1493",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },

  categoryText: {
    color: "#bbb",
    fontWeight: "600",
    fontSize: 14,
  },

  categoryTextActive: {
    color: "#fff",
  },

  productCountContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "#1a001a", // ✅ Đồng bộ với background
  },

  productCountText: {
    color: "#aaa",
    fontSize: 13,
    fontWeight: "500",
  },

  listContainer: {
    paddingBottom: 100, // ✅ Giảm padding để tránh che
  },

  columnWrapper: {
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 8,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },

  emptyText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },

  emptySubText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
  },
});