<script setup>
import $ from 'jquery'
import { onMounted, ref, watch } from "vue";

const data_to_export = ref({
  aggregatorName: 'ONErpm',
  labelName: '',
  UPC_EAN: -1,
  catalogNumber: -1,
  coverArtFilename: '',
  releaseTitle: ' (Original Mix)',
  releaseSalesType: 'release',
  tracks: [],
  albumaction: 'insert'
});

// Наблюдатель за изменениями labelName
watch(() => data_to_export.value.labelName, () => {
  updateTrackFields();
});

function updateTrackFields() {
  data_to_export.value.tracks.forEach(track => {
    track.trackCopyright = data_to_export.value.labelName;
    track.trackPublisher = data_to_export.value.labelName;
  });
}


function addTrack() {
  const lastTrack = data_to_export.value.tracks[data_to_export.value.tracks.length - 1];
  data_to_export.value.tracks.push({
    albumOnly: 0,
    trackNumber: data_to_export.value.tracks.length + 1,
    trackTitle: '',
    trackPublisher: data_to_export.value.labelName,
    trackMixVersion: lastTrack ? lastTrack.trackMixVersion : 'Original Mix',
    originalReleaseDate: lastTrack ? lastTrack.originalReleaseDate : '',
    exclusivePeriod: 0,
    trackArtists: [
      { artistName: '' }
    ],
    trackRemixers: [],
    audioFilename: '',
    country: lastTrack ? lastTrack.country : 'WW',
    trackGenre: lastTrack ? lastTrack.trackGenre : '',
    trackCopyright: data_to_export.value.labelName,
    songwriters: [
      { name: '', type: 'author' }
    ]
  });
  updateIndexes();
}

const form = ref();

function updateIndexes() {
  for (let i = 0; i < data_to_export.value.tracks.length; i++) {
    data_to_export.value.tracks[i].trackNumber = i + 1;
    data_to_export.value.tracks[i].audioFilename =
      `${data_to_export.value.UPC_EAN}_${data_to_export.value.tracks[i].trackNumber}.flac`;
  }
}

function exportXML() {
  if (form.value.checkValidity()) {
    $.ajax({
      type: 'POST',
      url: 'http://5.42.77.123:8000/export/',
      headers: { 'Content-Type': 'application/json' },
      dataType: 'binary',
      xhrFields: {
        'responseType': 'blob'
      },
      data: JSON.stringify(data_to_export.value),
      success: function (data, status, xhr) {
        let blob = new Blob([data], { type: xhr.getResponseHeader('Content-Type') });
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${data_to_export.value.UPC_EAN}.xml`;
        link.click();
      },
      error: function (response) {
        console.log(response);
      }
    });
  } else {
    form.value.reportValidity();
  }
}

function setUPC() {
  data_to_export.value.catalogNumber = data_to_export.value.UPC_EAN;
  data_to_export.value.coverArtFilename = data_to_export.value.UPC_EAN + '.png';
  for (let i = 0; i < data_to_export.value.tracks.length; i++) {
    data_to_export.value.tracks[i].audioFilename =
      `${data_to_export.value.UPC_EAN}_${data_to_export.value.tracks[i].trackNumber}.flac`;
  }
}

function setRemixers() {
  if (data_to_export.value.tracks.length === 1) {
    data_to_export.value.releaseTitle = ` (${data_to_export.value.tracks[0].trackMixVersion})`;
  }
}

onMounted(() => {
  $('body').attr('data-bs-theme', 'dark');
  addTrack();
});
</script>

<template>
  <a class="btn btn-lg ms-4 position-fixed end-0 rounded-pill m-4 bottom-0 btn-primary"
     @click="addTrack">Add Track
  </a>
  <main class="container p-4">
    <form ref="form" class="d-flex flex-column gap-4" @submit.prevent>
      <div class="hstack gap-4 mx-auto">
        <span class="fs-4">Main Data</span>
      </div>

      <div class="input-group w-25">
        <label class="input-group-text" for="albumaction">Type</label>
        <select class="form-select" id="albumaction" v-model="data_to_export.albumaction">
          <option value="insert">Insert</option>
          <option value="delete">Delete</option>
        </select>
      </div>


      <section class="d-flex flex-column gap-2">
        <div class="row g-2">
          <div class="col-3">
            <div class="input-group">
              <label class="input-group-text" for="aggregatorName">Aggregator Name</label>
              <input maxlength="24" class="form-control" id="aggregatorName" type="text"
                     placeholder="" required
                     v-model="data_to_export.aggregatorName"/>

            </div>
          </div>
          <div class="col-7">
            <div class="input-group">
              <label class="input-group-text" for="labelName">Label Name</label>
              <input class="form-control" placeholder="" required
                     name="labelName" id="labelName" type="text" v-model="data_to_export.labelName"/>

            </div>
          </div>
          <div class="col">
            <div class="input-group">
              <label class="input-group-text" for="UPC_EAN">UPC/EAN</label>
              <input @change="setUPC" placeholder="" required
                     class="form-control" id="UPC_EAN" type="number" v-model="data_to_export.UPC_EAN"/>

            </div>
          </div>

        </div>
        <div class="row g-2">
          <div class="col">
            <div class="input-group">
              <label class="input-group-text" for="catalogNumber">Catalog Number</label>
              <input placeholder="" class="form-control" required
                     id="catalogNumber" type="number" v-model="data_to_export.catalogNumber"/>
            </div>
          </div>
          <div class="col">
            <div class="input-group">
              <label class="input-group-text" for="coverArtFilename">Cover Art Filename</label>
              <input class="form-control" placeholder="" required
                     id="coverArtFilename" type="text" v-model="data_to_export.coverArtFilename"/>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group">
              <label class="input-group-text" for="releaseTitle">Release Title</label>
              <input class="form-control" placeholder="" required
                     id="releaseTitle" type="text" v-model="data_to_export.releaseTitle"/>
            </div>
          </div>
          <div class="col-3">
            <div class="input-group">
              <label class="input-group-text" for="releaseSalesType">Release Sales Type</label>
              <input class="form-control" placeholder="" required
                     id="releaseSalesType" type="text" v-model="data_to_export.releaseSalesType"/>
            </div>
          </div>
        </div>
      </section>
      <div class="hstack mx-auto align-items-center d-flex gap-2">
        <span class="fs-4 position-relative">Tracks
        </span>
        <span class="fs-6 badge rounded-pill bg-secondary">
            {{ data_to_export.tracks.length }}
        </span>
      </div>

      <div v-for="(track, index) in data_to_export.tracks" :key="index">
        <div class="card">
          <div class="card-header hstack">
            <span class="fs-5">#{{ track.trackNumber }} - {{ track.trackTitle }}</span>
            <a class="btn ms-auto btn-close"
               @click="data_to_export.tracks.splice(index, 1)"></a>
          </div>
          <div class="card-body d-flex flex-column gap-2">
            <div class="row g-2">
              <div class="col-2">
                <div class="input-group">
                  <label class="input-group-text" for="trackNumber">Track Number</label>
                  <input class="form-control" required
                          placeholder="" id="trackNumber" type="number" v-model="track.trackNumber"/>
                </div>
              </div>
              <div class="col">
                <div class="input-group">
                  <label class="input-group-text" for="trackTitle">Track Title</label>
                  <input class="form-control" required
                          placeholder="" id="trackTitle" type="text" v-model="track.trackTitle"/>
                </div>
              </div>
            </div>
            <div class="row g-2">
              <div class="col-4">
                <div class="input-group">
                  <label class="input-group-text" for="trackPublisher">Track Publisher</label>
                  <input class="form-control" required
                          placeholder="" id="trackPublisher" type="text" v-model="track.trackPublisher"/>
                </div>
              </div>
              <div class="col">
                <div class="input-group">
                  <label class="input-group-text" for="trackMixVersion">Track Mix Version</label>
                  <input class="form-control" required @change="setRemixers"
                          placeholder="" id="trackMixVersion" type="text" v-model="track.trackMixVersion"/>
                </div>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <label class="input-group-text" for="originalReleaseDate">Original Release Date</label>
                  <input class="form-control" required
                          placeholder="" id="originalReleaseDate" type="text" v-model="track.originalReleaseDate"/>
                </div>
              </div>
              <div class="col-2">
                <div class="input-group">
                  <label class="input-group-text" for="exclusivePeriod">Exclusive Period</label>
                  <input min="0" max="1" class="form-control" required
                         placeholder="" id="exclusivePeriod" type="number"
                          v-model="track.exclusivePeriod"/>
                </div>
              </div>
            </div>
            <div class="row g-2">
              <div class="col-3">
                <div class="input-group">
                  <label class="input-group-text" for="audioFile">Audio Filename</label>
                  <input class="form-control" required
                          placeholder="" id="audioFile" type="text" v-model="track.audioFilename"/>
                </div>
              </div>
              <div class="col-2">
                <div class="input-group">
                  <label class="input-group-text" for="country">Country</label>
                  <input class="form-control" required
                          placeholder="" id="country" type="text" v-model="track.country"/>
                </div>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <label class="input-group-text" for="trackGenre">Track Genre</label>
                  <input class="form-control" required
                          placeholder="" id="trackGenre" type="text" v-model="track.trackGenre"/>
                </div>
              </div>
              <div class="col-4">
                <div class="input-group">
                  <label class="input-group-text" for="trackCopyright">Track Copyright</label>
                  <input class="form-control" required
                         placeholder="" id="trackCopyright" type="text" v-model="track.trackCopyright"/>
                </div>
              </div>
            </div>
            <h5>Artists</h5>
            <section class="d-flex flex-column gap-2">
              <div v-for="(artist, index) in track.trackArtists" :key="index">
                <div class="hstack gap-2">
                  <div class="input-group w-100">
                    <label class="input-group-text" for="artistName">Artist Name</label>
                    <input class="form-control" required
                           placeholder="" id="artistName" type="text" v-model="artist.artistName"/>
                  </div>
                  <a @click="track.trackArtists.splice(index, 1)" class="btn btn-close"></a>
                </div>
              </div>
              <a @click="track.trackArtists.push({ artistName: '' })" class="btn btn-outline-primary">Add</a>
            </section>
            <hr>
            <h5>Remixers</h5>
            <section class="d-flex flex-column gap-2">
              <div v-for="(remixer, index) in track.trackRemixers" :key="index">
                <div class="hstack gap-2">
                  <div class="input-group w-100">
                    <label class="input-group-text" for="remixerName">Remixer Name</label>
                    <input class="form-control" required
                           placeholder="" id="remixerName" type="text" v-model="remixer.remixerName"/>
                  </div>
                  <a @click="track.trackRemixers.splice(index, 1)" class="btn btn-close"></a>
                </div>
              </div>
              <a @click="track.trackRemixers.push({ remixerName: '' })" class="btn btn-outline-primary">Add</a>
            </section>
            <hr>
            <h5>Songwriters</h5>
            <section class="d-flex flex-column gap-2">
              <div v-for="(writer, index) in track.songwriters" :key="index">
                <div class="hstack gap-2">
                  <div class="input-group w-100">
                    <label class="input-group-text" for="writerName">Name</label>
                    <input class="form-control" required
                           placeholder="" id="writerName" type="text" v-model="writer.name"/>
                  </div>
                  <div class="input-group w-25">
                    <label class="input-group-text" for="writerType">Type</label>
                    <select class="form-select" v-model="writer.type">
                      <option value="author">Author</option>
                      <option value="composer">Composer</option>
                      <option value="lyricist">Lyricist</option>
                    </select>
                  </div>
                  <a @click="track.songwriters.splice(index, 1)" class="btn btn-close"></a>
                </div>
              </div>
              <a @click="track.songwriters.push({ name: '', type: '' })" class="btn btn-outline-primary">Add</a>
            </section>
          </div>

        </div>
      </div>
      <div v-if="form" class="hstack gap-4">
        <img style="filter: invert(1)" src="../assets/icons/upload.svg"/>
        <a @click="exportXML" class="btn w-100 btn-lg btn-outline-success text-uppercase">Save</a>
        <img style="filter: invert(1)" src="../assets/icons/upload.svg"/>
      </div>
      <div class="alert alert-danger" role="alert">
        В XML файле автоматически добавляется строка trackRemixer. Если вы не указали ремиксера, эту строку нужно удалить! В случае, если вы читаете это уведомление, я пытаюсь пофиксить этот казус.
      </div>
    </form>
  </main>
</template>

<style scoped>
</style>