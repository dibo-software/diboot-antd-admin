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
      <a-descriptions-item label="任务名称">
        {{ model.jobName }}
      </a-descriptions-item>
      <a-descriptions-item label="定时表达式">
        {{ model.cron }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ model.runStatusLabel }}
      </a-descriptions-item>
      <a-descriptions-item label="开始时间">
        {{ model.startTime }}
      </a-descriptions-item>
      <a-descriptions-item label="结束时间">
        {{ model.endTime }}
      </a-descriptions-item>
      <a-descriptions-item label="耗时(s)">
        {{ model.elapsedSeconds }}
      </a-descriptions-item>
      <a-descriptions-item label="执行结果信息">
        <p style="max-width: 300px"> {{ model.executeMsg }} </p>
      </a-descriptions-item>
      <a-descriptions-item label="创建时间">
        {{ model.createTime }}
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
  name: 'ScheduleJobLogDetail',
  mixins: [detail],
  data () {
    return {
      baseApi: '/scheduleJob/log'
    }
  }
}
</script>
