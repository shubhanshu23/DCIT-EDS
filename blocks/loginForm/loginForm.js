import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
    const form = document.createElement('form');
    form.className = 'login-form';
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/content/experience-fragments/commerce/commerce-login-form');
    
    [...block.children].forEach((row) => {
        const div = document.createElement('div');
        moveInstrumentation(row, div);
        while (row.firstElementChild) div.append(row.firstElementChild);
        form.append(div);
    });
    
    const picture = block.querySelector('picture');
    if (picture) {
        const optimizedPic = createOptimizedPicture(picture.querySelector('img').src, '', false, [{ width: '750' }]);
        moveInstrumentation(picture, optimizedPic.querySelector('img'));
        picture.replaceWith(optimizedPic);
    }
    
    block.textContent = '';
    block.append(form);
}