<script setup lang="ts">
import {
    Search,
    Send,
    Loader2,
    MessageSquare,
    ChevronLeft,
    User,
    Clock
} from "lucide-vue-next";
import { formatDistanceToNow } from "date-fns";

definePageMeta({
    middleware: "auth",
});

const { dbUser } = useAuth();
const { data: conversations, refresh: refreshConversations, pending: loadingConvs } = await useFetch<any[]>("/api/messages/conversations");

const selectedConversationId = ref<string | null>(null);
const { data: messages, refresh: refreshMessages, pending: loadingMessages } = useFetch<any[]>(() =>
    selectedConversationId.value ? `/api/messages/${selectedConversationId.value}` : null
);

const newMessage = ref("");
const sending = ref(false);

const selectedConversation = computed(() =>
    conversations.value?.find(c => c.id === selectedConversationId.value)
);

const otherParticipant = (conv: any) => {
    return conv.participants[0]?.user; // API filters out self
};

const handleSendMessage = async () => {
    if (!newMessage.value.trim() || !selectedConversationId.value || sending.value) return;

    sending.value = true;
    try {
        await $fetch("/api/messages/send", {
            method: "POST",
            body: {
                conversationId: selectedConversationId.value,
                body: newMessage.value.trim()
            }
        });
        newMessage.value = "";
        await refreshMessages();
        await refreshConversations();
    } catch (error) {
        console.error("Failed to send message:", error);
    } finally {
        sending.value = false;
    }
};

const selectConversation = (id: string) => {
    selectedConversationId.value = id;
};

// Polling for new messages (simple implementation as requested if no realtime)
let interval: any;
onMounted(() => {
    interval = setInterval(() => {
        if (selectedConversationId.value) refreshMessages();
        refreshConversations();
    }, 5000);
});

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <main class="min-h-screen bg-white pt-20">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex h-[calc(100vh-120px)] border border-slate-200 bg-white">
                <!-- Sidebar -->
                <div :class="[
                    'w-full border-r border-slate-200 lg:w-80 flex flex-col',
                    selectedConversationId ? 'hidden lg:flex' : 'flex'
                ]">
                    <div class="p-4 border-b border-slate-200 bg-slate-50/50">
                        <h1 class="text-lg font-bold text-slate-950">Messages</h1>
                        <div class="relative mt-4">
                            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                class="w-full h-9 bg-white border border-slate-200 pl-9 pr-4 text-xs outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>

                    <div class="flex-1 overflow-y-auto">
                        <div v-if="loadingConvs && !conversations" class="flex items-center justify-center p-8">
                            <Loader2 class="h-5 w-5 animate-spin text-slate-400" />
                        </div>
                        <div v-else-if="!conversations?.length" class="flex flex-col items-center justify-center p-12 text-center">
                            <div class="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <MessageSquare class="h-6 w-6 text-slate-300" />
                            </div>
                            <p class="text-sm font-medium text-slate-900">No messages yet</p>
                            <p class="text-xs text-slate-500 mt-1">Start a conversation from a professional's page.</p>
                        </div>
                        <div v-else>
                            <button
                                v-for="conv in conversations"
                                :key="conv.id"
                                @click="selectConversation(conv.id)"
                                :class="[
                                    'w-full flex items-center gap-3 p-4 transition-colors border-b border-slate-50 text-left',
                                    selectedConversationId === conv.id ? 'bg-slate-50 border-l-4 border-l-primary' : 'hover:bg-slate-50/50'
                                ]"
                            >
                                <div class="h-10 w-10 shrink-0 rounded-full bg-slate-200 overflow-hidden">
                                    <img v-if="otherParticipant(conv)?.profile?.avatarUrl" :src="otherParticipant(conv).profile.avatarUrl" class="h-full w-full object-cover" />
                                    <User v-else class="h-full w-full p-2 text-slate-400" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center justify-between gap-2">
                                        <span class="text-sm font-bold text-slate-950 truncate">{{ otherParticipant(conv)?.fullName || 'DailyBookings User' }}</span>
                                        <span v-if="conv.messages?.[0]" class="text-[10px] text-slate-400 whitespace-nowrap">
                                            {{ formatDistanceToNow(new Date(conv.messages[0].createdAt), { addSuffix: false }) }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-500 truncate mt-0.5">
                                        {{ conv.messages?.[0]?.body || 'No messages yet' }}
                                    </p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Chat Area -->
                <div :class="[
                    'flex-1 flex flex-col bg-slate-50/30',
                    !selectedConversationId ? 'hidden lg:flex' : 'flex'
                ]">
                    <div v-if="selectedConversationId" class="flex flex-col h-full">
                        <!-- Chat Header -->
                        <div class="flex items-center justify-between px-4 h-16 bg-white border-b border-slate-200">
                            <div class="flex items-center gap-3">
                                <button @click="selectedConversationId = null" class="lg:hidden p-2 -ml-2 text-slate-400">
                                    <ChevronLeft class="h-5 w-5" />
                                </button>
                                <div class="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                                    <img v-if="otherParticipant(selectedConversation)?.profile?.avatarUrl" :src="otherParticipant(selectedConversation).profile.avatarUrl" class="h-full w-full object-cover" />
                                    <User v-else class="h-full w-full p-1.5 text-slate-400" />
                                </div>
                                <div>
                                    <h2 class="text-sm font-bold text-slate-950">{{ otherParticipant(selectedConversation)?.fullName }}</h2>
                                    <p class="text-[10px] text-teal-600 font-medium uppercase tracking-widest">Active now</p>
                                </div>
                            </div>
                        </div>

                        <!-- Messages -->
                        <div class="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse">
                            <div v-if="loadingMessages && !messages" class="flex items-center justify-center p-8">
                                <Loader2 class="h-5 w-5 animate-spin text-slate-400" />
                            </div>
                            <div v-else class="flex flex-col gap-4">
                                <div
                                    v-for="msg in messages"
                                    :key="msg.id"
                                    :class="[
                                        'max-w-[80%] p-3 text-sm shadow-sm',
                                        msg.senderId === dbUser?.id
                                            ? 'self-end bg-primary text-white rounded-l-2xl rounded-tr-2xl'
                                            : 'self-start bg-white text-slate-900 border border-slate-100 rounded-r-2xl rounded-tl-2xl'
                                    ]"
                                >
                                    <p>{{ msg.body }}</p>
                                    <div :class="['text-[9px] mt-1 flex items-center gap-1', msg.senderId === dbUser?.id ? 'text-white/70' : 'text-slate-400']">
                                        <Clock class="h-2 w-2" />
                                        {{ formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Input Area -->
                        <div class="p-4 bg-white border-t border-slate-200">
                            <form @submit.prevent="handleSendMessage" class="flex gap-3">
                                <input
                                    v-model="newMessage"
                                    type="text"
                                    placeholder="Type your message..."
                                    class="flex-1 h-11 bg-slate-50 border border-slate-200 px-4 text-sm outline-none focus:border-primary transition-colors"
                                />
                                <button
                                    type="submit"
                                    :disabled="!newMessage.trim() || sending"
                                    class="h-11 w-11 flex items-center justify-center bg-slate-950 text-white hover:bg-primary transition-colors disabled:opacity-50"
                                >
                                    <Loader2 v-if="sending" class="h-4 w-4 animate-spin" />
                                    <Send v-else class="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>

                    <!-- No Selection State -->
                    <div v-else class="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div class="h-20 w-20 rounded-full bg-white border border-slate-100 flex items-center justify-center mb-6 shadow-sm">
                            <MessageSquare class="h-10 w-10 text-slate-200" />
                        </div>
                        <h2 class="text-xl font-bold text-slate-950">Your Inbox</h2>
                        <p class="text-sm text-slate-500 mt-2 max-w-xs">Select a conversation from the sidebar to start messaging.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
