import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform } from "react-native";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { deleteStaff, getStaffs, Staff } from "../../services/admin.staff.service";

export default function StaffIndexScreen() {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    setLoading(true);
    loadStaffs();
  }, [])
);


  const loadStaffs = async () => {
    try {
      const data = await getStaffs();
      setStaffs(data);
    } catch (e) {
      console.log("Load staff error:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 60 }} />;
  }

  const handleDelete = async (id: number) => {
  console.log("DELETE STAFF ID:", id);

  // 🌐 WEB
  if (Platform.OS === "web") {
    const ok = window.confirm("Bạn có chắc muốn xóa nhân viên này?");
    if (!ok) return;

    try {
      await deleteStaff(id);
      alert("Đã xóa nhân viên");
      loadStaffs();
    } catch (error) {
      console.log("DELETE ERROR:", error);
      alert("Không thể xóa");
    }
    return;
  }

  // 📱 MOBILE (Android / iOS)
  Alert.alert(
    "Xác nhận",
    "Bạn có chắc muốn xóa nhân viên này?",
    [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteStaff(id);
            loadStaffs();
          } catch (error) {
            console.log("DELETE ERROR:", error);
            Alert.alert("Lỗi", "Không thể xóa");
          }
        },
      },
    ]
  );
};




  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👥 Quản lý nhân viên</Text>
        <Text style={styles.subtitle}>Danh sách nhân viên</Text>

        <TouchableOpacity
    style={styles.addButton}
    onPress={() => router.push("/admin/staffs/create")}
  >
    <Text style={styles.addButtonText}>➕ Thêm nhân viên</Text>
  </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{staffs.length}</Text>
          <Text style={styles.statLabel}>Nhân viên</Text>
        </View>
      </View>

      <FlatList
        data={staffs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.username.charAt(0)}
                </Text>
              </View>

              <View style={styles.cardInfo}>
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.email}>✉️ {item.email}</Text>
                {!item.active && (
                  <Text style={styles.inactive}>⛔ Đã khóa</Text>
                )}
              </View>
            </View>

            <View style={styles.cardFooter}>
  <View style={styles.roleBadge}>
    <Text>👤</Text>
    <Text style={styles.roleText}>Nhân viên</Text>
  </View>

  <View style={{ flexDirection: "row", gap: 8 }}>
    <TouchableOpacity
      style={styles.editBtn}
      onPress={() =>
        router.push(`/admin/staffs/edit?id=${item.id}`)
      }
    >
      <Text style={styles.btnText}>✏️ Sửa</Text>
    </TouchableOpacity>

    <TouchableOpacity
  style={styles.deleteBtn}
  onPress={() => handleDelete(item.id)}
>
  <Text style={styles.btnText}>🗑️ Xóa</Text>
</TouchableOpacity>
  </View>
</View>

          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#fff",
    padding: 24,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: { fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#7f8c8d" },

  statsContainer: { padding: 20 },
  statCard: {
    backgroundColor: "#27ae60",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statNumber: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  statLabel: { color: "#fff" },

  listContent: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: "row", marginBottom: 12 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cardInfo: { flex: 1 },
  name: { fontSize: 17, fontWeight: "600" },
  email: { color: "#7f8c8d" },
  inactive: { color: "#e74c3c", marginTop: 4 },

  cardFooter: { flexDirection: "row" },
  roleBadge: {
    flexDirection: "row",
    gap: 6,
    backgroundColor: "#27ae60",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: { color: "#fff", fontWeight: "600" },

  addButton: {
  marginTop: 12,
  backgroundColor: "#3498db",
  paddingVertical: 10,
  borderRadius: 12,
  alignItems: "center",
},
addButtonText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 16,
},

editBtn: {
  backgroundColor: "#3498db",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 10,
},

deleteBtn: {
  backgroundColor: "#e74c3c",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 10,
},

btnText: {
  color: "#fff",
  fontWeight: "600",
},

});
