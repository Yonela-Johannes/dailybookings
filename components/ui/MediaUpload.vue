<script setup lang="ts">
import { ref } from "vue";
import { Upload, X, Loader2 } from "lucide-vue-next";

const props = defineProps<{
    venueId?: string;
    blogId?: string;
    entityType: "VENUE" | "EMPLOYEE" | "PORTFOLIO" | "BLOG" | "CATEGORY";
    category?: string;
    label?: string;
}>();

const emit = defineEmits<{
    (e: "uploaded", data: { url: string; id?: string }): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const error = ref<string | null>(null);
const previewUrl = ref<string | null>(null);

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            error.value = "File is too large. Max size is 10MB.";
            return;
        }
        previewUrl.value = URL.createObjectURL(file);
        error.value = null;
    }
};

const clearSelection = () => {
    previewUrl.value = null;
    if (fileInput.value) fileInput.value.value = "";
    error.value = null;
};

const uploadFile = async () => {
    const file = fileInput.value?.files?.[0];
    if (!file) return;

    uploading.value = true;
    error.value = null;

    const formData = new FormData();
    formData.append("file", file);
    if (props.venueId) formData.append("venueId", props.venueId);
    if (props.blogId) formData.append("blogId", props.blogId);
    formData.append("entityType", props.entityType);
    if (props.category) formData.append("category", props.category);

    try {
        const response = await $fetch<any>("/api/media/upload", {
            method: "POST",
            body: formData,
        });

        emit("uploaded", response);
        clearSelection();
    } catch (err: any) {
        error.value =
            err.data?.message || err.statusMessage || "Failed to upload media";
    } finally {
        uploading.value = false;
    }
};
</script>

<template>
    <div class="space-y-4">
        <div
            class="border-2 border-dashed border-slate-200 rounded-[24px] p-8 transition-all hover:border-primary group relative text-center bg-slate-50/50"
            :class="{ 'border-primary bg-primary/5': previewUrl }"
        >
            <input
                ref="fileInput"
                type="file"
                accept="image/*,video/*"
                class="hidden"
                @change="handleFileSelect"
            />

            <div
                v-if="!previewUrl"
                class="flex flex-col items-center justify-center cursor-pointer py-4"
                @click="fileInput?.click()"
            >
                <div
                    class="p-4 rounded-2xl bg-white text-slate-400 group-hover:text-primary group-hover:shadow-lg transition-all border border-slate-100"
                >
                    <Upload class="w-6 h-6" />
                </div>
                <p
                    class="mt-4 text-sm font-black text-slate-900 uppercase tracking-widest italic leading-none"
                >
                    {{ label || "Initiate Upload" }}
                </p>
                <p
                    class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest"
                >
                    JPG, PNG, WEBP (MAX 10MB)
                </p>
            </div>

            <div
                v-else
                class="relative aspect-video rounded-[20px] overflow-hidden bg-slate-100 max-w-sm mx-auto shadow-inner border border-slate-200"
            >
                <img
                    v-if="!fileInput?.files?.[0]?.type.startsWith('video')"
                    :src="previewUrl"
                    class="w-full h-full object-cover"
                />
                <video
                    v-else
                    :src="previewUrl"
                    class="w-full h-full object-cover"
                    controls
                />
                <button
                    @click="clearSelection"
                    class="absolute top-3 right-3 p-2 bg-slate-950/80 text-white rounded-xl hover:bg-red-500 transition-all shadow-xl"
                >
                    <X class="w-4 h-4" />
                </button>
            </div>
        </div>

        <div
            v-if="error"
            class="text-[10px] font-black text-red-500 uppercase tracking-widest text-center"
        >
            {{ error }}
        </div>

        <div v-if="previewUrl" class="flex justify-center gap-4">
            <button
                @click="clearSelection"
                class="px-6 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
                :disabled="uploading"
            >
                Discard
            </button>
            <button
                @click="uploadFile"
                :disabled="uploading"
                class="inline-flex items-center px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-primary/20 hover:bg-slate-950 disabled:opacity-50 transition-all"
            >
                <Loader2 v-if="uploading" class="w-4 h-4 mr-2 animate-spin" />
                {{ uploading ? "Syncing..." : "Commit Upload" }}
            </button>
        </div>
    </div>
</template>
