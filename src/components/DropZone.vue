<template>
    <div style="display: flex; justify-content: center">
        <div class="file-upload">
            <div class="upload-box" :class="{ 'error-border': errorMessage !== '' }" @dragover.prevent
                @drop.prevent="handleDrop">
                <input type="file" multiple ref="fileInput" @change="handleFileChange" hidden />
                <div>

                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M22.6667 22.6666H8.00002C6.69522 22.6665 5.43572 22.1882 4.45985 21.322C3.48399 20.4559 2.85945 19.2621 2.70442 17.9666C2.54939 16.671 2.87463 15.3636 3.61859 14.2916C4.36255 13.2197 5.47362 12.4577 6.74155 12.1497C7.00014 10.122 7.91748 8.23534 9.35257 6.77969C10.7877 5.32404 12.6611 4.37996 14.6849 4.09257C16.7087 3.80517 18.7709 4.19037 20.5546 5.18894C22.3382 6.18752 23.7445 7.74422 24.5574 9.61977C26.0939 10.0728 27.4157 11.0646 28.2803 12.4132C29.1448 13.7618 29.4943 15.3769 29.2645 16.9623C29.0348 18.5477 28.2413 19.9972 27.0294 21.0449C25.8176 22.0926 24.2686 22.6684 22.6667 22.6666Z"
                            fill="#D9E2EC" />
                        <path
                            d="M19.3333 18C19.1582 18.0002 18.9847 17.9658 18.823 17.8987C18.6612 17.8317 18.5143 17.7333 18.3906 17.6093L15.9999 15.2187L13.6093 17.6094C13.3587 17.8568 13.0204 17.995 12.6683 17.9939C12.3162 17.9928 11.9788 17.8524 11.7298 17.6034C11.4808 17.3544 11.3405 17.017 11.3394 16.6649C11.3383 16.3128 11.4765 15.9745 11.7239 15.724L15.0573 12.3906C15.1811 12.2668 15.328 12.1686 15.4898 12.1015C15.6515 12.0345 15.8249 12 16 12C16.1751 12 16.3484 12.0345 16.5102 12.1015C16.672 12.1686 16.8189 12.2668 16.9427 12.3906L20.276 15.724C20.4624 15.9104 20.5894 16.148 20.6408 16.4066C20.6922 16.6652 20.6658 16.9333 20.5649 17.1769C20.464 17.4205 20.2931 17.6287 20.0739 17.7752C19.8547 17.9217 19.597 17.9999 19.3333 18Z"
                            fill="#627D98" />
                        <path
                            d="M16 28C15.8249 28 15.6514 27.9656 15.4897 27.8986C15.3279 27.8316 15.1809 27.7334 15.057 27.6096C14.9332 27.4858 14.835 27.3388 14.768 27.177C14.701 27.0152 14.6666 26.8418 14.6666 26.6667V13.3333C14.6666 12.9797 14.8071 12.6406 15.0572 12.3905C15.3072 12.1405 15.6463 12 16 12C16.3536 12 16.6927 12.1405 16.9428 12.3905C17.1928 12.6406 17.3333 12.9797 17.3333 13.3333V26.6667C17.3333 26.8418 17.2989 27.0152 17.2319 27.177C17.1649 27.3388 17.0667 27.4858 16.9429 27.6096C16.819 27.7334 16.672 27.8316 16.5103 27.8986C16.3485 27.9656 16.1751 28 16 28Z"
                            fill="#627D98" />
                    </svg>

                    <p>Drag and drop files</p>
                    <button class="upload-btn" @click="triggerFileInput">Browse files</button>
                </div>
            </div>
            <div v-if="files.length" class="file-list">
                <div v-for="(file, index) in visibleFiles" :key="index" class="file-item">
                    <div class="file-icon">
                        <img :src="getFileIcon(file)" alt="file-icon" />
                        <div class="file-name">
                            <p>{{ file.name }}</p>
                            <label>{{ formatSize(file.size) }}</label>
                        </div>
                    </div>
                    <svg @click="removeFile(index)" xmlns="http://www.w3.org/2000/svg" version="1.1"
                        xmlns:xlink="http://www.w3.org/1999/xlink" width="14" height="14" x="0" y="0"
                        viewBox="0 0 24 24" style="enable-background:new 0 0 512 512" xml:space="preserve"
                        class="svg-delete">
                        <g>
                            <path
                                d="M15.854 8.854 12.708 12l3.146 3.146a.5.5 0 0 1-.708.707L12 12.707l-3.146 3.146a.498.498 0 0 1-.708 0 .5.5 0 0 1 0-.707L11.292 12 8.146 8.854a.5.5 0 0 1 .707-.707l3.146 3.146 3.146-3.146a.5.5 0 0 1 .707.707ZM24 12c0 6.617-5.383 12-12 12S0 18.617 0 12 5.383 0 12 0s12 5.383 12 12Zm-1 0c0-6.065-4.935-11-11-11S1 5.935 1 12s4.935 11 11 11 11-4.935 11-11Z"
                                fill="#666666" opacity="1" data-original="#000000" class=""></path>
                        </g>
                    </svg>
                </div>

                <svg v-if="files.length > 3 && currentEndIndex < files.length" @click="nextFiles" width="32" height="32"
                    viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-next">
                    <g opacity="0.4">
                        <circle cx="16" cy="16" r="16" fill="#627D98" />
                        <path d="M13 9L18 16L13 23" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                    </g>
                </svg>

                <svg v-if="currentStartIndex > 0" @click="prevFiles" width="32" height="32" viewBox="0 0 32 32"
                    fill="none" xmlns="http://www.w3.org/2000/svg" class="svg-back">
                    <g opacity="0.4">
                        <circle cx="16" cy="16" r="16" fill="#627D98" />
                        <path d="M18 9L13 16L18 23" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
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
import fileIcon from '../assets/icon/file.png'

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
                errorMessage.value = `The maximum file size is ${Math.round(props.maxSize / (1024 * 1024))} MB`;
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
                    return fileIcon;
            }
        };


        const formatSize = (size: number) => {
            const kb = size / 1024;
            return `${Math.round(kb)}kB`;
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
            saveFilesToLocalStorage,
            fileIcon
        };
    }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap');

.file-upload {
    display: flex;
    flex-direction: column;
    font-family: "Noto Sans JP", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
}

.upload-box {
    width: 840px;
    height: 230px;
    border: 1px solid rgba(220, 220, 220, 1);
    border-radius: 7px;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    display: flex;
    background-color: rgba(248, 248, 248, 1);

    p {
        font-weight: 700;
        font-size: 18px;
        line-height: 22px;
        margin: 0 !important;
        color: rgba(51, 51, 51, 1);
        margin-top: 15px !important;
    }

    .upload-btn {
        font-size: 18px;
        line-height: 22px;
        font-weight: 400;
        background-color: inherit;
        color: rgba(51, 51, 51, 1);
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
    margin-top: 33px;

}

.file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 1px solid rgba(220, 220, 220, 1);
    padding: 8px;
    width: 244px;
    border-radius: 3px;
    box-sizing: border-box;
    height: 48px;

    .file-name {
        display: flex;
        flex-direction: column;
    }

    p {
        margin: 0 !important;
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 140px;
        color: rgba(51, 51, 51, 1);
        padding: 0 !important;

    }

    label {
        font-size: 10px;
        font-weight: 400;
        line-height: 14px;
        text-align: left;
        color: rgba(102, 102, 102, 1);
        margin: 0 !important;
        padding: 0 !important;
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
    gap: 8px;
}

.file-item img {
    width: 32px;
    height: 32px;
}

.upload-box.error-border {
    border-color: rgba(237, 93, 93, 1);
}

.error-message {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: rgba(237, 93, 93, 1);
    margin-top: 17px;
}
</style>