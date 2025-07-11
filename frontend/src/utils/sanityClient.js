import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: 'b7wo2my9',
  dataset: 'production',
  apiVersion: '2025-07-11',
  useCdn: true,
});

// helper for imgs

const builder = imageUrlBuilder(client);
export function urlFor(source) {
  return builder.image(source);
}
