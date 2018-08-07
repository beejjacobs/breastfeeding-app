<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed top right color="blue darken-3">
      <v-icon>history</v-icon>
    </v-btn>
    <v-card class="main">
      <v-btn fab fixed top right @click="show = false" color="error">
        <v-icon>close</v-icon>
      </v-btn>
      <div class="display-1">Today's Feeds</div>
      <table>
        <tr>
          <td></td>
          <td>Time</td>
          <td></td>
        </tr>
        <tr v-for="(feed, i) in feeds" :key="i">
          <td>
            <v-speed-dial direction="right" v-model="menus[i]">
              <v-btn slot="activator" color="blue darken-2" v-model="menus[i]" dark fab small><v-icon>settings</v-icon><v-icon>close</v-icon></v-btn>
              <v-btn fab dark small color="green" @click="edit(feed)"><v-icon>edit</v-icon></v-btn>
              <v-btn fab dark small color="red darken-3" @click="$emit('delete-feed', feed)"><v-icon>delete</v-icon></v-btn>
            </v-speed-dial>
          </td>
          <td :class="{hide: menus[i]}">{{feed.dateTime.format('HH:mm')}}</td>
          <td>
            <breast :side="feed.first" status :large="false"></breast>
            <breast v-if="feed.both" :side="feed.first === 'L' ? 'R' : 'L'" status :large="false"></breast>
          </td>
        </tr>
      </table>
    </v-card>
    <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="showEdit">
      <feed-view title="Edit a Feed" @close="showEdit = false" :feed="editFeed" @edit-feed="commitEdit"></feed-view>
    </v-dialog>
  </v-dialog>
</template>

<script>
  export default {
    name: "History",
    props: ['feeds'],
    data() {
      return {
        show: false,
        showEdit: false,
        editFeed: {},
        menus: []
      };
    },
    watch: {
      feeds() {
        this.menus.length = this.feeds.length;
      }
    },
    methods: {
      edit(feed) {
        this.editFeed = feed;
        this.showEdit = true;
      },
      commitEdit(feed) {
        this.$emit('edit-feed', this.editFeed, feed);
        this.showEdit = false;
      }
    }
  }
</script>

<style scoped>
  .main {
    text-align: center;
  }
  .display-1 {
    padding-top: 25px;
    margin-bottom: 20px;
  }

  table {
    font-size: large;
    margin: 0 auto;
    min-width: 50vw;
    border-collapse: collapse;
    border-style: hidden;
  }

  td:last-child {
    text-align: left;
  }
  td:nth-child(2) {
    min-width: 128px;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
    transition: 0.5s;
  }

  .hide {
    color: black;;
  }
</style>
