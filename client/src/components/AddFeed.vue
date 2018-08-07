<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed bottom right color="green darken-2"><v-icon>add</v-icon></v-btn>
    <feed-view title="Add a Feed" @close="show = false" @edit-feed="add"></feed-view>
  </v-dialog>
</template>

<script>
  export default {
    name: "AddFeed",
    data() {
      return {
        show: false
      };
    },
    methods: {
      add(feed) {
        this.$emit('new-feed', Object.assign({}, feed));
        this.show = false;
      }
    }
  }
</script>

<style scoped>
</style>
