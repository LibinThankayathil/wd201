// clearTodos.js
const db = require("./models/index");

(async () => {
  try {
    await db.Todo.destroy({
      where: {},
      truncate: true, // Optional: Resets auto-increment counter too
    });
    console.log("All todos deleted!");
  } catch (error) {
    console.error("Error deleting todos:", error);
  }
})();
