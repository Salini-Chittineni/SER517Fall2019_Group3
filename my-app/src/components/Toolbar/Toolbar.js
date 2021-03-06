/*Author:             Salini Chittineni
  Initial Creation:   September 5, 2019
  Modified by:        Harshita Kajal
  Modified date:      November 18,2019
  About:  This page is to redner toolbar for the application
  Updates to add functionality for MenuButton and other components
*/
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Image from 'react-bootstrap/Image'
import './Toolbar.css';
import Routes from "../../Routes"

class ButtonAppBar extends Component {

  constructor(props) {
    super(props);
    var isLogged = false;
    console.log(sessionStorage.getItem("username"))
    if(sessionStorage.getItem("username") == null)
    isLogged = false;
    else
    isLogged = true;
       
    this.state = {isLoggedIn : isLogged}

  }
  componentWillReceiveProps=()=> {
    var isLogged = false;
    console.log(sessionStorage.getItem("username"))
    if(sessionStorage.getItem("username") == null)
    isLogged = false;
    else
    isLogged = true;
    this.setState({isLoggedIn : isLogged});
    console.log("here")
  
}
  // handleLogin = async event  => {
  //   this.setState({isLoggedIn: true});


    

  // }
  handleLogout = async event  => {
      sessionStorage.removeItem("username");
      console.log(sessionStorage.getItem("username"));
      alert("Logged out");
      this.setState({isLoggedIn: false});

      

    }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    let button;
    let profile;
    if (!isLoggedIn) {
      button = <Button component={Link} to="/signin" onClick={this.handleLogin} color="inherit" className="text-capitalize">Login</Button>;
      profile =  null

    } else {
      button = <Button component={Link} to="/signin" onClick={this.handleLogout} color="inherit" className="text-capitalize">Logout</Button>
      profile = <Button component={Link} to="/profile" color="inherit" className="text-capitalize">Profile</Button>
      ;
    }

    return (
      <div>
        <Router >

          <AppBar position="static" className="bgColor" >
            <Toolbar>

              <div className="root" >
                <Link to="/">
                <Image src="/images/logo_new.png"  color="inherit" className="title" className="text-capitalize"
                style ={{width: 53, height: 65, marginTop:5, marginBottom: 5}} /> </Link>
                <div className="dropdown">
                  <Button className="text-capitalize" color="inherit">Users</Button>
                  <div className="dropdown-content">
                    <Button component={Link} to="/userList" color="inherit" className="text-capitalize" >Search</Button>
                  </div>
                </div>

            
              <div className="dropdown">
                <Button className="text-capitalize" color="inherit">Ingredients</Button>
                <div className="dropdown-content">
                  <Button component={Link} to="/addingredient" color="inherit" className="text-capitalize" >Add Ingredient</Button>
                  <Button component={Link} to="/ingredientList" color="inherit" className="text-capitalize" >Ingredient List</Button>
                  <Button component={Link} to="/IngredientCheckList" color="inherit" className="text-capitalize" >Ingredient CheckList</Button>

                </div>
              </div>
              <div className="dropdown">
                <Button className="text-capitalize" color="inherit">Equipment</Button>
                <div className="dropdown-content">
                  <Button component={Link} to="/equipment" color="inherit" className="text-capitalize" >Add Equipment</Button>
                  <Button component={Link} to="/equipmentList" color="inherit" className="text-capitalize" >Equipment List</Button>
                  <Button component={Link} to="/EquipmentsCheckList" color="inherit" className="text-capitalize" >Equipment CheckList</Button>

                </div>
              </div>

              <div className="dropdown">
                <Button className="text-capitalize" color="inherit">Shopping</Button>
                <div className="dropdown-content">
                  <Button component={Link} to="/addShoppingItem" color="inherit" className="text-capitalize" >Add Item</Button>
                  <Button component={Link} to="/shoppinglist" color="inherit" className="text-capitalize" > Shopping List</Button>
                </div>
              </div>


              <div className="dropdown">
                <Button className="text-capitalize" color="inherit">All Recipes</Button>
                <div className="dropdown-content">
                <Button component={Link} to="/addRecipe" color="inherit" className="text-capitalize">Make a Recipe</Button>
                  <Button component={Link} to="/showRecipe" color="inherit" className="text-capitalize" >Default Recipes</Button>
                  {/*<Button component={Link} to="/recipeList" color="inherit" className="text-capitalize" >Search Recipe</Button>*/}
                  <Button component={Link} to="/ListRecipe" color="inherit" className="text-capitalize" >All Recipes</Button>
                  <Button component={Link} to="/recipeCategory" color="inherit" className="text-capitalize" >Recipes by Category</Button>
                </div>

                
              </div>

              <div className="dropdown">

                <Button className="text-capitalize" color="inherit">My Beers</Button>
                <div className="dropdown-content">
                <Button component={Link} to="/addRecipeUser" color="inherit" className="text-capitalize">Make a Beer</Button>
                <Button component={Link} to="/viewMyRecipes" color="inherit" className="text-capitalize" >View My Recipe</Button>
                <Button component={Link} to="/recipeCategoryBrewer" color="inherit" className="text-capitalize" >Recipes by Category</Button>
                </div>
              </div>


              

              
              <Button component={Link} to="/beerStatus" color="inherit" className="text-capitalize">Brewing Status</Button>
              </div>
              <Button component={Link} to="/about" color="inherit" className="text-capitalize">About</Button>
              <Button component={Link} to="/contact" color="inherit" className="text-capitalize">Contact Us</Button>
              <Button component={Link} to="/whatcanIbrew" color="inherit" className="text-capitalize">What Can I Brew Today</Button>
              {button}
              {profile}
            </Toolbar>
          </AppBar>
          <Switch>
            <Routes />
          </Switch>
        </Router>

      </div>


    );
  }
}


export default withRouter(ButtonAppBar);
// export default withRouter(App);
