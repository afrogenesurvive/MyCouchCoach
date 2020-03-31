import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const LessonDetail = (props) => {

  const {...lesson} = props.lesson;
  // let userDob = new Date(user.dob.substr(0,9) * 1000).toISOString().slice(0,10);

  return (
    <div className={"UserDetailBox1"}>

    <Tabs defaultActiveKey="Basic" id="uncontrolled-tab-example" className="tab">

      <Tab eventKey="Basic" title="Basic">
      <Card className="UserDetailCard">
      <Card.Body>
        <Card.Title><span className="ul">Lesson Details</span></Card.Title>
        <Row className="detailCardRow">
          <Col className="detailCardCol">
          <Card.Img variant="top" src={lesson.gallery[0]} />
          <Card.Text>
            <span className="bold">ID:</span> {lesson._id}
          </Card.Text>
          <Card.Text>
            <span className="bold">Title:</span> {lesson.title}
          </Card.Text>
          <Card.Text>
            <span className="bold">Subtitle:</span> {lesson.subtitle}
          </Card.Text>
          <Card.Text>
            <span className="bold">Type:</span> {lesson.Type}
          </Card.Text>
          <Card.Text>
            <span className="bold">Category:</span> {lesson.Category}
          </Card.Text>
          <Card.Text>
            <span className="bold">Price:</span> {lesson.Price}
          </Card.Text>
          <Card.Text>
            <span className="bold">Description:</span> {lesson.Description}
          </Card.Text>

          </Col>

          <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">Main Instructor:</span>
            {lesson.instructors[0]._id}
            {lesson.instructors[0].username}
            {lesson.instructors[0].contact.phone}
            {lesson.instructors[0].contact.email}
          </Card.Text>
          </Col>
        </Row>

        <Row className="detailCardRow">
          <Col className="detailCardCol">
            { props.canDelete === true && (
              <Button variant="danger" onClick={props.onDelete.bind(this, lesson._id)}>
                Delete !!??
              </Button>
            )}
            { props.canReport === true && (
              <Button variant="danger" onClick={props.onReport.bind(this, lesson._id)}>
                Report!!??
              </Button>
            )}
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

    </Tabs>

    </div>

  );
}

export default LessonDetail;
