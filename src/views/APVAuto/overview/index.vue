<template>
  <div class="overview-wrap" style="height: 100%">
    <VersionDetails class="VersionDetails" />
  </div>
</template>

<script lang="ts" setup>
import { defineComponent, onMounted, inject, ref, nextTick, defineProps } from 'vue'
import VersionDetails from './component/VersionDetails.vue'
const props = defineProps({
  keepAlive: {
    type: Boolean,
    default: false
  },
  rootKey: {
    type: Boolean,
    default: false
  }
})
onMounted(() => {})
</script>

<style lang="scss" scoped></style>
