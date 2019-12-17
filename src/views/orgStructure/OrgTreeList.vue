<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <Tree
          showLine
          v-if="defaultExpandAll"
          @select="onTreeSelect"
          :defaultExpandAll="defaultExpandAll"
          :treeData="orgTree">
        </Tree>
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
    <diboot-form ref="form" @refreshList="getList"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { STable } from '@/components'
import { axios } from '@/utils/request'
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'

const api = {
  orgTree: '/iam/org/tree',
  orgChildrenList: '/iam/org/childrenList'
}

export default {
  name: 'OrgTreeList',
  components: {
    STable,
    Tree,
    dibootForm,
    dibootDetail
  },
  data () {
    return {
      name: '',
      defaultExpandAll: false,
      // 查询参数
      queryParam: {},
      currentNodeId: 0,
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
          dataIndex: 'type'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true
        },
        {
          table: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      orgTree: []
    }
  },
  created () {
    this.getOrgTree().then(res => {
      if (res.code === 0) {
        this.orgTree = this.orgTreeListFormatter(res.data)
        this.defaultExpandAll = true
      }
    })
  },
  mixins: [ list ],
  methods: {
    getOrgTree (parameter) {
      return axios({
        url: api.orgTree,
        method: 'get',
        params: parameter
      })
    },
    getList () {
      this.loadingData = true
      // 过滤掉不存在值的属性
      const tempQueryParam = {}
      if (Object.keys(this.queryParam).length > 0) {
        for (const key in this.queryParam) {
          if (this.queryParam[key]) {
            tempQueryParam[key] = this.queryParam[key]
          }
        }
      }
      console.log('query', tempQueryParam)
      axios({
        url: `/iam/org/childrenList/${this.currentNodeId}`,
        params: tempQueryParam,
        method: 'get'
      }).then(res => {
        this.data = res.data
        console.log('list', res)
        this.pagination.pageSize = res.page.pageSize
        this.pagination.current = res.page.pageIndex
        this.pagination.total = res.page.totalCount
        this.loadingData = false
      })
    },
    onTreeSelect (selectedKeys, info) {
      this.currentNodeId = selectedKeys[0]
      // 准备表格查询参数，进行查询
      this.getList()
    },

    /***
     * orgList格式化
     * @param orgList
     * @returns {undefined}
     */
    orgTreeListFormatter (orgList) {
      if (!orgList || orgList.length === 0) {
        return undefined
      }
      const formatterOrgList = []
      orgList.forEach(org => {
        const formatterOrg = {}
        formatterOrg.key = org.id
        formatterOrg.title = org.shortName
        const children = this.orgTreeListFormatter(org.children)
        if (children !== undefined) {
          formatterOrg.children = children
        }
        formatterOrgList.push(formatterOrg)
      })
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
