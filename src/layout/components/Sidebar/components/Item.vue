<template>
  <svg-icon v-if="icon" :icon-class="icon"></svg-icon>
  <span v-if="title" :title="title">{{ title }}</span>
</template>

<script setup lang="ts" name="MenuItem">

const props = defineProps({
  icon: {
    type: String,
    default: '',
    required: false,
  },
  title: {
    type: String,
    default: '',
    required: false,
  }
})
console.log(props.icon)
</script>

<style scoped lang="scss">
</style>