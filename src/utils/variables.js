const getEnvVar = (key, defaultValue = "") => {
  // Try VITE_ prefixed variable first
  const viteValue = import.meta.env[`VITE_${key}`];
  if (viteValue) return viteValue;

  // Try non-prefixed variable
  const value = import.meta.env[key];
  if (value) return value;


  // Log warning if no value found and no default provided
  if (defaultValue === "") {
    console.warn(
      `Environment variable ${key} is not defined and no default value provided`
    );
  }

  return defaultValue;
};

export const config = {
  googleClientId: getEnvVar("GOOGLE_API_TOKEN", "test-client-id"),
  sanityProjectId: getEnvVar("SERVER_PROJECT_ID", "demo-project"),
  sanityDataset: getEnvVar("SANITY_DATASET", "production"),
  isDevelopment: getEnvVar("APP_MODE", "development") === "development",
  apiEndpoint: getEnvVar("API_URL", "http://localhost:3000/api"),
  serverToken: getEnvVar("SERVER_TOKEN", "test-server-token"),
};