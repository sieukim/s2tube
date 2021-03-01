import passport from 'passport';
import User from '../models/User';
import routes from '../routes';

export const getLogin = (req, res) => {
  res.render('login', { pageTitle: 'Login' });
};
export const postLogin = passport.authenticate('local', {
  failureRedirect: routes.login,
  successRedirect: routes.home,
});

export const githubLogin = passport.authenticate('github');

export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avatar_url: avataUrl, name, email },
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
      avataUrl,
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
  req.logout();
  res.redirect(routes.home);
};

export const getJoin = (req, res) => {
  res.render('join', { pageTitle: 'Join' });
};
export const postJoin = async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (password !== password2) {
    res.status(400);
    res.render('join', { pageTitle: 'Join' });
  } else {
    try {
      const user = new User({
        name,
        email,
      });
      await User.register(user, password);
      res.redirect(routes.home);
    } catch (error) {
      console.log(error);
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
      avataUrl: file ? file.path : req.user.avataUrl,
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
  res.render('userDetail', { pageTitle: req.user.name, user: req.user });
};

export const userDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate('videos');
    res.render('userDetail', { pageTitle: user.name, user });
  } catch (error) {
    res.redirect(routes.home);
  }
};
