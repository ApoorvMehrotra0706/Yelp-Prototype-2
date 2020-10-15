import React, { Component } from 'react';
import { connect } from 'react-redux';

class NewFoodForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <li
        class="job-form-section-group-viewer-styles__viewer--2SPgS"
        style={{
          background: 'right',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          width: '100%',
          backgroundImage: `url(${this.props.food.ImageUrl})`,
        }}
      >
        <div data-ui="group">
          <form
            onSubmit={this.props.onSaveCreateNew}
            class="yform signup-form  city-hidden"
            id="signup-form"
          >
            <div class="js-password-meter-container">
              <ul class="inline-layout clearfix">
                <li style={{ width: '12%' }}>
                  <p style={{ margin: '5px' }}>Name</p>
                </li>
                <li style={{ width: '38%' }}>
                  <label class="placeholder-sub">Name</label>
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
                  <p style={{ margin: '5px' }}>Price</p>
                </li>
                <li style={{ width: '22%' }}>
                  <label class="placeholder-sub">Price</label>
                  <input
                    id="Price"
                    name="Price"
                    placeholder="Price"
                    required="required"
                    type="number"
                    step="0.01"
                    onChange={(event) => this.props.onPriceChangeHandler(event.target.value)}
                    value={this.props.food.Price}
                  />
                </li>
                <li style={{ width: '8%' }}>
                  <p style={{ margin: '10px' }}>'$'</p>
                </li>
              </ul>

              <ul class="inline-layout clearfix">
                <li style={{ width: '13%' }}>
                  <p style={{ margin: '4px' }}>Cusine:</p>
                </li>

                <li style={{ width: '22%' }}>
                  <label class="placeholder-sub">CUISINE</label>
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
                    {this.props.cuisine.cuisineNames.map((CUISINE) => (
                      <option className="Dropdown-menu" key={CUISINE.key} value={CUISINE.value}>
                        {CUISINE.value}
                      </option>
                    ))}
                  </select>
                </li>
                <li style={{ width: '23%' }}>
                  <p style={{ margin: '5px' }}>Main Ingredients</p>
                </li>
                <li style={{ width: '40%' }}>
                  <label class="placeholder-sub"></label>
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
                  <p style={{ margin: '5px' }}>Description</p>
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
                <li>
                  <label for="image">Update Image</label>
                  <input
                    style={{ cursor: 'pointer' }}
                    type="file"
                    accept="image/*"
                    onChange={(event) => this.props.onChangeFileHandler(event)}
                    //onChange={this.onChangeFileHandler}
                    name="image"
                    id="image"
                    multiple
                    placeholder="update Profile Pic"
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
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  const { cuisine } = state.cuisineReducer;
  return { 
    cuisine: cuisine,
   };
};

export default connect(mapStateToProps,null)(NewFoodForm);
