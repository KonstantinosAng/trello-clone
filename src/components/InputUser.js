import React, { useEffect, useState } from 'react';

function InputUser({ userInput, setUserInput, setUserEmail, setSubmitEmail }) {
  
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
  }
  
  /* Handle Email Input */
  const handleEmailInput = () => {
    const email = document.getElementById('board__header__root__user__input').value
    if (email === '') {
      setEmailValidation('');
      return
    }
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      setUserEmail(email);
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
    <form onSubmit={(event)=>handleSubmit(event)} className="text-black sm:text-lg font-bold">
      <input 
      onBlur={() => handleBlur()}
      onChange={() => handleEmailInput()}
      className={`${emailValidation} bg-white bg-opacity-30 rounded-lg p-3 shadow-xl placeholder-gray-600 focus:outline-none active:outline-none`} 
      tabIndex={-1} 
      id="board__header__root__user__input" 
      placeholder="User email"
      />
    </form>
  )
}

export default InputUser
