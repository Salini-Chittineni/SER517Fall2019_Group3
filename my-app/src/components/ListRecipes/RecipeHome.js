import React, { Component } from 'react';
import './RecipeHome.css';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image'
import { Container, Row, Col } from 'react-bootstrap';
import ModalForm from './Modals/modalFormAM';
import ModalFormWD from './Modals/modalFormWD';
import ModalFormWW from './Modals/modalFormWW';
import ModalFormSP from './Modals/modalFormSP';
export default class RecipeHome extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showComponent: false
    };
    this._onButtonClick = this._onButtonClick.bind(this);
  }

  _onButtonClick() {
    this.setState({
      showComponent: true,
    });
  }

  render(){
  return (

    <div>

      <div className="about-us">
        Recipe
      </div>
     <Container>
     <Card  className="cardMainOne1">
  <Card.Body className ="card-body-one">
    <Card.Title className="card-title">Brew More! Worry Less!</Card.Title>
    <Card.Text >
       <h3>Select the recipe you want view</h3>
    </Card.Text>
  </Card.Body>
</Card>
     </Container>

<Container>
  <Row>
  <Col xs={6} md={4}>
    <Card className='card-image'>
      <Card.Body>
        <Image className='card-image2' src="/images/americanPaleAle.jpg" thumbnail/>
        <Card.Title>American Pale Ale</Card.Title>
        <ModalForm buttonLabel="view" />
        {/* <Button id = "btn" type="submit" onClick={this.deleteItemAM}>Delete</Button> */}
      </Card.Body>
    </Card>
  </Col>
  <Col xs={6} md={4}>
    <Card className='card-image'>
      <Card.Body>
        <Image className='card-image2' src="/images/winterWarmer.jpeg" thumbnail/>
        <Card.Title>Winter Warmer</Card.Title>
        <ModalFormWW buttonLabel="view" />
      </Card.Body>
    </Card>
  </Col>

  </Row>
  <Row className='alignment'>
    <Col xs={6} md={4}>
    <Card className='card-image' >
      <Card.Body>
        <Image  className='card-image2' src="/images/whitedogIPA.jpg" thumbnail/>
        <Card.Title>White Dog IPA</Card.Title>
        <ModalFormWD buttonLabel="view" />
        </Card.Body>
    </Card>
  </Col>
  
  <Col xs={6} md={4}>
    <Card className='card-image' >
      <Card.Body>
        <Image  className='card-image2' src="/images/smashPaleAle.png" thumbnail/>
        <Card.Title>Smash Pale Ale</Card.Title>
        <ModalFormSP buttonLabel="view" />
      </Card.Body>
    </Card>
  </Col>
  
  </Row>
</Container>
    </div>
    
  );
  }
}

