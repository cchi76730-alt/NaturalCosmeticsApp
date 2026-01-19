import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const menus = [
  {
    label: "Tổng quan",
    path: "/admin/dashboard",
    icon: <Ionicons name="speedometer-outline" size={20} color="#dcdde1" />,
  },
  {
    label: "Sản phẩm",
    path: "/admin/products",
    icon: <Ionicons name="pricetags-outline" size={20} color="#dcdde1" />,
  },
  {
    label: "Đơn hàng",
    path: "/admin/orders",
    icon: <Ionicons name="receipt-outline" size={20} color="#dcdde1" />,
  },
  {
    label: "Kho hàng",
    path: "/admin/inventory",
    icon: <MaterialIcons name="warehouse" size={20} color="#dcdde1" />,
  },
  {
    label: "Nhân viên",
    path: "/admin/staffs",
    icon: <Ionicons name="people-outline" size={20} color="#dcdde1" />,
  },
  {
    label: "Báo cáo",
    path: "/admin/reports",
    icon: <Ionicons name="bar-chart-outline" size={20} color="#dcdde1" />,
  },
] as const;

export default function AdminMenu() {
  const pathname = usePathname();

  return (
    <View style={styles.menu}>
      <Text style={styles.logo}>ADMIN</Text>

      {menus.map((m) => {
        const active = pathname.startsWith(m.path);
        return (
          <TouchableOpacity
            key={m.path}
            style={[styles.item, active && styles.active]}
            onPress={() => router.replace(m.path)}
          >
            <View style={styles.row}>
              {m.icon}
              <Text style={[styles.text, active && styles.activeText]}>
                {m.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  menu: {
    width: 240,
    backgroundColor: "#1e272e",
    paddingTop: 30,
    height: "100%", // ✅ sticky
  },
  logo: {
    color: "#00a8ff",
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  active: {
    backgroundColor: "#2f3640",
    borderLeftWidth: 4,
    borderLeftColor: "#00a8ff",
  },
  text: {
    color: "#dcdde1",
    fontSize: 15,
  },
  activeText: {
    color: "#00a8ff",
    fontWeight: "bold",
  },
});
