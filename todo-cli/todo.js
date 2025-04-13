/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  overdueList = [];
  todayList = [];
  laterList = [];
  listItem = "";

  const today = new Date().toISOString().slice(0, 10);

  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    overdueList = [];

    // Write the date check condition here and return the array
    // of overdue items accordingly.
    for (var i = 0; i < all.length; i++) {
      if (all[i].dueDate < today) {
        overdueList.push({
          title: all[i].title,
          index: i,
          date: all[i].dueDate,
        });
      }
    }
    return overdueList;
  };

  const dueToday = () => {
    todayList = [];
    // Write the date check condition here and return the array
    // of todo items that are due today accordingly.
    for (var i = 0; i < all.length; i++) {
      if (all[i].dueDate === today) {
        todayList.push({ title: all[i].title, index: i, date: today });
      }
    }
    return todayList;
  };

  const dueLater = () => {
    laterList = [];
    // Write the date check condition here and return the array
    // of todo items that are due later accordingly.
    for (var i = 0; i < all.length; i++) {
      if (all[i].dueDate > today) {
        laterList.push({ title: all[i].title, index: i, date: all[i].dueDate });
      }
    }
    return laterList;
  };

  const toDisplayableList = (list) => {
    // Format the To-Do list here, and return the output string
    // as per the format given above.
    var display = "";
    for (var j = 0; j < list.length; j++) {
      if (all[list[j].index].completed === true) {
        listItem = "[x] " + list[j].title;
      } else {
        listItem = "[ ] " + list[j].title;
      }
      if (list[j].date !== today) {
        listItem = listItem + " " + list[j].date + "\n";
      } else {
        listItem = listItem + " " + "\n";
      }
      display += listItem;
    }
    return display.trim();
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

// ####################################### #
// DO NOT CHANGE ANYTHING BELOW THIS LINE. #
// ####################################### #

module.exports = todoList;

const todos = todoList();

const date = new Date();
date.setDate(date.getDate() + 1);
const tomorrow = date.toISOString().slice(0, 10);
date.setDate(date.getDate() - 2);
const yesterday = date.toISOString().slice(0, 10);

todos.add({
  title: "Test todo",
  completed: false,
  dueDate: new Date().toISOString().slice(0, 10),
});

todos.add({
  title: "Test todo 2",
  completed: false,
  dueDate: yesterday,
});

todos.add({
  title: "Test todo 3",
  completed: false,
  dueDate: tomorrow,
});

console.log("My Todo-list\n");

console.log("Overdue");
var overdues = todos.overdue();
var formattedOverdues = todos.toDisplayableList(overdues);
console.log(formattedOverdues);
console.log("\n");

console.log("Due Today");
let itemsDueToday = todos.dueToday();
let formattedItemsDueToday = todos.toDisplayableList(itemsDueToday);
console.log(formattedItemsDueToday);
console.log("\n");

console.log("Due Later");
let itemsDueLater = todos.dueLater();
let formattedItemsDueLater = todos.toDisplayableList(itemsDueLater);
console.log(formattedItemsDueLater);
console.log("\n\n");

console.log(itemsDueLater.length);
console.log(itemsDueToday.length);
console.log(overdues.length);
