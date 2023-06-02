<template>
  <ElTable :id="`role-${props.role.name}`" width="100%" :border="true" :data="tableData">
    <ElTableColumn :label="props.role.name">
      <template #header>
        <div class="flex flex-row items-center justify-between">
          <p v-if="!editMode">{{ name }}</p>
          <div v-else class="flex-1">
            <ElFormItem inline-message :error="errorMessage">
              <ElInput v-model="name" style="width: fit-content" />
            </ElFormItem>
          </div>
          <div v-if="canUpdate">
            <ElButton v-if="!editMode" type="primary" @click="turnOnEditMode">{{ $t('common.button.edit') }}</ElButton>
            <div v-else>
              <ElButton type="primary" @click="handleSave">{{ $t('common.button.ok') }}</ElButton>
              <ElButton plain @click="handleCancel">{{ $t('common.button.cancel') }}</ElButton>
            </div>
          </div>
        </div>
      </template>
      <ElTableColumn prop="resource" :label="$t('setting.role.display.resource')">
        <template #default="scope">
          <p v-if="scope.row.resource">
            {{ $t(`setting.role.resource.${scope.row.resource}`) }}
          </p>
        </template>
      </ElTableColumn>
      <ElTableColumn v-for="action in actions" :prop="action" :label="$t(`setting.role.action.${action}`)">
        <template #default="scope">
          <ElCheckbox v-model="scope.row[action]" :disabled="!editMode" />
        </template>
      </ElTableColumn>
    </ElTableColumn>
  </ElTable>
</template>

<script setup lang="ts">
import { Action, Resource } from '@/shared/interfaces'
import { computed, ref } from 'vue'
import { RoleResponseDto } from '../constants/role.dto'
import { checkHaveAllPermissions } from '@/shared/utils'
import { useRoleStore } from '../role.store'
import { useField } from 'vee-validate'
import { string } from 'yup'
import { ElLoading } from 'element-plus'

const props = defineProps<{ role: RoleResponseDto }>()

const store = useRoleStore()

const editMode = ref(false)

const canUpdate = computed(() => checkHaveAllPermissions([`${Resource.role}#${Action.update}`]))

const {
  value: name,
  resetField,
  errorMessage,
} = useField<string>('name', string().required(), { initialValue: props.role.name })

const actions = Object.values(Action)

const tableData = ref(initTableData())

function initTableData() {
  return Object.values(Resource).map((resource) => {
    const result: Record<string, boolean | string> = {}
    result['resource'] = resource
    for (const action of actions) {
      result[action] = props.role.permissions.includes(`${resource}#${action}`)
    }
    return result
  })
}

async function handleSave() {
  const permissions: string[] = []
  tableData.value.map((item) => {
    for (const action of actions) {
      if (item[action]) {
        permissions.push(`${item.resource}#${action}`)
      }
    }
  })
  const loading = ElLoading.service({
    target: `#role-${props.role.name}`,
  })
  await store.update(props.role.id, { name: name.value, permissions })
  turnOffEditMode()
  loading.close()
}

function handleCancel() {
  tableData.value = initTableData()
  resetField({ value: props.role.name })
  turnOffEditMode()
}

function turnOnEditMode() {
  editMode.value = true
}

function turnOffEditMode() {
  editMode.value = false
}
</script>
