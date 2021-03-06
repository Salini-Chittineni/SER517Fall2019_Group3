/*Author: Jahnavi Bantupalli
Date added: Oct 9, 2019
*/
import React, { Component } from "react";
import './listingredient.css';
import Card from 'react-bootstrap/Card';
import DataTable from './datatable';
import Loader from 'react-loader-spinner';
import {Button, Container} from 'react-bootstrap';
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
    console.log("constructor");
    this.getIngredients=this.getIngredients.bind(this);
    this.getIngredients();
        
    }

    handleSubmit=(event)=> {
        this.props.history.push('/addingredient')
      }

      getIngredients(){
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
                          if (data==null)
                              return;
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
        const newArray = [
          ...this.state.ingredients.slice(0, itemIndex),
          item,
          ...this.state.ingredients.slice(itemIndex + 1)
        ]
        this.setState({ ingredients: newArray })
      }

      deleteItem = (item) => {
        const updatedItems = this.state.ingredients.filter(i => i[0] !== item[0]);
        this.setState({ ingredients: updatedItems })

      }

      deleteIngredient =(item)=>{
        fetch('http://127.0.0.1:5000/deleteIngredient', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userID: this.state.userID,
            [item[0]]:item[1]
          })
        })
          .then(() => {
            this.deleteItem([item[0],item[1]])
          })
          .catch(err => console.log(err))
      }

    renderList() {
        return (
            <Container>
                <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
            <Card  className="cardMainIngr">
         <Card.Body className = "cardbodyIngr">
         <Card.Title className="titleCard" >List of ingredients</Card.Title>
         {this.loading ?       <Loader
         type="Circles"
         color="#00BFFF"
         height={100}
         width={100}
         timeout={3000} //3 secs

      />: <DataTable itemType="ingredient" userID ={this.state.userID} items={this.state.ingredients} updateState={this.updateState} deleteItem = {this.deleteItem} deleteIngredient = {this.deleteIngredient}></DataTable>}
             <Button onClick = {this.handleSubmit}  id = "btn-color" type="submit" >Add Item</Button>
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
