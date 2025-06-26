import { getMechanics } from "@/api/mechanic";
import type { Mechanic } from "@/components/mechanic/interface";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useMechanic  = (): UseQueryResult<Mechanic[], Error> => {
    return useQuery({
        queryKey: ['mechanics'],
        queryFn: getMechanics,
    });
}