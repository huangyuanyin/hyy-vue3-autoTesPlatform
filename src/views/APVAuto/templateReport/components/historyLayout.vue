<template>
  <!-- <router-view></router-view> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.fullPath" v-if="shouldCache && $route.meta.keepAlive" keepAlive />
    </keep-alive>
    <component :is="Component" :key="$route.fullPath" v-if="!keepAlive && !$route.meta.keepAlive" />
  </router-view>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    keepAlive: {
      type: Boolean,
      default: false
    },
    rootKey: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    shouldCache() {
      return this.$route.matched[2].path === this.rootKey
    }
  }
})
</script>
