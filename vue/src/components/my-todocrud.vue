<template>
  <div :style="{ backgroundImage: `url(${bkimage})` }">
    <div v-if="edit">
      <button class="edit" type="button" v-on:click="signon">
        {{ btnSignOnText }}
      </button>
      <button class="edit" v-on:click="showModal">
        Select Background Image
      </button>
      <div>{{ lbemail }}</div>
      <div>{{ lbUID }}</div>
    </div>
    <firebase-signin
      :config.prop="firebase_config"
      :signin.prop="firebase_signin"
      @onchange="firebase_onchange"
      @onsignin="firebase_onsignin"
    ></firebase-signin>
    <signin-google
      profile="https://www.googleapis.com/auth/drive"
      client_id="629054288068-2fmfb0cjgd3cuf3995a993m93rqs4nld.apps.googleusercontent.com"
      :signin.prop="google_signin"
      @onchange="google_onchange"
    ></signin-google>
    <MyTodo :edit="edit" @onhandledit="handleedit"></MyTodo>
    <modal v-show="isModalVisible" @close="closeModal">
      <h3 slot="header">Select a File</h3>
      <div slot="body">
        <storage-view
          slot="body"
          height="480"
          :controller.prop="storage_controller"
          @selected-changed="selected_changed"
        ></storage-view>
        <upload-view :controller.prop="upload_controller"></upload-view>
      </div>
    </modal>
  </div>
</template> 

<script>
import MyTodo from "./my-todo";
import "@kevinldonnelly/signin-google";

import { FirebaseSignIn } from "@kevinldonnelly/firebase-signin";
import { StorageView } from "@kevinldonnelly/storage-view-controllers";
import { Firebase } from "@kevinldonnelly/storage-view-controllers";
import { StorageUploadView } from "@kevinldonnelly/storage-view-controllers";
import { GDrive } from "@kevinldonnelly/storage-view-controllers";

import modal from "./modal.vue";
import { Crud } from "./FirebaseCrud";

customElements.define("firebase-signin", FirebaseSignIn);
customElements.define("storage-view", StorageView);
customElements.define("upload-view", StorageUploadView);

//FirebaseCrudTodo.prototype.uuu
//var FirebaseCrudTodo = new FirebaseCrud("Todos","default");
var FirebaseCrud = new Crud("Todos", "default");

export default {
  name: "MyTodoCrud",
  provide: {
    FirebaseCrud,
  },

  data() {
    return {
      btnSignOnText: "Signin",
      isModalVisible: false,
      lbluser: "",
      firebase_signin: "none",
      google_signin: false,
      signin_provider: "Google",
      lbemail: "nobody",
      lbUID: "0",
      firebase_config: {
        apiKey: "AIzaSyBbJ3TUQsjxu0dMcGd4A3AN_Hj3KbGBvPs",
        authDomain: "soultech-signage.firebaseapp.com",
        databaseURL: "https://soultech-signage.firebaseio.com",
        appId: "1:629054288068:web:bdcf4da2b742a403efd991",
        measurementId: "G-RQNNGD71XQ",
        storageBucket: "soultech-signage.appspot.com",
      },

      storage_controller: {},
      upload_controller: {},
      bkimage: "",
      edit: false,
      edit_key: "config",
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      //  this.config = this.firebaseconfig;
      this.init();
    });
  },

  components: { MyTodo, modal },
  methods: {
    init: function () {
      console.log(window.location.href);

      let params = new URLSearchParams(window.location.search);

      if (params.has("edit")) this.edit = true;

      if (params.has("id"))
        FirebaseCrudTodo.path = `/users/${params.get("id")}`;

      if (params.has("list")) FirebaseCrud.list_name = params.get("list");

      if (params.has("home")) FirebaseCrud.home = params.get("home");
    },
    showModal() {
      this.isModalVisible = true;
      this.edit_key = "config";
    },
    closeModal() {
      this.isModalVisible = false;
    },
    signon: function () {
      console.log("signon button clicked");
      this.google_signin = !this.google_signin;
      //  this.firebase_signin = this.signin_provider;
    },
    firebase_onchange: function (event) {
      console.log(`firebase_onchange`);
      console.log(event.detail.currentUser);
      this.lbemail = event.detail.currentUser.email;
      this.lbUID = event.detail.currentUser.uid;
      this.btnSignOnText = "Sign Out";
    },
    firebase_onsignin: function (event) {
      console.log("signed on/off");

      var controller = new Firebase.StorageController();
      //  var controller = new GDrive.StorageController();
      controller.folder.id = "1lTF_X76tqKgQZftw-efXL0H4kmJA6Oa8";
      controller.folder.Name = `/users/${this.lbemail}`;
      this.storage_controller = controller;
      this.upload_controller = controller;
      console.log(event);
      if (event.detail && event.detail.result) {
        this.btnSignOnText = "Sign Out";
      } else {
        this.btnSignOnText = "Sign In";
        this.lbemail = "nobody";
        this.init();
      }

      FirebaseCrud.ReadAll(() => {
        console.log("ReadAll");
        console.log(FirebaseCrud);
        document.body.style.backgroundImage = `url(${FirebaseCrud.config.backgroundImage})`;
        document.body.style.backgroundSize = "100%";
      });
    },
    selected_changed: function (event) {
      console.log(event);
      this.storage_controller.FullPath(event.detail, (url) => {
        if (this.edit_key == "config") {
          document.body.style.backgroundImage = `url(${url})`;
          document.body.style.backgroundSize = "100%";
          FirebaseCrud.Update("config", { backgroundImage: url }, () => {});
        } else {
          FirebaseCrud.Update(this.edit_key, { Image: url }, () => {
            for (var i = FirebaseCrud.list.length - 1; i >= 0; i--) {
              if (FirebaseCrud.list[i]._key === this.edit_key) {
                this.$set(FirebaseCrud.list[i], "Image", url);
              }
            }
          });
        }
      });
    },
    handleedit: function (event) {
      this.edit_key = event;
      //
      this.isModalVisible = true;
      console.log(event);
    },
    google_onchange: function (event) {
      console.log("sign change");
      console.log(event);
      this.firebase_signin = event.detail.currentUser
        .get()
        .getAuthResponse().id_token;
    },
  },
};
</script>

<style>
.edit {
  background-color: #44c767;
  border-radius: 28px;
  border: 1px solid #18ab29;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 17px;
  padding: 16px 31px;
  text-decoration: none;
  text-shadow: 0px 1px 0px #2f6627;
}
</style>