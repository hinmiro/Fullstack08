import { useEffect, useState } from 'react'

const GenreSorting = ({ books, setGenre, sorted, setSorted }) => {
    const [selected, setSelected] = useState('All genres')
    const [genres, setGenres] = useState([])


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

    const handleChange = (event) => {
        event.preventDefault()
        const selectedGenre = event.target.value
        setSelected(selectedGenre)
        setGenre(selectedGenre)
        setSorted(selectedGenre === 'All genres' ? books : books.filter(book => book.genres.includes(selectedGenre)))
    }

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
