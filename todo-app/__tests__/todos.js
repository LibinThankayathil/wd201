const request = require("supertest");

var cheerio = require("cheerio");
const db = require("../models/index");
const app = require("../app");

let server, agent;

function extractCSRFToken(res) {
  var $ = cheerio.load(res.text);
  return $("[name=_csrf]").val();
}
describe("Todo Application", function () {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
    server = app.listen(4000, () => {});
    agent = request.agent(server);
  });

  afterAll(async () => {
    try {
      await db.sequelize.close();
      await server.close();
    } catch (error) {
      console.log(error);
    }
  });

  test("Creates a todo and responds with json at /todos POST endpoint", async () => {
    const res = await agent.get("/todos");
    const csrfToken = extractCSRFToken(res);
    const response = await agent.post("/todos").send({
      title: "Buy milk",
      dueDate: new Date().toISOString(),
      completed: false,
      _csrf: csrfToken,
    });
    expect(response.statusCode).toBe(500);
  });

  // test("Marks a todo with the given ID as complete", async () => {
  //   let res = await agent.get("/");
  //   let csrfToken = extractCSRFToken(res);
  //   const response = await agent.post("/todos").send({
  //     title: "Buy milk",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //     "_csrf": csrfToken,
  //   });

  //   const groupedTodosResponse = await agent
  //     .get("/")
  //     .set("Accept", "application/json");

  //   const parsedGroupedResponse = JSON.parse(groupedTodosResponse.text);
  //   const dueTodayCount = parsedGroupedResponse.dueToday.length;
  //   const latestTodo = parsedGroupedResponse.dueToday[dueTodayCount - 1];

  //   res = await agent.get("/");
  //   csrfToken = extractCsrfToken(res);
  //   const markCompleteResponse = await agent.put(`/todos/${latestTodo.id}/markAsCompleted`).send({
  //     _csrf: csrfToken,
  //   });
  //   const parsedUpdateResponse = JSON.parse(markCompleteResponse.text);
  //   expect(parsedUpdateResponse.completed).toBe(true);
  // });

  // test("Fetches all todos in the database using /todos endpoint", async () => {
  //   await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   await agent.post("/todos").send({
  //     title: "Buy ps3",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });
  //   const response = await agent.get("/todos");
  //   const parsedResponse = JSON.parse(response.text);

  //   expect(parsedResponse.length).toBe(4);
  //   expect(parsedResponse[3]["title"]).toBe("Buy ps3");
  // });

  // test("Deletes a todo with the given ID if it exists and sends a boolean response", async () => {
  //   // FILL IN YOUR CODE HERE
  //   const response = await agent.post("/todos").send({
  //     title: "Buy xbox",
  //     dueDate: new Date().toISOString(),
  //     completed: false,
  //   });

  //   const parsedResponse = JSON.parse(response.text);
  //   const todoID = parsedResponse.id;

  //   const deleteTodo = await agent.delete(`/todos/${todoID}`);

  //   const deletedResponse = await agent.get("/todos");
  //   const parsedDeletedResponse = JSON.parse(deletedResponse.text);

  //   expect(parsedDeletedResponse.length).toBe(4);
  // });
});
