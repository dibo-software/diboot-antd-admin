<template>
  <global-footer class="footer custom-render">
    <template v-slot:links>
      <a href="https://www.diboot.com/guide/diboot-antd-admin/%E4%BB%8B%E7%BB%8D.html" target="_blank">Diboot Antd Admin</a>
      <a href="https://pro.antdv.com/" target="_blank">Ant Design Pro</a>
      <a href="https://www.antdv.com/docs/vue/introduce-cn/" target="_blank">Ant Design Vue</a>
    </template>
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
