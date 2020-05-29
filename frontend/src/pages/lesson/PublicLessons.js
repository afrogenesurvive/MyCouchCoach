// import S3 from 'react-aws-s3';
import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';

import AuthContext from '../../context/auth-context';
import LessonList from '../../components/Lessons/LessonList/LessonList';
import SearchLessonList from '../../components/Lessons/LessonList/SearchLessonList';
// import SearchSession from '../../components/Lessons/LessonList/LessonItem/SearchSession';

import Spinner from '../../components/Spinner/Spinner';
import AlertBox from '../../components/AlertBox';
import LoadingOverlay from '../../components/LoadingOverlay';
import PublicLessonDetailViewer from '../../components/PublicLessonDetailViewer';

import SearchPublicLessonForm from '../../components/Forms/lesson/SearchPublicLessonForm';

import './Users.css';

class PublicLessonsPage extends Component {
  state = {
    searching: false,
    lesson: null,
    lessons: [],
    searchLessons: [],
    searchSession: null,
    isLoading: false,
    isSorting: false,
    selectedLesson: null,
    lessonSearchField: null,
    lessonSearchQuery: null,
    showSchedule: false,
    canDelete: null,
    canReport: null,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    file: null,
    showDetail: false,
    mCol1Size: 3,
    mCol2Size: 9,
    guestId: '5eGe76Ed7e3Ue422aSb2T60b',
  };
  isActive = true;
  static contextType = AuthContext;

  componentDidMount() {
    console.log('...public lessons component mounted...');
    this.fetchLessonsPublic();
  }

  modalConfirmPublicSearchHandler = (event) => {
    event.preventDefault();
    // const token = this.context.token;
    let field = event.target.formBasicFieldSelect.value;
    let query = event.target.formBasicQuery.value;

    this.setState({
      userSearchField: field,
      userSearchQuery: query,
      searching: false,
      userAlert: "Searching for Lesson..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const requestBody = {
      query: `
        query {getPublicLessonsByField(
          field:"${field}",
          query:"${query}"
        )
        {_id,title,subtitle,public,type,subType,category,price,points,description,duration,requirements,schedule{date,time},gallery{name,type,path,public},instructors{_id,username},tags,reviews{date,type,title,author{_id,username},body,rating}}}
      `}

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data.getPublicLessonsByField).slice(0,8);
          const searchLessons = resData.data.getPublicLessonsByField;
          this.setState({ searchLessons: searchLessons, userAlert: responseAlert})
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  modalCancelHandler = () => {
    this.setState({ searching: false, selectedLesson: null});
  };

  fetchLessonsPublic() {
    this.setState({ isLoading: true, userAlert: "Fetching Public Lesson Master List..." });
    const requestBody = {
      query: `
          query {getAllPublicLessons
            {_id,title,subtitle,public,type,subType,category,price,points,description,duration,requirements,schedule{date,time},gallery{name,type,path,public},instructors{_id,username},tags,reviews{date,type,title,author{_id,username},body,rating}}}
        `};

    fetch('http://localhost:8088/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          this.setState({userAlert: 'Failed!'});
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if (resData.errors) {
          this.setState({userAlert: resData.errors[0].message})
        } else {
          const responseAlert = JSON.stringify(resData.data).slice(0,8);
          this.setState({userAlert: '...success! Public lesson list retrieved...', lessons: resData.data.getAllPublicLessons, isLoading: false});
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showSchedule = () => {
    this.setState({showSchedule: true})
  };
  hideSchedule = () => {
    this.setState({showSchedule: false})
  };
  toggleSchedule = () => {
    if (this.state.showSchedule === false) {
      this.setState({showSchedule: true})
    } else {
      this.setState({showSchedule: false})
    }
  }

  showDetailHandler = lessonId => {
  this.setState(prevState => {
    const selectedLesson = prevState.lessons.find(e => e._id === lessonId);
    // this.context.selectedLesson = selectedLesson;
    this.setState({selectedLesson: selectedLesson, showDetail: true});
    return { selectedLesson: selectedLesson };
  });
};
  hideDetailHandler = () => {
  this.setState({showDetail: false, overlay: false})
};

  userSearchClearlHandler () {
    this.setState({searchUsers: [], userAlert: "clearing lesson search results"});
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
    <React.Fragment>
      <AlertBox
        authId={this.context.activityId}
        alert={this.state.guestId}
      />
      {this.state.showDetail === true && (
        <PublicLessonDetailViewer
          lesson={this.state.selectedLesson}
          onHideLessonDetail={this.hideDetailHandler}
          showScheduleState={this.state.showSchedule}
          showSchedule={this.showSchedule}
          hideSchedule={this.hideSchedule}
          toggleSchedule={this.toggleSchedule}
        />
      )}

      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}

      <Accordion>

        <Row>

        <Col md={this.state.mCol2Size} className="MasterCol2">
            <Container className="containerCombinedDetail1">
            <h1>Visitor lesson list</h1>

              <Tab.Container id="left-tabs-example" defaultActiveKey="MasterList">
                <Row>
                  <Col sm={2} className="userListSubMenuCol">
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="FeaturedList">List</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="SearchInput">Search</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  <Col sm={10} className="userListMainCol">
                    <Tab.Content>

                      <Tab.Pane eventKey="FeaturedList">
                        <Row className="userListRow">

                         {this.state.isLoading ? (
                           <Spinner />
                         ) : (
                           <LessonList
                           public
                            canReport={this.state.canReport}
                            onReport={this.reportLesson}
                             lessons={this.state.lessons}
                             onViewDetail={this.showDetailHandler}
                           />
                         )}
                        </Row>
                      </Tab.Pane>

                      <Tab.Pane eventKey="SearchInput">
                        <Container className="containerSearchUserInput1">

                        <Row className="searchUserRowForm1">
                        <Col md={10} className="searchUserColForm">
                        <Tabs defaultActiveKey="Field" id="uncontrolled-tab-example">

                        <Tab eventKey="Field" title="Search by Field:">
                          <SearchPublicLessonForm
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmPublicSearchHandler}
                            confirmText="Search"
                          />
                        </Tab>

                        </Tabs>
                        </Col>
                        </Row>

                        <Row>
                          <Card className="searchCard">
                            <Card.Body className="searchCardBody">
                              <Card.Title>This Search</Card.Title>
                              <Card.Text>
                                Field: {this.state.lessonSearchField}, Query: {this.state.lessonSearchQuery}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Row>
                        <Row className="searchListRow1">

                        {this.state.searchLessons !== [] && (
                          <SearchLessonList
                            lessons={this.state.searchLessons}
                            onViewDetail={this.showDetailHandler}
                          />
                        )}
                        </Row>

                        </Container>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Container>
        </Col>
      </Row>
  </Accordion>
</React.Fragment>
    );
  }
}

export default PublicLessonsPage;
