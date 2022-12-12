<template>
  <div class="tab-nav">
    <div class="nav-icon">
      <el-icon>
        <el-icon-d-arrow-left/>
      </el-icon>
    </div>
    <el-scrollbar
        ref="scrollbarRef"
        view-class="tags-view-list"
        style="flex-grow: 1">
      <div v-for="tag in visitedViews"
           :key="tag.path"
           class="tags-view-item"
           :class="{ 'active': isActive(tag) }">
        <span>{{ tag.meta.title }}</span>
        <el-icon v-if="!isAffix(tag)" class="del-icon">
          <el-icon-close/>
        </el-icon>
      </div>
    </el-scrollbar>
    <div class="nav-icon">
      <el-icon>
        <el-icon-d-arrow-right/>
      </el-icon>
    </div>
    <div class="nav-icon">
      <el-icon>
        <el-icon-refresh/>
      </el-icon>
    </div>
    <div class="nav-icon">
      <el-icon>
        <el-icon-menu/>
      </el-icon>
    </div>
  </div>
</template>

<script setup lang="ts" name="NavBar">
import {RouteLocationNormalized, RouteMeta, RouteRecordName, RouteRecordRawPlus} from "vue-router";
import path from "path-browserify";
import {usePermissionStore} from "@/store/modules/permission";
import {useTagsViewStore} from "@/store/modules/tagsView";

type affixRoute = {
  fullPath: string,
  path: string,
  name: RouteRecordName | undefined,
  meta: RouteMeta
}
const permissionStore = usePermissionStore()
const tagsViewStore = useTagsViewStore()
const visitedViews = reactive(tagsViewStore.visitedViews);
const route = useRoute()
const router = useRouter()
const routes = permissionStore.routes
let affixTags = ref<affixRoute []>([])


onMounted(() => {
  initTags()
  addTags()
})

watch(route, () => {
  initTags()
  addTags()
})


function initTags() {
  affixTags.value = filterAffixTags(routes)
  for (const tag of affixTags.value) {
    if (tag.name) {
      tagsViewStore.AddVisitedView(tag as RouteLocationNormalized)
    }
  }
}

function addTags() {
  const name = route.name
  if (name) {
    tagsViewStore.AddView(route)
    if (route.meta.link) {
      tagsViewStore.AddIframeView(route)
    }
  }
  return
}

function filterAffixTags(routes: RouteRecordRawPlus[], basePath?: string): affixRoute[] {
  let tags: affixRoute[] = []
  const routePath = basePath ? basePath : "/"
  routes.forEach(route => {
    if (route.meta && route.meta.affix) {
      const tagPath = <string>path.resolve(routePath, route.path)
      tags.push({
        fullPath: tagPath,
        path: tagPath,
        name: route.name,
        meta: {...route.meta}
      })
    }
    if (route.children) {
      const tempTags = filterAffixTags(route.children, route.path)
      if (tempTags.length >= 1) {
        tags = [...tags, ...tempTags]
      }
    }
  })
  return tags

}

function isActive(tag: RouteLocationNormalized) {
  return tag.path === route.path
}

function isAffix(tag: RouteLocationNormalized) {

  return tag.meta && tag.meta.affix
}
</script>

<style scoped lang="scss">
.tab-nav {
  width: 100%;
  height: 40px;
  border-bottom: 1px solid var(--el-border-color);
  display: flex;

  .nav-icon {
    width: 40px;
    height: 100%;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:nth-child(1),
    &:nth-child(3),
    &:nth-child(4) {
      border-right: 1px solid var(--el-border-color);
    }

    &:nth-child(3) {
      border-left: 1px solid var(--el-border-color);
      border-right: 1px solid var(--el-border-color);
    }
  }

  .el-scrollbar {
    width: calc(100% - 160px);

    ::v-deep(.tags-view-list) {
      display: flex;
      height: 100%;
      width: max-content;
      align-items: center;
    }

    .tags-view-item {
      border-right: 1px solid var(--el-border-color);
      height: 100%;
      align-items: center;
      display: flex;
      padding-left: 16px;
      padding-right: 16px;
      flex-shrink: 0;
      flex-grow: 0;
      position: relative;
      cursor: pointer;

      .del-icon {
        height: 100%;
        width: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin-right: -16px;
        visibility: hidden;
      }

      .del-icon:hover {
        font-size: 14px;
      }

      &:hover {
        background-color: rgba(var(--el-color-primary-rgb), 0.1);
        color: var(--el-color-primary);

        .del-icon {
          visibility: unset;
        }
      }

      &::after {
        position: absolute;
        content: '';
        height: 2px;
        bottom: 0;
        left: 0;
        background-color: var(--el-color-primary);
        width: 0;
      }


      &:hover::after,
      &.active::after {
        width: 100%;
        transition: width 0.45s;
      }
    }
  }
}
</style>