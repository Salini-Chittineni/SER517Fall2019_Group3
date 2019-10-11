/*Author: Jahnavi Bantupalli
Date added: Oct 2, 2019
*/
import React, { Component } from "react";
import {Form,
    FormGroup,
    FormControl,
    FormLabel, Button
} from "react-bootstrap";
import './ingredientPage.css';
import Card from 'react-bootstrap/Card';
import axios from "axios";

import { Container, Row, Col } from 'react-bootstrap';
export default class IngredientPage extends Component {
    constructor(props) {
        super(props);
        this.message = ""
        this.state = {
            // isLoading: false,
            name:"",
            quantity:"",
            userID: "user1"
        };

        
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit=(event)=> {
        var data = this.state;
        console.log(data);
      
        // fetch('http://127.0.0.1:5000/addIngredient', {
        //     method: 'POST',
        //     mode: 'CORS',
        //     body: data,
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then(res => {
        //     console.log(res) ;
        // }).catch(err => console.log(err));
        axios.post('http://127.0.0.1:5000/addIngredient', this.state).
        then(response=> {
        
        console.log(response);

        
        
        });

        event.preventDefault();
      }


    renderForm() {
        return (
            <Container>
            <Card  className="mainCard">
         <Card.Body className = "card-body">
         <Card.Title className="titleCard" >Add an ingredient </Card.Title>

            <p>{this.message}</p>
         <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId="name"  >
                    <FormLabel>Name</FormLabel>
                    <FormControl
                        autoFocus
                        type="Text"
                        value={this.state.name}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                    <FormGroup controlId="quantity">
                        <FormLabel>Quantity</FormLabel>
                        <FormControl
                            autoFocus
                            type="Text"
                            value={this.state.quantity}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <Button onClick ={this.handleSubmit} id = "btn-color" variant="primary" type="submit" >Add Ingredient</Button>

    
            </Form>
         </Card.Body>
       </Card>
            </Container>
            
            
          
        );
    }

    render() {
        return (
            <div>
                { this.renderForm()}
            </div>
        );
    }
}
