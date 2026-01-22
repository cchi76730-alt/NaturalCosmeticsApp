import { ScrollView, StyleSheet, Text, View } from "react-native";

/* ===== TYPE ===== */
type FAQ = {
  id: number;
  question: string;
  answer: string;
};

/* ===== MOCK DATA ===== */
const faqs: FAQ[] = [
  {
    id: 1,
    question: "Làm sao để đặt hàng?",
    answer: "Chọn sản phẩm → Thêm vào giỏ → Thanh toán.",
  },
  {
    id: 2,
    question: "Bao lâu thì nhận được hàng?",
    answer: "Thông thường từ 2–4 ngày làm việc.",
  },
  {
    id: 3,
    question: "Tôi có thể hủy đơn không?",
    answer: "Có, nếu đơn hàng chưa được xử lý.",
  },
  {
    id: 4,
    question: "Liên hệ CSKH ở đâu?",
    answer: "Hotline: 1900 9999 hoặc email support@cindybeauty.vn",
  },
];

export default function SupportScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>❓ Trợ giúp & Hỗ trợ</Text>

      {faqs.map((item: FAQ) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.question}>❔ {item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      ))}

      <View style={styles.contact}>
        <Text style={styles.contactTitle}>📞 Liên hệ trực tiếp</Text>
        <Text style={styles.contactText}>Hotline: 1900 9999</Text>
        <Text style={styles.contactText}>Email: support@cindybeauty.vn</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a001a", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  card: { backgroundColor: "#2a002a", borderRadius: 12, padding: 16, marginBottom: 12 },
  question: { color: "#FF1493", fontWeight: "bold", marginBottom: 6 },
  answer: { color: "#aaa", lineHeight: 20 },
  contact: { marginTop: 24, padding: 16, backgroundColor: "#3a003a", borderRadius: 12 },
  contactTitle: { color: "#fff", fontWeight: "bold", marginBottom: 8 },
  contactText: { color: "#aaa" },
});
