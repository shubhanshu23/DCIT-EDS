import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';

export default async function decorate(block) {
  console.log(block, 'block');
  const placeholders = await fetchPlaceholdersForLocale();
  console.log(placeholders);
}
