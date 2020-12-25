import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export class MapDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={11}
        initialCenter={{
          lat: 37.33188,
          lng: -121.90525,
        }}
      >
        {this.props.mapCoordinates.map((mapCoordinates) => (
          <Marker
            title={mapCoordinates.title}
            name={mapCoordinates.title}
            position={mapCoordinates.coordinates}
            // position={{ lat: 37.33188, lng: -121.90525 }}
          />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  // apiKey: process.env.APIKEY,
})(MapDisplay);
