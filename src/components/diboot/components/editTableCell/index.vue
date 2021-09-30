<template>
  <div class="editable-cell">
    <div v-if="editable" class="editable-cell-input-wrapper">
      <template v-if="formType === 'INPUT'">
        <a-input v-model="tempValue" @change="(e) => changeValue(e.target.value)"/>
      </template>
      <template v-if="formType === 'INPUT_NUMBER'">
        <a-input-number
          v-model="tempValue"
          controls-position="right"
          @change="changeValue"
        />
      </template>
      <template v-else-if="formType === 'TEXTAREA'">
        <a-textarea
          @change="(e) => changeValue(e.target.value)"
          type="textarea"
          v-model="tempValue"
        />
      </template>
      <template v-else-if="formType === 'S_SELECT'">
        <a-select
          filterable
          @change="changeValue"
          v-model="tempValue"
        >
          <a-select-option
            v-for="(item, index) in dataKvList || []"
            :key="index"
            :value="item.v"
          >
            {{ item.k }}
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
          valueFormat="YYYY-MM-DD"/>
      </template>
      <template v-else-if="formType === 'DATETIMEPICKER'">
        <a-date-picker
          v-model="tempValue"
          @change="changeValue"
          :showTime="{ format: 'HH:mm:ss' }"
          valueFormat="YYYY-MM-DD HH:mm:ss"/>
      </template>
    </div>
    <div v-else :class="{'text-ellipsis': ellipsis, 'editable-cell-text-wrapper': true}">
      <template v-if="label">
        {{ label }}
      </template>
      <template v-else>
        {{ (isBoolean ? (tempValue ? '是' : '否') : tempValue) || '-' }}
      </template>
    </div>
  </div>
</template>

<script>
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
      type: String | Boolean | Number,
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
    dataKvList: {
      type: Array,
      default: () => []
    },
    // 选择类型的数据集
    ellipsis: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tempValue: this.value
    }
  },
  methods: {
    changeValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style scoped>
.editable-cell {
  position: relative;
}
editable-cell-text-wrapper {
  padding-right: 24px;
}
.editable-cell-input-wrapper {
 display: flex;
}
.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}
</style>
