import { getFeedbacks } from "@/api/feedback";
import type { Feedback } from "@/components/feedbacks/interface";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const useFeedback = (): UseQueryResult<Feedback[]> => {
    return useQuery({
        queryKey: ['feedbacks'],
        queryFn: getFeedbacks,
    })
    ;
}