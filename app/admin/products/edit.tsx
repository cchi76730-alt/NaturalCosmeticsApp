import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateProduct } from "../../services/admin.product.service";
import { getCategories } from "../../services/category.service";
import { getProductById } from "../../services/product.service";

export default function EditProductScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  /* ================= LOAD DATA ================= */
  const loadData = async () => {
    try {
      setLoading(true);

      const [categoriesData, productData] = await Promise.all([
        getCategories(),
        getProductById(Number(id)),
      ]);

      setCategories(categoriesData);
      setName(productData.name);
      setPrice(productData.price.toString());
      setStock(productData.stock?.toString() || "0");
      setImage(productData.image || "");
      setCategoryId(
        productData.category?.id || categoriesData[0]?.id || 0
      );

      console.log("✅ Loaded product:", productData);
    } catch (error) {
      console.error("❌ Lỗi load data:", error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sản phẩm", [
        { text: "Quay lại", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUBMIT ================= */
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
      setSaving(true);

      const productData = {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        image: image.trim(),
        categoryId: categoryId,
      };

      console.log("📤 Updating product:", productData);

      await updateProduct(Number(id), productData);

      /* ✅ ALERT CHẠY ĐÚNG WEB + MOBILE */
      if (Platform.OS === "web") {
        window.alert("✅ Sản phẩm đã được cập nhật thành công");
        router.replace("/admin/products");
      } else {
        Alert.alert(
          "✅ Thành công",
          "Sản phẩm đã được cập nhật thành công",
          [
            {
              text: "OK",
              onPress: () => router.replace("/admin/products"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("❌ Lỗi update product:", error);
      Alert.alert("❌ Lỗi", "Cập nhật sản phẩm thất bại");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */
  if (!id) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>⚠️ Không tìm thấy ID sản phẩm</Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={styles.btnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#FF1493" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  /* ================= RENDER ================= */
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>✏️ Chỉnh sửa sản phẩm #{id}</Text>

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
            selectedValue={categoryId}
            onValueChange={(v) => setCategoryId(Number(v))}
            style={styles.picker}
          >
            <Picker.Item label="-- Chọn danh mục --" value={0} />
            {categories.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.btn, styles.cancelBtn]}
            onPress={() => router.back()}
            disabled={saving}
          >
            <Text style={styles.btnText}>❌ Hủy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.saveBtn]}
            onPress={handleSubmit}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>💾 Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },
  content: {
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
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#2a002a",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#3a003a",
  },
  pickerBox: {
    backgroundColor: "#2a002a",
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#3a003a",
    overflow: "hidden",
  },
  picker: {
    color: "#fff",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#6b7280",
  },
  saveBtn: {
    backgroundColor: "#FF1493",
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
    marginBottom: 20,
  },
});
