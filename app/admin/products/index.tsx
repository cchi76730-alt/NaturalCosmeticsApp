import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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

  const handleDelete = (id: number) => {
    console.log("🟥 DELETE CLICK:", id);

    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa sản phẩm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(id);

              Alert.alert("✅ Thành công", "Đã xóa sản phẩm");

              setProducts((prev) => prev.filter((p) => p.id !== id));
            } catch (error) {
              console.error("DELETE ERROR:", error);
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          },
        },
      ]
    );
  };

  /* ================= RENDER ITEM ================= */
  const renderProduct = ({ item }: { item: Product }) => {
    const imageSource =
      typeof item.image === "string" && item.image.startsWith("http")
        ? { uri: item.image }
        : getLocalImage(item.image);

    return (
      <View style={styles.productCard}>
        <View style={styles.productInfo}>
          <Image source={imageSource} style={styles.productImage} />

          <View style={styles.productDetails}>
            <Text style={styles.productName} numberOfLines={2}>
              {item.name}
            </Text>

            <Text style={styles.productPrice}>
              {(item.price ?? 0).toLocaleString("vi-VN")} ₫
            </Text>

            <Text style={styles.productStock}>
              Kho: {item.stock ?? 0} | {item.category?.name || "N/A"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, styles.editBtn]}
            onPress={() => handleEdit(item.id)}
          >
            <Text style={styles.actionBtnText}>✏️ Sửa</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, styles.deleteBtn]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.actionBtnText}>🗑️ Xóa</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  /* ================= UI ================= */
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF1493" />
        <Text style={styles.loadingText}>Đang tải sản phẩm...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => router.push("/admin/products/create")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>➕ Thêm sản phẩm mới</Text>
      </Pressable>

      <Text style={styles.countText}>Tổng: {products.length} sản phẩm</Text>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a001a", padding: 16 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#fff", marginTop: 10 },
  addButton: {
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  countText: { color: "#fff", marginBottom: 10 },
  productCard: {
    backgroundColor: "#2a002a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  productInfo: { flexDirection: "row" },
  productImage: { width: 80, height: 80, borderRadius: 8 },
  productDetails: { flex: 1, marginLeft: 12 },
  productName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  productPrice: { color: "#FF1493", fontSize: 16 },
  productStock: { color: "#aaa", fontSize: 13 },
  actions: { flexDirection: "row", marginTop: 10, gap: 8 },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtn: { backgroundColor: "#3b82f6" },
  deleteBtn: { backgroundColor: "#ef4444" },
  actionBtnText: { color: "#fff", fontWeight: "600" },
});
