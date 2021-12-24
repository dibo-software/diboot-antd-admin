<template>
  <a-drawer
    :title="title"
    width="420"
    :visible="state.visible"
    @close="close"
    :body-style="{ paddingBottom: '80px' }"
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
            v-for="item in more.positionGradeOptions"
            :key="item.value"
            :value="item.value">
            {{ item.label }}
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
      <a-form-item label="数据权限" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-select
          showSearch
          :filterOption="filterOption"
          v-decorator="[
            'dataPermissionType',
            {
              initialValue: model.dataPermissionType? model.dataPermissionType : 'SELF'
            }
          ]"
          placeholder="请选择数据权限类型"
        >
          <a-select-option
            v-for="item in more.dataPermissionTypeOptions"
            :key="item.value"
            :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="虚拟岗位" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
        <a-switch
          v-decorator="[
            'isVirtual',
            {
              initialValue: model.isVirtual,
              valuePropName: 'checked'
            },
          ]"
        />
      </a-form-item>
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
  name: 'PositionForm',
  data () {
    return {
      baseApi: '/iam/position',
      attachMoreList: [
        {
          target: 'POSITION_GRADE'
        },
        {
          target: 'DATA_PERMISSION_TYPE'
        }
      ],
      form: this.$form.createForm(this)
    }
  },
  mixins: [form],
  methods: {
    afterOpen () {
    },
    onGradeValueChanged (value) {
      if (value && this.positionGradeMap && this.positionGradeMap[value]) {
        this.form.setFieldsValue({
          gradeName: this.positionGradeMap[value]['label']
        })
      }
    },
    async checkCodeDuplicate (rule, value, callback) {
      if (!value) {
        callback()
        return
      }
      const params = { id: this.model.id, code: value }
      const res = await dibootApi.get(`${this.baseApi}/checkCodeDuplicate`, params)
      if (res.code === 0) {
        callback()
      } else {
        callback(res.msg.split(':')[1])
      }
    }
  },
  computed: {
    positionGradeMap: function () {
      const positionGradeMap = {}
      if (this.more && this.more.positionGradeOptions) {
        this.more.positionGradeOptions.forEach(item => {
          positionGradeMap[item.value] = item
        })
      }
      return positionGradeMap
    }
  }
}
</script>

<style scoped>
</style>
