import { useState } from 'react';
import {
  CLIENT_ROUTES,
  HTTP_REQUEST_METHOD,
  RESPONSE_STATUS_CODE,
  SCREEN_STATES,
  SERVER_API_ENDPOINTS,
  BOOKING_STATUS,
  NETWORK_ERROR,
} from '../lib/constants';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchData from '../lib/fetchData';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorScreen from './ErrorScreen';

const MyBookings = () => {
  const token = localStorage.getItem('token');
  const [state, setState] = useState(SCREEN_STATES.IDLE);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const setters = {
    setData,
    setError,
    setState,
  };

  const navigate = useNavigate();

  const myBookingsReqObj = {
    url: SERVER_API_ENDPOINTS.myBookings,
    options: {
      method: HTTP_REQUEST_METHOD.GET,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };

  function handleRetryBtn() {
    setError(null);
    fetchData(setters, myBookingsReqObj, navigate);
  }

  useEffect(() => {
    fetchData(setters, myBookingsReqObj, navigate);
  }, []);

  const handleCancelBtn = async (bookingId) => {
    setState(SCREEN_STATES.LOADING);

    const patchReqObj = {
      url: SERVER_API_ENDPOINTS.patchBooking(bookingId),
      options: {
        method: HTTP_REQUEST_METHOD.PATCH,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: BOOKING_STATUS.CANCELLED,
        }),
      },
    };
    try {
      let response = await fetch(patchReqObj.url, { ...patchReqObj.options });
      let data =
        response.status !== RESPONSE_STATUS_CODE.NON_CONTENT
          ? await response.json()
          : null;

      if (
        !response.ok &&
        response.status === RESPONSE_STATUS_CODE.NOT_AUTHENTICATED
      ) {
        navigate(CLIENT_ROUTES.LOGIN, { replace: true });
      } else if (!response.ok) {
        setError({ statusCode: response.status, message: data.message });
        setState(SCREEN_STATES.ERROR);
      } else {
        await fetchData(setters, myBookingsReqObj, navigate);
      }
    } catch (error) {
      setError({
        statusCode: NETWORK_ERROR.header,
        message: NETWORK_ERROR.body,
      });
      setState(SCREEN_STATES.ERROR);
    }
  };

  return (
    <div>
      {state === SCREEN_STATES.IDLE && <h1>NO ACTIVE BOOKING</h1>}
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
        <div>
          <h1> My Bookings</h1>
          {data.bookings.length > 0 ? (
            data.bookings.map((booking) => (
              <div key={booking.id}>
                <h6>Workstation: {booking.workstation.label}</h6>
                <p className=''>Start Time: {booking.startTime}</p>
                <p>End Time: {booking.endTime}</p>
                <button
                  type='button'
                  onClick={() => handleCancelBtn(booking.id)}
                >
                  Cancel
                </button>
              </div>
            ))
          ) : (
            <div>
              <h2>NO ACTIVE BOOKING</h2>
              <button
                onClick={() => navigate(CLIENT_ROUTES.WORKSTATIONS)}
                className='cursor-pointer'
              >
                Try booking a workstation
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default MyBookings;
