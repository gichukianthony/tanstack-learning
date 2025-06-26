import { getServices } from "@/api/services";
import type { Service } from "@/components/services/Service";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useService = (): UseQueryResult<Service[], Error> => {
    return useQuery({
        queryKey: ['services'],
        queryFn: getServices,
    });
}