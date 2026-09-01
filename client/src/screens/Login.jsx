import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ALERT_TYPES,
  AUTH_TYPE,
  CLIENT_ROUTES,
  FORM_INPUT_TYPES,
  HTTP_REQUEST_METHOD,
  SCREEN_STATES,
} from '../lib/constants';
import authBtnHandler from '../lib/authBtnHandler';
import AuthForm from '../components/AuthForm';
import FormAlert from '../components/FormAlert';

export function Login() {
  const [email, setEmail] = useState({
    name: 'email',
    placeholder: 'Email',
    value: '',
    type: FORM_INPUT_TYPES.EMAIL,
  });
  const [password, setPassword] = useState({
    name: 'password',
    placeholder: 'Password',
    value: '',
    type: FORM_INPUT_TYPES.PASSWORD,
  });
  const [state, setState] = useState(SCREEN_STATES.IDLE);

  const [alertMessage, setAlertMessage] = useState('');

  const inputFields = {
    email: {
      properties: email,
      setValue: setEmail,
    },
    password: {
      properties: password,
      setValue: setPassword,
    },
  };

  const stateManager = {
    getState: () => state,
    changeState: (newState) => setState(newState),
  };

  const reqObj = {
    url: 'http://localhost:4000/auth/login',
    options: {
      method: HTTP_REQUEST_METHOD.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    },
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    await authBtnHandler(inputFields, stateManager, reqObj, setAlertMessage);
  };

  return (
    <>
      {state === SCREEN_STATES.IDLE ? (
        <AuthForm
          authType={AUTH_TYPE.LOGIN}
          inputFields={inputFields}
          onSubmitHandler={handleSubmitBtn}
        />
      ) : state === SCREEN_STATES.ERROR ? (
        <div>
          {alertMessage.trim() !== '' && (
            <FormAlert type={ALERT_TYPES.WARNING} messages={[alertMessage]} />
          )}
          <AuthForm
            authType={AUTH_TYPE.LOGIN}
            inputFields={inputFields}
            onSubmitHandler={handleSubmitBtn}
          />
        </div>
      ) : state === SCREEN_STATES.LOADING ? (
        <LoadingSpinner />
      ) : (
        <Navigate to={CLIENT_ROUTES.WORKSTATIONS} replace={true} />
      )}
    </>
  );
}
