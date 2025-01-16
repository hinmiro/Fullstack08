import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Navigation from './components/Navigation.jsx'
import LoginForm from './components/LoginForm.jsx'
import { useEffect, useState } from 'react'
import Recommend from './components/Recommend.jsx'
import { ALL_BOOKS, BOOK_ADDED } from './services/queries'
import Notify from './components/Notify.jsx'

const App = () => {
    const [token, setToken] = useState(null)
    const [books, setBooks] = useState([])
    const [message, setMessage] = useState(null)
    const [color, setColor] = useState(null)

    const { data, loading } = useQuery(ALL_BOOKS)

    useEffect(() => {
        if (data) {
            setBooks(data.allBooks)
        }
    }, [data])


    useEffect(() => {
        const savedToken = localStorage.getItem('jwt')
        if (savedToken) {
            setToken(savedToken)
        }
    }, [])


    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            console.log(data)
            const { bookAdded } = data.data
            console.log(bookAdded)
            setBooks(prevBooks => prevBooks.concat(bookAdded))
            setMessage(`New book added: ${bookAdded.title}`)
            setColor('green')
            setTimeout(() => {
                setMessage(null)
            }, 4000)
        },
    })


    if (loading) {
        return <div>Loading...</div>
    }


    return (
        <div>
            <Router>
                <Navigation token={token} setToken={setToken} setMessage={setMessage} setColor={setColor}/>
                <Notify errorMessage={message} color={color} />
                <Routes>
                    <Route path="/" element={<Books books={books} />} />
                    <Route path="/authors" element={<Authors />} />
                    <Route path="/add" element={<NewBook />} />
                    <Route path="/login"
                           element={<LoginForm setToken={setToken} setMessage={setMessage} setColor={setColor} />} />
                    <Route path="/user/recommend" element={<Recommend books={books} />} />
                </Routes>
            </Router>
        </div>
    )
}

export default App
