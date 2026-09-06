import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";

const AppContext = createContext(null);

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
			console.log(`removing error-${state.nbrErr}`);
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

	return (
		<AppContext.Provider
			value={{
				errors,
				addError: (error) => dispatch({ type: "ADD", payload: error }),
				removeError: () => dispatch({ type: "POP" }),
				nbrErr,
			}}
		>
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
