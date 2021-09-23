import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      matches: [],
      classes: [],
      playingDates: [],
      courts: [],
      isScheduled: false,
      fieldWidth: null,
      timeFields: [],
      coppiedMatch: null,
      selectedTimeslot: null,
      selectedMatch: [],
      isMatchCoppied: false,
      activeVersion: 0,
      showContextMenu: false,
      xPos: "",
      yPos: "",
      versions: [],
    };
  },

  mutations: {
    setMatches(state, payload) {
      state.matches = payload;
    },
    setClasses(state, payload) {
      state.classes = payload;
    },
    setPlayingDates(state, payload) {
      state.playingDates = payload;
    },
    setCourts(state, payload) {
      state.courts = payload;
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
    setSelectedTimeslot(state, payload) {
      state.selectedTimeslot = payload;
    },
    setSelectedMatch(state, payload) {
      state.selectedMatch = payload;
    },
    setIsMatchCoppied(state, payload) {
      state.isMatchCoppied = payload;
    },
    setShowContextMenu(state, payload) {
      state.showContextMenu = payload;
    },
    setXpos(state, payload) {
      state.xPos = payload;
    },
    setYpos(state, payload) {
      state.yPos = payload;
    },
  },

  actions: {
    setMatches(context, payload) {
      context.commit("setMatches", payload);
    },
    setClasses(context, payload) {
      context.commit("setClasses", payload);
    },
    setPlayingDates(context, payload) {
      context.commit("setPlayingDates", payload);
    },
    setCourts(context, payload) {
      context.commit("setCourts", payload);
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
    setSelectedTimeslot(context, payload) {
      context.commit("setSelectedTimeslot", payload);
    },
    setSelectedMatch(context, payload) {
      context.commit("setSelectedMatch", payload);
    },
    setIsMatchCoppied(context, payload) {
      context.commit("setIsMatchCoppied", payload);
    },
    setShowContextMenu(context, payload) {
      context.commit("setShowContextMenu", payload);
    },
    setXpos(context, payload) {
      context.commit("setXpos", payload);
    },
    setYpos(context, payload) {
      context.commit("setYpos", payload);
    },
  },

  getters: {
    getMatches(state) {
      return state.matches;
    },
    getClasses(state) {
      return state.classes;
    },
    playingDates(state) {
      return state.playingDates;
    },
    courts(state) {
      return state.courts;
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
    getSelectedTimeslot(state) {
      return state.selectedTimeslot;
    },
    getSelectedMatch(state) {
      return state.selectedMatch;
    },
    getisMatchCoppied(state) {
      return state.isMatchCoppied;
    },
    getShowContextMenu(state) {
      return state.showContextMenu;
    },
    getXpos(state) {
      return state.xPos;
    },
    getYpos(state) {
      return state.yPos;
    },
  },
});

export default store;
