import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BannerSlider from "../components/BannerSlider";
import { registerApi } from "../services/auth.service";

export default function SignUpScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    console.log("📝 ===== REGISTER CALLED =====");
    console.log("Username:", username);
    
    // Validate
    if (!username || !password || !confirmPassword) {
      console.log("⚠️ Empty fields");
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      console.log("⚠️ Password mismatch");
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    
    try {
      console.log("⏳ Calling registerApi...");
      const result = await registerApi(
        username,
        password,
        `${username}@gmail.com`
      );
      
      console.log("✅ Register result:", result);

      if (result && result.id) {
        console.log("✅ Registration successful");
        Alert.alert("Thành công", "Đăng ký thành công!", [
          {
            text: "OK",
            onPress: () => {
              console.log("🔙 Going back to login");
              router.back();
            }
          }
        ]);
      } else {
        console.log("⚠️ No ID in result");
        Alert.alert("Lỗi", "Username đã tồn tại");
      }
    } catch (err: any) {
      console.error("❌ ===== REGISTER ERROR =====");
      console.error("Error:", err);
      console.error("Error type:", typeof err);
      
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
        Alert.alert(
          "Lỗi",
          err.response.data?.message || "Đăng ký thất bại"
        );
      } else if (err.request) {
        console.error("No response received");
        Alert.alert("Lỗi kết nối", "Không thể kết nối đến server");
      } else {
        console.error("Other error:", err.message);
        Alert.alert("Lỗi", err.message);
      }
      console.error("============================");
    } finally {
      console.log("🏁 Register process finished");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a001a", "#330033"]}
        style={StyleSheet.absoluteFillObject}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.bannerWrapper}>
          <BannerSlider />
        </View>

        <Text style={styles.title}>TẠO TÀI KHOẢN</Text>

        <View style={styles.iconContainer}>
          <Text style={styles.musicIcon}>💄</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="👤 Tên tài khoản"
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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="🔒 Nhập lại mật khẩu"
          placeholderTextColor="#FFB6C1"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          editable={!loading}
        />

        <TouchableOpacity 
          style={[styles.button, loading && { opacity: 0.6 }]} 
          onPress={handleSignUp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "ĐANG ĐĂNG KÝ..." : "ĐĂNG KÝ"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => router.back()}
          disabled={loading}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>
            Đã có tài khoản? Đăng nhập
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  bannerWrapper: {
    width: "100%",
    height: 200,
    overflow: "hidden",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#FF66B2",
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
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
  button: {
    backgroundColor: "#FF1493",
    padding: 18,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
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
    textAlign: "center",
  },
});