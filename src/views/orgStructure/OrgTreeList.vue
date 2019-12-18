<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <Tree
          showLine
          v-if="defaultExpandAll"
          @select="onTreeSelect"
          :defaultExpandAll="defaultExpandAll"
          :treeData="treeList">
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
      // 查询参数
      queryParam: {},
      currentNodeId: 0,
      getMore: true,
      getTreeListApiPrefix: '/iam/org/childrenList',
      getTreeApi: api.orgTree,
      apiPrefix: '/iam/org',
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
        const children = this.treeListFormatter(org.children)
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
