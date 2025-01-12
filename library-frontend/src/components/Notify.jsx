
const Notify = ({errorMessage, color='red'}) => {
    if ( !errorMessage ) {
        return null
    }
    return (
        <div style={{color: color}}>
            {errorMessage}
        </div>
    )
};

export default Notify;
