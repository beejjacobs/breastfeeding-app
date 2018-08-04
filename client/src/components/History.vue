<template>
  <v-dialog fullscreen hide-overlay transition="dialog-bottom-transition" v-model="show">
    <v-btn slot="activator" fab fixed top right color="blue darken-2"><v-icon>history</v-icon></v-btn>
    <v-card>
      <v-btn fab fixed top right @click="show = false" color="error"><v-icon>close</v-icon></v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: "History",
    data() {
      return {
        show: false
      };
    }
  }
</script>

<style scoped>

</style>
