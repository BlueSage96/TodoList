import StyledPages from '../pages/TodosPage.module.css';
import TodoList from "../features/Todolist/TodoList";
import AddTodoForm from "../features/TodoForm";
import ViewForm from "../features/TodosViewForm";

function TodosPage({onAddTodo,todoState, todoActions,dispatch, currentTodos, onCompleteTodo,
    onUpdateTodo, setSortDirection, setSortField, setQueryString,
}) {
    return (
        <>
            <div className={StyledPages.catWrapper}>
                <div className={StyledPages.todoBody}>
                    {/* onAddTodo is a prop */}
                    <AddTodoForm onAddTodo={onAddTodo} isSaving={todoState.isSaving} />

                    <TodoList currentTodos={currentTodos} onCompleteTodo={onCompleteTodo} 
                     onUpdateTodo={onUpdateTodo} isLoading={todoState.isLoading} 
                    />
                    <hr/>
                    <ViewForm 
                    sortDirection={todoState.sortDirection}
                    setSortDirection={setSortDirection}
                    sortField={todoState.sortField}
                    setSortField={setSortField}
                    queryString={todoState.queryString}
                    setQueryString={setQueryString}
                    />
                    <hr/>
                    {/* Evaluates Error Message */}
                    {todoState.errorMessage && (
                        <div className={StyledPages.error}>
                            <hr/>
                            <p>{todoState.errorMesage}</p>
                            <button onClick={() => dispatch({type: todoActions.clearError})}Dismiss></button>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
export default TodosPage;