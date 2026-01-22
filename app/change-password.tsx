import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "./components/context/AuthContext"; // ✅ IMPORT useAuth
import { changePassword } from "./services/profile.service";

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user } = useAuth();  // ✅ LẤY USER

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    // ✅ KIỂM TRA USER
    if (!user) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập");
      return;
    }

    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu mới không khớp");
      return;
    }

    try {
      setLoading(true);
      await changePassword({
        userId: user.id,  // ✅ GỬI userId
        oldPassword,
        newPassword,
      });

      Alert.alert(
        "Thành công",
        "Đổi mật khẩu thành công",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );

      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert(
        "Lỗi",
        err?.response?.data || "Đổi mật khẩu thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🔑 Đổi mật khẩu</Text>
          <Text style={styles.subtitle}>
            Cập nhật mật khẩu để bảo mật tài khoản
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          {/* Mật khẩu hiện tại */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔒 Mật khẩu hiện tại</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#888"
                secureTextEntry={!showOld}
                style={styles.input}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowOld(!showOld)}
              >
                <Text style={styles.eyeIcon}>{showOld ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mật khẩu mới */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔑 Mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                placeholderTextColor="#888"
                secureTextEntry={!showNew}
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowNew(!showNew)}
              >
                <Text style={styles.eyeIcon}>{showNew ? "👁️" : "👁️‍🗨️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Xác nhận mật khẩu */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>✅ Xác nhận mật khẩu mới</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#888"
                secureTextEntry={!showConfirm}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirm(!showConfirm)}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirm ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Lưu ý bảo mật:</Text>
            <Text style={styles.infoText}>
              • Mật khẩu phải có ít nhất 6 ký tự{"\n"}
              • Không chia sẻ mật khẩu với người khác{"\n"}
              • Nên đổi mật khẩu định kỳ
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "⏳ Đang xử lý..." : "✓ Cập nhật mật khẩu"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Hủy bỏ</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },

  // Header
  header: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    color: "#FF69B4",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FF1493",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
  },

  // Form
  formSection: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#FF69B4",
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a002a",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#3a003a",
  },
  input: {
    flex: 1,
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
    paddingRight: 16,
  },
  eyeIcon: {
    fontSize: 20,
  },

  // Info Card
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#2a002a",
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FF69B4",
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    color: "#FF69B4",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 6,
  },
  infoText: {
    color: "#ccc",
    fontSize: 13,
    lineHeight: 20,
  },

  // Buttons
  buttonGroup: {
    paddingHorizontal: 20,
    gap: 12,
  },
  button: {
    backgroundColor: "#FF1493",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
  cancelButton: {
    backgroundColor: "#2a002a",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3a003a",
  },
  cancelText: {
    color: "#aaa",
    fontWeight: "600",
    fontSize: 16,
  },
});