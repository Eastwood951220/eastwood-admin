<template>
  <div class="top-bar">
    <Hamburger/>
    <Breadcrumb/>
  </div>
</template>

<script setup lang="ts" name="TopBar">
import Hamburger from "./Hamburger.vue";
import Breadcrumb from "./Breadcrumb.vue";
</script>

<style scoped lang="scss">
.top-bar{
  height: 50px;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  display: flex;
  align-items: center;
}
</style>