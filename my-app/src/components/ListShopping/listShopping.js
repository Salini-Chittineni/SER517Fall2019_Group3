
import React, { Component } from "react";

import './listShopping.css';
import Card from 'react-bootstrap/Card';
import DataTable from '../ListIngredients/datatable';
import { Container, Row, Col } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
export default class ListShopping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            ingredients: [],
            response: {}
        }
        this.ingredients = null;
        this.loading = true;
        this.getIngredients();



    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit=(event)=> {
        console.log(this.state);
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:5000/')

        event.preventDefault();
      }

    getIngredients=()=> {
        var apiUrl = 'http://127.0.0.1:5000/showShoppingList?userID=user1'

        fetch(apiUrl)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result['ShoppingList']);
                    var data = result['ShoppingList'];

                    this.loading = false;
                    var ingredients = [];

                    Object.keys(data).forEach(function (key) {
                        if (key != "userID" && key != "_id") {
                            ingredients.push([
                                key, data[key]
                            ]);
                        }

                    });

                    this.setState({
                        ingredients: ingredients
                    });


                    const ingrarray = Object.keys(this.state.ingredients).map(i => this.state.ingredients[i])
                    this.ingredients = ingrarray;
                    console.log(this.ingredients[0]);
                },
                (error) => {
                    this.setState({error});
                }
            )

    }


    renderList() {
        return (
            
            <Container>
                <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
            <Card  className="mainCard">
         <Card.Body className = "card-body">
         <Card.Title className="titleCard" >Shopping List </Card.Title>
             {this.loading ?       <Loader
                 type="Circles"
                 color="#00BFFF"
                 height={100}
                 width={100}
                 timeout={3000} //3 secs

             />: <DataTable items={this.state.ingredients}></DataTable>}



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
