import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { useAuth } from "./components/context/AuthContext";
import { useCart } from "./components/context/CartContext";
import { useOrders } from "./components/context/OrderContext";
import { createOrder } from "./services/order.service";


const getLocalImage = (image?: string) => {
  switch (image) {
    case "sua-rua-mat.jpg":
      return require("../assets/images/sua-rua-mat.jpg");
    case "chong-nang.jpg":
      return require("../assets/images/chong-nang.jpg");
    case "son_ruby_rose.jpg":
      return require("../assets/images/son_ruby_rose.jpg");
    case "mascara.jpg":
      return require("../assets/images/mascara.jpg");
    case "kem-duong-am.jpg":
      return require("../assets/images/kem-duong-am.jpg");
    case "dau-goi.jpg":
      return require("../assets/images/dau-goi.jpg");
    case "sua-tam.jpg":
      return require("../assets/images/sua-tam.jpg");
    case "nuoc-hoa-nu.jpg":
      return require("../assets/images/nuoc-hoa-nu.jpg");
    case "nuoc-hoa-nam.jpg":
      return require("../assets/images/nuoc-hoa-nam.jpg");
    case "kem-duong- the.jpg":
      return require("../assets/images/kem-duong- the.jpg");
    case "nuoc-tay-trang.jpg":
      return require("../assets/images/nuoc-tay-trang.jpg");
    default:
      return require("../assets/images/sua-rua-mat.jpg");
  }
};

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { addOrder } = useOrders();


  const handleOrder = async () => {
    if (!user) {
      Alert.alert("❌ Chưa đăng nhập", "Vui lòng đăng nhập để đặt hàng");
      router.push("/(auth)/login");
      return;
    }

    if (!name || !phone || !address) {
      Alert.alert("⚠️ Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (items.length === 0) {
      Alert.alert("⚠️ Giỏ hàng trống");
      return;
    }

    try {
      await createOrder({
        userId: user.id,
        customerName: name,
        phone,
        address,
        totalPrice,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          price: i.product.price,
        })),
      });

      addOrder({
  id: Date.now(), // tạm thời
  totalPrice,
  createdAt: new Date().toLocaleString(),
  items,
});

      Alert.alert("🎉 Thành công", "Đặt hàng thành công!");
      clearCart();
      router.replace("/orders");
    } catch (error) {
      console.error(error);
      Alert.alert("❌ Lỗi", "Không thể đặt hàng");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Thanh toán</Text>

      <FlatList
        data={items}
        keyExtractor={(i) => i.product.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image
              source={getLocalImage(item.product.image)}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.name}>{item.product.name}</Text>
            <Text style={styles.qty}>x{item.quantity}</Text>
            <Text style={styles.price}>
              {(item.product.price * item.quantity).toLocaleString()} đ
            </Text>
          </View>
        )}
      />

      <View style={styles.totalBox}>
        <Text style={styles.totalText}>Tổng tiền:</Text>
        <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} đ</Text>
      </View>

      <Text style={styles.section}>Thông tin giao hàng</Text>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Địa chỉ giao hàng"
        placeholderTextColor="#aaa"
        multiline
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
        <Text style={styles.orderText}>ĐẶT HÀNG</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
marginBottom: 20,   // giảm từ 35 xuống 20
  marginTop: 50,   },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#333",
    paddingVertical: 50,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    borderRadius: 6,
  },
  name: { color: "#fff", flex: 1 },
  qty: { color: "#FF69B4", width: 40 },
  price: { color: "#fff" },

  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  totalText: { color: "#fff", fontSize: 16 },
  totalPrice: {
    color: "#FF1493",
    fontSize: 18,
    fontWeight: "bold",
  },

  section: {
    color: "#FFB6C1",
    marginBottom: 8,
    fontWeight: "600",
  },

  input: {
    backgroundColor: "#2a002a",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },

  orderBtn: {
    backgroundColor: "#FF1493",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  orderText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
