import React, { Suspense } from 'react';
import LoadingElement from './LoadingElement';
const Label = React.lazy(() => import('./Label'));

function Labels({activeProjectNameListCardLabelsCollection}) {
  return (
    <div className="flex flex-grow items-center border-t-2 border-gray-300 w-full h-[2.5rem] shadow-lg focus:outline-none">
      <Suspense fallback={<LoadingElement/>}>
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-red-500'} />
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-green-500'} />
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-blue-500'} />
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-indigo-500'} />
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-yellow-500'} />
        <Label menu={true} activeProjectNameListCardLabelsCollection={activeProjectNameListCardLabelsCollection} color={'bg-pink-500'} />
      </Suspense>
    </div>
  )
}

export default Labels
