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
    fs: LocalStorageFs,
    suggestedFileName?: string
}>()

const files = ref<LocalStorageFileHandle[]>([])
const fileName = ref(props.suggestedFileName || 'Untitled.txt')

onMounted(() => {
    files.value = props.fs.listFiles();
})

async function fileAlreadyExists(fileHandle: IFileSystemFileHandle) {
    for (const f of files.value) {
        const same = await f.isSameEntry(fileHandle);
        if (same) {
            return true;
        }
    }

    return false;
}

const handleSaveClick = async (fileHandle: IFileSystemFileHandle) => {
    if (await fileAlreadyExists(fileHandle) && !confirm(`File ${fileHandle.name} already exists. Overwrite?`)) {
        return;
    }

    emit('fileSelected', fileHandle);
}

</script>

<template>
    <Modal v-on:close="emit('close')">
        <div class="input-container">
            <input type="text" v-model="fileName" />
            <button @click="emit('close')">Cancel</button>
            <button :disabled="fileName.length === 0" @click="handleSaveClick(fs.getHandle(fileName))">Save</button>
        </div>
        <div class="file-list">
            <div class="file-item" v-for="file in files" @click="handleSaveClick(file)">{{ file.name }}</div>
        </div>
    </Modal>
</template>

<style scoped>
.input-container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.input-container input {
    flex: 1;
}

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

button {
    padding: 0;
    padding-left: 8px;
    padding-right: 8px;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    height: 100%;
    border-radius: 4px;
    background-color: #E8EBF0;
}
</style>