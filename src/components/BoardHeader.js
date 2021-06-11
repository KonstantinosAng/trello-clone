import React, { useState } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import PaletteIcon from '@material-ui/icons/Palette';
import { useStateValue } from '../utils/StateProvider';
import { Avatar, Button } from '@material-ui/core'
import { actionTypes } from '../utils/reducer';
import { auth } from '../utils/firebase';
import Sidebar from './Sidebar';

function BoardHeader({ setBackgroundColor, name }) {
  const history = useHistory();
  const [className, setClassName] = useState('hidden -right-full');

  const [state, dispatch] = useStateValue();

  const signOut = () => {
    auth.signOut();
    dispatch({
      type: actionTypes.UNSET_USER
    })
  }
  
  const handleSidebar = () => {
    if (className === 'hidden -right-full') {
      setClassName('flex right-0')
    } else {
      setClassName('hidden -right-full')
    }
  }

  return (
    <div className="px-5 py-4 text-left flex items-center">
      <div className="flex flex-grow items-center text-black">
        <ArrowBackIosIcon onClick={()=>history.push('/home')} className="text-4xl cursor-pointer hover:text-white mr-2"/>
        <h2 className="text-3xl"> {name} </h2>
      </div>
      <div className="flex items-center justify-evenly">
        <Avatar className="mx-2 object-contain cursor-pointer" src={state?.user?.photoURL}/>
        <Button className="rounded bg-red-500 px-5 py-2 mx-2 text-gray-200 hover:text-white text-xs sm:text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
        <PaletteIcon onClick={()=>handleSidebar()} className="cursor-pointer text-4xl text-gray-200 hover:text-white" />
        <Sidebar setBackgroundColor={setBackgroundColor} setClassName={setClassName} className={className} />          
      </div>
    </div>
  )
}

export default BoardHeader
