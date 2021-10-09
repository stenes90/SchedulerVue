import { createStore } from "vuex";

export const store = createStore({
  state() {
    return {
      matches: [],
      classes: [],
      playingDates: [],
      courts: [],
      model: null,
      isScheduled: false,
      fieldWidth: null,
      timeFields: [],
      coppiedMatch: [],
      selectedTimeslot: null,
      selectedMatch: [],
      isMatchCoppied: false,
      showContextMenu: false,
      xPos: "",
      yPos: "",
      dragActive: false,
      hoveredSlot: null,
      activeVersion: 0,
      versions: [],
      showModal: false,
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
    setModel(state, payload) {
      state.model = payload;
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
    setDragActive(state, payload) {
      state.dragActive = payload;
    },
    setHoveredSlot(state, payload) {
      state.hoveredSlot = payload;
    },
    setActiveVersion(state, payload) {
      state.activeVersion = payload;
    },
    setVersions(state, payload) {
      state.versions = payload;
    },
    setShowModal(state, payload) {
      state.showModal = payload;
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
    setModel(context, payload) {
      context.commit("setModel", payload);
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
    setDragActive(context, payload) {
      context.commit("setDragActive", payload);
    },
    setHoveredSlot(context, payload) {
      context.commit("setHoveredSlot", payload);
    },
    setActiveVersion(context, payload) {
      context.commit("setActiveVersion", payload);
    },
    setVersions(context, payload) {
      context.commit("setVersions", payload);
    },
    setShowModal(context, payload) {
      context.commit("setShowModal", payload);
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
    getModel(state) {
      return state.model;
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
    getDragActive(state) {
      return state.dragActive;
    },
    getHoveredSlot(state) {
      return state.hoveredSlot;
    },
    getActiveVersion(state) {
      return state.activeVersion;
    },
    getVersions(state) {
      return state.versions;
    },
    getShowModal(state) {
      return state.showModal;
    },
  },
});

export default store;
