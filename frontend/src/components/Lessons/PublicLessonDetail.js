import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
// import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import LessonScheduleList from './LessonList/LessonScheduleList';
import LessonRequirementList from './LessonList/LessonRequirementList';
import LessonImageList from './LessonList/LessonImageList';
import LessonReviewList from './LessonList/LessonReviewList';
import LessonTagList from './LessonList/LessonTagList';

// import AuthContext from '../../context/auth-context';

import './UserDetail.css';

const PublicLessonDetail = (props) => {

  const {...lesson} = props.lesson;
  return (
    <div className={"UserDetailBox1"}>
    <Row className="detailCardRow">
      <Col className="detailCardCol">
        <Button variant="danger" onClick={props.onHideLessonDetail}>
          x
        </Button>
      </Col>
      </Row>
    <Tabs defaultActiveKey="Basic" id="uncontrolled-tab-example" className="tab">

      <Tab eventKey="Basic" title="Basic">
      <Card className="UserDetailCard">
      <Card.Body>
        <Card.Title><span className="ul">Lesson Details</span></Card.Title>
        <Row className="detailCardRow">
          <Col className="detailCardCol">
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
            <span className="bold">Type:</span> {lesson.type}
          </Card.Text>
          <Card.Text>
            <span className="bold">Category:</span> {lesson.category}
          </Card.Text>
          <Card.Text>
            <span className="bold">Price:</span> {lesson.price}
          </Card.Text>
          <Card.Text>
            <span className="bold">Description:</span> {lesson.description}
          </Card.Text>

          </Col>

          <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">Main Instructor:</span>
            {lesson.instructors[0]._id}
            {lesson.instructors[0].username}
          </Card.Text>

          <Button variant="danger" onClick={props.showSchedule}>
            See dates
          </Button>
          <Button variant="danger" onClick={props.hideSchedule}>
            Hide dates
          </Button>
          {props.showScheduleState === true && (
            <LessonScheduleList
              lessonSchedule={lesson.schedule}
            />
          )}

          </Col>

        </Row>




      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="requirements" title="requirements">
      <Card className="UserDetailCard">
      <Card.Body>
        <Row>
          <Col>
          <Card.Text>
          Requirements
          </Card.Text>
              <LessonRequirementList
                public
                lessonRequirements={lesson.requirements}
              />
          </Col>
        </Row>
      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="images" title="images">
      <Card className="UserDetailCard">
      <Card.Body>
        <Row>
          <Col>
          <Card.Text>
          Images
          </Card.Text>
              <LessonImageList
                public
                lessonImages={lesson.gallery}
              />
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="reviews" title="reviews">
      <Card className="UserDetailCard">
      <Card.Body>

        <Row>
          <Col>
          <Card.Text>
          Reviews
          </Card.Text>
              <LessonReviewList
                lessonReviews={lesson.reviews}
              />
          </Col>
        </Row>

      </Card.Body>
      </Card>
      </Tab>

      <Tab eventKey="tags" title="tags">
      <Card className="UserDetailCard">
      <Card.Body>
      <Row>
        <Col>
        <Card.Text>
        Tags
        </Card.Text>

            <LessonTagList
              public
              lessonTags={lesson.tags}
            />
        </Col>
      </Row>

      </Card.Body>
      </Card>
      </Tab>

    </Tabs>

    </div>

  );
}

export default PublicLessonDetail;
