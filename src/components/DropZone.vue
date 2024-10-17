<template>
    <div style="display: flex; justify-content: center">
        <div class="file-upload">
            <div class="upload-box" :class="{ 'error-border': errorMessage !== '' }" @dragover.prevent
                @drop.prevent="handleDrop">
                <input type="file" multiple ref="fileInput" @change="handleFileChange" hidden />
                <div>
                    <i style="font-size: 25px; margin-bottom: 20px; color: #8495a7"
                        class="fa-solid fa-cloud-arrow-up"></i>
                    <p>Drag and drop files</p>
                    <button class="upload-btn" @click="triggerFileInput">Browse files</button>
                </div>
            </div>
            <div v-if="files.length" class="file-list">
                <div v-for="(file, index) in visibleFiles" :key="index" class="file-item">
                    <div class="file-icon">
                        <img :src="getFileIcon(file)" alt="file-icon" />
                        <div>
                            <p>{{ file.name }}</p>
                            <label>{{ formatSize(file.size) }}</label>
                        </div>
                    </div>
                    <svg @click="removeFile(index)" xmlns="http://www.w3.org/2000/svg" version="1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="16" height="16" x="0" y="0"
                        viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"
                        class="svg-delete">
                        <g>
                            <path
                                d="M15.854 8.854 12.708 12l3.146 3.146a.5.5 0 0 1-.708.707L12 12.707l-3.146 3.146a.498.498 0 0 1-.708 0 .5.5 0 0 1 0-.707L11.292 12 8.146 8.854a.5.5 0 0 1 .707-.707l3.146 3.146 3.146-3.146a.5.5 0 0 1 .707.707ZM24 12c0 6.617-5.383 12-12 12S0 18.617 0 12 5.383 0 12 0s12 5.383 12 12Zm-1 0c0-6.065-4.935-11-11-11S1 5.935 1 12s4.935 11 11 11 11-4.935 11-11Z"
                                fill="#929292" opacity="1" data-original="#000000" class=""></path>
                        </g>
                    </svg>
                </div>
                <svg v-if="files.length > 3 && currentEndIndex < files.length" @click="nextFiles"
                    xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink"
                    width="32" height="32" x="0" y="0" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512"
                    xml:space="preserve" class="svg-next">
                    <g>
                        <path
                            d="M256 0C114.837 0 0 114.837 0 256s114.837 256 256 256 256-114.837 256-256S397.163 0 256 0zm79.083 271.083L228.416 377.749A21.275 21.275 0 0 1 213.333 384a21.277 21.277 0 0 1-15.083-6.251c-8.341-8.341-8.341-21.824 0-30.165L289.835 256l-91.584-91.584c-8.341-8.341-8.341-21.824 0-30.165s21.824-8.341 30.165 0l106.667 106.667c8.341 8.341 8.341 21.823 0 30.165z"
                            fill="#cdcdcd" opacity="1" data-original="#000000" class=""></path>
                    </g>
                </svg>
                <svg v-if="currentStartIndex > 0" @click="prevFiles" xmlns="http://www.w3.org/2000/svg" version="1.1"
                    xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" x="0" y="0" viewBox="0 0 512 512"
                    style="enable-background:new 0 0 512 512" xml:space="preserve" class="svg-back">
                    <g>
                        <path
                            d="M256 0C114.837 0 0 114.837 0 256s114.837 256 256 256 256-114.837 256-256S397.163 0 256 0zm57.749 347.584c8.341 8.341 8.341 21.824 0 30.165A21.275 21.275 0 0 1 298.666 384a21.277 21.277 0 0 1-15.083-6.251L176.917 271.083c-8.341-8.341-8.341-21.824 0-30.165l106.667-106.667c8.341-8.341 21.824-8.341 30.165 0s8.341 21.824 0 30.165L222.165 256l91.584 91.584z"
                            fill="#cdcdcd" opacity="1" data-original="#000000" class=""></path>
                    </g>
                </svg>
            </div>
            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';

export default defineComponent({
    name: 'FileUpload',
    props: {
        maxSize: {
            type: Number,
            required: true,
            default: 10 * 1024 * 1024 // 10MB in bytes
        },
        maxLength: {
            type: Number,
            required: true,
            default: 5
        }
    },
    setup(props) {
        const files = ref<File[]>([]);
        const fileInput = ref<HTMLInputElement | null>(null);
        const errorMessage = ref('');
        const currentStartIndex = ref(0);
        const STORAGE_KEY = 'uploadedFiles';

        onMounted(() => {
            const storedFiles = localStorage.getItem(STORAGE_KEY);
            if (storedFiles) {
                const parsedFiles = JSON.parse(storedFiles);
                files.value = parsedFiles.map((file: { name: string; size: number; type: string }) => ({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                }));
            }
        });

        const visibleFiles = computed(() => {
            return files.value.slice(currentStartIndex.value, currentStartIndex.value + 3);
        });
        const currentEndIndex = computed(() => {
            return currentStartIndex.value + visibleFiles.value.length;
        });

        const triggerFileInput = () => {
            fileInput.value?.click();
        };

        const handleFileChange = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files) {
                addFiles(Array.from(target.files));
            }
        };

        const handleDrop = (event: DragEvent) => {
            if (event.dataTransfer?.files) {
                addFiles(Array.from(event.dataTransfer.files));
            }
        };

        const addFiles = (newFiles: File[]) => {
            errorMessage.value = '';
            if (files.value.length + newFiles.length > props.maxLength) {
                errorMessage.value = `You can only upload up to ${props.maxLength} files.`;
                return;
            }
            const oversizedFiles = newFiles.filter(file => file.size > props.maxSize);
            if (oversizedFiles.length > 0) {
                errorMessage.value = `The maximum file size is ${(props.maxSize / (1024 * 1024)).toFixed(2)} MB.`;
                return;
            }
            files.value.push(...newFiles);
            saveFilesToLocalStorage();
        };

        const removeFile = (index: number) => {
            files.value.splice(index, 1);
            errorMessage.value = '';
            saveFilesToLocalStorage();
        };

        const saveFilesToLocalStorage = () => {
            const fileInfo = files.value.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fileInfo));
        };

        const nextFiles = () => {
            if (currentStartIndex.value + 3 < files.value.length) {
                currentStartIndex.value++;
            }
        };

        const prevFiles = () => {
            if (currentStartIndex.value > 0) {
                currentStartIndex.value--;
            }
        };

        const getFileIcon = (file: File) => {
            const fileType = file?.name?.split('.').pop();

            if (!fileType) {
                return 'https://static.thenounproject.com/png/643663-200.png'; 
            }

            switch (fileType.toLowerCase()) {
                case 'pdf':
                    return 'https://cdn2.iconfinder.com/data/icons/file-8/128/file-expand_Pdf-512.png';
                case 'doc':
                case 'docx':
                    return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTp9uU1BPDla8o1MGci_5tlBqbXhptNAegclQ&s';
                case 'xls':
                case 'xlsx':
                    return 'https://cdn.iconscout.com/icon/free/png-256/free-file-document-excel-spreadsheet-table-xls-44509.png';
                default:
                    return 'https://static.thenounproject.com/png/643663-200.png'; 
            }
        };


        const formatSize = (size: number) => {
            const kb = size / 1024;
            return `${kb.toFixed(2)}kB`;
        };

        return {
            files,
            fileInput,
            errorMessage,
            triggerFileInput,
            handleFileChange,
            handleDrop,
            removeFile,
            getFileIcon,
            formatSize,
            nextFiles,
            prevFiles,
            visibleFiles,
            currentEndIndex,
            currentStartIndex,
            saveFilesToLocalStorage
        };
    }
});
</script>

<style scoped>
.file-upload {
    display: flex;
    flex-direction: column;
}

.upload-box {
    width: 842px;
    height: 232px;
    border: 2px solid rgba(220, 220, 220, 1);
    border-radius: 7px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    margin-bottom: 20px;
    display: flex;
    background-color: #f8f8f8;

    p {
        font-weight: 700;
        font-size: 18px;
        line-height: 22px;
        margin: 0 !important;
    }

    .upload-btn {
        font-size: 18px;
        line-height: 22px;
        background-color: inherit;
        border: none;
        text-decoration: underline;
        cursor: pointer;
    }
}

.file-list {
    display: flex;
    gap: 10px;
    width: 842px;
    flex-wrap: nowrap;
    position: relative;
    align-items: center;
}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border: 1px solid rgba(220, 220, 220, 1);
    padding: 8px;
    width: 244px;
    border-radius: 3px;
    box-sizing: border-box;
    height: 48px;

    p {
        margin: 0;
        font-family: Noto Sans;
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        text-align: left;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 140px;

    }

    label {
        font-family: Noto Sans;
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        text-align: left;
        color: rgba(102, 102, 102, 1);

    }

    .svg-delete {
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }

}

.svg-next {
    cursor: pointer;
    position: absolute;
    left: 100%;
    margin-left: 10px;

    &:hover {
        opacity: 0.8;
    }
}

.svg-back {
    cursor: pointer;
    position: absolute;
    right: 100%;
    margin-right: 10px;

    &:hover {
        opacity: 0.8;
    }
}

.file-icon {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
}

.file-item img {
    width: 32px;
    height: 32px;
}

.upload-box.error-border {
    border-color: red;
}

.error-message {
    font-family: Noto Sans;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: red;
    margin-top: 10px;
}
</style>