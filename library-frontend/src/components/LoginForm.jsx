import { useState } from 'react'
import { LOGIN } from '../services/queries'
import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken, setMessage, setColor }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigate()

    const [userLogin] = useMutation(LOGIN, {
        onError: error => {
            const messages = error.graphQLErrors.map(e => e.message).join('\n')
            setColor('red')
            setMessage(messages)
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        },
    })


    const handleSubmit = async (event) => {
        event.preventDefault()
        const result = await userLogin({ variables: { username: username, password: password } })
        if (result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('jwt', token)
            setMessage('Login success')
            setColor('green')
            navigation('/')
            setTimeout(() => {
                setMessage(null)
                setColor('red')
            }, 4000)
        }

        setUsername('')
        setPassword('')
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
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
