var express = require('express');
var router = express.Router();
const cheerio = require('cheerio')
const request = require('request-promise')

/* GET home page. */
router.get('/', function(req, res, next) {

  const init = async () =>{
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
      const dataTrump = {
        filteredByLike:filteredByLike,
        bgImg:bgImg
      }

      res.render('index', { dataTrump });
  }
  init()
});

module.exports = router;
