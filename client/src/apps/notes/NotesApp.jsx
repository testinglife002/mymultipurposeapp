import React from 'react'
import EditorContextProvider from './components/EditorContext'
import Notes from './components/Notes'

// console.log("NotesApp loaded");


const NotesApp = ({user}) => {
  return (

  <div style={{ color: "white", padding: "2rem", background: "teal" }}>
    <EditorContextProvider>
      <Notes user={user} />
    </EditorContextProvider>
  </div>
  )
}




export default NotesApp
