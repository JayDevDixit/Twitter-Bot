import { twitterClient } from './twitterClient.js';
import { downloadImage, generateCaption, generateTopic, trycatchwrapper, writelog } from './utils.js';
import { CronJob } from 'cron';
import { getUnsplashImage } from './unsplash.js';

const tweet = trycatchwrapper(async ()=>{
    await writelog('-------------------- Execution Started')


    const topic = await generateTopic()
    if(!topic) throw Error(`Error getting topic ${topic}`)

    const image_url = await getUnsplashImage(topic)
    if(!image_url) throw Error(`Error getting image url from unsplash ${image_url}`)
    
    const caption = await generateCaption(topic)
    if(!caption) throw Error(`Error getting caption from openai ${caption}`)

    const filepath = await downloadImage(image_url)
    if(!filepath) throw Error(`Error getting download filepath ${filepath}`)

    const mediaId = await twitterClient.v1.uploadMedia(filepath);
    if(!mediaId) throw Error(`Error getting mediaId from twitter ${mediaId}`)
    await twitterClient.v2.tweet({
        text: caption,
        media:{
            media_ids: [mediaId]
        }
    })
    // await twitterClient.v2.tweet('Hell is great');
    await writelog('-------------------- Execution Completed Successfully')
})

const cronExp = '0 0 9,15,21 * * *'

const cronTweet = new CronJob(cronExp,tweet)
cronTweet.start();

// tweet()