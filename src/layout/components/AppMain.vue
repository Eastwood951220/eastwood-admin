<template>
  <section class="app-main" id="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </section>
</template>

<script setup lang="ts" name="AppMain">
import {useTagsViewStore} from "@/store/modules/tagsView";

const tagsViewStore = useTagsViewStore();
const cachedViews = ref(tagsViewStore.cachedViews)
const route = useRoute()
const key = computed(() => {
  return route.path
})
</script>

<style scoped lang="scss">
.app-main {
  width: 100%;
  height: 100%;
}
</style>