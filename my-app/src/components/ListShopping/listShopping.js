
import React, { Component } from "react";

import './listShopping.css';
import Card from 'react-bootstrap/Card';
import DataTable from './datatable';
import AutoShopDatatable from './autoShopDatatable'
import { Container, Row, Col, Button } from 'react-bootstrap';
import Loader from 'react-loader-spinner';
export default class ListShopping extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            items: [],
            autoItems: [],
            response: {},
            userID: sessionStorage.getItem("username")
        }
        this.items = null;
        this.loading = true;
        this.getItems();
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
    }

    handleSubmit = event => {
        this.props.history.push('/addShoppingItem')
    }

    handleSubmitA = event => {

        var data = this.state.autoItems;
        for(let i=0;i<this.state.autoItems.length;i++) {
            if (data[i][2] == true) {
                fetch('http://127.0.0.1:5000/movetToShopList', {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("username"),
                        [data[i][0]] : data[i][1]
                        // [data.name] : data.quantity

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

                    }
                }).then(res => {
                    if (res.status === 200)
                        this.message = 'Ingredient added successfully'
                }).catch(err => console.log(err));
            }
        }
        event.preventDefault();
        // this.props.history.push('/shoppinglist')
        // this.props.history.push('/ingredientList')
        window.location.reload();
    }

    handleSubmitB = event => {

        var data = this.state.items;
        for(let i=0;i<this.state.items.length;i++) {
            if (data[i][2] == true) {
                fetch('http://127.0.0.1:5000/updatedList', {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify({
                        userID: sessionStorage.getItem("username"),
                        [data[i][0]] : data[i][1]
                        // [data.name] : data.quantity

                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': 'http://127.0.0.1:5000',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'

                    }
                }).then(res => {
                    if (res.status === 200)
                        this.message = 'Ingredient added successfully'
                }).catch(err => console.log(err));
            }
        }
        event.preventDefault();
        window.location.reload();
    }


    deleteAutoItem = (item) => {
        const updatedItems = this.state.autoItems.filter(i => i[0] !== item[0]);
        this.setState({ autoItems: updatedItems })

      }

      deleteItem = (item) => {
        const updatedItems = this.state.items.filter(i => i[0] !== item[0]);
        this.setState({ items: updatedItems })

      }

    checkItem = (item) =>{

        if(item[2]==false)
            item[2]=true;
        else
        {
            item[2]=false;
        }
        const itemIndex = this.state.items.findIndex(data => data[0] === item[0])
        const newArray = [
            ...this.state.items.slice(0, itemIndex),
            item,
            ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({items: newArray})
    }

    checkItemA = (item) =>{

        if(item[2]==false)
            item[2]=true;
        else
        {
            item[2]=false;
        }

        const itemIndex = this.state.autoItems.findIndex(data => data[0] === item[0])
        const newArray = [
            ...this.state.autoItems.slice(0, itemIndex),
            item,
            ...this.state.autoItems.slice(itemIndex + 1)
        ]
        this.setState({autoItems: newArray})
    }

    deleteIngredient =(item)=>{
        fetch('http://127.0.0.1:5000/deleteShopListItems', {
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

    updateState = (item) => {

        const itemIndex = this.state.items.findIndex(data => data[0] === item[0])
        const newArray = [
            ...this.state.items.slice(0, itemIndex),
            item,
            ...this.state.items.slice(itemIndex + 1)
        ]
        this.setState({items: newArray})
    }

    updateStateAuto = (item) => {

        const itemIndex = this.state.autoItems.findIndex(data => data[0] === item[0])
      

        const newArray = [
            ...this.state.autoItems.slice(0, itemIndex),
            item,
            ...this.state.autoItems.slice(itemIndex + 1)
        ]
     
        this.setState({autoItems: newArray})
    }

    getItems = () => {
        var uname = sessionStorage.getItem("username");
        if (uname == null) {
            this.props.history.push('/signin')
        } else {
            var apiUrl = 'http://127.0.0.1:5000/showShoppingList?userID=' + sessionStorage.getItem("username")
            fetch(apiUrl)
                .then(res => res.json())
                .then(
                    (result) => {
                        var data = result['ShoppingList'];
                        if (data==null)
                            return;
                        this.loading = false;
                        var items = [];
                        var userID = ""
                        var checked = false;
                        Object.keys(data).forEach(function (key) {

                            if (key == "userID") {
                                userID = data[key];
                            }
                            if (key != "userID" && key != "_id") {
                                items.push([
                                    key, data[key], checked
                                ]);
                            }

                        });
                        this.setState({
                            userID: userID,
                            items: items
                        });


                        const ingrarray = Object.keys(this.state.items).map(i => this.state.items[i])
                        this.items = ingrarray;
                    },
                    (error) => {
                        this.setState({error});
                    }
                )

            var apiUrl = 'http://127.0.0.1:5000/createAutoShopList?userID=' + sessionStorage.getItem("username")
            fetch(apiUrl)
                .then(res => res.json())
                .then(
                    (result) => {
                        var data = result['Auto ShoppingList'];
                        if (data==null)
                            return;
                        this.loading = false;
                        // var items = [];
                        var autoItems = [];
                        var userID = ""
                        var checked = false;
                        Object.keys(data).forEach(function (key) {
                            if (key == "userID") {
                                userID = data[key];
                            }
                            if (key != "userID" && key != "_id") {
                                autoItems.push([
                                    key, data[key],checked=false
                                ]);
                            }

                        });

                        this.setState({
                            userID: userID,
                            autoItems: autoItems
                        });


                        const ingrarray = Object.keys(this.state.autoItems).map(i => this.state.autoItems[i])
                        this.autoItems = ingrarray;
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
                <Card className="mainCardOneshop">
                    <Card.Body className="cardbodyshop">
                        <form>
                        <Card.Title className="titleCard">Shopping List </Card.Title>
                        {this.loading ? <Loader
                            type="Circles"
                            color="#00BFFF"
                            height={100}
                            width={100}
                            timeout={3000} //3 secs

                        /> : <DataTable itemType ="shoppinglist" userID={this.state.userID} userID={this.state.userID}
                                        items={this.state.items}
                                        updateState={this.updateState}
                                        deleteItem = {this.deleteItem} 
                                        deleteIngredient = {this.deleteIngredient}
                        checkItem={this.checkItem}></DataTable>}
                        <Button onClick = {this.handleSubmit}  id = "btn-color" type="submit" >Add Item</Button>
                            &nbsp;
                            <Button onClick = {this.handleSubmitB}  id = "btn-color" type="submit">Save</Button>
                        </form>

                        <form>

                        <Card.Title className="titleCard" >Auto-Shopping List </Card.Title>
                        {this.loading ?       <Loader
                        type="Circles"
                        color="#00BFFF"
                        height={100}
                        width={100}
                        timeout={3000} //3 secs

                        />: 
                        <AutoShopDatatable itemType ="shoppinglist"  userID={this.state.userID} items={this.state.autoItems}
                        updateState={this.updateStateAuto}
                        deleteItem = {this.deleteAutoItem} deleteIngredient = {this.deleteIngredient}
                                           checkItemA={this.checkItemA}></AutoShopDatatable>
                        }

                            <Button onClick = {this.handleSubmitA}  id = "btn-color" type="submit">Save</Button>
                        </form>



                    </Card.Body>
                </Card>
            </Container>


        );
    }

    render() {
        return (
            <div>
                {this.renderList()}
            </div>
        );
    }
}



