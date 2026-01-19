import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteProduct } from "../../services/admin.product.service"; // ✅ Import deleteProduct
import { getProducts, Product } from "../../services/product.service"; // ✅ Import Product từ service

// ❌ XÓA INTERFACE NÀY ĐI:
// interface Product {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   ...
// }
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      console.log("📦 Loaded products:", data.length);
      setProducts(data);
    } catch (error) {
      console.error("❌ Lỗi load products:", error);
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

  const handleEdit = (productId: number) => {
    router.push({
      pathname: "/admin/products/edit",
      params: { id: productId },
    });
  };

  const handleDelete = (productId: number) => {
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
            await deleteProduct(productId);
            Alert.alert("✅ Thành công", "Đã xóa sản phẩm");
            loadProducts(); // ✅ LOAD LẠI TỪ BACKEND
          } catch (error) {
            console.error("❌ Lỗi xóa:", error);
            Alert.alert("❌ Lỗi", "Không thể xóa sản phẩm");
          }
        },
      },
    ]
  );
};


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
            {item.price.toLocaleString("vi-VN")} ₫
          </Text>
          <Text style={styles.productStock}>
            Kho: {item.stock ?? 0} | {item.category?.name || "N/A"}
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => handleEdit(item.id)}
        >
          <Text style={styles.actionBtnText}>✏️ Sửa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
    onPress={async () => {
  console.log("🧪 CLICK DELETE", item.id);
  await deleteProduct(item.id);
  loadProducts();
}}

        >
          <Text style={styles.actionBtnText}>🗑️ Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


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
      <TouchableOpacity
        onPress={() => router.push("/admin/products/create")}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>➕ Thêm sản phẩm mới</Text>
      </TouchableOpacity>

      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>📦 Chưa có sản phẩm nào</Text>
          <Text style={styles.emptySubText}>
            Nhấn "Thêm sản phẩm mới" để bắt đầu
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.countText}>
            Tổng: {products.length} sản phẩm
          </Text>

          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a001a",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  countText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 12,
    opacity: 0.8,
  },
  listContent: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#2a002a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  productInfo: {
    flexDirection: "row",
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#3a003a",
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#3a003a",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#666",
    fontSize: 12,
  },
  productDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productPrice: {
    color: "#FF1493",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productStock: {
    color: "#aaa",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#3b82f6",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
  },
  actionBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
});