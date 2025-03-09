import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const isDevelopment = import.meta.env.VITE_APP_MODE === "development";

export const client = sanityClient({
  projectId: `${import.meta.env.VITE_SERVER_PROJECT_ID}`,
  dataset: "production",
  apiVersion: "2023-01-17",
  useCdn: !isDevelopment, // true if you want to get cached fast responses
  token: `${import.meta.env.VITE_SERVER_TOKEN}`,
});

const builder = imageUrlBuilder(client);
export const urlFor = (src) => builder.image(src);

// SnewApassNwordI@2023ty
