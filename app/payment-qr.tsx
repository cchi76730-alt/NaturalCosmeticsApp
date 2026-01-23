import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function PaymentQRScreen() {
  const router = useRouter();
  const { amount } = useLocalSearchParams<{ amount?: string }>();

  const qrValue = JSON.stringify({
    bank: "MB BANK",
    account: "0123456789",
    name: "SHOP MY PHAM DEMO",
    amount,
    note: "Thanh toan don hang",
  });

  const handlePaid = () => {
    Alert.alert("✅ Thanh toán thành công", "Đây là thanh toán giả lập");
    router.replace("/orders");
  };

  return (
    <LinearGradient
      colors={["#1a001a", "#2d0a2d", "#1a001a"]}
      style={styles.container}
    >
      <View style={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.headerIcon}>💳</Text>
        <Text style={styles.title}>Thanh toán QR Code</Text>
        <Text style={styles.subtitle}>Quét mã để hoàn tất giao dịch</Text>
      </View>

      <View style={styles.qrContainer}>
        <View style={styles.qrWrapper}>
          <QRCode value={qrValue} size={240} backgroundColor="#fff" />
        </View>
        
        <View style={styles.bankInfo}>
          <View style={styles.bankLogo}>
            <Text style={styles.bankLogoText}>MB</Text>
          </View>
          <View>
            <Text style={styles.bankName}>MB BANK</Text>
            <Text style={styles.accountNumber}>0123456789</Text>
          </View>
        </View>
      </View>

      <View style={styles.amountContainer}>
        <Text style={styles.amountLabel}>Số tiền thanh toán</Text>
        <Text style={styles.amount}>
          {Number(amount).toLocaleString()} đ
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ️ Đây là QR code giả lập cho mục đích demo
        </Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handlePaid}>
        <LinearGradient
          colors={["#FF1493", "#FF69B4"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.btnGradient}
        >
          <Text style={styles.btnText}>✅ XÁC NHẬN ĐÃ THANH TOÁN</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelBtn} 
        onPress={() => router.back()}
      >
        <Text style={styles.cancelText}>Hủy giao dịch</Text>
      </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    color: "#FF69B4",
    fontSize: 14,
    fontWeight: "500",
  },
  qrContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 180, 0.2)",
  },
  qrWrapper: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  bankInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#0066CC",
    alignItems: "center",
    justifyContent: "center",
  },
  bankLogoText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  bankName: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  accountNumber: {
    color: "#FF69B4",
    fontSize: 12,
    marginTop: 2,
  },
  amountContainer: {
    backgroundColor: "rgba(255, 20, 147, 0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 180, 0.3)",
  },
  amountLabel: {
    color: "#aaa",
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amount: {
    color: "#FF1493",
    fontSize: 32,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 3,
    borderLeftColor: "#FF69B4",
  },
  infoText: {
    color: "#ccc",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
  btn: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  cancelBtn: {
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: {
    color: "#888",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});