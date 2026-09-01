import { SCREEN_STATES } from './constants';

const authBtnHandler = async (
  inputFields,
  stateManager,
  reqObj,
  setAlertMessage = null,
) => {
  let localState = SCREEN_STATES.IDLE;

  for (const [, value] of Object.entries(inputFields)) {
    if (value.properties.value.trim() === '') {
      localState = SCREEN_STATES.ERROR;
      value.setValue((cv) => ({
        ...cv,
        error: { message: 'Please fill input field.' },
      }));
    }
  }

  if (localState === SCREEN_STATES.ERROR) {
    stateManager.changeState(SCREEN_STATES.ERROR);
  } else if (
    localState !== SCREEN_STATES.ERROR &&
    inputFields.confirmPassword &&
    inputFields.confirmPassword.properties.value !==
      inputFields.password.properties.value
  ) {
    inputFields.password.setValue((cv) => ({
      ...cv,
      error: { message: 'Passwords do not match.' },
    }));

    stateManager.changeState(SCREEN_STATES.ERROR);
    localState = SCREEN_STATES.ERROR;
  }

  if (localState !== SCREEN_STATES.ERROR) {
    stateManager.changeState(SCREEN_STATES.LOADING);

    const response = await fetch(reqObj.url, { ...reqObj.options });
    const data = await response.json();

    if (!response.ok) {
      console.log('ERROR =====> ', data.errors);
      if (data.errors) {
        data.errors.forEach((error) => {
          inputFields[error.field].setValue((cv) => ({
            ...cv,
            error: { message: error.message },
          }));
        });
      } else {
        setAlertMessage(data.message);
      }
      stateManager.changeState(SCREEN_STATES.ERROR);
    } else if (response.ok) {
      const token = data.token;
      localStorage.setItem('token', token);
      stateManager.changeState(SCREEN_STATES.SUCCESS);
    }
  }
};

export default authBtnHandler;
