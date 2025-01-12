import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Navigation from "./components/Navigation.jsx";
import LoginForm from "./components/LoginForm.jsx";
import {useState} from "react";


const App = () => {
    const [token, setToken] = useState(null)



    return (
        <div>
            <Router>
                <Navigation token={token} setToken={setToken}/>
                <Routes>
                    <Route path="/" element={<Books/>}/>
                    <Route path="/authors" element={<Authors token={token}/>}/>
                    <Route path="/add" element={<NewBook token={token}/>}/>
                    <Route path="/login" element={<LoginForm setToken={setToken}/>}/>
                </Routes>
            </Router>
        </div>
    );
};

export default App;
