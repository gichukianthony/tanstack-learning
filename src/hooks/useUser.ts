import { getUsers } from "@/api/users";
import type { User } from "@/components/users/interface";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useUsers= (): UseQueryResult<User[], Error> => {
    return useQuery({
        queryKey: ['profiles'],
        queryFn: getUsers,
    });
};