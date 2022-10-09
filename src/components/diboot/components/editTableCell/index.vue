<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <template v-if="formType === 'INPUT'">
        <a-input
          v-model="tempValue"
          :placeholder="placeholder"
          @change="(e) => changeValue(e.target.value)"/>
      </template>
      <template v-if="formType === 'INPUT_NUMBER'">
        <a-input-number
          v-model="tempValue"
          controls-position="right"
          @change="changeValue"
          :placeholder="placeholder"
        />
      </template>
      <template v-else-if="formType === 'TEXTAREA'">
        <a-textarea
          @change="(e) => changeValue(e.target.value)"
          type="textarea"
          v-model="tempValue"
          :placeholder="placeholder"
        />
      </template>
      <template v-else-if="formType === 'S_SELECT'">
        <a-select
          filterable
          @change="changeValue"
          v-model="tempValue"
          :placeholder="placeholder"
        >
          <a-select-option
            v-for="(item, index) in options || []"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </template>
      <template v-else-if="formType === 'M_SELECT'">
        <a-select
          mode="multiple"
          filterable
          @change="changeValue"
          v-model="tempValue"
          :placeholder="placeholder"
        >
          <a-select-option
            v-for="(item, index) in options || []"
            :key="index"
            :value="item.value"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </template>
      <template v-else-if="formType === 'SWITCH'">
        <a-switch @change="changeValue" v-model="tempValue"/>
      </template>
      <template v-else-if="formType === 'DATEPICKER'">
        <a-date-picker
          v-model="tempValue"
          @change="changeValue"
          :placeholder="placeholder"
          valueFormat="YYYY-MM-DD"/>
      </template>
      <template v-else-if="formType === 'DATETIMEPICKER'">
        <a-date-picker
          v-model="tempValue"
          @change="changeValue"
          :placeholder="placeholder"
          :showTime="{ format: 'HH:mm:ss' }"
          valueFormat="YYYY-MM-DD HH:mm:ss"/>
      </template>
      <template v-else-if="formType === 'TREE'">
        <a-tree-select
          v-if="treeData.length > 0"
          :placeholder="placeholder"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="treeData"
          treeNodeFilterProp="name"
          showSearch
          treeDefaultExpandAll
          @change="changeValue"
          v-model="tempValue"
        >
        </a-tree-select>
      </template>
    </div>
    <div v-else :class="{'text-ellipsis': ellipsis, 'editable-cell-text-wrapper': true}">
      <template v-if="label">
        {{ label }}
      </template>
      <template v-else-if="!label && formType === 'TREE'">
        -
      </template>
      <template v-else>
        {{ (isBoolean ? (tempValue ? '是' : '否') : tempValue) || '-' }}
      </template>
    </div>
  </div>
</template>

<script>
import { dibootApi } from '@/utils/request'
import { treeListFormatter } from '@/utils/treeDataUtil'

export default {
  name: 'EditTableCell',
  // 文本值， 表单类型， 选择类型的数据集
  props: {
    editable: {
      type: Boolean,
      default: false
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Boolean | Number | Array,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    // 表单类型: 支持INPUT、INPUT_NUMBER、TEXTAREA、S_SELECT、SWITCH、DATEPICKER、DATETIMEPICKER
    formType: {
      type: String,
      required: true
    },
    // 是否是布尔
    isBoolean: {
      type: Boolean,
      default: false
    },
    // 选择类型的数据集
    options: {
      type: Array,
      default: () => []
    },
    // 选择类型的数据集
    ellipsis: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    // 基础请求路径
    baseUrl: {
      type: String,
      default: ''
    },
    // 完整请求路径
    fullUrl: {
      type: String,
      default: ''
    },
    // 树的value字段
    treeValueField: {
      type: String,
      default: 'id'
    },
    // 树的显示字段
    treeTitleField: {
      type: String,
      default: 'label'
    }
  },
  data () {
    return {
      tempValue: this.value || undefined,
      treeData: []
    }
  },
  watch: {
    editable (val) {
      val && this.reloadData()
    }
  },
  methods: {
    changeValue (val) {
      this.$emit('input', val)
    },
    /**
     * 重新加载数据
     */
    async reloadData () {
      if (this.formType === 'TREE') {
        const res = await dibootApi.get(this.fullUrl ? this.fullUrl : `${this.baseUrl}/list`)
        if (res.code === 0) {
          const data = res.data || []
          if (data.length > 0) {
            this.treeData = treeListFormatter(data, this.treeValueField, this.treeTitleField, true)
          }
          this.treeData.splice(0, 0, {
            key: '0',
            value: '0',
            title: '-- 无 --'
          })
        }
      }
    }
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}
.editable-cell-input-wrapper {
 display: flex;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
</style>
