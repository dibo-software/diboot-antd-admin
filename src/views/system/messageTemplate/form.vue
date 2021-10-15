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
        <a-col :span="24">
          <a-form-item label="模版标题">
            <a-input
              placeholder="请输入模版标题"
              v-decorator="[
                'title',
                {
                  initialValue: model.title,
                  rules: [
                    { required: true, message: '模版标题不能为空', whitespace: true }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="模版编码">
            <a-input
              placeholder="请输入模版编码"
              v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [
                    { required: true, message: '模版编码不能为空', whitespace: true },
                    {message: '模版编码不能重复', validator: checkTempCodeDuplicate}
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-col>

        <a-col :span="24">
          <a-form-item>
            <template slot="label">
              <span>模版内容
                <a-tooltip placement="rightTop">
                  <template slot="title">
                    变量语法：${变量名称}<br>
                    例：<br>
                    你好：${用户名}，<br>
                    你的手机号是：${手机号}，<br>
                    你的邮箱是：${邮箱}！<br>
                    注：<br>
                    变量表示该值会根据场景动态变化！
                  </template>
                  <a-icon type="question-circle" style="cursor: pointer"/>
                </a-tooltip>
              </span>
              <div class="variable-container">
                <a-tag @click="handleInsertIntoContent(item)" class="variable-tag" color="blue" v-for="(item, index) in more.templateVariableList" :key="index">
                  {{ item }}
                </a-tag>
              </div>
            </template>
            <a-textarea
              placeholder="请输入模版内容"
              :rows="5"
              v-decorator="[
                'content',
                {
                  initialValue: model.content,
                  rules: [{ required: true, message: '模版内容不能为空', whitespace: true }]
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
import { dibootApi } from '@/utils/request'

export default {
  name: 'MessageTemplateForm',
  mixins: [form],
  data () {
    return {
      baseApi: '/messageTemplate',
      getMore: true,
      variableList: [],
      form: this.$form.createForm(this)
    }
  },
  methods: {
    /**
     * 改变策略，重置变量,重置内容
     * @param value
     */
    handleChangeStrategy (value) {
      for (const item of (this.more.templateStrategyList || [])) {
        if (item.value === value) {
          this.variableList = item.variableList
          break
        }
      }
    },
    /**
     * 向内容中插入变量
     * @param variable
     */
    handleInsertIntoContent (variable) {
      const position = this.getPosition(document.getElementById('content'))
      let content = this.form.getFieldValue('content')
      content = content ? `${content.slice(0, position)}${variable}${content.slice(position)}` : variable
      this.form.setFieldsValue({
        content
      })
    },

    /**
     * 检查模版code是否重复
     */
    async checkTempCodeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkTempCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    },
    afterClose () {
      this.variableList = []
    },
    /**
     * 输入框获取光标
     * @param element
     * @returns {number}
     */
    getPosition (element) {
      let cursorPos = 0
      // IE
      if (document.selection) {
        const selectRange = document.selection.createRange()
        selectRange.moveStart('character', -element.value.length)
        cursorPos = selectRange.text.length
      } else if (element.selectionStart || element.selectionStart === '0') {
        cursorPos = element.selectionStart
      }
      return cursorPos
    }
  }
}
</script>
<style lang="less" scoped>
  .variable-container {
    .variable-tag {
      cursor: pointer;
    }
  }
</style>
