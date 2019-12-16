<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <Tree
          showLine
          @select="onTreeSelect"
          defaultExpandAll="true"
          :treeData="orgTree">
        </Tree>
      </a-col>
      <a-col :span="19">
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

    <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose" />
  </a-card>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { STable } from '@/components'
import OrgModal from './modules/OrgModal'
import { axios } from '@/utils/request'
import list from '@/components/diboot/mixins/list'

const api = {
  orgTree: '/iam/org/tree',
  orgChildrenList: '/iam/org/childrenList'
}

export default {
  name: 'OrgTreeList',
  components: {
    STable,
    Tree,
    OrgModal
  },
  data () {
    return {
      name: '',
      openKeys: ['key-01'],

      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'id'
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
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const queryObj = { parentNode: this.queryParam }
        return this.getOrgChildrenList(Object.assign(parameter, queryObj))
          .then(res => {
            if (res.code === 0) {
              return res.data
            }
          })
      },
      orgTree: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.getOrgTree().then(res => {
      if (res.code === 0) {
        this.orgTree = this.orgTreeListFormatter(res.data)
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
    getOrgChildrenList (parameter) {
      let key = parameter.parentNode.key
      key = key === undefined ? 1 : key
      console.log('key===>', key)
      return axios({
        url: `${api.orgChildrenList}/${key}`,
        method: 'get',
        params: parameter
      })
    },
    getList (parentNodeId) {
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
        url: `/iam/org/childrenList/${parentNodeId}`,
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
      // 准备表格查询参数，进行查询
      this.getList(selectedKeys[0])
    },
    handleClick (e) {
      console.log('handleClick', e)
      this.queryParam = {
        key: e.key
      }
      // this.$refs.table.refresh(true)
    },
    handleAdd (item) {
      console.log('add button, item', item)
      this.$message.info(`提示：你点了 ${item.key} - ${item.title} `)
      this.$refs.modal.add(item.key)
    },
    handleTitleClick (item) {
      console.log('handleTitleClick', item)
    },
    titleClick (e) {
      console.log('titleClick', e)
    },
    handleSaveOk () {

    },
    handleSaveClose () {

    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
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

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

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
