import routes from '../routes';
import Video from '../models/Video';
import Comment from '../models/Comment';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).sort({ _id: -1 });
    res.render('home', { pageTitle: 'Home', videos });
  } catch (error) {
    console.error(error);
    res.render('home', { pageTitle: 'Home', videos: [] });
  }
};
export const search = async (req, res) => {
  const { term: searchingFor } = req.query;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingFor, $options: 'i' },
    });
  } catch (error) {
    console.log(error);
  }
  res.render('search', { pageTitle: 'Search', searchingFor, videos });
};

export const getUpload = (req, res) => {
  res.render('upload', { pageTitle: 'Upload' });
};
export const postUpload = async (req, res) => {
  const { title, description } = req.body;
  const { path } = req.file;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
    creator: req.user.id,
  });
  req.user.videos.push(newVideo.id);
  req.user.save();
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id)
      .populate('creator')
      .populate('comments');
    res.render('videoDetail', { pageTitle: video.title, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const getEditVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      res.render('editVideo', { pageTitle: `Edit ${video.title}`, video });
    }
  } catch (error) {
    console.error(error);
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    await Video.findOneAndUpdate(id, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    if (video.creator != req.user.id) {
      throw Error();
    } else {
      await Video.findOneAndRemove({ _id: id });
    }
  } finally {
    res.redirect(routes.home);
  }
};

export const postRegisterView = async (req, res) => {
  const { id } = req.params;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

export const postAddComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const user = req;

  try {
    const video = await Video.findById(id);
    const newComment = await Comment.create({
      text: comment,
      creator: user.id,
    });
    video.comments.push(newComment.id);
    video.save();
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
