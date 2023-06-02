<template>
  <div class="flex-1 flex flex-col gap-8 px-4">
    <div class="bg-white border my-4 rounded-lg">
      <ElCollapseTransition>
        <div v-show="showFilter">
          <FilterForm />
        </div>
      </ElCollapseTransition>
      <div class="inline-flex justify-between p-4 w-full">
        <div class="w-80 inline-flex gap-2">
          <ElTooltip :content="$t(`common.button.${showFilter ? 'hideFilter' : 'showFilter'}`)">
            <ElButton
              :icon="showFilter ? IconAdjustmentsOff : IconAdjustments"
              type="info"
              @click="showFilter = !showFilter"
            />
          </ElTooltip>
          <ElInput v-model="name" :placeholder="$t('common.button.search')" @keyup.enter="store.onSearch" />
        </div>
        <div>
          <ElButton :icon="IconDownload">{{ $t('common.button.export') }}</ElButton>
          <ElButton :icon="IconUpload">{{ $t('common.button.import') }}</ElButton>
          <ElButton type="primary" :icon="IconPlus" @click="onCreate">{{ $t('common.button.add') }}</ElButton>
        </div>
      </div>
      <UserTable />
      <UserForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconDownload, IconPlus, IconUpload, IconAdjustments } from '@tabler/icons-vue'
import { computed, onMounted, ref } from 'vue'
import FilterForm from '../components/FilterForm.vue'
import UserForm from '../components/UserForm.vue'
import UserTable from '../components/UserTable.vue'
import { useUserStore } from '../user.store'
import { IconAdjustmentsOff } from '@tabler/icons-vue'

onMounted(async () => {
  await store.fetchUserList()
})

const store = useUserStore()

const showFilter = ref(false)

const form = computed(() => store.filterForm)

const name = form.value.useFieldModel('name')

function onCreate() {
  store.patchUserForm({ open: true })
}
</script>
