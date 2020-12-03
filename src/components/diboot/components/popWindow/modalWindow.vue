<template>
  <a-modal
    v-model="state.visible"
    :bodyStyle="{maxHeight: `${state.bodyHeight}px`, padding: 0, overflow: 'auto'}"
    centered
    :title="title"
    :width="width"
    @ok="confirm">
    <slot name="content"></slot>
  </a-modal>
</template>
<script>
export default {
  name: 'ModalWindow',
  data () {
    return {
      state: {
        visible: false,
        bodyHeight: 320
      }
    }
  },
  methods: {
    open () {
      this.state.visible = true
    },
    confirm () {
      this.$emit('confirm')
    },
    close () {
      this.state.visible = false
    }
  },
  props: {
    title: {
      type: String,
      default: '窗口'
    },
    width: {
      type: Number,
      default: 1200
    }
  },
  created () {
    this.state.bodyHeight = window.innerHeight - 110
  }
}
</script>
