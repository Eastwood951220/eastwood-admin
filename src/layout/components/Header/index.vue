<template>
  <top-bar/>
  <nav-bar/>
</template>

<script setup lang="ts" name="Header">
import TopBar from './components/TopBar.vue'
import NavBar from './components/NavBar.vue'
</script>

<style scoped lang="scss">

.tag-bar {
  height: 40px;
}
</style>