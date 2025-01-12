import { useQuery } from '@apollo/client'
import { GET_ME } from '../services/queries.js'
import { useEffect, useState } from 'react'

const Recommend = ({ books }) => {
    const { data, loading, error } = useQuery(GET_ME)
    const [user, setUser] = useState(null)

    useEffect(() => {
        if (data) {
            const me = data.me
            setUser(me)
        }
    }, [data])


    if (loading) return <p>Loading user data...</p>
    if (error) return <p>Error: {error.message}</p>
    if (!user) return <p>User data is not available.</p>


    console.log(user)
    const recommendedBooks = books.filter(book => book.genres.includes(user.favoriteGenre))
    console.log(books)

    return (
        <>
            <h2>Recommend books</h2>
            <br />
            <br />
            <p>Books by your favourite genre: {user.favoriteGenre}</p>
            <table>
                <tbody>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Published</th>
                </tr>
                {recommendedBooks.map(b => (
                    <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default Recommend
