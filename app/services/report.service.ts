import api from "./api";

export const getReports = (period: string) => {
  return api.get("/admin/reports", {
    params: { period },
  });
};
