import React, { Component } from 'react';
import { connect } from 'react-redux';

class Food extends Component {
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
            onSubmit={(e) => {this.props.onSave(e)}}
            class="yform signup-form  city-hidden"
            id="signup-form"
          >
            <fieldset disabled={this.props.food.ID !== this.props.editableId && 'disabled'}>
              <div class="js-password-meter-container">
                <ul class="inline-layout clearfix">
                  {/* <li style={{ width: '12%' }}>
                    <p style={{ margin: '5px' }}>Name</p>
                  </li> */}
                  <li style={{ width: '38%' }}>
                    <label class="placeholder-sub">Name</label>
                    <input
                      maxLength="50"
                      id="first_name"
                      name="first_name"
                      placeholder="Name"
                      required="required"
                      type="text"
                      onChange={(event, id) =>
                        this.props.onNameChangeHandler(event.target.value, this.props.food.ID)
                      }
                      value={this.props.food.Name}
                    />
                  </li>
                  <li style={{ width: '5%' }}></li>
                  <li style={{ width: '10%' }}>
                    <p style={{ margin: '5px' }}></p>
                  </li>
                  <li style={{ width: '22%' }}>
                    <label class="placeholder-sub">Price</label>
                    <input
                      id="first_name"
                      name="first_name"
                      //placeholder="Price"
                      required="required"
                      type="text"
                      onChange={(event, id) =>
                        this.props.onPriceChangeHandler(event.target.value, this.props.food.ID)
                      }
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
                      placeholder="countryCode"
                      className="form-control"
                      onChange={(event, id) =>
                        this.props.onCusineChangeHandler(event.target.value, this.props.food.ID)
                      }
                      value={this.props.food.CuisineID}
                      required
                    >
                      <option className="Dropdown-menu" key="" value=""></option>
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
                    <label class="placeholder-sub">Main Ingredients</label>
                    <input
                      maxLength="100"
                      id="phoneNo"
                      name="phoneNo"
                      placeholder="Ingredients"
                      required="required"
                      type="text"
                      onChange={(event, id) =>
                        this.props.onIngredentsChangeHandler(event.target.value, this.props.food.ID)
                      }
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
                      id="city"
                      name="city"
                      placeholder="City"
                      required="required"
                      type="text"
                      onChange={(event, id) =>
                        this.props.onDescriptionChangeHandler(
                          event.target.value,
                          this.props.food.ID
                        )
                      }
                      value={this.props.food.Description}
                    />
                  </li>
                </ul>
                {this.props.food.ID === this.props.editableId && (
                  <ul>
                    <li style={{ width: '30%' }}></li>
                    <li style={{ width: '60%' }}>
                      {' '}
                      <label for="image">Update Image</label>
                      <input
                        style={{ cursor: 'pointer' }}
                        type="file"
                        accept="image/*"
                        onChange={(event) => this.props.onChangeFileHandlerOld(event)}
                        //onChange={this.onChangeFileHandler}
                        name="image"
                        id="image"
                        multiple
                        placeholder="update Profile Pic"
                      />
                    </li>
                  </ul>
                )}
              </div>
              {this.props.food.ID === this.props.editableId && (
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
              )}
            </fieldset>
          </form>
          {this.props.food.ID !== this.props.editableId && (
            <div class="job-form-section-group-viewer-styles__dotsWrapper--Jt82u">
              <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
                <a
                  onClick={() => this.props.makeEditable(this.props.food.ID)}
                  style={{ cursor: 'pointer' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                    <path
                      d="none"
                      d="M19.404,6.65l-5.998-5.996c-0.292-0.292-0.765-0.292-1.056,0l-2.22,2.22l-8.311,8.313l-0.003,0.001v0.003l-0.161,0.161c-0.114,0.112-0.187,0.258-0.21,0.417l-1.059,7.051c-0.035,0.233,0.044,0.47,0.21,0.639c0.143,0.14,0.333,0.219,0.528,0.219c0.038,0,0.073-0.003,0.111-0.009l7.054-1.055c0.158-0.025,0.306-0.098,0.417-0.211l8.478-8.476l2.22-2.22C19.695,7.414,19.695,6.941,19.404,6.65z M8.341,16.656l-0.989-0.99l7.258-7.258l0.989,0.99L8.341,16.656z M2.332,15.919l0.411-2.748l4.143,4.143l-2.748,0.41L2.332,15.919z M13.554,7.351L6.296,14.61l-0.849-0.848l7.259-7.258l0.423,0.424L13.554,7.351zM10.658,4.457l0.992,0.99l-7.259,7.258L3.4,11.715L10.658,4.457z M16.656,8.342l-1.517-1.517V6.823h-0.003l-0.951-0.951l-2.471-2.471l1.164-1.164l4.942,4.94L16.656,8.342z"
                    ></path>
                  </svg>
                </a>
              </span>
              <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
                <a
                  onClick={() => this.props.onDelete(this.props.food.ID)}
                  style={{ cursor: 'pointer' }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                    <path d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
                  </svg>
                </a>
              </span>
            </div>
          )}
          {this.props.food.ID === this.props.editableId && (
            <div>
              <div class="job-form-section-group-viewer-styles__dotsWrapper--Jt82u">
                <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p"></span>
                <span aria-hidden="true" class="icon--24-deal-v2 css-1mpk29p">
                  <a onClick={this.props.onCancelUpdate} style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon_svg">
                      <path d="M14.776,10c0,0.239-0.195,0.434-0.435,0.434H5.658c-0.239,0-0.434-0.195-0.434-0.434s0.195-0.434,0.434-0.434h8.684C14.581,9.566,14.776,9.762,14.776,10 M18.25,10c0,4.558-3.693,8.25-8.25,8.25c-4.557,0-8.25-3.691-8.25-8.25c0-4.557,3.693-8.25,8.25-8.25C14.557,1.75,18.25,5.443,18.25,10 M17.382,10c0-4.071-3.312-7.381-7.382-7.381C5.929,2.619,2.619,5.93,2.619,10c0,4.07,3.311,7.382,7.381,7.382C14.07,17.383,17.382,14.07,17.382,10"></path>
                    </svg>
                  </a>
                </span>
              </div>
            </div>
          )}
        </div>
      </li>
    );
  }
}

const mapStateToProps = (state) => {
  const { cuisine } = state.cuisineReducer;
  const { menuData } = state.foodMenuReducer;
  return { 
    cuisine: cuisine,
    menuData: menuData,
   };
};

export default connect(mapStateToProps,null)(Food);
