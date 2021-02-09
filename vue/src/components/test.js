function Person(first, last, age, gender, interests) {

    // property and method definitions
    this.name = {
      'first': first,
      'last' : last
    };
    this.age = age;
    this.gender = gender;
    //...see link in summary above for full definition
  }

  let person1 = new Person('Tammi', 'Smith', 32, 'neutral', ['music', 'skiing', 'kickboxing']);



  Person.prototype.farewell = function() {
    alert(this.name.first + ' has left the building. Bye for now!');
  };


  person1.farewell();
