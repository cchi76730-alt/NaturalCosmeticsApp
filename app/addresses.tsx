import { useRouter } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/* ===== TYPE ===== */
type Address = {
  id: number;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
};

/* ===== MOCK DATA ===== */
const mockAddresses: Address[] = [
  {
    id: 1,
    name: "Tô Thị Mai Chi",
    phone: "0909 123 456",
    address: "123 Nguyễn Trãi, Phường 7, Quận 5, TP.HCM",
    isDefault: true,
  },
  {
    id: 2,
    name: "Mai Chi",
    phone: "0988 222 333",
    address: "45 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
    isDefault: false,
  },
];

export default function AddressScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Địa chỉ giao hàng</Text>

      <FlatList
        data={mockAddresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              {item.isDefault && <Text style={styles.default}>Mặc định</Text>}
            </View>

            <Text style={styles.text}>📞 {item.phone}</Text>
            <Text style={styles.text}>🏠 {item.address}</Text>

            <View style={styles.actions}>
              <TouchableOpacity>
                <Text style={styles.action}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={[styles.action, { color: "#FF4500" }]}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addText}>+ Thêm địa chỉ mới</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a001a", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: { backgroundColor: "#2a002a", borderRadius: 12, padding: 16, marginBottom: 12 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  name: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  default: { color: "#00FF7F", fontSize: 12 },
  text: { color: "#aaa", marginTop: 4 },
  actions: { flexDirection: "row", marginTop: 10 },
  action: { marginRight: 16, color: "#FF1493", fontWeight: "600" },
  addBtn: { marginTop: 16, backgroundColor: "#FF1493", padding: 14, borderRadius: 24 },
  addText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
});
