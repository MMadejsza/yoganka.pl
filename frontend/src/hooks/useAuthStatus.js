import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../utils/http';

export function useAuthStatus() {
  return useQuery({
    queryKey: ['authStatus'],
    queryFn: fetchStatus,
    // staleTime: 1000 * 60 * 5, //  5 mins
  });
}
