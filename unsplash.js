import {createApi} from 'unsplash-js';
import { checkKey, getRandomImage, trycatchwrapper } from './utils.js';
import dotenv from 'dotenv';
dotenv.config();
checkKey([process.env.UNSPLASH_ACCESS_KEY,process.env.UNSPLASH_SECRET_KEY]);

const unsplash = createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
    fetch: fetch,
})

export const getUnsplashImage = trycatchwrapper(async (query='nature')=>{
    const url = await getRandomImage(unsplash,query);
    return url;
})
