import { Image } from "react-native";
import BannerSlider from "../components/BannerSlider";

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

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // 1. Kiểm tra tài khoản
    if (username === "admin" && password === "123") {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        "Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!"
      );

      // (Mẹo nhỏ) Nên xóa mật khẩu đi để người dùng nhập lại cho tiện
      setPassword("");
    }
  };

  return (

    
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientBg} />
      <View style={styles.bannerWrapper}>
  <BannerSlider />
</View>



      <View style={styles.content}>
        <Text style={styles.title}>ĐĂNG NHẬP</Text>
        
        {/* Logo hoặc icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.musicIcon}>💄</Text>
        </View>
        
<TextInput
  style={styles.input}
  placeholder="👤 Tài khoản (admin)"
  placeholderTextColor="#FFB6C1"
  value={username}
  onChangeText={setUsername}
/>

<TextInput
  style={styles.input}
  placeholder="🔒 Mật khẩu (123)"
  placeholderTextColor="#FFB6C1"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>



        <TouchableOpacity
  onPress={() => router.push("/(auth)/forgot-password")}
  style={{ marginTop: 10 }}
>
  <Text style={{ color: "#FFB6C1", fontSize: 15 }}>🔑 Quên mật khẩu?</Text>
</TouchableOpacity>

        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký ngay</Text>
        </TouchableOpacity>
        
        {/* Footer */}
        <Text style={styles.footerText}>NATURAL COSMETICS</Text>
      </View>
    </View>
  );

  

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a", 
  },
  gradientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "linear-gradient(180deg, #1a001a 0%, #330033 100%)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#FF66B2", // Màu hồng neon
    textShadowColor: "rgba(255, 102, 178, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 1.5,
  },
  iconContainer: {
    marginBottom: 30,
  },
  musicIcon: {
    fontSize: 50,
    color: "#FF66B2",
  },
  inputContainer: { 
    width: "100%", 
    gap: 20,
    marginBottom: 30,
  },
  input: {
  backgroundColor: "rgba(255, 102, 178, 0.1)",
  padding: 22,              
  height: 60,               
  borderRadius: 15,
  color: "#FFFFFF",
  fontSize: 18,             
  borderWidth: 1,
  borderColor: "#FF66B2",
  shadowColor: "#FF66B2",
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 5,
  width: "100%",            
},

  button: {
    backgroundColor: "#FF1493", 
    padding: 18,
    borderRadius: 15,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#FF1493",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: { 
    color: "#FFFFFF", 
    fontWeight: "bold", 
    fontSize: 18,
    letterSpacing: 1,
  },
  linkButton: { 
    marginTop: 25,
    padding: 10,
  },
  linkText: { 
    color: "#FFB6C1", 
    fontSize: 16, 
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  footerText: {
    position: "absolute",
    bottom: 40,
    color: "#FF66B2",
    fontSize: 14,
    opacity: 0.7,
    fontStyle: "italic",
  },
  banner: {
  width: "100%",
  height: 150,
  resizeMode: "cover",
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  marginBottom: 20,
},
bannerWrapper: {
  width: "100%",
  height: 200,
  overflow: "hidden",
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  marginBottom: 5,
},


});

