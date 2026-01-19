import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { getStaffs, updateStaff } from "../../services/admin.staff.service";

export default function EditStaffScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const staffId = Number(id);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await getStaffs();
      const staff = data.find((s) => s.id === staffId);

      if (!staff) {
        Alert.alert("Lỗi", "Không tìm thấy nhân viên");
        router.back();
        return;
      }

      setForm({
        username: staff.username,
        email: staff.email,
        password: "",
      });
    } catch (e) {
      Alert.alert("Lỗi", "Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.username || !form.email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await updateStaff(staffId, {
        username: form.username,
        email: form.email,
        password: form.password || undefined,
      });

      Alert.alert("Thành công", "Cập nhật nhân viên thành công", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    }
  };

  if (loading) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Sửa nhân viên</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={form.username}
        onChangeText={(v) => setForm({ ...form, username: v })}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => setForm({ ...form, email: v })}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu mới (nếu đổi)"
        secureTextEntry
        value={form.password}
        onChangeText={(v) => setForm({ ...form, password: v })}
      />

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>💾 Lưu thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
