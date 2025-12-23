import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BannerSlider from "../components/BannerSlider";
import { loginApi } from "../services/auth.service";

/* ALERT DÙNG CHUNG */
const showAlert = (title: string, message?: string) => {
  if (Platform.OS === "web") {
    window.alert(message ? `${title}\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
};

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const testButton = () => {
    console.log("=== BUTTON CLICKED ===");
    showAlert("Success", "Button works!");
  };

  const handleLogin = async () => {
    console.log("🔑 ===== LOGIN CLICKED =====");

    if (!username.trim() || !password.trim()) {
      showAlert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    try {
      const user = await loginApi(username, password);
      console.log("Got user:", user);

      if (user?.id) {
        showAlert("Thành công", "Đăng nhập thành công!");
        router.replace("/(tabs)");
      } else {
        showAlert("Lỗi", "Đăng nhập thất bại");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      if (err.response) {
        showAlert("Lỗi", "Sai tài khoản hoặc mật khẩu");
      } else {
        showAlert("Lỗi kết nối", "Không thể kết nối server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <BannerSlider />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>ĐĂNG NHẬP</Text>

        <TextInput
          style={styles.input}
          placeholder="👤 Tài khoản"
          placeholderTextColor="#FFB6C1"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="🔒 Mật khẩu"
          placeholderTextColor="#FFB6C1"
          secureTextEntry={Platform.OS !== "web"} 
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          disabled={loading}
        >
          <Text style={styles.forgotText}>🔑 Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.testButton]}
          onPress={testButton}
        >
          <Text style={styles.buttonText}>✅ TEST BUTTON</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.loginButton,
            loading && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "ĐANG ĐĂNG NHẬP..." : "🔑 ĐĂNG NHẬP"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Chưa có tài khoản? Đăng ký ngay
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>NATURAL COSMETICS</Text>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },
  bannerWrapper: {
    width: "100%",
    height: 200,
    overflow: "hidden",
  },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40, // Thêm padding để tránh bị che
  },
  title: {
    fontSize: 32,
    color: "#FF66B2",
    marginBottom: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    marginBottom: 20,
  },
  musicIcon: {
    fontSize: 50,
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,102,178,0.1)",
    padding: 18,
    borderRadius: 15,
    color: "#fff",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#FF66B2",
  },
  forgotButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  forgotText: {
    color: "#FFB6C1",
  },
  button: {
    padding: 18,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    zIndex: 999, // ĐẢM BẢO BUTTON Ở TRÊN CÙNG
    elevation: 999, // Cho Android
  },
  testButton: {
    backgroundColor: "#4CAF50",
  },
  loginButton: {
    backgroundColor: "#FF1493",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkButton: {
    marginTop: 20,
  },
  linkText: {
    color: "#FFB6C1",
  },
  footerText: {
    // KHÔNG DÙNG position: absolute
    marginTop: 30,
    color: "#FF66B2",
    opacity: 0.7,
    textAlign: "center",
  },
});