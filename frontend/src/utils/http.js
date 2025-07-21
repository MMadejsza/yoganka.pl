import { QueryClient } from '@tanstack/react-query';
import * as msgs from './resMessagesUtils';
export const queryClient = new QueryClient();
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const logsGloballyOn = true;
// Util function for managing behavior of fetch for http requests

//! FETCH - QUERY FN_______________________________________________
export async function fetchStatus(params = {}) {
  // await promise solve

  // params is an object { payment, sessionId } or an empty object
  const url = new URL(`${API_BASE_URL}/api/login-pass/status`);
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null) url.searchParams.append(key, val);
  });
  const response = await fetch(url.toString(), {
    credentials: 'include',
  });

  // if error
  if (!response.ok) {
    // instantiate error with message
    const error = new Error(msgs.userStatusError);
    // encode response status code
    error.code = response.status;
    // encode as message actual error from db
    error.info = await response.json();
    // return it for handling by tanstack
    throw error;
  }
  // if ok - translate response to json
  const data = await response.json();
  // return it
  return data;
}
export async function fetchItem(callPath, { signal }, minRightsPrefix) {
  if (logsGloballyOn) console.log('✅✅✅✅ fetchItem Called');
  if (logsGloballyOn) console.log('✅✅✅ callPath ', callPath);
  if (logsGloballyOn) console.log('✅✅ minRightsPrefix ', minRightsPrefix);
  if (logsGloballyOn)
    console.log(
      '✅ final fetchPath ',
      `${API_BASE_URL}/api${minRightsPrefix || ''}${callPath}`
    );

  const response = await fetch(
    `${API_BASE_URL}/api${minRightsPrefix || ''}${callPath}`,
    {
      signal,
      cache: 'no-store',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const error = new Error(msgs.fetchItemError);
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = await response.json();
  return data;
}
export async function fetchData(link) {
  if (logsGloballyOn) console.log('✅✅✅ fetchData Called');
  if (logsGloballyOn) console.log('✅✅ link ', link);
  if (logsGloballyOn)
    console.log('✅ final fetchPath ', `${API_BASE_URL}/api${link}`);
  // if (logsGloballyOn) console.log(`fetchData link: ${link}`);
  // await promise solve
  const response = await fetch(`${API_BASE_URL}/api${link}`, {
    credentials: 'include',
  });
  // if error
  if (!response.ok) {
    // instantiate error with message
    const error = new Error(msgs.fetchDataError);
    // encode response status code
    error.code = response.status;
    // encode as message actual error from db
    error.info = await response.json();
    // return it for handling by tanstack
    throw error;
  }
  // if ok - translate response to json
  const data = response.json();
  // return it
  return data;
}
export async function fetchStripeFlowConfirmation(link) {
  const res = await fetch(link, {
    credentials: 'include',
  });

  const contentType = res.headers.get('content-type');
  if (!res.ok || !contentType?.includes('application/json')) {
    throw new Error('Nieprawidłowa odpowiedź z serwera');
  }

  const data = await res.json();
  if (logsGloballyOn) console.log('✅ Odpowiedź backendu:', data); // 👈 powinno się pokazać
  return data;
}

//! MUTATE - MUTATE FN_____________________________________________
export async function mutateOnLoginOrSignup(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnLoginOrSignup path`, path);
  return fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnNewPassword(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnNewPassword path`, path);
  return fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnValidationLink(status, formData) {
  return fetch(`${API_BASE_URL}/api/login-pass/resend-activation`, {
    method: 'PUT',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnCreate(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnCreate path`, path);

  return fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        console.error('CREATE-PI ERROR BODY:', data);
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnEdit(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnEdit path`, path);

  return fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnDelete(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnDelete path`, path);

  return fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
export async function mutateOnStripeInDbCheck(status, formData, path) {
  if (logsGloballyOn) console.log(`mutateOnStripeInDbCheck path`, path);

  return fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include', // include cookies
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        // reject with backend data
        return Promise.reject(data);
      }
      return data;
    });
  });
}
