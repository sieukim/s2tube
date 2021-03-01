import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import globalRouter from './routers/globalRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';
import apiRouter from './routers/apiRouter';
import routes from './routes';
import { localsMiddleware } from './middlewares';
import flash from 'express-flash';

import './passport';

const app = express();

const CookieStore = MongoStore(session);

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ['*'],
      scriptSrc: ['unsafe-eval', 'localhost'],
    },
  })
);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CookieStore({ mongooseConnection: mongoose.connection }),
  })
);
app.use(flash());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;
