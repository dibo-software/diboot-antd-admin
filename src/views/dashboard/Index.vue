<template>
  <div class="dashboard">
    <h2>欢迎您，{{ nickname() }}！</h2>
    <attention-items></attention-items>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AttentionItems from './AttentionItems'

export default {
  name: 'Dashboard',
  components: { AttentionItems },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
    ...mapGetters(['nickname'])
  }
}
</script>

<style scoped>
  .dashboard {
    min-height: 360px;
    background: #fff;
  }
  .dashboard h2 {
    line-height: 48px;
    padding-left: 24px;
  }
</style>
