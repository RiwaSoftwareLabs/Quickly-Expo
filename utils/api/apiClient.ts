import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://q-server-dev.up.railway.app", // Replace with your API base URL : https://megadeals-server-dev.up.railway.app
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key":
      "pk_46dc7e2428ecf1e3015208fc484865d9355303f0815c3de04113c57f830ee1c8", // pk_135fe7d370320458adc8c4a8bb0c4a31796b1e331b83be57ce09ad21d6252a79
  },
});

export default apiClient;
