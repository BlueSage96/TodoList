import { useRef, useState } from 'react';

function TodoForm({onAddTodo}) {
  const todoTitleInput = useRef();
  const [workingTodo, setWorkingTodo] = useState("");

  function handleAddTodo(event){
    // prevents page from refreshing when a user clicks the "Add Todo" button
    event.preventDefault();
    const title = workingTodo.trim(); 
    onAddTodo(title);
    setWorkingTodo("");
    todoTitleInput.current.focus();//adds focus when clicking the "Add Todo" button
  }
  return (
    /*
    When the form submits, the event listener will 
    fire off the function & pass it the submit event's event object
    Disables "Add Todo" button if the input is empty
    */ 
    <form onSubmit={handleAddTodo}>
      <label htmlFor="todoTitle">Todo </label>
      <input 
        id="todoTitle" 
        name="title" 
        ref={todoTitleInput}
        value={workingTodo}
        onChange = {(event) => setWorkingTodo(event.target.value)}
        />
      <button disabled={!workingTodo}>Add Todo</button>
    </form>
  );
}
export default TodoForm;
