import { getServiceRequests } from "@/api/serviceRequest";
import type { ServiceRequest } from "@/components/serviceRequest/interface";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useServiceRequest = ():UseQueryResult<ServiceRequest[], Error> => {
    return useQuery({
        queryKey: ['serviceRequests'],
        queryFn: getServiceRequests
    });
}