//  listTodos.js
const db = require("./models/index");

const listTodo = async () => {
  try {
    await db.Todo.showList();
    await db.Todo.overdue();
  } catch (error) {
    console.error(error);
  }
};
(async () => {
  await listTodo();
})();


