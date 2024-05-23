<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import ConfirmModal from "@/components/confirmModal.vue";

const router = useRouter()
const password = ref('123456789')
const password_input = ref('')

const showModal = ref(false)

function checkPassword() {
  if (password_input.value === password.value) {
    router.push({name: 'home'})
  } else {
    showModal.value = true
    //new Audio('/src/assets/audio.wav').play()
  }
}

function showWarning() {
  alert('Тебе точно ебало набьют')
}
</script>

<template>
  <confirm-modal v-if="showModal" title="Пошёл нахуй, понял?" msg="Пизды получишь если ещё раз сюда зайдешь"
                 @confirm="showModal = false" @dismiss="showWarning"/>
  <form @submit.prevent>
    <main class="d-flex" style="height: 100vh; width: 100vw">
      <div class="card m-auto">
        <div class="card-body">
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" class="form-control" v-model="password_input" id="password"/>
          </div>
        </div>
        <div class="card-footer py-3">
          <button @click="checkPassword" type="submit" class="btn w-100 btn-primary">Войти глубже...</button>
        </div>
      </div>
    </main>
  </form>
</template>

<style scoped>

</style>