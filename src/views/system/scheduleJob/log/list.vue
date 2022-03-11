<template>
  <a-modal
    :visible="listState.visible"
    width="80%"
    :footer="null"
    @cancel="handleCancel"
  >
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
          <a-row :gutter="18">
            <a-col :md="8" :sm="24">
              <a-form-item label="任务">
                <a-input
                  v-model="queryParam.jobName"
                  allowClear
                  @keyup.enter.native="onSearch"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="执行状态">
                <a-select
                  @change="onSearch"
                  v-model="queryParam.runStatus"
                  allowClear
                  placeholder="请选择执行状态">
                  <a-select-option value="S">
                    成功
                  </a-select-option>
                  <a-select-option value="F">
                    失败
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons" >
                <a-button type="primary" @click="onSearch">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        ref="table"
        size="middle"
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :loading="loadingData"
        @change="handleTableChange"
        rowKey="id"
      >
        <span slot="action" slot-scope="text, record">
          <a v-action:detail href="javascript:;" @click="$refs.detail.open(record.id)">详情</a>
          <a-divider type="vertical" />
          <a v-action:update href="javascript:;" @click="handleExecuteOnce(record.jobId)">运行一次</a>
          <a-divider v-action:detail v-permission="['logDelete']" type="vertical" />
          <a-dropdown v-permission="['logDelete']">
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-action:logDelete>
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
      baseApi: '/scheduleJob/log',
      getListFromMixin: false,
      columns: [
        {
          title: '任务名称',
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
          dataIndex: 'runStatusLabel'
        },
        {
          title: '执行结果信息',
          dataIndex: 'executeMsg',
          ellipsis: true
        },
        {
          title: '操作',
          width: '255px',
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
      this.getList()
    },
    handleCancel () {
      this.listState.visible = false
    },
    /**
     * 执行一次任务
     * @param id
     * @returns {Promise<void>}
     */
    async handleExecuteOnce (id) {
      try {
        const res = await this.$http.put(`/scheduleJob/executeOnce/${id}`)
        if (res.code === 0) {
          this.$message.success('发送执行任务成功！')
        } else {
          this.$message.error(res.msg)
        }
      } catch (e) {
        console.log(e)
        this.$message.error('发送执行任务失败！')
      }
      this.getList()
    }
  }

}
</script>
<style lang="less" scoped>
</style>
