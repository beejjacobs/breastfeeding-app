const io = require('socket.io')(3002);
const schedule = require('node-schedule');
const moment = require('moment');
const fs = require('fs');

let feeds = [];

function todaysFeeds() {
  let now = moment();
  return feeds.filter(value => moment(value.dateTime).isSame(now, 'day'));
}

io.on('connection', function (socket) {
  console.log(`client connected: sending today's feeds (${feeds.length})`);
  socket.emit('todays-feeds', feeds);

  socket.on('feed', feed => {
    feeds.push(feed);
    console.log(`added feed (${feeds.length})`);
    socket.broadcast.emit('feed', feed);
  });

  socket.on('feed-update', feed => {
    delete feed.next;
    feeds[feeds.length - 1] = feed;
    console.log('updated feed');
    socket.broadcast.emit('feed-update', feed);
  });
});

schedule.scheduleJob('0 0 * * *', () => {
  saveFeeds();
});

function saveFeeds() {
  fs.writeFileSync(`./feeds/all-feeds.json`, JSON.stringify(feeds), 'utf8');
}
