<template>
  <div class="date-range">
    <a-date-picker
      style="width: calc(50% - 15px);"
      allowClear
      v-model="value[0]"
      :format="format"
      :show-time="showTime"
      @change="onChange"
      placeholder="开始日期"
    />
    ~
    <a-date-picker
      style="width: calc(50% - 10px);"
      allowClear
      v-model="value[1]"
      :format="format"
      :show-time="showTime"
      @change="onChange"
      placeholder="结束日期"
    />
  </div>
</template>

<script>
export default {
  name: 'DateRange',
  methods: {
    onChange () {
      const { value } = this
      this.$emit('input', value)
      this.$emit('change', value)
    }
  },
  props: {
    value: {
      type: Array,
      default: () => [undefined, undefined]
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    showTime: {
      type: Boolean,
      default: false
    },
    allowClear: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style>
.date-range .ant-calendar-picker {
  min-width: unset !important;
}
</style>
