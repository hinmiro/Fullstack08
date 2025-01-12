import {useQuery} from "@apollo/client"
import {ALL_AUTHORS} from "../services/queries";
import AuthorBirth from "./AuthorBirth.jsx";
import {useState} from "react";
import Notify from "./Notify.jsx";

const Authors = ({token}) => {
    const [error, setError] = useState(null)
    const result = useQuery(ALL_AUTHORS)

    if (result.loading) {
        return <div>Loading data...</div>
    }

    const authors = result.data.allAuthors


    return (
        <div>
            <Notify errorMessage={error} />
            <h2>authors</h2>
            <table>
                <tbody>
                <tr>
                    <th></th>
                    <th>born</th>
                    <th>books</th>
                </tr>
                {authors.map((a) => (
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <AuthorBirth setError={setError} authors={authors}/>
        </div>
    )
}

export default Authors
