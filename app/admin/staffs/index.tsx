// app/(admin)/staffs.tsx
import { FlatList, StyleSheet, Text, View } from "react-native";

const staffs = [
  { id: 1, name: "Nguyễn Văn A", email: "a@gmail.com", role: "ADMIN" },
  { id: 2, name: "Trần Thị B", email: "b@gmail.com", role: "STAFF" },
  { id: 3, name: "Lê Văn C", email: "c@gmail.com", role: "STAFF" },
  { id: 4, name: "Phạm Thị D", email: "d@gmail.com", role: "MANAGER" },
];

export default function StaffsScreen() {
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { text: "Quản trị viên", color: "#e74c3c", icon: "👑" };
      case "MANAGER":
        return { text: "Quản lý", color: "#3498db", icon: "💼" };
      case "STAFF":
        return { text: "Nhân viên", color: "#27ae60", icon: "👤" };
      default:
        return { text: role, color: "#95a5a6", icon: "👤" };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Quản lý nhân viên</Text>
        <Text style={styles.subtitle}>Danh sách nhân viên trong hệ thống</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{staffs.length}</Text>
          <Text style={styles.statLabel}>Tổng số</Text>
        </View>
        <View style={[styles.statCard, styles.statCardAdmin]}>
          <Text style={styles.statNumber}>
            {staffs.filter(s => s.role === "ADMIN").length}
          </Text>
          <Text style={styles.statLabel}>Admin</Text>
        </View>
        <View style={[styles.statCard, styles.statCardStaff]}>
          <Text style={styles.statNumber}>
            {staffs.filter(s => s.role === "STAFF").length}
          </Text>
          <Text style={styles.statLabel}>Nhân viên</Text>
        </View>
      </View>

      <FlatList
        data={staffs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const roleBadge = getRoleBadge(item.role);
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {item.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>✉️ {item.email}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <View style={[styles.roleBadge, { backgroundColor: roleBadge.color }]}>
                  <Text style={styles.roleIcon}>{roleBadge.icon}</Text>
                  <Text style={styles.roleText}>{roleBadge.text}</Text>
                </View>
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
    backgroundColor: "#9b59b6",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#9b59b6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardAdmin: {
    backgroundColor: "#e74c3c",
    shadowColor: "#e74c3c",
  },
  statCardStaff: {
    backgroundColor: "#27ae60",
    shadowColor: "#27ae60",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 11,
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
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  cardInfo: {
    flex: 1,
  },
  name: { 
    fontSize: 18, 
    fontWeight: "700",
    color: "#2c3e50",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleIcon: {
    fontSize: 14,
  },
  roleText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});