import React from 'react'
import { Link } from "react-router-dom";

function Newletter() {
  return (
    <div>
      <nav className="navbar navbar-light bg-light px-3">
        <Link className="navbar-brand" to="/">Newsletter Dashboard</Link>
        <div>
          <Link className="btn btn-outline-primary mx-1" to="/create-template">
            Create Template
          </Link>
          <Link className="btn btn-outline-success" to="/send-newsletter">
            Send Newsletter
          </Link>
        </div>
      </nav>
    </div>
  )
}

export default Newletter
