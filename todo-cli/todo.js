const todoList = () => {
    all = []
    overdueList = []
    todayList = []
    laterList = []
    listItem = ""
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      for(var i = 0; i < all.length; i++){
        if (all[i].dueDate < today){
            overdueList.push({title:all[i].title, index:i, date:all[i].dueDate});
        }
        }
        return overdueList;
    }
  
    const dueToday = () => {
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
      for(var i = 0; i < all.length; i++){
        if (all[i].dueDate === today){
            todayList.push({title:all[i].title, index:i, date:today});
        }
        }
        return todayList;
    }
  
    const dueLater = () => {
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
      for(var i = 0; i < all.length; i++){
        if (all[i].dueDate > today){
            laterList.push({title:all[i].title, index:i, date:all[i].dueDate});
        }
        }
        return laterList;
    }
  
    const toDisplayableList = (list) => {
      // Format the To-Do list here, and return the output string
      // as per the format given above.
      var display = "";
      for(var j = 0; j < list.length; j++){

        if (all[list[j].index].completed === true){
            listItem = "[x] " + list[j].title;
        }else{
            listItem = "[ ] " + list[j].title;
        }
        if (list[j].date !== today){
            listItem =listItem + " " + list[j].date + "\n";
        }else{
            listItem =listItem + " " + "\n";
        }
        display += listItem;
      }
      return display.trim();
    }
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  
 module.exports = todoList;