import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import UserProfileImageList from './UserList/UserProfileImageList';
import UserPerkList from './UserList/UserPerkList';
import UserInterestList from './UserList/UserInterestList';
import UserTagList from './UserList/UserTagList';
import UserModelList from './UserList/UserModelList';
import UserBillingList from './UserList/UserBillingList';
import UserComplaintList from './UserList/UserComplaintList';
import UserMessageList from './UserList/UserMessageList';
import UserTransactionList from './UserList/UserTransactionList';

import UpdateUserForm from '../Forms/user/UpdateUserForm';
import UpdateUserFieldForm from '../Forms/user/UpdateUserFieldForm';

import AddUserProfileImageForm from '../Forms/user/AddUserProfileImageForm';
import AddUserPerkForm from '../Forms/user/AddUserPerkForm';
import AddUserInterestsForm from '../Forms/user/AddUserInterestsForm';
import AddUserTagsForm from '../Forms/user/AddUserTagsForm';
import AddUserTokensForm from '../Forms/user/AddUserTokensForm';
import AddUserComplaintForm from '../Forms/user/AddUserComplaintForm';
import AddUserBillingForm from '../Forms/user/AddUserBillingForm';

import CreateMessageForm from '../Forms/message/CreateMessageForm';
import CreateTransactionForm from '../Forms/transaction/CreateTransactionForm';

import './thisUserProfile.css';

const thisUserProfile = (props) => {
  const {...user} = props.user;
  const userAddress = user.address;
  const userDob = new Date(user.dob.substr(0,9)*1000).toISOString().slice(0,10);

  return (

  <Tabs defaultActiveKey="Demographics" id="uncontrolled-tab-example">
    <Tab eventKey="" title="Details:" disabled>
    </Tab>
    <Tab eventKey="Demographics" title="Demographics">
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
            <span className="bold">Phone:</span> {user.contact.phone}
          </Card.Text>
          <Card.Text>
            <span className="bold">Email:</span> {user.contact.email}
          </Card.Text>
        </Col>

        <Col className="detailCardCol">
          <Card.Text>
            <span className="bold">Bio:</span> {user.bio}
          </Card.Text>
          <Card.Text>
            <span className="bold">Address:</span>
          </Card.Text>
          <Card.Text>
            <span className="bold">Street & Number :</span> {userAddress.number}, {userAddress.street}
          </Card.Text>
          <Card.Text>
            <span className="bold">Town :</span> {userAddress.town}
          </Card.Text>
          <Card.Text>
            <span className="bold">City :</span> {userAddress.city}
          </Card.Text>
          <Card.Text>
            <span className="bold">Country :</span> {userAddress.country}
          </Card.Text>
          <Card.Text>
            <span className="bold">Postal Code :</span> {userAddress.postalCode}
          </Card.Text>
          <Card.Text>
            <span className="bold">Tokens :</span> {user.tokens}
          </Card.Text>
        </Col>
      </Row>

      <Col className="detailCardCol">
        <Button variant="secondary" className="confirmEditButton" onClick={props.onCallOut}>
        IO Call Out
        </Button>
      </Col>

      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdate}>Edit</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartUpdateField}>Edit 1 Field</Button>
      <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddTokens}>+ Tokens</Button>

      {props.updating === true &&(
        <UpdateUserForm
        canCancelProfile
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.onEdit}
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
            onConfirm={props.onEditField}
            confirmText="Confirm"
            user={props.user}
            authId={props.authId}
          />
      )}

      {props.userAddField === "tokens" && (
          <AddUserTokensForm
            canCancel
            canConfirm
            onCancel={props.onCancel}
            onConfirm={props.addTokens}
            confirmText="Confirm"
            user={props.user}
            authId={props.authId}
          />
      )}

    </Card.Body>
    </Card>
    </Tab>

    <Tab eventKey="profileImages" title="profileImages">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddProfileImage}>+ Image</Button>
    {props.userAddField === "profileImage" && (
        <AddUserProfileImageForm
          user={props.user}
          authId={props.authId}
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addProfileImage}
          confirmText="Confirm"
        />
    )}

    {user.profileImages !== null &&
      user.profileImages !== [] && (
        <UserProfileImageList
          userProfileImages={user.profileImages}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onProfileImageDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="perks" title="perks">
    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddPerk}>+ Perk</Button>

    {props.userAddField === "perk" && (
        <AddUserPerkForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addPerk}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
    )}

    {user.perks !== null &&
      user.perks !== [] && (
        <UserPerkList
          userPerks={user.perks}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onPerkDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="interests" title="interests">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddInterests}>+ Interests</Button>

    {props.userAddField === "interests" && (
        <AddUserInterestsForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addInterests}
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
          onDelete={props.onInterestDelete}
        />
      )}

    </Tab>

    <Tab eventKey="tags" title="tags">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddTags}>+ Tags</Button>

    {props.userAddField === "tags" && (
        <AddUserTagsForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addTags}
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
          onDelete={props.onTagsDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="favs" title="favs">

    {user.models !== null &&
      user.models !== [] && (
        <UserModelList
          userModels={user.models}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onUserModelDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="billing" title="billing">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddBilling}>+ Billing</Button>

    {props.userAddField === "billing" && (
        <AddUserBillingForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addBilling}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
        />
    )}

    {user.billing !== null &&
      user.billing !== [] && (
        <UserBillingList
          userBilling={user.billing}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onBillingDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="complaints" title="complaints">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartAddComplaint}>+ Complaint</Button>

    {props.userAddField === "complaint" && (
        <AddUserComplaintForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.addComplaint}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
          selectedUser={props.selectedUser}
        />
    )}

    {user.complaints !== null &&
      user.complaints !== [] && (
        <UserComplaintList
          userComplaints={user.complaints}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onComplaintDelete}
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
          onConfirm={props.createMessage}
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
          onDelete={props.onMessageDelete}
        />
      ) }

    </Tab>

    <Tab eventKey="transactions" title="transactions">

    <Button variant="outline-primary" size="lg" className="confirmEditButton" onClick={props.onStartCreateTransaction}>+ Transaction</Button>

    {props.messageReceiver === null && (
      <Button variant="outline-warning" size="lg" className="confirmEditButton" >Select someone send tokens to</Button>
    )}

    {props.userAddField === "transaction" &&
      props.messageReceiver !== null && (
        <CreateTransactionForm
          canCancel
          canConfirm
          onCancel={props.onCancel}
          onConfirm={props.createTransaction}
          confirmText="Confirm"
          user={props.user}
          authId={props.authId}
          receiver={props.messageReceiver}
        />
    )}

    {user.transactions !== null &&
      user.transactions !== [] && (
        <UserTransactionList
          userTransactions={user.transactions}
          authId={props.authId}
          canDelete={props.canDelete}
          onDelete={props.onTransactionDelete}
        />
      ) }

    </Tab>
  </Tabs>
  );
}

export default thisUserProfile;
