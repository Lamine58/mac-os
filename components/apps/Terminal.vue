<template>
  <AppWindow 
    :title="'Terminal'"
    :is-open="isOpen"
    :initial-x="100"
    :initial-y="100"
    @close="$emit('close')"
  >
    <div class="terminal-content">
      <div class="terminal-header">
        <span class="terminal-user">hasrafidine@macbook</span>
        <span class="terminal-path">~</span>
        <span class="terminal-prompt">$</span>
      </div>
      <div class="terminal-output" ref="outputRef">
        <div 
          v-for="(line, index) in output" 
          :key="index"
          class="terminal-line"
        >
          <span v-if="line.type === 'command'" class="terminal-prompt-line">
            <span class="prompt">hasrafidine@macbook:~$</span> {{ line.text }}
          </span>
          <span v-else class="terminal-response">{{ line.text }}</span>
        </div>
        <div class="terminal-input-line">
          <span class="prompt">hasrafidine@macbook:~$</span>
          <input 
            type="text" 
            v-model="currentCommand"
            @keydown.enter="executeCommand"
            @keyup.enter="executeCommand"
            class="terminal-input"
            ref="inputRef"
            autofocus
          >
        </div>
      </div>
    </div>
  </AppWindow>
</template>

<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const currentCommand = ref('')
const output = ref<Array<{ type: 'command' | 'response', text: string }>>([
  { type: 'response', text: 'Bienvenue dans le Terminal. Tapez "help" pour voir les commandes disponibles.' }
])
const outputRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const currentPath = ref('~')

const executeCommand = () => {
  if (!currentCommand.value.trim()) return
  
  const cmd = currentCommand.value.trim()
  const parts = cmd.split(' ')
  const command = parts[0].toLowerCase()
  const args = parts.slice(1)
  
  output.value.push({ type: 'command', text: cmd })
  
  // Gérer la commande clear
  if (command === 'clear') {
    output.value = []
    currentCommand.value = ''
    return
  }
  
  // Gérer les commandes
  let result = ''
  
  switch (command) {
    case 'ls':
      result = executeLs(args)
      break
    case 'pwd':
      result = executePwd()
      break
    case 'echo':
      result = executeEcho(args)
      break
    case 'cd':
      result = executeCd(args)
      break
    case 'whoami':
      result = 'hasrafidine'
      break
    case 'date':
      result = new Date().toLocaleString('fr-FR')
      break
    case 'help':
      result = `Commandes disponibles:
  ls          - Liste les fichiers
  pwd         - Affiche le répertoire courant
  echo        - Affiche un message
  cd          - Change de répertoire
  whoami      - Affiche le nom d'utilisateur
  date        - Affiche la date et l'heure
  clear       - Efface l'écran
  help        - Affiche cette aide`
      break
    default:
      result = 'commande non reconnue'
  }
  
  if (result) {
    output.value.push({ type: 'response', text: result })
  }
  
  currentCommand.value = ''
  
  nextTick(() => {
    if (outputRef.value) {
      outputRef.value.scrollTop = outputRef.value.scrollHeight
    }
    if (inputRef.value) {
      inputRef.value.focus()
    }
  })
}

const executeLs = (args: string[]): string => {
  const files = [
    'Desktop',
    'Documents',
    'Downloads',
    'Pictures',
    'Music',
    'Videos'
  ]
  return files.join('  ')
}

const executePwd = (): string => {
  return currentPath.value
}

const executeEcho = (args: string[]): string => {
  return args.join(' ')
}

const executeCd = (args: string[]): string => {
  if (args.length === 0 || args[0] === '~') {
    currentPath.value = '~'
    return ''
  }
  if (args[0] === '..') {
    currentPath.value = '~'
    return ''
  }
  currentPath.value = `~/${args[0]}`
  return ''
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
      if (outputRef.value) {
        outputRef.value.scrollTop = outputRef.value.scrollHeight
      }
    })
  }
})

onMounted(() => {
  if (props.isOpen) {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.terminal-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
}

.terminal-header {
  padding: 10px 15px;
  background: #2e2e2e;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}

.terminal-output {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  color: #00ff00;
}

.terminal-line {
  margin-bottom: 5px;
  line-height: 1.5;
}

.terminal-prompt-line {
  color: #00ff00;
}

.prompt {
  color: #00ff00;
  margin-right: 8px;
}

.terminal-response {
  color: rgba(255, 255, 255, 0.9);
  white-space: pre-wrap;
}

.terminal-input-line {
  display: flex;
  align-items: center;
}

.terminal-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #00ff00;
  font-family: inherit;
  font-size: inherit;
  outline: none;
  caret-color: #00ff00;
}
</style>
