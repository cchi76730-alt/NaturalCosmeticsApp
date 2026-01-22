import axios from "axios";

export const getAdminInventory = () => {
  return axios.get("http://localhost:8080/api/admin/inventory");
};
