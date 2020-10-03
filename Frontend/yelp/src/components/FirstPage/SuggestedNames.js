import React, { Component } from 'react';

class SuggestedNames extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ul className="suggestions-list">
        {this.props.searchStrings.map((string) => (
          <li
            class="item suggestion suggestions-list-item "
            role="option"
            tabindex="0"
            aria-label="category"
            onClick={() => this.props.openRestroListPage(string)}
          >
            <div class="media-block">
              <div class="media-story">
                <span class="suggestion-detail">
                  <span class="suggestion-detail suggestion-title suggestion-name">{string}</span>
                </span>
                <small class="suggestion-detail suggestion-subtitle suggestion-location"></small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default SuggestedNames;
