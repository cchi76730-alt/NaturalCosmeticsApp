// services/api.ts
import axios from "axios";
import { Platform } from "react-native";

const getBaseURL = () => {
  if (__DEV__) {
    // WEB
    if (Platform.OS === "web") {
      return "http://localhost:8080/api"; // ← Dùng localhost cho web
    }
    // ANDROID
    else if (Platform.OS === "android") {
      return "http://10.0.2.2:8080/api";
    }
    // iOS
    else {
      return "http://10.18.8.18:8080/api";
    }
  }
  return "https://your-production-api.com/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("🌐 ===== API CONFIGURATION =====");
console.log("Platform:", Platform.OS); // ← Sẽ thấy "web"
console.log("Base URL:", api.defaults.baseURL);
console.log("Timeout:", api.defaults.timeout + "ms");
console.log("================================");

// REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    console.log("📤 ===== AXIOS REQUEST =====");
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;
    console.log("URL:", fullUrl);
    console.log("Method:", config.method?.toUpperCase());
    console.log("Data:", JSON.stringify(config.data));
    console.log("===========================");
    return config;
  },
  (error) => {
    console.error("❌ Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    console.log("📥 ===== AXIOS RESPONSE =====");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data));
    console.log("============================");
    return response;
  },
  (error) => {
    console.error("❌ ===== AXIOS ERROR =====");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", JSON.stringify(error.response.data));
    } else if (error.request) {
      console.error("No response received");
      console.error("Request:", error.request._response || error.request);
    }
    console.error("=========================");
    
    return Promise.reject(error);
  }
);

export default api;