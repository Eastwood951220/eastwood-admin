<template>
  <div class="breadcrumb-container">
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
          <span v-if="item.redirect === 'noRedirect' || index === levelList.length - 1"
                class="no-redirect">{{ item.meta.title }}</span>
          <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>

</template>

<script setup lang="ts" name="Breadcrumb">
import {RouteLocationMatched, RouteRecordRawPlus, RouteLocation} from 'vue-router'
import _ from 'lodash'

const levelList = ref<RouteRecordRawPlus[]>([])
const route = useRoute()
const router = useRouter()

const IndexRoute = router.getRoutes().filter(f => f.path === '/index' && f.name === 'Index') as RouteLocationMatched[]

getBreadcrumb()

watch(route, (val) => {
  if (route.path.startsWith('/redirect/')) {
    return
  }
  getBreadcrumb()
})

function getBreadcrumb() {
  let matched: RouteLocationMatched[] = route.matched.filter(item => item.meta && item.meta.title)
  const first = matched[0]
  if (!isDashboard(first)) {
    matched = IndexRoute.concat(matched)
  }
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

function isDashboard(route: RouteLocationMatched) {
  if (!route) return false
  const name = <string>route.name
  if (!name) return false
  return _.trim(name) === 'Index'
}

function handleLink(item: RouteLocationMatched) {
  const {redirect, path} = item
  if (redirect) {
    router.push(<RouteLocation>redirect)
    return
  }
  router.push(path)
}

</script>

<style scoped lang="scss">
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>