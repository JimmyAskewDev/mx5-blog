const https = require('https');
const fs = require('fs')
// For now it makes sense to only use global var to populate the blog content
// as and when the website expands this method will become unreliable
let API_GW_URL = ""
// For local dev only, I dont want this gw url publicly available
const path = './local.config' //assumes the file is placed in root dir (e.g. next to package.json)
if (fs.existsSync(path)) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data.trim())
    let API_GW_URL = data.trim()
    GetPosts(API_GW_URL)
  });
} //else {
  //GetPosts(API_GW_URL)
//}


module.exports = function GetPosts(gateway) {
  /* This will build an array of objects to be processed
    DATA FORMAT:
    [
      {
        date: '2023-03-10T14:04:31.161428',
        blog_post: 'value2',
        post_id: 'value1',
        poster_name: 'Jimmy Askew'
      },
      {
        date: '2023-03-10T14:05:30.161428',
        blog_post: 'value3',
        post_id: 'value2',
        poster_name: 'Jimmy Askew'
      }
    ]
  */
  https.get(`https://${gateway}.execute-api.eu-west-2.amazonaws.com/Live`, res => {
  let data = [];
  let blogArray = [];

  res.on('data', chunk => {
    data.push(chunk);
  });

  res.on('end', () => {
    console.log('Response ended: ');
    const posts = JSON.parse(Buffer.concat(data).toString());
    for (const [key, val] of Object.entries(posts.body)) {
      blogArray.push(val)
    }
    console.log(blogArray);
    return blogArray
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});

}
