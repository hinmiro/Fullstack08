import { Link, useNavigate } from 'react-router-dom'
import { useApolloClient } from '@apollo/client'

const Navigation = ({ token, setToken }) => {
    const margin = { margin: 10 }
    const client = useApolloClient()
    const navigate = useNavigate()


    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.resetStore()
        navigate("/")
    }


    return (
        <div>
            <Link to={'/'} style={margin}>Books</Link>
            <Link to={'/authors'} style={margin}>Authors</Link>
            {token ? <Link to={'/add'} style={margin}>Add book</Link> : ''}
            {token ? <Link to={'/user/recommend'} style={margin}>Recommendation</Link>: ''}
            {token ? <button onClick={logout}>logout</button> : <Link to={'/login'} style={margin}>Login</Link>}
        </div>
    )
}

export default Navigation
