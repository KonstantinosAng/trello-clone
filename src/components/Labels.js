import React, { Suspense } from 'react';
import LoadingElement from './LoadingElement';
const Label = React.lazy(() => import('./Label'));

function Labels() {
  return (
    <div className="flex flex-grow flex-wrap w-full">
      <Suspense fallback={<LoadingElement/>}>
        <Label />
      </Suspense>
    </div>
  )
}

export default Labels
