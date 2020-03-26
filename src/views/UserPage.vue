<template>
  <div class="userpage">
    <div v-if="isLoadPage">
      <h1>{{ user.last_name }} {{ user.first_name }}</h1>
      <div class="userpage__item">
        <div class="userpage__item-friends">
          <h2>В друзьях у:</h2>
          <div v-for="user in friends" :key="user.id" class="friend">
            <img :src="user.photo_100" class="friend__pic" />
            <div>{{ user.last_name }} {{ user.first_name }}</div>
          </div>
        </div>
        <div class="userpage__item-wall">
          <h2>Стена:</h2>
          <div v-if="showErrorWall">
            Стена скрыта настройками приватности
          </div>
          <div v-else>
            <div v-for="note in wallNotes" :key="note.id" class="note">
              <div class="note__text">{{ note.text }}</div>
              <wall-attachment
                :items="note.attachments"
                v-if="note.attachments"
              ></wall-attachment>
              <div
                class="note_repost"
                v-for="(repost, index) in note.copy_history"
                :key="index"
              >
                <wall-attachment
                  :items="repost.attachments"
                  v-if="repost.attachments"
                ></wall-attachment>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import axios from "axios";
import WallAttachment from "@/components/WallAttachment.vue";

export default {
  name: "UserPage",
  components: { WallAttachment },
  data() {
    return {
      user: {},
      friendsId: [],
      wallNotes: [],
      isLoadPage: false,
      showErrorWall: false
    };
  },
  computed: {
    ...mapState({
      token: state => state.token,
      users: state => state.users,
      apiUrl: state => state.apiUrl
    }),
    idUser() {
      return this.$route.params.id;
    },
    friends() {
      return this.friendsId.map(id => {
        return this.users[id];
      });
    },
    ...mapGetters(["sortFriends"])
  },
  mounted() {
    this.load();
  },
  methods: {
    async load() {
      await this.getUser();
      await this.getWall();
      this.friendsId = Object.keys(this.users).filter(id => {
        if (this.users[id].items) {
          return this.users[id].items.some(el => el.id == this.idUser);
        }
        return false;
      });
      this.isLoadPage = true;
    },
    async getUser() {
      axios
        .get(
          `${this.apiUrl}/method/users.get?user_ids=${this.idUser}&access_token=${this.token}&fields=bdate,sex&v=5.52`
        )
        .then(response => {
          this.user = response.data.response[0];
        });
    },
    async getWall() {
      axios
        .get(
          `${this.apiUrl}/method/wall.get?owner_id=${this.idUser}&access_token=${this.token}&v=5.52`
        )
        .then(response => {
          if (response.data.response.items) {
            this.wallNotes.push(...response.data.response.items);
            this.showErrorWall = false;
          } else {
            this.showErrorWall = true;
          }
        })
        .catch(() => {
          this.showErrorWall = true;
        });
    }
  }
};
</script>
<style lang="scss">
.userpage {
  &__item {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    &-friends {
      width: 50%;
      .friend {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin: 4px 0;
        &__pic {
          margin-right: 10px;
        }
      }
    }
    &-wall {
      width: 50%;
    }
  }
  .note {
    border: 1px solid black;
    padding: 10px;
    margin: 10px auto;
    &__attach {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
