import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Navigation from "./components/Navigation.jsx";

const App = () => {


    return (
        <div>
            <Router>
                <Navigation/>
                <Routes>
                    <Route path="/" element={<Books/>}/>
                    <Route path="/authors" element={<Authors/>}/>
                    <Route path="/add" element={<NewBook/>}/>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
