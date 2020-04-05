import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
import UserPaymentInfoList from './UserList/UserPaymentInfoList';

import UserOrderList from './UserList/UserOrderList';
import UserReviewList from './UserList/UserReviewList';
import UserMessageList from './UserList/UserList/UserMessageList';
import UserActivityList from './UserList/UserActivityList';

import UpdateUserBasicForm from '../Forms/user/UpdateUserBasicForm';
import UpdateUserFieldForm from '../Forms/user/UpdateUserFieldForm';

import AddUserAddressForm from '../Forms/user/AddUserAddressForm';
import AddUserProfileImageForm from '../Forms/user/AddUserProfileImageForm';

import AddUserInterestsForm from '../Forms/user/AddUserInterestsForm';
import AddUserTagsForm from '../Forms/user/AddUserTagsForm';

import AddUserSocialMediaForm from './AddUserSocialMediaForm';
import AddUserInterestsForm from './AddUserInterestsForm';
import AddUserTagsForm from './AddUserTagsForm';
import AddUserPaymentInfoForm from './AddUserPaymentInfoForm';

import AddUserFriendForm from './Forms/user/AddUserFriendForm';
import CreateMessageForm from '../Forms/message/CreateMessageForm';

import './thisUserProfile.css';

const thisUserProfile = (props) => {
  const {...user} = props.user;
  const userAddress = user.address;
  const userDob = new Date(user.dob.substr(0,9)*1000).toISOString().slice(0,10);

  let sentRequests = [];
  let receivedRequests = [];
  if (user.friendRequests !== []) {
    sentRequests = user.friendRequests.filter(request => request.sender === user);
    receivedRequests = user.friendRequests.filter(request => request.receiver === user);
  }

  return (

  <Tabs defaultActiveKey="Demographics" id="uncontrolled-tab-example">
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
            <span className="bold">Public :</span> {user.public}
          </Card.Text>
          <Card.Text>
            <span className="bold">loggedIn :</span> {user.loggedIn}
          </Card.Text>
          <Card.Text>
            <span className="bold">clientConnected :</span> {user.clientConnected}
          </Card.Text>
          <Card.Text>
            <span className="bold">Verification :</span> {user.verification.type}, {user.verification.verified}
          </Card.Text>
        </Col>
      </Row>

      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdate}>Edit</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdateField}>Edit 1 Field</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAdd.bind(this, "points")}>+ Points</Button>

      {props.updating === true &&
        props.updatingField === "basic" && (
        <UpdateUserForm
        canCancelProfile
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.userEditBasic}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
      )}

      {props.updatingField === true && (
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

      {props.userAddField === "points" && (
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
          userAddresses={user.addresses}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteAddress}
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
        />
      )}

    </Tab>

    <Tab eventKey="friendRequests" title="friendRequests">

    {user.friendRequests !== null &&
      user.friendRequests !== [] && (
        <UserFriendRequestList
          userFriendRequests={receivedRequests}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteFriendRequest}
          onSelect={props.userSelectFriendRequest}
        />
      )}

    </Tab>

    <Tab eventKey="cart" title="cart">

    {user.cart !== null &&
      user.cart !== [] && (
        <UserCartItemList
          userCartItems={user.cart}
          authId={props.authId}
          canDelete={props.canDelete}
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
        />
      )}

    </Tab>
    <Tab eventKey="attendedLessons" title="attendedLessons">

    {user.attendedLessons !== null &&
      user.attendedLessons!== [] && (
        <UserAttendedLessonList
          userAttendedLessons={user.attendedLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteAttendedLesson}
        />
      )}

    </Tab>
    <Tab eventKey="taughtLessons" title="taughtLessons">

    {user.role === "Instructor" &&
      user.taughtLessons !== null &&
      user.taughtLessons!== [] && (
        <UserTaughtLessonList
          userTaughtLessons={user.taughtLessons}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteTaughtLesson}
        />
      )}

    </Tab>

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

    {user.messages !== null &&
      user.messages !== [] && (
        <UserMessageList
          userMessages={user.messages}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.userDeleteMessage}
        />
      ) }

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
