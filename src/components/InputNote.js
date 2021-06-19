import React from 'react'
import { createNewNote } from '../utils/functions'

function InputNote({ user, projectID}) {
  return (
    <div onClick={()=>createNewNote(user, projectID)} className="text-base w-[11.5rem] ml-5 mt-10 text-gray-700 cursor-pointer p-1 pl-2 m-1 rounded-md bg-[#EBECF0] hover:bg-gray-300 shadow-xl whitespace-nowrap">
      <h2> + Add Note </h2>
    </div>
  )
}

export default InputNote
