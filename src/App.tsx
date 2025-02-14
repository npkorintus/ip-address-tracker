import React, { useState, useEffect } from 'react';
import SimpleMap from './components/SimpleMap';
import './App.css';

import arrowIcon from './assets/icon-arrow.svg';

// const API_KEY = import.meta.env.VITE_API_KEY;
// const API_KEY = '';
// const baseUrl = 'https://geo.ipify.org/api/v2/country,city?';
// const baseUrl = 'https://api.ipgeolocation.io/ipgeo';

function App() {
  type Result = {
    ip: string;
    location: {
      country: string;
      region: string;
      city: string;
      lat: number;
      lng: number;
      postalCode: string;
      timezone: string;
    };
    isp: string;
  }

  type SearchParam = 'ipAddress' | 'domain' | 'invalid' | 'none';

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [inputError, setInputError] = useState<string>('');
  const [searchParam, setSearchParam] = useState<SearchParam>('none');
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<Result>({
    ip: '',
    location: {
      country: '',
      region: '',
      city: '',
      lat: 0,
      lng: 0,
      postalCode: '',
      timezone: '',
    },
    isp: '',
  });

  useEffect(() => {
    // fetch(`${baseUrl}apiKey=${API_KEY}`)
    fetch('data.json')
      .then(response => {
        if (response.ok)
          return response.json();
        else {
          console.log(response.json());
          setError(`Error fetching data: ${response.statusText}`);
          // throw Error('Error fetching data');
        }
      })
      .then(data => setResult(data))
      .catch(error => {
        console.error(error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log(searchParam)
    if (searchParam === 'ipAddress' || searchParam === 'domain') {
      //fetch(`${baseUrl}apiKey=${API_KEY}&${searchParam}=${query}`)
      fetch('data.json')
        .then(response => {
          console.log(response);
          if (response.ok) {
            return response.json()
          } else {
            setError('Error fetching data');
            throw Error('Error fetching data');

          }
        })
        .then(data => setResult(data))
        .catch(error => {
          console.error(error);
          setError(error);
        })
        .finally(() => setLoading(false));
    } else if (searchParam === 'invalid') {
      // alert("Invalid IP address or domain name");
      setInputError('Invalid IP address or domain name');
    }

  }, [searchParam, query]);

  console.log(result);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput((e.target as HTMLInputElement).value);
    setInputError('');
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(input);
    // console.log(isIpOrDomain(input));

    // Remove http:// or https:// from the beginning of the string if present
    const str = input.replace(/^https?:\/\//, '');

    setSearchParam(isIpOrDomain(str));
    setQuery(str);
  }

  function isIpOrDomain(str: string) {
    // Regular expression to check if the string is an IPv4 address
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

    // Regular expression to check if the string is a valid domain name
    const domainPattern = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

    // Check if the string matches IPv4 pattern
    if (ipv4Pattern.test(str)) {
      return 'ipAddress';
    }

    // Check if the string matches domain name pattern
    if (domainPattern.test(str)) {
      return 'domain';
    }

    return 'invalid'; // If neither match
  }

  if (loading) return <div style={{ color: 'white', backgroundColor: 'black' }}>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
    <div className='container'>
      <h1 className='rubik-medium'>IP Address Tracker</h1>
      <form className='form' onSubmit={handleSubmit}>
        <input className='input' required type='text' placeholder='Search for any IP address or domain' value={input} onChange={handleChange} />
        <button className='submit' type='submit'><img src={arrowIcon} /></button>
      </form>
      {inputError && <p className='input-error'>{inputError}</p>}

      {!loading && <>
        <div className='result'>
          <div className='result-item'>
            <small className='label'>IP ADDRESS</small>
            <p>{result.ip}</p>
          </div>
          <div className='divider'></div>
          <div className='result-item'>
            <small className='label'>LOCATION</small>
            <p>{result.location.city} {result.location.postalCode}</p>
          </div>
          <div className='divider'></div>
          <div className='result-item'>
            <small className='label'>TIMEZONE</small>
            <p>UTC{result.location.timezone}</p>
          </div>
          <div className='divider'></div>
          <div className='result-item'>
            <small className='label'>ISP</small>
            <p>{result.isp || '-'}</p>
          </div>
        </div>

      </>}
    
    </div>
    
    <SimpleMap lat={result.location.lat} lng={result.location.lng} />
    </>
  )
}

export default App;
