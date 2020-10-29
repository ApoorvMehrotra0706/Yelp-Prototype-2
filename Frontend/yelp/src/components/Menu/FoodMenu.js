import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
import './FoodMenu.css';
import Food from './Food';
import NewFoodForm from './NewFoodForm';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate';

class FoodMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNo: '0',
      showFoodCategory: localStorage.getItem('showFoodCategory'),
      addFoodItemForm: false,
      newFood: {
        category: '',
        Name: '',
        MainIngredients: '',
        CuisineID: null,
        Description: '',
        Price: null,
        ImageUrl: '',
      },
      tmpFood: {
        ID: null,
        category: '',
        Name: '',
        MainIngredients: '',
        CuisineID: null,
        Description: '',
        Price: null,
      },
      editableId: null,
      editableCategory: '',
    };
  }
  // Call On render
  componentDidMount() {
    if (localStorage.getItem('showFoodCategory')) {
      this.showMenuCategory(localStorage.getItem('showFoodCategory'));
    }
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.get(serverUrl + 'restaurant/cuisineFetch',
    {  params: { RestaurantID: localStorage.getItem('user_id') }, withCredentials: true }).then((response) => {
      console.log(response.data);
      let allCuisines = response.data.map((Cusine) => {
        return { key: Cusine._id, value: Cusine.CuisineName };
      });

      let payload = {
        cuisineNames : allCuisines,
      }

      this.props.updateCuisineInfo(payload);
      
    });
  }


  // Open or close Food Addition Form
  openFoodForm = () => {
    if (this.state.addFoodItemForm) {
      let tmp = {
        Name: '',
        MainIngredients: '',
        CuisineID: null,
        Description: '',
        Price: null,
        ImageUrl: '',
      };
      this.setState({
        newFood: { ...this.state.newFood, ...tmp },
      });
    } else {
      this.setState({ editableId: null });
    }
    this.setState({
      addFoodItemForm: !this.state.addFoodItemForm,
    });
  };

   // onChange Handler for new food item form
   onNameChangeHandler = (value, menuCategory) => {
    let tmp = { Name: value, category: menuCategory };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onPriceChangeHandler = (value, menuCategory) => {
    let tmp = { Price: value, category: menuCategory };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onCusineChangeHandler = (value, menuCategory) => {
    let tmp = { CuisineID: value, category: menuCategory };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onIngredentsChangeHandler = (value, menuCategory) => {
    let tmp = { MainIngredients: value, category: menuCategory };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
  onDescriptionChangeHandler = (value, menuCategory) => {
    let tmp = { Description: value, category: menuCategory };
    this.setState({
      newFood: { ...this.state.newFood, ...tmp },
    });
  };
 // Saving a new picture 
  onChangeFileHandler = (event) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      axios({
        method: 'post',
        url: serverUrl + 'restaurant/foodImageUpload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            let tmp = { ImageUrl: response.data };
            this.setState({
              newFood: { ...this.state.newFood, ...tmp },
            });
          } else if (parseInt(response.status) === 400) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: error.message,
            authFlag: false,
          });
        });
    }
  };

// Creating a new entry
  onSaveCreateNew = () => {
    const data = {
      category: this.state.showFoodCategory,
      RestaurantID: localStorage.getItem('user_id'),
      Dishname: this.state.newFood.Name,
      Price: this.state.newFood.Price,
      Cuisine: this.state.newFood.CuisineID,
      Main_Ingredients: this.state.newFood.MainIngredients,
      Description: this.state.newFood.Description,
      ImageURL: this.state.newFood.ImageUrl,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.post(serverUrl + 'restaurant/menuInsert', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          alert("New Food Entry Created");
          this.fetchCall(this.state.showFoodCategory, this.state.pageNo);          
        }
      },
      (error) => {
        console.log(error);
      }
    );
    let newFood = {
      category: '',
      Dishname: '',
      Main_Ingredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
    };
    this.setState({
      newFood: { ...this.setState.newFood, ...newFood },
      addFoodItemForm: false,
    });
  };
  /* New food form ends */

  // open or hide on select menu and fetch data if not in state
  showMenuCategory = (menuCategory) => {
    let tmp = {
      ID: null,
      category: '',
      Name: '',
      MainIngredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
    };
    if (this.state.showFoodCategory === menuCategory) {
      localStorage.setItem('showFoodCategory', '');
      this.setState({
        editableCategory: '',
        showFoodCategory: '',
        addFoodItemForm: false,
        tmpFood: { ...this.state.tmpFood, ...tmp },
      });
    } else {
      localStorage.setItem('showFoodCategory', menuCategory);
      this.setState({
        showFoodCategory: menuCategory,
        editableCategory: menuCategory,
        addFoodItemForm: false,
      });
    }
    switch (menuCategory) {
      case 'APPETIZERS':
        // if (this.state.APPETIZERS.length === 0) {
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo: this.state.pageNo }, withCredentials: true } // restID & pageNo = 0
            )
            .then((response) => {
              console.log(response.data);
              let allAppetizers = response.data[0].map((Appetizer) => { // payload, move it in Redux
                return {
                  ID: Appetizer._id,
                  Name: Appetizer.Dishname,
                  MainIngredients: Appetizer.Main_Ingredients,
                  CuisineID: Appetizer.Cuisine,
                  Description: Appetizer.Description,
                  Price: Appetizer.Price,
                  ImageUrl: Appetizer.ImageURL,
                };
              });

              // this.setState({
              //   APPETIZERS: this.state.APPETIZERS.concat(allAppetizers), // Redux calling 
              // });
              let payload = {
                APPETIZERS: allAppetizers,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
        // }
        break;
      case 'SALADS':
        // if (this.state.SALADS.length === 0) {
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo: this.state.pageNo }, withCredentials: true } // page no , rest ID
            )
            .then((response) => {
              console.log(response.data);
              let allSalads = response.data[0].map((Salad) => {
                return {
                  ID: Salad._id,
                  Name: Salad.Dishname,
                  MainIngredients: Salad.Main_Ingredients,
                  CuisineID: Salad.Cuisine,
                  Description: Salad.Description,
                  Price: Salad.Price,
                  ImageUrl: Salad.ImageURL,
                };
              });

              let payload = {
                SALADS: allSalads,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);

            });
     
        break;
      case 'MAIN_COURSE':
        
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo: this.state.pageNo }, withCredentials: true } // Rest ID and page no.
            )
            .then((response) => {
              console.log(response.data);
              let allMainCourse = response.data[0].map((MainCourse) => {
                return {
                  ID: MainCourse._id,
                  Name: MainCourse.Dishname,
                  MainIngredients: MainCourse.Main_Ingredients,
                  CuisineID: MainCourse.Cuisine,
                  Description: MainCourse.Description,
                  Price: MainCourse.Price,
                  ImageUrl: MainCourse.ImageURL,
                };
              });

              // this.setState({
              //   MAIN_COURSE: this.state.MAIN_COURSE.concat(allMainCourse), // Move to Redux
              // });
              let payload = {
                MAIN_COURSE: allMainCourse,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
        // }
        break;
      case 'BEVERAGES':
        // if (this.state.BEVERAGES.length === 0) {
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch', 

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo: this.state.pageNo }, withCredentials: true } // rest id and page no
            )
            .then((response) => {
              console.log(response.data);
              let allBeverages = response.data[0].map((Beverage) => {
                return {
                  ID: Beverage._id,
                  Name: Beverage.Dishname,
                  MainIngredients: Beverage.Main_Ingredients,
                  CuisineID: Beverage.Cuisine,
                  Description: Beverage.Description,
                  Price: Beverage.Price,
                  ImageUrl: Beverage.ImageURL,
                };
              });

              // this.setState({
              //   BEVERAGES: this.state.BEVERAGES.concat(allBeverages), // move to redux
              // });
              let payload = {
                BEVERAGES: allBeverages,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
        // }
        break;
      case 'DESSERTS':
        // if (this.state.DESSERTS.length === 0) {
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(serverUrl + 'restaurant/menuFetch', 
            { params: { category: menuCategory, 
              RestaurantID: localStorage.getItem('user_id'),
              pageNo: this.state.pageNo }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allDesserts = response.data[0].map((Dessert) => {
                return {
                  ID: Dessert._id,
                  Name: Dessert.Dishname,
                  MainIngredients: Dessert.Main_Ingredients,
                  CuisineID: Dessert.Cuisine,
                  Description: Dessert.Description,
                  Price: Dessert.Price,
                  ImageUrl: Dessert.ImageURL,
                };
              });

              
              let payload = {
                DESSERTS: allDesserts,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
        // }
        break;
      default:
        console.log('Incorrect ask');
        break;
    }
  };

  // Create paginate method  , page no., restID ( from localstorage)

  handlePageClick = (e) => {
    const menuCategory = localStorage.getItem('showFoodCategory');
    this.setState({
      pageNo: e.selected,
    });
   this.fetchCall(menuCategory, e.selected);
  };

  fetchCall(menuCategory, pageNo) {
    switch (menuCategory) {
      case 'APPETIZERS':
        // if (this.state.APPETIZERS.length === 0) {
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo }, withCredentials: true } // restID & pageNo = 0
            )
            .then((response) => {
              console.log(response.data);
              let allAppetizers = response.data[0].map((Appetizer) => { // payload, move it in Redux
                return {
                  ID: Appetizer._id,
                  Name: Appetizer.Dishname,
                  MainIngredients: Appetizer.Main_Ingredients,
                  CuisineID: Appetizer.Cuisine,
                  Description: Appetizer.Description,
                  Price: Appetizer.Price,
                  ImageUrl: Appetizer.ImageURL,
                };
              });

              let payload = {
                APPETIZERS: allAppetizers,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
        
        break;
      case 'SALADS':
        
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo}, withCredentials: true } // page no , rest ID
            )
            .then((response) => {
              console.log(response.data);
              let allSalads = response.data[0].map((Salad) => {
                return {
                  ID: Salad._id,
                  Name: Salad.Dishname,
                  MainIngredients: Salad.Main_Ingredients,
                  CuisineID: Salad.Cuisine,
                  Description: Salad.Description,
                  Price: Salad.Price,
                  ImageUrl: Salad.ImageURL,
                };
              });

              let payload = {
                SALADS: allSalads,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);

            });

        break;
      case 'MAIN_COURSE':
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo }, withCredentials: true } // Rest ID and page no.
            )
            .then((response) => {
              console.log(response.data);
              let allMainCourse = response.data[0].map((MainCourse) => {
                return {
                  ID: MainCourse._id,
                  Name: MainCourse.Dishname,
                  MainIngredients: MainCourse.Main_Ingredients,
                  CuisineID: MainCourse.Cuisine,
                  Description: MainCourse.Description,
                  Price: MainCourse.Price,
                  ImageUrl: MainCourse.ImageURL,
                };
              });
              let payload = {
                MAIN_COURSE: allMainCourse,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
       
        break;
      case 'BEVERAGES':
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(
              serverUrl + 'restaurant/menuFetch', 

              { params: { category: menuCategory, 
                RestaurantID: localStorage.getItem('user_id'),
                pageNo }, withCredentials: true } // rest id and page no
            )
            .then((response) => {
              console.log(response.data);
              let allBeverages = response.data[0].map((Beverage) => {
                return {
                  ID: Beverage._id,
                  Name: Beverage.Dishname,
                  MainIngredients: Beverage.Main_Ingredients,
                  CuisineID: Beverage.Cuisine,
                  Description: Beverage.Description,
                  Price: Beverage.Price,
                  ImageUrl: Beverage.ImageURL,
                };
              });

              let payload = {
                BEVERAGES: allBeverages,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
       
        break;
      case 'DESSERTS':
       
          axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
          axios
            .get(serverUrl + 'restaurant/menuFetch', 
            { params: { category: menuCategory, 
              RestaurantID: localStorage.getItem('user_id'),
              pageNo }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allDesserts = response.data[0].map((Dessert) => {
                return {
                  ID: Dessert._id,
                  Name: Dessert.Dishname,
                  MainIngredients: Dessert.Main_Ingredients,
                  CuisineID: Dessert.Cuisine,
                  Description: Dessert.Description,
                  Price: Dessert.Price,
                  ImageUrl: Dessert.ImageURL,
                };
              });

              let payload = {
                DESSERTS: allDesserts,
                PageCount: response.data[1],
                ItemCount: response.data[2],
              };
              this.props.updatefoodMenu(payload);
            });
   
        break;
      default:
        console.log('Incorrect ask');
        break;
    }

  };


  // on successful delete remove from state also
  deleteFoodItem = (foodId) => {
    let category = this.state.showFoodCategory;
    const data = {
      category: this.state.showFoodCategory,
      foodId: foodId,
    };
    console.log('Delete  Food:', foodId, 'category: ', category);
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/menuDelete', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let page = null;
          if((this.state.pageNo+1) === this.props.menuData.PageCount) {
            if(this.props.menuData.ItemCount % 4 === 1) {
              page = this.state.pageNo - 1;
            }
            else {
              page = this.state.pageNo;
            }
          }
          this.fetchCall(category,page);
          // newFoodId = { ...newFoodId, ...this.state.newFood };
          let index = -1;
          // switch (this.state.showFoodCategory) {
          //   case 'APPETIZERS':
          //     index = this.state.APPETIZERS.findIndex((x) => x.ID === foodId);
          //     let tmpAPPETIZERS = [...this.state.APPETIZERS];
          //     tmpAPPETIZERS.splice(index, 1);
          //     // this.setState({
          //     //   APPETIZERS: tmpAPPETIZERS,
          //     // });
          //     let p
          //     break;
          //   case 'SALADS':
          //     index = this.state.SALADS.findIndex((x) => x.ID === foodId);
          //     let tmpSALADS = [...this.state.SALADS];
          //     tmpSALADS.splice(index, 1);
          //     this.setState({
          //       SALADS: tmpSALADS,
          //     });
          //     break;
          //   case 'MAIN_COURSE':
          //     index = this.state.MAIN_COURSE.findIndex((x) => x.ID === foodId);
          //     let tmpMainCourse = [...this.state.MAIN_COURSE];
          //     tmpMainCourse.splice(index, 1);
          //     this.setState({
          //       MAIN_COURSE: tmpMainCourse,
          //     });
          //     break;
          //   case 'BEVERAGES':
          //     index = this.state.BEVERAGES.findIndex((x) => x.ID === foodId);
          //     let tmpBEVERAGES = [...this.state.BEVERAGES];
          //     tmpBEVERAGES.splice(index, 1);
          //     this.setState({
          //       BEVERAGES: tmpBEVERAGES,
          //     });
          //     break;
          //   case 'DESSERTS':
          //     index = this.state.DESSERTS.findIndex((x) => x.ID === foodId);
          //     let tmpDESSERTS = [...this.state.DESSERTS];
          //     tmpDESSERTS.splice(index, 1);
          //     this.setState({
          //       DESSERTS: tmpDESSERTS,
          //     });
          //     break;
          //   default:
          //     console.log('Bad ask');
          //     break;
          // }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  // change editable food state
  makeEditable = (FoodId) => {
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.APPETIZERS[index], category: this.state.showFoodCategory };

        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.SALADS[index], category: this.state.showFoodCategory };

        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.MAIN_COURSE[index], category: this.state.showFoodCategory };

        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.BEVERAGES[index], category: this.state.showFoodCategory };

        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.DESSERTS[index], category: this.state.showFoodCategory };

        break;
      default:
        console.log('wrong Input');
        break;
    }

    let newFood = {
      category: '',
      Name: '',
      MainIngredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
      ImageUrl: '',
    };
    this.setState({
      editableId: FoodId,
      tmpFood: { ...foodItem },
      addFoodItemForm: false,
      newFood,
    });
    console.log('tmp food store for editable: ', this.state.tmpFood);
    console.log('editable ID: ', this.state.editableId);
  };


  // onChange handlers for old food items
  onNameChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        // 1. Make a shallow copy of the items
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        // 2. Make a shallow copy of the item you want to mutate
        food = { ...APPETIZERS[index] };
        // 3. Replace the property you're intested in
        food.Name = value;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        APPETIZERS[index] = food;
        // 5. Set the state to our new copy
        //this.setState({ APPETIZERS });
        payload = {
          APPETIZERS: APPETIZERS,
        };

        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.Name = value;
        SALADS[index] = food;
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Name = value;
        MAIN_COURSE[index] = food;
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Name = value;
        BEVERAGES[index] = food;
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Name = value;
        DESSERTS[index] = food;
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('Out of bounds');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  onPriceChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { Price: value };
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.Price = value;
        APPETIZERS[index] = food;
        payload = {
          APPETIZERS: APPETIZERS,
        };
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.Price = value;
        SALADS[index] = food;
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Price = value;
        MAIN_COURSE[index] = food;
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Price = value;
        BEVERAGES[index] = food;
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Price = value;
        DESSERTS[index] = food;
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('Incorrect option');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  onCusineChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { CuisineID: value };
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.CuisineID = value;
        APPETIZERS[index] = food;
        payload = {
          APPETIZERS: APPETIZERS,
        };
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.CuisineID = value;
        SALADS[index] = food;
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.CuisineID = value;
        MAIN_COURSE[index] = food;
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.CuisineID = value;
        BEVERAGES[index] = food;
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.CuisineID = value;
        DESSERTS[index] = food;
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('Uh oh!!! invalid request');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  onIngredentsChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { MainIngredients: value };
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.MainIngredients = value;
        APPETIZERS[index] = food;
        payload = {
          APPETIZERS: APPETIZERS,
        };
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.MainIngredients = value;
        SALADS[index] = food;
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.MainIngredients = value;
        MAIN_COURSE[index] = food;
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.MainIngredients = value;
        BEVERAGES[index] = food;
        
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.MainIngredients = value;
        DESSERTS[index] = food;
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('Incorrect choice');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  onDescriptionChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.Description = value;
        APPETIZERS[index] = food;
        payload = {
          APPETIZERS: APPETIZERS,
        };
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.Description = value;
        SALADS[index] = food;
        // this.setState({ SALADS });
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Description = value;
        MAIN_COURSE[index] = food;
        // this.setState({ MAIN_COURSE });
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Description = value;
        BEVERAGES[index] = food;
        // this.setState({ BEVERAGES });
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Description = value;
        DESSERTS[index] = food;
        // this.setState({ DESSERTS });
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('Unavailable choice');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  // update old food item
  updateFoodItem = (event,FoodId, menuCategory) => {
    event.preventDefault();
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.APPETIZERS[index] };
        console.log('Update food item', foodItem);
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.SALADS[index] };
        console.log('Update food item', foodItem);
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.MAIN_COURSE[index] };
        console.log('Update food item', foodItem);
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.BEVERAGES[index] };
        console.log('Update food item', foodItem);
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.props.menuData.DESSERTS[index] };
        console.log('Update food item', foodItem);
        break;
      default:
        console.log('That is a bad chocie');
        break;
    }

    foodItem = { ...foodItem, category: this.state.showFoodCategory };
    axios.defaults.withCredentials = true;
    axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/updateMenu', foodItem).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let tmpFood = {
            ID: null,
            category: '',
            Dishname: '',
            Main_Ingredients: '',
            CuisineID: null,
            Description: '',
            Price: null,
          };
          this.setState({ tmpFood, editableId: null });
          // newFoodId = { ...newFoodId, ...this.state.newFood };
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //cancel Updating food, and revert back to orignal
  cancelFoodUpdate = (FoodId) => {
    let index = null;
    let foodItem = null;
    let tmpFood = {
      ID: null,
      category: '',
      DishName: '',
      Main_Ingredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
    };
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === FoodId);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        foodItem = { ...APPETIZERS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        APPETIZERS[index] = foodItem;
        this.setState({  tmpFood, editableId: null });
        payload = {
          APPETIZERS : APPETIZERS,
        };
        
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === FoodId);
        let SALADS = [...this.props.menuData.SALADS];
        foodItem = { ...SALADS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        SALADS[index] = foodItem;
        this.setState({  tmpFood, editableId: null });
        payload = {
          SALADS : SALADS,
        };
        
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        foodItem = { ...MAIN_COURSE[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        MAIN_COURSE[index] = foodItem;
        this.setState({  tmpFood, editableId: null });
        payload = {
          MAIN_COURSE : MAIN_COURSE,
        };
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === FoodId);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        foodItem = { ...BEVERAGES[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        BEVERAGES[index] = foodItem;
        this.setState({ tmpFood, editableId: null });
        payload = {
          BEVERAGES : BEVERAGES,
        };
        
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === FoodId);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        foodItem = { ...DESSERTS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        DESSERTS[index] = foodItem;
        this.setState({ tmpFood, editableId: null });
        payload = {
          DESSERTS : DESSERTS,
        };
        
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      default:
        console.log('Incorrect choice');
        break;
    }
    this.props.updatefoodMenu(payload);
  };

  onChangeFileHandlerOld = (event, id) => {
    if (event.target.files.length === 1) {
      event.preventDefault();
      let formData = new FormData();
      axios.defaults.headers.common['authorization'] = localStorage.getItem('token');
      formData.append('file', event.target.files[0], event.target.files[0].name);
      axios({
        method: 'post',
        url: serverUrl + 'restaurant/foodImageUpload',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then((response) => {
          console.log('Status Code : ', response.status);
          if (parseInt(response.status) === 200) {
            console.log('Product Saved');
            let tmp = { ImageUrl: response.data };
            this.updateImageUrl(response.data, id);
          } else if (parseInt(response.status) === 400) {
            console.log(response.data);
          }
        })
        .catch((error) => {
          this.setState({
            errorMsg: error.message,
            authFlag: false,
          });
        });
    }
  };

  updateImageUrl = (value, id) => {
    let index = null;
    let food = null;
    let payload = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.props.menuData.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.props.menuData.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.ImageUrl = value;
        APPETIZERS[index] = food;
        // this.setState({ APPETIZERS });
        payload = {
          APPETIZERS: APPETIZERS,
        };
        break;
      case 'SALADS':
        index = this.props.menuData.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.props.menuData.SALADS];
        food = { ...SALADS[index] };
        food.ImageUrl = value;
        SALADS[index] = food;
        // this.setState({ SALADS });
        payload = {
          SALADS: SALADS,
        };
        break;
      case 'MAIN_COURSE':
        index = this.props.menuData.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.props.menuData.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.ImageUrl = value;
        MAIN_COURSE[index] = food;
        // this.setState({ MAIN_COURSE });
        payload = {
          MAIN_COURSE: MAIN_COURSE,
        };
        break;
      case 'BEVERAGES':
        index = this.props.menuData.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.props.menuData.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.ImageUrl = value;
        BEVERAGES[index] = food;
        // this.setState({ BEVERAGES });
        payload = {
          BEVERAGES: BEVERAGES,
        };
        break;
      case 'DESSERTS':
        index = this.props.menuData.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.props.menuData.DESSERTS];
        food = { ...DESSERTS[index] };
        food.ImageUrl = value;
        DESSERTS[index] = food;
        // this.setState({ DESSERTS });
        payload = {
          DESSERTS: DESSERTS,
        };
        break;
      default:
        console.log('That is incorrect');
        break;
    }
    this.props.updatefoodMenu(payload);
  };
  
  render() {
    return (
      <div>
        <div class="job-form-section-group-styles__group--ArVfo" data-ui="education">
          <div class="job-form-section-group-styles__header--2Z5fi">
            <h1 id="education_label">Food Menu</h1>
          </div>
          {/**Main div */}
          <div>
            {/**Foood category div */}

            <div>
              {/**Headin Div */}

              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('APPETIZERS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>APPETIZERS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'APPETIZERS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === 'APPETIZERS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>

              {this.state.showFoodCategory === 'APPETIZERS' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'APPETIZERS' && (
                <div>
                  <ul>
                    {this.props.menuData.APPETIZERS.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={this.deleteFoodItem}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onSave={(event) => this.updateFoodItem(event, food.ID)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food.ID)
                        }
                      />
                    ))}
                  </ul> 
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.menuData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                  {/* Pagination code to be implemented  */}
                </div>
              )}
            </div>

            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('SALADS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>SALADS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'SALADS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}
                {this.state.showFoodCategory === 'SALADS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'SALADS' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'SALADS' && (
                <div>
                  <ul>
                    {this.props.menuData.SALADS.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={this.deleteFoodItem}
                        onSave={() => this.updateFoodItem(food.ID)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food.ID)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.menuData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('MAIN_COURSE');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>MAIN COURSE</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'MAIN_COURSE' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'MAIN_COURSE' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'MAIN_COURSE' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'MAIN_COURSE' && (
                <div>
                  <ul>
                    {this.props.menuData.MAIN_COURSE.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={this.deleteFoodItem}
                        onSave={() => this.updateFoodItem(food.ID)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food.ID)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.menuData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('BEVERAGES');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>BEVERAGES</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'BEVERAGES' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'BEVERAGES' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'BEVERAGES' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'BEVERAGES' && (
                <div>
                  <ul>
                    {this.props.menuData.BEVERAGES.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={this.deleteFoodItem}
                        onSave={() => this.updateFoodItem(food.ID)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food.ID)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.menuData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
            <div>
              {/**Headin Div */}
              <div
                className=".job-form-section-group-styles__header--2Z5fi"
                style={{
                  padding: '5px',
                  justifyContent: 'space-between',
                  display: 'flex',
                  backgroundColor: '#0000004a',
                  boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
                  marginBottom: '4px',
                }}
              >
                <a
                  onClick={() => {
                    this.showMenuCategory('DESSERTS');
                  }}
                >
                  <p style={{ color: '#000', cursor: 'pointer' }}>
                    <strong>DESSERTS</strong>
                  </p>
                </a>
                {this.state.showFoodCategory === 'DESSERTS' && !this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    + Add
                  </button>
                )}

                {this.state.showFoodCategory === 'DESSERTS' && this.state.addFoodItemForm && (
                  <button
                    onClick={this.openFoodForm}
                    data-ui="add-section"
                    aria-describedby="education_label"
                    class="_-_-shared-ui-atoms-button-base-___button__button _-_-shared-ui-atoms-button-base-___button__small _-_-shared-ui-atoms-button-secondary-___secondary__default "
                  >
                    - Cancel
                  </button>
                )}
              </div>
              {/**New Form Div */}
              {this.state.showFoodCategory === 'DESSERTS' && this.state.addFoodItemForm && (
                <div>
                  <NewFoodForm
                    // CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    onChangeFileHandler={(event) => this.onChangeFileHandler(event)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'DESSERTS' && (
                <div>
                  <ul>
                    {this.props.menuData.DESSERTS.map((food) => (
                      <Food
                        food={food}
                        // CUISINES={this.state.CUISINES}
                        onDelete={this.deleteFoodItem}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onSave={() => this.updateFoodItem(food.ID)}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onNameChangeHandler={(evt, id) => this.onNameChangeHandlerUpdate(evt, id)}
                        onPriceChangeHandler={(evt, id) => this.onPriceChangeHandlerUpdate(evt, id)}
                        onCusineChangeHandler={(evt, id) =>
                          this.onCusineChangeHandlerUpdate(evt, id)
                        }
                        onIngredentsChangeHandler={(evt, id) =>
                          this.onIngredentsChangeHandlerUpdate(evt, id)
                        }
                        onDescriptionChangeHandler={(evt, id) =>
                          this.onDescriptionChangeHandlerUpdate(evt, id)
                        }
                        onChangeFileHandlerOld={(event) =>
                          this.onChangeFileHandlerOld(event, food.ID)
                        }
                      />
                    ))}
                  </ul>
                  <ReactPaginate
                    previousLabel={'prev'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={this.props.menuData.PageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={2}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCuisineInfo: (payload) => {
      dispatch({
        type: 'update-cuisine-field',
        payload,
      });
    },
    updatefoodMenu: (payload) => {
      dispatch({
        type: 'update-menu-items',
        payload,
      });
    },
  };
};

const mapStateToProps = (state) => {
  const { cuisine } = state.cuisineReducer;
  const { menuData } = state.foodMenuReducer;
  return { 
    cuisine: cuisine,
    menuData: menuData,
   };
};


export default connect(mapStateToProps, mapDispatchToProps)(FoodMenu);
