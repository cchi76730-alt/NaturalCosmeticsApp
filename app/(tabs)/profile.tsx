import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../components/context/AuthContext";
import { getUserStats } from "../services/profile.service";

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

  getUserStats(user.id)
    .then(setStats)
    .catch(console.log);
}, [user]);


  // 🔒 CHẶN CHƯA ĐĂNG NHẬP
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1a001a" />
        <View style={styles.loginRequiredContainer}>
          <View style={styles.loginRequiredContent}>
            <Text style={styles.loginRequiredIcon}>🔒</Text>
            <Text style={styles.loginRequiredTitle}>
              Vui lòng đăng nhập
            </Text>
            <Text style={styles.loginRequiredText}>
              Bạn cần đăng nhập để xem thông tin tài khoản và quản lý đơn hàng
            </Text>

            <TouchableOpacity
              style={styles.loginRequiredBtn}
              onPress={() => router.replace("/login")}
              activeOpacity={0.8}
            >
              <Text style={styles.loginRequiredBtnText}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

const handleLogout = () => {
  if (Platform.OS === "web") {
    const confirmed = window.confirm("Bạn có chắc muốn đăng xuất?");
    if (confirmed) {
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


  // Menu items
  const menuItems = [
  {
    id: 1,
    icon: "📦",
    title: "Đơn hàng của tôi",
    subtitle: "Xem lịch sử đơn hàng",
    onPress: () => router.push("/orders"),
  },

  {
  id: 7,
  icon: "🔑",
  title: "Đổi mật khẩu",
  subtitle: "Cập nhật mật khẩu đăng nhập",
  onPress: () => router.push("/change-password"),
},


    
    {
      id: 3,
      icon: "📍",
      title: "Địa chỉ giao hàng",
      subtitle: "Quản lý địa chỉ",
      onPress: () => router.push("/addresses"),
    },
    
    {
      id: 6,
      icon: "❓",
      title: "Trợ giúp & Hỗ trợ",
      subtitle: "Câu hỏi thường gặp",
      onPress: () => router.push("/support"),
    },
  ];

  // Get display name
 const safeUser = user as any;

const displayName = safeUser.username
  ? safeUser.username
  : safeUser.id
  ? `User #${safeUser.id}`
  : "Người dùng";

const userRole = safeUser.role ?? "customer";


  // Get role display
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case "admin":
        return { text: "Quản trị viên", color: "#FF1493", icon: "👑" };
      case "staff":
        return { text: "Nhân viên", color: "#1E90FF", icon: "👨‍💼" };
      default:
        return { text: "Khách hàng", color: "#00FF7F", icon: "👤" };
    }
  };

  const roleInfo = getRoleDisplay(userRole);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2a002a" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== HEADER ===== */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tài khoản</Text>
        </View>

        {/* ===== USER CARD ===== */}
        <View style={styles.userCard}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => console.log("Change avatar")}
            >
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.roleIcon}>{roleInfo.icon}</Text>
              <Text style={[styles.roleText, { color: roleInfo.color }]}>
                {roleInfo.text}
              </Text>
            </View>
            <Text style={styles.userId}>ID: {user.id}</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => router.push("/edit-profile")}

            activeOpacity={0.7}
          >
            <Text style={styles.editProfileIcon}>✏️</Text>
            <Text style={styles.editProfileText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        {/* ===== QUICK STATS ===== */}
        <View style={styles.statsContainer}>
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{stats.orders}</Text>
    <Text style={styles.statLabel}>Đơn hàng</Text>
  </View>

  <View style={styles.statDivider} />

  

  <View style={styles.statDivider} />

  <View style={styles.statItem}>
    <Text style={styles.statValue}>⭐ {stats.rating}</Text>
    <Text style={styles.statLabel}>Đánh giá</Text>
  </View>
</View>


        {/* ===== MENU SECTION ===== */}
        <Text style={styles.sectionTitle}>Tài khoản & Cài đặt</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Text style={styles.menuIconText}>{item.icon}</Text>
                </View>
                <View style={styles.menuText}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ===== LOGOUT BUTTON ===== */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* ===== APP VERSION ===== */}
        <Text style={styles.versionText}>Cindy Beauty v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a001a",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  /* ===== LOGIN REQUIRED ===== */
  loginRequiredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loginRequiredContent: {
    backgroundColor: "#2a002a",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  loginRequiredIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  loginRequiredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },

  loginRequiredText: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },

  loginRequiredBtn: {
    backgroundColor: "#FF1493",
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 25,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: "#FF1493",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  loginRequiredBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  /* ===== HEADER ===== */
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight! + 10 : 20,
    paddingBottom: 20,
    backgroundColor: "#2a002a",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },

  /* ===== USER CARD ===== */
  userCard: {
    backgroundColor: "#2a002a",
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
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
    borderWidth: 4,
    borderColor: "#3a003a",
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
    borderWidth: 3,
    borderColor: "#2a002a",
  },

  editAvatarIcon: {
    fontSize: 16,
  },

  userInfo: {
    alignItems: "center",
    marginBottom: 16,
  },

  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3a003a",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },

  roleIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  roleText: {
    fontSize: 14,
    fontWeight: "600",
  },

  userId: {
    fontSize: 13,
    color: "#666",
  },

  editProfileBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF1493",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },

  editProfileIcon: {
    fontSize: 16,
    marginRight: 6,
  },

  editProfileText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },

  /* ===== STATS ===== */
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
    marginBottom: 4,
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

  /* ===== MENU ===== */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },

  menuContainer: {
    marginHorizontal: 16,
    backgroundColor: "#2a002a",
    borderRadius: 12,
    overflow: "hidden",
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#3a003a",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#3a003a",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  menuIconText: {
    fontSize: 20,
  },

  menuText: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 2,
  },

  menuSubtitle: {
    fontSize: 12,
    color: "#aaa",
  },

  menuArrow: {
    fontSize: 28,
    color: "#666",
    marginLeft: 8,
  },

  /* ===== LOGOUT ===== */
  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3a003a",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF4500",
  },

  logoutIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  logoutText: {
    color: "#FF4500",
    fontSize: 16,
    fontWeight: "bold",
  },

  /* ===== VERSION ===== */
  versionText: {
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    marginTop: 24,
  },
});