import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUIStore = defineStore('ui', () => {
  const isLoginModalOpen = ref(false);
  const isRegisterModalOpen = ref(false);

  function openLoginModal() {
    isLoginModalOpen.value = true;
    isRegisterModalOpen.value = false;
  }

  function closeLoginModal() {
    isLoginModalOpen.value = false;
  }

  function openRegisterModal() {
    isRegisterModalOpen.value = true;
    isLoginModalOpen.value = false;
  }

  function closeModal() {
    isLoginModalOpen.value = false;
    isRegisterModalOpen.value = false;
  }

  return {
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    closeModal,
    openRegisterModal,
  };
});