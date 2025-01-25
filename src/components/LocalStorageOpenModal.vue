<script setup lang="ts">
import type { IFileSystemFileHandle } from '@/lib/fs';
import type { LocalStorageFileHandle, LocalStorageFs } from '@/lib/local-storage-fs';
import { onMounted, ref } from 'vue'
import Modal from './Modal.vue'

const emit = defineEmits<{
    (e: 'close'): void,
    (e: 'fileSelected', handle: IFileSystemFileHandle): void
}>()

const props = defineProps<{
    fs: LocalStorageFs
}>()

const files = ref<LocalStorageFileHandle[]>([])

onMounted(() => {
    files.value = props.fs.listFiles();
})

</script>

<template>
    <Modal v-on:close="emit('close')">
        <div class="file-list">
            <div class="file-item" v-for="file in files" @click="emit('fileSelected', file)">{{ file.name }}</div>
        </div>
    </Modal>
</template>

<style scoped>
.file-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
    overflow-y: auto;

}

.file-item {
    cursor: pointer;
    border: 1px solid #888;
    border-radius: 6px;
    padding: 2px 6px;
}

.file-item:hover {
    background-color: #f0f0f0;
}
</style>