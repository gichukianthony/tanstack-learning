import { getUsers, updateUser, deleteUser } from "@/api/users";
import type { User, UpdateUsersData } from "@/components/users/interface";
import { useQuery, useMutation, useQueryClient, type UseQueryResult, type UseMutationResult } from "@tanstack/react-query";

export const useUsers = (): UseQueryResult<User[], Error> => {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: getUsers,
    });
};

export const useUpdateUser = (): UseMutationResult<User, Error, { id: string; data: UpdateUsersData }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['profiles']);
        },
    });
};

export const useDeleteUser = (): UseMutationResult<{ success: boolean }, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['profiles']);
        },
    });
};