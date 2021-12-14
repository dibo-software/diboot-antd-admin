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
          <a-form-item label="定时任务">
            <a-select
              @change="handleJobSelectChange"
              :getPopupContainer="getPopupContainer"
              placeholder="请选择任务"
              v-decorator="[
                'jobKey',
                {
                  initialValue: model.jobKey,
                  rules: [{ required: true, message: '任务不能为空'}]
                }
              ]"
            >
              <a-select-option
                v-for="(item, index) in jobList"
                :key="index"
                :value="item.jobKey"
              >
                {{ item.jobKey + (item.jobName.length > 0 ? `（${item.jobName}）` : '') }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="任务名称">
            <a-input
              placeholder="请输入任务名称"
              v-decorator="[
                'jobName',
                {
                  initialValue: model.jobName,
                  rules: [{ required: true, message: '任务名称不能为空', whitespace: true }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item >
            <template slot="label">
              <span>定时表达式
                <a-tooltip placement="rightTop">
                  <template slot="title">
                    格式：<br>
                    * * 1 * * ?<br>
                    含义:<br>
                    秒 分 时 日 月 星期 年
                  </template>
                  <a-icon type="question-circle" style="cursor: pointer"/>
                </a-tooltip>
              </span>
            </template>
            <a-input
              placeholder="* * 1 * * ? (秒 分 时 日 月 星期 年)"
              v-decorator="[
                'cron',
                {
                  initialValue: model.cron,
                  rules: [{ required: true, message: '定时表达式不能为空'}]
                }
              ]"
            >
              <a slot="addonAfter" href="http://cron.ciding.cc/" target="_blank">
                在线编辑器
              </a>
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="初始化策略">
            <a-select
              :getPopupContainer="getPopupContainer"
              placeholder="请选择初始化策略"
              v-decorator="[
                'initStrategy',
                {
                  initialValue: model.initStrategy ? model.initStrategy : 'DO_NOTHING',
                }
              ]"
            >
              <a-select-option value="DO_NOTHING">周期执行</a-select-option>
              <a-select-option value="FIRE_AND_PROCEED">立即执行一次，并周期执行</a-select-option>
              <a-select-option value="IGNORE_MISFIRES">超期立即执行，并周期执行</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="参数">
            <a-textarea
              placeholder="请输入参数"
              v-decorator="[
                'paramJson',
                {
                  initialValue: model.paramJson,
                  rules: [{ validator: this.checkJson }]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="状态">
            <a-radio-group
              default-value="A"
              button-style="solid"
              v-decorator="[
                'jobStatus',
                {
                  initialValue: model.jobStatus ? model.jobStatus : 'A',
                }
              ]"
            >
              <a-radio-button value="A">
                启用
              </a-radio-button>
              <a-radio-button value="I">
                停用
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="记录日志">
            <a-radio-group
              :default-value="true"
              button-style="solid"
              v-decorator="[
                'saveLog',
                {
                  initialValue: model.saveLog != null ? model.saveLog : true,
                }
              ]"
            >
              <a-radio-button :value="true">
                开启
              </a-radio-button>
              <a-radio-button :value="false">
                关闭
              </a-radio-button>
            </a-radio-group>
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
      <a-button @click="close">取消</a-button>
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
      form: this.$form.createForm(this),
      jobList: [],
      jobName: {},
      jobCron: {},
      jobExample: {}
    }
  },
  methods: {
    afterOpen (id) {
      this.loadJobs()
    },
    /**
     * 检查json数据格式
     */
    checkJson (rule, value, callback) {
      if (!value) {
        callback()
      } else {
        try {
          JSON.parse(value)
          callback()
        } catch (err) {
          callback(new Error('请输入正确的JSON格式'))
        }
      }
    },
    /**
     * 加载job
     * @returns {Promise<void>}
     */
    async loadJobs () {
      const res = await this.$http.get('/scheduleJob/allJobs')
      if (res.code === 0) {
        this.jobList = res.data || []
        this.jobList.forEach(value => {
          this.jobName[value.jobKey] = value.jobName
          this.jobCron[value.jobKey] = value.jobCron
          this.jobExample[value.jobKey] = value.paramJsonExample
        })
      } else {
        this.$message.error('无可执行定时任务！')
      }
    },
    handleJobSelectChange (value) {
      this.$set(this.model, 'jobName', this.jobName[value])
      this.$set(this.model, 'cron', this.jobCron[value])
      this.$set(this.model, 'paramJson', this.jobExample[value])
    }
  }
}
</script>
<style lang="less" scoped>
</style>
