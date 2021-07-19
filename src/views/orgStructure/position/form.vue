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
            v-for="kv in more.positionGradeKvList"
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
            v-for="kv in more.dataPermissionTypeKvList"
            :key="kv.v"
            :value="kv.v">
            {{ kv.k }}
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
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
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
          type: 'D',
          target: 'POSITION_GRADE'
        },
        {
          type: 'D',
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
      if (value && this.positionGradeKvMap && this.positionGradeKvMap[value]) {
        this.form.setFieldsValue({
          gradeName: this.positionGradeKvMap[value]['k']
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
    positionGradeKvMap: function () {
      const positionGradeKvMap = {}
      if (this.more && this.more.positionGradeKvList) {
        this.more.positionGradeKvList.forEach(item => {
          positionGradeKvMap[item.v] = item
        })
      }
      return positionGradeKvMap
    }
  }
}
</script>

<style scoped>
</style>
