<template>
  <div v-if="isExternalIcon"
       :style="{ '--svg-icon-url': `url(${iconClass})` }"
       class="svg-icon svg-external-icon"
       :class="className"/>
  <svg v-else
       class="svg-icon"
       :class="className"
       aria-hidden="true">
    <use :xlink:href="symbolId"/>
  </svg>
</template>

<script setup lang="ts" name="SvgIcon">
import {isExternal} from "@/utils/validate";
const props = defineProps({
  // SVG 图标名称或在线URL
  iconClass: {
    type: String,
    required: true
  },
  // 图标类名
  className: {
    type: String,
    default: ''
  }
})
const isExternalIcon = computed<Boolean>(() => {
  return isExternal(props.iconClass)
})
const symbolId = computed(() => `#icon-${props.iconClass}`);
</script>

<style scoped lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-image: var(--svg-icon-url);
  -webkit-mask-image: var(--svg-icon-url);
  mask-size: cover;
  -webkit-mask-size: cover;
  display: inline-block;
}
</style>