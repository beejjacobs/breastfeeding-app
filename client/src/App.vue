<template>
  <v-app dark>
    <v-content>
      <v-layout align-center justify-center class="section">
        <v-flex v-if="feeds.length !== 0">
          <div class="display-1 ma-1">Last Feed</div>
          <table class="title mt-1 mb-1">
            <tr>
              <td>Started</td>
              <td>{{lastFeed.dateTime | moment('HH:mm')}}</td>
              <td>{{timeSinceFeed}}</td>
            </tr>
            <tr>
              <td>Next</td>
              <td>{{lastFeed.next | moment('HH:mm')}}</td>
              <td>{{timeToFeed}}</td>
            </tr>
          </table>
          <div class="status mt-1 mb-1">
            <breast :side="lastFeed.first" status></breast>
            <breast v-if="lastFeed.both" :side="lastFeed.first === 'L' ? 'R' : 'L'" status></breast>
          </div>
          <v-btn v-if="!lastFeed.both" dark large color="orange" @click="both">Both</v-btn>
          <div v-else class="spacer"></div>
        </v-flex>
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
        <v-flex>
          <div class="display-1">Start a Feed</div>
          <breast side="L" @click="startFeed('L')"></breast>
          <breast side="R" @click="startFeed('R')"></breast>
        </v-flex>
      </v-layout>
    </v-content>
  </v-app>
</template>

<script>
  import Breast from './Breast';
  import io from 'socket.io-client';
  import util from './util';
  const url = process.env.NODE_ENV === 'production' ? '192.162.0.2' : 'localhost';
  const socket = io.connect(`http://${url}:3002`);

  export default {
    components: {Breast},
    data() {
      return {
        feeds: [],
        timeToFeed: '',
        timeSinceFeed: '',
        loading: true
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
      updateTimes() {
        if (this.lastFeed.hasOwnProperty('next')) {
          this.timeToFeed = util.dateToHoursMinutes(this.lastFeed.next);
        }
        if (this.lastFeed.hasOwnProperty('dateTime')) {
          this.timeSinceFeed = util.dateToHoursMinutes(this.lastFeed.dateTime);
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
      }
    },
    watch: {
      lastFeed(value) {
        this.updateTimes();
      }
    },
    created() {
      setInterval(() => {
        this.updateTimes();
      }, 60 * 1000);

      socket.on('feed', feed => {
        console.log(feed);
        this.feeds.push(util.momentise(feed));
      });
      socket.on('feed-update', feed => {
        console.log(feed);
        this.$set(this.feeds, this.feeds.length - 1, util.momentise(feed));
      });
      socket.on('todays-feeds', feeds => {
        this.loading = false;
        console.log(feeds);
        this.feeds = feeds.map(util.momentise);
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

  .display-1 {
    color: rgba(216, 216, 216, 0.5);
  }

  .section {
    height: 50vh;
    justify-items: center;
    text-align: center;
  }

  .spacer {
    height: 56px;
  }

  .status {
    text-align: left;
    width: 324px;
    margin: 0 auto;
  }

  table.title {
    text-align: left;
    margin: 0 auto;
  }

  table.title td {
    padding: 10px;
  }

  table.title td:first-child {
    text-align: right;
  }
</style>
