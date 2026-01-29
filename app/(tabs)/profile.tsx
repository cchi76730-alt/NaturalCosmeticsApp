import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../components/context/AuthContext";
import { getUserStats } from "../services/profile.service";

/* 🔥 BASE URL API */
const BASE_URL = "http://10.18.7.214:8080";

/* 🔥 HÀM LẤY AVATAR */
const getAvatarUri = (avatar?: string | null) => {
  if (!avatar) return null;
  if (avatar.startsWith("file")) return avatar;
  return `${BASE_URL}${avatar}`;
};

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [stats, setStats] = useState({
    orders: 0,
    favorites: 0,
    rating: 0,
  });

  useEffect(() => {
    if (!user) return;
    getUserStats(user.id).then(setStats).catch(console.log);
  }, [user]);

  /* 🔒 CHƯA ĐĂNG NHẬP */
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginRequiredContainer}>
          <Text style={{ color: "#fff" }}>Vui lòng đăng nhập</Text>
        </View>
      </SafeAreaView>
    );
  }

  const displayName =
    user.username || (user.id ? `User #${user.id}` : "Người dùng");

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Đăng xuất?")) {
        logout();
        router.replace("/login");
      }
    } else {
      Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        {/* ===== USER CARD ===== */}
        <View style={styles.userCard}>
  {/* AVATAR */}
  <View style={styles.avatarContainer}>
    <View style={styles.avatarPlaceholder}>
      {getAvatarUri(user.avatar) ? (
        <Image
          source={{ uri: getAvatarUri(user.avatar)! }}
          style={styles.avatarImage}
        />
      ) : (
        <Text style={styles.avatarText}>
          {displayName.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
  


            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => router.push("/edit-profile")}
            >
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* INFO */}
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.userId}>ID: {user.id}</Text>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => router.push("/edit-profile")}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              ✏️ Chỉnh sửa
            </Text>
          </TouchableOpacity>
        </View>

        {/* ===== STATS ===== */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.orders}</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <Text style={styles.statValue}>⭐ {stats.rating}</Text>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
        </View>
{/* ===== MENU CHỨC NĂNG ===== */}
<View style={styles.menuContainer}>
  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/orders")}
  >
    <Text style={styles.menuIcon}>📦</Text>
    <View style={styles.menuTextBox}>
      <Text style={styles.menuTitle}>Đơn hàng của tôi</Text>
      <Text style={styles.menuSubtitle}>Xem lịch sử mua hàng</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/addresses")}
  >
    <Text style={styles.menuIcon}>📍</Text>
    <View style={styles.menuTextBox}>
      <Text style={styles.menuTitle}>Địa chỉ giao hàng</Text>
      <Text style={styles.menuSubtitle}>Quản lý địa chỉ nhận hàng</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.menuItem}
    onPress={() => router.push("/change-password")}
  >
    <Text style={styles.menuIcon}>🔒</Text>
    <View style={styles.menuTextBox}>
      <Text style={styles.menuTitle}>Đổi mật khẩu</Text>
      <Text style={styles.menuSubtitle}>Bảo mật tài khoản</Text>
    </View>
  </TouchableOpacity>

  <TouchableOpacity
  style={styles.menuItem}
  onPress={() => router.push("/support")}
>
  <Text style={styles.menuIcon}>❓</Text>
  <View style={styles.menuTextBox}>
    <Text style={styles.menuTitle}>Hỗ trợ & Trợ giúp</Text>
    <Text style={styles.menuSubtitle}>Câu hỏi thường gặp, liên hệ</Text>
  </View>
</TouchableOpacity>

  
</View>

        

        {/* ===== LOGOUT ===== */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },

  header: {
    padding: 20,
    backgroundColor: "#2a002a",
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
  },

  userCard: {
    backgroundColor: "#2a002a",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FF1493",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  avatarText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3a003a",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  editAvatarIcon: {
    fontSize: 16,
  },

  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },

  userId: {
    fontSize: 13,
    color: "#aaa",
    marginBottom: 12,
  },

  editProfileBtn: {
    backgroundColor: "#FF1493",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },

  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#2a002a",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },

  statItem: {
    flex: 1,
    alignItems: "center",
  },

  statValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF1493",
  },

  statLabel: {
    fontSize: 12,
    color: "#aaa",
  },

  statDivider: {
    width: 1,
    backgroundColor: "#3a003a",
    marginHorizontal: 8,
  },

  logoutBtn: {
    margin: 20,
    backgroundColor: "#3a003a",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#FF4500",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  menuContainer: {
  marginHorizontal: 16,
  marginTop: 20,
  backgroundColor: "#2a002a",
  borderRadius: 12,
  overflow: "hidden",
},

menuItem: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderBottomWidth: 1,
  borderColor: "#3a003a",
},

menuIcon: {
  fontSize: 22,
  marginRight: 14,
},

menuTextBox: {
  flex: 1,
},

menuTitle: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
},

menuSubtitle: {
  color: "#aaa",
  fontSize: 12,
  marginTop: 2,
},

});
