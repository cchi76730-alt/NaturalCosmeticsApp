import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  confirmOrder,
  getOrderById,
  Order,
} from "../../services/order.admin.service";

// Extended interface for detailed order view
interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderDetailed extends Order {
  address?: string;
  items?: OrderItem[];
  createdAt?: string;
  updatedAt?: string;
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<OrderDetailed | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await getOrderById(Number(id));
      setOrder(data);
    } catch (error) {
      console.error("Lỗi load đơn:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
  if (!order || order.status !== "PENDING") {
    Alert.alert("Thông báo", "Đơn hàng này đã được xác nhận");
    return;
  }

  try {
    console.log("▶️ CONFIRM ORDER ID:", order.id);

    const res = await confirmOrder(order.id);

    console.log("✅ CONFIRM RESPONSE:", res);

    setOrder(res); // cập nhật lại state từ backend

    Alert.alert("Thành công", "Xác nhận đơn hàng thành công");
  } catch (error: any) {
    console.log("❌ CONFIRM ERROR:", error?.response || error);
    Alert.alert("Lỗi", "Không xác nhận được đơn hàng");
  }
};


  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f59e0b";
      case "CONFIRMED":
        return "#16a34a";
      case "DELIVERED":
        return "#3b82f6";
      case "CANCELLED":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "CONFIRMED":
        return "Đã xác nhận";
      case "DELIVERED":
        return "Đã giao";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Không tìm thấy đơn hàng</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/admin/orders");
            }
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Đơn hàng #{order.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) + "20" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(order.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(order.status) },
              ]}
            >
              {getStatusText(order.status)}
            </Text>
          </View>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person-outline" size={20} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        </View>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Tên khách hàng</Text>
              <Text style={styles.infoValue}>{order.customerName}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="call" size={18} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Số điện thoại</Text>
              <Text style={styles.infoValue}>{order.phone || "Chưa cập nhật"}</Text>
            </View>
          </View>
          {order.address && (
            <>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <Ionicons name="location" size={18} color="#6b7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Địa chỉ giao hàng</Text>
                  <Text style={styles.infoValue}>{order.address}</Text>
                </View>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cart-outline" size={20} color="#3b82f6" />
            <Text style={styles.sectionTitle}>Sản phẩm đã đặt</Text>
          </View>
          <View style={styles.itemsCard}>
            {order.items.map((item: OrderItem, index: number) => (
              <View key={index}>
                {index > 0 && <View style={styles.divider} />}
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.productName || `Sản phẩm ${index + 1}`}</Text>
                    <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {((item.price || 0) * (item.quantity || 1)).toLocaleString("vi-VN")} đ
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Payment Info */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="card-outline" size={20} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Thông tin thanh toán</Text>
        </View>
        <View style={styles.paymentCard}>
          {order.items && order.items.length > 0 && (
            <>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Tạm tính</Text>
                <Text style={styles.paymentValue}>
                  {order.totalPrice.toLocaleString("vi-VN")} đ
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Phí vận chuyển</Text>
                <Text style={styles.paymentValue}>0 đ</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}
          <View style={styles.paymentRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalValue}>
              {order.totalPrice.toLocaleString("vi-VN")} đ
            </Text>
          </View>
        </View>
      </View>

      {/* Order Timeline */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="time-outline" size={20} color="#3b82f6" />
          <Text style={styles.sectionTitle}>Lịch sử đơn hàng</Text>
        </View>
        <View style={styles.timelineCard}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Đơn hàng được tạo</Text>
              <Text style={styles.timelineDate}>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString("vi-VN")
                  : "—"}
              </Text>
            </View>
          </View>
          {order.status === "CONFIRMED" && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.timelineDotActive]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Đã xác nhận</Text>
                <Text style={styles.timelineDate}>
                  {order.updatedAt
                    ? new Date(order.updatedAt).toLocaleString("vi-VN")
                    : "—"}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      {order.status === "PENDING" && (
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.confirmBtn, confirming && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={confirming}
          >
            {confirming ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.confirmText}>Xác nhận đơn hàng</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}

      {order.status === "CONFIRMED" && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
          <Text style={styles.successText}>Đơn hàng đã được xác nhận</Text>
        </View>
      )}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6b7280",
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "600",
  },
  backButton: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },
  section: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: "#2c3e50",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  itemsCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: "#6b7280",
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2c3e50",
  },
  paymentCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  paymentValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2c3e50",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  timelineCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
    marginRight: 12,
    marginTop: 4,
  },
  timelineDotActive: {
    backgroundColor: "#16a34a",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionSection: {
    padding: 16,
    backgroundColor: "#fff",
    marginTop: 12,
  },
  confirmBtn: {
    backgroundColor: "#16a34a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnDisabled: {
    backgroundColor: "#9ca3af",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#d1fae5",
    padding: 16,
    marginTop: 12,
    gap: 8,
  },
  successText: {
    color: "#16a34a",
    fontSize: 15,
    fontWeight: "600",
  },
});