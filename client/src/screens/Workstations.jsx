import { useState, useEffect } from 'react';
import {
  HTTP_REQUEST_METHOD,
  NETWORK_ERROR,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import ErrorScreen from './ErrorScreen';
import LoadingSpinner from '../components/LoadingSpinner';
import WorkstationModal from '../components/WorkstationModal';
import fetchData from '../lib/fetchData';

const Workstations = () => {
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);
  const [state, setState] = useState(SCREEN_STATES.IDLE);
  const [error, setError] = useState(null);
  const [selectedWorkstation, setSelectedWorkstation] = useState(null);

  const navigate = useNavigate();

  const setters = {
    setData,
    setState,
    setError,
  };
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
    fetchData(setters, reqObj, navigate);
  }, []);

  function handleRetryBtn() {
    setError(null);
    fetchData(setters, reqObj, navigate);
  }

  return (
    <>
      {state === SCREEN_STATES.IDLE && <h1>NO WORKSTATION</h1>}
      {state === SCREEN_STATES.ERROR && (
        <div>
          <ErrorScreen error={error} />
          {(error.statusCode >= RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR ||
            error.statusCode === NETWORK_ERROR.header) && (
            <button type='button' onClick={handleRetryBtn}>
              Retry
            </button>
          )}
        </div>
      )}
      {state === SCREEN_STATES.LOADING && <LoadingSpinner />}
      {state === SCREEN_STATES.LOADED && (
        <div className='flex flex-row'>
          <ul className={`flex-auto ${selectedWorkstation && 'flex-2/3'}`}>
            {data.workstations.map((workstation) => (
              <li
                className='cursor-pointer'
                key={workstation.id}
                onClick={() => setSelectedWorkstation(workstation)}
              >
                label: {workstation.label}
              </li>
            ))}
          </ul>
          {selectedWorkstation && (
            <WorkstationModal
              key={selectedWorkstation.id}
              workstation={selectedWorkstation}
              token={token}
              clearModal={setSelectedWorkstation}
            />
          )}
        </div>
      )}
    </>
  );
};
export default Workstations;
