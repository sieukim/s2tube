import passport from 'passport';
import User from '../models/User';
import routes from '../routes';

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};
export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  failureFlash: 'Check email or password',
  successRedirect: routes.home,
  successFlash: 'Welcome!',
});

export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name: name || email.split('@')[0],
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

export const postGithubLogIn = (req, res) => {
  res.redirect(routes.home);
};

export const logout = (req, res) => {
  req.flash('info', 'See you later');
  req.logout();
  res.redirect(routes.home);
};

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const postJoin = async (req, res, next) => {
  const { name, email, password, password2 } = req.body;
  if (password !== password2) {
    req.flash('error', 'Password does not match');
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = new User({
        name,
        email,
      });
      await User.register(user, password);
      next();
    } catch (error) {
      req.flash('error', 'User Already Registered');
      res.redirect(routes.home);
    }
  }
};

export const getEditProfile = (req, res) => {
  res.render('editProfile', { pageTitle: 'Edit Profile' });
};
export const postEditProfile = async (req, res) => {
  const { name, email } = req.body;
  const { file } = req;
  try {
    await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      avatarUrl: file ? file.path : req.user.avatarUrl,
    });
    res.redirect(routes.me);
  } catch (error) {
    res.redirect(routes.editProfile);
  }
};

export const getEditPassword = (req, res) => {
  res.render('editPassword', { pageTitle: 'Edit Password' });
};
export const postEditPassword = async (req, res) => {
  const { oldPassword, newPassword, newPassword1 } = req.body;
  try {
    if (newPassword !== newPassword1) {
      res.status(400);
      res.redirect(`/users/${routes.changePassword}`);
      return;
    }
    await req.user.changePassword(oldPassword, newPassword);
    res.redirect(routes.me);
  } catch (error) {
    res.status(400);
    res.redirect(`/users/${routes.editPassword}`);
  }
};

export const getMe = async (req, res) => {
  await User.populate(req.user, 'videos');
  res.render('userDetail', { pageTitle: 'Profile', user: req.user });
};

export const userDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: 'Profile', user });
  } catch (error) {
    res.redirect(routes.home);
  }
};
