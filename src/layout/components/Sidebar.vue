<template>
  <div :class="`relative flex flex-col bg-slate-50 ${isCollapse ? 'w-16' : 'w-64'}`">
    <ElMenu
      :collapse="isCollapse"
      :collapse-transition="false"
      :router="true"
      :default-active="$route.path"
      class="h-full"
    >
      <template v-for="item in displayItems">
        <ElSubMenu v-if="item.children" :index="item.name">
          <template #title>
            <ElIcon :size="20">
              <component :is="item.icon" />
            </ElIcon>
            <span class="font-semibold ml-1">{{ $t(`common.module.label.${item.label}`) }} </span>
          </template>
          <ElMenuItem v-for="subItem in item.children" :index="item.to" :route="{ name: subItem.name }">
            <ElIcon :size="20">
              <component :is="subItem.icon" />
            </ElIcon>
            <template #title>
              <p class="font-semibold ml-1">
                {{ $t(`common.module.label.${subItem.label}`) }}
              </p>
            </template>
          </ElMenuItem>
        </ElSubMenu>
        <ElMenuItem v-else :index="item.to" :route="{ name: item.name }">
          <ElIcon :size="20">
            <component :is="item.icon" />
          </ElIcon>
          <template #title>
            <p class="font-semibold ml-1">
              {{ $t(`common.module.label.${item.label}`) }}
            </p>
          </template>
        </ElMenuItem>
      </template>
    </ElMenu>
    <div
      :class="`absolute bottom-4 -right-4 flex justify-center items-center cursor-pointer transition-all ${
        isCollapse ? '' : 'rotate-180'
      }`"
      @click="emit('toggle-collapse')"
    >
      <ElButton circle :icon="IconLayoutSidebarLeftExpand" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLayoutSidebarLeftExpand } from '@tabler/icons-vue'
import { navigationItems } from '@/shared/meta/navigation'
import { computed } from 'vue'
import { checkHaveAllPermissions } from '@/shared/utils'

const emit = defineEmits(['toggle-collapse'])

defineProps<{ isCollapse: boolean }>()

const displayItems = computed(() =>
  navigationItems.filter((item) => {
    if (item.requirePermissions && !checkHaveAllPermissions(item.requirePermissions)) {
      return false
    } else {
      return true
    }
  }),
)
</script>
