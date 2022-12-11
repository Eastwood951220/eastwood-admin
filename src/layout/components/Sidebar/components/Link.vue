<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot/>
  </component>
</template>

<script setup lang="ts" name="AppLink">
import {isExternal} from '@/utils/validate'

const props = defineProps({
  to: {
    type: String,
    required: true
  }
})

const type = computed<String>(() => {
  if (isExternal(props.to)) {
    return 'a'
  }
  return 'router-link'
})

function linkProps(to: string) {
  if (isExternal(to)) {
    return {
      href: to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: to
  }
}

</script>
