import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const LOCAL_IP = "10.18.7.211";

const API_URL =
  Platform.OS === "web"
    ? "http://localhost:8080/api"
    : `http://${LOCAL_IP}:8080/api`;


const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// 🔐 Gắn token đúng cho mọi nền tảng
api.interceptors.request.use(async (config) => {
  let token = null;

  if (Platform.OS === "web") {
    token = localStorage.getItem("token");
  } else {
    token = await SecureStore.getItemAsync("token");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
