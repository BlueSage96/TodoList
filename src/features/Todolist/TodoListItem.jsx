import { useState, useEffect } from "react";
import InputLabel from "../../shared/TextInputWithLabel.jsx";
import StyledItems from "./TodoListItem.module.css";

function TodoListItem({ todo, onCompleteTodo, onUpdateTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [workingTitle, setWorkingTitle] = useState(todo.title);

  function handleCancel() {
    setWorkingTitle(todo.title);
    setIsEditing(false);
  }

  function handleEdit(event) {
    setWorkingTitle(event.target.value);
  }

  function handleUpdate(event){
    if (!isEditing) return;
    event.preventDefault();
    onUpdateTodo(todo.id, workingTitle);
    setIsEditing(false);
  }

  useEffect(() => {
    setWorkingTitle(todo.title);
  }, [todo]);
  

  return (
    <li className={StyledItems.item}>
      <form onSubmit={handleUpdate}>
        {isEditing ? (
          <>
            <InputLabel
              value={workingTitle}
              //placeholder handler to silence the error (You provided a `value` prop to a form field without an `onChange` handler...) for now
              onChange={handleEdit}
            />
            <button className={StyledItems.update} type="button" onClick={handleUpdate}>Update</button>
            <button className={StyledItems.cancel} type="button" onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          /*
              input:
              onChange event listener that invokes an anonymous function () that returns the helper function (setIsEditing) with the todo object's id
            
            */
          <>
            <label className={StyledItems.container}>
              
              <input type="checkbox"

                // template literals (`${}`) to create a unique id for each checkbox
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
              />
              <span className={StyledItems.check}></span>
            </label>
            <span onClick={() => setIsEditing(true)}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
  );
}

export default TodoListItem;
