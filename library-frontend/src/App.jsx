import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navigation from './components/Navigation.jsx'
import LoginForm from './components/LoginForm.jsx'
import { useEffect, useState } from 'react'
import Recommend from './components/Recommend.jsx'


const App = () => {
    const [token, setToken] = useState(null)
    const [books, setBooks] = useState([])

    useEffect(() => {
        const savedToken = localStorage.getItem('jwt')
        if (savedToken) {
            setToken(savedToken)
        }
    }, [])

    return (
        <div>
            <Router>
                <Navigation token={token} setToken={setToken} />
                <Routes>
                    <Route path="/" element={<Books setAppBooks={setBooks}/>} />
                    <Route path="/authors" element={<Authors token={token} />} />
                    <Route path="/add" element={<NewBook token={token} />} />
                    <Route path="/login" element={<LoginForm setToken={setToken} />} />
                    <Route path="/user/recommend" element={<Recommend books={books} />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
