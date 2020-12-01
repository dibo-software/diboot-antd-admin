<template>
  <a-modal
    title="Title"
    :visible="listState.visible"
    width="70%"
    :footer="null"
  >
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
              <a-form-item label="开始时间" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-date-picker
                  format="YYYY-MM-DD"
                  v-model="queryParam.startTime"
                  style="width: 100%;"
                />
              </a-form-item>
            </a-col>
            <template v-if="advanced">
              <a-col :md="8" :sm="24">
                <a-form-item label="状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                  <a-input v-model="queryParam.jobStatus" placeholder="" style="width: 100%;"/>
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
      <a-table
        ref="table"
        size="default"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination":loading="loadingData"@change="handleTableChange"
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
            <a-menu-item v-action:delete>
              <a href="javascript:;" @click="remove(record.id)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
      </a-table>
      <diboot-detail ref="detail"></diboot-detail>
    </a-card>
  </a-modal>
</template>

<script>
import list from '@/components/diboot/mixins/list'
import dibootDetail from './detail'

export default {
  name: 'ScheduleJobLogList',
  components: {
    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/scheduleJobLog',
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
          title: '开始时间',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          dataIndex: 'endTime'
        },
        {
          title: '耗时(s)',
          dataIndex: 'elapsedSeconds'
        },
        {
          title: '状态',
          dataIndex: 'jobStatus'
        },
        {
          title: '数据计数',
          dataIndex: 'dataCount'
        },
        {
          title: '执行结果信息',
          dataIndex: 'executeMsg'
        },
        {
          title: '创建人ID',
          dataIndex: 'createBy'
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      listState: {
        visible: false
      }
    }
  },
  methods: {
    open () {
      this.listState.visible = true
    }
  }

}
</script>
<style lang="less" scoped>
</style>
