import React, { Component } from 'react';
import serverUrl from '../../config';
import axios from 'axios';
import { connect } from 'react-redux';

class NewEventForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      submitError: false,
      // Countries: [],
      // States: [],
      // newEventInfo: {
      //   Name: '',
      //   Description: '',
      //   EventDate: null,
      //   EventStartTime: '00:00:00',
      //   EventEndTime: '00:00:01',
      //   Country: null,
      //   State: null,
      //   City: null,
      //   Zip: null,
      //   Street: '',
      //   hashtags: '',
      // },
    };
  }

  onChangeHandlerName = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      Name: e.target.value,    
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerHashtags = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      hashtags: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerDescription = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      Description: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerCountry = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      Country: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerState = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      State: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerZipCode = (e) => {
    let errors = {};
    if (!/^\d+$/.test(e.target.value)) {
      errors['zipError'] = 'Invalid value!';
      this.setState({
        errors,
      });
    } else {
      this.setState({
        // newEventInfo: { ...this.state.newEventInfo, ...{ Zip: e.target.value } },
        submitError: false,
        errors,
      });
      let payload = {
        Zip: e.target.value,
      };
      this.props.updateNewEvents(payload);
    }
  };

  onChangeHandlerCity = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      City: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerStreet = (e) => {
    this.setState({
      submitError: false,
    });
    let payload = {
      Street: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeDate = (e) => {
    let errors = {};
    const today = new Date();
    const inputDate = new Date(e.target.value);
    if (today <= inputDate) {
      this.setState({
        // newEventInfo: { ...this.state.newEventInfo, ...{ EventDate: e.target.value } },
        errors,
        submitError: false,
      });
      let payload = {
        EventDate: e.target.value,
      };
      this.props.updateNewEvents(payload);
    } else {
      errors['dateError'] = 'Select future Date!';
      this.setState({
        errors,
      });
    }
  };

  onChangeHandlerStartTime = (e) => {
    let errors = {};
    if (e.target.value > this.props.newEvent.EventEndTime) {
      errors['timeError'] = 'Start Time cannot be before end time!';
    }
    this.setState({
      // newEventInfo: { ...this.state.newEventInfo, ...{ EventStartTime: e.target.value } },
      submitError: false,
      errors,
    });
    let payload = {
      EventStartTime: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  onChangeHandlerEndTime = (e) => {
    let errors = {};
    if (e.target.value <= this.props.newEvent.EventStartTime) {
      errors['timeError'] = 'Start Time cannot be before end time!';
    }
    this.setState({
      // newEventInfo: { ...this.state.newEventInfo, ...{ EventEndTime: e.target.value } },
      submitError: false,
      errors,
    });
    let payload = {
      EventEndTime: e.target.value,
    };
    this.props.updateNewEvents(payload);
  };

  componentDidMount() {}
  
  handleClick = () => {
    this.props.toggle();
  };

  validityCheck = () => {};
  handleSubmit = (event) => {
    event.preventDefault();
    if (Object.keys(this.state.errors).length === 0) {
      this.props.createNewEvent(event, this.props.newEvent);
      this.props.toggle();
    }
  };
  render() {
    let errorClass = 'alert alert-error ';
    if (!this.state.submitError) {
      errorClass += 'hidden';
    }
    return (
      <div className="modal" style={{ top: '0', left: '0', width: '100%', height: '100%' }}>
        <div
          className="modal_content"
          style={{ top: '10%', left: '20%', width: '60%', height: '70%' }}
        >
          <span className="close" onClick={this.handleClick}>
            &times;{' '}
          </span>
          <div style={{ marginTop: '3%' }}>
            <div class={errorClass}>
              <p class="alert-message">
                <ul>{this.state.submitErrorBlock}</ul>
              </p>
            </div>
            <form
              onSubmit={(event) => this.handleSubmit(event)}
              class="yform signup-form  city-hidden"
              id="signup-form"
            >
              <div class="js-password-meter-container">
                <ul class="inline-layout clearfix">
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '40%' }}>
                    <label class="placeholder-sub">Event Name</label>
                    <input
                      maxLength="100"
                      placeholder="Event Name"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerName}
                      value={this.props.newEvent.Name}
                    />
                  </li>
                  <li style={{ width: '10%' }}></li>
                  <li style={{ width: '40%' }}>
                    <label class="placeholder-sub">Hashtags</label>
                    <input
                      maxLength="100"
                      placeholder="Hashtags"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerHashtags}
                      value={this.props.newEvent.hashtags}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '40%' }}>
                    <label class="placeholder-sub">Description</label>
                    <input
                      maxLength="500"
                      placeholder="Description max 500 characters"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerDescription}
                      value={this.props.newEvent.Description}
                    />
                  </li>
                </ul>
              </div>
              <fieldset class="login-separator hr-line">
                <legend align="left">Event Location & Timmings</legend>
              </fieldset>

              <div class="js-more-fields more-fields">
                <ul class="inline-layout clearfix">
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '30%' }}>
                    <label class="placeholder-sub">Country</label>
                    <select
                      placeholder="Country"
                      className="form-control"
                      onChange={this.onChangeHandlerCountry}
                      value={this.props.newEvent.Country}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        Country
                      </option>
                      {this.props.staticData.countryNames.map((country) => (
                        <option className="Dropdown-menu" key={country.key} value={country.value}>
                          {country.value}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li style={{ width: '2%' }}></li>
                  <li style={{ width: '25%' }}>
                    <label class="placeholder-sub">State</label>
                    <select
                      placeholder="State"
                      className="form-control"
                      onChange={this.onChangeHandlerState}
                      value={this.props.newEvent.State}
                      required
                    >
                      <option className="Dropdown-menu" key="" value="">
                        State
                      </option>
                      {this.props.staticData.stateNames.map((state) => (
                        <option className="Dropdown-menu" key={state.key} value={state.value}>
                          {state.value}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li style={{ width: '2%' }}></li>
                  <li style={{ width: '15%' }}>
                    <label class="placeholder-sub">Zip Code</label>
                    <input
                      minlength="5"
                      maxlength="5"
                      placeholder="zip Code"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerZipCode}
                      value={this.props.newEvent.Zip}
                    />
                  </li>
                  <li style={{ width: '20%' }}>
                    <span style={{ color: 'red' }}>{this.state.errors['zipError']}</span>
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '30%' }}>
                    <label class="placeholder-sub">City</label>
                    <input
                      id="city"
                      name="city"
                      placeholder="City"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerCity}
                      value={this.props.newEvent.City}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '50%' }}>
                    <label class="placeholder-sub">Street</label>
                    <input
                      id="street"
                      name="street"
                      placeholder="Street"
                      required="required"
                      type="text"
                      onChange={this.onChangeHandlerStreet}
                      value={this.props.newEvent.Street}
                    />
                  </li>
                </ul>

                <ul class="inline-layout clearfix">
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '20%' }}>
                    <label class="">Event Date</label>
                    <input
                      type="date"
                      //step="1"
                      value={this.state.time}
                      className="form-control"
                      placeholder="Time"
                      onChange={this.onChangeDate}
                      value={this.props.newEvent.EventDate}
                    />
                  </li>
                  <li style={{ width: '20%' }}>
                    <span style={{ color: 'red' }}>{this.state.errors['dateError']}</span>
                    <span style={{ color: 'red' }}>{this.state.errors['timeError']}</span>
                  </li>

                  <li style={{ width: '20%' }}>
                    <label class="">Event Start Time</label>
                    <input
                      type="time"
                      step="1"
                      value={this.state.time}
                      className="form-control"
                      placeholder="Start Time"
                      onChange={this.onChangeHandlerStartTime}
                      value={this.props.newEvent.EventStartTime}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '20%' }}>
                    <label class="">Event End Time</label>
                    <input
                      type="time"
                      step="1"
                      value={this.state.time}
                      className="form-control"
                      placeholder="End Time"
                      onChange={this.onChangeHandlerEndTime}
                      value={this.props.newEvent.EventEndTime}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                </ul>
              </div>

              <div>
                <button
                  id="signup-button"
                  type="submit"
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{}}
                >
                  <span>Save</span>
                </button>

                <button
                  class="ybtn ybtn--primary ybtn--big disable-on-submit submit signup-button"
                  style={{
                    marginLeft: '2%',
                  }}
                  onClick={this.handleClick}
                >
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateNewEvents: (payload) => {
      dispatch({
        type: 'update-new-event',
        payload,
      });
    },
  };
};

const mapStateToProps = (state) => {
  const { staticData } = state.staticDataReducer;
  const { newEvent } = state.newEventReducer;
  return {
    staticData: staticData,
    newEvent: newEvent,
    
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewEventForm);
