import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { createProduct } from "./services/admin.product.service";

export default function AddProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async () => {
    if (!name || !price || !category) {
      Alert.alert("⚠️ Thiếu dữ liệu", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      await createProduct({
        name,
        price: Number(price),
        stock: stock ? Number(stock) : 0,
        image,
        category: {
          id: Number(category), // ✅ ĐÚNG KIỂU
        },
      });

      Alert.alert("✅ Thành công", "Đã thêm sản phẩm");

      setName("");
      setPrice("");
      setStock("");
      setImage("");
      setCategory("");
    } catch (err) {
      console.error("Create product error:", err);
      Alert.alert("❌ Lỗi", "Không thêm được sản phẩm");
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Tên sản phẩm" value={name} onChangeText={setName} />
      <TextInput placeholder="Giá" keyboardType="numeric" value={price} onChangeText={setPrice} />
      <TextInput placeholder="Số lượng" keyboardType="numeric" value={stock} onChangeText={setStock} />
      <TextInput placeholder="Ảnh" value={image} onChangeText={setImage} />
      <TextInput placeholder="Category ID" keyboardType="numeric" value={category} onChangeText={setCategory} />

      <Button title="Thêm sản phẩm" onPress={handleSubmit} />
    </View>
  );
}
