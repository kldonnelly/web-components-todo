var required = function (callback) { throw new Error("Implement!"); };

var CrudInterface = {
    list: [],
    Create: required,
    ReadAll: required,
    Update: required,
    Delete: required,
};

function Crud(collection, list) {
   
    this.config = {};
    this.collection = collection;
    this.list_name = list;
    this.user = "Kevin Donnelly";
    this.path = "/users/Kevin Donnelly";
    this.home = "displayName";

};

Crud.prototype = Object.create(CrudInterface); // inherit

export {CrudInterface,Crud };