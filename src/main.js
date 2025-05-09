const baseUrl = 'https://680dfedbc47cb8074d91bfe7.mockapi.io/ap/post/comments';

const form = document.querySelector('.form');
const titleInput = document.querySelector('.form-title');
const textInput = document.querySelector('.form-text');
const postList = document.querySelector('.posts');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const text = textInput.value.trim();

  if (!title || !text) return;

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title, text })
    });

    const newPost = await response.json();
    renderPost(newPost);
    form.reset();
  } catch (error) {
    console.error('Помилка при створенні поста:', error);
  }
});

async function getPosts() {
  try {
    const response = await fetch(baseUrl);
    const posts = await response.json();
    postList.innerHTML = '';
    posts.forEach(renderPost);
  } catch (error) {
    console.error('Помилка при завантаженні постів:', error);
  }
}

function renderPost(post) {
  const li = document.createElement('li');
  li.className = 'post';
  li.innerHTML = `
    <h3 class="post-title">${post.title}</h3>
    <p class="post-text">${post.text}</p>
    <button class="btn-delete" data-id="${post.id}">Видалити</button>
  `;
  postList.appendChild(li);
}

postList.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-delete')) {
    const id = event.target.dataset.id;
    try {
      await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
      event.target.closest('.post').remove();
    } catch (error) {
      console.error('Помилка при видаленні поста:', error);
    }
  }
});

getPosts();

let commentPage = 1;
const commentsPerPage = 5;

async function loadComments() {
  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?_page=${commentPage}&_limit=${commentsPerPage}`);
    const comments = await response.json();

    const commentList = document.querySelector('.external-comments');

    comments.forEach(comment => {
      const li = document.createElement('li');
      li.className = 'comment-item';
      li.innerHTML = `
        <h4>${comment.name}</h4>
        <p><em>${comment.email}</em></p>
        <p>${comment.body}</p>
      `;
      commentList.appendChild(li);
    });

    commentPage++;
  } catch (error) {
    console.error('Помилка при завантаженні коментарів:', error);
  }
}

document.querySelector('.load-more-btn').addEventListener('click', loadComments);

loadComments();