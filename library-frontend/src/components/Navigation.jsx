import React from 'react';
import {Link} from "react-router-dom";

const Navigation = () => {
    const margin = {margin: 10}
    return (
        <div>
            <Link to={"/"} style={margin}>Books</Link>
            <Link to={"/authors"} style={margin}>Authors</Link>
            <Link to={"/add"} style={margin}>Add book</Link>
        </div>
    );
};

export default Navigation;
