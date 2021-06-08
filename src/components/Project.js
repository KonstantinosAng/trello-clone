import React from 'react';

function Project({ projectName }) {
  return (
    <div className="p-14 m-5 bg-gray-300 w-32 rounded-lg flex justify-center text-center cursor-pointer hover:bg-gray-100">
      <h3 className="whitespace-nowrap text-center text-lg font-semibold">
        {projectName}
      </h3>
    </div>
  )
}

export default Project
