import axios from "axios";

const API_URL = "http://localhost:8080/api/admin/staff";

export interface Staff {
  id: number;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

export const getStaffs = async (): Promise<Staff[]> => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createStaff = async (data: {
  username: string;
  email: string;
  password: string;
}) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// UPDATE
export const updateStaff = async (
  id: number,
  data: {
    username: string;
    email: string;
    password?: string;
  }
) => {
  return axios.put(`${API_URL}/${id}`, data);
};

// DELETE
export const deleteStaff = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};