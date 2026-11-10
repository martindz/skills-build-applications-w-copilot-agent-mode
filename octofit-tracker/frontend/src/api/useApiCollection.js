import { useEffect, useState } from 'react';
import { apiUrl, getJson } from './client.js';

function collectionFromResponse(response, key) {
  if (Array.isArray(response)) return response;
  if (typeof response !== 'object' || response === null) {
    throw new Error('The API returned an invalid collection response.');
  }

  const collection = response[key] ?? response.results;
  if (Array.isArray(collection)) return collection;
  if (typeof collection === 'object' && collection !== null) {
    const results = collection.results;
    if (Array.isArray(results)) return results;
  }

  throw new Error(`The API response did not contain a "${key}" collection.`);
}

export function useApiCollection(path, responseKey, componentName) {
  const [state, setState] = useState({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const endpoint = apiUrl(path);
    console.log(`${componentName} API endpoint:`, endpoint);

    getJson(path)
      .then((response) => {
        console.log(`${componentName} fetched data:`, response);
        const data = collectionFromResponse(response, responseKey);
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unknown API error';
        setState({
          data: [],
          error: `Unable to load ${componentName.toLowerCase()}: ${message}`,
          loading: false,
        });
      });

    return () => {
      active = false;
    };
  }, [componentName, path, responseKey]);

  return state;
}
