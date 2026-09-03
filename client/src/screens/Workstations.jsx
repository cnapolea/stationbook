import { useState, useEffect } from 'react';
import {
  HTTP_REQUEST_METHOD,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import Error from './Error';
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

  return (
    <>
      {state === SCREEN_STATES.IDLE && <h1>NO WORKSTATION</h1>}
      {state === SCREEN_STATES.ERROR && <Error error={error} />}
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
