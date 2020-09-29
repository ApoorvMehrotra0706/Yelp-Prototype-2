import React, { Component } from 'react';
import axios from 'axios';
import serverUrl from '../../config';
import cookie from 'react-cookies';
import './FoodMenu.css';
import Food from './Food';
import NewFoodForm from './NewFoodForm';
class FoodMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      APPETIZERS: [],
      BEVERAGES: [],
      DESSERTS: [],
      MAIN_COURSE: [],
      SALADS: [],
      CUISINES: [],
      showFoodCategory: localStorage.getItem('showFoodCategory'),
      addFoodItemForm: false,
      newFood: {
        category: '',
        Name: '',
        MainIngredients: '',
        CuisineID: null,
        Description: '',
        Price: null,
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

    axios.get(serverUrl + 'customer/cuisineFetch').then((response) => {
      console.log(response.data);
      let allCuisines = response.data[0].map((Cusine) => {
        return { key: Cusine.CuisineID, value: Cusine.Cuisine_Name };
      });

      this.setState({
        CUISINES: this.state.CUISINES.concat(allCuisines),
      });
    });
  }

  // change editable food state
  makeEditable = (FoodId) => {
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.APPETIZERS[index], category: this.state.showFoodCategory };

        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.SALADS[index], category: this.state.showFoodCategory };

        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.MAIN_COURSE[index], category: this.state.showFoodCategory };

        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.BEVERAGES[index], category: this.state.showFoodCategory };

        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.DESSERTS[index], category: this.state.showFoodCategory };

        break;
    }

    let newFood = {
      category: '',
      Name: '',
      MainIngredients: '',
      CuisineID: null,
      Description: '',
      Price: null,
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
        if (this.state.APPETIZERS.length === 0) {
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allAppetizers = response.data[0].map((Appetizer) => {
                return {
                  ID: Appetizer.AppetizerID,
                  Name: Appetizer.Dishname,
                  MainIngredients: Appetizer.Main_Ingredients,
                  CuisineID: Appetizer.CuisineID,
                  Description: Appetizer.Description,
                  Price: Appetizer.Price,
                };
              });

              this.setState({
                APPETIZERS: this.state.APPETIZERS.concat(allAppetizers),
              });
            });
        }
        break;
      case 'SALADS':
        if (this.state.SALADS.length === 0) {
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allSalads = response.data[0].map((Salad) => {
                return {
                  ID: Salad.SaladsID,
                  Name: Salad.Dishname,
                  MainIngredients: Salad.Main_Ingredients,
                  CuisineID: Salad.CuisineID,
                  Description: Salad.Description,
                  Price: Salad.Price,
                };
              });

              this.setState({
                SALADS: this.state.SALADS.concat(allSalads),
              });
            });
        }
        break;
      case 'MAIN_COURSE':
        if (this.state.MAIN_COURSE.length === 0) {
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allMainCourse = response.data[0].map((MainCourse) => {
                return {
                  ID: MainCourse.MainCourseID,
                  Name: MainCourse.Dishname,
                  MainIngredients: MainCourse.Main_Ingredients,
                  CuisineID: MainCourse.CuisineID,
                  Description: MainCourse.Description,
                  Price: MainCourse.Price,
                };
              });

              this.setState({
                MAIN_COURSE: this.state.MAIN_COURSE.concat(allMainCourse),
              });
            });
        }
        break;
      case 'BEVERAGES':
        if (this.state.BEVERAGES.length === 0) {
          axios
            .get(
              serverUrl + 'restaurant/menuFetch',

              { params: { category: menuCategory }, withCredentials: true }
            )
            .then((response) => {
              console.log(response.data);
              let allBeverages = response.data[0].map((Beverage) => {
                return {
                  ID: Beverage.BeverageID,
                  Name: Beverage.Dishname,
                  MainIngredients: Beverage.Main_Ingredients,
                  CuisineID: Beverage.CuisineID,
                  Description: Beverage.Description,
                  Price: Beverage.Price,
                };
              });

              this.setState({
                BEVERAGES: this.state.BEVERAGES.concat(allBeverages),
              });
            });
        }
        break;
      case 'DESSERTS':
        if (this.state.DESSERTS.length === 0) {
          axios
            .get(serverUrl + 'restaurant/menuFetch', {
              params: { category: menuCategory },
              withCredentials: true,
            })
            .then((response) => {
              console.log(response.data);
              let allDesert = response.data[0].map((Dessert) => {
                return {
                  ID: Dessert.DessertsID,
                  Name: Dessert.Dishname,
                  MainIngredients: Dessert.Main_Ingredients,
                  CuisineID: Dessert.CuisineID,
                  Description: Dessert.Description,
                  Price: Dessert.Price,
                };
              });

              this.setState({
                DESSERTS: this.state.DESSERTS.concat(allDesert),
              });
            });
        }
        break;
    }
  };

  //on successfull delete remove from state also
  deleteFoodItem = (foodId) => {
    let category = this.state.showFoodCategory;
    const data = {
      category: this.state.showFoodCategory,
      foodId: foodId,
    };
    console.log('Delete Appetizer Food:', foodId, 'catefory: ', category);
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/menuDelete', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);

          // newFoodId = { ...newFoodId, ...this.state.newFood };
          let index = -1;
          switch (this.state.showFoodCategory) {
            case 'APPETIZERS':
              index = this.state.APPETIZERS.findIndex((x) => x.ID === foodId);
              let tmpAPPETIZERS = [...this.state.APPETIZERS];
              tmpAPPETIZERS.splice(index, 1);
              this.setState({
                APPETIZERS: tmpAPPETIZERS,
              });
              break;
            case 'SALADS':
              index = this.state.SALADS.findIndex((x) => x.ID === foodId);
              let tmpSALADS = [...this.state.SALADS];
              tmpSALADS.splice(index, 1);
              this.setState({
                SALADS: tmpSALADS,
              });
              break;
            case 'MAIN_COURSE':
              index = this.state.MAIN_COURSE.findIndex((x) => x.ID === foodId);
              let tmpMainCourse = [...this.state.MAIN_COURSE];
              tmpMainCourse.splice(index, 1);
              this.setState({
                MAIN_COURSE: tmpMainCourse,
              });
              break;
            case 'BEVERAGES':
              index = this.state.BEVERAGES.findIndex((x) => x.ID === foodId);
              let tmpBEVERAGES = [...this.state.BEVERAGES];
              tmpBEVERAGES.splice(index, 1);
              this.setState({
                BEVERAGES: tmpBEVERAGES,
              });
              break;
            case 'DESSERTS':
              index = this.state.DESSERTS.findIndex((x) => x.ID === foodId);
              let tmpDESSERTS = [...this.state.DESSERTS];
              tmpDESSERTS.splice(index, 1);
              this.setState({
                DESSERTS: tmpDESSERTS,
              });
              break;
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  //Open or close Food Addition FOrm
  openFoodForm = () => {
    if (this.state.addFoodItemForm) {
      let tmp = {
        Name: '',
        MainIngredients: '',
        CuisineID: null,
        Description: '',
        Price: null,
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

  // onChange Handeler for new food item form
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

  // onChange handlers for old food items
  onNameChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === id);
        // 1. Make a shallow copy of the items
        let APPETIZERS = [...this.state.APPETIZERS];
        // 2. Make a shallow copy of the item you want to mutate
        food = { ...APPETIZERS[index] };
        // 3. Replace the property you're intested in
        food.Dishname = value;
        // 4. Put it back into our array. N.B. we *are* mutating the array here, but that's why we made a copy first
        APPETIZERS[index] = food;
        // 5. Set the state to our new copy
        this.setState({ APPETIZERS });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.state.SALADS];
        food = { ...SALADS[index] };
        food.Dishname = value;
        SALADS[index] = food;
        this.setState({ SALADS });
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Dishname = value;
        MAIN_COURSE[index] = food;
        this.setState({ MAIN_COURSE });
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.state.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Dishname = value;
        BEVERAGES[index] = food;
        this.setState({ BEVERAGES });
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.state.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Dishname = value;
        DESSERTS[index] = food;
        this.setState({ DESSERTS });
        break;
    }
  };
  onPriceChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { Price: value };
    let index = null;
    let food = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.state.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.Price = value;
        APPETIZERS[index] = food;
        this.setState({ APPETIZERS });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.state.SALADS];
        food = { ...SALADS[index] };
        food.Price = value;
        SALADS[index] = food;
        this.setState({ SALADS });
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Price = value;
        MAIN_COURSE[index] = food;
        this.setState({ MAIN_COURSE });
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.state.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Price = value;
        BEVERAGES[index] = food;
        this.setState({ BEVERAGES });
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.state.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Price = value;
        DESSERTS[index] = food;
        this.setState({ DESSERTS });
        break;
    }
  };
  onCusineChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { CuisineID: value };
    let index = null;
    let food = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.state.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.CuisineID = value;
        APPETIZERS[index] = food;
        this.setState({ APPETIZERS });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.state.SALADS];
        food = { ...SALADS[index] };
        food.CuisineID = value;
        SALADS[index] = food;
        this.setState({ SALADS });
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.CuisineID = value;
        MAIN_COURSE[index] = food;
        this.setState({ MAIN_COURSE });
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.state.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.CuisineID = value;
        BEVERAGES[index] = food;
        this.setState({ BEVERAGES });
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.state.DESSERTS];
        food = { ...DESSERTS[index] };
        food.CuisineID = value;
        DESSERTS[index] = food;
        this.setState({ DESSERTS });
        break;
    }
  };
  onIngredentsChangeHandlerUpdate = (value, id, menuCategory) => {
    let tmp = { MainIngredients: value };
    let index = null;
    let food = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.state.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.Main_Ingredients = value;
        APPETIZERS[index] = food;
        this.setState({ APPETIZERS });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.state.SALADS];
        food = { ...SALADS[index] };
        food.Main_Ingredients = value;
        SALADS[index] = food;
        this.setState({ SALADS });
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Main_Ingredients = value;
        MAIN_COURSE[index] = food;
        this.setState({ MAIN_COURSE });
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.state.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Main_Ingredients = value;
        BEVERAGES[index] = food;
        this.setState({ BEVERAGES });
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.state.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Main_Ingredients = value;
        DESSERTS[index] = food;
        this.setState({ DESSERTS });
        break;
    }
  };
  onDescriptionChangeHandlerUpdate = (value, id, menuCategory) => {
    let index = null;
    let food = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === id);
        let APPETIZERS = [...this.state.APPETIZERS];
        food = { ...APPETIZERS[index] };
        food.Description = value;
        APPETIZERS[index] = food;
        this.setState({ APPETIZERS });
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === id);
        let SALADS = [...this.state.SALADS];
        food = { ...SALADS[index] };
        food.Description = value;
        SALADS[index] = food;
        this.setState({ SALADS });
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === id);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        food = { ...MAIN_COURSE[index] };
        food.Description = value;
        MAIN_COURSE[index] = food;
        this.setState({ MAIN_COURSE });
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === id);
        let BEVERAGES = [...this.state.BEVERAGES];
        food = { ...BEVERAGES[index] };
        food.Description = value;
        BEVERAGES[index] = food;
        this.setState({ BEVERAGES });
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === id);
        let DESSERTS = [...this.state.DESSERTS];
        food = { ...DESSERTS[index] };
        food.Description = value;
        DESSERTS[index] = food;
        this.setState({ DESSERTS });
        break;
    }
  };

  // update old food item
  updateFoodItem = (FoodId, menuCategory) => {
    let index = null;
    let foodItem = null;
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.APPETIZERS[index] };
        console.log('Update food item', foodItem);
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.SALADS[index] };
        console.log('Update food item', foodItem);
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.MAIN_COURSE[index] };
        console.log('Update food item', foodItem);
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.BEVERAGES[index] };
        console.log('Update food item', foodItem);
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === FoodId);
        foodItem = { ...this.state.DESSERTS[index] };
        console.log('Update food item', foodItem);
        break;
    }

    foodItem = { ...foodItem, category: this.state.showFoodCategory };
    axios.defaults.withCredentials = true;
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
    switch (this.state.showFoodCategory) {
      case 'APPETIZERS':
        index = this.state.APPETIZERS.findIndex((x) => x.ID === FoodId);
        let APPETIZERS = [...this.state.APPETIZERS];
        foodItem = { ...APPETIZERS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        APPETIZERS[index] = foodItem;
        this.setState({ APPETIZERS, tmpFood, editableId: null });
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'SALADS':
        index = this.state.SALADS.findIndex((x) => x.ID === FoodId);
        let SALADS = [...this.state.SALADS];
        foodItem = { ...SALADS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        SALADS[index] = foodItem;
        this.setState({ SALADS, tmpFood, editableId: null });
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'MAIN_COURSE':
        index = this.state.MAIN_COURSE.findIndex((x) => x.ID === FoodId);
        let MAIN_COURSE = [...this.state.MAIN_COURSE];
        foodItem = { ...MAIN_COURSE[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        MAIN_COURSE[index] = foodItem;
        this.setState({ MAIN_COURSE, tmpFood, editableId: null });
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'BEVERAGES':
        index = this.state.BEVERAGES.findIndex((x) => x.ID === FoodId);
        let BEVERAGES = [...this.state.BEVERAGES];
        foodItem = { ...BEVERAGES[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        BEVERAGES[index] = foodItem;
        this.setState({ BEVERAGES, tmpFood, editableId: null });
        console.log('Cancel Update, orignal food item', foodItem);
        break;
      case 'DESSERTS':
        index = this.state.DESSERTS.findIndex((x) => x.ID === FoodId);
        let DESSERTS = [...this.state.DESSERTS];
        foodItem = { ...DESSERTS[index] };
        foodItem = { ...foodItem, ...this.state.tmpFood };
        DESSERTS[index] = foodItem;
        this.setState({ DESSERTS, tmpFood, editableId: null });
        console.log('Cancel Update, orignal food item', foodItem);
        break;
    }
  };

  onSaveCreateNew = () => {
    const data = {
      category: this.state.showFoodCategory,
      name: this.state.newFood.Name,
      price: this.state.newFood.Price,
      cuisine: this.state.newFood.CuisineID,
      ingredients: this.state.newFood.MainIngredients,
      description: this.state.newFood.Description,
    };
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post(serverUrl + 'restaurant/menuInsert', data).then(
      (response) => {
        console.log('Status Code : ', response.status);
        if (response.status === 200) {
          console.log(response.data);
          let newFood = {
            category: this.state.showFoodCategory,
            Name: response.data[0][0].Dishname,
            MainIngredients: response.data[0][0].Main_Ingredients,
            CuisineID: response.data[0][0].CuisineID,
            Description: response.data[0][0].Description,
            Price: response.data[0][0].Price,
          };

          // newFoodId = { ...newFoodId, ...this.state.newFood };
          switch (this.state.showFoodCategory) {
            case 'APPETIZERS':
              this.setState({
                APPETIZERS: this.state.APPETIZERS.concat(newFood),
              });
              break;
            case 'SALADS':
              this.setState({
                SALADS: this.state.SALADS.concat(newFood),
              });
              break;
            case 'MAIN_COURSE':
              this.setState({
                MAIN_COURSE: this.state.MAIN_COURSE.concat(newFood),
              });
              break;
            case 'BEVERAGES':
              this.setState({
                BEVERAGES: this.state.BEVERAGES.concat(newFood),
              });
              break;
            case 'DESSERTS':
              this.setState({
                DESSERTS: this.state.DESSERTS.concat(newFood),
              });
              break;
          }
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
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'APPETIZERS' && (
                <div>
                  <ul>
                    {this.state.APPETIZERS.map((food) => (
                      <Food
                        food={food}
                        CUISINES={this.state.CUISINES}
                        editableId={this.state.editableId}
                        makeEditable={(ID) => this.makeEditable(ID)}
                        onDelete={this.deleteFoodItem}
                        onCancelUpdate={() => this.cancelFoodUpdate(food.ID)}
                        onSave={() => this.updateFoodItem(food.ID)}
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
                      />
                    ))}
                  </ul>
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
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'SALADS' && (
                <div>
                  <ul>
                    {this.state.SALADS.map((food) => (
                      <Food
                        food={food}
                        CUISINES={this.state.CUISINES}
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
                      />
                    ))}
                  </ul>
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
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'MAIN_COURSE' && (
                <div>
                  <ul>
                    {this.state.MAIN_COURSE.map((food) => (
                      <Food
                        food={food}
                        CUISINES={this.state.CUISINES}
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
                      />
                    ))}
                  </ul>
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
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'BEVERAGES' && (
                <div>
                  <ul>
                    {this.state.BEVERAGES.map((food) => (
                      <Food
                        food={food}
                        CUISINES={this.state.CUISINES}
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
                      />
                    ))}
                  </ul>
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
                    CUISINES={this.state.CUISINES}
                    // onNameChangeHandler={this.onNameChangeHandler}
                    onPriceChangeHandler={(evt) => this.onPriceChangeHandler(evt)}
                    onCusineChangeHandler={(evt) => this.onCusineChangeHandler(evt)}
                    onIngredentsChangeHandler={(evt) => this.onIngredentsChangeHandler(evt)}
                    onDescriptionChangeHandler={(evt) => this.onDescriptionChangeHandler(evt)}
                    onNameChangeHandler={(evt) => this.onNameChangeHandler(evt)}
                    food={this.state.newFood}
                    onSaveCreateNew={() => this.onSaveCreateNew()}
                  ></NewFoodForm>
                </div>
              )}
              {this.state.showFoodCategory === 'DESSERTS' && (
                <div>
                  <ul>
                    {this.state.DESSERTS.map((food) => (
                      <Food
                        food={food}
                        CUISINES={this.state.CUISINES}
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
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FoodMenu;
