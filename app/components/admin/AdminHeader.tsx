import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function AdminHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>ADMIN PANEL</Text>
      <TouchableOpacity>
        <Text style={styles.logout}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#273c75",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logout: {
    color: "#fbc531",
    fontSize: 14,
  },
});
