function TodoListItem({todo, onCompleteTodo}){
    return(
        // treat todo as a string not an object
        <li>
          <form>
            <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
            ></input>
             {todo.title}
          </form>    
        </li>
    );
}
export default TodoListItem;