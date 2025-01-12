import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../services/queries.js'
import GenreSorting from './GenreSorting.jsx'
import { useEffect, useState } from 'react'

const Books = ({setAppBooks}) => {
    const [books, setBooks] = useState([])
    const [sorted, setSorted] = useState([])
    const [genre, setGenre] = useState('All genres')

    const result = useQuery(ALL_BOOKS)

    useEffect(() => {
        if (result.data) {
            setBooks(result.data.allBooks)
            setSorted(result.data.allBooks)
            setAppBooks(result.data.allBooks)
        }
    }, [result.data])


    if (result.loading) {
        return <div>Loading data...</div>
    }


    return (
        <div>
            <h2>Books</h2>
            <p>Books in genre: {genre}</p>
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>author</th>
                    <th>published</th>
                </tr>
                {sorted.map((a) => (
                    <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <GenreSorting books={books} setGenre={setGenre} sorted={sorted} setSorted={setSorted} />
        </div>
    )
}

export default Books
