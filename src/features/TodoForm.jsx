import { useRef, useState } from "react";
import InputLabel from "../shared/TextInputWithLabel.jsx";
import StyledForm from "styled-components";

function TodoForm({ onAddTodo, isSaving }) {
  const todoTitleInput = useRef();
  const [workingTodo, setWorkingTodo] = useState("");

  /*
    arugment: event (object)
    line 17: prevents page from refreshing when a user clicks the "Add Todo" button
    line 21: adds focus when clicking the "Add Todo" button
    Convert form to controlled component: updated code to use workingTodo & setWorkingTodo 
    state variables instead of the input values
  */
  function handleAddTodo(event) {
    // prevents page from refreshing when a user clicks the "Add Todo" button
    event.preventDefault();
    const title = workingTodo.trim();
    if(!title) return; //don't submit if title is empty
    onAddTodo(title);
    setWorkingTodo("");
    todoTitleInput.current.focus(); //adds focus when clicking the "Add Todo" button
  }

const Button = StyledForm.button `
    margin: 2px 10px;

    &:disabled {
      font-style: italic;
    }

    &:hover {
      background-color: purple;
      color: white;
      text-shadow: 2px 2px black;
    }
`

  return (
    /*
    When the form submits, the event listener will 
    fire off the function & pass it the submit event's event object
    Disables "Add Todo" button if the input is empty
    */
    <form onSubmit={handleAddTodo}>
      <InputLabel
        labelText="Todo"
        elementId="todoTitle"
        ref={todoTitleInput}
        value={workingTodo}
        onChange={(event) => setWorkingTodo(event.target.value)}
      />

      <Button disabled={!workingTodo}>{isSaving ? "Saving...": "Add Todo"}</Button>
    </form>
  );
}

export default TodoForm;
