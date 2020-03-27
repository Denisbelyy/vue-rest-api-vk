import Vue from "vue";
import Vuex from "vuex";

import uniqBy from "lodash/uniqBy";
import sortBy from "lodash/sortBy";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token:
      "ca7570f1ca7570f1ca7570f1c9ca050b94cca75ca7570f1940dde0118eaeafcaeaf884c",
    users: [],
    friends: []
  },
  getters: {
    sortUsers: state => {
      return sortBy(state.users, ["last_name", "first_name"])
    },
    sortFriends: state => {
      state.friends.forEach((el, index) => {
        if (el.deactivated) {
          state.friends.splice(index, 1);
        }
        el.countMatch = state.friends.filter(item => item.id == el.id).length;
      });
      return uniqBy(state.friends, "id");
    }
  },
  mutations: {
    ADD_USER(state, user) {
      state.users.push(user);
    },
    REMOVE_USER(state, id) {
      state.users.splice(id, 1);
    },
    ADD_FRIENDS(state, friends) {
      state.friends.push(...friends);
    },
    CLEAR_FRIENDS(state) {
      state.friends = [];
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
    }
  }
});
