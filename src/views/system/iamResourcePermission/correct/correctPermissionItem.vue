<template>
  <div class="correct-permission">
    <span> {{permissionItem.displayName}}</span>
    <ul>
      <li v-for="(api, index) in permissionItem.apiSetList" :key="`${_uid}_${index}`">
        <template v-if="permissionItem.invalidApiSetList.includes(api)">
          <error-api
            :api="api"
                     :api-tree-list="apiTreeList"
                     :resource-permission-id="permissionItem.id"
                     :api-set-list="permissionItem.apiSetList"
                     @refresh="handleRefresh"></error-api>
        </template>
        <template v-else>
          <span :style="{color: 'blue'}">{{api}}</span>
        </template>
      </li>
    </ul>
    <template v-if="permissionItem.children && permissionItem.children.length > 0">
      <correct-permission-item
        v-for="(itemChild, itemChildIndex) in permissionItem.children"
                               :key="`${_uid}_item_${itemChildIndex}`"
                               :permission-item="itemChild"
                               :api-tree-list="apiTreeList"
        @refresh="handleRefresh"
      ></correct-permission-item>
    </template>
  </div>
</template>

<script>
  import ErrorApi from './errorApi'
  export default {
    name: 'CorrectPermissionItem',
    components: { ErrorApi },
    methods: {
      handleRefresh () {
        this.$emit('refresh')
      }
    },
    props: {
      permissionItem: {
        type: Object,
        required: true
      },
      apiTreeList: {
        type: Array,
        required: true
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
.correct-permission {
  margin-left: 30px;
}
</style>
