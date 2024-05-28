<script setup>
import {ref} from "vue";
import {useRouter} from "vue-router";
import ConfirmModal from "@/components/confirmModal.vue";
import $ from "jquery";

const router = useRouter()
const password = ref('123456789')
const password_input = ref('')

const showModal = ref(false)

function checkPassword() {
  if (password_input.value === password.value) {
    router.replace({name: 'home'}) // push me
  } else {
    showModal.value = true
  }
}

$('body').attr('data-bs-theme', 'dark')

function showWarning() {
  alert('Видимо не понял....')
}
</script>

<template>
  <confirm-modal v-if="showModal" title="Слышь, тебе сюда нельзя, понял?" msg="=("
                 @confirm="showModal = false" @dismiss="showWarning"/>
  <form @submit.prevent>
    <main class="d-flex" style="height: 100vh; width: 100vw">
      <div class="card m-auto">
        <div class="card-body">
          <div class="form-group">
            <label for="password">Пароль</label>
            <input type="password" class="form-control" v-model="password_input" id="password"/>
          </div>
        </div>
        <div class="card-footer py-3">
          <button @click="checkPassword" type="submit" class="btn w-100 btn-primary">Зайти</button>
        </div>
      </div>
    </main>
  </form>
</template>

<style scoped>

</style>