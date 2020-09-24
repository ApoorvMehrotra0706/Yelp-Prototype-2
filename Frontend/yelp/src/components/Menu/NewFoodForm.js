import React, { Component } from 'react';

class NewFoodForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <li class="job-form-section-group-viewer-styles__viewer--2SPgS">
        <div data-ui="group">
          <form
            onSubmit={this.props.onSaveCreateNew}
            class="yform signup-form  city-hidden"
            id="signup-form"
          >
            <div class="signup-flow on-flow-start">
              <div clas="panel">
                <ul class="inline-layout clearfix">
                  <li style={{ width: '48%' }}>
                    <label class="placeholder-sub">Name </label>
                    <input
                      maxLength="50"
                      id="Name"
                      name="Name"
                      placeholder="Name"
                      required="required"
                      type="text"
                      onChange={(event) => this.props.onNameChangeHandler(event.target.value)}
                      value={this.props.food.Name}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '10%' }}>
                    <p style={{ margin: '5px' }}></p>
                  </li>
                  <li style={{ width: '22%' }}>
                    <label class="placeholder-sub">Price $</label>{' '}
                    <input
                      id="Price"
                      name="Price"
                      placeholder="Price"
                      required="required"
                      type="text"
                      onChange={(event) => this.props.onPriceChangeHandler(event.target.value)}
                      value={this.props.food.Price}
                    />
                  </li>
                  <li style={{ width: '8%' }}>
                    <p style={{ margin: '10px' }}></p>
                  </li>
                </ul>
              </div>
              <ul class="inline-layout clearfix">
                <li style={{ width: '13%' }}>
                  <p style={{ margin: '4px' }}></p>
                </li>

                <li style={{ width: '22%' }}>
                  <label class="placeholder-sub">Cuisine:</label>
                  <select
                    placeholder="CUISINE"
                    className="form-control"
                    onChange={(event) => this.props.onCusineChangeHandler(event.target.value)}
                    value={this.props.food.CuisineID}
                    required
                  >
                    <option className="Dropdown-menu" key="" value="">
                      select
                    </option>
                    {this.props.CUISINES.map((CUISINE) => (
                      <option className="Dropdown-menu" key={CUISINE.key} value={CUISINE.key}>
                        {CUISINE.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '23%' }}>
                  <p style={{ margin: '5px' }}></p>
                </li>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub">Main Ingredients</label>
                  <input
                    maxLength="100"
                    id="MainIngredents"
                    name="MainIngredents"
                    placeholder="Ingredients"
                    type="text"
                    onChange={(event) => this.props.onIngredentsChangeHandler(event.target.value)}
                    value={this.props.food.MainIngredients}
                  />
                </li>
              </ul>

              <ul class="inline-layout clearfix">
                <li style={{ width: '17%' }}>
                  <p style={{ margin: '5px' }}></p>
                </li>

                <li style={{ width: '81%' }}>
                  <label class="placeholder-sub">Description</label>
                  <input
                    maxLength="100"
                    id="Description"
                    name="Description"
                    placeholder="Description"
                    type="text"
                    onChange={(event) => this.props.onDescriptionChangeHandler(event.target.value)}
                    value={this.props.food.Description}
                  />
                </li>
              </ul>
            </div>

            <div style={{ position: 'absolute', bottom: '10px', right: '322px' }}>
              <button
                type="submit"
                data-ui="add-section"
                aria-describedby="education_label"
                class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
              >
                Save
              </button>
            </div>
          </form>
          <div class="job-form-section-group-viewer-styles__dotsWrapper--Jt82u">
            <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
              {
                <a onClick={() => this.props.cancelAddition()} style={{ cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                    {/*<img
                      class="icon_svg"
                      alt="Delete icon"
                      src="https://img.icons8.com/fluent-systems-regular/2x/delete-sign.png"
                      lazy="loaded"
                    ></img>*/}
                    {
                      <path
                        fill="none"
                        d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10"
                      ></path>
                    }
                  </svg>
                </a>
              }
            </span>
          </div>
        </div>
      </li>
    );
  }
}

export default NewFoodForm;
