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
		if (isTheme(nextTheme)) setThemeState(nextTheme);
	};
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

	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	useEffect(() => {
		if (settingsError) addError(settingsError);
		if (updateSettingsMutation.error)
			addError(updateSettingsMutation.error);
	}, [settingsError, updateSettingsMutation.error]);

	return (
		<AppContext.Provider
			value={{
				errors,
				addError,
				removeError: () => dispatch({ type: "POP" }),
				nbrErr,
				theme,
				setTheme,
				toggleTheme: () =>
					setThemeState((currentTheme) =>
						currentTheme === "light" ? "dark" : "light",
					),
				settings,
				updateSettings: updateSettingsMutation.mutate,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
