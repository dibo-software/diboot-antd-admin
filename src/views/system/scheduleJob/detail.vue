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
      <a-descriptions-item label="任务编码">
        {{ model.jobKey }}
      </a-descriptions-item>
      <a-descriptions-item label="任务名称">
        {{ model.jobName }}
      </a-descriptions-item>
      <a-descriptions-item label="定时表达式">
        {{ model.cron }}
      </a-descriptions-item>
      <a-descriptions-item label="参数">
        {{ model.paramJson }}
      </a-descriptions-item>
      <a-descriptions-item label="初始化策略">
        {{ initStrategyEnum[model.initStrategy] || '周期执行' }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        {{ model.jobStatus | toStatusLabel({A: '启用', I : '停用'}) }}
      </a-descriptions-item>
      <a-descriptions-item label="备注">
        {{ model.jobComment }}
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
      baseApi: '/scheduleJob',
      initStrategyEnum: {
        DO_NOTHING: '周期执行',
        FIRE_AND_PROCEED: '立即执行一次，并周期执行',
        IGNORE_MISFIRES: '超期立即执行，并周期执行'
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
