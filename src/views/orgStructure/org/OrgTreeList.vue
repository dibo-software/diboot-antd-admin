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
                <a-form-item label="名称">
                  <a-input placeholder="名称" v-model="queryParam.name" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="24">
                <a-form-item label="类型">
                  <a-select
                    v-if="more.orgTypeKvList !== undefined"
                    v-model="queryParam.type"
                    placeholder="类型"
                  >
                    <a-select-option value="">
                      不限
                    </a-select-option>
                    <a-select-option
                      v-for="(type, index) in more.orgTypeKvList"
                      :key="index"
                      :value="type.v"
                    >
                      {{ type.k }}
                    </a-select-option>
                  </a-select>
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
      getMore: true,
      getTreeListApiPrefix: api.orgChildrenList,
      getTreeApi: api.orgTree,
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
