import { Slot } from "expo-router";
import {
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import AdminMenu from "../components/admin/AdminMenu";

export default function AdminLayout() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View
      style={[
        styles.container,
        { flexDirection: isMobile ? "column" : "row" },
      ]}
    >
      {/* 👉 CHỈ HIỆN MENU KHI KHÔNG PHẢI MOBILE */}
      {!isMobile && <AdminMenu />}

      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6fa",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
