<template>
  <a-drawer
    class="detail-wrapper"
    :title="title"
    :width="720"
    @close="close"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-descriptions :column="2">
      <a-descriptions-item label="job编码">
        {{ model.jobKey }}
      </a-descriptions-item>
      <a-descriptions-item label="job名称">
        {{ model.jobName }}
      </a-descriptions-item>
      <a-descriptions-item label="定时表达式">
        {{ model.cron }}
      </a-descriptions-item>
      <a-descriptions-item label="参数">
        {{ model.paramJson }}
      </a-descriptions-item>
      <a-descriptions-item label="失败策略">
        {{ model.failStrategy }}
      </a-descriptions-item>
      <a-descriptions-item label="间隔秒数">
        {{ model.intervalSecond }}
      </a-descriptions-item>
      <a-descriptions-item label="重试次数">
        {{ model.retryTimes }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ model.jobStatus }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.jobComment }}
      </a-descriptions-item>
      <a-descriptions-item label="创建人ID">
        {{ model.createBy }}
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        {{ model.updateTime }}
      </a-descriptions-item>
    </a-descriptions>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">关闭</a-button>
    </div>
  </a-drawer>
</template>

<script>
import detail from '@/components/diboot/mixins/detail'

export default {
  name: 'ScheduleJobDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/scheduleJob'
    }
  },
  methods: {
    onAfterOpen() {
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
