import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { ALL_BOOKS } from '../services/queries.js'

const GenreSorting = ({ books, setGenre, setSorted }) => {
    const [selected, setSelected] = useState('All genres')
    const [genres, setGenres] = useState([])

    const [fetchBooks, { data, loading, error }] = useLazyQuery(ALL_BOOKS)


    useEffect(() => {
        if (books) {
            const incomingGenres = []
            books.map(b => {
                b.genres.forEach(g => {
                    if (!incomingGenres.includes(g)) {
                        incomingGenres.push(g)
                    }
                })
            })
            setGenres(incomingGenres)
        }
    }, [books])

    useEffect(() => {
        if (data) {
            setSorted(data.allBooks)
        }
    }, [data, setSorted])


    const handleChange = (event) => {
        event.preventDefault()
        const selectedGenre = event.target.value
        setSelected(selectedGenre)
        setGenre(selectedGenre)

        if (selectedGenre === 'All genres') {
            setSorted(books)
        } else {
            fetchBooks({ variables: { genre: selectedGenre } })
        }
    }

    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error.message}</p>

    return (
        <div>
            <div>
                <select value={selected} onChange={handleChange}>
                    <option value="All genres">All genres</option>
                    {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default GenreSorting
