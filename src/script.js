
const gallery = document.getElementById('gallery');
const photoCount = document.getElementById('photoCount');
const message = document.getElementById('message');

const loadBtn = document.getElementById('loadBtn');
const clearBtn = document.getElementById('clearBtn');
const removeBtn = document.getElementById('removeBtn');
const reverseBtn = document.getElementById('reverseBtn');

let photos = [];
let currentPage = 50;
let isLoading = false;

const PHOTOS_PER_PAGE = 4;

function showMessage(text) {
  message.textContent = text;
}

function updateCount() {
  photoCount.textContent = `${photos.length} фотографій`;
}

function createPhotoCard(photo) {
  const card = document.createElement('div');
  card.classList.add('photo-card');

  const image = document.createElement('img');
  image.src = `https://picsum.photos/id/${photo.id}/600/450`;
  image.alt = `Фотографія автора ${photo.author}`;
  image.loading = 'lazy';

  const details = document.createElement('div');
  details.classList.add('photo-details');

  const author = document.createElement('p');
  author.classList.add('photo-author');
  author.textContent = photo.author;

  const id = document.createElement('span');
  id.classList.add('photo-id');
  id.textContent = `PHOTO #${photo.id}`;

  details.append(author, id);
  card.append(image, details);

  return card;
}

function renderGallery() {
  gallery.replaceChildren();

  photos.forEach((photo) => {
    const card = createPhotoCard(photo);
    gallery.appendChild(card);
  });

  updateCount();

  removeBtn.disabled = photos.length === 0;
  reverseBtn.disabled = photos.length < 2;
  clearBtn.disabled = photos.length === 0;
}

async function loadPhotos() {
  if (isLoading) {
    return;
  }

  isLoading = true;
  loadBtn.disabled = true;
  showMessage('Завантажуємо фотографії...');

  try {
    const url = `https://picsum.photos/v2/list?page=${currentPage}&limit=${PHOTOS_PER_PAGE}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Помилка запиту до сервера');
    }

    const newPhotos = await response.json();

    if (newPhotos.length === 0) {
      showMessage('Більше фотографій немає.');
      return;
    }

    const uniquePhotos = newPhotos.filter((photo) => {
      return !photos.some((item) => item.id === photo.id);
    });

    photos.push(...uniquePhotos);
    currentPage++;

    renderGallery();
    showMessage(`Додано ${uniquePhotos.length} фотографії.`);
  } catch (error) {
    showMessage('Не вдалося завантажити фотографії.');
    console.error(error);
  } finally {
    isLoading = false;
    loadBtn.disabled = false;
  }
}

function clearGallery() {
  photos = [];
  renderGallery();
  showMessage('Галерею очищено.');
}

function removeLastPhoto() {
  if (photos.length === 0) {
    return;
  }

  photos.pop();
  renderGallery();
  showMessage('Останню фотографію видалено.');
}

function reverseGallery() {
  if (photos.length < 2) {
    return;
  }

  photos.reverse();
  renderGallery();
  showMessage('Порядок фотографій змінено.');
}

loadBtn.addEventListener('click', loadPhotos);
clearBtn.addEventListener('click', clearGallery);
removeBtn.addEventListener('click', removeLastPhoto);
reverseBtn.addEventListener('click', reverseGallery);

renderGallery();
loadPhotos();
