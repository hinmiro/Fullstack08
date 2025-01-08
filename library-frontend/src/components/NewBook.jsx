import {useState} from 'react'
import {useMutation} from "@apollo/client";
import {ADD_BOOK, ALL_AUTHORS, ALL_BOOKS} from "../services/queries.js";

const NewBook = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [published, setPublished] = useState(null)
    const [genre, setGenre] = useState('')
    const [genres, setGenres] = useState([])

    const [createBook] = useMutation(ADD_BOOK, {
        refetchQueries: [{query: ALL_AUTHORS}, {query: ALL_BOOKS}]
    })


    const submit = async (event) => {
        event.preventDefault()

        console.log('add book...')

        createBook({variables: {title, published, author, genres}})

        setTitle('')
        setPublished(null)
        setAuthor('')
        setGenres([])
        setGenre('')
    }

    const addGenre = () => {
        setGenres(genres.concat(genre))
        setGenre('')
    }

    return (
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <form onSubmit={submit}>
                <div>
                    title
                    <input
                        value={title}
                        onChange={({target}) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author
                    <input
                        value={author}
                        onChange={({target}) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    published
                    <input
                        type="number"
                        value={published === null ? '' : published}
                        onChange={({target}) => setPublished(parseInt(target.value))}
                    />
                </div>
                <div>
                    <input
                        value={genre}
                        onChange={({target}) => setGenre(target.value)}
                    />
                    <button onClick={addGenre} type="button">
                        add genre
                    </button>
                </div>
                <div>genres: {genres.join(' ')}</div>
                <button type="submit">create book</button>
            </form>
        </div>
    )
}

export default NewBook
