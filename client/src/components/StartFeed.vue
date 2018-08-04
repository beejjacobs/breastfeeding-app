<template>
  <v-flex>
    <div class="display-1">Start a Feed</div>
    <breast side="L" @click="startFeed('L')"></breast>
    <breast side="R" @click="startFeed('R')"></breast>
  </v-flex>
</template>

<script>
  export default {
    name: "StartFeed",
    methods: {
      startFeed(side) {
        this.$emit('start-feed', side);
      }
    }
  }
</script>

<style scoped>

</style>
