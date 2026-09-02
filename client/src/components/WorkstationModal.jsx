import { useEffect } from 'react';
import { useState } from 'react';
import {
  HTTP_REQUEST_METHOD,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import fetchData from '../lib/fetchData';
import LoadingSpinner from './LoadingSpinner';
import Error from '../screens/Error';
import getHourAndMinutes from '../lib/getHourAndMinutes';

const WorkstationModal = ({ workstation, token, clearWorkstation }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  console.log(date);

  const [state, setState] = useState(SCREEN_STATES.IDLE);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const setters = { setData, setState, setError };
  const query = new URLSearchParams({ date });
  const navigate = useNavigate();

  const reqObj = {
    url: `${SERVER_API_ENDPOINTS.workstationSlots(workstation.id)}?${query}`,
    options: {
      method: HTTP_REQUEST_METHOD.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  useEffect(() => {
    fetchData(setters, reqObj, navigate);
  }, [date]);

  function handleCalendarInput(e) {
    setDate(e.target.value);
  }

  return (
    <>
      {state === SCREEN_STATES.LOADED && (
        <div>
          <div>
            <h1>{workstation.label}</h1>
            <button onClick={() => clearWorkstation(null)}>Close</button>
          </div>
          <div>
            {data.availableSlots.length === 0 ? (
              <h2>No slots available</h2>
            ) : (
              <ul>
                <li>{date}</li>
                {data.availableSlots.map((slot, i) => (
                  <li key={i}>
                    <ul>
                      <li>
                        {getHourAndMinutes(slot.startTime)} -{' '}
                        {getHourAndMinutes(slot.endTime)}
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <input
              type='date'
              name='date-selector'
              onChange={handleCalendarInput}
              id='date-selector'
            />
          </div>
        </div>
      )}
      {state === SCREEN_STATES.LOADING && <LoadingSpinner />}
      {state === SCREEN_STATES.ERROR && <Error error={error} />}
    </>
  );
};
export default WorkstationModal;
