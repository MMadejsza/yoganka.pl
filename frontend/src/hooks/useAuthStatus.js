import { useQuery } from '@tanstack/react-query';
import { fetchStatus } from '../utils/http';

export function useAuthStatus(params = {}) {
  return useQuery({
    queryKey: ['authStatus', params.payment, params.sessionId],
    queryFn: () => fetchStatus(params),
    staleTime: 0,
  });
}
