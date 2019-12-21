<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-row>
          <a-col :span="20">
            <a-input-search style="margin-bottom: 8px" placeholder="请输入内容" @change="onSearchChange" />
          </a-col>
        </a-row>
        <a-tree
          showLine
          v-if="showTree"
          @select="onTreeSelect"
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
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
      </a-col>
      <a-col :span="19">
        <div class="table-page-search-wrapper">
          <a-row :gutter="48">
            <a-col :md="20" :sm="24">
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button icon="plus" type="primary" @click="$refs.orgPositionModal.open()">新建岗位</a-button>
              </span>
            </a-col>
          </a-row>
        </div>
        <a-card
          v-for="(item, index) in data"
          :key="index"
          :title="item.name">
          <a-button slot="extra" icon="plus" type="primary" @click="$refs.positionRoleModal.open(item.id)">新建角色</a-button>
        </a-card>
      </a-col>
    </a-row>
    <diboot-form :more="more" :currentNodeId="currentNodeId" ref="form" @refreshList="refreshPage"></diboot-form>
    <diboot-detail :more="more" ref="detail"></diboot-detail>
    <org-position-modal :currentNodeId="currentNodeId" ref="orgPositionModal"></org-position-modal>
    <position-role-modal ref="positionRoleModal"></position-role-modal>
  </a-card>
</template>

<script>
import { Tree } from 'ant-design-vue'
import treeList from '@/components/diboot/mixins/treeList'
import dibootForm from './form'
import dibootDetail from './detail'
import orgPositionModal from '@/views/orgStructure/rolePermission/orgPositionModal'
import positionRoleModal from '@/views/orgStructure/rolePermission/positionRoleModal'

const api = {
  orgTree: '/iam/org/tree',
  positionList: '/iam/position/list'
}

export default {
  name: 'OrgTreeList',
  components: {
    Tree,
    dibootForm,
    dibootDetail,
    orgPositionModal,
    positionRoleModal
  },
  data () {
    return {
      name: 'iam/org',
      apiPrefix: '/iam/org',
      initList: false,
      getMore: false,
      getTreeListApiPrefix: api.positionList,
      getTreeApi: api.orgTree,
      // 记录当前添加角色的岗位id
      currentPositionId: 0
    }
  },
  mixins: [ treeList ],
  methods: {
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
        formatterOrg.title = org.shortName
        formatterOrg.scopedSlots = { title: 'title' }
        const children = this.treeListFormatter(org.children)
        if (children !== undefined) {
          formatterOrg.children = children
        }
        formatterOrgList.push(formatterOrg)
      })
      // 如果需要默认展开所有，则初始化展开数据
      this.expandedKeys = this.getInitExpandedKeys(formatterOrgList)
      return formatterOrgList
    }
  }
}
</script>

<style scoped lang="less">
  .table-page-search-submitButtons {
    display: flex;
    justify-content: space-around;
  }
  .custom-tree {
    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
