import { Stack } from "expo-router";
import { AdminAuthProvider } from "./components/context/AdminAuthContext";
import { AuthProvider } from "./components/context/AuthContext";
import { CartProvider } from "./components/context/CartContext";
import { OrderProvider } from "./components/context/OrderContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AdminAuthProvider> {/* ✅ THÊM */}
        <CartProvider>
          <OrderProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="admin" /> {/* ✅ THÊM */}
              <Stack.Screen name="orders" />
            </Stack>
          </OrderProvider>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}
