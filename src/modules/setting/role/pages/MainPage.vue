<template>
  <div class="flex-1 flex flex-col gap-8 bg-white px-4">
    <h2 class="text-2xl font-semibold pt-6">{{ $t('setting.role.pageTitle') }}</h2>
    <RoleTable v-for="role in roleList" :role="role" :key="role.id" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import RoleTable from '../components/RoleTable.vue'
import { RoleResponseDto } from '../constants/role.dto'
import { useRoleStore } from '../role.store'

onMounted(async () => await store.fetchRoleList())

const store = useRoleStore()

const roleList = computed<RoleResponseDto[]>(() => store.roleList.items)
</script>
