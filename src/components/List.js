import React from 'react';
import { CssBaseline, Paper } from '@material-ui/core';
import Title from './Title.js';
import Card from './Card.js';
import InputContainer from './InputContainer.js';

function List({ title }) {
  return (
    <div>
      <Paper className="w-80 bg-[#EBECF0] ml-5" >
        <CssBaseline />
        <Title title={title}/>
        <Card title='Make a trello clone'/>
        <Card title='Make a trello clone'/>
        <Card title='Make a trello clone'/>
        <InputContainer inputName="Add a Card"/>
      </Paper>
    </div>
  )
}

export default List
