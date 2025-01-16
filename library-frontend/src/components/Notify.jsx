const Notify = ({ errorMessage, color = 'red' }) => {
    if (!errorMessage) {
        return null
    }
    return (
        <div style={{
            color: color,
            backgroundColor: color === 'red' ? 'lightpink' : 'lightgreen',
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '15rem',
            margin: '0 auto 2rem auto',
            padding: '1rem',
            borderRadius: '5px',
            fontStyle: color === 'red' ? 'normal' : 'oblique'
        }}>
            {errorMessage}
        </div>
    )
}

export default Notify
