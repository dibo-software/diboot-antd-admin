<template>
  <a-card :bordered="false">
<div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
                <a-col :md="8" :sm="24">
            <a-form-item label="job名称" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.jobName" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-input v-model="queryParam.jobStatus" placeholder="" style="width: 100%;"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons" >
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button v-action:create type="primary" icon="plus" @click="$refs.form.open()">新建</a-button>
    </div>

<a-table
      ref="table"
      size="default"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :scroll="{ x: 'calc(700px + 50%)', y: 240 }"
      :loading="loadingData"@change="handleTableChange"
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
  </a-card>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootForm from './form'
import dibootDetail from './detail'

export default {
  name: 'ScheduleJobList',
  components: {
    dibootForm,
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/scheduleJob',
      getListFromMixin: true,
      columns: [
        {
          title: 'job名称',
          dataIndex: 'jobName'
        },
        {
          title: '定时表达式',
          dataIndex: 'cron'
        },
        {
          title: '参数',
          dataIndex: 'paramJson'
        },
        {
          title: '失败策略',
          dataIndex: 'failStrategy'
        },
        {
          title: '重试次数',
          dataIndex: 'retryTimes'
        },
        {
          title: '间隔秒数',
          dataIndex: 'intervalSecond'
        },
        {
          title: '状态',
          dataIndex: 'jobStatus'
        },
        {
          title: '备注',
          dataIndex: 'jobComment'
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
      ]
    }
  }

}
</script>
<style lang="less" scoped>
</style>
