<template>
  <v-app dark>
    <v-content>
      <v-layout align-center justify-center class="section">
        <last-feed v-if="feeds.length !== 0" :last-feed="lastFeed" :feed-count="todaysFeeds.length" @both="both"></last-feed>
        <history v-if="feeds.length !== 0" :todays-feeds="todaysFeeds" :yesterdays-feeds="yesterdaysFeeds" @delete-feed="deleteFeed" @edit-feed="editFeed"></history>
        <v-flex v-else-if="loading">
          <v-progress-circular
              :size="50"
              color="primary"
              indeterminate
          ></v-progress-circular>
        </v-flex>
        <v-flex v-else>
          <div class="display-1 ma-1">No Feeds Today</div>
        </v-flex>
      </v-layout>
      <v-layout align-center class="section">
        <start-feed @start-feed="startFeed"></start-feed>
      </v-layout>
      <add-feed @new-feed="newFeed"></add-feed>
      <v-btn fab fixed bottom left :color="connected ? 'green' : 'red'">
        <v-icon>{{ connected ? 'link' : 'link_off' }}</v-icon>
      </v-btn>
    </v-content>
  </v-app>
</template>

<script>
  import socket from './socket';
  import util from './util';

  export default {
    data() {
      return {
        feeds: [],
        loading: true,
        addDialog: false,
        historyDialog: false,
        connected: false
      }
    },
    methods: {
      startFeed(side) {
        let feed = {dateTime: this.$moment(), first: side, both: false};
        this.action('feed', feed);
        this.feeds.push(feed);
      },
      both() {
        this.lastFeed.both = true;
        this.action('feed-update', this.lastFeed);
      },
      newFeed(feed) {
        feed = util.momentise(feed);
        this.action('add-feed', feed);
        let index = util.insertIndex(this.feeds, feed);
        if (index === -1) {
          this.feeds.push(feed);
        } else {
          this.feeds.splice(index, 0, feed);
        }
      },
      editFeed(feed, newFeed) {
        newFeed = util.momentise(newFeed);
        this.action('edit-feed', feed, newFeed);
        let index = this.feeds.findIndex(value => util.match(feed, value));
        if (index !== -1) {
          this.feeds.splice(index, 1, newFeed);
        } else {
          console.log('feed not found');
        }
      },
      deleteFeed(feed) {
        this.action('delete-feed', feed);
        let index = this.feeds.findIndex(value => util.match(feed, value));
        if (index !== -1) {
          this.feeds.splice(index, 1);
        } else {
          console.log('feed not found');
        }
      },
      action(action, feed, newFeed) {
        if (this.connected) {
          socket.emit(action, feed, newFeed);
        } else {
          let feedCopy = {dateTime: feed.dateTime.format(), first: feed.first, both: feed.both};
          let newFeedCopy = {};
          if (newFeed) {
            newFeedCopy = {dateTime: newFeed.dateTime.format(), first: newFeed.first, both: newFeed.both};
          }
          this.$store.commit('addAction', {action: action, feed: feedCopy, newFeed: newFeedCopy});
        }
      }
    },
    computed: {
      lastFeed() {
        if (this.feeds.length === 0) {
          return {};
        }
        let feed = this.feeds[this.feeds.length - 1];
        feed.next = feed.dateTime.clone().add(2, 'hours');
        return feed;
      },
      todaysFeeds() {
        return this.feeds.filter(util.isToday);
      },
      yesterdaysFeeds() {
        return this.feeds.filter(util.isYesterday);
      }
    },
    created() {
      setTimeout(() => {
        this.loading = false;
      }, 2000);

      socket.on('connect', () => {
        this.connected = true;
        this.$store.dispatch('recall');
      });
      socket.on('disconnect', () => {
        this.connected = false;
      });
      socket.on('feed', feed => {
        console.log('feed ', feed);
        this.feeds.push(util.momentise(feed));
      });
      socket.on('feed-update', feed => {
        console.log('feed-update ', feed);
        this.$set(this.feeds, this.feeds.length - 1, util.momentise(feed));
      });
      socket.on('feeds', feeds => {
        this.loading = false;
        console.log('feeds ', feeds);
        this.feeds = feeds.map(util.momentise);
      });
      socket.on('add-feed', feed => {
        console.log('add-feed ', feed);
        feed = util.momentise(feed);
        let index = util.insertIndex(this.feeds, feed);
        if (index === -1) {
          this.feeds.push(feed);
        } else {
          this.feeds.splice(index, 0, feed);
        }
      });
      socket.on('edit-feed', (feed, newFeed) => {
        console.log('edit-feed ', feed);
        feed = util.momentise(feed);
        let index = this.feeds.findIndex(value => util.match(feed, value));
        if (index !== -1) {
          newFeed = util.momentise(newFeed);
          this.feeds.splice(index, 1, newFeed);
        } else {
          console.log('feed not found');
        }
      });
      socket.on('delete-feed', feed => {
        console.log('delete-feed ', feed);
        feed = util.momentise(feed);
        let index = this.feeds.findIndex(value => util.match(feed, value));
        if (index !== -1) {
          this.feeds.splice(index, 1);
        } else {
          console.log('feed not found');
        }
      });
    }
  }
</script>

<style>
  .application.theme--dark {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: black;
    color: #d8d8d8;
  }
  .theme--dark .v-card {
    background: black;
  }

  .display-1 {
    color: rgba(216, 216, 216, 0.5);
  }

  .section {
    height: 50vh;
    justify-items: center;
    text-align: center;
  }
</style>
