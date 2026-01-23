import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎉</Text>
      <Text style={styles.text}>Thanh toán thành công</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.replace("/orders")}
      >
        <Text style={styles.btnText}>XEM ĐƠN HÀNG</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: { fontSize: 60 },
  text: {
    color: "#fff",
    fontSize: 22,
    marginVertical: 16,
  },
  btn: {
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 12,
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
