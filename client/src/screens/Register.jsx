import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import LoginForm from '../components/LoginForm';
import FormAlert from '../components/FormAlert';
import {
  ALERT_TYPES,
  HTTP_REQUEST_METHOD,
  SCREEN_STATES,
} from '../lib/constants';

export function Register() {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  let [state, setState] = useState(SCREEN_STATES.IDLE);
  let [alertMessage, setAlertMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmitBtn = async () => {
    if ([firstName, lastName, email, password].includes(null)) {
      setAlertMessage('All fields must be filled.');
      setState(SCREEN_STATES.ERROR);
      return;
    } else {
      setState(SCREEN_STATES.LOADING);
      const response = await fetch('http://localhost:4000/auth/login', {
        method: HTTP_REQUEST_METHOD.POST,
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
        setAlertMessage('Incorrect Email or Password.');
        setState(SCREEN_STATES.ERROR);
      } else if (response.ok && response.status === 200) {
        const token = data.token;
        localStorage.setItem('token', token);
        setState(SCREEN_STATES.SUCCESS);
        setAlertMessage('Successful Login');
        navigate('/workstation', {
          replace: true,
        });
      }
    }
  };

  return (
    <>
      {state === SCREEN_STATES.IDLE ? (
        <LoginForm
          setEmailFn={setEmail}
          setPasswordFn={setPassword}
          handleSubmitBtnFn={handleSubmitBtn}
        />
      ) : state === SCREEN_STATES.ERROR ? (
        <div>
          <FormAlert type={ALERT_TYPES.WARNING} message={alertMessage} />
          <LoginForm
            setEmailFn={setEmail}
            setPasswordFn={setPassword}
            handleSubmitBtnFn={handleSubmitBtn}
          />
        </div>
      ) : state === SCREEN_STATES.LOADING ? (
        <LoadingSpinner />
      ) : (
        <FormAlert type={ALERT_TYPES.SUCCESS} message={alertMessage} />
      )}
    </>
  );
}
