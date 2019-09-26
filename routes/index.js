const express = require('express');
const router = express.Router();
const cheerio = require('cheerio')
const request = require('request-promise')

/* GET home page. */
router.get('/', function(req, res, next) {

  const init = async () =>{
    try {
      const $ = await request({
        uri:'https://twitter.com/realDonaldTrump',
        transform: body => cheerio.load(body)
       });
       const bgImg = $('img.ProfileAvatar-image').parent().attr('href')
 
       const tweetsArray = []
       const tweets = $('.ProfileTweet-actionCount').each((i,el) =>{
         tweetsArray.push($(el).text().trim());
       })
       const filteredByLike = tweetsArray.filter((el) =>{
         return el.includes('Me gusta')
       })
       const tweetLikes = []
       filteredByLike.forEach(el => {
          el.split(' ').forEach(elFiltered => {
            if(elFiltered === 'Me'){
              return
            } else if( elFiltered === 'gusta'){
              return
            }else{
              tweetLikes.push(Number(elFiltered).toFixed(3))
            }
          })
        })
        tweetLikes.length = 10
        const totalLikes = tweetLikes.reduce((a,e) =>{
          const likes = Number(e)
          return a + likes
        },0)

        const roundedTotalLikes = Number(totalLikes).toFixed(3)

        let worldWillEnd = null;
        if(Number(roundedTotalLikes)*1000 >= 350000){
          worldWillEnd = 'https://images2.minutemediacdn.com/image/upload/c_fill,g_auto,h_1248,w_2220/f_auto,q_auto,w_1100/v1554933379/shape/mentalfloss/nuclear-bomb-dirty-470309868.jpg'
        }

       const dataTrump = {
        worldWillEnd: worldWillEnd,
        totalLikes: roundedTotalLikes,
        tweetLikes:tweetLikes,
        bgImg:bgImg
       }
  
         res.render('index', { dataTrump });
  
    } catch (error) {
      console.log(error)
    }

  }
  init()
});

module.exports = router;
