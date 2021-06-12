import React from 'react';
import { Paper } from '@material-ui/core';

function Card({ title }) {
  return (
    <div>
      <Paper className="p-1 pl-2 m-1 cursor-pointer shadow-md">
        {title}
      </Paper>
    </div>
  )
}

export default Card
