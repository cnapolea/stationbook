import { useEffect } from 'react';
import { useState } from 'react';
import {
  CLIENT_ROUTES,
  HTTP_REQUEST_METHOD,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
} from '../lib/constants';
import { useNavigate } from 'react-router-dom';
import fetchData from '../lib/fetchData';
import LoadingSpinner from './LoadingSpinner';
import Error from '../screens/Error';
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

  useEffect(() => {
    const query = new URLSearchParams({ date });
    const reqObj = {
      url: `${SERVER_API_ENDPOINTS.workstationSlots(workstation.id)}?${query}`,
      options: {
        method: HTTP_REQUEST_METHOD.GET,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    };

    fetchData(setters, reqObj, navigate);
  }, [date]);

  function handleCalendarInput(e) {
    setSelectedDate(e.target.value);
  }

  async function bookWorkstation() {
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
      navigate('/my-bookings');
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
                {data.availableSlots.map((slot, i) => (
                  <li key={i}>
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
        <Error error={error} setters={{ setError, setState }} />
      )}
    </>
  );
};
export default WorkstationModal;
