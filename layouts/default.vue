<script setup lang="ts">
const { fetchFavorites } = useFavorites();
const { fetchLikes } = useLikes();
onMounted(() => {
    fetchFavorites();
    fetchLikes();
});
</script>

<template>
    <div class="relative min-h-screen">
        <Header />
        <main>
            <slot />
        </main>
        <Footer />
    </div>
</template>
