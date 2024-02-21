import React, { Component } from 'react';
import Loader from '../loader.gif';
import axios from 'axios';
import clientConfig from '../client-config';
import { Navigate, useNavigate } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      loggedIn: false,
      loading: false,
      error: '',
    };
  }

  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleLogin = async () => {
    const { username, password } = this.state;
    const siteUrl = clientConfig.siteUrl;

    try {
      this.setState({ loading: true });
      const response = await axios.post(`${siteUrl}/wp-json/jwt-auth/v1/token`, {
        username,
        password,
      });

      const { token, user_nicename, user_email } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userName', user_nicename);

      this.setState({
        loading: false,
        userNiceName: user_nicename,
        userEmail: user_email,
        loggedIn: true,
      });
     
     
      window.location.reload();
      /* const navigate = useNavigate();
      navigate('/'); */
      
    } catch (error) {
      console.log(error);
      const errorMessage = error.response ? error.response.data.message : 'An error while processing';
      this.setState({ error: errorMessage, loading: false });
    }
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleLogin();
  };

  render() {
    const { username, password, error, loading, loggedIn } = this.state;
  
    
    if (loggedIn) {
      return <Navigate to="/" />;
    }
    return (
      <>
        <div className="jumbotron" style={{ height: '100vh' }}>
          <h4>Login</h4>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={this.handleSubmit}>
            <label className="form-group">
              Username:
              <input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={this.handleOnChange}
              />
            </label>
            <br />
            <label className="form-group">
              Password:
              <input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={this.handleOnChange}
              />
            </label>
            <br />
            <button className="btn btn-primary mb-3" type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {loading && <img className="loader" src={Loader} alt="Loader" />}
          </form>
        </div>
      </>
    );
  }
}

export default Login;
