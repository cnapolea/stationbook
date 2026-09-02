import { useState, useEffect } from 'react';
import {
  CLIENT_ROUTES,
  HTTP_REQUEST_METHOD,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import Error from './Error';
import LoadingSpinner from '../components/LoadingSpinner';

const Workstations = () => {
  const token = localStorage.getItem('token');
  const [workstations, setWorkstations] = useState([]);
  const [state, setState] = useState(SCREEN_STATES.IDLE);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const reqObj = {
    url: SERVER_API_ENDPOINTS.workstations,
    options: {
      method: HTTP_REQUEST_METHOD.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  useEffect(() => {
    async function fetchWorkstations() {
      setState(SCREEN_STATES.LOADING);

      const response = await fetch(reqObj.url, { ...reqObj.options });
      const data = await response.json();

      if (
        !response.ok &&
        response.status === RESPONSE_STATUS_CODE.NOT_AUTHENTICATED
      ) {
        navigate(CLIENT_ROUTES.LOGIN, { replace: true });
      } else if (!response.ok) {
        setError({ statusCode: response.status, message: data.message });
        setState(SCREEN_STATES.ERROR);
      } else {
        setWorkstations(data.workstations);
        setState(SCREEN_STATES.LOADED);
      }
    }

    fetchWorkstations();
  }, []);

  return (
    <>
      {state === SCREEN_STATES.IDLE && <h1>NO WORKSTATION</h1>}
      {state === SCREEN_STATES.ERROR && <Error error={error} />}
      {state === SCREEN_STATES.LOADING && <LoadingSpinner />}
      {state === SCREEN_STATES.LOADED && (
        <ul>
          {workstations.map((workstation, i) => (
            <li key={i}>label: {workstation.label}</li>
          ))}
        </ul>
      )}
    </>
  );
};
export default Workstations;
