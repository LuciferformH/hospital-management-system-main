import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:4451",
    withCredentials: true,
});

// Request interceptor removed as cookies are handled automatically via withCredentials: true

export default api;
