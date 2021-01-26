<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="公司名" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.name" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="税号" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.taxid" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="电话" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-input v-model="queryParam.telphone" placeholder="" style="width: 100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="客户状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select v-model="queryParam.cusStatus" placeholder="请选择客户状态" style="width: 100%;">
                  <a-select-option
                    v-for="kv in more.cusStatusKvList"
                    :key="kv.v"
                    :value="kv.v"
                  >
                    {{ kv.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-range-picker
                  format="YYYY-MM-DD"
                  v-model="dateRangeQuery.createTime"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button v-action:create type="primary" icon="plus" @click="$refs.form.open()">新建</a-button>
      <a-button v-action:delete type="danger" icon="delete" @click="batchRemove">批量删除</a-button>
      <a-button v-action:import type="default" icon="cloud-upload" @click="$refs.import.open()">导入</a-button>
      <a-button v-action:export type="default" icon="cloud-download" @click="exportData">导出</a-button>
    </div>

    <a-table
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
      :loading="loadingData"
      :rowSelection="rowSelection"
      @change="handleTableChange"
      rowKey="id"
    >
      <span slot="action" slot-scope="text, record">
        <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
        <a-divider v-action:detail v-permission="['update', 'delete']" type="vertical" />
        <a-dropdown v-permission="['update', 'delete']">
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
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
      </span>
    </a-table>
    <diboot-form ref="form" @complete="getList"></diboot-form>
    <diboot-detail ref="detail"></diboot-detail>
    <diboot-import ref="import" @complete="getList"></diboot-import>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'
import dibootImport from './excelImport'

export default {
  name: 'CustomerList',
  components: {
    dibootForm,
    dibootDetail,
    dibootImport
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/customer',
      getListFromMixin: true,
      attachMoreList: [
        {
          type: 'D',
          target: 'CUS_STATUS'
        }
      ],
      columns: [
        {
          title: '公司名',
          dataIndex: 'name'
        },
        {
          title: '简称',
          dataIndex: 'shortName'
        },
        {
          title: '税号',
          dataIndex: 'taxid'
        },
        {
          title: '客户状态',
          dataIndex: 'cusStatusLabel'
        },
        {
          title: '电话',
          dataIndex: 'telphone'
        },
        {
          title: '地址',
          dataIndex: 'address'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          width: '150px',
          fixed: 'right',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: []
    }
  },
  methods: {

    onRowSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    }
  },
  computed: {
    /**
     * 控制是否显示行的checkbox
     * @returns {*}
     */
    rowSelection () {
      return { selectedRowKeys: this.selectedRowKeys, onChange: this.onRowSelectChange }
    }
  }

}
</script>
<style lang="less" scoped>
</style>
