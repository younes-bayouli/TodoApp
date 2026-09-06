import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./Context";
import "./index.css";
import App from "./App.jsx";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<QueryClientProvider client={queryClient}>
		<AppProvider>
			<App />
		</AppProvider>
	</QueryClientProvider>,
);
