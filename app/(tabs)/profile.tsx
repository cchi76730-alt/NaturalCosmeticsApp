import { StyleSheet, Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 Tài khoản của tôi</Text>
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
  text: {
    color: "#FFB6C1",
    fontSize: 22,
    fontWeight: "bold",
  },
});
