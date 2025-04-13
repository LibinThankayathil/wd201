/* eslint-disable no-undef */
const todoList = require("../todo");

const { all, markAsComplete, add, overdue, dueToday, dueLater } = todoList();

const today = new Date().toISOString().slice(0, 10);

// Tomorrow
const tomorrowDate = new Date();
tomorrowDate.setDate(tomorrowDate.getDate() + 1);
const tomorrow = tomorrowDate.toISOString().slice(0, 10);

// Yesterday
const yesterdayDate = new Date();
yesterdayDate.setDate(yesterdayDate.getDate() - 1);
const yesterday = yesterdayDate.toISOString().slice(0, 10);

describe("Todolist Test Suite", () => {
  beforeAll(() => {
    add({
      title: "Test todo",
      completed: false,
      dueDate: today,
    });
    add({
      title: "Test todo 2",
      completed: false,
      dueDate: yesterday,
    });
    add({
      title: "Test todo 3",
      completed: false,
      dueDate: tomorrow,
    });
  });

  test("Should add new todo", () => {
    const todoItemsCount = all.length;
    add({
      title: "Test todo",
      completed: false,
      dueDate: new Date().toISOString().slice(0, 10),
    });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrive the overdue todos", () => {
    expect(overdue().length).toBe(1);
  });

  test("Should retrive the duelater todos", () => {
    expect(dueLater().length).toBe(1);
  });

  test("Should retrive the due today todos", () => {
    expect(dueToday().length).toBe(2);
  });
});
