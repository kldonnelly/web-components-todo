import firebase from "firebase/app";
import "firebase/database";

import {Crud } from "./CrudInterface";


Crud.prototype.Create = function (value, callback) {
    console.log(value);
    //  this.list = [...this.list, value];

    if (!firebase.auth().currentUser) return;

    var newToDoKey = firebase
        .database()
        .ref()
        .child(`${this.path}/${this.collection}/${this.list_name}`)
        .push().key;

    firebase
        .database()
        .ref(`${this.path}/${this.collection}/${this.list_name}/${newToDoKey}`)
        .update(value)
        .then(() => {
            value._key = newToDoKey;
            this.list.push(value);
            callback(newToDoKey);
        });


};
Crud.prototype.ReadAll = function (callback) {
    if (firebase.auth().currentUser) {
        if (this.home === "uid") {
            this.path = `/users/${firebase.auth().currentUser.uid}`;
            console.log("path = " + this.path);
        }
        else {
            this.path = `/users/${firebase.auth().currentUser.displayName}`;
            console.log("path = " + this.path);
        }


    }
    console.log(window.location.search);
    console.log(window.location.hash);
    this.list.splice(0);

    firebase
        .database()
        .ref(`${this.path}/${this.collection}/${this.list_name}`)
        .once("value")
        .then((snapshot) => {
            snapshot.forEach((element) => {
                var value = element.val();
                value._key = element.key;
                if (element.key === "config") {
                    this.config = value;
                } else this.list.push(value);
            });
            callback();
        });

};
Crud.prototype.Update = function (key, value, callback) {
    firebase
        .database()
        .ref(`${this.path}/${this.collection}/${this.list_name}/${key}`)
        .update(value, (error) => {
            if (error) {
                // The write failed...
                console.log(error);
            } else {
                console.log("Data saved successfully!");
                if (key === 'config') {

                }
                else {
                    this.list.forEach((item, index) => {
                        if (item._key === key) {
                            //  this.list[index] = value;
                        }
                    });
                }

                callback();
            }
        });

};

export {Crud};

/*
export const FirebaseCrudTodo = {
    list: [],
    config: {},
    collection: "Todos",
    list_name: "default",
    user: "Kevin Donnelly",
    path: "/users/Kevin Donnelly",
    home: "displayName",
    ReadAll(callback) {
        if (firebase.auth().currentUser) {
            if (this.home === "uid") {
                this.path = `/users/${firebase.auth().currentUser.uid}`;
                console.log("path = " + this.path);
            }
            else {
                this.path = `/users/${firebase.auth().currentUser.displayName}`;
                console.log("path = " + this.path);
            }


        }
        console.log(window.location.search);
        console.log(window.location.hash);
        this.list.splice(0);

        firebase
            .database()
            .ref(`${this.path}/${this.collection}/${this.list_name}`)
     settings       .once("value")
            .then((snapshot) => {
                snapshot.forEach((element) => {
                    var value = element.val();
                    value._key = element.key;
                    if (element.key === "config") {
                        this.config = value;
                    } else this.list.push(value);
                });
                callback();
            });
    },settings
    Create(value, callback) {
        console.log(value);
        //  this.list = [...this.list, value];

        if (!firebase.auth().currentUser) return;

        var newToDoKey = firebase
            .database()
            .ref()
            .child(`${this.path}/${this.collection}/${this.list_name}`)
            .push().key;

        firebase
            .database()
            .ref(`${this.path}/${this.collection}/${this.list_name}/${newToDoKey}`)
            .update(value)
            .then(() => {
                value._key = newToDoKey;
                this.list.push(value);
                callback(newToDoKey);
            });
    },

    Delete(key, callback) {
        console.log("Delete key = " + key);
        for (var i = this.list.length - 1; i >= 0; i--) {
            if (this.list[i]._key == key) {
                this.list.splice(i, 1);
            }
        }

        callback();
    },
    Update(key, value, callback) {
        //  if (!firebase.auth().currentUser) return;
        // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
        firebase
            .database()
            .ref(`${this.path}/${this.collection}/${this.list_name}/${key}`)
            .update(value, (error) => {
                if (error) {
                    // The write failed...
                    console.log(error);
                } else {
                    console.log("Data saved successfully!");
                    if (key === 'config') {

                    }
                    else {
                        this.list.forEach((item, index) => {
                            if (item._key === key) {
                                //  this.list[index] = value;
                            }
                        });
                    }

                    callback();
                }
            });
    },


};

*/


