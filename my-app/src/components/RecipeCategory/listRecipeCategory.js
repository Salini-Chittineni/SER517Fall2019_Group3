import React, { Component } from "react";

import './listRecipe.css';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button,Form,
    FormGroup,
    FormControl,
    FormLabel, } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
import ListRecipeDatatable from "./listRecipeDatatable";
export default class ListRecipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            response: {},
            name:"",
            names:[]
        }
        this.items = null;
        this.loading = true;
        this.names=null;
        this.name=null;

    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit=(event)=> {
        //console.log(this.state);
        var xhr = new XMLHttpRequest()
        xhr.open('POST', 'http://127.0.0.1:5000/')

        event.preventDefault();
      }

      deleteItem = (name) => {
        const updatedItems = this.state.names.filter(i => i[0] !== name[0]);
        this.setState({ names: updatedItems })
       }
     
   
     deleteRecipe =(name)=>{
       // console.log("in delRecipe")
       // console.log(name)
       fetch('http://127.0.0.1:5000/deleteRecipeAdmin', {
         method: 'post',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           name: name.toString()
         })
         
       })
       
       .then(() => {
           this.deleteItem(name)
         })
         .catch(err => console.log(err))

     }

     renderList() {
        return (
            
            <Container>
                <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
            <Card  className="mainCardOneMain">
         <Card.Body className = "card-body">
         <Card.Title className="titleCard" > Recipe Category</Card.Title>
             
                 <Button onClick ={this.getItems} id = "btn-color" variant="primary"  >View Beers</Button>
             
             {this.loading ?       <Loader
                 type="Circles"
                 color="#00BFFF"
                 height={100}
                 width={100}
                 timeout={2000} //2 secs

             /> :
              <ListRecipeDatatable names={this.state.names} deleteItem={this.deleteItem} deleteRecipe={this.deleteRecipe} ></ListRecipeDatatable>}

         </Card.Body>
       </Card>
       <Card  className="mainCardOneMain">
         <Card.Body className = "card-body">
         <Card.Title className="titleCard" > Click on the Category you wish to view</Card.Title>
             <Form onSubmit={this.handleSubmit}>
                 <Button onClick ={this.getItems} id = "btn-color" variant="primary"  >View Category 1</Button>
                 <Button onClick ={this.getItems} id = "btn-color" variant="primary"  >View Category 2</Button>
             </Form>
             {this.loading ?       <Loader
                 type="Circles"
                 color="#00BFFF"
                 height={100}
                 width={100}
                 timeout={2000} //2 secs

             /> :
              <ListRecipeDatatable names={this.state.names} deleteItem={this.deleteItem} deleteRecipe={this.deleteRecipe} ></ListRecipeDatatable>}

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