import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      matches: [],
      classes: [],
      isScheduled: false,
      fieldWidth: null,
      timeFields: [],
      coppiedMatch: null,
      isMatchCoppied: false,
      versions: [],
      activeVersion: 0,
    };
  },

  mutations: {
    setMatches(state, payload) {
      state.matches = payload;
    },
    setClasses(state, payload) {
      state.classes = payload;
    },
    setIsScheduled(state, payload) {
      state.isScheduled = payload;
    },
    setFieldWidth(state, payload) {
      state.fieldWidth = payload;
    },
    setTimeFields(state, payload) {
      state.timeFields = payload;
    },
    setCoppiedMatch(state, payload) {
      state.coppiedMatch = payload;
    },
    setIsMatchCoppied(state, payload) {
      state.isMatchCoppied = payload;
    },
  },

  actions: {
    setMatches(context, payload) {
      context.commit("setMatches", payload);
    },
    setClasses(context, payload) {
      context.commit("setClasses", payload);
    },
    setIsScheduled(context, payload) {
      context.commit("setIsScheduled", payload);
    },
    setFieldWidth(context, payload) {
      context.commit("setFieldWidth", payload);
    },
    setTimeFields(context, payload) {
      context.commit("setTimeFields", payload);
    },
    setCoppiedMatch(context, payload) {
      context.commit("setCoppiedMatch", payload);
    },
    setIsMatchCoppied(context, payload) {
      context.commit("setIsMatchCoppied", payload);
    },
  },

  getters: {
    getMatches(state) {
      return state.matches;
    },
    getClasses(state) {
      return state.classes;
    },
    getIsScheduled(state) {
      return state.isScheduled;
    },
    getFieldWidth(state) {
      return state.fieldWidth;
    },
    getTimeFields(state) {
      return state.timeFields;
    },
    getCoppiedMatch(state) {
      return state.coppiedMatch;
    },
    getisMatchCoppied(state) {
      return state.isMatchCoppied;
    },
  },
});

export default store;
