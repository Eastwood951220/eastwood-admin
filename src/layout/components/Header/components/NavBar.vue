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
        style="flex-grow: 1"
        @scroll="handleScroll">
      <div v-for="item in visitedViews"
           :key="item.path"
           class="tags-view-item"
           :class="{ 'active': isActive(item) }"
           @click="jumpRoute(item)"
           @contextmenu.prevent="openContextmenu($event.currentTarget,item)">
        <span>{{ item.meta.title }}</span>
        <el-icon v-if="!isAffix(item)" class="del-icon" @click.stop.prevent="closeSelectedTag(item)">
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
  <contextmenu v-if="virtualRef"
               ref="contextmenuRef"
               :current="contextmenuCurrent"
               :visible="showContextmenu"
               :virtual-ref="virtualRef"/>
</template>

<script setup lang="ts" name="NavBar">
import type {Ref} from "vue";
import {RouteLocationNormalized, RouteMeta, RouteRecordName, RouteRecordRawPlus} from "vue-router";
import type {ElScrollbar} from 'element-plus'
import path from "path-browserify";
import {usePermissionStore} from "@/store/modules/permission";
import {useTagsViewStore} from "@/store/modules/tagsView";
import Contextmenu from "./Contextmenu.vue";
import $tabs from "@/plugins/tabs"
import _ from 'lodash'

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

/**
 * 初始化Tags
 */
function initTags() {
  affixTags.value = filterAffixTags(routes)
  for (const tag of affixTags.value) {
    if (tag.name) {
      tagsViewStore.AddVisitedView(tag as RouteLocationNormalized)
    }
  }
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

function isActive(tag: RouteLocationNormalized) {
  return tag.path === route.path
}

function isAffix(tag: RouteLocationNormalized) {
  return tag.meta && tag.meta.affix
}

function jumpRoute(tag: RouteLocationNormalized) {
  if (!isActive(tag)) {
    router.push(tag.fullPath)
  }
}

function closeSelectedTag(tag: RouteLocationNormalized) {
  $tabs.closePage(tag).then((res) => {
    if (isActive(tag)) {
      toLastTag(tag)
    }
  })
}

function toLastTag(tag: RouteLocationNormalized) {
  const latestView = _.last(visitedViews)
  if (latestView) {
    router.push(latestView.fullPath)
  } else {
    if (tag.name === 'Dashboard') {
      // to reload home page
      router.replace({path: '/redirect' + tag.fullPath})
    } else {
      router.push('/')
    }
  }
}

// 右键
const contextmenuCurrent: Ref<RouteLocationNormalized | undefined> = ref();
const virtualRef: Ref<HTMLElement | undefined> = ref();
const showContextmenu: Ref<Boolean> = ref(false);
const contextmenuRef: Ref<InstanceType<typeof Contextmenu>> = ref();

watch(showContextmenu, function (value) {
  if (value) {
    document.body.addEventListener('click', closeContextMenu)
  } else {
    document.body.removeEventListener('click', closeContextMenu)
  }
})


function openContextmenu(event: HTMLElement, current: RouteLocationNormalized, show: Boolean = true) {
  virtualRef.value = event
  contextmenuCurrent.value = current
  showContextmenu.value = show;
}

function closeContextMenu() {
  virtualRef.value = undefined
  showContextmenu.value = false
}

let scrollLeft = ref(0);
const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const setScrollLeft = (left: number, isAdd = false) => {
  if (isAdd) {
    left = left + scrollLeft.value;
  }
};

function handleScroll(e: { scrollLeft: number }) {
  console.log(e.scrollLeft)
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