import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import ReactDOM from "react-dom/client";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer/index.js";
export const store = configureStore({
	reducer: rootReducer,
});
ReactDOM.createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<Toaster />
			<App />
		</Provider>
	</StrictMode>
);
