import React from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

const inventory = [
  { id: 1, name: "Son môi", stock: 120 },
  { id: 2, name: "Sữa rửa mặt", stock: 0 },
  { id: 3, name: "Kem dưỡng", stock: 45 },
  { id: 4, name: "Nước hoa hồng", stock: 89 },
  { id: 5, name: "Serum Vitamin C", stock: 15 },
];

export default function InventoryScreen() {
const getStockStatus = (stock: number) => {    if (stock === 0) return { text: "Hết hàng", color: "#e74c3c" };
    if (stock < 20) return { text: "Sắp hết", color: "#f39c12" };
    return { text: "Còn hàng", color: "#27ae60" };
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📦 Quản lý kho hàng</Text>
        <Text style={styles.subtitle}>Theo dõi tồn kho sản phẩm</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{inventory.length}</Text>
          <Text style={styles.statLabel}>Sản phẩm</Text>
        </View>
        <View style={[styles.statCard, styles.statCardWarning]}>
          <Text style={styles.statNumber}>
            {inventory.filter(i => i.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>Hết hàng</Text>
        </View>
      </View>

      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const status = getStockStatus(item.stock);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: status.color }]}>
                  <Text style={styles.badgeText}>{status.text}</Text>
                </View>
              </View>
              
              <View style={styles.stockInfo}>
                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>Tồn kho:</Text>
                  <Text style={[styles.stockValue, { color: status.color }]}>
                    {item.stock} {item.stock === 1 ? "sản phẩm" : "sản phẩm"}
                  </Text>
                </View>
                
                {item.stock > 0 && (
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${Math.min((item.stock / 120) * 100, 100)}%`,
                          backgroundColor: status.color 
                        }
                      ]} 
                    />
                  </View>
                )}
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#7f8c8d",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#3498db",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardWarning: {
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    opacity: 0.9,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  productName: { 
    fontSize: 18, 
    fontWeight: "700",
    color: "#2c3e50",
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  stockInfo: {
    gap: 12,
  },
  stockRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stockLabel: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  stockValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#ecf0f1",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
});