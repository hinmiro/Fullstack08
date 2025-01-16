import GenreSorting from './GenreSorting.jsx'
import { useEffect, useState } from 'react'

const Books = ({ books }) => {
    const [sorted, setSorted] = useState([])
    const [genre, setGenre] = useState('All genres')


    useEffect(() => {
        setSorted(books)
    }, [books])


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
            <GenreSorting books={books} setGenre={setGenre} setSorted={setSorted} />
        </div>
    )
}

export default Books
