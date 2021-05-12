<template>
  <global-footer class="footer custom-render">
    <template v-slot:copyright>
      Copyright &copy; 2021 <a
        href="https://www.diboot.com/"
        target="_blank"
      >diboot.com</a>
    </template>
  </global-footer>
</template>

<script>
import { GlobalFooter } from '@ant-design-vue/pro-layout'

export default {
  name: 'ProGlobalFooter',
  components: {
    GlobalFooter
  }
}
</script>
