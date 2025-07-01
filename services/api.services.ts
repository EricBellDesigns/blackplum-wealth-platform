import axios from "axios";

const {BASE_URL} = process.env;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach Auth Cookie to HTTP requests
axiosInstance.interceptors.request.use(async (request) => {
  // Retrieve auth cookie passed in request headers
  const cookie = request.headers.cookie;

  if (cookie) {
    // Attach the Auth Cookie
    request.headers.Cookie = cookie;
    // Attach the Auth JWT token
    // request.headers.Authorization = `Bearer ${session.jwt}`;
  }
  return request;
});

export default axiosInstance;
