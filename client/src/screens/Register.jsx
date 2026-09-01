import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

import {
  AUTH_TYPE,
  CLIENT_ROUTES,
  FORM_INPUT_TYPES,
  HTTP_REQUEST_METHOD,
  SCREEN_STATES,
} from '../lib/constants';
import authBtnHandler from '../lib/authBtnHandler';
import AuthForm from '../components/AuthForm';

export function Register() {
  const [firstName, setFirstName] = useState({
    name: 'firstName',
    placeholder: 'First Name',
    value: '',
    type: FORM_INPUT_TYPES.TEXT,
  });
  const [lastName, setLastName] = useState({
    name: 'lastName',
    placeholder: 'Last Name',
    value: '',
    type: FORM_INPUT_TYPES.TEXT,
  });
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
  const [confirmPassword, setConfirmPassword] = useState({
    name: 'confirmPassword',
    placeholder: 'Confirm Password',
    value: '',
    type: FORM_INPUT_TYPES.PASSWORD,
  });

  const [state, setState] = useState(SCREEN_STATES.IDLE);

  const inputFields = {
    firstName: {
      properties: firstName,
      setValue: setFirstName,
    },
    lastName: {
      properties: lastName,
      setValue: setLastName,
    },
    email: {
      properties: email,
      setValue: setEmail,
    },
    password: {
      properties: password,
      setValue: setPassword,
    },
    confirmPassword: {
      properties: confirmPassword,
      setValue: setConfirmPassword,
    },
  };

  const stateManager = {
    getState: () => state,
    changeState: (newState) => setState(newState),
  };

  const reqObj = {
    url: 'http://localhost:4000/auth/register',
    options: {
      method: HTTP_REQUEST_METHOD.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
      }),
    },
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    await authBtnHandler(inputFields, stateManager, reqObj);
  };

  return (
    <>
      {state === SCREEN_STATES.IDLE ? (
        <AuthForm
          authType={AUTH_TYPE.REGISTER}
          inputFields={inputFields}
          onSubmitHandler={handleSubmitBtn}
        />
      ) : state === SCREEN_STATES.ERROR ? (
        <div>
          <AuthForm
            authType={AUTH_TYPE.REGISTER}
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
