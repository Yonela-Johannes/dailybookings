<script setup lang="ts">
import { ref } from 'vue'
import { Calendar, Mail, Lock, Loader2 } from 'lucide-vue-next'

const client = useSupabaseClient()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  const { error: authError } = await client.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    error.value = authError.message
    loading.value = false
  } else {
    navigateTo('/dashboard')
  }
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center">
    <div class="w-full max-w-md space-y-8 bg-white p-10 rounded-[2rem] shadow-xl border border-slate-100">
      <div class="text-center space-y-2">
        <div class="inline-flex p-3 bg-blue-50 rounded-2xl mb-4">
          <Calendar class="w-8 h-8 text-primary" />
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
        <p class="text-slate-500">Sign in to manage your bookings</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div v-if="error" class="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 animate-in fade-in slide-in-from-top-2">
          {{ error }}
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Mail class="w-4 h-4" /> Email Address
          </label>
          <input
            v-model="email" type="email" required
            class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Lock class="w-4 h-4" /> Password
          </label>
          <input
            v-model="password" type="password" required
            class="w-full p-3 rounded-xl border-2 border-slate-100 focus:border-primary focus:ring-0 outline-none transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full py-4 bg-primary text-white font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <div class="text-center text-sm text-slate-500">
        Don't have an account? <a href="#" class="text-primary font-bold hover:underline">Contact Support</a>
      </div>
    </div>
  </div>
</template>
