<template>
  <div>
    <h3>Todos Vue</h3>
    <section>
      <TodoInput v-if="edit" @onsubmit="handleOnSubmit"></TodoInput>
      <ul id="list-container">
        <TodoItem
          v-for="(item, index) in list"
          :key="item.key"
          :index="index"
          :checked="item.checked"
          :todo="item.ToDo"
          :_key="item._key"
          :edit="edit"
          :selected="item.selected"
          :image="item.Image"
          @onremove="handleRemove"
          @ontoggle="handleToggle"
          @onselected="handleSelected"
          @ontextchanged="handletextchanged"
          @onedit="handleedit"
        ></TodoItem>
      </ul>
    </section>
  </div>
</template>

<script>
import TodoItem from './todo-item.vue';
import TodoInput from './todo-input.vue';

export default {
  name: "MyTodo",
  props: ["edit"],
  inject: ["FirebaseCrud"],
  components: { TodoItem, TodoInput },
  data() {
    return {
      list: this.FirebaseCrud.list,
    };
  },
  methods: {
    handleOnSubmit(e) {
      //  this.list = [...this.list, { text: e.detail[0], checked: false }];
      console.log(e);
      this.FirebaseCrud.Create(
        { ToDo: e, checked: false },
        (key) => {
          console.log(key);
        }
      );
    },
    handleToggle(e) {
      var item = {};

      for (var i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i]._key === e) {
          item.checked = !this.list[i].checked;
          this.FirebaseCrud.Update(e, item, () => {
            this.$set(this.list[i], "checked", item.checked);
          });
          break;
        }
      }
    },
    handleSelected(e) {
      console.log("handleSelected " + e);
      var item = {};
      for (var i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i]._key === e) {
          item.selected = true;
        } else {
          item.selected = false;
        }
        this.$set(this.list[i], "selected", item.selected);
      }
    },
    handletextchanged(e) {
      console.log("handletextchanged ");
      console.log(e);
      var item = {};

      for (var i = this.list.length - 1; i >= 0; i--) {
        if (this.list[i]._key === e.key) {
          item.ToDo = e.ToDo;
          this.FirebaseCrud.Update(e.key, item, () => {
            this.$set(this.list[i], "ToDo", item.ToDo);
          });
          break;
        }
      }
    },
    handleRemove(e) {
      //  const index = parseInt(e.detail[0]);
      //this.list = [...this.list.slice(0, index), ...this.list.slice(index + 1)];
      console.log("handleRemove " + e);
      this.FirebaseCrud.Delete(e, () => {
        console.log(this.FirebaseCrud.list);
      });
    },
    handleedit(e) {
      this.$emit("onhandledit", e);
    },
  },
};
</script>

<style>
:host {
  display: block;
}
h1 {
  font-size: 100px;
  font-weight: 100;
  text-align: center;
  color: rgba(175, 47, 47, 0.15);
}

section {
  background: #fff;
  margin: 30px 0 40px 0;
  position: relative;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 25px 50px 0 rgba(0, 0, 0, 0.1);
}

#list-container {
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #e6e6e6;
}
</style>
