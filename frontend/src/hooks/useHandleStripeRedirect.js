// src/hooks/useHandleStripeRedirect.js

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { queryClient } from '../utils/http.js';
import { useAuthStatus } from './useAuthStatus.js';

/**
 * Custom hook that watches for Stripe redirect parameters in the URL,
 * then triggers a refetch of the authStatus query (with those parameters)
 * in order to update the server-side session and refresh cached user data.
 */
export function useHandleStripeRedirect() {
  const location = useLocation();

  // We store { payment, sessionId } here and pass it into useAuthStatus.
  // When authParams changes, useAuthStatus will re-run its fetchStatus call.
  const [authParams, setAuthParams] = useState({});

  // Call the existing useAuthStatus hook with authParams.
  // It returns { data, refetch, ... }, but here we only need refetch.
  const { data: status, refetch: refetchAuth } = useAuthStatus(authParams);

  useEffect(() => {
    // Parse query string from current URL
    const searchParams = new URLSearchParams(location.search);
    const payment = searchParams.get('payment'); // e.g. "success" or null
    const sessionId = searchParams.get('sessionId'); // e.g. "cs_test_abc" or null

    // If we detect a successful Stripe payment redirect...
    if (payment === 'success' && sessionId) {
      // 1) Update authParams to include payment & sessionId
      setAuthParams({ payment, sessionId });

      // 2) Clear any existing 'authStatus' cache entry
      queryClient.invalidateQueries(['authStatus']);

      // 3) Immediately trigger a refetch of useAuthStatus with the new params.
      //    This will call GET /api/login-pass/status?payment=success&sessionId=...
      //    On the server, getStatus will detect these values, refresh req.session.user,
      //    then return updated user info. React Query will cache that updated result.
      refetchAuth()
        .then(() => {
          // 4) After successful refetch, invalidate the more specific cache key
          //    so that components depending on ['authStatus', payment, sessionId]
          //    also update if they were observing that exact key.
          queryClient.invalidateQueries(['authStatus', payment, sessionId]);
        })
        .catch(err => {
          console.error(
            'Error refreshing authStatus after Stripe redirect:',
            err
          );
        });
    }
  }, [location.search, refetchAuth]);

  return status || { isLoggedIn: false };
}
