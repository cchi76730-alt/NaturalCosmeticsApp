import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PaymentQRScreen() {
  const router = useRouter();
  const { amount } = useLocalSearchParams<{ amount?: string }>();

  const safeAmount = amount ?? "0";

  // ✅ THÔNG TIN THANH TOÁN THẬT
  const BANK_CODE = "MB";
  const ACCOUNT_NO = "0123456789"; // ← đổi thành STK thật
  const ACCOUNT_NAME = "NGUYEN VAN A"; // ← đổi thành tên thật
  const ADD_INFO = "Thanh toan don hang";

  // ✅ VIETQR CHUẨN – APP NGÂN HÀNG QUÉT ĐƯỢC
  const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NO}-compact.png?amount=${safeAmount}&addInfo=${encodeURIComponent(
    ADD_INFO
  )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

  const handlePaid = () => {
    Alert.alert("✅ Thanh toán thành công", "Thanh toán demo");
    router.replace("/orders");
  };

  return (
    <LinearGradient
      colors={["#1a001a", "#2d0a2d", "#1a001a"]}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerIcon}>💳</Text>
          <Text style={styles.title}>Thanh toán QR Code</Text>
          <Text style={styles.subtitle}>Quét mã để hoàn tất giao dịch</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrWrapper}>
            {/* ✅ QR NGÂN HÀNG THẬT */}
            <Image
              source={{ uri: qrUrl }}
              style={{ width: 240, height: 240 }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.bankInfo}>
            <View style={styles.bankLogo}>
              <Text style={styles.bankLogoText}>MB</Text>
            </View>
            <View>
              <Text style={styles.bankName}>MB BANK</Text>
              <Text style={styles.accountNumber}>{ACCOUNT_NO}</Text>
              <Text style={styles.accountName}>{ACCOUNT_NAME}</Text>
            </View>
          </View>
        </View>

        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Số tiền thanh toán</Text>
          <Text style={styles.amount}>
            {Number(safeAmount).toLocaleString()} đ
          </Text>
        </View>

        <TouchableOpacity style={styles.btn} onPress={handlePaid}>
          <LinearGradient
            colors={["#FF1493", "#FF69B4"]}
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
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: { alignItems: "center", marginBottom: 30 },
  headerIcon: { fontSize: 50 },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  subtitle: { color: "#FF69B4", fontSize: 14 },

  qrContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },
  qrWrapper: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },

  bankInfo: { flexDirection: "row", gap: 12, alignItems: "center" },
  bankLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#0066CC",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bankLogoText: { color: "#fff", fontWeight: "bold" },
  bankName: { color: "#fff", fontWeight: "bold" },
  accountNumber: { color: "#FF69B4", fontSize: 12 },
  accountName: { color: "#ccc", fontSize: 12 },

  amountContainer: {
    backgroundColor: "rgba(255,20,147,0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  amountLabel: { color: "#aaa" },
  amount: { color: "#FF1493", fontSize: 32, fontWeight: "bold" },

  btn: { borderRadius: 14, overflow: "hidden", marginBottom: 12 },
  btnGradient: { paddingVertical: 16, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  cancelBtn: { alignItems: "center" },
  cancelText: { color: "#888", textDecorationLine: "underline" },
});
