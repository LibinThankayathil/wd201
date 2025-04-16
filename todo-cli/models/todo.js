// models/todo.js
'use strict';
const { Op } = require("sequelize");

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log('My Todo list \n');

      console.log('Overdue');
      // FILL IN HERE     
      await this.overdue(); 
      console.log('\n');

      console.log('Due Today');
      // FILL IN HERE
      await this.dueToday();
      console.log('\n');

      console.log('Due Later');
      // FILL IN HERE
      await this.dueLater();
    }

    static async overdue() {
      try{
        const todos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.lt]: new Date(), // Less than or equal to targetDate
            },
          }
        });
          const todoList = todos.map(todo => todo.displayableString()).join('\n');
        console.log(todoList);
        return todos

      
      // FILL IN HERE TO RETURN OVERDUE ITEMS
    } catch(error){
      console.error(error);
    }

      

    }

    static async dueToday() {
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
      try{
        const todos = await Todo.findAll({
          where: {
            dueDate: new Date(),
          }
        });
        
          const todoList = todos.map(todo => todo.displayableString()).join('\n');
        console.log(todoList);
        return todos
    } catch(error){
      console.error(error);
    }
    }

    static async dueLater() {
      // FILL IN HERE TO RETURN ITEMS DUE LATER
      try{
        const todos = await Todo.findAll({
          where: {
            dueDate: {
              [Op.gt]: new Date(), // Less than or equal to targetDate
            },
          }
        });
        
        const todoList = todos.map(todo => todo.displayableString()).join('\n');
        // }
        console.log(todoList);
          return todos
    } catch(error){
      console.error(error);
    }
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      try{
        await Todo.update({completed: true}, {
          where: {
            id: id
          }
        });
    } catch(error){
      console.error(error);
    }
    }

    displayableString() {
      let checkbox = this.completed ? '[x]' : '[ ]';
      const today = new Date().toISOString().split("T")[0];
      if (this.dueDate === today) {
        return `${this.id}. ${checkbox} ${this.title}`;
      }
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate}`;
    }

  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Todo',
    },
  );
  return Todo;
};



