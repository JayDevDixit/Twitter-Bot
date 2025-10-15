import chalk from "chalk";
import { openai_main } from "./bot/openai.bot.js";
import fs from 'fs/promises';
import path from 'path'
import { fileURLToPath } from "url";
import axios from 'axios';

const timeStamp = ()=>{
    const options = {
    day: 'numeric',
    month: 'short',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
}

    const date = new Date();
    const stamp = date.toLocaleString('en-GB',options);
    return stamp;
}

const generateRandomNumber = (max=10000)=>{
    return Math.floor(Math.random() * max);
}

export const trycatchwrapper = (fn) => async (...args) =>{
    try{
        return await fn(...args);
    }catch(error){
        const env = process.env.ENV
        if(!env || env.toLocaleLowerCase()=='development'){
            console.log(chalk.red(`Error Occured: ${error.message}`));
            writelog(`Error Occured: ${error.message}`)
        }
    }
}
const writelog = trycatchwrapper(async(errormsg)=>{
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const logdir = path.join(__dirname,'logs')
    await fs.mkdir(logdir,{recursive:true})
    const logfile = path.join(logdir,'error.log')
    await fs.appendFile(logfile,`${timeStamp()}      ${errormsg}\n`,'utf-8')
})

export const checkKey = trycatchwrapper(async (keys)=>{
    const hasUndefined = keys.some(key=> key===undefined)
    if(hasUndefined)
        throw Error('Error .env key is undefined')
})

export const getRandomImage = trycatchwrapper(async (unsplash,query='nature')=>{
    const response = await unsplash.photos.getRandom({
        query,
        orientation: 'squarish'  // option: portrait, landscape
    })
    if(response.type != 'success')
        throw Error('Error occur in requesting for image from unsplash')
    return response.response.urls.full;
})

export const generateTopic = trycatchwrapper(async () => {
    let data = await fs.readFile('./data.json','utf-8')
    data = JSON.parse(data);
    const length = data['topics'].length
    const topic = data['topics'][generateRandomNumber(length)]
    return topic.trim();
});

export const generateCaption = trycatchwrapper(async (topic) => {
  const prompt = `
Write a short, engaging, and catchy caption for a Twitter post about:
"${topic}"

Make it sound like it was written by me, Jay Dev Dixit — a human, not a bot.
Add personal style, humor, and personality, like I would naturally write it.
Use the random seed ${generateRandomNumber()} to make it unique.
`;

  const instruction = `
Rules:
- Keep it under 250 characters.
- Make it sound natural, human, and like Jay Dev wrote it.
- Use a funny, playful, or casual tone (not robotic or formal).
- Add 3–5 relevant hashtags if appropriate.
- Emojis are allowed.
- Do NOT mention AI, bots, or that it's generated.
`;

  const caption = await openai_main(prompt, instruction);
  return caption.trim();
});

export const downloadImage = trycatchwrapper(async (url)=>{
    const response = await axios(url,{
            responseType:'arraybuffer',
            headers: {
                'Accept': 'image/*',
                'User-Agent': 'Mozilla/5.0 (Node.js) Image Downloader',
            },
            maxRedirects: 5,
        })
    if(response.status != 200)
        throw Error('Error in downloading image using axios');
    const __dirname = path.dirname(fileURLToPath(import.meta.url))
    const filePath = path.join(__dirname,'images',`image.png`)
    await fs.mkdir(path.dirname(filePath),{recursive:true})
    const buffer = Buffer.from(response.data);
    await fs.writeFile(filePath,buffer);
    return filePath;
})