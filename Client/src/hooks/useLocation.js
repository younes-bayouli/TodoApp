import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";

export function useLocation() {
    return useQuery({
        queryKey: ["location"],
        queryFn: api.location.get,
    });
}