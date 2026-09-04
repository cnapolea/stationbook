import { useEffect } from 'react';
import { useState } from 'react';
import {
  CLIENT_ROUTES,
  HTTP_REQUEST_METHOD,
  NETWORK_ERROR,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import fetchData from '../lib/fetchData';
import LoadingSpinner from './LoadingSpinner';
import ErrorScreen from '../screens/ErrorScreen';
import getHourAndMinutes from '../lib/getHourAndMinutes';

const WorkstationModal = ({ workstation, token, clearModal }) => {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  const [state, setState] = useState(SCREEN_STATES.IDLE);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const setters = { setData, setState, setError };
  const navigate = useNavigate();

  const query = new URLSearchParams({ date });

  const slotsReqObj = {
    url: `${SERVER_API_ENDPOINTS.workstationSlots(workstation.id)}?${query}`,
    options: {
      method: HTTP_REQUEST_METHOD.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
  useEffect(() => {
    fetchData(setters, slotsReqObj, navigate);
  }, [date]);

  function handleCalendarInput(e) {
    setSelectedDate(e.target.value);
  }

  function handleRetryBtn() {
    setError(null);
    fetchData(setters, slotsReqObj, navigate);
  }

  async function bookWorkstation() {
    setState(SCREEN_STATES.LOADING);

    const reqObj = {
      url: SERVER_API_ENDPOINTS.bookings,
      options: {
        method: HTTP_REQUEST_METHOD.POST,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workstationId: workstation.id,
          startTime: selectedSlot.startTime,
        }),
      },
    };
    try {
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
        clearModal(null);
        navigate(CLIENT_ROUTES.MY_BOOKINGS);
      }
    } catch (error) {
      setError({
        statusCode: NETWORK_ERROR.header,
        message: NETWORK_ERROR.body,
      });
      setState(SCREEN_STATES.ERROR);
    }
  }

  return (
    <>
      {state === SCREEN_STATES.LOADED && (
        <div>
          <div>
            <h1>{workstation.label}</h1>
            <button onClick={() => clearModal(null)}>Close</button>
          </div>
          <div>
            {data.availableSlots.length === 0 ? (
              <h2>No slots available</h2>
            ) : (
              <ul>
                <li>{date}</li>
                {data.availableSlots.map((slot) => (
                  <li key={slot.startTime}>
                    <ul>
                      <li
                        onClick={() => setSelectedSlot(slot)}
                        className='cursor-pointer'
                      >
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
              value={selectedDate}
              min={today}
            />
            <button type='button' onClick={() => setDate(selectedDate)}>
              Search
            </button>
          </div>
          {selectedSlot && (
            <div>
              <button type='button' onClick={bookWorkstation}>
                Book
              </button>
              <button type='button' onClick={() => setSelectedSlot(null)}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      {state === SCREEN_STATES.LOADING && <LoadingSpinner />}
      {state === SCREEN_STATES.ERROR && (
        <div>
          <button onClick={() => clearModal(null)}>Close</button>
          <ErrorScreen error={error} setters={{ setError, setState }} />
          {(error.statusCode >= RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR ||
            error.statusCode === NETWORK_ERROR.header) && (
            <button type='button' onClick={handleRetryBtn}>
              Retry
            </button>
          )}
        </div>
      )}
    </>
  );
};
export default WorkstationModal;
