import { getServices, updateService, deleteService } from "@/api/services";
import type { Service } from "@/components/services/Service";
import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";

export const useService = (): UseQueryResult<Service[], Error> => {
    return useQuery({
        queryKey: ['services'],
        queryFn: getServices,
    });
}

export const useUpdateService = (): UseMutationResult<Service, Error, { id: string; data: Partial<Service> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateService(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
        },
    });
};

export const useDeleteService = (): UseMutationResult<{ success: boolean }, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteService(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['services']);
        },
    });
};