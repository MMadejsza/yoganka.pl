import { QueryClient } from '@tanstack/react-query';
import * as msgs from '../../../backend/utils/resMessagesUtils';
export const queryClient = new QueryClient();

// Util function for managing behavior of fetch for http requests

//! FETCH - QUERY FN_______________________________________________
export async function fetchStatus() {
  // await promise solve
  const response = await fetch(`/api/login-pass/status`, {
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
  console.log('✅✅✅✅ fetchItem Called');
  console.log('✅✅✅ callPath ', callPath);
  console.log('✅✅ minRightsPrefix ', minRightsPrefix);
  console.log('✅ final fetchPath ', `/api${minRightsPrefix || ''}${callPath}`);

  const response = await fetch(`/api/${minRightsPrefix || ''}${callPath}`, {
    signal,
    cache: 'no-store',
  });

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
  console.log('✅✅✅ fetchData Called');
  console.log('✅✅ link ', link);
  console.log('✅ final fetchPath ', `/api${link}`);
  // console.log(`fetchData link: ${link}`);
  // await promise solve
  const response = await fetch(`/api${link}`);
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

//! MUTATE - MUTATE FN_____________________________________________
export async function mutateOnLoginOrSignup(status, formData, path) {
  console.log(`mutateOnLoginOrSignup path`, path);
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
    credentials: 'include', // include cookies
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
  console.log(`mutateOnNewPassword path`, path);
  return fetch(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
    credentials: 'include', // include cookies
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
  console.log(`mutateOnCreate path`, path);

  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
    credentials: 'include', // include cookies
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
export async function mutateOnEdit(status, formData, path) {
  console.log(`mutateOnEdit path`, path);

  return fetch(path, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
    credentials: 'include', // include cookies
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
  console.log(`mutateOnEdit path`, path);

  return fetch(path, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'CSRF-Token': status.token,
    },
    body: JSON.stringify(formData),
    credentials: 'include', // include cookies
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
