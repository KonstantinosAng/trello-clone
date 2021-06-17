import React, { useEffect, useState, Suspense } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PaletteIcon from '@material-ui/icons/Palette';
import { Avatar, Button, InputBase, IconButton } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import AddIcon from '@material-ui/icons/Add';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { useStateValue } from '../utils/StateProvider';
import { signOut, signInWithRedirect } from '../utils/functions';
import LoadingElement from './LoadingElement';
const InputUser = React.lazy(() => import('./InputUser'));
const Sidebar = React.lazy(() => import('./Sidebar'))

function BoardHeader({ author, authorImageURL, projectID, setBackgroundColor, setPhotoUrl, name, setActiveProjectName, history, setCollaborationUserEmail, setSubmitEmail, collaborationUserNotFound, setCollaborationUserNotFound, collaborationUsers }) {
  const [className, setClassName] = useState('hidden -right-full');
  const [changeTitle, setChangeTitle] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInput, setUserInput] = useState(false);
  //eslint-disable-next-line
  const [_, dispatch] = useStateValue();

  /* Hide/show sidebar on click */
  const handleSidebar = () => {
    if (className === 'hidden -right-full') {
      setClassName('flex right-0')
    } else {
      setClassName('hidden -right-full')
    }
  }

  /* Set project name on user change */
  const updateProjectName = (e) => {
    setActiveProjectName(e.target.value);
  }

  /* Show profile menu */
  const handleProfileShow = () => {
    setShowProfile(!showProfile);
  }
  
  /* Handle focus on project title input on click */
  useEffect(() => {
    if (changeTitle) {
      document.getElementById(projectID)?.focus();
    }
  }, [changeTitle, projectID])

  /* Handle focus on Profile menu when open */
  useEffect(() => {
    if (showProfile) {
      document.getElementById('board__header__root__profile__button').focus();
    }
  }, [showProfile])

  /* Handle Add user to project */
  function handleAddUserToProject() {
    setUserInput(!userInput)
  }

  return (
    <div className="px-5 py-4 text-left flex items-center">
      <div className="flex flex-grow items-center">
        <ArrowBackIosIcon onClick={()=>history.push('/home')} className="text-4xl cursor-pointer text-gray-600 hover:text-gray-400 mr-2"/>
        {changeTitle ? (
          <InputBase id={projectID} fullWidth className="text-3xl cursor-pointer p-0 text-white" onBlur={()=>setChangeTitle(!changeTitle)} value={name} onChange={(e)=>updateProjectName(e)}/>
        ) : (
          <h2 onClick={()=>setChangeTitle(!changeTitle)} className="text-white text-3xl cursor-pointer font-semibold rounded-lg p-2 bg-white bg-opacity-20 shadow-md hover:bg-opacity-30 hover:text-gray-100"> {name} </h2>
        )}
      </div>
      <div className="flex items-center justify-evenly">
        <IconButton onClick={()=>handleAddUserToProject()} className={`${author ? 'flex' : 'hidden'} p-3 mx-1 shadow-xs active:outline-none focus:outline-none`}>
          <AddIcon className="object-contain w-8 h-8 text-gray-600 hover:text-gray-400"/>
        </IconButton>
        <div className={`${!userInput && 'hidden'} ${!author && 'hidden'}`}>
          <Suspense fallback={<LoadingElement />}>
            <InputUser 
            setSubmitEmail={setSubmitEmail}
            setCollaborationUserEmail={setCollaborationUserEmail}
            userInput={userInput}
            setUserInput={setUserInput}
            collaborationUserNotFound={collaborationUserNotFound}
            setCollaborationUserNotFound={setCollaborationUserNotFound}
            />
          </Suspense>
        </div>
        {collaborationUsers?.docs.map(doc => (
          <Suspense key={doc.id} fallback={<LoadingElement color=""/>}>
            <div className="relative">
              <Avatar className="w-7 h-7 object-contain mx-1 shadow-xl cursor-pointer" loading="lazy" src={doc.data().imageURL} alt="User Avatar" />
              <FiberManualRecordIcon className="absolute -bottom-1 right-0 text-green-500 w-4 h-4"/>
            </div>
          </Suspense>
        ))}
        <div className="relative flex flex-col">
          <Avatar loading="lazy" onClick={()=>handleProfileShow()} className="mx-2 object-contain shadow-xl cursor-pointer w-10 h-10" src={authorImageURL} />
          <FiberManualRecordIcon className="absolute bottom-[-0.1rem] right-1 text-green-500 w-4 h-4"/>
          <div className={`${showProfile ? 'flex' : 'hidden' } ${!author && 'hidden'} z-50 flex-col justify-center items-center absolute bottom-[-4.5rem] left-[-3.2rem] bg-white bg-opacity-20 hover:bg-opacity-30 hover:text-gray-100 w-40 rounded-xl shadow-xl focus:outline-none active:outline-none`}>
            <ArrowDropUpIcon className="w-full text-white"/>
            <Button id="board__header__root__profile__button" tabIndex={-1} onBlur={()=>handleProfileShow()} onClick={()=>signInWithRedirect()} className="w-full cursor-pointer text-white text-md font-semibold active:outline-none focus:outline-none hover:text-gray-100"> Change User </Button>
          </div>
        </div>
        <Button className="rounded bg-red-500 px-5 py-2 mx-2 text-gray-200 hover:text-white text-xs sm:text-xl font-bold active:outline-none focus:outline-none shadow-xl" onClick={()=>signOut(dispatch)}> Logout </Button>
        <PaletteIcon onClick={()=>handleSidebar()} className="cursor-pointer text-4xl text-gray-600 hover:text-gray-400" />
        <Suspense fallback={<LoadingElement color=""/>}>
          <Sidebar setPhotoUrl={setPhotoUrl} setBackgroundColor={setBackgroundColor} setClassName={setClassName} className={className} />          
        </Suspense>
      </div>
    </div>
  )
}

export default BoardHeader
