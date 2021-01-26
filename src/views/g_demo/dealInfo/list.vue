<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="销售线索" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-select
                v-if="more.salesLeadKvList"
                :getPopupContainer="getPopupContainer"
                placeholder="请选择销售线索"
                v-model="queryParam.salesLeadId"
                style="width: 100%;"
              >
                <a-select-option
                  v-for="(item, index) in more.salesLeadKvList"
                  :key="index"
                  :value="item.v"
                >
                  {{ item.k }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="客户" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-select
                v-if="more.customerKvList"
                :getPopupContainer="getPopupContainer"
                placeholder="请选择客户"
                v-model="queryParam.customerId"
                style="width: 100%;"
              >
                <a-select-option
                  v-for="(item, index) in more.customerKvList"
                  :key="index"
                  :value="item.v"
                >
                  {{ item.k }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="销售员" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select
                  v-if="more.iamUserKvList"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择销售员"
                  v-model="queryParam.salesId"
                  style="width: 100%;"
                >
                  <a-select-option
                    v-for="(item, index) in more.iamUserKvList"
                    :key="index"
                    :value="item.v"
                  >
                    {{ item.k }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="标题" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-input v-model="queryParam.title" placeholder="" style="width: 100%;"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-date-picker
                  format="YYYY-MM-DD"
                  v-model="queryParam.createTime"
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
      <a-button v-action:export type="default" icon="cloud-download" @click="exportData">导出</a-button>
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
      </span>
    </a-table>
    <diboot-detail ref="detail"></diboot-detail>
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'

import dibootDetail from './detail'

export default {
  name: 'DealInfoList',
  components: {

    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/dealInfo',
      getListFromMixin: true,
      attachMoreList: [
        {
          type: 'T',
          target: 'iam_user',
          key: 'realname',
          value: 'id'
        },
        {
          type: 'T',
          target: 'customer',
          key: 'short_name',
          value: 'id'
        },
        {
          type: 'T',
          target: 'sales_lead',
          key: 'title',
          value: 'id'
        }
      ],
      columns: [
        {
          title: '销售线索',
          dataIndex: 'salesLeadTitle'
        },
        {
          title: '客户',
          dataIndex: 'customerName'
        },
        {
          title: '销售员',
          dataIndex: 'salesName'
        },
        {
          title: '标题',
          dataIndex: 'title'
        },
        {
          title: '提醒信息',
          dataIndex: 'reminder'
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
<style lang="less" scoped>
</style>
