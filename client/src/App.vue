<template>
  <v-app dark>
    <v-content>
      <v-layout align-center justify-center class="section">
        <last-feed v-if="feeds.length !== 0" :last-feed="lastFeed" :feeds="todaysFeeds" @both="both"></last-feed>
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
    </v-content>
  </v-app>
</template>

<script>
  import io from 'socket.io-client';
  import util from './util';

  const url = process.env.NODE_ENV === 'production' ? '192.168.0.2' : 'localhost';
  const socket = io.connect(`http://${url}:3002`);

  export default {
    data() {
      return {
        feeds: [],
        loading: true,
        addDialog: false,
        historyDialog: false
      }
    },
    methods: {
      startFeed(side) {
        let feed = {dateTime: this.$moment(), first: side, both: false};
        socket.emit('feed', feed);
        this.feeds.push(feed);
      },
      both() {
        this.lastFeed.both = true;
        socket.emit('feed-update', this.lastFeed);
      },
      newFeed(feed) {
        feed = util.momentise(feed);
        socket.emit('add-feed', feed);
        let index = util.insertIndex(this.feeds, feed);
        if (index === -1) {
          this.feeds.push(feed);
        } else {
          this.feeds.splice(index, 0, feed);
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
      }
    },
    created() {
      socket.on('feed', feed => {
        console.log('feed ', feed);
        this.feeds.push(util.momentise(feed));
      });
      socket.on('feed-update', feed => {
        console.log('feed-update ', feed);
        this.$set(this.feeds, this.feeds.length - 1, util.momentise(feed));
      });
      socket.on('todays-feeds', feeds => {
        this.loading = false;
        console.log('todays-feeds ', feeds);
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
