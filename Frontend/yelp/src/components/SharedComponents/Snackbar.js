import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateSnackbarData } from '../../reducer/action-types';

class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(this.props.removeSnackbar(), 3000);
  }
  render() {
    const { data } = this.props;
    const { success, message } = data;
    return (
      <div
        className={`${success ? 'green' : '#ff0000'}`}
        style={{
          position: 'fixed',
          top: '15%',
          right: '50%',
          zIndex: '10000',
          backgroundColor: `${success ? '#57e457' : 'red'}`,
        }}
      >
        {message}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  data: state.snackBarReducer.snackbarData,
});

const mapDispatchToProps = (dispatch) => ({
  removeSnackbar: () => {
    dispatch({ type: updateSnackbarData, payload: null });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SnackBar);
