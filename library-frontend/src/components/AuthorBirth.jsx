import {useState} from 'react';
import {useMutation} from "@apollo/client";
import {ALL_AUTHORS, SET_BIRTH} from "../services/queries";

const AuthorBirth = ({setError, authors}) => {
    const [name, setName] = useState('')
    const [setToBorn, setSetToBorn] = useState(null)


    const [setYearOfBirth] = useMutation(SET_BIRTH, {
        refetchQueries: [{query: ALL_AUTHORS}],
        onError: (error) => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            setError(messages)
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    })

    const submit = async (evt) => {
        evt.preventDefault()
        setYearOfBirth({variables: {name, setToBorn}})
        setName('')
        setSetToBorn(null)
    }

    const handleSelection = (evt) => {
        evt.preventDefault()
        setName(evt.target.value)
    }


    return (
        <div>
            <h3>Set Author birth year</h3>
            <form onSubmit={submit}>
                <div>
                    <label style={{marginRight: '1rem'}}>Author name:</label>
                    <select value={name} onChange={handleSelection}>
                        <option value="" disabled>Select author</option>
                        {authors.map(a => (
                            <option key={a.name} value={a.name}>{a.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label style={{marginRight: '1rem'}}>Year or birth:</label>
                    <input value={setToBorn === null ? '' : setToBorn}
                           onChange={({target}) => setSetToBorn(parseInt(target.value))}/>
                </div>
                <button type={'submit'}>submit</button>
            </form>
        </div>
    );
};

export default AuthorBirth;
