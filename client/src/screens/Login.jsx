import { useState } from 'react';
import { FormInputField } from '../components/FormInputField';
import { FormSubmitBtn } from '../components/FormSubmitBtn';
import LoadingSpinner from '../components/LoadingSpinner';

export function Login() {
  let [email, setEmail] = useState(null);
  let [password, setPassword] = useState(null);
  let [state, setState] = useState('idle');

  const handleSubmitBtn = async () => {
    if (!email || !password) {
      alert('Email/Password field cannot be empty.');
      return;
    } else {
      setState('loading');

      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert('Incorrect Email or Password.');
      } else if (response.ok && response.status === 200) {
        setState('success');
        const token = data.token;
        localStorage.setItem('token', token);
        alert('Successful Login');
        console.log(localStorage.getItem('token'));
      }
    }
  };

  return (
    <>
      {state === 'idle' || state === 'success' ? (
        <div>
          <div>
            <FormInputField
              type='email'
              placeholder='Enter Email'
              setStateFn={setEmail}
            />
            <FormInputField
              type='password'
              placeholder='Enter Password'
              setStateFn={setPassword}
            />
          </div>
          <FormSubmitBtn
            type='submit'
            btnText='Submit'
            onSubmitHandler={handleSubmitBtn}
          />
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
