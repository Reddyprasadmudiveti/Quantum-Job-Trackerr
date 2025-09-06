import express from 'express';
import {rssParser, getNewsById} from '../pages/feed.model.js';

const newsRouter = express.Router();

newsRouter.get('/rss', rssParser);
newsRouter.get('/rss/:id', getNewsById);

export default newsRouter;
