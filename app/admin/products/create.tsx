import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createProduct } from "../../services/admin.product.service";
import { getCategories } from "../../services/category.service";

export default function CreateProductScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0); // ✅ Đổi thành 0 thay vì null
const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // ✅ Thêm loading state

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
  try {
    setLoading(true);
    const res = await getCategories();

    // 🔥 QUAN TRỌNG: ép về mảng
    const data = Array.isArray(res) ? res : res.data || [];

    setCategories(data);

    if (data.length > 0) {
      setCategoryId(data[0].id); // ✅ đảm bảo != 0
    }
  } catch (error) {
    console.error("Lỗi load categories:", error);
    Alert.alert("Lỗi", "Không tải được danh mục");
  } finally {
    setLoading(false);
  }
};


const handleSubmit = async () => {
  if (!name.trim()) {
    Alert.alert("Lỗi", "Vui lòng nhập tên sản phẩm");
    return;
  }

  if (!price || Number(price) <= 0) {
    Alert.alert("Lỗi", "Giá phải lớn hơn 0");
    return;
  }

  if (!stock || Number(stock) < 0) {
    Alert.alert("Lỗi", "Số lượng không được âm");
    return;
  }

  if (!categoryId || categoryId === 0) {
    Alert.alert("Lỗi", "Vui lòng chọn danh mục");
    return;
  }

  try {
    const productData = {
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      image: image.trim(),
      category: {
        id: categoryId,
      },
    };

    await createProduct(productData);

    Alert.alert(
  "✅ Thành công",
  "Đã thêm sản phẩm thành công",
  [
    {
      text: "OK",
      onPress: () => {
        setTimeout(() => {
          router.push("/admin/products");
        }, 100);
      },
    },
  ],
  { cancelable: false }
);

  } catch (error) {
    console.error("❌ Lỗi create product:", error);
    Alert.alert("❌ Lỗi", "Thêm sản phẩm thất bại");
  }
};



  // ✅ Hiển thị loading khi đang tải categories
  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF1493" />
        <Text style={styles.loadingText}>Đang tải danh mục...</Text>
      </View>
    );
  }

  // ✅ Hiển thị thông báo nếu không có categories
  if (categories.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️ Không có danh mục nào</Text>
        <Text style={styles.errorSubText}>
          Vui lòng thêm danh mục trước khi tạo sản phẩm
        </Text>
        <TouchableOpacity 
          style={styles.btn} 
          onPress={() => router.back()}
        >
          <Text style={styles.btnText}>QUAY LẠI</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Thêm sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Giá"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Số lượng"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <TextInput
        style={styles.input}
        placeholder="Tên ảnh (vd: son.jpg)"
        placeholderTextColor="#888"
        value={image}
        onChangeText={setImage}
      />

      <View style={styles.pickerBox}>
        <Picker
          selectedValue={categoryId || categories[0]?.id} // ✅ Fallback nếu categoryId = 0
          onValueChange={(v) => setCategoryId(Number(v))} // ✅ Đảm bảo convert sang number
          style={styles.picker}
        >
          {/* ✅ Thêm option mặc định */}
          {categoryId === 0 && (
            <Picker.Item label="-- Chọn danh mục --" value={0} />
          )}
          {categories.map((c) => (
            <Picker.Item key={c.id} label={c.name} value={c.id} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
        <Text style={styles.btnText}>💾 LƯU SẢN PHẨM</Text>
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
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#2a002a",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 10,
  },
  pickerBox: {
    backgroundColor: "#2a002a",
    borderRadius: 10,
    marginBottom: 16,
    overflow: "hidden", // ✅ Giúp border radius hoạt động tốt hơn
  },
  picker: {
    color: "#fff",
  },
  btn: {
    backgroundColor: "#FF1493",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    color: "#FF4500",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  errorSubText: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
  },
});