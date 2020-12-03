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
            <a
              v-if="canChange"
              v-action:create
              @click="$refs.orgForm.open(undefined)"
              href="javascript:;"
              style="margin-left: 10px;">
              <a-icon type="plus" />
            </a>
            <a
              v-if="canChange"
              v-action:update
              @click="$refs.orgForm.open(currentNodeId)"
              href="javascript:;"
              style="margin-left: 10px;">
              <a-icon type="edit" />
            </a>
            <a
              v-if="canChange"
              v-action:detail
              @click="$refs.orgDetail.open(currentNodeId)"
              href="javascript:;"
              style="margin-left: 10px;">
              <a-icon type="eye" />
            </a>
            <a
              v-if="canChange"
              v-action:delete
              @click="remove(currentNodeId)"
              href="javascript:;"
              style="margin-left: 10px;">
              <a-icon type="delete" />
            </a>
          </template>
        </a-alert>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-input-search style="margin-bottom: 8px" placeholder="组织名称" @change="onSearchChange" />
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
    <org-detail ref="orgDetail"></org-detail>
    <org-form :current-node-id="`${currentNode.id}`" ref="orgForm" @complete="loadTree()"></org-form>
  </div>
</template>

<script>
import tree from '@/components/diboot/mixins/tree'
import orgForm from './form'
import orgDetail from './detail'
import { dibootApi } from '@/utils/request'
export default {
  name: 'OrgTree',
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
    remove (id) {
      return new Promise((resolve, reject) => {
        var _this = this
        _this.$confirm({
          title: '删除',
          content: `确定删除该数据吗？`,
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk () {
            dibootApi.delete(`${_this.baseApi}/${id}`).then(async (res) => {
              if (res.code === 0) {
                _this.$notification.success({
                  message: '删除成功',
                  description: '已删除该数据',
                  duration: 3
                })
                _this.cancelSelect()
                _this.loadTree()
                resolve(res.data)
              } else {
                _this.$notification.error({
                  message: '删除失败',
                  description: res.msg,
                  duration: 3
                })
                // eslint-disable-next-line prefer-promise-reject-errors
                reject(res.msg)
              }
            }).catch(err => {
              _this.$notification.error({
                message: '删除失败',
                description: err.msg,
                duration: 3
              })
              reject(err.msg)
            })
          }
        })
      })
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
        if (children !== undefined) {
          formatterOrg.children = children
        }
        formatterOrgList.push(formatterOrg)
      })
      // 如果需要默认展开所有，则初始化展开数据
      this.expandedKeys = this.getInitSmartExpandedKeys(formatterOrgList, 5)
      return formatterOrgList
    }
  },
  components: {
    orgForm,
    orgDetail
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
