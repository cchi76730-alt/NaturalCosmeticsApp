import { useRouter } from "expo-router";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useCart } from "./components/context/CartContext";

// Helper function để load hình ảnh local
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
    case "kem-duong- the.jpg":
      return require("../assets/images/kem-duong- the.jpg");
    case "nuoc-tay-trang.jpg":
      return require("../assets/images/nuoc-tay-trang.jpg");
    default:
      return require("../assets/images/sua-rua-mat.jpg");
  }
};


export default function CartScreen() {
  const { items, addToCart, removeFromCart } = useCart();
  const router = useRouter();

  // Tính tổng tiền
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  };

  const totalPrice = calculateTotal();

  // Xác nhận xóa sản phẩm
  const handleRemoveItem = (productId: number, productName: string) => {
    Alert.alert(
      "Xóa sản phẩm",
      `Bạn có chắc muốn xóa "${productName}" khỏi giỏ hàng?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            // Xóa hết số lượng để remove khỏi cart
            const item = items.find(i => i.product.id === productId);
            if (item) {
              for (let i = 0; i < item.quantity; i++) {
                removeFromCart(productId);
              }
            }
          },
        },
      ]
    );
  };

  // Giỏ hàng trống
  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
          <Text style={styles.emptySubtext}>
            Hãy thêm sản phẩm yêu thích vào giỏ hàng của bạn
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => router.push("/(tabs)")}
          >
            <Text style={styles.shopButtonText}>Khám phá sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giỏ hàng</Text>
          <Text style={styles.headerSubtitle}>{items.length} sản phẩm</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        keyExtractor={(item) => item.product.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {/* Product Image */}
            <Image
              source={getLocalImage(item.product.image)}
              style={styles.productImage}
            />

            {/* Product Info */}
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text style={styles.productPrice}>
                {item.product.price.toLocaleString("vi-VN")}đ
              </Text>

              {/* Quantity Controls */}
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => removeFromCart(item.product.id)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </TouchableOpacity>

                <View style={styles.quantityDisplay}>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => addToCart(item.product)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleRemoveItem(item.product.id, item.product.name)}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>

            {/* Item Total */}
            <View style={styles.itemTotal}>
              <Text style={styles.itemTotalText}>
                {(item.product.price * item.quantity).toLocaleString("vi-VN")}đ
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View style={styles.footer}>
            {/* Voucher Section */}
            <TouchableOpacity style={styles.voucherContainer}>
              <Text style={styles.voucherIcon}>🎟️</Text>
              <Text style={styles.voucherText}>Mã giảm giá</Text>
              <Text style={styles.voucherArrow}>›</Text>
            </TouchableOpacity>

            {/* Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tạm tính:</Text>
                <Text style={styles.summaryValue}>
                  {totalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
                <Text style={styles.summaryValue}>Miễn phí</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Tổng cộng:</Text>
                <Text style={styles.totalValue}>
                  {totalPrice.toLocaleString("vi-VN")}đ
                </Text>
              </View>
            </View>
          </View>
        }
      />

      {/* Bottom Checkout Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomLabel}>Tổng thanh toán:</Text>
          <Text style={styles.bottomTotal}>
            {totalPrice.toLocaleString("vi-VN")}đ
          </Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => router.push("/CheckoutScreen")}
        >
          <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          <Text style={styles.checkoutArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#2d1a2d",
    borderBottomWidth: 1,
    borderBottomColor: "#3d1a3d",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3d1a3d",
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#a78ba7",
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#2d1a2d",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3d1a3d",
    position: "relative",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#3d1a3d",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  productName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    lineHeight: 22,
  },
  productPrice: {
    color: "#ff1493",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3d1a3d",
    borderRadius: 10,
    alignSelf: "flex-start",
    overflow: "hidden",
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4a2a4a",
  },
  quantityButtonText: {
    color: "#ff1493",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  quantityText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteIcon: {
    fontSize: 16,
  },
  itemTotal: {
    position: "absolute",
    top: 16,
    right: 52,
  },
  itemTotalText: {
    color: "#d4a5d4",
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 8,
  },
  voucherContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2d1a2d",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ff1493",
    borderStyle: "dashed",
  },
  voucherIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  voucherText: {
    flex: 1,
    color: "#ff1493",
    fontSize: 15,
    fontWeight: "600",
  },
  voucherArrow: {
    color: "#ff1493",
    fontSize: 24,
  },
  summaryContainer: {
    backgroundColor: "#2d1a2d",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#3d1a3d",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    color: "#a78ba7",
    fontSize: 15,
  },
  summaryValue: {
    color: "#e5d5e5",
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#3d1a3d",
    marginVertical: 12,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalValue: {
    color: "#ff1493",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d000d",
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: "#3d1a3d",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 20,
  },
  bottomInfo: {
    flex: 1,
    marginRight: 16,
  },
  bottomLabel: {
    color: "#a78ba7",
    fontSize: 13,
    marginBottom: 4,
  },
  bottomTotal: {
    color: "#ff1493",
    fontSize: 24,
    fontWeight: "bold",
  },
  checkoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff1493",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 14,
    shadowColor: "#ff1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  checkoutArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 100,
    marginBottom: 24,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  emptySubtext: {
    color: "#a78ba7",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  shopButton: {
    backgroundColor: "#ff1493",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 14,
    shadowColor: "#ff1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  shopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});