const Notification = ({ message }) => {
  if (!message) {
    return <div className="empty"></div>
  } else {
    return (
      <div className="notif">
        {message}
      </div>
    )
  }
}

export default Notification