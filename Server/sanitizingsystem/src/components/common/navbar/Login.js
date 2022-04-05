import React, { useState } from 'react';
import axios from 'axios';
import { setUserSession } from './Common';
import './login.css';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const [loading, setLoading] = useState(false);
  const username = useFormInput('');
  const password = useFormInput('');
  const [error, setError] = useState(null);
  let navigate = useNavigate()

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://3.91.185.66/api/users/signin', { username: username.value, password: password.value }).then(response => {
      setLoading(false);
      setUserSession(response.data.token, response.data.user);
      window.alert("Successfully logged in!")
      window.location.reload(true);
    }).catch(function (error) {
      setLoading(false);
      if (error.response.status === 401)
      {
        setError('Username or Password is incorrect. Please try again.');
        console.log('Username or Password is incorrect. Please try again.');
      }
      else if (error.response.status === 400)
      {
        setError('Username and Password is required.');
        console.log('Username and Password is required.');
      }
      else
      {
        setError("Something went wrong. Please try again later.");
        console.log('Something went wrong');
      }
    });
  }
  
  if (sessionStorage.getItem('token') === null)
  {
    return (
      <div>
        <section id='page'>
        <div id='glow'>
          Username<br />
          <input type="text" {...username} autoComplete="new-password" />
        </div>
        <div style={{ marginTop: 10 }} id='glow'>
          Password<br />
          <input type="password" {...password} autoComplete="new-password" />
        </div>
        {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />
        <input type="button" class="button" value={loading ? 'Loading...' : 'Login'} onClick={() => handleLogin()} disabled={loading} /><br />
        </section>
      </div>
    );
  }
}

const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}

export default Login;