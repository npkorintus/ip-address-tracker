import React, { useState, useEffect } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_API_KEY;
const baseUrl = 'https://geo.ipify.org/api/v2/country,city?';

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

  const [input, setInput] = useState<string>('');
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
    fetch(`${baseUrl}apiKey=${API_KEY}`)
      .then(response => response.json())
      .then(data => setResult(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (searchParam === 'ipAddress' || searchParam === 'domain') {
      fetch(`${baseUrl}apiKey=${API_KEY}&${searchParam}=${query}`)
        .then(response => response.json())
        .then(data => setResult(data))
        .catch(error => console.error(error));
    } else if (searchParam === 'invalid') {
      alert("Invalid IP address or domain name");
    }
  }, [searchParam, query]);

  console.log(result);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInput((e.target as HTMLInputElement).value);
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
  

  return (
    <>
      <h1>IP Address Tracker</h1>
      <form onSubmit={handleSubmit}>
        <input required type='text' placeholder='Search for any IP address or domain' value={input} onChange={handleChange} />
        <input type='submit' value='>' />
      </form>
      <div className='result'>
        <div>
          <small>IP ADDRESS: </small>
          <b>{result.ip}</b>
        </div>
        <div>
          <small>LOCATION: </small>
          <b>{result.location.city} {result.location.postalCode}</b>
        </div>
        <div>
          <small>TIMEZONE: </small>
          <b>UTC{result.location.timezone}</b>
        </div>
        <div>
          <small>ISP: </small>
          <b>{result.isp}</b>
        </div>
      </div>
    </>
  )
}

export default App;
