// Policy Form
import { fetchPlaceholdersForLocale } from '../../scripts/scripts.js';
import decoratePolicy from './policy-form-utils.js';

export default async function decorate(block) {
  const formValRaw = block.querySelector('p')?.textContent?.toLowerCase() || '';
  const formVal = ['renew', 'rejoin'].includes(formValRaw) ? formValRaw : 'rejoin';

  const placeholders = await fetchPlaceholdersForLocale();
  const form = decoratePolicy(formVal, placeholders);

  block.innerHTML = ''; // clear block
  block.append(form);
}
