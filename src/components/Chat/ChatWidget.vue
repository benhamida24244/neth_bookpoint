<template>
  <div class="fixed bottom-6 right-6 z-[1000]">
    <!-- Chat Window -->
    <Transition name="chat-window">
      <div v-if="isOpen" class="w-[320px] h-[450px] bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden absolute bottom-[70px] right-0 backdrop-blur-sm">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 flex justify-between items-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)]"></div>
          <div class="flex items-center gap-3 relative z-10">
            <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-semibold">Neth Bookpoint</h3>
              <span class="text-xs text-blue-100">متاح الآن</span>
            </div>
          </div>
          <button @click="toggleChat" class="hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200 relative z-10">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-3">
          <!-- Welcome Message -->
          <div class="flex items-start gap-2 opacity-0 animate-fade-in">
            <div class="w-7 h-7 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)]  rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"/>
              </svg>
            </div>
            <div class="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
              <p class="text-sm text-gray-700 leading-relaxed">مرحباً! كيف يمكنني مساعدتك اليوم؟</p>
              <span class="text-xs text-gray-400 mt-1 block">الآن</span>
            </div>
          </div>

          <!-- Messages -->
          <template v-for="message in messages" :key="message.id">
            <!-- Bot Message -->
            <div v-if="message.sender === 'bot'" class="flex items-start gap-2">
                <div class="w-7 h-7 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"/></svg>
                </div>
                <div class="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
                    <p class="text-sm text-gray-700 leading-relaxed">{{ message.text }}</p>
                    <span class="text-xs text-gray-400 mt-1 block">{{ message.timestamp }}</span>
                </div>
            </div>
            <!-- User Message -->
            <div v-else class="flex items-start gap-2 justify-end">
                <div class="bg-[var(--color-primary)] text-white p-3 rounded-2xl rounded-br-md shadow-sm max-w-[85%]">
                    <p class="text-sm leading-relaxed">{{ message.text }}</p>
                    <span class="text-xs text-blue-100 mt-1 block">{{ message.timestamp }}</span>
                </div>
            </div>
          </template>


            <!-- Suggestion Buttons -->
            <div v-if="messages.length === 0" class="flex flex-wrap justify-center gap-2 pt-2 animate-fade-in" style="animation-delay: 0.5s">
                <button @click="selectSuggestion('اقترح علي كتاب')" class="suggestion-btn">
                اقترح علي كتاب
                </button>
                <button @click="selectSuggestion('ساعدني في ايجاد كتاب')" class="suggestion-btn">
                ساعدني في ايجاد كتاب
                </button>
                <button @click="selectSuggestion('اريد كتاب مشابه')" class="suggestion-btn">
                اريد كتاب مشابه
                </button>
            </div>
        </div>

        <!-- Input Area -->
        <div class="p-3 bg-white border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="flex-1 relative">
              <input
                v-model="userMessage"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="اكتب رسالتك..."
                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-light)] focus:border-[var(--color-primary)] transition-all duration-200 pr-10"
                style="direction: rtl;"
              />
              <button class="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                </svg>
              </button>
            </div>
            <button @click="sendMessage" class="w-8 h-8 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] text-white rounded-full flex items-center justify-center hover:from-[var(--color-primary)] hover:to-[var(--color-hover)] transition-all duration-200 hover:scale-105 shadow-sm">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Chat Bubble -->
    <div class="relative">
      <!-- Pulse Effect -->
      <div v-if="!isOpen" class="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full animate-ping opacity-20"></div>

      <!-- Main Button -->
      <button
        @click="toggleChat"
        class="relative w-14 h-14 bg-gradient-to-r from-[var(--color-light)] to-[var(--color-hover)] rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 hover:from-[var(--color-primary)] hover:to-[var(--color-hover)] group"
      >
        <!-- Button Background Effect -->
        <div class="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <!-- Icon with Rotation -->
        <Transition name="icon" mode="out-in">
          <svg v-if="!isOpen" class="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <svg v-else class="h-5 w-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </Transition>

        <!-- Notification Badge -->
        <span v-if="!isOpen" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-bounce">1</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isOpen = ref(false)
const userMessage = ref('')
const messages = ref([])


const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const selectSuggestion = (suggestion) => {
  userMessage.value = suggestion;
  sendMessage();
}

const sendMessage = () => {
  const messageText = userMessage.value.trim();
  if (messageText === '') return;

  messages.value.push({
    id: Date.now(),
    text: messageText,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  let botResponse = 'شكرًا لرسالتك. كيف يمكنني المساعدة؟';

  switch (messageText) {
    case 'اقترح علي كتاب':
      botResponse = 'بالتأكيد! لمساعدتي في اقتراح كتاب يعجبك، هل يمكنك إخباري عن نوع الكتب التي تفضلها عادةً؟ (مثلًا: خيال علمي، تاريخ، روايات رومانسية)';
      break;
    case 'ساعدني في ايجاد كتاب':
      botResponse = 'يسعدني مساعدتك. هل تعرف اسم الكتاب أو المؤلف؟ أو هل لديك أي تفاصيل أخرى مثل دار النشر أو سنة الإصدار؟';
      break;
    case 'اريد كتاب مشابه':
      botResponse = 'فكرة رائعة! ما هو الكتاب الذي قرأته وأعجبك وتريد كتابًا آخر يشبهه؟';
      break;
  }
  
  userMessage.value = '';

  setTimeout(() => {
    messages.value.push({
      id: Date.now() + 1,
      text: botResponse,
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }, 1000);
}
</script>

<style scoped>
/* Chat Window Animations */
.chat-window-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.chat-window-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.chat-window-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9) rotateX(-10deg);
  filter: blur(4px);
}
.chat-window-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* Icon Transition */
.icon-enter-active,
.icon-leave-active {
  transition: all 0.3s ease;
}
.icon-enter-from {
  opacity: 0;
  transform: rotate(180deg) scale(0.5);
}
.icon-leave-to {
  opacity: 0;
  transform: rotate(-180deg) scale(0.5);
}

/* Fade In Animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease forwards;
  animation-delay: 0.3s;
}

/* Pulse Animation */
@keyframes ping {
  75%, 100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Bounce Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8,0,1,1);
  }
  50% {
    transform: none;
    animation-timing-function: cubic-bezier(0,0,0.2,1);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

/* Scrollbar Styling */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Suggestion Buttons */
.suggestion-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #f0f4f8;
  color: #334155;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.suggestion-btn:hover {
  background-color: #e2e8f0;
  border-color: #cbd5e1;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.suggestion-btn:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
