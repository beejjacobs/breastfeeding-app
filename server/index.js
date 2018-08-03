const io = require('socket.io')(3002);
const schedule = require('node-schedule');
const moment = require('moment');
const fs = require('fs');

let feeds = [
  {dateTime: moment(), first: 'R', both: true}
];

function todaysFeeds() {
  return feeds.filter(value => moment(value.dateTime).isSame('now', 'day'));
}

io.on('connection', function (socket) {
  console.log('client connected: sending last feed');
  socket.emit('todays-feeds', todaysFeeds());

  socket.on('feed', feed => {
    feeds.push(feed);
    socket.broadcast.emit('feed', feed);
  });

  socket.on('feed-update', feed => {
    delete feed.next;
    feeds[feeds.length - 1] = feed;
    socket.broadcast.emit('feed-update', feed);
  });
});

schedule.scheduleJob('0 0 * * *', () => {
  saveFeeds();
});

function saveFeeds() {
  fs.writeFileSync(`./feeds/all-feeds.json`, JSON.stringify(feeds), 'utf8');
}
