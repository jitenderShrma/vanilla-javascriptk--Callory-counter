// Meal class: for meal reprenentation
class Meal {
  constructor(id, name, calories){
  this.id = id;
  this.name = name;
  this.calories = calories;
  }
}
// calories for display total
class calories {
  static total(){

    let total = 0;
    const meals = Store.getMeals();
    meals.forEach(meal => {
      total += Number(meal.calories);
    });
    const h3 = document.createElement('h3');
    const table = document.querySelector('table');
    h3.setAttribute('class', 'flow-text center calories');
    h3.setAttribute('id', 'calories' )
    h3.textContent = `Total Calories: ${total}`;
    document.querySelector('.container').insertBefore(h3, table);
  }
}

// Store class: for storage handling
class Store {
  static getMeals(){
    let meals;
    if(localStorage.getItem('meals') === null){
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'));
    }
    return meals;
  }
  static deleteMeal(name){
    const meals = Store.getMeals();
    meals.forEach((meal, i) => {
      if(meal.name === name){
        meals.splice(i, 1);
      }
    });
    localStorage.setItem('meals', JSON.stringify(meals));
  }
  static storeMeal(meal){
    const meals = Store.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals));
  }
}
// Store class: for UI handling
class UI {
  static displayMeals(meal){
    const meals = Store.getMeals();

    meals.forEach(meal => UI.createMarkup(meal));
  }
  static createMarkup(meal){
    const tr = document.createElement('tr');
    tr.innerHTML = `
    <td>${meal.id}</td>
    <td>${meal.name}</td>
    <td>${meal.calories}</td>
    <td><a class="btn white pencil"><i class="material-icons blue-text">edit</i></a></td>
    `;
    document.querySelector('#tbody').appendChild(tr);
  }

  static removeMarkup(id){
    Store.getMeals().forEach(meal => {
      if(meal.id == id){
        {
          console.log(document.querySelector('#tbody').childre)
        }
      }
    })
  }

  static onPencilClick(target, id){

    if(target.parentElement.classList.contains('pencil')){

      // remove add button
      document.querySelector('#add-meal').style.display = 'none';

      // insert edit and delete button
      const editBtn = document.createElement('a');
      editBtn.value = id;
      editBtn.classList = 'btn yellow darken-3 editBtn';
      editBtn.innerHTML = '<i class="material-icons left">restore</i>Resave';
      document.querySelector('#demo').appendChild(editBtn);

      const deleteBtn = document.createElement('a');
      deleteBtn.value = id;
      deleteBtn.classList = 'btn red lighten-1 deleteBtn';
      deleteBtn.innerHTML = '<i class="material-icons left">delete</i>Edit';
      document.querySelector('#demo').appendChild(deleteBtn);

      const goBackButton = document.createElement('a');
      goBackButton.classList = 'btn grey darken-1 goBack right';
      goBackButton.innerHTML = '<i class="material-icons left">chevron_left</i>Back';
      document.querySelector('#demo').appendChild(goBackButton);

      document.querySelector('#demo').style.display = 'inline';

      // put value into text fields
      const mealInput = document.querySelector('#Meal');
      const caloriesInput = document.querySelector('#calories');
      const parent = target.parentElement.parentElement.parentElement;
      mealInput.value = parent.children[1].textContent;
      caloriesInput.value = parent.children[2].textContent;

    } 
  }

  static removeFromUI(target){
    const children = document.querySelector('#tbody').children;
    for(let i = 0; i < children.length; i++){
      if(target.value == children[i].children[0].textContent){
        children[i].style.display = 'none';
      }
    }
    // reset form
    document.querySelector('#meal-form').reset();

    // remove edit&delete button 
    document.querySelector('.deleteBtn').style.display = 'none';
    document.querySelector('.editBtn').style.display = 'none';

    // manifest form button
    document.querySelector('#add-meal').style.display = 'block';
  }

  static onEdit(target){
    
    const meals = Store.getMeals();
    if(target.classList.contains('deleteBtn')){
      meals.forEach((meal, i) => {
        if(meal.id.toString() === target.value){
          meals.splice(i, 1);
        }
      });

      // save to localStorage
      localStorage.setItem('meals', JSON.stringify(meals));
      // remove from UI
      UI.removeFromUI(target);
    }

    // on edit
    if(target.classList.contains('editBtn')){
      meals.forEach((meal, i) => {
        if(meal.id.toString() === target.value){
          meals.splice(i, 1);
        }
      });
      const id = new Date().getSeconds();
      const mealInput = document.getElementById('Meal');
      const caloriesInput = document.getElementById('calories');

      // instantiate meal
      const meal = new Meal(id, mealInput.value, caloriesInput.value);

      // display updat meal
      UI.createMarkup(meal);
      
      meals.push(meal);
      localStorage.setItem('meals', JSON.stringify(meals));
      //document.location.reload(true);
      // remove from UI
      UI.removeFromUI(target)
    }

    // on go back
    if(target.classList.contains('goBack')){
      document.querySelector("#demo").style.display = 'none';
      document.querySelector('#add-meal').style.display = 'block'
      document.querySelector('#meal-form').reset();
    }
  }
}

// Event: DOMContentLoaded
document.addEventListener('DOMContentLoaded', UI.displayMeals(), calories.total());
// Event: add meal
document.querySelector('#meal-form').addEventListener('submit', (e) => {

    // add meal to localS&Display
    const mealInput = document.getElementById('Meal');
    const caloriesInput = document.getElementById('calories');
    const id = new Date().getSeconds();
    if(mealInput.value === '' || caloriesInput.value === ''){
      alert('please fill all the fields');
    } else {
      // instantiate Meal
      const meal = new Meal(id, mealInput.value, caloriesInput.value);
      document.location.reload(true);
      // display meals
      UI.createMarkup(meal);
      
      // display total cal.
      calories.total();

      // store to localStorage
      Store.storeMeal(meal);

      // reset form
      e.target.reset();
    }
  // prevent default beh.
  e.preventDefault();
});


// Event: pencil click
document.querySelector('#table').addEventListener('click', (e) => {

  // if button already appears
  if(document.querySelector('#demo').style.display == 'inline'){
    return '';
  }
  UI.onPencilClick(e.target, e.target.parentElement.parentElement.parentElement.children[0].textContent);
});

// Event: editBtn
document.querySelector('#demo').addEventListener('click', (e) => {

  UI.onEdit(e.target);
  document.location.reload(true);
  calories.total();
});