import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  deleteProduct,
  getAdminProducts,
  Product,
} from "../../services/admin.product.service";

/* ================= IMAGE HELPER ================= */
const getLocalImage = (image?: string) => {
  switch (image) {
    case "sua-rua-mat.jpg":
      return require("../../../assets/images/sua-rua-mat.jpg");
    case "chong-nang.jpg":
      return require("../../../assets/images/chong-nang.jpg");
    case "son_ruby_rose.jpg":
      return require("../../../assets/images/son_ruby_rose.jpg");
    case "mascara.jpg":
      return require("../../../assets/images/mascara.jpg");
    case "kem-duong-am.jpg":
      return require("../../../assets/images/kem-duong-am.jpg");
    case "dau-goi.jpg":
      return require("../../../assets/images/dau-goi.jpg");
    case "sua-tam.jpg":
      return require("../../../assets/images/sua-tam.jpg");
    case "nuoc-hoa-nu.jpg":
      return require("../../../assets/images/nuoc-hoa-nu.jpg");
    case "nuoc-hoa-nam.jpg":
      return require("../../../assets/images/nuoc-hoa-nam.jpg");
    default:
      return require("../../../assets/images/sua-rua-mat.jpg");
  }
};

export default function ProductList() {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= LOAD ================= */
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getAdminProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  /* ================= ACTIONS ================= */
  const handleEdit = (id: number) => {
    router.push({
      pathname: "/admin/products/edit",
      params: { id },
    });
  };

  const handleDelete = async (id: number) => {
    console.log("🟥 DELETE CLICK:", id);

    if (Platform.OS === "web") {
      const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
      if (!ok) return;

      try {
        await deleteProduct(id);
        alert("Đã xóa sản phẩm");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } catch (error) {
        alert("Không thể xóa sản phẩm");
      }
      return;
    }

    // 📱 Mobile
    Alert.alert("Xác nhận xóa", "Bạn có chắc muốn xóa sản phẩm này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProduct(id);
            Alert.alert("Thành công", "Đã xóa sản phẩm");
            setProducts((prev) => prev.filter((p) => p.id !== id));
          } catch (error) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm");
          }
        },
      },
    ]);
  };

  /* ================= RENDER ITEM ================= */
  const renderProduct = ({ item }: { item: Product }) => {
    const imageSource =
      typeof item.image === "string" && item.image.startsWith("http")
        ? { uri: item.image }
        : getLocalImage(item.image);

    return (
      <View style={styles.productCard}>
        <View style={styles.cardContent}>
          {/* Image Container with Border */}
          <View style={styles.imageWrapper}>
            <Image source={imageSource} style={styles.productImage} />
            <View style={styles.imageBorder} />
          </View>

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.productPrice}>
              {(item.price ?? 0).toLocaleString("vi-VN")}₫
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.stockBadge}>
                <Text style={styles.stockIcon}>📦</Text>
                <Text style={styles.stockText}>{item.stock ?? 0}</Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {item.category?.name || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.editBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => handleEdit(item.id)}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionBtnText}>Sửa</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.deleteBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionIcon}>🗑️</Text>
            <Text style={styles.actionBtnText}>Xóa</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#FF1493" />
          <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
          <Text style={styles.headerSubtitle}>
            {products.length} sản phẩm
          </Text>
        </View>

        <Pressable
          onPress={() => router.push("/admin/products/create")}
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
        >
          <Text style={styles.addButtonIcon}>➕</Text>
          <Text style={styles.addButtonText}>Thêm mới</Text>
        </Pressable>
      </View>

      {/* Product List */}
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0014",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0a0014",
  },
  loadingCard: {
    backgroundColor: "#1a0a2e",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FF1493",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  loadingText: {
    color: "#fff",
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#0a0014",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#a78bfa",
    fontSize: 14,
    marginTop: 4,
  },

  // Add Button
  addButton: {
    backgroundColor: "#FF1493",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#FF1493",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  addButtonIcon: {
    fontSize: 18,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // List
  listContent: {
    padding: 20,
    paddingTop: 8,
  },

  // Product Card
  productCard: {
    backgroundColor: "#1a0a2e",
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2d1b4e",
    ...Platform.select({
      ios: {
        shadowColor: "#8b5cf6",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContent: {
    flexDirection: "row",
    marginBottom: 14,
  },

  // Image
  imageWrapper: {
    position: "relative",
    width: 80,
    height: 80,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#2d1b4e",
  },
  imageBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#8b5cf6",
    opacity: 0.3,
  },

  // Product Info
  productInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  productName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    lineHeight: 22,
  },
  productPrice: {
    color: "#FF1493",
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
  },
  stockBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1b4e",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#8b5cf6",
    gap: 4,
  },
  stockIcon: {
    fontSize: 12,
  },
  stockText: {
    color: "#a78bfa",
    fontSize: 13,
    fontWeight: "600",
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 20, 147, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 20, 147, 0.3)",
  },
  categoryText: {
    color: "#FF1493",
    fontSize: 12,
    fontWeight: "600",
  },

  // Actions
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  editBtn: {
    backgroundColor: "#3b82f6",
    ...Platform.select({
      ios: {
        shadowColor: "#3b82f6",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    ...Platform.select({
      ios: {
        shadowColor: "#ef4444",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  actionIcon: {
    fontSize: 16,
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});