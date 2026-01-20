import axios from "axios";
import { Platform } from "react-native";

const BASE_IP = "192.168.100.109";

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === "web") {
      return "http://localhost:8080/api";
    }

    // Android Emulator
    if (Platform.OS === "android") {
      return "http://10.0.2.2:8080/api";
    }

    // iOS simulator + thiết bị thật
    return `http://${BASE_IP}:8080/api`;
  }

  return "https://your-production-api.com/api";
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
