<script setup>
import $ from 'jquery'
import {onMounted, ref} from "vue";

const data_to_export = ref({
  aggregatorName: 'ONErpm',
  labelName: '',
  UPC_EAN: -1,
  catalogNumber: -1,
  coverArtFilename: '',
  releaseTitle: '',
  releaseSalesType: '',
  tracks: []
})

function addTrack() {
  data_to_export.value.tracks.push({
    albumOnly: 0,
    trackNumber: data_to_export.value.tracks.length + 1,
    trackTitle: '',
    trackPublisher: '',
    trackMixVersion: '',
    originalReleaseDate: '',
    exclusivePeriod: 0,
    trackArtists: [
      {artistName: ''}
    ],
    audioFilename: '',
    country: '',
    trackGenre: '',
    trackCopyright: '',
    songwriters: [
      {name: '', type: ''}
    ]
  })
  updateIndexes()
}

const form = ref()

function updateIndexes() {
  for (let i = 0; i < data_to_export.value.tracks.length; i++) {
    data_to_export.value.tracks[i].trackNumber = i + 1
    data_to_export.value.tracks[i].audioFilename =
        `${data_to_export.value.UPC_EAN}_${data_to_export.value.tracks[i].trackNumber}.wav`
  }
}

function exportXML() {
  if (form.value.checkValidity()){
    $.ajax({
      type: 'POST',
      url: 'http://localhost:8000/export/',
      headers: {'Content-Type': 'application/json'},
      dataType: 'binary',
      xhrFields: {
        'responseType': 'blob'
      },
      data: JSON.stringify(data_to_export.value),
      success: function (data, status, xhr) {
        let blob = new Blob([data], {type: xhr.getResponseHeader('Content-Type')});
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${data_to_export.value.UPC_EAN}.xml`;
        link.click();
      },
      error: function (response) {
        console.log(response)
      }
    })
  } else {
    form.value.reportValidity()
  }
}

function setUPC() {
  data_to_export.value.coverArtFilename = data_to_export.value.UPC_EAN + '.png'
  for (let i = 0; i < data_to_export.value.tracks.length; i++) {
    data_to_export.value.tracks[i].audioFilename =
        `${data_to_export.value.UPC_EAN}_${data_to_export.value.tracks[i].trackNumber}.wav`
  }
}

onMounted(() => {
  $('body').attr('data-bs-theme', 'dark')
  addTrack()
})
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

      <section class="d-flex flex-column gap-2">
        <div class="hstack gap-2 w-100">
          <div class="form-floating">
            <input maxlength="24" class="form-control" id="aggregatorName" type="text"
                   placeholder="" required
                   v-model="data_to_export.aggregatorName"/>
            <label for="aggregatorName">Aggregator Name</label>
          </div>
          <div class="form-floating w-100">
            <input class="form-control" placeholder="" required
                   name="labelName" id="labelName" type="text" v-model="data_to_export.labelName"/>
            <label for="labelName">Label Name</label>
          </div>
          <div class="form-floating">
            <input @change="setUPC" placeholder="" required
                   class="form-control" id="UPC_EAN" type="number" v-model="data_to_export.UPC_EAN"/>
            <label for="UPC_EAN">UPC/EAN</label>
          </div>
        </div>
        <div class="hstack gap-2 w-100">
          <div class="form-floating">
            <input placeholder="" class="form-control" required
                   id="catalogNumber" type="number" v-model="data_to_export.catalogNumber"/>
            <label for="catalogNumber">Catalog Number</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder="" required
                   id="coverArtFilename" type="text" v-model="data_to_export.coverArtFilename"/>
            <label for="coverArtFilename">Cover Art Filename</label>
          </div>
          <div class="form-floating w-75">
            <input class="form-control" placeholder="" required
                   id="releaseTitle" type="text" v-model="data_to_export.releaseTitle"/>
            <label for="releaseTitle">Release Title</label>
          </div>
          <div class="form-floating">
            <input class="form-control" placeholder="" required
                   id="releaseSalesType" type="text" v-model="data_to_export.releaseSalesType"/>
            <label for="releaseSalesType">Release Sales Type</label>
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
            <div class="hstack gap-2">
              <div class="form-floating">
                <input class="form-control" required
                       placeholder="" id="trackNumber" type="number" v-model="track.trackNumber"/>
                <label for="trackNumber">Track Number</label>
              </div>
              <div class="form-floating w-100">
                <input class="form-control" required
                       placeholder="" id="trackTitle" type="text" v-model="track.trackTitle"/>
                <label for="trackTitle">Track Title</label>
              </div>
            </div>
            <div class="hstack gap-2">
              <div class="form-floating w-75">
                <input class="form-control" required
                       placeholder="" id="trackPublisher" type="text" v-model="track.trackPublisher"/>
                <label for="trackPublisher">Track Publisher</label>
              </div>
              <div class="form-floating w-25">
                <input class="form-control" required
                       placeholder="" id="trackMixVersion" type="text" v-model="track.trackMixVersion"/>
                <label for="trackMixVersion">Track Mix Version</label>
              </div>
              <div class="form-floating w-25">
                <input class="form-control" required
                       placeholder="" id="originalReleaseDate" type="text" v-model="track.originalReleaseDate"/>
                <label for="originalReleaseDate">Original Release Date</label>
              </div>
              <div class="form-floating w-25">
                <input min="0" max="1" class="form-control" required
                       placeholder="" id="exclusivePeriod" type="number"
                       v-model="track.exclusivePeriod"/>
                <label for="exclusivePeriod">Exclusive Period</label>
              </div>
            </div>
            <div class="hstack gap-2">
              <div class="form-floating w-50">
                <input class="form-control" required
                       placeholder="" id="audioFile" type="text" v-model="track.audioFilename"/>
                <label for="audioFile">Audio Filename</label>
              </div>
              <div class="form-floating">
                <input class="form-control" required
                       placeholder="" id="country" type="text" v-model="track.country"/>
                <label for="country">Country</label>
              </div>
              <div class="form-floating">
                <input class="form-control" required
                       placeholder="" id="trackGenre" type="text" v-model="track.trackGenre"/>
                <label for="trackGenre">Track Genre</label>
              </div>
              <div class="form-floating w-50">
                <input class="form-control" required
                       placeholder="" id="trackCopyright" type="text" v-model="track.trackCopyright"/>
                <label for="trackCopyright">Track Copyright</label>
              </div>
            </div>
            <h5>Artists</h5>
            <section class="d-flex flex-column gap-2">
              <div v-for="(artist, index) in track.trackArtists" :key="index">
                <div class="hstack gap-2">
                  <div class="form-floating w-100">
                    <input class="form-control" required
                           placeholder="" id="artistName" type="text" v-model="artist.artistName"/>
                    <label for="artistName">Artist Name</label>
                  </div>
                  <a @click="track.trackArtists.splice(index, 1)" class="btn btn-close"></a>
                </div>
              </div>
              <a @click="track.trackArtists.push({artistName: ''})" class="btn btn-outline-primary">Add</a>
            </section>
            <h5>Songwriters</h5>
            <section class="d-flex flex-column gap-2">
              <div v-for="(writer, index) in track.songwriters" :key="index">
                <div class="hstack gap-2">
                  <div class="form-floating w-100">
                    <input class="form-control" required
                           placeholder="" id="writerName" type="text" v-model="writer.name"/>
                    <label for="writerName">Name</label>
                  </div>
                  <div class="form-floating w-25">
                    <input class="form-control" required
                           placeholder="" id="writerType" type="text" v-model="writer.type"/>
                    <label for="writerType">Type</label>
                  </div>
                  <a @click="track.songwriters.splice(index, 1)" class="btn btn-close"></a>
                </div>
              </div>
              <a @click="track.songwriters.push({name: '', type: ''})" class="btn btn-outline-primary">Add</a>
            </section>
          </div>

        </div>
      </div>
      <div v-if="form" class="hstack gap-4">
        <img style="filter: invert(1)" src="../assets/icons/upload.svg"/>
        <a :class="{'disabled': !form.checkValidity()}" @click="exportXML" class="btn w-100 btn-lg btn-danger text-uppercase">Export</a>
        <img style="filter: invert(1)" src="../assets/icons/upload.svg"/>
      </div>
    </form>
  </main>
</template>

<style scoped>

</style>