/* eslint-disable @typescript-eslint/no-explicit-any */
// A utitlity to post and get data from an API then returning the response to the frontend.
export const fetcher = async (url: string, data?: any) => {
  const resp = await fetch(window.location.origin + url, {
    method: data ? 'POST' : 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const res = await resp.json();
  return res;
};
