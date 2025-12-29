<template>
  <div class="login-container">
    <div id="user-info" class="fade-in">
      <div class="avatar-circle">
        <img src="/files/image-2ce6dbd2-3849-4bee-b436-50efd717a9e0.png" alt="Avatar Utilisateur">
      </div>
      
      <p class="username">Ishola Hasrafidine</p>
      <p class="username">Abdel-Lamine</p>
      
      <form id="login-form" @submit.prevent="handleSubmit">
        <div class="password-group">
          <input 
            type="password" 
            id="passworder" 
            v-model="password"
            placeholder="Mot de passe" 
            :class="{ shake: hasError }"
          >
        </div>
      </form>
      
      <p id="error-message" class="error-text" :style="{ opacity: hasError ? 1 : 0 }">
        Code incorrect. Le code est : azerty
      </p>
    </div>

    <div v-if="password!=''" class="bottom-actions">
      <button class="action-btn" @click="resetPassword()"><i class="bi bi-x-circle"></i></button>
      <br>
      <small>Annuler</small>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
})

const password = ref('')
const hasError = ref(false)
const correctPassword = 'azerty'

const handleSubmit = () => {
  if (password.value.trim() === correctPassword) {
    resetPassword()
    navigateTo('/home')
  } else {
    hasError.value = true
    password.value = ''
    setTimeout(() => {
      hasError.value = false
    }, 3000)
  }
}

const resetPassword = () => {
  password.value = ''
}

</script>

<style>
:root {
  --text-color: white;
  --background-color: #333;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background-image: url('/files/bg.jpg');
  background-size: cover;
  background-position: center;
}

.login-container {
  text-align: center;
  color: var(--text-color);
  background-position: center;
  justify-content: center;
  align-items: center;
}

.fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards 0.5s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.avatar-circle img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.username {
  font-size: 24px;
  font-weight: 500;
  margin: 10px 0 5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
}

.password-group {
  display: flex;
  align-items: center;
  width: 180px;
  margin: 20px auto 10px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
  border-radius: 30px;
}

#passworder {
  flex-grow: 1;
  padding: 10px 15px;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 13px;
  outline: none;
  box-shadow: none;
}

#passworder::placeholder {
  color: rgba(255, 255, 255, 0.286);
}

.error-text {
  color: #ffffffa4;
  font-size: 14px;
  margin-top: 5px;
  transition: opacity 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
}

.bottom-actions {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.action-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffffa6;
  border: none;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 31px;
  width: 48px;
  height: 48px;
  margin-bottom: 5px;
  transition: background 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
}

.shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}
</style>

