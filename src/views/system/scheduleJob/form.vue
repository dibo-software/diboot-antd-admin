<template>
  <a-drawer
    :title="title"
    :width="720"
    @close="close"
    :visible="state.visible"
    :body-style="{ paddingBottom: '80px' }"
  >
    <a-form layout="vertical" :form="form">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="选择定时任务">
            <a-input
              placeholder="请输入job名称"
              v-decorator="[
                'jobName',
                {
                  initialValue: model.jobName,
                  rules: [{ required: true, message: 'job名称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="定时表达式">
            <a-input
              placeholder="* * 1 * * ? (秒 分 时 日 月 星期 年)"
              v-decorator="[
                'cron',
                {
                  initialValue: model.cron
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="参数">
            <a-textarea
              placeholder="请输入参数"
              v-decorator="[
                'paramJson',
                {
                  initialValue: model.paramJson
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="失败策略">
            <a-input
              placeholder="请输入失败策略"
              v-decorator="[
                'failStrategy',
                {
                  initialValue: model.failStrategy
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="间隔秒数">
            <a-input
              placeholder="请输入间隔秒数"
              v-decorator="[
                'intervalSecond',
                {
                  initialValue: model.intervalSecond
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="重试次数">
            <a-input
              placeholder="请输入重试次数"
              v-decorator="[
                'retryTimes',
                {
                  initialValue: model.retryTimes
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-input
              placeholder="请输入间隔秒数"
              v-decorator="[
                'intervalSecond',
                {
                  initialValue: model.intervalSecond
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="备注">
            <a-textarea
              placeholder="请输入备注"
              v-decorator="[
                'jobComment',
                {
                  initialValue: model.jobComment,
                  rules: [{ message: '备注不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div class="drawer-footer">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="onSubmit" type="primary" :loading="state.confirmSubmit" :disabled="state.confirmSubmit">确定</a-button>
    </div>
  </a-drawer>
</template>

<script>
import form from '@/components/diboot/mixins/form'

export default {
  name: 'ScheduleJobForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/scheduleJob',
      form: this.$form.createForm(this)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
