const Error = props => {
  if (!props.message) {
    return <div className="empty"></div>
  } else {
    return (
      <div className="error">
        {props.message}
      </div>
    )
  }
}

export default Error