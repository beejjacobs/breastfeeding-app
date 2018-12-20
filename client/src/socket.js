import io from 'socket.io-client';
import util from './util';

const url = process.env.NODE_ENV === 'production' ? '192.168.0.2' : 'localhost';
const socket = io.connect(`http://${url}:3002`);

const SocketStorePlugin = store => {
  socket.on('connect', () => {
    store.commit('setConnected', true);
    store.dispatch('recall');
  });
  socket.on('disconnect', () => {
    store.commit('setConnected', false);
  });
  socket.on('feed', feed => {
    console.log('feed ', feed);
    store.commit('addFeed', util.momentise(feed));
  });
  socket.on('feed-update', feed => {
    console.log('feed-update ', feed);
    store.commit('updateLastFeed', util.momentise(feed));
  });
  socket.on('feeds', feeds => {
    store.commit('setLoading', false);
    console.log('feeds ', feeds);
    store.commit('setFeeds', feeds.map(util.momentise));
  });
  socket.on('add-feed', feed => {
    console.log('add-feed ', feed);
    store.commit('addOrInsertFeed', util.momentise(feed));
  });
  socket.on('edit-feed', (feed, newFeed) => {
    console.log('edit-feed ', feed);
    store.commit('editFeed', {
      feed: util.momentise(feed),
      newFeed: util.momentise(newFeed)
    });
  });
  socket.on('delete-feed', feed => {
    console.log('delete-feed ', feed);
    store.commit('deleteFeed', util.momentise(feed));
  });
};

export {SocketStorePlugin, socket};
export default socket;
