import {
	createContext,
	useContext,
	useEffect,
	useReducer,
	useState,
} from "react";
import useModal from "./hooks/useModal";

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
	const [name, setName] = useState("todos");
	const [object, setObject] = useState({});
	const [fieldsConfig, setFieldsConfig] = useState({});
	const [validateObject, setValidateObject] = useState(() => true);
	const [onSubmit, setOnSubmit] = useState({});
	const [data, setData] = useState([]);

	const configModal = ({
		modalName,
		modalObject,
		config,
		validate,
		onSubmit,
		modaldata,
	}) => {
		setName((prev) => modalName ?? prev);
		setObject((prev) => modalObject ?? prev);
		setFieldsConfig((prev) => config ?? prev);
		setValidateObject((prev) => validate ?? prev);
		setOnSubmit((prev) => onSubmit ?? prev);
		setData((prev) => modaldata ?? prev);
	};

	const { Modal, openModal, closeModal } = useModal(
		name,
		object,
		setObject,
		fieldsConfig,
		validateObject,
		onSubmit,
		data,
	);
	return (
		<AppContext.Provider
			value={{
				errors,
				addError: (error) => dispatch({ type: "ADD", payload: error }),
				removeError: () => dispatch({ type: "POP" }),
				nbrErr,
				object,
				openModal,
				closeModal,
				configModal,
			}}
		>
			{Modal}
			{children}
		</AppContext.Provider>
	);
}

export function useAppContext() {
	return useContext(AppContext);
}
