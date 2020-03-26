<template>
  <div class="home">
    <div class="home__add">
      <input
        type="input"
        v-model="idUser"
        placeholder="Введите id пользователя"
        class="input-text"
      />
      <button @click="getUser()" class="button button-blue">Добавить</button>
      <button
        v-if="selectedUser.length > 1"
        @click="build()"
        class="button button-blue"
      >
        Построить
      </button>
    </div>

    <div class="users">
      <div class="users__list">
        <h2>Добавленные пользователи:</h2>
        <div
          class="user"
          :class="{ active: selectedUser.includes(user.id) }"
          v-for="user in users"
          @click="selectUser(user.id)"
          :key="user.id"
        >
          <img :src="user.photo_100" />
          <div class="user__name">
            <p>{{ user.last_name }} {{ user.first_name }}</p>
            <p>Пол: {{ user.sex === 2 ? "Мужской" : "Женский" }}</p>
            <p>Друзей: {{ user.count ? user.count : "Скрыто" }}</p>
            <p>Возраст: {{ getAge(user.bdate) }}</p>
          </div>
          <div class="user__toolbar">
            <button @click="goUserPage(user.id)" class="button button-blue">
              Перейти
            </button>
            <button @click="deleteUser(user.id)" class="button button-red">
              Удалить
            </button>
          </div>
        </div>
      </div>
      <div class="users__friends">
        <h2>Список друзей:</h2>
        <div
          v-for="user in sortFriends"
          :key="user.id"
          :class="`friend background-${user.countMatch}`"
          @click="goUserPage(user.id)"
        >
          <img :src="user.photo_50" class="friend__pic" />
          <div>{{ user.last_name }} {{ user.first_name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapActions, mapGetters } from "vuex";
// @ is an alias to /src

export default {
  name: "Users",
  data() {
    return {
      idUser: "",
      selectedUser: []
    };
  },
  computed: {
    ...mapState({
      users: state => state.users,
      token: state => state.token,
      apiUrl: state => state.apiUrl
    }),
    ...mapGetters(["sortFriends"])
  },
  methods: {
    ...mapActions(["addUser", "removeUser", "clearFriends", "addFriends"]),
    selectUser(id) {
      const index = this.selectedUser.indexOf(id);
      if (index === -1) {
        this.selectedUser.push(id);
      } else {
        this.selectedUser.splice(index, 1);
      }
    },
    getUser() {
      axios
        .get(
          `${this.apiUrl}/method/users.get?user_ids=${this.idUser}&access_token=${this.token}&fields=bdate,photo_100,sex&v=5.52`
        )
        .then(async response => {
          const user = response.data.response[0];
          const friends = await this.getFriends(user.id);
          this.addUser({ ...user, ...friends });
          this.idUser = "";
        });
    },
    goUserPage(id) {
      this.$router.push({ path: `/${id}` });
    },
    deleteUser(id) {
      this.removeUser(id);
    },
    async getFriends(id) {
      return axios
        .get(
          `${this.apiUrl}/method/friends.get?user_id=${id}&access_token=${this.token}&fields=photo_50&v=5.52`
        )
        .then(res => {
          return res.data.response;
        });
    },
    getAge(date) {
      const now = moment();
      const birthDate = moment(date, "DD-MM-YYYY");
      const age = now.diff(birthDate, "year");
      return age > 0 ? this.agetostr(age) : "Скрыто";
    },
    agetostr(age) {
      let txt;
      let count = age % 100;
      if (count >= 5 && count <= 20) {
        txt = "лет";
      } else {
        count = count % 10;
        if (count == 1) {
          txt = "год";
        } else if (count >= 2 && count <= 4) {
          txt = "года";
        } else {
          txt = "лет";
        }
      }
      return `${age} ${txt}`;
    },
    build() {
      this.clearFriends();
      const allFriends = [];
      this.selectedUser.forEach(id => {
        if (this.users[id].items) {
          allFriends.push(...this.users[id].items);
        }
      });
      this.addFriends(allFriends);
    }
  }
};
</script>
<style lang="scss">
.home {
  &__add {
    margin: 10px;
  }
}
.user {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px auto;
  box-shadow: 0 0 2px 0 black;
  padding: 10px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 0 3px 0 black;
  }
}
.users {
  display: flex;
  justify-content: space-between;
  &__list {
    width: 50%;
    .active {
      background: #f1f1f7;
    }
  }
  &__friends {
    width: 50%;
    .friend {
      display: flex;
      justify-content: start;
      align-items: center;
      margin: 10px;
      padding: 5px;
      box-shadow: 0 0 1px 0 black;
      cursor: pointer;
      &:hover {
        box-shadow: 0 0 3px 0 black;
      }
      &__pic {
        margin-right: 10px;
      }

      &.background-1 {
        background: #ffffff;
      }
      &.background-2 {
        background: #ffe0d4;
      }
      &.background-3 {
        background: #ffc1ab;
      }
      &.background-4 {
        background: #ffa182;
      }
      &.background-5 {
        background: #ff805b;
      }
      &.background-6 {
        background: #ff5b34;
      }
      &.background-7 {
        background: #ff2400;
      }
    }
  }
}
.input-text {
  padding: 10px;
  border-radius: 5px;
  margin-right: 10px;
  box-shadow: 0 0 2px 0 black;
  border: none;
}
.button {
  border: none;
  background: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  margin: 0 4px;
  &-blue {
    background: #5181b8;
    color: #fff;
  }
  &-red {
    background: #b85164;
    color: #fff;
  }
}
</style>
