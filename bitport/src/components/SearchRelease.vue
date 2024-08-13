<template>
  <div class="d-flex flex-column align-items-center gap-3 mt-5">
    <div class="input-group w-50" >
      <input v-model="isrcCode" placeholder="Введите ISRC" class="form-control"/>
      <button @click="searchISRC" class="btn btn-primary">Поиск</button>
    </div>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Загрузка..</span>
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="noResults" class="alert alert-danger">Релиз не найден, возможно, этого трека нет на стримингах</div>

    <div v-if="searchResults.length > 0" class="w-75">
      <h3 class="text-center">Результаты:</h3>
      <ul class="list-group">
        <li v-for="track in searchResults" :key="track.id" class="list-group-item d-flex justify-content-between align-items-center">
          <img :src="track.album.images[0]?.url" alt="Album Cover" class="img-thumbnail me-3" style="width: 100px; height: 100px;" />
          <div>
            <strong>{{ track.name }}</strong> by {{ track.artists.map(artist => artist.name).join(', ') }}
          </div>
          <a :href="track.external_urls.spotify" target="_blank" class="btn btn-outline-secondary">Открыть в Spotify</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import $ from "jquery";

const clientId = 'a0852e046c8d4e58ba1ad10709edc541';
const clientSecret = 'f96c770a979b40b7b74c8e13afa7a9f1';

const isrcCode = ref('');
const searchResults = ref([]);
const loading = ref(false);
const error = ref('');
const noResults = ref(false);

//функция для получения токена к api
async function getSpotifyToken() {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', { // отправляем запрос
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials' // тип запроса
        });

        if (!response.ok) {
            throw new Error('Не удалось получить токен');
        }

        const data = await response.json();
        return data.access_token;
    } catch (err) {
        error.value = `Ошибка получения токена: ${err.message}`;
        console.error(err);
        throw err;
    }
}

async function searchByISRC(isrcCode, token) {
    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=isrc:${isrcCode}&type=track`, { //отправляем запросик
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка поиска по ISRC');
        }

        const data = await response.json();
        return data.tracks.items;
    } catch (err) {
        error.value = `Ошибка поиска по ISRC: ${err.message}`;
        console.error(err);
        throw err;
    }
}

async function searchISRC() {
    loading.value = true;
    error.value = '';
    noResults.value = false;
    searchResults.value = [];

    try {
        const token = await getSpotifyToken();
        searchResults.value = await searchByISRC(isrcCode.value, token);

        if (searchResults.value.length === 0) {
            noResults.value = true;
        }
    } catch (err) {
        // Ошибка уже установлена в функциях поиска
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    $('body').attr('data-bs-theme', 'dark');
});
</script>

<style scoped>
.mt-5 {
  margin-top: 3rem;
}

.w-50 {
  width: 50%;
}

.w-75 {
  width: 75%;
}

.text-center {
  text-align: center;
}

.img-thumbnail {
  object-fit: cover;
}
</style>