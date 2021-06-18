import React, { useEffect, useState } from 'react';

function InputUser({ userInput, setUserInput, setCollaborationUserEmail, setSubmitEmail, setCollaborationUserNotFound, collaborationUserNotFound }) {
  
  const [emailValidation, setEmailValidation] = useState('');

  /* Handle focus */
  useEffect(() => {
    const handleFocus = () => {
      if (userInput) {
        document.getElementById('board__header__root__user__input').focus();
      }
    }
    handleFocus()
  }, [userInput])
  
  /* Handle blur */
  const handleBlur = () => {
    setUserInput(false)
    document.getElementById('board__header__root__user__input').value = '';
    setCollaborationUserNotFound(false);
  }
  
  /* Handle Email Input */
  const handleEmailInput = () => {
    setCollaborationUserNotFound(false);
    const email = document.getElementById('board__header__root__user__input').value
    if (email === '') {
      setEmailValidation('');
      return
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setCollaborationUserEmail(email);
      setEmailValidation('');
    } else {
      setEmailValidation('border-2 border-red-500');
    }
  }

  /* Handle Submit */
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitEmail(true);
  }

  return (
    <form onSubmit={(event)=>handleSubmit(event)} className="font-bold relative bg-white bg-opacity-30 rounded-lg">
      <input 
      onBlur={() => handleBlur()}
      onChange={() => handleEmailInput()}
      className={`${emailValidation} p-3 shadow-xl bg-white bg-opacity-20 rounded-lg placeholder-white focus:outline-none active:outline-none sm:text-lg text-white ${collaborationUserNotFound ? 'border-b-2 border-red-500' : ''}`} 
      tabIndex={-1} 
      id="board__header__root__user__input" 
      placeholder="User email"
      />
      <h6 className={`${collaborationUserNotFound ? 'block' : 'hidden'} absolute text-red-600 px-1`}> User not found </h6>
    </form>
  )
}

export default InputUser
