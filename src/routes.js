// Global
const HOME = '/';
const JOIN = '/join';
const LOGIN = '/login';
const LOGOUT = '/logout';
const SEARCH = '/search';

// Users
const USERS = '/users';
const USER_DETAIL = '/:id';
const EDIT_PROFILE = '/edit-profile';
const EDIT_PASSWORD = '/edit-password';
const ME = '/me';

// Videos
const VIDEOS = '/videos';
const UPLOAD = '/upload';
const VIDEO_DETAIL = '/:id';
const EDIT_VIDEO = '/:id/edit';
const DELETE_VIDEO = '/:id/delete';

// Github
const GITHUB = '/auth/github';
const GITHUB_CALLBACK = '/auth/github/callback';

// API
const API = '/api';
const REGISTER_VIEW = '/:id/view';
const ADD_COMMENT = '/:id/comment';
const DELETE_COMMENT = '/:id/comment/:commentId/delete';

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => {
    if (id) return `${USERS}${USER_DETAIL.replace(':id', id)}`;
    else return USER_DETAIL;
  },
  editProfile: EDIT_PROFILE,
  editPassword: EDIT_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => {
    if (id) return `${VIDEOS}${VIDEO_DETAIL.replace(':id', id)}`;
    else return VIDEO_DETAIL;
  },
  editVideo: (id) => {
    if (id) return `${VIDEOS}${EDIT_VIDEO.replace(':id', id)}`;
    else return EDIT_VIDEO;
  },
  deleteVideo: (id) => {
    if (id) return `${VIDEOS}${DELETE_VIDEO.replace(':id', id)}`;
    else return DELETE_VIDEO;
  },
  gitHub: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  me: ME,
  api: API,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  deleteComment: (id, commentId) => {
    if (id)
      return `${API}${DELETE_COMMENT.replace(':id', id).replace(
        ':commentId',
        commentId
      )}`;
    else return DELETE_COMMENT;
  },
};

export default routes;
