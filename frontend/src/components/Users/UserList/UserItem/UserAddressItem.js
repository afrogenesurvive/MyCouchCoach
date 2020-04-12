import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';

import './UserItem.css';

const userAddressItem = props => (
  <li key={props.authId} className="users__list-item_detail users__list-item_detail1">
    <div>

    <Card className="card">
      <Card.Body>

      <Card.Text>
        type: {props.type}
      </Card.Text>
      <Card.Text>
        number: {props.number}
      </Card.Text>
      <Card.Text>
        street: {props.street}
      </Card.Text>
      <Card.Text>
        town: {props.town}
      </Card.Text>
      <Card.Text>
        city: {props.city}
      </Card.Text>
      <Card.Text>
        country: {props.country}
      </Card.Text>
      <Card.Text>
        postalCode: {props.postalCode}
      </Card.Text>
      <Card.Text>
        primary: {props.primary.toString()}
      </Card.Text>

        <Card.Link href="">
        { props.canDelete === true && (
          <Button variant="danger" onClick={props.onDelete.bind(this, props.address)}>
            Delete
          </Button>
        )}
          </Card.Link>
          <Card.Link href="">
          <Button variant="danger" onClick={props.makeAddressPrimary.bind(this, props.address)}>
            Make Primary
          </Button>
        </Card.Link>
        <Card.Link href="">
        { props.orderForm === true && (
          <Button variant="danger" value={JSON.stringify(props.address)} onClick={props.addToOrder.bind('x')}>
            Add to order
          </Button>
        )}
        </Card.Link>
      </Card.Body>
    </Card>
    </div>

  </li>
);

export default userAddressItem;
