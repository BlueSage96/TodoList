import { useState, useEffect } from 'react';
import StyledVForm from "styled-components";
/*
    Handles sorting & filtering user input and adding the necessary UI
    Also has a search field and clear button
*/
function TodosViewForm ({ sortDirection, setSortDirection, sortField, setSortField, queryString, setQueryString }) {
    const [localQueryString, setLocalQueryString] = useState(queryString);

    useEffect(() => {
        const debounce = setTimeout(() => setQueryString(localQueryString), 500);
        return function () {
            clearTimeout(debounce);
        }
    }, [localQueryString, setQueryString]);

    function preventRefresh (event) {
        if(event.key === 'Enter'){
            event.preventDefault();
        }
    }

    const Button = StyledVForm.button `
        margin: 2px 8px;
        &:hover {
            background-color: orange;
            text-shadow: 2px 2px black;
        }
    `

    const Label = StyledVForm.label `
        margin: 4px;
        text-shadow: 2px 2px black;
    `

    const Select = StyledVForm.select `
        padding: 4px;
        margin-top: 6px;
        background-color: black;
        border-radius: 4px;
    `

    return(
        <form onSubmit={preventRefresh}>
            <div>
                <Label htmlFor="searchInput"> Search Todos: </Label>
                <input id="searchInput" type="text" value={localQueryString} onChange={(e) => {setLocalQueryString(e.target.value)}}></input>
                <Button type="button" onClick={() => setLocalQueryString("")}>Clear</Button>
            </div>
            <div>
                <Label htmlFor="sortBy">Sort By: </Label>
                <Select id="sortBy" value={sortField} onChange={(event) => setSortField(event.target.value)}>
                    <option value="title">Title</option>
                    <option value="createdTime">Time Added</option>
                </Select>
        
                <Label htmlFor="sortByDir"> Direction: </Label>
                <Select id="sortByDir" value={sortDirection} onChange={(event) => setSortDirection(event.target.value)}>
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                </Select>
            </div>
        </form>
    );
}

export default TodosViewForm;