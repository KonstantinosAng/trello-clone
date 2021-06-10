import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router-dom';
import PaletteIcon from '@material-ui/icons/Palette';
import { useStateValue } from '../utils/StateProvider';
import { Avatar, Button } from '@material-ui/core'
import { actionTypes } from '../utils/reducer';
import { auth } from '../utils/firebase';

function BoardHeader({ name }) {
  const history = useHistory();

  const [state, dispatch] = useStateValue();

  const signOut = () => {
    auth.signOut();
    dispatch({
      type: actionTypes.UNSET_USER
    })
  }
  
  return (
    <div className="text-[#0079BF] px-5 py-4 text-left flex items-center">
      <div className="flex flex-grow items-center">
        <ArrowBackIosIcon onClick={()=>history.push('/home')} className="text-4xl cursor-pointer hover:text-[#0079FF] mr-2"/>
        <h2 className="text-3xl"> {name} </h2>
      </div>
      <div className="flex items-center justify-evenly">
        <Avatar className="mx-2 object-contain cursor-pointer" src={state?.user?.photoURL}/>
        <Button className="rounded bg-red-500 px-5 py-2 mx-2 text-gray-300 hover:text-gray-100 text-xs sm:text-xl font-bold active:outline-none" onClick={()=>signOut()}> Logout </Button>
        <PaletteIcon className="cursor-pointer text-4xl hover:text-[#0079FF]"/>
      </div>
    </div>
  )
}

export default BoardHeader
