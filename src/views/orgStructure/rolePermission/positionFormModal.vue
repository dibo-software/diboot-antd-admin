<template>
  <a-modal
    title="新建岗位"
    :visible="state.visible"
    @ok="onSubmit()"
    :confirmLoading="state.submitBtn"
    @cancel="close"
  >
    <a-form :form="form">
      <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-input
          placeholder="请输入名称"
          v-decorator="[
                'name',
                {
                  initialValue: model.name,
                  rules: [{ required: true, message: '名称不能为空', whitespace: true }]
                }
              ]"
        />
      </a-form-item>
      <a-form-item label="编码" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-input
          placeholder="请输入编码"
          v-decorator="[
                'code',
                {
                  initialValue: model.code,
                  rules: [
                    { required: true, message: '编码不能为空', whitespace: true },
                    { validator: this.checkCodeDuplicate }
                    ]
                }
              ]"
        />
      </a-form-item>
      <a-form-item label="职级" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-select
          showSearch
          @change="onGradeValueChanged"
          :filterOption="filterOption"
          v-decorator="[
              'gradeValue',
              {
                initialValue: model.gradeValue
              }
            ]"
          placeholder="请选择职级"
        >
          <a-select-option
            v-for="kv in reloadMore.positionGradeKvList"
            :key="kv.v"
            :value="kv.v">
            {{ kv.v }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="职级头衔" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-input
          placeholder="请输入职级头衔"
          v-decorator="[
                'gradeName',
                {
                  initialValue: model.gradeName
                }
              ]"
        />
      </a-form-item>
      <a-form-item label="虚拟岗位" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-switch
          v-decorator="[
              'virtual',
              {
                initialValue: model.virtual
              },
            ]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import form from '@/components/diboot/mixins/form'
import { dibootApi } from '@/utils/request'
export default {
  name: 'PositionFormModal',
  data () {
    return {
      name: 'iam/position',
      getMore: true,
      form: this.$form.createForm(this)
    }
  },
  mixins: [form],
  methods: {
    onGradeValueChanged (value) {
      if (value && this.reloadMore && this.reloadMore.positionGradeKvMap && this.reloadMore.positionGradeKvMap[value]) {
        this.form.setFieldsValue({
          gradeName: this.reloadMore.positionGradeKvMap[value]['k']
        })
      }
    },
    async checkCodeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`/${this.name}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    }
  }
}
</script>

<style scoped>
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid #e9e9e9;
    padding: 10px 16px;
    background: #fff;
    text-align: right
  }
</style>
