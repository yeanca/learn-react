import React from "react";

// eslint-disable-next-line react/prop-types
function Search({ searchTerm, setSearchTerm }) {
    return (
        <div className="search">
            <div>
                <img src="search.svg" alt="search" />
                <input
                    type="text"
                    placeholder="Search through thousands of movies"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>
        </div>
    );
}

export default Search;