import { useEffect, useState } from 'react'
import { LOGIN } from '../services/queries'
import { useMutation } from '@apollo/client'
import Notify from './Notify.jsx'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [color, setColor] = useState('red')
    const navigation = useNavigate()

    const [userLogin] = useMutation(LOGIN, {
        onError: error => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            setError(messages)
            setTimeout(() => {
                setError(null)
            }, 5000)
        },
    })


    const handleSubmit = async (event) => {
        event.preventDefault()
        const result = await userLogin({ variables: { username: username, password: password } })
        if (result.data) {
            const token = result.data.login.value
            console.log(token)
            setToken(token)
            localStorage.setItem('jwt', token)
            setError('Login success')
            setColor('green')
            setTimeout(() => {
                setError(null)
                setColor('red')
                navigation('/')
            }, 2000)
        }

        setUsername('')
        setPassword('')
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <Notify errorMessage={error} color={color} />
                    <h3 style={{ textAlign: 'center' }}>User login</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label style={{ margin: '1rem' }}>Username:</label>
                            <input value={username} onChange={({ target }) => setUsername(target.value)} />
                        </div>
                        <div style={{ marginTop: '5%' }}>
                            <label style={{ margin: '1rem' }}>Password:</label>
                            <input type={'password'} value={password}
                                   onChange={({ target }) => setPassword(target.value)} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5%' }}>
                            <button type={'submit'}>Login</button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginForm
