const BASE_URL = 'https://680dfedbc47cb8074d91bfe7.mockapi.io/ap/post/comments';

const form = document.querySelector('.form');
const titleInput = document.querySelector('.form-title');
const textInput = document.querySelector('.form-text');
const postsList = document.querySelector('.posts');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) return;

  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text })
    });

    const newPost = await res.json();
    renderPost(newPost);
    form.reset();
  } catch (error) {
    console.error('Помилка при створенні поста:', error);
  }
});

async function getPosts() {
  try {
    const res = await fetch(BASE_URL);
    const posts = await res.json();
    postsList.innerHTML = '';
    posts.forEach(renderPost);
  } catch (error) {
    console.error('Помилка при отриманні постів:', error);
  }
}

function renderPost(post) {
  const postEl = document.createElement('li');
  postEl.className = 'post';
  postEl.innerHTML = `
    <h3 class="post-title">${post.title}</h3>
    <p class="post-text">${post.text}</p>
    <button class="btn-delete" data-id="${post.id}">Видалити</button>
  `;
  postsList.appendChild(postEl);
}

postsList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const id = e.target.dataset.id;
    try {
      await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
      e.target.closest('.post').remove();
    } catch (error) {
      console.error('Помилка при видаленні поста:', error);
    }
  }
});

getPosts();

let commentPage = 1;
const commentsPerPage = 5;

async function loadExternalComments() {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${commentPage}&_limit=${commentsPerPage}`);
    const comments = await res.json();

    const commentsList = document.querySelector('.external-comments');

    comments.forEach(comment => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <h4>${comment.name}</h4>
        <p><em>${comment.email}</em></p>
        <p>${comment.body}</p>
      `;
      commentsList.appendChild(li);
    });

    commentPage++;
  } catch (error) {
    console.error('Error loading external comments:', error);
  }
}

document.querySelector('.load-more-btn').addEventListener('click', loadExternalComments);


loadExternalComments();