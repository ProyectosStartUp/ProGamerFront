import axios, { type AxiosInstance } from "axios";

const axi : AxiosInstance = axios.create({
    baseURL: "https://api.pgpc.hub-development.net/api/",
    //  baseURL: "https://localhost:7122/api/",
    headers:{
        "Content-Type": "application/json"
    },
    timeout:15000
});

export default axi;




