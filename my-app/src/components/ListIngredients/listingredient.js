/*Author: Jahnavi Bantupalli
Date added: Oct 9, 2019
*/
import React, { Component } from "react";
import './listingredient.css';
import Card from 'react-bootstrap/Card';
import DataTable from './datatable';
import Loader from 'react-loader-spinner';
import { Container } from 'react-bootstrap';
export default class ListIngredient extends Component {
   
    constructor(props) {
        super(props);
    this.state = {
      error: null,
      userID: "",
      ingredients: [],
      response: {}
    }

        this.uname=sessionStorage.getItem("username")
        if(this.uname==null)
        {
            this.props.history.push('/signin')
        }
    this.ingredients = null;
    this.loading = true;
    this.getIngredients();
    



        
    }

 

    handleSubmit=(event)=> {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:5000/')
        
        event.preventDefault();
      }

      getIngredients=()=>{
          var user= sessionStorage.getItem("username");
          if(user==null)
          {
              this.props.history.push('/signin')
          }
          else {
              var apiUrl = 'http://127.0.0.1:5000/showIngredient?userID=' + user

              fetch(apiUrl)
                  .then(res => res.json())
                  .then(
                      (result) => {

                          var data = result['IngredientList'];

                          this.loading = false;
                          var ingredients = [];
                          var userID = ""
                          Object.keys(data).forEach(function (key) {
                              if (key == "userID") {
                                  userID = data[key];
                              }
                              if (key != "userID" && key != "_id") {
                                  ingredients.push([
                                      key, data[key]
                                  ]);
                              }

                          });

                          this.setState({
                              userID: userID,
                              ingredients: ingredients
                          });


                          const ingrarray = Object.keys(this.state.ingredients).map(i => this.state.ingredients[i])
                          this.ingredients = ingrarray;

                      },
                      (error) => {
                          this.setState({error});
                      }
                  )
          }

      }

      updateState = (item) => {
        
        const itemIndex = this.state.ingredients.findIndex(data => data[0] === item[0])
        console.log(itemIndex);
        console.log(item);
 
        const newArray = [
          ...this.state.ingredients.slice(0, itemIndex),
          item,
          ...this.state.ingredients.slice(itemIndex + 1)
        ]
        console.log(newArray);
        this.setState({ ingredients: newArray })
      }

      deleteItem = (item) => {
        console.log(item);
        const updatedItems = this.state.ingredients.filter(i => i[0] !== item[0]);
        this.setState({ ingredients: updatedItems })

      }

    renderList() {
        return (
            
            <Container>
                <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
            <Card  className="mainCardOne">
         <Card.Body className = "card-body">
         <Card.Title className="titleCard" >List of ingredients</Card.Title>
         {this.loading ?       <Loader
         type="Circles"
         color="#00BFFF"
         height={100}
         width={100}
         timeout={3000} //3 secs

      />: <DataTable userID ={this.state.userID} items={this.state.ingredients} updateState={this.updateState} deleteItem = {this.deleteItem}></DataTable>}


      
         </Card.Body>
       </Card>
            </Container>
            
            
          
        );
    }

    render() {
        return (
            <div>
                { this.renderList()}
            </div>
        );
    }
}
