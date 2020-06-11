import React from 'react';
// import React, {useState} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Form from 'react-bootstrap/Form';

import UserAddressList from './UserList/UserAddressList';
import UserProfileImageList from './UserList/UserProfileImageList';
import UserSocialMediaList from './UserList/UserSocialMediaList';

import UserPerkList from './UserList/UserPerkList';
import UserPromoList from './UserList/UserPromoList';

import UserInterestList from './UserList/UserInterestList';
import UserTagList from './UserList/UserTagList';

import UserFriendList from './UserList/UserFriendList';
import UserFriendRequestList from './UserList/UserFriendRequestList';
import UserCartItemList from './UserList/UserCartItemList';
import UserBookedLessonList from './UserList/UserBookedLessonList';
import UserLikedLessonList from './UserList/UserLikedLessonList';
import UserAttendedLessonList from './UserList/UserAttendedLessonList';
import UserToTeachLessonList from './UserList/UserToTeachLessonList';
import UserTaughtLessonList from './UserList/UserTaughtLessonList';
import UserPaymentInfoList from './UserList/UserPaymentInfoList';

import UserOrderList from './UserList/UserOrderList';
import UserReviewList from './UserList/UserReviewList';
import UserMessageList from './UserList/UserMessageList';
import UserCancellationList from './UserList/UserCancellationList';
import UserActivityList from './UserList/UserActivityList';

import UpdateUserBasicForm from '../Forms/user/UpdateUserBasicForm';
import UpdateUserFieldForm from '../Forms/user/UpdateUserFieldForm';

import AddUserAddressForm from '../Forms/user/AddUserAddressForm';
import AddUserProfileImageForm from '../Forms/user/AddUserProfileImageForm';
import AddUserSocialMediaForm from '../Forms/user/AddUserSocialMediaForm';

import AddUserInterestsForm from '../Forms/user/AddUserInterestsForm';
import AddUserTagsForm from '../Forms/user/AddUserTagsForm';

import AddUserPaymentInfoForm from '../Forms/user/AddUserPaymentInfoForm';

import AddUserPointsForm from '../Forms/user/AddUserPointsForm';
import AddUserPerkForm from '../Forms/user/AddUserPerkForm';
import AddUserPromoForm from '../Forms/user/AddUserPromoForm';

import AddUserFriendForm from '../Forms/user/AddUserFriendForm';
import CreateMessageForm from '../Forms/message/CreateMessageForm';
import CreateOrderForm from '../Forms/order/CreateOrderForm';
import CreateReviewForm from '../Forms/review/CreateReviewForm';
import CreateLessonForm from '../Forms/lesson/CreateLessonForm';

import MeetingSessionList from '../Lessons/LessonList/MeetingSessionList';
import SessionDetailViewer from '../SessionDetailViewer';

import Spinner from '../Spinner/Spinner';



import './thisUserProfile.css';

const thisUserProfile = (props) => {
const {...user} = props.user;

// const userAddress = user.address;
const userDob = new Date(user.dob.substr(0,9)*1000).toLocaleDateString().slice(0,10);

let sentRequests = [];
let receivedRequests = [];
if (user.friendRequests !== []) {
  // console.log('!!!',user._id, user.friendRequests, user.friendRequests[0].sender._id, user.friendRequests[0].receiver._id);
  sentRequests = user.friendRequests.filter(request => request.sender._id === user._id);
  receivedRequests = user.friendRequests.filter(request => request.receiver._id === user._id);
}

let messagesSent = [];
let messagesReceived = [];
messagesSent = user.messages.filter(x => x.sender._id === props.authId);
messagesReceived = user.messages.filter(x => x.receiver._id === props.authId);
const reviewedLessonIds = user.reviews.map(x => x.lesson._id);
// console.log(user.reviews.map(x => x.lesson._id));
let hasShippingAddress = user.addresses.filter(x => x.type === 'Shipping' && x.primary === true).length === 0;
// console.log(user.addresses,user.addresses.filter(x => x.type === 'Shipping'),hasShippingAddress);

let userAddresses = user.addresses;
let userCart = user.cart;
let userBookedLessons = user.bookedLessons;

const orderSubtotal = user.cart.map(x => x.lesson);
const orderSubtotal2 = orderSubtotal.map(x => x.price )
const orderSubtotal3 = orderSubtotal2.reduce((a, b) => a + b, 0).toFixed(2);
// console.log(orderSubtotal,orderSubtotal2,orderSubtotal3);


  return (

  <Tabs defaultActiveKey={props.profileTabSelected} id="uncontrolled-tab-example" onSelect={props.tabSelectProfile}>
    <Tab eventKey="" title="Details:" disabled>
    </Tab>
    <Tab eventKey="Basic" title="Basic">
    <Card className="UserDetailCard">
    <Card.Body>
      <Card.Title><span className="ul">Your Profile Details</span></Card.Title>
      <Row className="detailCardRow">
        <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">ID:</span> {user._id}
          </Card.Text>
          <Card.Text>
            <span className="bold">Name:</span> {user.name}
          </Card.Text>
          <Card.Text>
            <span className="bold">Username:</span> {user.username}
          </Card.Text>
          <Card.Text>
            <span className="bold">Role:</span> {user.role}
          </Card.Text>
          <Card.Text>
            <span className="bold">D.O.B:</span> {userDob}
          </Card.Text>
          <Card.Text>
            <span className="bold">Age:</span> {user.age}
          </Card.Text>
          <Card.Text>
            <span className="bold">Phone:</span> {user.contact.phone}
          </Card.Text>
          <Card.Text>
            <span className="bold">Phone 2:</span> {user.contact.phone2}
          </Card.Text>
          <Card.Text>
            <span className="bold">Email:</span> {user.contact.email}
          </Card.Text>
          <Card.Text>
            <span className="bold">Bio:</span> {user.bio}
          </Card.Text>
          <Card.Text>
            <span className="bold">Points :</span> {user.points}
          </Card.Text>
        </Col>
      </Row>

      <Row className="detailCardRow">
        <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">Public :</span> {user.public.toString()}
          </Card.Text>
          <Card.Text>
            <span className="bold">loggedIn :</span> {user.loggedIn.toString()}
          </Card.Text>
          <Card.Text>
            <span className="bold">online :</span> {user.clientConnected.toString()}
          </Card.Text>

          <Card.Text>
            <span className="bold">Verification :</span> {user.verification.type}, {user.verification.verified.toString()}
          </Card.Text>
        </Col>
      </Row>

      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdate}>Edit</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdateField}>Edit 1 Field</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "points")}>+ Points</Button>

      {props.updating === true &&
        props.userAddField === "basic" && (
        <UpdateUserBasicForm
          canCancelProfile
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userEditBasic}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
      )}

      {props.updating === true &&
        props.updatingField === true && (
        <UpdateUserFieldForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userEditField}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
      )}

      {props.userAddField === "points" &&
        user.role === 'Admin' && (
        <AddUserPointsForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddPoints}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
      )}

    </Card.Body>
    </Card>
    </Tab>

    <Tab eventKey="address" title="Addresses">


    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'primary', value: true})}>
      Filter by primary: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'primary', value: false})}>
      Filter by primary: False
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'type', value: 'Billing'})}>
      Filter by type: Billing
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'type', value: 'Shipping'})}>
      Filter by type: Shipping
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'number', value: 'Ascending'})}>
      Sort by Number: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'number', value: 'Descending'})}>
      Sort by Number: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>


    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "address")}>+ Address</Button>
    {props.userAddField === "address" && (
        <AddUserAddressForm
          user={props.user}
          authId={props.authId}
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddAddress}
          confirmText="Confirm"
        />
    )}
    {user.addresses !== null &&
      user.addresses !== [] && (
        <UserAddressList
          filter={props.filter}
          userAddresses={userAddresses}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteAddress}
          makeAddressPrimary={props.makeAddressPrimary}
        />
      )}

    </Tab>

    <Tab eventKey="profileImages" title="Profile Images">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'profileImages', key: 'public', value: true})}>
      Filter by public: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'profileImages', key: 'public', value: false})}>
      Filter by public: False
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'profileImages', key: 'type', value: 'Ascending'})}>
      Filter by type: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'profileImages', key: 'type', value: 'Descending'})}>
      Filter by type: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {props.s3State.target === 'profileImage' &&
      props.s3State.action === 'upload' &&
      props.s3State.status === 'inProgress' && (
        <Spinner />
    )}
    {props.s3State.target === 'profileImage' &&
      props.s3State.action === 'upload' &&
      props.s3State.status === 'inProgress' && (
        <p>{props.s3State.target} , {props.s3State.action}  {props.s3State.status}</p>
    )}
    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "profileImage")}>+ Image</Button>
    {props.userAddField === "profileImage" && (
        <AddUserProfileImageForm
          user={props.user}
          authId={props.authId}
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddProfileImage}
          confirmText="Confirm"
        />
    )}

    {user.profileImages !== null &&
      user.profileImages !== [] && (
        <UserProfileImageList
          filter={props.filter}
          userProfileImages={user.profileImages}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteProfileImage}
          toggleUserProfileImagePublic={props.toggleUserProfileImagePublic}
        />
      )}

    </Tab>

    <Tab eventKey="socialMedia" title="Social Media">

    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'socialMedia', key: 'platform', value: 'Ascending'})}>
      Filter by platform: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'socialMedia', key: 'platform', value: 'Descending'})}>
      Filter by platform: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "socialMedia")}>+ Social Media</Button>
    {props.userAddField === "socialMedia" && (
        <AddUserSocialMediaForm
          user={props.user}
          authId={props.authId}
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddSocialMedia}
          confirmText="Confirm"
        />
    )}

    {user.socialMedia !== null &&
      user.socialMedia !== [] && (
        <UserSocialMediaList
          userSocialMedia={user.socialMedia}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteSocialMedia}
          filter={props.filter}
        />
      ) }

    </Tab>

    <Tab eventKey="perks" title="perks" disabled>
    {
      // <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "perk")}>+ Perk</Button>
    }

    {props.userAddField === "perk" &&
    props.selectedPerk !== null && (
        <AddUserPerkForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddPerk}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
          perk={props.selectedPerk}
        />
      )}

    {user.perks !== null &&
      user.perks !== [] && (
        <UserPerkList
          userPerks={user.perks}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeletePerk}
        />
      )}

    </Tab>

    <Tab eventKey="promos" title="promos" disabled>

    {
      // <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "promo")}>+ Promo</Button>
    }

    {props.userAddField === "promo" &&
      props.selectedPromo !== null && (
        <AddUserPromoForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddPromo}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
          promo={props.selectedPromo}
        />
    )}

    {user.promos !== null &&
      user.promos !== [] && (
        <UserPromoList
          userPromos={user.promos}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeletePromo}
        />
      )}

    </Tab>

    <Tab eventKey="interests" title="Interests">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'interests', key: 'interest', value: 'Ascending'})}>
      Filter: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'interests', key: 'interest', value: 'Descending'})}>
      Filter: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "interests")}>+ Interests</Button>

    {props.userAddField === "interests" && (
        <AddUserInterestsForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddInterests}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
    )}

    {user.interests !== null &&
      user.interests !== [] && (
        <UserInterestList
          userInterests={user.interests}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteInterest}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="tags" title="Tags">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userTags', key: 'tag', value: 'Ascending'})}>
      Filter: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userTags', key: 'tag', value: 'Descending'})}>
      Filter: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "tags")}>+ Tags</Button>

    {props.userAddField === "tags" && (
        <AddUserTagsForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddTags}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
    )}

    {user.tags !== null &&
      user.tags !== [] && (
        <UserTagList
          userTags={user.tags}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteTag}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="friends" title="Friends">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'name', value: 'Ascending'})}>
      Filter username: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'name', value: 'Descending'})}>
      Filter username: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'name', value: 'Ascending'})}>
      Filter name: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'name', value: 'Descending'})}>
      Filter name: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'public', value: true})}>
      Filter public: true
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'public', value: false})}>
      Filter public: false
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'role', value: 'User'})}>
      Filter role: User
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'role', value: 'Instructor'})}>
      Filter role: Instructor
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'role', value: 'Admin'})}>
      Filter role: Admin
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'online', value: true})}>
      Filter online: true
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friends', key: 'loggedIn', value: true})}>
      Filter logged in: true
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "friend")}>+ Friend</Button>

    {props.userAddField === "friend" && (
        <AddUserFriendForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddFriend}
          confirmText="Confirm"
          requestingFriend={props.requestingFriend}
          user={props.user}
        />
      )}

    {user.friends !== null &&
      user.friends !== [] && (
        <UserFriendList
          userFriends={user.friends}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteFriend}
          onSelect={props.userSelectFriend}
          viewFriendDetails={props.viewFriendDetails}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="friendRequests" title="Friend Requests">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'date', value: 'Ascending'})}>
      Filter date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'date', value: 'Descending'})}>
      Filter date: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'sender', value: 'Ascending'})}>
      Filter sender username: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'sender', value: 'Descending'})}>
      Filter sender username: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'receiver', value: 'Ascending'})}>
      Filter receiver username: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'friendRequests', key: 'receiver', value: 'Descending'})}>
      Filter receiver username: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

      <Tabs defaultActiveKey="received" id="uncontrolled-tab-example">
        <Tab eventKey="received" title="received">
          <p>Received</p>
          {user.friendRequests !== null &&
            user.friendRequests !== [] && (
              <UserFriendRequestList
                received
                userFriendRequests={receivedRequests}
                authId={props.authId}
                onReject={props.userRejectFriendRequest}
                onAccept={props.userAcceptFriendRequest}
                filter={props.filter}
              />
            )}
        </Tab>
        <Tab eventKey="sent" title="sent">
          <p>Sent</p>
          {user.friendRequests !== null &&
            user.friendRequests !== [] && (
              <UserFriendRequestList
                userFriendRequests={sentRequests}
                authId={props.authId}
                onReject={props.userRejectFriendRequest}
                onAccept={props.userAcceptFriendRequest}
                filter={props.filter}
              />
            )}
        </Tab>
      </Tabs>

    </Tab>

    <Tab eventKey="cart" title="Lessons: Cart">

    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'lessonPrice', value: 'Ascending'})}>
      Filter by Lesson price: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'lessonPrice', value: 'Descending'})}>
      Filter by Lesson price: Descending
    </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'lessonTitle', value: 'Ascending'})}>
      Filter by Lesson title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'lessonTitle', value: 'Descending'})}>
      Filter by Lesson title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'sessionTitle', value: 'Ascending'})}>
      Filter by Session title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'sessionTitle', value: 'Descending'})}>
      Filter by Session title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'sessionDate', value: 'Ascending'})}>
      Filter by Session date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'sessionDate', value: 'Descending'})}>
      Filter by Session date: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'dateAdded', value: 'Ascending'})}>
      Filter by dateAdded: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'cartLessons', key: 'dateAdded', value: 'Descending'})}>
      Filter by dateAdded: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {user.cart !== null &&
      user.cart !== [] &&
      hasShippingAddress === false && (
    <Button variant="primary" onClick={props.startCartCheckout.bind(this, user.cart)}>
      Checkout
    </Button>
    )}

    {hasShippingAddress === true && (
    <Button variant="warning">
      Can't Checkout...Add a shipping address 1st...and make sure it's a primary address...
    </Button>
    )}

    {props.creatingOrder === true && (
      <CreateOrderForm
        user={user}
        subtotal={orderSubtotal3}
        onCancel={props.cancelCartCheckout}
        onConfirm={props.createOrder}
        addAddressToOrder={props.addAddressToOrder}
        orderBillingAddress={props.orderBillingAddress}
        orderShippingAddress={props.orderShippingAddress}
      />
    )}

    {user.cart !== null &&
      user.cart !== [] && (
        <UserCartItemList
          userCartItems={userCart}
          authId={props.authId}
          canDelete={true}
          onDelete={props.userDeleteCartItem}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="likedLessons" title="Lessons: Liked">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'title', value: 'Ascending'})}>
      Filter title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'title', value: 'Descending'})}>
      Filter title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'type', value: 'OneTime'})}>
      Filter type: One Time
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'type', value: 'Recurring'})}>
      Filter type: Recurring
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'subType', value: 'OneDay'})}>
      Filter Sub-type: One Day
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'subType', value: 'MultiDay'})}>
      Filter Sub-type: Multi-day
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'public', value: true})}>
      Filter Public: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'likedLessons', key: 'public', value: false})}>
      Filter Public: False
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {user.likedLessons !== null &&
      user.likedLessons!== [] && (
        <UserLikedLessonList
          userLikedLessons={user.likedLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteLikedLesson}
          viewLessonDetails={props.viewLessonDetails}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="bookedLessons" title="Lessons: Booked">

    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'date', value: 'Ascending'})}>
      Filter Date Booked: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'date', value: 'Descending'})}>
      Filter Date Booked: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.title', value: 'Ascending'})}>
      Filter Lesson Title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.title', value: 'Descending'})}>
      Filter Lesson Title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.type', value: 'OneTime'})}>
      Filter Lesson Type: OneTime
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.type', value: 'Recurring'})}>
      Filter Lesson Type: Recurring
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.subType', value: 'OneDay'})}>
      Filter Lesson subType: OneDay
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.subType', value: 'MultiDay'})}>
      Filter Lesson subType: MultiDay
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.public', value: true})}>
      Filter lesson Public: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'lesson.public', value: false})}>
      Filter lesson Public: False
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'session.title', value: 'Ascending'})}>
      Filter Session Title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'session.title', value: 'Descending'})}>
      Filter Session Title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'session.date', value: 'Ascending'})}>
      Filter Session Date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'bookedLessons', key: 'session.date', value: 'Descending'})}>
      Filter Session Date: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {user.bookedLessons !== null &&
      user.bookedLessons!== [] && (
        <UserBookedLessonList
          userBookedLessons={userBookedLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteBookedLesson}
          viewLessonDetails={props.viewLessonDetails}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="attendedLessons" title="Lessons: Attended">

    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'title', value: 'Ascending'})}>
      Filter Title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'title', value: 'Descending'})}>
      Filter Title: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'date', value: 'Ascending'})}>
      Filter Date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'date', value: 'Descending'})}>
      Filter Date: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'public', value: true})}>
      Filter Public: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'public', value: false})}>
      Filter Public: False
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'type', value: 'OneTime'})}>
      Filter Type: OneTime
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'type', value: 'Recurring'})}>
      Filter Type: Recurring
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'subType', value: 'OneDay'})}>
      Filter subType: OneDay
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'attendedLessons', key: 'subType', value: 'MultiDay'})}>
      Filter subType: MultiDay
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {props.creatingReview === true &&
      props.reviewLesson !== null && (
      <CreateReviewForm
      authId={props.authId}
      author={user}
      lesson={props.reviewLesson}
      canConfirm
      canCancel
      onCancel={props.cancelCreateReview}
      onConfirm={props.createReview}
      />
    )}

    {user.attendedLessons !== null &&
      user.attendedLessons!== [] && (
        <UserAttendedLessonList
          userAttendedLessons={user.attendedLessons}
          reviewedLessonIds={reviewedLessonIds}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteAttendedLesson}
          viewLessonDetails={props.viewLessonDetails}
          startCreateReview={props.startCreateReview}
          filter={props.filter}
        />
      )}

    </Tab>

    {user.role === "Instructor" && (
      <Tab eventKey="toTeachLessons" title="Lessons: Teaching">

      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'title', value: 'Ascending'})}>
        Filter Title: Ascending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'title', value: 'Descending'})}>
        Filter Title: Descending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'type', value: 'OneTime'})}>
        Filter Type: OneTime
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'type', value: 'Recurring'})}>
        Filter Type: Recurring
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'subType', value: 'OneDay'})}>
        Filter SubType: OneDay
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'subType', value: 'MultiDay'})}>
        Filter SubType: MultiDay
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'public', value: true})}>
        Filter Public: True
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'toTeachLessons', key: 'public', value: false})}>
        Filter Public: False
      </Button>
      <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
        clearFilter
      </Button>

      {user.toTeachLessons !== null &&
        user.toTeachLessons!== [] && (
          <UserToTeachLessonList
            userToTeachLessons={user.toTeachLessons}
            authId={props.authId}
            viewLessonDetails={props.viewLessonDetails}
            filter={props.filter}
          />
        )}

      </Tab>
    )}

    {user.role === "Instructor" ||
      user.role === 'Admin' && (
      <Tab eventKey="taughtLessons" title="Lessons: Taught">

      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'date', value: 'Ascending'})}>
        Filter by date: Ascending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'date', value: 'Descending'})}>
        Filter by date: Descending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'lesson.title', value: 'Ascending'})}>
        Filter by Lesson Title: Ascending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'lesson.title', value: 'Descending'})}>
        Filter by Lesson Title: Descending
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'type', value: 'OneTime'})}>
        Filter by Lesson Type: OneTime
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'type', value: 'Recurring'})}>
        Filter by Lesson Type: Recurrung
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'subType', value: 'OneDay'})}>
        Filter by Lesson SubType: OneDay
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'subType', value: 'MultiDay'})}>
        Filter by Lesson SubType: MultiDay
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'public', value: true})}>
        Filter by Lesson Public: True
      </Button>
      <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'taughtLessons', key: 'public', value: false})}>
        Filter by Lesson Public: False
      </Button>
      <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
        clearFilter
      </Button>

      {
        user.taughtLessons !== null &&
        user.taughtLessons!== [] && (
          <UserTaughtLessonList
            userTaughtLessons={user.taughtLessons}
            authId={props.authId}
            canDelete={props.canDelete}
            onDelete={props.userDeleteTaughtLesson}
            viewLessonDetails={props.viewLessonDetails}
            filter={props.filter}
          />
        )}

      </Tab>
    )}

    {user.role === 'Instructor' && (
      <Tab eventKey="newLesson" title="Lessons: New">
      <Button variant="primary" onClick={props.startProfileCreateLesson}>
        Create New Lesson
      </Button>

      {props.creatingLesson === true && (
        <CreateLessonForm
          authId={props.authId}
          creator={user}
          canCancel
            canConfirm
            onCancel={props.cancelProfileCreateLesson}
            onConfirm={props.profileCreateLesson}
        />
      )}
      </Tab>
    )}

    {user.role === 'Admin' && (
      <Tab eventKey="newLesson" title="Lessons: New">
      <Button variant="primary" onClick={props.startProfileCreateLesson}>
        Create New Lesson
      </Button>

      {props.creatingLesson === true && (
        <CreateLessonForm
          authId={props.authId}
          creator={user}
          canCancel
            canConfirm
            onCancel={props.cancelProfileCreateLesson}
            onConfirm={props.profileCreateLesson}
        />
      )}
      </Tab>
    )}

    <Tab eventKey="paymentInfo" title="Payment Info">
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'date', value: 'Ascending'})}>
      Filter Date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'date', value: 'Descending'})}>
      Filter Date: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'type', value: 'Ascending'})}>
      Filter Type: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'type', value: 'Descending'})}>
      Filter Type: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'valid', value: true})}>
      Filter Valid: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'valid', value: false})}>
      Filter Valid: False
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'primary', value: true})}>
      Filter Primary: True
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'paymentInfo', key: 'primary', value: false})}>
      Filter Primary: False
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "paymentInfo")}>+ PaymentInfo</Button>

    {props.userAddField === "paymentInfo" && (
        <AddUserPaymentInfoForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userAddPaymentInfo}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
    )}

    {user.paymentInfo !== null &&
      user.paymentInfo !== [] && (
        <UserPaymentInfoList
          userPaymentInfo={user.paymentInfo}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeletePaymentInfo}
          filter={props.filter}
          makeUserPaymentInfoPrimary={props.makeUserPaymentInfoPrimary}
        />
      ) }

    </Tab>

    <Tab eventKey="messages" title="Messages">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartCreateMessage}>+ Message</Button>

    {props.messageReceiver === null && (
      <Button variant="outline-warning" size="lg" className="confirmEditButton" >Select someone to message</Button>
    )}

    {props.userAddField === "message" &&
      props.messageReceiver !== null && (
        <CreateMessageForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userCreateMessage}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
          receiver={props.messageReceiver}
        />
      )}

      <Tabs defaultActiveKey="received" id="uncontrolled-tab-example">
        <Tab eventKey="received" title="received">
          <p>Received</p>

          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'date', value: 'Ascending'})}>
            Filter Date: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'date', value: 'Descending'})}>
            Filter Date: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'sender', value: 'Ascending'})}>
            Filter Sender: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'sender', value: 'Descending'})}>
            Filter Sender: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'receiver', value: 'Ascending'})}>
            Filter Receiver: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'receiver', value: 'Descending'})}>
            Filter Receiver: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'subject', value: 'Ascending'})}>
            Filter Subject: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'subject', value: 'Descending'})}>
            Filter Subject: Descending
          </Button>
          <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
            clearFilter
          </Button>

          {props.messageReplying === true && (
            <CreateMessageForm
              canCancel
              canConfirm
              onCancel={props.onCancelReply}
              onConfirm={props.onReply}
              confirmText="Confirm"
              user={props.user}
              authId={props.authId}
              replyTo={props.replyTo}
            />
          )}

          {messagesReceived !== null &&
            messagesReceived !== [] && (
              <UserMessageList
                userMessages={messagesReceived}
                authId={props.authId}
                canDelete={props.canDelete}
                onDelete={props.userDeleteMessage}
                received
                onStartReply={props.onStartReply}
                filter={props.filter}
              />
            )}
        </Tab>
        <Tab eventKey="sent" title="sent">
          <p>Sent</p>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'date', value: 'Ascending'})}>
            Filter Date: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'date', value: 'Descending'})}>
            Filter Date: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'sender', value: 'Ascending'})}>
            Filter Sender: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'sender', value: 'Descending'})}>
            Filter Sender: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'receiver', value: 'Ascending'})}>
            Filter Receiver: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'receiver', value: 'Descending'})}>
            Filter Receiver: Descending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'subject', value: 'Ascending'})}>
            Filter Subject: Ascending
          </Button>
          <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'messages', key: 'subject', value: 'Descending'})}>
            Filter Subject: Descending
          </Button>
          <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
            clearFilter
          </Button>

          {messagesSent !== null &&
            messagesSent !== [] && (
              <UserMessageList
                userMessages={messagesSent}
                authId={props.authId}
                canDelete={props.canDelete}
                onDelete={props.userDeleteMessage}
                filter={props.filter}
              />
            )}
        </Tab>
      </Tabs>

    </Tab>

    <Tab eventKey="orders" title="Orders">

    {user.orders !== null &&
      user.orders !== [] && (
        <UserOrderList
          userOrders={user.orders}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteOrder}
          filter={props.filter}
        />
      ) }

    </Tab>

    <Tab eventKey="reviews" title="Reviews">

    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'date', value: 'Ascending'})}>
      Filter by Date: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'date', value: 'Descending'})}>
      Filter by Date: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'rating', value: 'Ascending'})}>
      Filter by Rating: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'rating', value: 'Descending'})}>
      Filter by Rating: Descending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'type', value: 'type 1'})}>
      Filter by Type: type 1
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'type', value: 'type 2'})}>
      Filter by Type: type 2
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'type', value: 'type 3'})}>
      Filter by Type: type 3
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'lessonTitle', value: 'Ascending'})}>
      Filter by Lesson Title: Ascending
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'userReviews', key: 'lessonTitle', value: 'Descending'})}>
      Filter by Lesson Title: Descending
    </Button>
    <Button variant="danger" onClick={props.setFilter.bind(this, {field: null, key: null, value: null })}>
      clearFilter
    </Button>

    {user.reviews !== null &&
      user.reviews !== [] && (
        <UserReviewList
          userReviews={user.reviews}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteReview}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="meeting" title="Today's Sessions">
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.loadMeetings}>Load Today's</Button>
      <Button variant="outline-danger" size="lg" className="confirmEditButton" onClick={props.hideMeetings}>Hide</Button>


      {props.sessionDetailViewer === true && (
        <SessionDetailViewer
        meeting
        lessonType=""
        authId={props.authId}
        session={props.session}
        startEditSessionField={props.startEditSessionField}
        cancelEditSessionField={props.cancelEditSessionField}
        editingSessionField={props.editingSessionField}
        editSessionField={props.editSessionField}
        showSessionBooked={props.showSessionBooked}
        showSessionAttended={props.showSessionAttended}
        hideSessionBooked={props.hideSessionBooked}
        hideSessionAttended={props.hideSessionAttended}
        sessionBookedState={props.sessionBookedState}
        sessionAttendedState={props.sessionAttendedState}
        hideSessionDetails={props.hideSessionDetails}
        addSessionAttendance={props.addSessionAttendance}
        />
      )}

      {props.meetingsLoaded === true && (
      <MeetingSessionList
        authId={props.authId}
        lessonSessions={props.meetingSessions}
        viewSessionDetails={props.viewSessionDetails}
      />
      )}

      <p>zoom mtg create button, dom element etc </p>
    </Tab>

    <Tab eventKey="cancellations" title="Cancellations">

    {user.cancellations !== null &&
      user.cancellations !== [] && (
        <UserCancellationList
          userCancellations={user.cancellations}
          authId={props.authId}
          filter={props.filter}
        />
      )}

    </Tab>

    <Tab eventKey="activity" title="Activity">

    {user.activity !== null &&
      user.activity !== [] && (
        <UserActivityList
          userActivity={user.activity}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteActivity}
        />
      )}

    </Tab>
  </Tabs>
  );
}

export default thisUserProfile;
