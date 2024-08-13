<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import ConfirmModal from "@/components/confirmModal.vue";
import $ from "jquery";

const router = useRouter();
const password = ref('123456789'); // Правильный пароль
const password_input = ref(''); // Введенный пользователем пароль
const showModal = ref(false); // Для отображения модального окна

function checkPassword(routeName) {
  if (password_input.value === password.value) {
    router.replace({ name: routeName }); // Переход на нужную страницу
  } else {
    showModal.value = true; // Показываем модальное окно при неправильном пароле
  }
}

$('body').attr('data-bs-theme', 'dark');

function showWarning() {
  alert('Кыш'); // Дополнительное предупреждение
}
</script>

<template>
  <confirm-modal v-if="showModal" title="Тебе сюда нельзя. Пароль не подошёл" msg="=("
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
          <div class="d-flex gap-2">
            <button @click="checkPassword('home')" type="submit" class="btn flex-grow-1 btn-outline-primary">XML Tool</button>
            <button @click="checkPassword('search')" type="button" class="btn flex-grow-1 btn-outline-primary">ISRC Search</button>
          </div>
        </div>
      </div>
      <div class="fixed-bottom">
        <p>last update: 13.08.2024</p>
        </div>
    </main>
  </form>
</template>

<style scoped>
/* Добавь стили при необходимости */
</style>