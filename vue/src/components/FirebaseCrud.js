import firebase from "firebase/app";
import "firebase/database";

import { Crud } from "./CrudInterface";


Crud.prototype.Create = function (value, callback) {
    console.log(value);
    //  this.list = [...this.list, value];
    if (!firebase.auth)  return; 

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

    console.log(firebase);

    if (!firebase.auth) { return; }

   
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

export { Crud };


