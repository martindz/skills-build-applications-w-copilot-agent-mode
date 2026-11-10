import { useEffect, useState } from 'react';
import { apiUrl, getJson } from './client.js';

type CollectionState<T> = {
  data: T[];
  error: string | null;
  loading: boolean;
};

function collectionFromResponse<T>(response: unknown, key: string): T[] {
  if (Array.isArray(response)) return response as T[];
  if (typeof response !== 'object' || response === null) {
    throw new Error('The API returned an invalid collection response.');
  }

  const body = response as Record<string, unknown>;
  const collection = body[key] ?? body.results;
  if (Array.isArray(collection)) return collection as T[];
  if (typeof collection === 'object' && collection !== null) {
    const results = (collection as Record<string, unknown>).results;
    if (Array.isArray(results)) return results as T[];
  }

  throw new Error(`The API response did not contain a "${key}" collection.`);
}

export function useApiCollection<T>(
  path: string,
  responseKey: string,
  componentName: string,
): CollectionState<T> {
  const [state, setState] = useState<CollectionState<T>>({
    data: [],
    error: null,
    loading: true,
  });

  useEffect(() => {
    let active = true;
    const endpoint = apiUrl(path);
    console.log(`${componentName} API endpoint:`, endpoint);

    getJson<unknown>(path)
      .then((response) => {
        console.log(`${componentName} fetched data:`, response);
        const data = collectionFromResponse<T>(response, responseKey);
        if (active) setState({ data, error: null, loading: false });
      })
      .catch((error: unknown) => {
        if (!active) return;
        const message = error instanceof Error ? error.message : 'Unknown API error';
        setState({ data: [], error: `Unable to load ${componentName.toLowerCase()}: ${message}`, loading: false });
      });

    return () => {
      active = false;
    };
  }, [componentName, path, responseKey]);

  return state;
}
