import React from 'react'
import EditorContextProvider from './components/EditorContext'
import NotesUI from './components/NotesUI'


const NotesUIApp = ({user}) => {
  return (
    <>
        <EditorContextProvider>
           {<NotesUI user={user} />}
        </EditorContextProvider> 
    </>
  )
}

export default NotesUIApp