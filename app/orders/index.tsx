import { Redirect } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
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
  const [selectedFilter, setSelectedFilter] = useState<OrderStatus | "all">("all");

  if (!user) return <Redirect href="/(auth)/login" />;

  const toggleExpand = (orderId: number) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      newSet.has(orderId) ? newSet.delete(orderId) : newSet.add(orderId);
      return newSet;
    });
  };

  /* =======================
     HELPERS
  ======================= */
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "#FF9800";
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

  const filteredOrders = selectedFilter === "all" 
    ? orders 
    : orders.filter((order: Order) => order.status === selectedFilter);

  const filterOptions: Array<{ key: OrderStatus | "all"; label: string; icon: string }> = [
    { key: "all", label: "Tất cả", icon: "📋" },
    { key: "pending", label: "Chờ xác nhận", icon: "⏳" },
    { key: "processing", label: "Đang chuẩn bị", icon: "📦" },
    { key: "shipping", label: "Đang giao", icon: "🚚" },
    { key: "completed", label: "Hoàn thành", icon: "✅" },
  ];

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
          <Text style={styles.emptySubtitle}>
            Đơn hàng của bạn sẽ hiển thị tại đây
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
        <Text style={styles.headerSubtitle}>{orders.length} đơn hàng</Text>
      </View>

      {/* FILTER TABS */}
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterTab,
                selectedFilter === item.key && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(item.key)}
              activeOpacity={0.7}
            >
              <Text style={styles.filterIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item.key && styles.filterTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* ORDERS LIST */}
      <FlatList<Order>
        data={filteredOrders}
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
                    Đơn hàng #{item.id}
                  </Text>
                  <Text style={styles.orderDate}>{item.createdAt}</Text>
                </View>

                <View style={styles.headerRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "15" },
                    ]}
                  >
                    <Text style={styles.statusIcon}>
                      {getStatusIcon(item.status)}
                    </Text>
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* SUMMARY */}
              <View style={styles.orderSummary}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryLeft}>
                    <Text style={styles.summaryLabel}>Tổng tiền</Text>
                    {item.items && (
                      <Text style={styles.itemCount}>
                        {item.items.reduce(
                          (sum: number, i: OrderItem) =>
                            sum + (i.quantity || 1),
                          0
                        )}{" "}
                        sản phẩm
                      </Text>
                    )}
                  </View>
                  <Text style={styles.price}>
                    {item.totalPrice.toLocaleString()}đ
                  </Text>
                </View>

                <TouchableOpacity 
                  style={styles.expandButton}
                  onPress={() => toggleExpand(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandButtonText}>
                    {isExpanded ? "Thu gọn" : "Xem chi tiết"}
                  </Text>
                  <Text style={styles.expandIcon}>
                    {isExpanded ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>
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
                          📍 {item.shippingAddress}
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
                            {product.image ? (
                              <Image
                                source={{ uri: product.image }}
                                style={styles.productImage}
                              />
                            ) : (
                              <View style={[styles.productImage, styles.productImagePlaceholder]}>
                                <Text style={styles.placeholderIcon}>📦</Text>
                              </View>
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
                                  Số lượng: {product.quantity || 1}
                                </Text>
                                <Text style={styles.productPrice}>
                                  {(
                                    product.price *
                                    (product.quantity || 1)
                                  ).toLocaleString()}đ
                                </Text>
                              </View>
                            </View>
                          </View>
                        )
                      )}
                    </View>
                  )}

                  {/* PAYMENT INFO */}
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>💳 Thông tin thanh toán</Text>
                    <View style={styles.paymentBox}>
                      {item.items && (
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Tạm tính</Text>
                          <Text style={styles.paymentValue}>
                            {item.items.reduce(
                              (sum: number, i: OrderItem) =>
                                sum + i.price * (i.quantity || 1),
                              0
                            ).toLocaleString()}đ
                          </Text>
                        </View>
                      )}
                      {item.shippingFee && (
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Phí vận chuyển</Text>
                          <Text style={styles.paymentValue}>
                            {item.shippingFee.toLocaleString()}đ
                          </Text>
                        </View>
                      )}
                      {item.discount && (
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentLabel}>Giảm giá</Text>
                          <Text style={[styles.paymentValue, styles.discountText]}>
                            -{item.discount.toLocaleString()}đ
                          </Text>
                        </View>
                      )}
                      <View style={styles.paymentDivider} />
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentTotal}>Tổng cộng</Text>
                        <Text style={styles.paymentTotalAmount}>
                          {item.totalPrice.toLocaleString()}đ
                        </Text>
                      </View>
                      {item.paymentMethod && (
                        <View style={[styles.paymentRow, { marginTop: 8 }]}>
                          <Text style={styles.paymentLabel}>Phương thức</Text>
                          <Text style={styles.paymentMethod}>
                            {item.paymentMethod === "cod" ? "💵 COD" : "🏦 Chuyển khoản"}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* STATUS HISTORY */}
                  {item.statusHistory && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>
                        📊 Lịch sử đơn hàng
                      </Text>
                      <View style={styles.timelineContainer}>
                        {item.statusHistory.map(
                          (history: StatusHistory, index: number) => (
                            <View key={index} style={styles.timelineItem}>
                              <View style={[
                                styles.timelineDot,
                                { backgroundColor: getStatusColor(history.status) }
                              ]} />
                              {index < item.statusHistory!.length - 1 && (
                                <View style={styles.timelineLine} />
                              )}
                              <View style={styles.timelineContent}>
                                <Text style={styles.timelineStatus}>
                                  {getStatusIcon(history.status)} {getStatusText(history.status)}
                                </Text>
                                <Text style={styles.timelineDate}>
                                  {history.date}
                                </Text>
                              </View>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}

                  {/* NOTE */}
                  {item.note && (
                    <View style={styles.section}>
                      <Text style={styles.sectionTitle}>📝 Ghi chú</Text>
                      <View style={styles.noteBox}>
                        <Text style={styles.noteText}>{item.note}</Text>
                      </View>
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
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },

  header: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 16 : 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#757575",
  },

  filterContainer: {
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },

  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    marginRight: 8,
  },

  filterTabActive: {
    backgroundColor: "#2196F3",
  },

  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },

  filterTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },

  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },

  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  headerLeft: {
    flex: 1,
  },

  orderId: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  orderDate: {
    fontSize: 13,
    color: "#999",
  },

  headerRight: {
    marginLeft: 12,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },

  statusIcon: {
    fontSize: 14,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },

  orderSummary: {
    gap: 12,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLeft: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },

  itemCount: {
    fontSize: 13,
    color: "#999",
  },

  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
  },

  expandButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },

  expandButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2196F3",
  },

  expandIcon: {
    fontSize: 10,
    color: "#2196F3",
  },

  section: {
    marginTop: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },

  addressBox: {
    backgroundColor: "#F8F9FA",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    gap: 6,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },

  addressText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },

  productItem: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  productImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#E8E8E8",
  },

  productImagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderIcon: {
    fontSize: 28,
  },

  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },

  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    lineHeight: 20,
  },

  productDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  productQuantity: {
    fontSize: 13,
    color: "#666",
  },

  productPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2196F3",
  },

  paymentBox: {
    backgroundColor: "#F8F9FA",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },

  paymentValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },

  discountText: {
    color: "#4CAF50",
  },

  paymentDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },

  paymentTotal: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  paymentTotalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2196F3",
  },

  paymentMethod: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },

  timelineContainer: {
    paddingLeft: 4,
  },

  timelineItem: {
    flexDirection: "row",
    position: "relative",
    paddingBottom: 16,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
    marginTop: 4,
    zIndex: 2,
  },

  timelineLine: {
    position: "absolute",
    left: 5.5,
    top: 16,
    bottom: 0,
    width: 1,
    backgroundColor: "#E0E0E0",
  },

  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },

  timelineStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  timelineDate: {
    fontSize: 13,
    color: "#999",
  },

  noteBox: {
    backgroundColor: "#FFF9E6",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE082",
  },

  noteText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
  },
});