import {
  CLIENT_ROUTES,
  NETWORK_ERROR,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
} from './constants';

const fetchData = async (setters, reqObj, navigate) => {
  setters.setState(SCREEN_STATES.LOADING);

  try {
    const response = await fetch(reqObj.url, { ...reqObj.options });
    const data = await response.json();
    if (
      !response.ok &&
      response.status === RESPONSE_STATUS_CODE.NOT_AUTHENTICATED
    ) {
      navigate(CLIENT_ROUTES.LOGIN, { replace: true });
    } else if (!response.ok) {
      setters.setError({ statusCode: response.status, message: data.message });
      setters.setState(SCREEN_STATES.ERROR);
    } else {
      setters.setData(data);
      setters.setState(SCREEN_STATES.LOADED);
    }
  } catch (error) {
    setters.setError({
      statusCode: NETWORK_ERROR.header,
      message: NETWORK_ERROR.body,
    });
    setters.setState(SCREEN_STATES.ERROR);
  }
};

export default fetchData;
