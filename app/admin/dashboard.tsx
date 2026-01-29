import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getDashboard } from "../services/admin.service";
import { confirmOrder } from "../services/order.admin.service";


const { width } = Dimensions.get("window");

interface PendingOrder {
  id: number;
  customerName: string;
  totalPrice: number;
}

interface DashboardData {
  revenue: string;
  totalOrders: number;
  pendingOrders: number;
  pendingOrderList: PendingOrder[]; // 👈 thêm
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboard();
  }, []);
const handleConfirm = async (orderId: number) => {
  try {
    await confirmOrder(orderId);
    await loadDashboard(); // reload lại dashboard
  } catch (error) {
    console.error("Lỗi xác nhận đơn:", error);
  }
};

  const loadDashboard = async () => {
    try {
      const response = await getDashboard();
      setData(response.data);
    } catch (error) {
      console.error("Lỗi tải dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>⚠️ Không thể tải dữ liệu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Xin chào Cindy 👋</Text>
        <Text style={styles.subtitle}>Tổng quan hôm nay</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          {/* Card Doanh Thu - Featured */}
          <View style={styles.featuredCard}>
            <View style={styles.featuredCardContent}>
              <View style={styles.featuredHeader}>
                <Text style={styles.featuredLabel}>Doanh thu</Text>
                <View style={styles.trendBadge}>
                  <Text style={styles.trendText}>↗ 12.5%</Text>
                </View>
              </View>
              <Text style={styles.featuredValue}>{data.revenue}₫</Text>
              <Text style={styles.featuredSubtext}>
                So với tháng trước
              </Text>
            </View>
          </View>

          {/* Grid Cards */}
          <View style={styles.gridContainer}>
            {/* Card Tổng Đơn */}
            <View style={[styles.gridCard, styles.blueCard]}>
              <View style={styles.gridCardHeader}>
                <View style={styles.iconCircle}>
                  <Text style={styles.cardIcon}>📦</Text>
                </View>
              </View>
              <Text style={styles.gridValue}>{data.totalOrders}</Text>
              <Text style={styles.gridLabel}>Tổng đơn hàng</Text>
              <View style={styles.miniTrend}>
                <Text style={styles.miniTrendText}>+8.2%</Text>
              </View>
            </View>

            {/* Card Chờ Xử Lý */}
            <View style={[styles.gridCard, styles.orangeCard]}>
              <View style={styles.gridCardHeader}>
                <View style={styles.iconCircle}>
                  <Text style={styles.cardIcon}>⏰</Text>
                </View>
              </View>
              <Text style={styles.gridValue}>{data.pendingOrders}</Text>
              <Text style={styles.gridLabel}>Chờ xử lý</Text>
              <View style={styles.alertBadge}>
                <Text style={styles.alertText}>Cần xử lý</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  greeting: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    fontWeight: "600",
  },
  featuredCard: {
    backgroundColor: "#8B5CF6",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  featuredCardContent: {
    gap: 8,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  featuredLabel: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  trendBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  trendText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  featuredValue: {
    fontSize: 42,
    fontWeight: "900",
    color: "#FFFFFF",
    marginVertical: 4,
  },
  featuredSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
  },
  gridContainer: {
    flexDirection: "row",
    gap: 16,
  },
  gridCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  blueCard: {
    backgroundColor: "#FFFFFF",
  },
  orangeCard: {
    backgroundColor: "#FFFFFF",
  },
  gridCardHeader: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 28,
  },
  gridValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 12,
  },
  miniTrend: {
    backgroundColor: "#DBEAFE",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  miniTrendText: {
    color: "#2563EB",
    fontSize: 12,
    fontWeight: "700",
  },
  alertBadge: {
    backgroundColor: "#FEF3C7",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertText: {
    color: "#D97706",
    fontSize: 12,
    fontWeight: "700",
  },
});