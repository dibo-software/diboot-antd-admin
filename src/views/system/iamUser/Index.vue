<template>
  <a-card :bordered="false">
    <a-row v-if="showTreeNode">
      <a-col :span="6">
        <org-tree @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`" ref="orgTree"></org-tree>
      </a-col>
      <a-col :span="18">
        <user-list :current-node-id="currentNodeId" ref="userList" />
      </a-col>
    </a-row>
    <user-list v-else v-permission-missing="['orgTree']" :current-node-id="currentNodeId" ref="userList" />
  </a-card>
</template>

<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import userList from './list'
import { hasPermissions } from '@/core/permission/checkPermission'

export default {
  name: 'OrgUserList',
  components: {
    orgTree,
    userList
  },
  data () {
    return {
      currentNodeId: ''
    }
  },
  computed: {
    showTreeNode () {
      return this.hasPermissions(['orgTree'], this)
    }
  },
  methods: {
    hasPermissions
  }

}
</script>
<style lang="less" scoped>
</style>
