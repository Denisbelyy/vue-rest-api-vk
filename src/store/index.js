import Vue from "vue";
import Vuex from "vuex";

import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    apiUrl: "",
    token:
      "ca7570f1ca7570f1ca7570f1c9ca050b94cca75ca7570f1940dde0118eaeafcaeaf884c",
    users: {},
    friends: []
  },
  getters: {
    sortFriends: state => {
      state.friends.forEach(el => {
        el.countMatch = state.friends.filter(item => item.id == el.id).length;
      });
      return sortBy(
        uniqBy(
          state.friends.filter(el => !el.deactivated),
          "id"
        ),
        ["last_name", "first_name"]
      );
    }
  },
  mutations: {
    ADD_USER(state, user) {
      state.users[user.id] = user;
    },
    REMOVE_USER(state, id) {
      Vue.delete(state.users, id);
    },
    ADD_FRIENDS(state, friends) {
      state.friends.push(...friends);
    },
    CLEAR_FRIENDS(state) {
      state.friends = [];
    },
    CHANGE_API_URL(state, url) {
      state.apiUrl = url;
    }
  },
  actions: {
    addUser(context, user) {
      context.commit("ADD_USER", user);
    },
    removeUser(context, id) {
      context.commit("REMOVE_USER", id);
    },
    addFriends(context, friends) {
      console.log("test");
      context.commit("ADD_FRIENDS", friends);
    },
    clearFriends(context) {
      context.commit("CLEAR_FRIENDS");
    },
    changeAPIUrl(context, url) {
      context.commit("CHANGE_API_URL", url);
    }
  }
});
