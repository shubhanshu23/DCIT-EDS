export default async function decorate(block) {
  const items = Array.from(block.querySelectorAll(':scope > div'));

  const originalPicture = items[0]?.querySelector('div > div > picture');
  const originalLink = items[1]?.querySelector('div > div > p > a');

  block.innerHTML = '';

  const sourceData = Array.from(originalPicture.querySelectorAll('source')).map((src) => ({
    type: src.getAttribute('type'),
    srcset: src.getAttribute('srcset'),
    media: src.getAttribute('media') || null,
  }));

  const imgEl = originalPicture.querySelector('img');
  const imgData = {
    loading: imgEl.getAttribute('loading'),
    alt: imgEl.getAttribute('alt'),
    src: imgEl.getAttribute('src'),
    width: imgEl.getAttribute('width'),
    height: imgEl.getAttribute('height'),
  };

  const newContainer = document.createElement('div');
  const innerDiv = document.createElement('div');
  const newPicture = document.createElement('picture');

  sourceData.forEach(({ type, srcset, media }) => {
    const s = document.createElement('source');
    s.type = type;
    s.srcset = srcset;
    if (media) s.media = media;
    newPicture.appendChild(s);
  });

  const newImg = document.createElement('img');
  Object.entries(imgData).forEach(([k, v]) => newImg.setAttribute(k, v));
  newPicture.appendChild(newImg);

  const linkTitle = originalLink?.getAttribute('title') || '';

  let finalNode = newPicture;
  if (linkTitle) {
    const a = document.createElement('a');
    a.href = linkTitle;
    a.appendChild(newPicture);
    finalNode = a;
  }

  innerDiv.appendChild(finalNode);
  newContainer.appendChild(innerDiv);
  block.appendChild(newContainer);
}
