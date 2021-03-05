import axios from 'axios';

const addCommentForm = document.getElementById('jsAddComment');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');
const commentForm = document.querySelectorAll('.video__comment-form');

const setNumber = () => {
  const numbers = document.querySelectorAll('.video__comment-form').length;
  console.log(numbers);
  if (numbers > 0) {
    commentNumber.innerHTML = `${numbers} comments`;
  } else {
    commentNumber.innerHTML = `${numbers} comment`;
  }
};

const addComment = ({
  _id: commentId,
  text,
  creator: { avatarUrl, _id: creatorId },
}) => {
  const videoId = window.location.href.split('/videos/')[1].replace('?', '');
  const form = document.createElement('form');

  form.innerHTML = `
  <div class="video__comment_item">
    <a href="/users/${creatorId}">
      <img class="u-avatar" src="${avatarUrl}">
    </a>
    <div class="isAuthenticated">
      <li>
        <span>${text}</span>
      </li>
      <input type="submit" value="delete">
    </div>
  </div>`;
  form.classList.add('video__comment-form');
  form.action = `/api/${videoId}/comment/${commentId}/delete`;
  form.method = 'POST';

  form.addEventListener("submit",handleDeleteSubmit);

  commentList.prepend(form);
  setNumber();
};

const sendComment = async (comment) => {
  const videoId = window.location.href.split('/videos/')[1].replace('?', '');
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: 'POST',
    data: { comment },
  });
  if (response.status === 200) {
    addComment(response.data);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector('input');
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = '';
};

const handleDeleteSubmit = async (event) => {
  event.preventDefault();
  const form = event.target;
  const { action } = form;
  const response = await axios({
    url: action,
    method: 'POST',
  });
  if (response.status === 200) {
    form.remove();
    setNumber();
  }
};

function init() {
  addCommentForm.addEventListener('submit', handleSubmit);
  for (const form of commentForm) {
    form.addEventListener('submit', handleDeleteSubmit);
  }
}

if (addCommentForm) {
  init();
}
