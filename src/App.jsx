import "./App.css";
import TodoList from "./features/Todolist/TodoList.jsx";
import AddTodoForm from "./features/TodoForm.jsx";
import { useState } from "react";

function App() {
  const [todoList, setTodoList] = useState([]); //initial value is empty array -> causes key pair error

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

  return (
    <div>
      <h1>Todo List</h1>
      {/* onAddTodo is a prop */}
      <AddTodoForm onAddTodo={handleAddTodo} />
      {/* ask about the line below */}
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  );
}

export default App;
