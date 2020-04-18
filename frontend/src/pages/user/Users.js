import S3 from 'react-aws-s3';
import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';

import AuthContext from '../../context/auth-context';
import UserList from '../../components/Users/UserList/UserList';
import SearchUserList from '../../components/Users/UserList/SearchUserList';
import UserDetail from '../../components/Users/UserDetail';

import Spinner from '../../components/Spinner/Spinner';
import SidebarPage from '../Sidebar';
import SidebarControl from '../../components/SidebarControl';
import AlertBox from '../../components/AlertBox';
import LoadingOverlay from '../../components/LoadingOverlay';
import AttachmentViewer from '../../components/AttachmentViewer';
import UserDetailViewer from '../../components/UserDetailViewer';

import SearchUserFieldBasicForm from '../../components/Forms/user/SearchUserFieldBasicForm';
import SearchUserFieldRegexForm from '../../components/Forms/user/SearchUserFieldRegexForm';

import './Users.css';

class UsersPage extends Component {
  state = {
    creating: false,
    updating: false,
    deleting: false,
    searching: false,
    user: null,
    users: [],
    searchUsers: [],
    isLoading: false,
    isSorting: false,
    selectedUser: null,
    detailsLoaded: false,
    creatingMessage: false,
    messageReceiver: null,
    userUpdateField: null,
    userSearchField: null,
    userSearchQuery: null,
    canDelete: null,
    canReport: false,
    userAlert: null,
    overlay: false,
    overlayStatus: "test",
    file: null,
    showDetail: false,
    showAttachment: false,
    showThisAttachmentFile: null,
    showThisAttachmentType: null,
    sidebarShow: true,
    mCol1Size: 3,
    mCol2Size: 9,
  };
  isActive = true;

  static contextType = AuthContext;

  componentDidMount() {

    if (this.context.user.role === "Admin"){
      this.setState({canDelete: true})
    }

    if (JSON.stringify(this.context.selectedUser) !== "{}") {
      this.setState({ selectedUser: this.context.selectedUser })
    }

    this.fetchUsersBasic();
  }



  modalConfirmSearchBasicHandler = (event) => {
    event.preventDefault();
    let activityId = this.context.activityId;
    const token = this.context.token;
    let field = null;
    let query = event.target.formBasicQuery.value;
    if (event.target.formBasicFieldSelect.value === "select") {
      field = event.target.formBasicField.value;
    } else {
      field = event.target.formBasicFieldSelect.value;
    }

    this.setState({
      userSearchField: field,
      userSearchQuery: query,
      searching: false,
      userAlert: "Searching for User..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const search = { field, query };
    const requestBody = {
      query: `
        query {getUsersByField(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,role,username,public,clientConnected}}
      `}

    fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data.getUsersByField).slice(0,8);
        const searchUsers = resData.data.getUsersByField;
        this.setState({ searchUsers: searchUsers, userAlert: responseAlert})
      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }
  modalConfirmSearchRegexHandler = (event) => {
    event.preventDefault();
    let activityId = this.context.activityId;
    const token = this.context.token;
    let field = null;
    let query = event.target.formBasicQuery.value;
    if (event.target.formBasicFieldSelect.value === "select") {
      field = event.target.formBasicField.value;
    } else {
      field = event.target.formBasicFieldSelect.value;
    }

    this.setState({
      userSearchField: field,
      userSearchQuery: query,
      searching: false,
      userAlert: "Searching for User..."
    })

    if (
      field.trim().length === 0 ||
      query.trim().length === 0
    ) {
      this.setState({userAlert: "blank fields detected!!!...Please try again..."})
      return;
    }

    const search = { field, query };
    const requestBody = {
      query: `
        query {getUsersByFieldRegex(
          activityId:"${activityId}",
          field:"${field}",
          query:"${query}"
        )
        {_id,role,username,public,clientConnected}}
      `}

    fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const responseAlert = JSON.stringify(resData.data.getUsersByFieldRegex).slice(0,8);
        const searchUsers = resData.data.getUsersByFieldRegex;
        if (searchUsers === [] ) {
          this.setState({ userAlert: '... nothing found soz...'})
        } else {
          this.setState({ searchUsers: searchUsers, userAlert: responseAlert})
        }

      })
      .catch(err => {
        this.setState({userAlert: err});
      });
  }

  modalCancelHandler = () => {
    this.setState({ creating: false, updating: false, deleting: false, searching: false});
  };

  fetchUsersBasic() {
    this.setState({ isLoading: true, userAlert: "Fetching User Master List..." });
    const activityId = this.context.activityId;

    const requestBody = {
      query: `
          query {getAllUsers(
            activityId:"${activityId}"
          )
          {_id,role,username,public,clientConnected}}
        `};

    fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
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
        const responseAlert = JSON.stringify(resData.data.getAllUsers).slice(0,8);
        this.setState({userAlert: responseAlert, users: resData.data.getAllUsers, isLoading: false});
        this.context.users = this.state.users;
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  deleteListUser = (userId) => {
    console.log("delete listed user", userId);
  }

  reportUser = (userId) => {
    console.log("reporting user", userId);
  }

  startSendMessage = (args) => {
    console.log("opening message form...");
    this.setState({creatingMessage: true, messageReceiver: {_id: args._id, username: args.username}})
  }
  cancelMessage = () => {
    this.setState({creatingMessage: false})
  }
  sendMessage = (event) => {
    event.preventDefault();
    console.log(this.state.messageReceiver,event.target);
    this.setState({creatingMessage: false, userAlert: "sending message..."});
    const activityId = this.context.activityId;
    const senderId = activityId;
    const receiverId = this.state.messageReceiver._id;
    const type = event.target.formBasicTypeSelect.value;
    const subject = event.target.formGridSubject.value;
    const message = event.target.formGridMessage.value;

    const requestBody = {
      query: `
        mutation {createMessage(
          activityId:"${activityId}",
          senderId:"${senderId}",
          receiverId:"${receiverId}",
          messageInput:{
            type:"${type}",
            subject:"${subject}",
            message:"${message}"
          })
          {_id,date,time,type,subject,sender{_id,username},receiver{_id,username},message,read}}
        `};

    fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
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
        console.log(JSON.stringify(resData.data.createMessage));
        const responseAlert = JSON.stringify(resData.data.createMessage).slice(0,8);
        this.setState({userAlert: responseAlert});
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

showDetailHandler = userId => {
  this.setState({ isLoading: true, userAlert: "Fetching User Details...", showDetail: true });
  const activityId = this.context.activityId;

  const requestBody = {
    query: `
        query {getUserById(
          activityId:"${activityId}",
          userId:"${userId}"
        )
        {_id,role,username,public,clientConnected,age,bio,socialMedia{platform,handle,link},profileImages{name,type,path},interests,tags}}
      `};

  fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.context.token
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
      const responseAlert = JSON.stringify(resData.data.getUserById).slice(0,8);
      this.setState({userAlert: responseAlert, selectedUser: resData.data.getUserById, detailsLoaded:true, isLoading: false});
      this.context.selectedUser = this.state.selectedUser;
    })
    .catch(err => {
      this.setState({userAlert: err});
      if (this.isActive) {
        this.setState({ isLoading: false });
      }
    });
};

selectUserNoDetail = (user) => {
  this.setState({selectedUser: user});
  this.context.selectedUser = user;
}

hideDetailHandler = () => {
  this.setState({showDetail: false, overlay: false})
}


  onFriendRequest = (args) => {
    console.log("sending friend request...",args._id);
    this.setState({ userAlert: "sending friend request..."});
    const activityId = this.context.activityId;
    const senderId = activityId;
    const receiverId = args._id;

    const requestBody = {
      query: `
          mutation {sendFriendRequest(
            activityId:"${activityId}",
            senderId:"${senderId}",
            receiverId:"${receiverId}"
          )
          {_id,role,username,public,clientConnected,friendRequests{date,sender{_id},receiver{_id}}}}
        `};

    fetch('http://ec2-3-81-110-166.compute-1.amazonaws.com/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.context.token
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
        console.log(JSON.stringify(resData.data.sendFriendRequest.friendRequests));
        const responseAlert = JSON.stringify(resData.data.sendFriendRequest).slice(0,8);
        this.setState({userAlert: responseAlert});
      })
      .catch(err => {
        this.setState({userAlert: err});
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });


  }

  onViewAttachment = (attachment) => {

      this.setState({showAttachment: true})

      const file = "https://ent-emr-bucket.s3-us-east-2.amazonaws.com/"+attachment.path+"/"+attachment.name;
      const type = attachment.format;

      this.setState({showThisAttachmentFile: file, showThisAttachmentType: type, })
  }

  closeAttachmentView = () => {

      this.setState({showAttachment: false})
  }

  userSearchClearlHandler () {
    this.setState({searchUsers: [], userAlert: "clearing user search results"});
  }

  showSidebar = () => {
      this.setState({
        sidebarShow: true,
        mCol2Size: 9
      })
  }

  hideSidebar = () => {
      this.setState({
        sidebarShow: false,
        mCol2Size: 11
      })
  }

  componentWillUnmount() {
    this.isActive = false;
  }

  render() {
    return (
    <React.Fragment>
      {this.state.showAttachment === true && (
        <AttachmentViewer
          onCloseAttachmentView={this.closeAttachmentView}
          attachmentFile={this.state.showThisAttachmentFile}
          attachmentType={this.state.showThisAttachmentType}
        />
      )}
      <AlertBox
        authId={this.context.activityId}
        alert={this.state.userAlert}
      />

      {this.state.showDetail === true &&
        this.state.detailsLoaded === true && (
        <UserDetailViewer
          user={this.state.selectedUser}
          onHideUserDetail={this.hideDetailHandler}
          canDelete={this.state.canDelete}
          onDelete={this.deleteListUser}
          canReport={this.state.canReport}
          onReport={this.reportUser}
          onFriendRequest={this.onFriendRequest}
          onStartSendMessage={this.startSendMessage}
          creatingMessage={this.state.creatingMessage}
          messageReceiver={this.state.messageReceiver}
          cancelMessage={this.cancelMessage}
          sendMessage={this.sendMessage}
        />
      )}
      <SidebarControl
        onShowSidebar={this.showSidebar}
        onHideSidebar={this.hideSidebar}
      />
      {this.state.overlay === true && (
        <LoadingOverlay
          status={this.state.overlayStatus}
        />
      )}

      <Accordion>

        <Row>
        <Col md={2} className="MasterCol1">
        <SidebarPage
          you={this.context.user}
          authId={this.context.activityId}
        />
        </Col>

        <Col md={this.state.mCol2Size} className="MasterCol2">
            <Container className="containerCombinedDetail1">
              <Tab.Container id="left-tabs-example" defaultActiveKey="MasterList">
                <Row>
                  <Col sm={2} className="userListSubMenuCol">
                    <Nav variant="pills" className="flex-column">
                      <Nav.Item>
                        <Nav.Link eventKey="MasterList">List</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="SearchInput">Search</Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>

                  <Col sm={10} className="userListMainCol">
                    <Tab.Content>

                      <Tab.Pane eventKey="MasterList">
                        <Row className="userListRow">

                         {this.state.isLoading ? (
                           <Spinner />
                         ) : (
                           <UserList
                            canReport={this.state.canReport}
                            onReport={this.reportUser}
                             users={this.state.users}
                             authId={this.context.activityId}
                             onViewDetail={this.showDetailHandler}
                             onSelectNoDetail={this.selectUserNoDetail}

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
                          <SearchUserFieldRegexForm
                          authUserId={this.context.userId}
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchRegexHandler}
                            confirmText="Search"
                            user={this.context.selectedUser}
                          />
                          <SearchUserFieldBasicForm
                          authUserId={this.context.userId}
                          canCancel
                            canConfirm
                            onCancel={this.modalCancelHandler}
                            onConfirm={this.modalConfirmSearchBasicHandler}
                            confirmText="Search"
                            user={this.context.selectedUser}
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
                                Field: {this.state.userSearchField}  ,   Query: {this.state.userSearchQuery}
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Row>
                        <Row className="searchListRow1">

                        {this.state.searchUsers !== [] && (
                          <SearchUserList
                          canReport={this.state.canReport}
                          onReport={this.reportUser}
                           users={this.state.searchUsers}
                           authId={this.context.activityId}
                           onViewDetail={this.showDetailHandler}
                           onSelectNoDetail={this.selectUserNoDetail}
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

export default UsersPage;
