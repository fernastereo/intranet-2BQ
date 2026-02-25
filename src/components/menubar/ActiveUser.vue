<template>
  <LoadingSpinner class="pb-4" v-if="isLoading" :size="24" :showMessage="false"/>
  <div v-else class="flex items-center gap-x-4 md:py-3">
    <span class="sr-only">Your profile</span>
    <img v-if="userData?.avatar" class="size-8 rounded-full bg-gray-800" :src="userData.avatar" :alt="`${userData.name} avatar`" />
    <div v-else class="size-8 rounded-full bg-gray-400 flex justify-center items-center">
      <span class="text-gray-900">{{ getUserInitials() }}</span>
    </div>
    <span class="hidden md:block" aria-hidden="true">{{ userData?.name }}</span>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useAuth } from '@/shared/composables/useAuth'
  import LoadingSpinner from '@/shared/components/LoadingSpinner.vue'
  
  const isLoading = ref(false);

  const { getUser } = useAuth()

  const userData = ref(null)

  const fetchUserData = async () => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      const response = await getUser();
      userData.value = response
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      isLoading.value = false;
    }
  }

  const getUserInitials = () => {
    if(!userData.value?.name) return '?'

    return userData.value.name
      .split(' ')
      .slice(0, 2)
      .map(name => name.charAt(0).toUpperCase())
      .join('')
  }

  //onMounted call api for user data
  onMounted(fetchUserData)
</script>