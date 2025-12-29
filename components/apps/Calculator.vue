<template>
  <AppWindow 
    :title="'Calculatrice'"
    :is-open="isOpen"
    :initial-x="200"
    :initial-y="150"
    @close="$emit('close')"
  >
    <div class="calculator-content">
      <div class="calculator-display">
        <div class="calculator-history">{{ history }}</div>
        <div class="calculator-result">{{ display }}</div>
      </div>
      <div class="calculator-buttons">
        <button class="calc-btn function" @click="clear">C</button>
        <button class="calc-btn function" @click="clearEntry">CE</button>
        <button class="calc-btn function" @click="backspace">⌫</button>
        <button class="calc-btn operator" @click="setOperator('/')">÷</button>
        
        <button class="calc-btn number" @click="inputNumber('7')">7</button>
        <button class="calc-btn number" @click="inputNumber('8')">8</button>
        <button class="calc-btn number" @click="inputNumber('9')">9</button>
        <button class="calc-btn operator" @click="setOperator('*')">×</button>
        
        <button class="calc-btn number" @click="inputNumber('4')">4</button>
        <button class="calc-btn number" @click="inputNumber('5')">5</button>
        <button class="calc-btn number" @click="inputNumber('6')">6</button>
        <button class="calc-btn operator" @click="setOperator('-')">−</button>
        
        <button class="calc-btn number" @click="inputNumber('1')">1</button>
        <button class="calc-btn number" @click="inputNumber('2')">2</button>
        <button class="calc-btn number" @click="inputNumber('3')">3</button>
        <button class="calc-btn operator" @click="setOperator('+')">+</button>
        
        <button class="calc-btn number zero" @click="inputNumber('0')">0</button>
        <button class="calc-btn number" @click="inputNumber('.')">.</button>
        <button class="calc-btn equals" @click="calculate">=</button>
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

const display = ref('0')
const history = ref('')
const currentValue = ref(0)
const previousValue = ref(0)
const operator = ref<string | null>(null)
const waitingForNewValue = ref(false)

const inputNumber = (num: string) => {
  if (waitingForNewValue.value) {
    display.value = num
    waitingForNewValue.value = false
  } else {
    display.value = display.value === '0' ? num : display.value + num
  }
}

const setOperator = (op: string) => {
  if (operator.value && !waitingForNewValue.value) {
    calculate()
  }
  previousValue.value = parseFloat(display.value)
  operator.value = op
  waitingForNewValue.value = true
  history.value = `${display.value} ${op}`
}

const calculate = () => {
  if (!operator.value) return
  
  currentValue.value = parseFloat(display.value)
  let result = 0
  
  switch (operator.value) {
    case '+':
      result = previousValue.value + currentValue.value
      break
    case '-':
      result = previousValue.value - currentValue.value
      break
    case '*':
      result = previousValue.value * currentValue.value
      break
    case '/':
      result = previousValue.value / currentValue.value
      break
  }
  
  display.value = result.toString()
  history.value = `${previousValue.value} ${operator.value} ${currentValue.value} =`
  operator.value = null
  waitingForNewValue.value = true
}

const clear = () => {
  display.value = '0'
  history.value = ''
  currentValue.value = 0
  previousValue.value = 0
  operator.value = null
  waitingForNewValue.value = false
}

const clearEntry = () => {
  display.value = '0'
}

const backspace = () => {
  if (display.value.length > 1) {
    display.value = display.value.slice(0, -1)
  } else {
    display.value = '0'
  }
}
</script>

<style scoped>
.calculator-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
}

.calculator-display {
  padding: 20px;
  background: #000;
  text-align: right;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.calculator-history {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 10px;
  min-height: 20px;
}

.calculator-result {
  font-size: 48px;
  color: white;
  font-weight: 300;
  word-break: break-all;
}

.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  flex: 1;
  background: #333;
}

.calc-btn {
  background: #2e2e2e;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: background 0.2s;
  font-weight: 300;
}

.calc-btn:hover {
  background: #3e3e3e;
}

.calc-btn:active {
  background: #4e4e4e;
}

.calc-btn.number {
  background: #252525;
}

.calc-btn.operator {
  background: #ff9500;
  color: white;
}

.calc-btn.operator:hover {
  background: #ffaa33;
}

.calc-btn.function {
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.8);
  font-size: 18px;
}

.calc-btn.equals {
  background: #ff9500;
  color: white;
}

.calc-btn.zero {
  grid-column: span 2;
}
</style>

