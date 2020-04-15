import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import MessageUserListForm from '../Forms/user/MessageUserListForm';
// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const UserDetail = (props) => {

  const {...user} = props.user;
  const profileImages = user.profileImages;
  // console.log(profileImages);
  const interests = user.interests;

  // let userDob = new Date(user.dob.substr(0,9) * 1000).toISOString().slice(0,10);

  return (
    <div className={"UserDetailBox1"}>

    <Tabs defaultActiveKey="Demographics" id="uncontrolled-tab-example" className="tab">

      <Tab eventKey="Demographics" title="Demographics">
      <Card className="UserDetailCard">
      <Card.Body>
        <Card.Title><span className="ul">User Details</span></Card.Title>
        <Row className="detailCardRow">
          <Col className="detailCardCol">
          <Card.Img variant="top" src={user.profileImages[0].path} />
          <Card.Text>
            <span className="bold">ID:</span> {user._id}
          </Card.Text>
          <Card.Text>
            <span className="bold">Username:</span> {user.username}
          </Card.Text>
          <Card.Text>
            <span className="bold">Role:</span> {user.role}
          </Card.Text>
          <Card.Text>
            <span className="bold">Bio:</span> {user.bio}
          </Card.Text>
          </Col>

          <Col className="detailCardCol">



          </Col>
        </Row>

        <Row className="detailCardRow">
        <Button variant="secondary" onClick={props.onFriendRequest.bind(this, props.user)}>
          RequsetFriend
        </Button>
        <Button variant="info" onClick={props.onStartSendMessage.bind(this, props.user)}>
          Message
        </Button>
        <Button variant="danger" onClick={props.onHideUserDetail}>
          x
        </Button>
          <Col className="detailCardCol">
            { props.canDelete === true && (
              <Button variant="danger" onClick={props.onDelete.bind(this, user._id)}>
                Delete !!??
              </Button>
            )}
            { props.canReport === true && (
              <Button variant="danger" onClick={props.onReport.bind(this, user._id)}>
                Report!!??
              </Button>
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>

      {props.creatingMessage === true &&
        props.messageReceiver !== null && (
        <MessageUserListForm
          receiver={props.messageReceiver}
          onCancel={props.cancelMessage}
          onConfirm={props.sendMessage}
        />
      )}
      </Tab>

    </Tabs>

    </div>

  );
}

export default UserDetail;
