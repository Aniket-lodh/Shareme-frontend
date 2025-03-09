import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { config } from './variables';

export const client = sanityClient({
  projectId: `${config.sanityProjectId}`,
  dataset: "production",
  apiVersion: "2023-01-17",
  useCdn: !config.isDevelopment, // true if you want to get cached fast responses
  token: `${config.serverToken}`,
});

const builder = imageUrlBuilder(client);
export const urlFor = (src) => builder.image(src);

// SnewApassNwordI@2023ty
