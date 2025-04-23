<script setup lang="ts">
import { ref } from 'vue'
import { chat } from '@/scripts/chat-handlers'
import MarkdownIt from 'markdown-it'

const chatbotVisible = ref(false)
const chatbotMessages = ref([
  { sender: 'bot', text: 'Hello! How can I assist you today?' },
])
const userMessage = ref('')
const thinkingDots = ref('')
const isThinking = ref(false)
const md = new MarkdownIt()

function toggleChatbot() {
  chatbotVisible.value = !chatbotVisible.value
}

const sendMessage = () => {
  const trimmedMessage = userMessage.value.trim()

  if (trimmedMessage) {
    chatbotMessages.value.push({ sender: 'user', text: trimmedMessage })
    chatbotMessages.value.push({ sender: 'bot', text: 'Thinking' })
    const lastIndex = chatbotMessages.value.length - 1
    isThinking.value = true
    chat(trimmedMessage).then((response) => {
      chatbotMessages.value[lastIndex] = {
        sender: 'bot',
        text:
          md.render(response.explanation) || "I don't have an answer for that.",
      }
      isThinking.value = false
      thinkingDots.value = ''
    })
    userMessage.value = ''
  }
}

onMounted(() => {
  setInterval(() => {
    if (isThinking.value) {
      if (thinkingDots.value.length < 3) {
        thinkingDots.value += '.'
      } else {
        thinkingDots.value = ''
      }
      const lastIndex = chatbotMessages.value.length - 1
      if (chatbotMessages.value[lastIndex].text === 'Thinking') {
        chatbotMessages.value[lastIndex].text = 'Thinking' + thinkingDots.value
      } else if (chatbotMessages.value[lastIndex].text.startsWith('Thinking')) {
        chatbotMessages.value[lastIndex].text = 'Thinking' + thinkingDots.value
      }
    }
  }, 500)
})
</script>

<template>
  <div>
    <!-- Chatbot Toggle Button -->
    <v-btn icon class="chatbot-toggle" color="primary" @click="toggleChatbot">
      <v-icon>mdi-chat</v-icon>
    </v-btn>

    <!-- Chatbot UI -->
    <v-card v-if="chatbotVisible" class="chatbot-ui" elevation="10">
      <v-card-title class="d-flex justify-space-between">
        Chatbot
        <v-btn icon @click="toggleChatbot">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="chatbot-messages">
        <div
          v-for="(message, index) in chatbotMessages"
          :key="index"
          :class="['chat-message', message.sender]"
          v-html="message.text"
        />
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-text-field
          v-model="userMessage"
          placeholder="Type a message..."
          dense
          hide-details
          class="flex-grow-1"
          @keydown.enter="sendMessage"
        />
        <v-btn icon color="primary" @click="sendMessage">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.chatbot-toggle {
  position: fixed;
  bottom: 40px;
  right: 16px;
  z-index: 1000;
}

.chatbot-ui {
  position: fixed;
  bottom: 80px;
  right: 16px;
  width: 600px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.chatbot-messages {
  overflow-y: auto;
  flex-grow: 1;
  max-height: 300px;
}

.chat-message {
  margin: 8px 0;
}

.chat-message.bot {
  text-align: left;
  color: blue;
}

.chat-message.user {
  text-align: right;
  color: green;
}
</style>
