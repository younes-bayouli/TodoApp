import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./Context";
import BackendStartupGate from "./Components/Composite/BackendStartupGate.jsx";
import "./index.css";
import App from "./App.jsx";
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<BackendStartupGate>
				<AppProvider>
					<App />
				</AppProvider>
			</BackendStartupGate>
		</QueryClientProvider>
	</StrictMode>,
);
