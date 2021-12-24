<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" :labelCol="{span: 6}" :wrapperCol="{span: 18}">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="信息模版">
              <a-select
                @change="onSearch"
                :getPopupContainer="getPopupContainer"
                allowClear
                placeholder="请选择信息模版"
                v-model="queryParam.templateId"
              >
                <a-select-option
                  v-for="(item, index) in more.messageTemplateOptions"
                  :key="index"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="发送通道">
              <a-select
                @change="onSearch"
                v-model="queryParam.channel"
                allowClear
                placeholder="请选择发送通道">
                <a-select-option
                  v-for="item in more.messageChannelOptions"
                  :key="item.value"
                  :value="item.value"
                >
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="消息状态">
                <a-select
                  @change="onSearch"
                  v-model="queryParam.status"
                  allowClear
                  placeholder="请选择消息状态">
                  <a-select-option
                    v-for="item in more.messageStatusOptions"
                    :key="item.value"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
                <a-date-picker
                  @change="onSearch"
                  allowClear
                  format="YYYY-MM-DD"
                  v-model="queryParam.createTime"
                />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="!advanced && 8 || 24" :sm="24">
            <span class="table-page-search-submitButtons" :style="advanced && { float: 'right', overflow: 'hidden' } || {} ">
              <a-button type="primary" @click="onSearch">查询</a-button>
              <a-button @click="reset">重置</a-button>
              <a @click="toggleAdvanced">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
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
      <tempalte slot="statusLabel" slot-scope="text, record">
        <a-tag :color="messageStatusColor[record.status]">
          {{ record.statusLabel }}
        </a-tag>
      </tempalte>
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
  name: 'MessageList',
  components: {

    dibootDetail
  },
  mixins: [list],
  data () {
    return {
      baseApi: '/message',
      // 消息状态颜色
      messageStatusColor: {
        SENDING: 'blue',
        EXCEPTION: 'red',
        DELIVERY: 'green',
        UNREAD: 'orange',
        READ: 'cyan'
      },
      attachMoreList: [
        {
          target: 'messageTemplate',
          label: 'title',
          value: 'id'
        },
        {
          target: 'MESSAGE_CHANNEL'
        },
        {
          target: 'MESSAGE_STATUS'
        }
      ],
      columns: [
        {
          title: '业务类型',
          dataIndex: 'businessType'
        },
        {
          title: '发送方',
          dataIndex: 'sender'
        },
        {
          title: '接收方',
          dataIndex: 'receiver'
        },
        {
          title: '消息状态',
          dataIndex: 'statusLabel',
          scopedSlots: { customRender: 'statusLabel' }
        },
        {
          title: '发送通道',
          dataIndex: 'channelLabel'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
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
      ]
    }
  }

}
</script>
<style lang="less" scoped>
</style>
