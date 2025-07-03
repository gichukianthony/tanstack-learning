import { getMechanics, updateMechanic, deleteMechanic, verifyMechanic, suspendMechanic } from "@/api/mechanic";
import type { Mechanic } from "@/components/mechanic/interface";
import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";

export const useMechanic = (): UseQueryResult<Mechanic[], Error> => {
    return useQuery({
        queryKey: ['mechanics'],
        queryFn: getMechanics,
    });
}

export const useUpdateMechanic = (): UseMutationResult<Mechanic, Error, { id: string; data: Partial<Mechanic> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateMechanic(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mechanics'] ,exact: true});
        },
    });
};

export const useDeleteMechanic = (): UseMutationResult<{ success: boolean }, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteMechanic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['mechanics'] ,exact: true});
        },
    });
};

export const useVerifyMechanic = (): UseMutationResult<Mechanic, Error, string>  =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => verifyMechanic(id),
        onSuccess: () =>{
            queryClient.invalidateQueries({ queryKey:['mechanics'], exact: true})

        }
    })
}

export const useSuspendMechanic = (): UseMutationResult<Mechanic, Error, string> =>{
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (id) => suspendMechanic(id),
        onSuccess: () =>{
            queryClient.invalidateQueries({queryKey:['mechanics'], exact:true})
        }
    })
}
