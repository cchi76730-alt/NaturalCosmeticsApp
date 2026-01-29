import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "./components/context/AuthContext";
import { updateProfile } from "./services/user.service";

const BASE_URL = "http://10.18.7.214:8080";


export default function EditProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
  });

  const [avatar, setAvatar] = useState<string | null>(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* Init Data */
  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    });

    setAvatar(user.avatar ?? null);
  }, [user]);

  /* Avatar URI */
  const getAvatarUri = () => {
    if (!avatar) return undefined;
    if (avatar.startsWith("file")) return avatar;
    return `${BASE_URL}${avatar}`;
  };

  /* Pick Image */
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần cấp quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      setRemoveAvatar(false);
    }
  };

  /* Remove Avatar */
  const handleRemoveAvatar = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa ảnh đại diện?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: () => {
            setAvatar(null);
            setRemoveAvatar(true);
          },
        },
      ]
    );
  };

  /* Save Profile */
  const handleSave = async () => {
    if (!user) return;

    // Validation
    if (!form.username.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên người dùng");
      return;
    }

    if (!form.email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("email", form.email);
      formData.append("phone", form.phone);

      if (avatar && avatar.startsWith("file")) {
        formData.append("avatar", {
          uri: Platform.OS === "android" ? avatar : avatar.replace("file://", ""),
          name: "avatar.jpg",
          type: "image/jpeg",
        } as any);
      }

      const updatedUser = await updateProfile(user.id, formData);

      setUser(updatedUser);
      Alert.alert("Thành công", "Cập nhật thông tin thành công", [
        {
          text: "OK",
          onPress: () => router.replace("/profile"),
        },
      ]);
    } catch (err) {
      console.log("UPDATE PROFILE ERROR:", err);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background Effects */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.replace("/profile")}
              style={styles.backButton}
            >
              <Text style={styles.backIcon}>←</Text>
              <Text style={styles.backText}>Quay lại</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Chỉnh sửa tài khoản</Text>
            <Text style={styles.subtitle}>Cập nhật thông tin cá nhân của bạn</Text>
          </View>

          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <View style={styles.avatarWrapper}>
                  <View style={styles.avatarCircle}>
                    {avatar ? (
                      <Image
                        source={{ uri: getAvatarUri() }}
                        style={styles.avatarImage}
                      />
                    ) : (
                      <Text style={styles.avatarText}>
                        {form.username.charAt(0)?.toUpperCase() || "?"}
                      </Text>
                    )}
                  </View>
                  <View style={styles.cameraIconContainer}>
                    <Text style={styles.cameraIcon}>📷</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.avatarActions}>
              <TouchableOpacity 
                onPress={pickImage}
                style={styles.avatarActionButton}
              >
                <Text style={styles.changeAvatarIcon}>🖼️</Text>
                <Text style={styles.changeAvatarText}>Đổi ảnh</Text>
              </TouchableOpacity>

              {avatar && (
                <TouchableOpacity 
                  onPress={handleRemoveAvatar}
                  style={styles.avatarActionButton}
                >
                  <Text style={styles.removeAvatarIcon}>🗑️</Text>
                  <Text style={styles.removeAvatarText}>Xóa ảnh</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>👤 Tên người dùng</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên của bạn"
                  placeholderTextColor="#666"
                  value={form.username}
                  onChangeText={(v) => setForm({ ...form, username: v })}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📧 Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="email@example.com"
                  placeholderTextColor="#666"
                  value={form.email}
                  onChangeText={(v) => setForm({ ...form, email: v })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📱 Số điện thoại</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="0123 456 789"
                  placeholderTextColor="#666"
                  value={form.phone}
                  onChangeText={(v) => setForm({ ...form, phone: v })}
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Thông tin của bạn sẽ được bảo mật và chỉ hiển thị theo cài đặt riêng tư
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[
              styles.saveBtn,
              isSaving && styles.saveBtnDisabled,
            ]} 
            onPress={handleSave}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <View style={styles.saveBtnContent}>
              <Text style={styles.saveIcon}>
                {isSaving ? "⏳" : "✓"}
              </Text>
              <Text style={styles.saveText}>
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#0a0015",
  },

  gradientTop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: "#FF1493",
    opacity: 0.1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },

  gradientBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: "#FF69B4",
    opacity: 0.05,
  },

  scrollContent: {
    flexGrow: 1,
  },

  content: {
    flex: 1,
  },

  /* Header */
  header: { 
    padding: 20,
    paddingTop: 10,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  backIcon: {
    fontSize: 24,
    color: "#FF69B4",
    marginRight: 8,
  },

  backText: { 
    color: "#FF69B4",
    fontSize: 16,
    fontWeight: "600",
  },

  title: { 
    fontSize: 28, 
    color: "#fff", 
    fontWeight: "bold",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },

  /* Avatar Section */
  avatarSection: { 
    alignItems: "center", 
    marginVertical: 30,
  },

  avatarContainer: {
    marginBottom: 20,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FF1493",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#2a002a",
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },

  avatarText: { 
    fontSize: 48, 
    color: "#fff",
    fontWeight: "bold",
  },

  avatarImage: { 
    width: "100%", 
    height: "100%", 
    borderRadius: 60,
  },

  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF1493",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#0a0015",
  },

  cameraIcon: {
    fontSize: 18,
  },

  avatarActions: {
    flexDirection: "row",
    gap: 20,
  },

  avatarActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a001a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#2a002a",
  },

  changeAvatarIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  changeAvatarText: { 
    color: "#FF69B4",
    fontSize: 14,
    fontWeight: "600",
  },

  removeAvatarIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  removeAvatarText: { 
    color: "#ff4d4d",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Form Section */
  formSection: { 
    paddingHorizontal: 20,
    marginTop: 10,
  },

  sectionTitle: {
    fontSize: 18,
    color: "#FF1493",
    fontWeight: "bold",
    marginBottom: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },

  inputContainer: {
    backgroundColor: "#1a001a",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#2a002a",
    overflow: "hidden",
  },

  input: {
    padding: 16,
    color: "#fff",
    fontSize: 16,
  },

  /* Info Card */
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#1a001a",
    margin: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2a002a",
    alignItems: "center",
  },

  infoIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  infoText: {
    flex: 1,
    color: "#999",
    fontSize: 13,
    lineHeight: 18,
  },

  /* Save Button */
  saveBtn: {
    backgroundColor: "#FF1493",
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#FF1493",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },

  saveBtnDisabled: {
    opacity: 0.6,
  },

  saveBtnContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  saveIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  saveText: { 
    color: "#fff", 
    fontWeight: "bold",
    fontSize: 16,
  },

  bottomSpacing: {
    height: 30,
  },
});