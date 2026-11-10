const codespaceName = import.meta.env.REACT_APP_CODESPACE_NAME;
const codespaceApiUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : '';

// Relative /api paths use the Vite proxy locally; Codespaces uses its HTTPS port URL.
export const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL ?? codespaceApiUrl
).replace(/\/+$/, '');

export function apiUrl(path) {
  return `${apiBaseUrl}${path}`;
}

export async function getJson(path) {
  const response = await fetch(apiUrl(path));
  if (!response.ok) throw new Error(`Request failed with ${response.status}`);
  return response.json();
}
