// services/api.ts
import axios from "axios";
import { Platform } from "react-native";

const BASE_IP = "10.18.7.211";

const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === "web") {
      return "http://localhost:8080/api";
    }

    // iOS + Android (thiết bị thật)
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