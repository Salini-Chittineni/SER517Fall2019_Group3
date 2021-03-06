/*Author: Salini Chittineni
  Date:   Oct 2, 2019
  About:  This is to render list of equipment oage.
*/
import React, { Component, useReducer } from "react";
import './Equipment.css';
import Card from 'react-bootstrap/Card';
import { Container, Row, Col, Button } from 'react-bootstrap';
import DataTable from '../ListIngredients/datatable';
import Loader from 'react-loader-spinner';
export default class equipmentList extends Component {
     constructor(props) {
        super(props);
        this.getEquipment = this.getEquipment.bind(this);
        this.message = ""
      
        this.state = {
          userID:"",
          error: null,
          equipment: [],
          response: {}
        }
         this.uname=sessionStorage.getItem("username")
         if(this.uname==null)
         {
             this.props.history.push('/signin')
         }
        this.equipment = null;
        this.loading = true;

        this.getEquipment();
        
    }


    handleSubmit=(event)=> {
        this.props.history.push('/equipment')
      }
      updateState = (item) => {
        
        const itemIndex = this.state.equipment.findIndex(data => data[0] === item[0])
        const newArray = [
          ...this.state.equipment.slice(0, itemIndex),
          item,
          ...this.state.equipment.slice(itemIndex + 1)
        ]
        this.setState({ equipment: newArray })
      }

      deleteItem = (item) => {
        const updatedItems = this.state.equipment.filter(i => i[0] !== item[0]);
        this.setState({ equipment: updatedItems })

      }

      deleteIngredient =(item)=>{
        fetch('http://127.0.0.1:5000/deleteEquipment', {
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
      getEquipment=()=>{
         var user= sessionStorage.getItem("username");
         if(user==null)
         {
             this.props.history.push('/signin')
         }
         else {
             var apiUrl = 'http://127.0.0.1:5000/showEquipment?userID='+user

             fetch(apiUrl)
                 .then(res => res.json())
                 .then(
                     (result) => {
                         var data = result['equipmentList'];
                         if (data==null)
                             return;
                         this.loading = false;
                         var equipment = [];
                         var userID = "";
                         Object.keys(data).forEach(function (key) {
                             if (key == "userID") {
                                 userID = data[key];
                             }
                             if (key != "userID" && key != "_id") {
                                 equipment.push([
                                     key, data[key]
                                 ]);
                             }

                         });

                         this.setState({
                             userID: userID,
                             equipment: equipment
                         });

                         const dataArray = Object.keys(this.state.equipment).map(i => this.state.equipment[i])
                         this.equipment = dataArray;
                         },
                     (error) => {
                         this.setState({error});
                     }
                 )
         }
   
         }
   
         renderList() {
            return (
                
                <Container>
                    <span class="iconify" data-icon="mdi-bottle-wine" data-inline="false"></span>
                <Card  className="mainCardOneThisEq">
             <Card.Body className = "cardbodyThisEq">
             <Card.Title className="titleCard" >List of Equipment</Card.Title>
             {this.loading ?       <Loader
             type="Circles"
             color="#00BFFF"
             height={100}
             width={100}
             timeout={3000} //3 secs
    
          />: <DataTable itemType="equipment" userID={this.state.userID} items={this.state.equipment}  updateState={this.updateState} deleteItem = {this.deleteItem} deleteIngredient = {this.deleteIngredient}></DataTable>}
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
