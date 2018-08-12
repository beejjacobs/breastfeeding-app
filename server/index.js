const io = require('socket.io')(3002);
const moment = require('moment');
const fs = require('fs');
const path = require('path');

let jsonPath = path.join(__dirname, 'feeds', 'all-feeds.json');
console.log(jsonPath);

/** @type Array */
let feeds = require(jsonPath);

function todayAndYesterdaysFeeds() {
  let now = moment();
  let yesterday = moment().subtract(1, 'day');
  return feeds.filter(value => moment(value.dateTime).isSame(now, 'day') || moment(value.dateTime).isSame(yesterday, 'day'));
}

function lastFeed() {
  return feeds[feeds.length - 1];
}

function insertIndex(feed) {
  return feeds.findIndex(f => {
    return moment(f.dateTime).diff(feed.dateTime) > 0;
  });
}

function match(feed1, feed2) {
  return feed1.dateTime === feed2.dateTime && feed1.first === feed2.first && feed1.both === feed2.both;
}

io.on('connection', function (socket) {
  let message = 'client connected';
  let toSend = [];
  if (feeds.length === 0) {
    message += ': no feeds';
  } else {
    let ty = todayAndYesterdaysFeeds();
    if (ty.length === 0) {
      let last = lastFeed();
      message += `: no feeds today or yesterday, sending last feed (${JSON.stringify(last)})`;
      toSend.push(last);
    } else {
      message += `: sending todays and yesterdays feeds (${ty.length})`;
      toSend = ty;
    }
  }
  console.log(message);
  socket.emit('feeds', toSend);

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

  socket.on('edit-feed', (feed, newFeed) => {
    let index = feeds.findIndex(value => match(feed, value));
    if (index !== -1) {
      console.log(`edit-feed at ${index}`, feed);
      feeds.splice(index, 1, newFeed);
      socket.broadcast.emit('edit-feed', feed, newFeed);
      saveFeeds();
    } else {
      console.log(`edit-feed not edited: `, feed, ', feed not found');
    }
  });

  socket.on('delete-feed', feed => {
    let index = feeds.findIndex(value => match(feed, value));
    if (index !== -1) {
      console.log(`delete-feed at ${index}`, feed);
      feeds.splice(index, 1);
      socket.broadcast.emit('delete-feed', feed);
      saveFeeds();
    } else {
      console.log(`delete-feed not removed: `, feed, ', feed not found');
    }
  });
});

function saveFeeds() {
  fs.writeFileSync(jsonPath, JSON.stringify(feeds, null, 2), 'utf8');
}

console.log('listening on port 3002');
