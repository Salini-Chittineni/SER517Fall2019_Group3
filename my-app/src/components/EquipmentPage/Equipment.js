/*Author: Salini Chittineni
  Date:   Oct 2, 2019
  About:  This is to render equipment page to add equipment.
*/
import React, { Component } from "react";
import {
    FormGroup,
    FormControl,
    FormLabel,
    Form,
    Button
} from "react-bootstrap";
import Card from 'react-bootstrap/Card';
import './Equipment.css';
import { Container, Row, Col } from 'react-bootstrap';
export default class Equipment extends Component {
    
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
    const re = /^[0-9\b]+$/;
    this.setState({
        [event.target.id]: event.target.value
    });
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
    console.log(errors)
})
}

        handleSubmit=(event) => {
            var data = this.state;

        fetch('http://127.0.0.1:5000/addEquipment', {
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
                alert("Equipment added successfully");

            }
            else
            alert("Error on adding the equipment");

               this.message = 'Equipment added successfully'
            this.props.history.push('/equipmentList');
       
        }).catch(err => console.log(err));


        event.preventDefault();
      }

    renderForm() {
        return (
            <Container>
            <Card  className="mainCardOneThisEq">
         <Card.Body className ="cardbodyThisEq">
         <Card.Title className="titleCard" >Add equipment</Card.Title>
         <p className="error-message">{this.state.errors.name}</p>
            <p className="error-message">{this.state.errors.quantity}</p>
         <Form onSubmit={this.handleSubmit}>
                <FormGroup controlId="name" >
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
                || this.state.errors.quantity!=''} onClick = {this.handleSubmit}  id = "btn-color" type="submit" >Save</Button>
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
