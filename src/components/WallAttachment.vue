<template>
  <div class="note__attach">
    <div>{{ items.text }}</div>
    <div v-for="(item, index) in items" :key="index">
      <div v-if="item.type === 'photo'">
        <img :src="`${item.photo.photo_604}`" />
      </div>
      <div v-if="item.type === 'doc'">
        <img :src="`${item.url}`" />
      </div>
      <div v-if="item.type === 'album'">
        <img :src="`${item.thumb.photo_130}`" />
      </div>
      <div v-if="item.type === 'video'">
        <img :src="`${item.video.photo_604}`" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "WallAttachment",
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>
