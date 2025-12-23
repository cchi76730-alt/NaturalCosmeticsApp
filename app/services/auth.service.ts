// services/auth.service.ts
import api from "./api";

export const loginApi = async (
  username: string,
  password: string
) => {
  console.log("🔐 ===== LOGIN API CALLED =====");
  console.log("📤 Username:", username);
  console.log("📤 Password:", "***");
  console.log("🌐 Base URL:", api.defaults.baseURL);
  console.log("🌐 Full URL:", api.defaults.baseURL + "/auth/login");
  
  try {
    console.log("⏳ Sending request...");
    
    const res = await api.post("/auth/login", {
      username,
      password,
    });
    
    console.log("✅ ===== LOGIN SUCCESS =====");
    console.log("📥 Response status:", res.status);
    console.log("📥 Response data:", res.data);
    console.log("============================");
    
    return res.data;
  } catch (error: any) {
    console.error("❌ ===== LOGIN ERROR =====");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    
    if (error.response) {
      console.error("📥 Response status:", error.response.status);
      console.error("📥 Response data:", error.response.data);
      console.error("📥 Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("📤 Request was sent but no response");
      console.error("Request:", error.request);
    } else {
      console.error("⚙️ Error setting up request:", error.message);
    }
    console.error("==========================");
    
    throw error; // QUAN TRỌNG: Phải throw error
  }
};

export const registerApi = async (
  username: string,
  password: string,
  email: string
) => {
  console.log("📝 ===== REGISTER API CALLED =====");
  console.log("Username:", username);
  console.log("Email:", email);
  
  try {
    const res = await api.post("/auth/register", {
      username,
      password,
      email,
    });
    
    console.log("✅ Register success:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("❌ Register error:", error);
    throw error;
  }
};