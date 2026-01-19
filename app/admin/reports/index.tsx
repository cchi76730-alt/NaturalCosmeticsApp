// app/admin/reports/index.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getReports } from "../../services/report.service";

const { width } = Dimensions.get("window");

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState<any>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getReports(selectedPeriod);

      setSummary(res.data.summary);
      setReports(res.data.dailyReports);
      setTopProducts(res.data.topProducts);
    } catch (error) {
      console.error("❌ Lỗi tải báo cáo:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatCard = (
    iconName: keyof typeof Ionicons.glyphMap,
    label: string,
    value: string,
    change: number,
    color: string
  ) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statHeader}>
        <View style={[styles.iconContainer, { backgroundColor: color + "15" }]}>
          <Ionicons name={iconName} size={24} color={color} />
        </View>
        <View style={styles.changeContainer}>
          <Ionicons
            name={change >= 0 ? "trending-up" : "trending-down"}
            size={14}
            color={change >= 0 ? "#27ae60" : "#e74c3c"}
          />
          <Text
            style={[
              styles.changeText,
              { color: change >= 0 ? "#27ae60" : "#e74c3c" },
            ]}
          >
            {Math.abs(change)}%
          </Text>
        </View>
      </View>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Đang tải báo cáo...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.loadingContainer}>
        <Text>⚠️ Không có dữ liệu</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Báo cáo & Thống kê</Text>
        <Text style={styles.subtitle}>Tổng quan hiệu suất kinh doanh</Text>
      </View>

      {/* Period Selector */}
      <View style={styles.periodSelector}>
        {[
          { key: "day", label: "Ngày" },
          { key: "week", label: "Tuần" },
          { key: "month", label: "Tháng" },
          { key: "year", label: "Năm" },
        ].map((p) => (
          <TouchableOpacity
            key={p.key}
            style={[
              styles.periodBtn,
              selectedPeriod === p.key && styles.periodBtnActive,
            ]}
            onPress={() => setSelectedPeriod(p.key)}
          >
            <Text
              style={[
                styles.periodText,
                selectedPeriod === p.key && styles.periodTextActive,
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.statsGrid}>
        {renderStatCard(
          "cash-outline",
          "Tổng doanh thu",
          `${(summary.revenue / 1_000_000).toFixed(1)}M đ`,
          summary.revenueChange,
          "#3498db"
        )}
        {renderStatCard(
          "cart-outline",
          "Đơn hàng",
          summary.orders.toString(),
          summary.ordersChange,
          "#9b59b6"
        )}
        {renderStatCard(
          "cube-outline",
          "Sản phẩm bán",
          summary.products.toString(),
          summary.productsChange,
          "#e67e22"
        )}
        {renderStatCard(
          "trending-up-outline",
          "Giá trị TB/đơn",
          `${(summary.avgOrder / 1000).toFixed(0)}K đ`,
          5.3,
          "#27ae60"
        )}
      </View>

      {/* Chart */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Doanh thu theo ngày</Text>
        <View style={styles.chartContainer}>
          {reports.map((r) => {
            const maxRevenue = Math.max(...reports.map((i) => i.revenue));
            const barHeight = (r.revenue / maxRevenue) * 120;

            return (
              <View key={r.date} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <Text style={styles.barValue}>
                    {(r.revenue / 1_000_000).toFixed(1)}M
                  </Text>
                  <View style={[styles.bar, { height: barHeight }]} />
                </View>
                <Text style={styles.barLabel}>{r.date.slice(0, 5)}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Top Products */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm bán chạy</Text>
        {topProducts.map((p, i) => (
          <View key={i} style={styles.productCard}>
            <View style={styles.productRank}>
              <Text style={styles.rankText}>#{i + 1}</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{p.name}</Text>
              <Text style={styles.productStats}>
                Đã bán: {p.sold} • {(p.revenue / 1_000_000).toFixed(1)}M đ
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  periodSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: '#3498db',
  },
  periodText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  periodTextActive: {
    color: '#fff',
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 140,
  },
  bar: {
    width: 32,
    backgroundColor: '#3498db',
    borderRadius: 6,
    marginTop: 4,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginTop: 8,
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  productRank: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productStats: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  reportCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportDate: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2c3e50',
  },
  trendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendUp: {
    backgroundColor: '#d4edda',
  },
  trendDown: {
    backgroundColor: '#f8d7da',
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportStat: {
    flex: 1,
  },
  reportLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  reportValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },
  loadingContainer: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
},
loadingText: {
  marginTop: 12,
  fontSize: 14,
  color: "#7f8c8d",
},

});