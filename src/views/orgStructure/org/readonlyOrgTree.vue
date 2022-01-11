<template>
  <div class="orgTree">
    <a-row style="margin-bottom: 10px;">
      <a-col :span="24">
        <a-alert v-if="currentNode.title" type="info" showIcon>
          <template slot="message">
            {{ currentNode.title }}
            <a
              v-if="showCancel"
              @click="cancelSelect"
              href="javascript:;"
              style="margin-left: 10px;">取消选中</a>
          </template>
        </a-alert>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search style="margin-bottom: 8px" placeholder="组织名称" @change="onSearchChange" allowClear/>
      </a-col>
    </a-row>
    <a-tree
      v-if="treeList.length > 0"
      @select="onTreeSelect"
      @expand="onExpand"
      :expandedKeys="expandedKeys"
      :autoExpandParent="autoExpandParent"
      :selectedKeys="selectedKeys"
      :treeData="treeList">
      <template slot="title" slot-scope="{title}">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script>
import tree from '@/components/diboot/mixins/tree'
export default {
  name: 'ReadonlyOrgTree',
  data () {
    return {
      baseApi: '/iam/org',
      treeListApi: '/iam/org/tree'
    }
  },
  methods: {
    afterTreeSelect () {
      this.$emit('changeCurrentNode', this.currentNode)
    },
    /***
     * orgList格式化
     * @param orgList
     * @returns {undefined}
     */
    treeListFormatter (orgList) {
      if (!orgList || orgList.length === 0) {
        return undefined
      }
      const formatterOrgList = []
      orgList.forEach(org => {
        const formatterOrg = {}
        formatterOrg.key = org.id
        formatterOrg.value = org.id
        formatterOrg.title = org.shortName
        formatterOrg.scopedSlots = { title: 'title' }
        const children = this.treeListFormatter(org.children)
        if (children != null) {
          formatterOrg.children = children
        }
        formatterOrgList.push(formatterOrg)
      })
      // 如果需要默认展开所有，则初始化展开数据
      this.expandedKeys = this.getInitSmartExpandedKeys(formatterOrgList, 5)
      return formatterOrgList
    }
  },
  mixins: [tree],
  props: {
    showCancel: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    canChange: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  }
}
</script>

<style scoped>

</style>
