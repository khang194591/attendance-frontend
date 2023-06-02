<template>
  <div v-loading="!online" :element-loading-text="'You are disconnected'" class="h-screen w-screen bg-slate-50">
    <div class="flex flex-row h-full">
      <Sidebar :is-collapse="collapse" @toggle-collapse="toggleCollapse" />
      <div class="flex flex-col flex-1 overflow-auto">
        <Topbar />
        <div class="overflow-auto flex-1 flex flex-col">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'

const online = useOnline()

const collapse = ref(false)

function toggleCollapse() {
  collapse.value = !collapse.value
}
</script>
