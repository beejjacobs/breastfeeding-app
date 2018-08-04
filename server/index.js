const io = require('socket.io')(3002);
const moment = require('moment');
const fs = require('fs');

/** @type Array */
let feeds = require('./feeds/all-feeds');

function todaysFeeds() {
  let now = moment();
  return feeds.filter(value => moment(value.dateTime).isSame(now, 'day'));
}

function lastFeed() {
  return feeds[feeds.length - 1];
}

function insertIndex(feed) {
  return feeds.findIndex(f => {
    return moment(f.dateTime).diff(feed.dateTime) > 0;
  });
}

io.on('connection', function (socket) {
  let message = 'client connected';
  let toSend = [];
  if (feeds.length === 0) {
    message += ': no feeds';
  } else {
    let todays = todaysFeeds();
    if (todays.length === 0) {
      let last = lastFeed();
      message += `: no feeds today, sending last feed (${JSON.stringify(last)})`;
      toSend.push(last);
    } else {
      message += `: sending todays feeds (${todays.length})`;
      toSend = todays;
    }
  }
  console.log(message);
  socket.emit('todays-feeds', toSend);

  socket.on('feed', feed => {
    feeds.push(feed);
    console.log(`added feed (${feeds.length}) `,feed);
    socket.broadcast.emit('feed', feed);
    saveFeeds();
  });

  socket.on('feed-update', feed => {
    delete feed.next;
    feeds[feeds.length - 1] = feed;
    console.log(`updated feed `, feed);
    socket.broadcast.emit('feed-update', feed);
    saveFeeds();
  });

  socket.on('add-feed', feed => {
    delete feed.next;
    let index = insertIndex(feed);
    if (index === -1) {
      feeds.push(feed);
    } else {
      feeds.splice(index, 0, feed);
    }
    console.log(`add-feed at ${index}`, feed);
    socket.broadcast.emit('add-feed', feed);
    saveFeeds();
  });
});

function saveFeeds() {
  fs.writeFileSync(`./feeds/all-feeds.json`, JSON.stringify(feeds, null, 2), 'utf8');
}
