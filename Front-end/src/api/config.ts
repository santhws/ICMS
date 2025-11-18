// frontend/src/api/config.ts

import axios from "axios";

// A URL do seu Backend, onde o Node.js/Express está rodando (porta 3001)
const API_URL = "http://localhost:3001/api";

// Cria uma instância do Axios configurada com a URL base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
