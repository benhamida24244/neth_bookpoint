<template>
  <div class="fixed bottom-6 right-6 z-75">
    <!-- Chat Window -->
    <Transition name="chat-window">
      <div v-if="isOpen" class="w-[320px] h-[450px] bg-white rounded-xl shadow-xl border border-gray-100 flex flex-col overflow-hidden absolute bottom-[70px] right-0 backdrop-blur-sm">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3 flex flex-col relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)]"></div>
          <div class="flex justify-between items-center relative z-10">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <i v-if="chatMode === 'smart'" class="fas fa-robot text-white"></i>
                <i v-else class="fas fa-user text-white"></i>
              </div>
              <div>
                <h3 class="text-sm font-semibold">{{ chatMode === 'smart' ? 'المساعد الذكي' : 'المساعد البشري' }}</h3>
                <span class="text-xs text-blue-100">متاح الآن</span>
              </div>
            </div>
            <button @click="toggleChat" class="hover:bg-white/10 p-1.5 rounded-lg transition-all duration-200 relative z-10">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex mt-2 relative z-10 rounded-md bg-black/20 p-1 text-sm">
            <button @click="chatMode = 'smart'" :class="['flex-1 text-center px-2 py-1 rounded-md transition-all', { 'bg-white/20 text-white': chatMode === 'smart' }]">
              المساعد الذكي
            </button>
            <button @click="chatMode = 'human'" :class="['flex-1 text-center px-2 py-1 rounded-md transition-all', { 'bg-white/20 text-white': chatMode === 'human' }]">
              المساعد البشري
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white space-y-3">
          <!-- Messages -->
         <template v-for="message in messages" :key="message.id">
            <!-- Bot Message -->
            <div v-if="message.sender === 'bot'" class="flex flex-col gap-3">
                <!-- لو فيه كتب -->
                <div v-if="message.books" class="animate-fade-in">
                <!-- رسالة البوت -->
                <div class="flex items-start gap-2">
                    <div class="w-7 h-7 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <i v-if="chatMode === 'smart'" class="fas fa-robot text-white"></i>
                      <i v-else class="fas fa-user text-white"></i>
                    </div>
                    <div class="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
                    <p class="text-sm text-gray-700 leading-relaxed">{{ message.text }}</p>
                    </div>
                </div>

                <!-- عرض الكتب -->
                <div class="mt-2">
                    <div class="grid grid-cols-1 gap-3">
                    <div v-for="(book, index) in message.books" :key="book.id" class="flex gap-3 p-3 bg-white border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                        <img :src="`${apiBaseUrl}${book.cover}`" alt="cover" class="w-16 h-24 object-cover rounded-md shadow" />
                        <div class="flex flex-col justify-between">
                        <div>
                            <h4 class="text-sm font-semibold text-gray-800 line-clamp-2">{{ book.title }}</h4>
                            <div class="mt-2 flex gap-2">
                            <a :href="book.link"  target="_blank" rel="noopener noreferrer" class="inline-block px-3 py-1 text-xs bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)] text-white rounded-md hover:scale-105 transition transform">
                                عرض الكتاب
                            </a>
                            <button @click="selectSuggestion(`أريد كتاباً مشابهاً لكتاب ${book.title}`)" class="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition">
                                مشابه
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <!-- لو مافيه كتب -->
                <div v-else class="flex items-start gap-2">
                <div class="w-7 h-7 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i v-if="chatMode === 'smart'" class="fas fa-robot text-white"></i>
                    <i v-else class="fas fa-user text-white"></i>
                </div>
                <div class="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 max-w-[85%]">
                    <p class="text-sm text-gray-700 leading-relaxed">{{ message.text }}</p>
                    <span class="text-xs text-gray-400 mt-1 block">{{ message.timestamp }}</span>
                </div>
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

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex items-start gap-2 animate-fade-in">
                <div class="w-7 h-7 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-hover)] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i v-if="chatMode === 'smart'" class="fas fa-robot text-white"></i>
                    <i v-else class="fas fa-user text-white"></i>
                </div>
                <div class="bg-white p-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100">
                    <div class="flex items-center space-x-1">
                        <span class="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style="animation-delay: 0s;"></span>
                        <span class="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style="animation-delay: 0.2s;"></span>
                        <span class="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style="animation-delay: 0.4s;"></span>
                    </div>
                </div>
            </div>


            <!-- Suggestion Buttons -->
            <div v-if="messages.length === 0" class="flex flex-wrap justify-center gap-2 pt-2 animate-fade-in" style="animation-delay: 0.5s">
                <button @click="handleInitialSuggestion('اقترح علي كتاب')" class="suggestion-btn">
                اقترح علي كتاب
                </button>
                <button @click="handleInitialSuggestion('ساعدني في ايجاد كتاب')" class="suggestion-btn">
                ساعدني في ايجاد كتاب
                </button>
                <button @click="handleInitialSuggestion('اريد كتاب مشابه')" class="suggestion-btn">
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
import apiService from '../../services/api.js'

const isOpen = ref(false)
const userMessage = ref('')
const messages = ref([])
const conversationId = ref(null)
const isTyping = ref(false)
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const chatMode = ref('smart') // 'smart' or 'human'

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const handleInitialSuggestion = (suggestion) => {
  userMessage.value = suggestion;
  sendMessage();
}

const selectSuggestion = (suggestion) => {
  userMessage.value = suggestion;
  sendMessage();
}

const sendMessage = async () => {
  const messageText = userMessage.value.trim();
  if (!messageText) return;

  messages.value.push({
    id: Date.now(),
    text: messageText,
    sender: 'user',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  userMessage.value = '';
  isTyping.value = true;

  // Check if it's the first user message in this session
  const isFirstUserMessage = messages.value.filter(m => m.sender === 'user').length === 1;

  if (isFirstUserMessage) {
    // On first message, show a canned welcome response after a delay
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        text: chatMode.value === 'smart' ? 'مرحبا كيف يمكنني مساعدتك' : 'مرحباً بك، سيقوم أحد ممثلي خدمة العملاء بالرد عليك قريباً.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      isTyping.value = false;
    }, 1500);
  } else if (chatMode.value === 'human') {
    // In human mode, just show a waiting message.
    isTyping.value = false; // Or maybe a different indicator for human chat
  } else {
    // For subsequent messages, call the actual API
    try {
      if (!conversationId.value) {
        const response = await apiService.publicResources.chat.start();
        conversationId.value = response.data.conversation_id;
      }

      const response = await apiService.publicResources.chat.reply({
        conversation_id: conversationId.value,
        message: messageText
      });

      const botMessage = response.data.message;

      if (botMessage.type === 'books' || botMessage.data?.books) {
        const text = botMessage.data?.text || botMessage.text || "وجدت لك كتب:";
        const books = botMessage.data?.books || botMessage.books || [];
        messages.value.push({
          id: Date.now() + 1,
          type: 'books',
          text: text,
          books: books,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else {
        messages.value.push({
          id: Date.now() + 1,
          type: 'text',
          text: botMessage.data || botMessage.text || "عذراً، لم أتمكن من العثور على نتيجة.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (error) {
      console.error('❌ Error sending message:', error);
      messages.value.push({
        id: Date.now() + 1,
        type: 'text',
        text: 'عذراً، لم أتمكن من معالجة رسالتك. يرجى المحاولة مرة أخرى.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } finally {
      isTyping.value = false;
    }
  }
};
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