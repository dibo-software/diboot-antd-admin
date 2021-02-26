<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="18">
          <a-col :md="8" :sm="24">
            <a-form-item label="信息模版" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-select
                v-if="more.messageTemplateKvList"
                :getPopupContainer="getPopupContainer"
                placeholder="请选择信息模版"
                v-model="queryParam.templateId"
                style="width: 100%;"
              >
                <a-select-option
                  v-for="(item, index) in more.messageTemplateKvList"
                  :key="index"
                  :value="item.v"
                >
                  {{ item.k }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="发送通道" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
              <a-select v-model="queryParam.channel" placeholder="请选择发送通道" style="width: 100%;">
                <a-select-option
                  v-for="kv in more.messageChannelKvList"
                  :key="kv.v"
                  :value="kv.v"
                >
                  {{ kv.k }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="消息状态" labelAlign="right" :labelCol="{span: 6}" :wrapperCol="{span: 18}" style="width: 100%;">
                <a-select v-model="queryParam.status" placeholder="请选择消息状态" style="width: 100%;">
                  <a-select-option
                    v-for="kv in more.messageStatusKvList"
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
         {{record.statusLabel}}
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
      getListFromMixin: true,
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
          type: 'T',
          target: 'message_template',
          key: 'title',
          value: 'id'
        },
        {
          type: 'D',
          target: 'MESSAGE_CHANNEL'
        },
        {
          type: 'D',
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
          title: '发送状态',
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
