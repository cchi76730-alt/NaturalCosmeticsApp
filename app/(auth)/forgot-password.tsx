import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const [input, setInput] = useState(""); // nhập sdt hoặc email

  const handleSendCode = () => {
    if (input.trim() === "") {
      Alert.alert("Lỗi", "Vui lòng nhập Email hoặc Số điện thoại!");
      return;
    }

    Alert.alert(
      "Thành công",
      `Mã khôi phục đã được gửi đến: ${input}`
    );

    // Bạn có thể chuyển sang trang nhập mã OTP nếu muốn
  };

  return (
    <LinearGradient
      colors={['#330033', '#660066', '#990099']}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Tiêu đề + Emoji */}
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.emoji}>🗝️</Text>

        {/* Thông tin hướng dẫn */}
        <Text style={styles.infoText}>
          Nhập Email hoặc Số điện thoại mà bạn đã đăng ký tài khoản.{"\n"}
          Chúng tôi sẽ gửi mã khôi phục để bạn đặt lại mật khẩu.
        </Text>

        {/* Input với icon */}
        <View style={styles.inputWrapper}>
          <Text style={styles.inputEmoji}>✉️</Text>
          <TextInput
            style={styles.input}
            placeholder="Email hoặc Số điện thoại"
            placeholderTextColor="#FFB6C1"
            value={input}
            onChangeText={setInput}
          />
        </View>

        {/* Button gradient gửi mã */}
        <TouchableOpacity activeOpacity={0.8} onPress={handleSendCode}>
          <LinearGradient
            colors={['#FF1493', '#FF66B2']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Gửi mã khôi phục</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  content: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF1493", // hồng đỏ
    marginBottom: 10,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  emoji: {
    fontSize: 45,
    marginBottom: 20,
  },
  infoText: {
    color: "#FFD1E8",
    textAlign: "center",
    fontSize: 15,
    marginBottom: 25,
    lineHeight: 22,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 25,
    backgroundColor: "rgba(255, 20, 147, 0.15)",
    borderWidth: 1,
    borderColor: "#FF1493",
    shadowColor: "#FF1493",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  inputEmoji: {
    fontSize: 25,
    marginRight: 10,
    color: "#FFB6C1",
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#FF1493",
    shadowOpacity: 0.4,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 1,
  },
  backButton: {
    marginTop: 10,
  },
  backText: {
    color: "#FFB6C1",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
