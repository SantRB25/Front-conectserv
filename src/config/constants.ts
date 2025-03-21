export const API_BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost/conectserv/conectserv_backend/public/api"
    : "https://conectserv.perudevsolutions.com/api";
