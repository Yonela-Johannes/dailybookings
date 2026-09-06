<script setup lang="ts">
import {
    Apple,
    ArrowUpRight,
    Check,
    Download,
    Play,
    Smartphone,
} from "lucide-vue-next";

const videos = [
    {
        src: "/videos/makeup.mp4",
        label: "Beauty",
        title: "Makeup artists",
    },
    {
        src: "/videos/barber.mp4",
        label: "Grooming",
        title: "Barbers",
    },
    {
        src: "/videos/photography.mp4",
        label: "Photography",
        title: "Photographers",
    },
];
</script>

<template>
    <section
        class="relative overflow-hidden border-t border-slate-200 bg-slate-50"
    >
        <div
            class="mx-auto grid max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-20 lg:px-8 lg:py-28"
        >
            <!-- CONTENT -->
            <div class="max-w-xl">
                <!-- Available on -->
                <div class="flex items-center gap-5">
                    <span
                        class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400"
                    >
                        Available on
                    </span>

                    <div class="flex items-center gap-3 text-slate-900">
                        <Apple class="h-5 w-5" />
                        <span class="text-sm font-semibold">iOS</span>

                        <span class="h-4 w-px bg-slate-300" />

                        <Smartphone class="h-5 w-5" />
                        <span class="text-sm font-semibold">Android</span>
                    </div>
                </div>

                <!-- Heading -->
                <h2
                    class="mt-8 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
                >
                    DailyBookings,
                    <br />
                    <span class="text-primary">only for greatness.</span>
                </h2>

                <p
                    class="mt-6 max-w-lg text-base leading-7 text-slate-500 sm:text-lg sm:leading-8"
                >
                    Discover trusted professionals, explore local services, and
                    book your next appointment directly from the DailyBookings
                    app.
                </p>

                <!-- Benefits -->
                <div class="mt-8 space-y-4">
                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white"
                        >
                            <Check class="h-3.5 w-3.5" />
                        </span>

                        <span class="text-sm font-medium text-slate-700">
                            Find services near you
                        </span>
                    </div>

                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white"
                        >
                            <Check class="h-3.5 w-3.5" />
                        </span>

                        <span class="text-sm font-medium text-slate-700">
                            Book in just a few taps
                        </span>
                    </div>

                    <div class="flex items-center gap-3">
                        <span
                            class="flex h-6 w-6 shrink-0 items-center justify-center bg-primary text-white"
                        >
                            <Check class="h-3.5 w-3.5" />
                        </span>

                        <span class="text-sm font-medium text-slate-700">
                            Keep all your bookings in one place
                        </span>
                    </div>
                </div>

                <!-- Download CTA -->
                <div class="mt-10 flex flex-col gap-3 sm:flex-row">
                    <a
                        href="/app-store-redirect"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="group inline-flex h-14 items-center justify-center gap-3 bg-slate-950 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary"
                    >
                        <Apple class="h-5 w-5" />

                        <span class="flex flex-col items-start leading-none">
                            <span class="text-[10px] font-medium text-white/60">
                                Download on the
                            </span>
                            <span class="mt-1 text-sm"> App Store </span>
                        </span>

                        <ArrowUpRight
                            class="ml-2 h-4 w-4 opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                    </a>

                    <a
                        href="/app"
                        class="inline-flex h-14 items-center justify-center gap-3 border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-900 transition-colors hover:border-primary hover:text-primary"
                    >
                        <Download class="h-4 w-4" />
                        Get the app
                    </a>
                </div>

                <p class="mt-4 text-xs text-slate-400">
                    Free to download. Available for iPhone and Android.
                </p>
            </div>

            <!-- PHONE SHOWCASE (Side-by-Side Layout) -->
            <div
                class="relative flex min-h-[560px] items-center justify-center lg:min-h-[640px]"
            >
                <!-- Decorative background -->
                <div
                    class="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 sm:h-[460px] sm:w-[460px]"
                />

                <!-- Container for all three phones in a row -->
                <div
                    class="relative z-20 flex items-center justify-center gap-4 sm:gap-6 lg:gap-8"
                >
                    <!-- LEFT PHONE -->
                    <div
                        class="w-[170px] overflow-hidden rounded-[40px] border-[6px] border-slate-800 bg-slate-950 p-[2px] shadow-2xl sm:w-[200px] lg:w-[220px]"
                    >
                        <div
                            class="relative aspect-[9/19.5] overflow-hidden rounded-[34px] bg-slate-900"
                        >
                            <video
                                :src="videos[0].src"
                                autoplay
                                muted
                                loop
                                playsinline
                                preload="metadata"
                                class="absolute inset-0 h-full w-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                            />

                            <div
                                class="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-3 text-white"
                            >
                                <span
                                    class="text-[10px] font-semibold tracking-tight"
                                    >9:41</span
                                >
                                <div class="h-3.5 w-16 rounded-full bg-black" />
                            </div>

                            <div
                                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-16"
                            >
                                <p
                                    class="text-[10px] font-medium text-white/70"
                                >
                                    {{ videos[0].label }}
                                </p>
                                <p
                                    class="mt-1 text-sm font-semibold text-white"
                                >
                                    {{ videos[0].title }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- MAIN PHONE (Center - slightly larger) -->
                    <div
                        class="hidden lg:block w-[190px] overflow-hidden rounded-[44px] border-[7px] border-slate-800 bg-slate-950 p-[2px] shadow-[0_30px_80px_rgba(15,23,42,0.4)] sm:w-[230px] lg:w-[250px]"
                    >
                        <div
                            class="relative aspect-[9/19.5] overflow-hidden rounded-[38px] bg-slate-900"
                        >
                            <div
                                class="absolute left-1/2 top-2.5 z-40 h-4 w-20 -translate-x-1/2 rounded-full bg-black flex items-center justify-end px-1.5 gap-1"
                            >
                                <div
                                    class="h-1.5 w-1.5 rounded-full bg-slate-900"
                                ></div>
                                <div
                                    class="h-2 w-2 rounded-full bg-slate-950 ring-1 ring-slate-800"
                                ></div>
                            </div>

                            <video
                                :src="videos[1].src"
                                autoplay
                                muted
                                loop
                                playsinline
                                preload="metadata"
                                class="absolute inset-0 h-full w-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                            />

                            <div
                                class="absolute inset-x-0 top-0 z-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent px-5 pb-8 pt-4"
                            >
                                <div
                                    class="mt-4 flex items-center justify-between text-white"
                                >
                                    <span
                                        class="text-[11px] font-semibold tracking-tight"
                                        >9:41</span
                                    >
                                    <span
                                        class="text-[11px] font-bold tracking-tight"
                                        >DailyBookings</span
                                    >
                                    <div
                                        class="flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/20 backdrop-blur-md"
                                    >
                                        <Search
                                            class="h-3.5 w-3.5 text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                class="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black via-black/70 to-transparent p-5 pt-24"
                            >
                                <div class="mb-3 flex items-center gap-2">
                                    <span
                                        class="bg-primary px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider text-white"
                                    >
                                        {{ videos[1].label }}
                                    </span>
                                </div>

                                <h3
                                    class="text-xl font-bold tracking-tight text-white"
                                >
                                    {{ videos[1].title }}
                                </h3>

                                <p class="mt-1 text-[11px] text-white/70">
                                    Find & book near you
                                </p>

                                <button
                                    type="button"
                                    class="mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white text-xs font-bold text-slate-950 shadow-lg"
                                >
                                    <Play class="h-3 w-3 fill-current" />
                                    Book now
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT PHONE -->
                    <div
                        class="w-[170px] overflow-hidden rounded-[40px] border-[6px] border-slate-800 bg-slate-950 p-[2px] shadow-2xl sm:w-[200px] lg:w-[220px]"
                    >
                        <div
                            class="relative aspect-[9/19.5] overflow-hidden rounded-[34px] bg-slate-900"
                        >
                            <video
                                :src="videos[2].src"
                                autoplay
                                muted
                                loop
                                playsinline
                                preload="metadata"
                                class="absolute inset-0 h-full w-full object-cover"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none"
                            />

                            <div
                                class="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 pt-3 text-white"
                            >
                                <span
                                    class="text-[10px] font-semibold tracking-tight"
                                    >9:41</span
                                >
                                <div class="h-3.5 w-16 rounded-full bg-black" />
                            </div>

                            <div
                                class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 pt-16"
                            >
                                <p
                                    class="text-[10px] font-medium text-white/70"
                                >
                                    {{ videos[2].label }}
                                </p>
                                <p
                                    class="mt-1 text-sm font-semibold text-white"
                                >
                                    {{ videos[2].title }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Floating Badge -->
                <div
                    class="hidden lg:flex absolute bottom-6 left-1/2 z-30 -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md"
                >
                    <div
                        class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary"
                    >
                        <Smartphone class="h-4 w-4" />
                    </div>

                    <div>
                        <p
                            class="text-[10px] font-medium uppercase tracking-wider text-slate-400"
                        >
                            DailyBookings
                        </p>
                        <p class="text-xs font-semibold text-slate-900">
                            Your bookings. Anywhere.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
