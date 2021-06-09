import React from 'react';
import { CssBaseline, Paper } from '@material-ui/core';
import Title from './Title.js';
import Card from './Card.js';
import InputContainer from './InputContainer.js';

function List() {
  return (
    <div>
      <Paper className="w-80 bg-[#EBECF0] ml-2" >
        <CssBaseline />
        <Title title='Todo'/>
        <Card title='Make a trello clone'/>
        <Card title='Make a trello clone'/>
        <Card title='Make a trello clone'/>
        <InputContainer inputName="Add a Card"/>
      </Paper>
    </div>
  )
}

export default List
