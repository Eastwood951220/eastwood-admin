<template>
  <div class="pagination-container">
    <el-pagination
        small
        v-bind="$attrs"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts" name="Pagination">
const props = defineProps({
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
})

type paginationType = {
  page: number,
  limit: number
}

const emit = defineEmits<{
  (e: 'update:pagination', value: paginationType): void,
  (e: 'update:page', value: number): void
  (e: 'update:limit', value: number): void
}>();

const currentPage = computed<number>({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})
const pageSize = computed<number>({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

function handleSizeChange(val: number) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('update:pagination', {page: currentPage.value, limit: val})
}

function handleCurrentChange(val: number) {
  emit('update:pagination', {page: val, limit: pageSize.value})
}

</script>

<style scoped lang="scss">
.pagination-container{
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>