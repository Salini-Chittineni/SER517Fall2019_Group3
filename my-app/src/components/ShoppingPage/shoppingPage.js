
import React, { Component } from "react";
import {Form,
    FormGroup,
    FormControl,
    FormLabel, Button
} from "react-bootstrap";
import './shoppingPage.css';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col } from 'react-bootstrap';
export default class ShoppingPage extends Component {
    constructor(props) {
        super(props);
        this.message = ""
        this.state = {
            name:"",
            quantity:"",
            userID: sessionStorage.getItem("username"),
            errors: {
                name: '',
                quantity: '',
              }
        };
        this.uname=sessionStorage.getItem("username")
        if(this.uname==null)
        {
            this.props.history.push('/signin')
        }


    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });

        const re = /^-?\d*(\.\d+)?$/;
        const  name = event.target.id;
        const value = event.target.value;
  let errors = this.state.errors;
  switch (name) {
    case 'name': 
      errors.name = 
        value.length == 0
          ? 'Name is required'
          : '';
      break;
    case 'quantity': 
    errors.quantity = 
    value.length == 0
    ? 'Quantity  is required'
    : 
      errors.quantity = 
        re.test(value)
          ? ''
          : 'Quantity must be a number/decimal';
      break;
    default:
      break;
    }
    this.setState({errors, [name]: value}, ()=> {
    })
    }

    handleSubmit=(event)=> {
        var data = this.state;


        fetch('http://127.0.0.1:5000/addShoppingList', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({
                userID: data.userID,
                [data.name] : data.quantity

            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
                'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

            }
        }).then(res => {
            if(res.status=="200"){
                alert("Item added to shopping list successfully");

            }
            else
                alert("Item already exists in shop list. Go there and edit");
            this.props.history.push('/shoppinglist')
        }).catch(err => console.log(err));
        event.preventDefault();
    }



    renderForm() {
        return (
            <Container>
                <Card  className="mainCardOneThis">
                    <Card.Body className = "cardbodyThis">
                        <Card.Title className="titleCard" >Add an Item </Card.Title>

                        <p className="error-message">{this.state.errors.name}</p>
                        <p className="error-message">{this.state.errors.quantity}</p>
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
                            <Button disabled={this.state.errors.name!='' 
                || this.state.errors.quantity!=''} onClick ={this.handleSubmit} id = "btn-color" variant="primary" type="submit" >Add Item</Button>


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
