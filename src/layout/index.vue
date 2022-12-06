<template>
  <div>
    <div>2222</div>
    <div>{{ msg}}</div>
    <router-view/>
  </div>

</template>

<script setup lang="ts" name="Layout">
import {useUserStore} from "@/store/modules/user";
const user = useUserStore()
const msg = ref("234")
</script>

<style scoped>

</style>