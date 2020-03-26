<template>
  <a-card :border="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @submit.native="onSearch">
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
          <a-col :md="5" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button
                icon="search"
                type="primary"
                htmlType="submit">查询</a-button>
              <a-button
                icon="redo"
                style="margin-left: 8px"
                @click="reset">重置</a-button>
            </span>
          </a-col>
          <a-col :lg="3" :sm="24" style="text-align: right;">
            <a-button
              v-action:create
              type="primary"
              icon="plus"
              @click="$refs.form.open(undefined)">新建</a-button>
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
        <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
        <a-divider v-action:detail v-permission="['update', 'delete']" type="vertical" />
        <a-dropdown
          v-permission="['update', 'delete']">
          <a class="ant-dropdown-link">
            更多 <a-icon type="down" />
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-action:update>
              <a @click="$refs.form.open(record.id)">编辑</a>
            </a-menu-item>
            <a-menu-item v-action:delete>
              <a href="javascript:;" @click="remove(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
        <span v-permission-missing="['detail', 'update', 'delete']">
          -
        </span>
      </span>
    </a-table>

    <diboot-form ref="form" @complete="getList"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'
export default {
  name: 'DictionaryList',
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [ list ],
  data () {
    return {
      baseApi: '/dictionary',
      customQueryParam: { parentId: 0 },
      getMore: false,
      columns: [
        {
          title: '类型名称',
          dataIndex: 'itemName'
        },
        {
          title: '类型编码',
          dataIndex: 'type'
        },
        {
          title: '备注',
          dataIndex: 'description'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  }
}
</script>

<style scoped>
</style>
