import React from 'react';

function Project({ projectName }) {
  return (
    <div className="bg-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 m-5 px-5 py-16 w-full xs:max-w-xs flex flex-grow justify-center place-items-center">
      <h3 className="text-center text-xl xs:text-2xl font-semibold">
        {projectName}
      </h3>
    </div>
  )
}

export default Project
