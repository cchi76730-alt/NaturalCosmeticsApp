import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { useAuth } from "./components/context/AuthContext";
import { updateProfile } from "./services/user.service";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        username: user.username ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
      });
    }
  }, [user]);

  const handleSave = async () => {
  if (!user) return;

  try {
    const updatedUser = await updateProfile(user.id, form);
    setUser(updatedUser);
    Alert.alert("Thành công", "Cập nhật thông tin thành công");
    router.back();
  } catch (err) {
    Alert.alert("Lỗi", "Không thể cập nhật thông tin");
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa tài khoản</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
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
        placeholder="Số điện thoại"
        value={form.phone}
        onChangeText={(v) => setForm({ ...form, phone: v })}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2a002a",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    marginBottom: 12,
  },
  saveBtn: {
    backgroundColor: "#FF1493",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
