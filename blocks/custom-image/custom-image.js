export default async function decorate(block) {
  const { src, alt, link } = block.dataset;
  const picture = document.createElement('picture');
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  picture.appendChild(img);

  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.appendChild(picture);
    block.append(anchor);
  } else {
    block.append(picture);
  }
}
