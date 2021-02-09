<template>
  <li
    :class="['item', { completed: checked }, { selected: selected }]"
    :style="{ backgroundImage: 'url(' + image + ')' }"
    @click="handleFocus"
  >
    <v-btn v-if="edit" tile outlined color="#00FF00" @click="handleedit">
      <v-icon left>{{ svgPath }}</v-icon
      >Edit
    </v-btn>

    <input
      v-if="edit"
      type="checkbox"
      :checked="checked"
      @click="handleOnToggle"
    />
    <label :contenteditable="edit" @blur="handleOnTextChanged">{{
      todo
    }}</label>
    <button v-if="edit" class="destroy" @click="handleOnRemove">x</button>
  </li>
</template>

<script>
//import Vuetify from "vuetify";
//import Vue from "vue";
//Vue.use(Vuetify);

import { VIcon, VBtn } from "vuetify/lib";
import { mdiPencil } from "@mdi/js";
import colors from "vuetify/lib/util/colors";

export default {
  name: "TodoItem",
  props: ["index", "todo", "checked", "selected", "_key", "edit", "image"],
  components: {
    VBtn,
    VIcon,
  },
  data: () => ({
    svgPath: mdiPencil,
  }),
  methods: {
    handleOnRemove() {
      this.$emit("onremove", this._key);
    },
    handleOnToggle() {
      this.$emit("ontoggle", this._key);
    },
    handleFocus() {
      this.$emit("onselected", this._key);
    },
    handleOnTextChanged(e) {
      this.$emit("ontextchanged", { key: this._key, ToDo: e.target.innerText });
    },
    handleedit() {
      this.$emit("onedit", this._key);
    },
  },
};
</script>
<style src="../../node_modules/vuetify/dist/vuetify.min.css"></style>
<style src="../../node_modules/@mdi/font/css/materialdesignicons.min.css"></style>
<style>
:host {
  display: block;
}

li.item {
  height: 180px;
  font-size: 24px;
  display: block;
  position: relative;
  border: 5px #ddd;
  background-size: 100%;
}

li.item.selected {
  border-style: solid;
}

li.item input {
  text-align: center;
  width: 40px;
  /* auto, since non-WebKit browsers doesn't support input styling */
  height: auto;
  position: absolute;
  top: 9px;
  bottom: 0;
  margin: auto 0;
  border: none;
  /* Mobile Safari */
  -webkit-appearance: none;
  appearance: none;
}

li.item input:after {
  content: url('data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23ededed"%20stroke-width%3D"3"/></svg>');
}

li.item input:checked:after {
  content: url('data:image/svg+xml;utf8,<svg%20xmlns%3D"http%3A//www.w3.org/2000/svg"%20width%3D"40"%20height%3D"40"%20viewBox%3D"-10%20-18%20100%20135"><circle%20cx%3D"50"%20cy%3D"50"%20r%3D"50"%20fill%3D"none"%20stroke%3D"%23bddad5"%20stroke-width%3D"3"/><path%20fill%3D"%235dc2af"%20d%3D"M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z"/></svg>');
}

li.item label {
  white-space: pre;
  word-break: break-word;
  padding: 15px 60px 15px 15px;
  margin-left: 45px;
  display: block;
  line-height: 1.2;
  transition: color 0.4s;
}

li.item.completed label {
  color: #d9d9d9;
  text-decoration: line-through;
}

li.item button,
li.item input[type="checkbox"] {
  outline: none;
}

li.item button {
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  font-size: 100%;
  vertical-align: baseline;
  font-family: inherit;
  font-weight: inherit;
  color: inherit;
  -webkit-appearance: none;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  font-smoothing: antialiased;
}

li.item .destroy {
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
}

li.item .destroy:hover {
  color: #af5b5e;
}
</style>
