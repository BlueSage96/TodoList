/*
    Handles sorting & filtering user input and adding the necessary UI
    Also has a search field and clear button
*/
function TodosViewForm ({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {

    function preventRefresh (event) {
        if(event.key === 'Enter'){
            event.preventDefault();
        }
    }
    return(
        <form onSubmit={preventRefresh}>
            <div>
                <label htmlFor="searchInput"> Search Todos: </label>
                <input id="searchInput" type="text" value={queryString} onChange={(e) => {setQueryString(e.target.value)}}></input>
                <button type="button" onClick={() => setQueryString("")}>Clear</button>
            </div>
            <div>
                <label htmlFor="sortBy">Sort By </label>
                <select id="sortBy" value={sortField} onChange={(event) => setSortField(event.target.value)}>
                    <option value="title">Title</option>
                    <option value="createdTime">Time Added</option>
                </select>
        
                <label htmlFor="sortByDir"> Direction </label>
                <select id="sortByDir" value={sortDirection} onChange={(event) => setSortDirection(event.target.value)}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </select>
            </div>
        </form>
    );
}

export default TodosViewForm;