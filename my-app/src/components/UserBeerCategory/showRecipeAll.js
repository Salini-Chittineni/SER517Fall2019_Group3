/*
  Author: Harshita Kajal
  Date Created:   Oct 16, 2019
  About:  View the recipe details.
  Date Updated: ...
*/

import React, { Component } from "react";
import DataTable from './datatable';
import Loader from 'react-loader-spinner';
import './showRecipe.css';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default class recipeList extends Component {
     constructor(props) {
        super(props);
        this.getRecipe = this.getRecipe.bind(this);
        this.message = ""
      
        this.state = {
          error: null,
          recipe: [],
          response: {},
          items: []
        }
        this.recipe = null;
        this.loading = true;
        this.items=null;
        this.getRecipe(this.props.name.toString());

        
    }

    handleSubmit=(event)=> {
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:5000/')
    
        event.preventDefault();
      }


       getRecipe=(name)=>{
        var convention= this.props.value;
        var apiUrl = 'http://127.0.0.1:5000/viewMyRecipe?recipeName='+name +'&userID='+sessionStorage.getItem("username");
        
          fetch(apiUrl)
          .then(res => res.json())
          .then(
            (result) => {
                var data =result['Recipe Info'];
             this.loading = false;
             var recipe =[];
             
             Object.keys(data).forEach(function(key) {
                 if(key!="_id" && key!="name" && key!="Category"){
                  recipe.push([
                    key,data[key]
                 ]);
                 }               
            });
           
                 this.setState({
                  recipe: recipe
                });

                const dataArray = Object.keys(this.state.recipe).map(i => this.state.recipe[i])
                this.recipe = dataArray;
                },
               (error) => {
                 this.setState({ error });
               }
             )
       }


        
         renderList() {
            var convention= this.props.value;
            return (
                
                <Container>
                        <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
                    <Card  className="mainCard">
                <Card.Body className = "card-body">
                <Card.Title className="titleCard" >{this.props.name}</Card.Title>
                <DataTable items={this.state.recipe}></DataTable>
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
