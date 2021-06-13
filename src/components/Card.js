import React from 'react';
import { Paper } from '@material-ui/core';
import { Draggable } from 'react-beautiful-dnd';

function Card({ title, id, position }) {
  return (
    <Draggable draggableId={id} index={position}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.dragHandleProps} {...provided.draggableProps}>
          <Paper className="p-1 pl-2 m-1 cursor-pointer shadow-md">
            {title}
          </Paper>
        </div>
      )}
    </Draggable>
  )
}

export default Card
