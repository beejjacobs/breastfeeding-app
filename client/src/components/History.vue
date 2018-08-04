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
          <td>Time</td>
          <td></td>
        </tr>
        <tr v-for="feed in feeds"
            :key="feed.dateTime.format()">
          <td>{{feed.dateTime.format('HH:mm')}}</td>
          <td>
            <breast :side="feed.first" status :large="false"></breast>
            <breast v-if="feed.both" :side="feed.first === 'L' ? 'R' : 'L'" status :large="false"></breast>
          </td>
        </tr>
      </table>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "History",
    props: ['feeds'],
    data() {
      return {
        show: false
      };
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

  td:nth-child(2) {
    text-align: left;
  }

  table td, table th {
    border: 1px solid rgba(216, 216, 216, 0.5);
    padding: 5px;
  }
</style>
