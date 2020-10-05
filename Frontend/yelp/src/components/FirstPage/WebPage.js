import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import axios from 'axios';
import serverUrl from '../../config';
import './WebPage.css';

class WebPage extends Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  // handle logout to destroy the cookie
  handleLogout = () => {
    axios.delete(serverUrl + 'logout').then((response) => {
      console.log('Status Code : ', response.status);
      if (response.status === 200) {
        this.setState({
          authFlag: false,
        });
      } else {
        this.setState({
          authFlag: true,
        });
      }
    });
    cookie.remove('cookie', { path: '/' });
  };
  render() {
    return (
      <div
        class="y-container homepage-hero"
        style={{
          backgroundImage:
            'url(https://s3-media0.fl.yelpcdn.com/assets/srv0/yelp_large_assets/d9e1a1812e7c/assets/img/home/hero_photos/56iJtZPYDgoy0hSV4Ez5zw.jpg)',
        }}
      >
        <div class="homepage-hero_inner">
          <div class="u-text-centered">
            <h1 class="homepage-hero_logo" id="logo">
              <a href="/webPage">Yelp</a>
            </h1>
          </div>
        </div>
      </div>
    );
  }
}

export default WebPage;
