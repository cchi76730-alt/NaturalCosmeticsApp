import { Redirect } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Image,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../components/context/AuthContext";
import { useOrders } from "../components/context/OrderContext";

/* =======================
   TYPES
======================= */
type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "completed"
  | "cancelled";

type OrderItem = {
  id?: number;
  name: string;
  price: number;
  quantity?: number;
  image?: string;
};

type StatusHistory = {
  status: OrderStatus;
  date: string;
};

type Order = {
  id: number;
  createdAt: string;
  status: OrderStatus;
  totalPrice: number;

  customerName?: string;
  customerPhone?: string;
  shippingAddress?: string;

  items?: OrderItem[];
  shippingFee?: number;
  discount?: number;
  paymentMethod?: "cod" | "bank";
  note?: string;

  statusHistory?: StatusHistory[];
};

/* =======================
   COMPONENT
======================= */
export default function OrdersScreen() {
  const { user } = useAuth();
  const { orders } = useOrders();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  if (!user) return <Redirect href="/(auth)/login" />;

  const toggleExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      newSet.has(orderId) ? newSet.delete(orderId) : newSet.add(orderId);
      return newSet;
    });
  };

  if (orders.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
        <Text style={styles.emptySubtitle}>
          Đơn hàng của bạn sẽ hiển thị tại đây
        </Text>
      </View>
    );
  }

  /* =======================
     HELPERS
  ======================= */
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "processing":
        return "#9C27B0";
      case "shipping":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang chuẩn bị";
      case "shipping":
        return "Đang giao hàng";
      case "completed":
        return "Hoàn thành";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "⏳";
      case "processing":
        return "📦";
      case "shipping":
        return "🚚";
      case "completed":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList<Order>
        data={orders}
        keyExtractor={(o) => o.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => {
          const isExpanded = expandedOrders.has(item.id);

          return (
            <View style={styles.orderCard}>
              {/* HEADER */}
              <TouchableOpacity
                style={styles.orderHeader}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.7}
              >
                <View style={styles.headerLeft}>
                  <Text style={styles.orderId}>
                    {getStatusIcon(item.status)} Đơn hàng #{item.id}
                  </Text>
                  <Text style={styles.orderDate}>📅 {item.createdAt}</Text>
                </View>

                <View style={styles.headerRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                  <Text style={styles.expandIcon}>
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* SUMMARY */}
              <View style={styles.orderSummary}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>💰 Tổng tiền</Text>
                  <Text style={styles.price}>
                    {item.totalPrice.toLocaleString()} đ
                  </Text>
                </View>

                {item.items && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>📦 Số lượng</Text>
                    <Text style={styles.summaryValue}>
                      {item.items.reduce(
                        (sum: number, i: OrderItem) =>
                          sum + (i.quantity || 1),
                        0
                      )}{" "}
                      sản phẩm
                    </Text>
                  </View>
                )}
              </View>

              {/* DETAILS */}
              {isExpanded && (
                <>
                  <View style={styles.divider} />

                  {/* ADDRESS */}
                  {item.shippingAddress && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        🏠 Địa chỉ giao hàng
                      </Text>
                      <View style={styles.addressBox}>
                        {item.customerName && (
                          <Text style={styles.customerName}>
                            {item.customerName}
                          </Text>
                        )}
                        {item.customerPhone && (
                          <Text style={styles.addressText}>
                            📱 {item.customerPhone}
                          </Text>
                        )}
                        <Text style={styles.addressText}>
                          {item.shippingAddress}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* PRODUCTS */}
                  {item.items && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>🛍️ Sản phẩm</Text>
                      {item.items.map(
                        (product: OrderItem, index: number) => (
                          <View key={index} style={styles.productItem}>
                            {product.image && (
                              <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                              />
                            )}
                            <View style={styles.productInfo}>
                              <Text
                                style={styles.productName}
                                numberOfLines={2}
                              >
                                {product.name}
                              </Text>
                              <View style={styles.productDetails}>
                                <Text style={styles.productQuantity}>
                                  x{product.quantity || 1}
                                </Text>
                                <Text style={styles.productPrice}>
                                  {(
                                    product.price *
                                    (product.quantity || 1)
                                  ).toLocaleString()}{" "}
                                  đ
                                </Text>
                              </View>
                            </View>
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {/* STATUS HISTORY */}
                  {item.statusHistory && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        📊 Lịch sử đơn hàng
                      </Text>
                      {item.statusHistory.map(
                        (history: StatusHistory, index: number) => (
                          <View key={index} style={styles.timelineItem}>
                            <View style={styles.timelineDot} />
                            <View style={styles.timelineContent}>
                              <Text style={styles.timelineStatus}>
                                {getStatusText(history.status)}
                              </Text>
                              <Text style={styles.timelineDate}>
                                {history.date}
                              </Text>
                            </View>
                          </View>
                        )
                      )}
                    </View>
                  )}
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
}

/* =======================
   STYLES (GIỮ NGUYÊN)
======================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  listContainer: { padding: 16, paddingBottom: 24 },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: "flex-end" },
  orderId: { fontSize: 16, fontWeight: "700" },
  orderDate: { fontSize: 13, color: "#757575" },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: "600" },
  expandIcon: { fontSize: 10, color: "#757575" },
  divider: { height: 1, backgroundColor: "#E0E0E0", marginVertical: 12 },
  orderSummary: { gap: 8 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { fontSize: 14, color: "#757575" },
  summaryValue: { fontSize: 14, fontWeight: "500" },
  price: { fontSize: 18, fontWeight: "700", color: "#2196F3" },
  section: { marginTop: 12 },
  sectionTitle: { fontSize: 15, fontWeight: "700", marginBottom: 8 },
  addressBox: {
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
  },
  customerName: { fontSize: 15, fontWeight: "600" },
  addressText: { fontSize: 14 },
  productItem: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  productImage: { width: 60, height: 60, borderRadius: 8 },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, fontWeight: "500" },
  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productQuantity: { fontSize: 13 },
  productPrice: { fontSize: 15, fontWeight: "600", color: "#2196F3" },
  timelineItem: { flexDirection: "row", marginBottom: 12 },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
    marginRight: 12,
    marginTop: 5,
  },
  timelineContent: { flex: 1 },
  timelineStatus: { fontSize: 14, fontWeight: "500" },
  timelineDate: { fontSize: 12, color: "#757575" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyIcon: { fontSize: 64 },
  emptyTitle: { fontSize: 20, fontWeight: "700" },
  emptySubtitle: { fontSize: 14, color: "#757575" },
});
