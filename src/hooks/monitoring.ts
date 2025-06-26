import { getMonitoringData, type MonitoringData } from "@/api/monitoring";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

export const UseMonitoring = (): UseQueryResult<MonitoringData[], Error> => {
    return useQuery({
        queryKey: ['monitoring'],
        queryFn: getMonitoringData,
    });
}