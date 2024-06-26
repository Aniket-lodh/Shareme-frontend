import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: `${import.meta.env.SERVER_PROJECT_ID}`,
  dataset: "production",
  apiVersion: "2023-01-17",
  useCdn: false, //Make it true if you want to get cached fast responses
  token: `${import.meta.env.SERVER_TOKEN}`,
});

const builder = imageUrlBuilder(client);
export const urlFor = (src) => builder.image(src);

// SnewApassNwordI@2023ty
