import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppContext } from "../Context.jsx";
import { api } from "../api/api";
import { useEffect } from "react";

export default function useData(target) {
	const { addError } = useAppContext();
	const queryClient = useQueryClient();
	const { data, error } = useQuery({
		queryKey: [target],
		queryFn: api[target].getAll,
	});

	const create = useMutation({
		mutationFn: ({Data}) => {
			return api[target].create(Data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [target] });
		},
	});
	const update = useMutation({
		mutationFn: ({ Id, Data }) => api[target].update(Id, Data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [target] });
		},
	});
	const remove = useMutation({
		mutationFn: (Id) => api[target].delete(Id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [target] });
		},
	});

	useEffect(() => {
		addError(error);
	}, [error]);

	return { data, create, update, remove, error };
}
