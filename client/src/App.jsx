import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState(null);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    async function getStatus() {
      try {
        const response = await fetch('http://localhost:4000/health');

        if (!response.ok) {
          if (response.status >= 500) {
            throw Error(
              'Oooh it seems like there is something wrong with your server',
            );
          } else if (response.status === 404) {
            throw Error('Are you sure this endpoint exists');
          } else throw Error('API Unreachable');
        }

        const body = await response.json();
        setStatus(body.status);
      } catch (e) {
        setErrorStatus(e.message);
      }
    }

    getStatus();
  }, []);

  return (
    <>
      {errorStatus ? (
        <h1>Error: {errorStatus}</h1>
      ) : (
        <h1>{status ? `Status: ${status}` : 'Status: Loading ... '}</h1>
      )}
    </>
  );
}

export default App;
