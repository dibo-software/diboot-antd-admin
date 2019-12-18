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
          <a-form layout="inline" @submit.native="getList">
            <a-row :gutter="48">
              <a-col :md="8" :sm="24">
                <a-form-item label="类型名称">
                  <a-input placeholder="名称" v-model="queryParam.itemName" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="类型编码">
                  <a-input placeholder="编码" v-model="queryParam.type" />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <span class="table-page-search-submitButtons">
                  <a-button type="primary" htmlType="submit">查询</a-button>
                  <a-button @click="reset">重置</a-button>
                  <a-button icon="plus" type="primary" @click="$refs.form.open(undefined)">新建</a-button>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>

        <a-table
          ref="table"
          size="default"
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          :loading="loadingData"
          @change="handleTableChange"
          rowKey="id"
        >
          <span slot="type" slot-scope="text">
            <template v-if="text && more.orgTypeKvMap && more.orgTypeKvMap[text]">
              <a-tag :color="text==='COMP' ? 'blue' : 'cyan'" >{{ more.orgTypeKvMap[text]['k'] }}</a-tag>
            </template>
            <template v-else>
              <span>-</span>
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="$refs.form.open(record.id)">编辑</a>
            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link">
                更多 <a-icon type="down" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item>
                  <a href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
                </a-menu-item>
                <a-menu-item>
                  <a href="javascript:;" @click="remove(record.id)">删除</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </span>
        </a-table>
      </a-col>
    </a-row>
    <diboot-form :more="more" :currentNodeId="currentNodeId" ref="form" @refreshList="refreshPage"></diboot-form>
    <diboot-detail :more="more" ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import { Tree } from 'ant-design-vue'
import treeList from '@/components/diboot/mixins/treeList'
import dibootForm from './form'
import dibootDetail from './detail'

const api = {
  orgTree: '/iam/org/tree',
  orgChildrenList: '/iam/org/childrenList'
}

export default {
  name: 'OrgTreeList',
  components: {
    Tree,
    dibootForm,
    dibootDetail
  },
  data () {
    return {
      name: 'iam/org',
      apiPrefix: '/iam/org',
      queryParam: {},
      currentNodeId: 0,
      getMore: true,
      getTreeListApiPrefix: '/iam/org/childrenList',
      getTreeApi: api.orgTree,
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
        },
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '全称',
          dataIndex: 'name'
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  mixins: [ treeList ],
  methods: {
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
    },
    onSearchChange (e) {
      const value = e.target.value
      const expandedKeys = this.getExpandedKeys(this.treeList, value)
      if (expandedKeys.length > 0) {
        Object.assign(this, {
          expandedKeys,
          searchValue: value,
          autoExpandParent: true
        })
      }
    },
    getExpandedKeys (list, value) {
      const allExpandedKeys = []
      const expandedKeys = list
        .map(item => {
          // 对children进行查找
          if (item.children && item.children.length > 0) {
            const childrenExpandedKeys = this.getExpandedKeys(item.children, value)
            if (childrenExpandedKeys.length > 0) {
              allExpandedKeys.push(...childrenExpandedKeys)
            }
          }
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeList)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      if (expandedKeys.length > 0) {
        allExpandedKeys.push(...expandedKeys)
      }

      return allExpandedKeys
    },
    getParentKey (key, tree) {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (this.getParentKey(key, node.children)) {
            parentKey = this.getParentKey(key, node.children)
          }
        }
      }
      return parentKey
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
    },
    getInitExpandedKeys (list) {
      const keys = []
      list.forEach(item => {
        if (item.children && item.children.length > 0) {
          keys.push(item.key)
          keys.push(...this.getInitExpandedKeys(item.children))
        }
      })
      return keys
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
