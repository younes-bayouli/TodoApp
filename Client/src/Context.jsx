import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api/api";

const AppContext = createContext(null);
const isTheme = (value) => value === "light" || value === "dark";

const filter = (errors = [], errorToAdd) => {
	if (errorToAdd === null || errorToAdd === undefined) return false;
	if (errors.length === 0) return true;
	if (
		errors.every((error) => {
			return error.message !== errorToAdd.message;
		})
	)
		return true;
	return false;
};

const reducer = (state, action) => {
	switch (action.type) {
		case "ADD":
			if (!filter(state.errors, action.payload)) return state;
			return {
				errors: [...state.errors, action.payload],
				nbrErr: state.nbrErr + 1,
			};
		case "POP":
			return state.errors.length > 0
				? { errors: state.errors.slice(0, -1), nbrErr: state.nbrErr }
				: state;
		default:
			return state;
	}
};

export function AppProvider({ children }) {
	const [{ errors, nbrErr }, dispatch] = useReducer(reducer, {
		errors: [],
		nbrErr: 0,
	});
	const [theme, setThemeState] = useState(() => {
		const savedTheme = localStorage.getItem("theme");
		return isTheme(savedTheme) ? savedTheme : "light";
	});
	const setTheme = (nextTheme) => {
		if (!isTheme(nextTheme) || nextTheme === theme) return;
		// Transitions are enabled only for the swap, never on first
		// paint, so the page does not fade in from white on load.
		const root = document.documentElement;
		root.classList.add("theme-transition");
		setThemeState(nextTheme);
	};
	const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
	const addError = (error) => dispatch({ type: "ADD", payload: error });
	const queryClient = useQueryClient();
	const { data: settings, error: settingsError } = useQuery({
		queryKey: ["settings"],
		queryFn: api.settings.get,
	});
	const updateSettingsMutation = useMutation({
		mutationFn: api.settings.update,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settings"] });
		},
	});
	const resetDataMutation = useMutation({
		mutationFn: api.reset,
		onSuccess: () => {
			localStorage.removeItem("theme");
			setTheme("light");
			return queryClient.invalidateQueries();
		},
	});

	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.dataset.theme = theme;
		// Bootstrap 5.3 keys its own theming off data-bs-theme. Setting
		// both here keeps Bootstrap's components in step with ours.
		document.documentElement.dataset.bsTheme = theme;
	}, [theme]);

	useEffect(() => {
		if (!theme) return undefined;
		// Drop the transition class once the fade finishes, so normal
		// hover transitions are not overridden for the rest of the
		// session.
		const timer = setTimeout(
			() => document.documentElement.classList.remove("theme-transition"),
			300,
		);
		return () => clearTimeout(timer);
	}, [theme]);

	useEffect(() => {
		if (settingsError) addError(settingsError);
		if (updateSettingsMutation.error)
			addError(updateSettingsMutation.error);
		if (resetDataMutation.error) addError(resetDataMutation.error);
	}, [settingsError, updateSettingsMutation.error, resetDataMutation.error]);

	return (
		<AppContext.Provider
			value={{
				errors,
				addError,
				removeError: () => dispatch({ type: "POP" }),
				nbrErr,
				theme,
				setTheme,
				toggleTheme,
				settings,
				updateSettings: updateSettingsMutation.mutate,
				resetData: resetDataMutation.mutate,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
