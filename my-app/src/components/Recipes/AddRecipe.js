/*Author: Harshita Kajal
Date added: Sep 29, 2019
Date modified : Sept 30, 2019
*/

import React, {Component} from "react";
import Card from 'react-bootstrap/Card';
//import RecipeDetails from "./RecipeDetails";
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import "./AddRecipe.css";
import {Container, FormLabel, FormControl, FormGroup, Col, Row } from "react-bootstrap"
import Form from "react-bootstrap/FormGroup";
import HopsList from "./HopsSchedule";
import Button from '@material-ui/core/Button';
import Dropdown from 'react-bootstrap/Dropdown'


export default class AddRecipe extends Component {
    constructor(props) {
        super(props);
        this.message = ""
    this.state = {  
    // object1: [{name:"", quantity:""}],
    name: "",
    BatchSize: "",
    Directions: "",
    Hops1:"",
    schedule:"",
    // grain:"",
    Hops:[],
    // Grains:[],
    // Grains2:[],
    HopsSchedule:[],
    Category:"",
    errors: {
        name:'',
        BatchSize:'',
        Directions:'',
        Hops1: '',
        schedule: '',
        grain:'',
        Temp:''
      }
  };

        this.uname=sessionStorage.getItem("username")
        if(this.uname==null)
        {
            this.props.history.push('/signin')
        }
  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleChange = this.handleChange.bind(this);
}   

   

handleChange = event => {
  this.setState({
      [event.target.id]: event.target.value,
  });
  const  name = event.target.id;
        const value = event.target.value;
        let errors = this.state.errors;
        switch (name) {
            case 'BatchSize': 
            errors.BatchSize = 
                value.length == 0
                ? 'BatchSize is required'
                : '';
            break;
            case 'name': 
            errors.name = 
            value.length == 0
            ? 'Name  is required'
            : '';
            break;
            case 'Directions': 
            errors.Directions = 
                value.length == 0
                ? 'Directions is required'
                : '';
            break;
            case 'Hops1': 
            errors.Hops1 = 
            value.length == 0
            ? 'Hops1  is required'
            : '';
            break;
            case 'schedule': 
            errors.schedule = 
            value.length == 0
            ? 'Schedule  is required'
            : '';
            break;
            case 'grain': 
            errors.grain = 
            value.length == 0
            ? 'Grain  is required'
            : '';
            break;
            case 'Temp': 
            errors.Temp = 
            value.length == 0
            ? 'Temp  is required'
            : '';
            break;
            default:
            break;
            }
            this.setState({errors, [name]: value}, ()=> {
                console.log(errors)
            })
    
}


handleSubmit=(event) => {
  const hopsArray = this.state.Hops1.split(',');
  // console.log("hopsarray")
  // console.log(hopsArray)

    this.state.Hops= hopsArray
    // this.state.Grains= this.state.grain.split(',')

    const sArray = this.state.schedule.split(',');
    this.state.HopsSchedule= sArray 

    console.log(this.state);
    var data = this.state;
  
    
    fetch('http://127.0.0.1:5000/addRecipe', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
        name: data.name,
        Directions: data.Directions,
        Category:data.Category,
        BatchSize: data.BatchSize,
        Hops: data.Hops,
        // Grains: data.Grains,
        HopsSchedule: data.HopsSchedule    
          }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  
        }
    }).then(res => {
        if(res.status===200)
           this.message = 'Recipe added successfully'
        console.log(res.status) ;
        // this.props.history.push('/')
    }).catch(err => console.log(err));
  event.preventDefault();           
}


render() {
  //const items = this.state.Hops.map(item => <li>{item}</li> );
    return (
        <Container>
            <Card  className="cardMain">
         <Card.Body className="cardbodyRecipe" >
         <Card.Title className="titleCard" >Make your beer!</Card.Title>
         <p className="error-message">{this.state.errors.name}</p>
            <p className="error-message">{this.state.errors.BatchSize}</p> 
             <p className="error-message">{this.state.errors.Directions}</p>
            <p className="error-message">{this.state.errors.grain}</p>
            <p className="error-message">{this.state.errors.schedule}</p>
            <p className="error-message">{this.state.errors.Hops1}</p>
            <p className="error-message">{this.state.errors.Temp}</p>

      <Form >
          <Row>
          <Col>
        <FormGroup controlId="name">
                    <FormLabel color="white" >Recipe Name</FormLabel>
                    <FormControl
                        autoFocus
                        type="text" 
                        placeholder="e.g: AmericanPaleAle"
                        value={this.state.name} 
                        onChange={this.handleChange}
                    />
                </FormGroup>
                </Col>
                <Col> 
        <FormGroup controlId="BatchSize">
            <FormLabel color="white" >Batch Size</FormLabel>
            <FormControl
                        autoFocus
                        type="text" 
                        placeholder="in gallons (e.g: 10)"
                        value={this.state.BatchSize}
                        onChange={this.handleChange}
            />
        </FormGroup>
        
        </Col>
        
        </Row>
        
        
        <div>
               <select id="Category" onChange={this.handleChange} value={this.state.value}>
                  <option value="select">Select Recipe Category</option>
                  <option value="1">ABV less than 5%</option>
                  <option value="2">ABV greater than 5%</option>
                  <option value="none">none</option>
                  
               </select>
               <p></p>
               {/* <p>{this.state.value}</p> */}
         </div>
               
        <FormGroup controlId="Directions">
            <FormLabel color="white" >Directions</FormLabel>
            <FormControl
                        autoFocus
                        type="text" 
                        placeholder="e.g: Mash at 150˚F for 60 minutes or until conversion is complete. Boil for..."
                        value={this.state.Directions}
                        onChange={this.handleChange}
            />
            <div><h5>Please Enter comma separated values for below fields: </h5></div>
        <FormGroup controlId="Hops1">
                    <FormLabel color="white" >Add Hops and Grains</FormLabel>
                    <FormControl
                        autoFocus
                        type="text" 
                        placeholder="hop1: qty1, hop2: qty2 (e.g: Chinook: 20, Simcoe: 15)"
                        value={this.state.Hops1} 
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="schedule">
                    <FormLabel color="white">Hops Schedule</FormLabel>
                    <FormControl
                        autoFocus
                        type="text" 
                        placeholder="e.g: Cascade at knockout, Simcoe at 30mins"
                        value={this.state.schedule} 
                        onChange={this.handleChange}
                    />
                </FormGroup>
        
            {/* <FormGroup controlId="grain">
                    <FormLabel color="white" >Grains/BatchSize</FormLabel>
                    <FormControl
                        autoFocus
                        type="text" 
                        placeholder="grain1 qty1, grain2 qty2.."
                        value={this.state.grain} 
                        onChange={this.handleChange}
                        
                    />
                </FormGroup> */}
        </FormGroup>
        <Button onClick = {this.handleSubmit} id="button" type="submit"> Submit </Button>
      </Form>
      </Card.Body>
      </Card>
</Container>
    )
  }
}
