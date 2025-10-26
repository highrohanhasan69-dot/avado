// main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useCartStore } from "@/stores/cart";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount("#app");

// ✅ Initialize Cart Store
const cartStore = useCartStore();

const initCart = async () => {
  try {
    const res = await axios.get("/auth/current-user");
    const user = res.data.user || null;
    await cartStore.initUser(user?.id || null);
    console.log("✅ Cart initialized for:", user ? "User" : "Guest");
  } catch {
    console.warn("⚠️ No user found, loading guest cart...");
    await cartStore.initUser(null);
  }
};

// 🔹 Initialize once
await initCart();

// 🔹 Listen to login/logout
window.addEventListener("user-logged-in", async (e) => {
  const userId = e.detail.userId;
  await cartStore.initUser(userId);
});

window.addEventListener("user-logged-out", async () => {
  cartStore.resetCart();
  await cartStore.initUser(null);
});
