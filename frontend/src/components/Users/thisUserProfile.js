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

import MeetingSessionList from '../Lessons/LessonList/MeetingSessionList';
import SessionDetailViewer from '../SessionDetailViewer';



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
// console.log('sentRequests',sentRequests,'receivedRequests',receivedRequests);
// const publicUser = user.public.toString();
// const today = new Date().toLocaleDateString().slice(0,10);
// const today2 = new Date(today);

// console.log('today',today2,user.bookedLessons.map(x=> console.log(x.date)));
// console.log('today',today,user.bookedLessons.filter(x=> x.date === today ));
// get todays booked lessons, filter for sessions today, result = meeting list, to each, add get session and if isInstructor, update session componts & reqs

// const bookedLessonSessions = user.bookedLessons
let messagesSent = [];
let messagesReceived = [];
messagesSent = user.messages.filter(x => x.sender._id === props.authId);
messagesReceived = user.messages.filter(x => x.receiver._id === props.authId);
const reviewedLessonIds = user.reviews.map(x => x.lesson._id);
// console.log(user.reviews.map(x => x.lesson._id));
let hasShippingAddress = user.addresses.filter(x => x.type === 'Shipping' && x.primary === true).length === 0;
// console.log(user.addresses,user.addresses.filter(x => x.type === 'Shipping'),hasShippingAddress);

let userAddresses = user.addresses;

// const setFilter2 = (args) => {
//   console.log('...setFilter2...',args);
//   if (args.key === 'primary') {
//     let test2 = userAddresses.filter(x => x.primary === true)
//     userAddresses = test2;
//     console.log(user.addresses,userAddresses,test2,args.value);
//   }
//   if (args.key === 'type') {
//     let test2 = userAddresses.filter(x => x.type === args.value)
//     userAddresses = test2;
//     console.log(user.addresses,userAddresses,test2,args.value);
//   }
// }


// - filters
//   - address
//     - type
//     - primary
//   - friend
//     -
//   - message
//     - asc/desc by date
//     - by sender/receiver name
//   - likedlesson
//     - title
//   - bookedLesson/attendedLesson/taughtLesson/wishlist
//     - date
//     - lesson title
//   - order
//     - date
//   - paymentinfo
//     - date
//     - Type
//     - valid
//     - primary
//   - friendRequests
//     - date
//     - sender/receiver name
//   - review
//     - date
//     - lesson title


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

    <Tab eventKey="address" title="address">


    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'primary', value: true})}>
      Filter by primary
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'type', value: 'Billing'})}>
      Filter by type: Billing
    </Button>
    <Button variant="primary" onClick={props.setFilter.bind(this, {field: 'addresses', key: 'type', value: 'Shipping'})}>
      Filter by type: Shipping
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

    <Tab eventKey="profileImages" title="profileImages">

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
          userProfileImages={user.profileImages}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteProfileImage}
          toggleUserProfileImagePublic={props.toggleUserProfileImagePublic}
        />
      ) }

    </Tab>

    <Tab eventKey="socialMedia" title="socialMedia">

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
        />
      ) }

    </Tab>

    <Tab eventKey="perks" title="perks">
    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "perk")}>+ Perk</Button>

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

    <Tab eventKey="promos" title="promos">
    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "promo")}>+ Promo</Button>

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

    <Tab eventKey="interests" title="interests">

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
        />
      )}

    </Tab>

    <Tab eventKey="tags" title="tags">

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
        />
      ) }

    </Tab>

    <Tab eventKey="friends" title="friends">

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
        />
      )}

    </Tab>

    <Tab eventKey="friendRequests" title="friendRequests">

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
              />
            )}
        </Tab>
      </Tabs>

    </Tab>

    <Tab eventKey="cart" title="cart">

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
          userCartItems={user.cart}
          authId={props.authId}
          canDelete={true}
          onDelete={props.userDeleteCartItem}
        />
      )}

    </Tab>

    <Tab eventKey="likedLessons" title="likedLessons">

    {user.likedLessons !== null &&
      user.likedLessons!== [] && (
        <UserLikedLessonList
          userLikedLessons={user.likedLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteLikedLesson}
          viewLessonDetails={props.viewLessonDetails}
        />
      )}

    </Tab>

    <Tab eventKey="bookedLessons" title="bookedLessons">

    {user.bookedLessons !== null &&
      user.bookedLessons!== [] && (
        <UserBookedLessonList
          userBookedLessons={user.bookedLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteBookedLesson}
          viewLessonDetails={props.viewLessonDetails}
        />
      )}

    </Tab>

    <Tab eventKey="attendedLessons" title="attendedLessons">

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
        />
      )}

    </Tab>

    {user.role === "Instructor" ||
      user.role === 'Admin' && (
      <Tab eventKey="toTeachLessons" title="toTeachLessons">

      {user.toTeachLessons !== null &&
        user.toTeachLessons!== [] && (
          <UserToTeachLessonList
            userToTeachLessons={user.toTeachLessons}
            authId={props.authId}
            viewLessonDetails={props.viewLessonDetails}
          />
        )}

      </Tab>
    )}

    {user.role === "Instructor" ||
      user.role === 'Admin' && (
      <Tab eventKey="taughtLessons" title="taughtLessons">
      {
        user.taughtLessons !== null &&
        user.taughtLessons!== [] && (
          <UserTaughtLessonList
            userTaughtLessons={user.taughtLessons}
            authId={props.authId}
            canDelete={props.canDelete}
            onDelete={props.userDeleteTaughtLesson}
            viewLessonDetails={props.viewLessonDetails}
          />
        )}

      </Tab>
    )}

    <Tab eventKey="paymentInfo" title="paymentInfo">

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
        />
      ) }

    </Tab>

    <Tab eventKey="messages" title="messages">

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
              />
            )}
        </Tab>
        <Tab eventKey="sent" title="sent">
          <p>Sent</p>
          {messagesSent !== null &&
            messagesSent !== [] && (
              <UserMessageList
                userMessages={messagesSent}
                authId={props.authId}
                canDelete={props.canDelete}
                onDelete={props.userDeleteMessage}
              />
            )}
        </Tab>
      </Tabs>

    </Tab>

    <Tab eventKey="orders" title="orders">

    {user.orders !== null &&
      user.orders !== [] && (
        <UserOrderList
          userOrders={user.orders}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteOrder}
        />
      ) }

    </Tab>

    <Tab eventKey="reviews" title="reviews">

    {user.reviews !== null &&
      user.reviews !== [] && (
        <UserReviewList
          userReviews={user.reviews}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteReview}
        />
      )}

    </Tab>

    <Tab eventKey="meeting" title="meeting">
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.loadMeetings}>Load Today's</Button>
      <Button variant="outline-danger" size="lg" className="confirmEditButton" onClick={props.hideMeetings}>Hide</Button>


      {props.sessionDetailViewer === true && (
        <SessionDetailViewer
        meeting
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

    <Tab eventKey="cancellations" title="cancellations">

    {user.cancellations !== null &&
      user.cancellations !== [] && (
        <UserCancellationList
          userCancellations={user.cancellations}
          authId={props.authId}
        />
      )}

    </Tab>

    <Tab eventKey="activity" title="activity">

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
