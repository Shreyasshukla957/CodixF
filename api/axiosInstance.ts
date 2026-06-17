import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,  // ←- yeh cookie automatically saath jaayegi har request mein
    headers: {
        "Content-Type": "application/json"
    }
})

export default axiosInstance;