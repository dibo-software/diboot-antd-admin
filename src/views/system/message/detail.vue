<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-descriptions :column="1">
      <a-descriptions-item label="业务类型">
        {{ model.businessType }}
      </a-descriptions-item>
      <a-descriptions-item label="业务标识">
        {{ model.businessCode }}
      </a-descriptions-item>
      <a-descriptions-item label="发送方">
        {{ model.sender }}
      </a-descriptions-item>
      <a-descriptions-item label="接收方">
        {{ model.receiver }}
      </a-descriptions-item>
      <a-descriptions-item label="标题">
        {{ model.title }}
      </a-descriptions-item>
      <a-descriptions-item label="内容">
        {{ model.content }}
      </a-descriptions-item>
      <a-descriptions-item label="发送通道">
        {{ model.channelLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="发送结果">
        {{ model.result }}
      </a-descriptions-item>
      <a-descriptions-item label="发送状态">
        {{ model.statusLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="定时发送时间" v-if="model.scheduleTime">
        {{ model.scheduleTime }}
      </a-descriptions-item>
      <a-descriptions-item label="扩展数据">
        {{ model.extData }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ model.updateTime }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="drawer-footer">
      <a-button @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'MessageDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/message'
    }
  },
  methods: {
    onAfterOpen () {
      // 事件处理代码
    },
    afterOpen () {
      this.onAfterOpen()
    }
  }
}
</script>
<style lang="less" scoped>
</style>
