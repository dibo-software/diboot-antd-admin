<template>
  <div>
    <tinymce :value="value" @input="val => $emit('change', val)"></tinymce>
  </div>
</template>
<script>
  import tinymce from '@/components/Editor/Tinymce/index'
  export default {
    name: 'RichEditor',
    components: {
      tinymce
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    }
  }
</script>
