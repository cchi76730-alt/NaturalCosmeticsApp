import { Image } from 'react-native';
import BannerSlider from "../components/BannerSlider";

import { useRouter } from 'expo-router';
import { useState } from 'react';
import { 
  Alert, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View,
  ScrollView

} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUpScreen() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    if (username === '' || password === '' || confirmPassword === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu nhập lại không khớp!');
      return;
    }

    Alert.alert('Thành công', 'Tạo tài khoản thành công! Vui lòng đăng nhập.');
    router.back();
  };

  return (
    <View style={styles.container}>

      {/* Gradient Background */}
      <LinearGradient
        colors={['#1a001a', '#330033', '#4d004d']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* ScrollView KHẮC PHỤC LỖI KHÔNG CUỘN */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 150, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.header}>
          <View style={styles.bannerWrapper}>
  <BannerSlider />
</View>
          <Text style={styles.title}>TẠO TÀI KHOẢN</Text>
          <Text style={styles.subtitle}>ĐĂNG KÝ</Text>

          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔐</Text>
          </View>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>👤 Tên tài khoản</Text>
<TextInput 
  style={styles.input} 
  placeholder="Nhập tên tài khoản..." 
  placeholderTextColor="#FFB6C1"
/>

          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔑 Mật khẩu</Text>
<TextInput 
  style={styles.input} 
  placeholder="Nhập mật khẩu..." 
  placeholderTextColor="#FFB6C1"
/>

          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🪄 Nhập lại mật khẩu</Text>
<TextInput 
  style={styles.input} 
  placeholder="Xác nhận mật khẩu..." 
  placeholderTextColor="#FFB6C1"
/>

          </View>

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>TẠO TÀI KHOẢN</Text>
            <Text style={styles.buttonIcon}>✨</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.linkButton}
          >
            <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>

          {/* Đăng ký bằng mạng xã hội */}
          <View style={styles.socialContainer}>
            <Text style={styles.socialTitle}>Hoặc đăng ký bằng</Text>

            <View style={styles.socialRow}>
              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#1877F2' }]}>
                <Text style={styles.socialIcon}>𝙁</Text>
                <Text style={styles.socialText}></Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#DB4437' }]}>
                <Text style={styles.socialIcon}>𝙂</Text>
                <Text style={styles.socialText}></Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialButton, { backgroundColor: '#ffffff20', marginTop: 10 }]}>
<Text style={[styles.socialIcon, { color: '#fff' }]}>☁️</Text>
<Text style={styles.socialText}></Text>
</TouchableOpacity>
            </View>
          </View>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bằng cách đăng ký, bạn đồng ý với
            <Text style={styles.footerLink}> Điều khoản dịch vụ </Text>
            và
            <Text style={styles.footerLink}> Chính sách bảo mật</Text>
          </Text>
        </View>

      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  iconContainer: {
  marginTop: 15,
  alignItems: 'center',
  justifyContent: 'center',
},

  container: {
    flex: 1,
    backgroundColor: '#1a001a',
  },

  content: {
    paddingHorizontal: 25, // ❗ ĐÃ GỠ flex: 1
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FF1493',
    textShadowColor: 'rgba(255, 20, 147, 0.5)',
    textShadowRadius: 15,
    letterSpacing: 1,
    marginBottom: 15,
    marginTop: 50,
  },

  subtitle: {
    color: '#FFB6C1',
    fontSize: 18,
    marginBottom: 20,
  },

  icon: {
    fontSize: 60,
    color: '#FF66B2',
  },

  form: {
    gap: 25,
  },

  inputGroup: {
    gap: 8,
  },

  label: {
    color: '#FF66B2',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 5,
  },

  input: {
    backgroundColor: 'rgba(255, 102, 178, 0.1)',
    color: '#FFFFFF',
    padding: 18,
    borderRadius: 15,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#FF66B2',
  },

  button: {
    backgroundColor: '#FF1493',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  buttonIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 10,
  },

  linkButton: {
    alignItems: 'center',
    marginTop: 25,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 102, 178, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 102, 178, 0.3)',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  linkText: {
    color: '#FFB6C1',
    fontSize: 16,
    fontWeight: '600',
  },

  linkArrow: {
    color: '#FFB6C1',
    fontSize: 18,
    marginLeft: 8,
    fontWeight: 'bold',
  },

  socialContainer: {
    marginTop: 10,
    alignItems: 'center',
    gap: 15,
  },

  socialTitle: {
    color: '#FFB6C1',
    fontSize: 14,
  },

  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },

  socialIcon: {
    fontSize: 16,
    marginRight: 6,
    color: '#fff',
  },

  socialText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },

  footer: {
    marginTop: 40,
    marginBottom: 60,
  },

  footerText: {
    color: '#FFB6C1',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
  },

  footerLink: {
    color: '#FF66B2',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  banner: {
  width: "100%",
  height: 150,
  resizeMode: "cover",
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  marginBottom: 20,
},
bannerWrapper: {
  width: "100%",
  height: 200,
  overflow: "hidden",
  borderBottomLeftRadius: 20,
  borderBottomRightRadius: 20,
  marginBottom: 5,
},


});
