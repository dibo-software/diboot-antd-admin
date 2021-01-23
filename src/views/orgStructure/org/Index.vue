<template>
  <div class="orgIndex">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :bordered="false">
          <org-tree
            :can-change="true"
            @changeCurrentNode="node => currentNodeId = `${node.value ? node.value : '0'}`"
            ref="orgTree"
            @change="onTreeChange"></org-tree>
        </a-card>
      </a-col>
      <a-col :span="16">
        <current-detail :current-node-id="currentNodeId"></current-detail>
        <a-card :bordered="false" style="padding-top: 0;">
          <a-tabs>
            <a-tab-pane :tab="orgTabTitle" key="0">
              <org-list :current-node-id="currentNodeId" @formComplete="$refs.orgTree.loadTree()" ref="orgList"></org-list>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
    <org-form ref="orgForm" @complete="$refs.orgTree.loadTree()"></org-form>
    <org-tree-sort ref="orgTreeSort" @complete="onOrgTreeSortComplete"></org-tree-sort>
  </div>
</template>

<script>
import orgTree from '@/views/orgStructure/org/orgTree'
import orgList from './list'
import orgForm from './form'
import orgTreeSort from '@/views/orgStructure/org/treeSort'
import currentDetail from '@/views/orgStructure/org/currentDetail'
export default {
  name: 'OrgIndex',
  data () {
    return {
      currentNodeId: '0'
    }
  },
  methods: {
    onOrgTreeSortComplete () {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    },
    onTreeChange () {
      this.$refs.orgTree.loadTree()
      this.$refs.orgList.getList()
    }
  },
  computed: {
    orgTabTitle: function () {
      return this.currentNodeId === '0' ? '组织根节点' : '子部门列表'
    },
    positionTabTitle: function () {
      return this.currentNodeId === '0' ? '所有岗位' : '部门下的岗位'
    }
  },
  components: {
    orgTree,
    orgList,
    orgForm,
    orgTreeSort,
    currentDetail
  }
}
</script>

<style scoped>

</style>
