import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter(); 

  return (
    <ScrollView style={styles.container}>
      {/* Banner */}
      <Image
        source={require("../../assets/images/wellcome1.png")}
        style={styles.banner}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Tiêu đề với màu khác nhau */}
        <Text style={styles.title}>
          <Text style={{ color: "#FFD700" }}>CINDY{"\n"}</Text>
          <Text style={{ color: "#FF1493" }}>BEAUTY</Text>
        </Text>

        {/* Thông tin mô tả */}
        <Text style={styles.subtitle}>
          Chăm sóc làn da tự nhiên với sản phẩm cao cấp, an toàn cho mọi loại da.{"\n"}
          Sản phẩm từ thảo mộc, không hóa chất độc hại, phù hợp cho mọi lứa tuổi.
        </Text>

        {/* Các feature */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💄</Text>
            <Text style={styles.featureText}>Trang điểm tự nhiên</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🌿</Text>
            <Text style={styles.featureText}>Thảo mộc & hữu cơ</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>✨</Text>
            <Text style={styles.featureText}>Da sáng mịn & khỏe</Text>
          </View>
        </View>

        {/* Nút BẮT ĐẦU */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.buttonText}>BẮT ĐẦU</Text>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.footer}>© 2025 NATURAL COSMETICS</Text>
        <Text style={styles.footer}>MaiChi05</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a001a" },

  banner: {
    width: width,
    height: height * 0.5,
    resizeMode: "cover",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  overlay: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: -50,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 16,
    color: "#FFE066",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },

  features: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },

  feature: {
    alignItems: "center",
    flex: 1,
  },

  featureIcon: {
    fontSize: 30,
    marginBottom: 5,
  },

  featureText: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
  },

  button: {
    backgroundColor: "#FF3EB5",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 40,
    shadowColor: "#FF3EB5",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 14,
    elevation: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  footer: {
    color: "#FFB6C1",
    fontSize: 12,
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.7,
  },
});
