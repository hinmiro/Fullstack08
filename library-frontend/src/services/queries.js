import { gql } from '@apollo/client'

// Fragments

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        author {
            name
            born
        }
        genres
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query fetchAllBooks($author: String, $genre: String){
        allBooks(
            author: $author,
            genre: $genre
        ) {
            title
            published
            author {
                name
                born
            }
            genres
        }
    }
`

export const ADD_BOOK = gql`
    mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
        addBook(
            title: $title,
            published: $published,
            author: $author,
            genres: $genres
        ) {
            title
            published
            author {
                name
                born
            }
            genres
        }
    }
`

export const SET_BIRTH = gql`
    mutation setYearOfBirth($name: String!, $setToBorn: Int!) {
        editAuthor(
            name: $name,
            setToBorn: $setToBorn
        ) {
            name
            born
        }
    }
`

export const LOGIN = gql`
    mutation userLogin($username: String!, $password: String!) {
        login(
            username: $username,
            password: $password
        ) {
            value
        }
    }
`

export const GET_ME = gql`
    query {
        me {
            id
            username
            favoriteGenre
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`


