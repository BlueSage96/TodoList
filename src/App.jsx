import "./App.css";
import TodoList from "./features/Todolist/TodoList.jsx";
import AddTodoForm from "./features/TodoForm.jsx";
import { useState } from "react";

function App() {
  const [todoList, setTodoList] = useState([]); 

  /* 
    Argument: newTask (originally newTodo)
    Gives newTodo three properties: title, id, and isCompleted
    calls todoList state variable containing a destructured (...) todoList and newTodo
  */
  function handleAddTodo(newTask) {
    const newTodo = { title: newTask, id: Date.now(), isCompleted: false };
    setTodoList([...todoList, newTodo]); //destructured
  }

  /*
    Argument: id
    Maps through todoList:
    1: if current todo.id == id -> return a new object that destructures current todo (...todo) & isCompleted is set to true
    2: Else if current todo.id != id -> return todo
  */
  function completeTodo(id) {
    const updatedTodos = todoList.map((todo) => {
      return todo.id === id ? { ...todo, isCompleted: true } : todo;
    });
    setTodoList(updatedTodos);
  }

  function updateTodo(id, newTitle){
    const editedTodos = todoList.map((todo) => {
        return todo.id === id ? {...todo, title: newTitle} : todo; 
    });
    setTodoList(editedTodos)
  }

  return (
    <div>
      <h1>Todo List</h1>
      {/* onAddTodo is a prop */}
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} onUpdateTodo={updateTodo}/>
    </div>
  );
}

export default App;