import React from 'react';

import UserFriendRequestItem from './UserItem/UserFriendRequestItem';
import './UserList.css';

const userFriendRequestList = props => {

  const userFriendRequests = props.userFriendRequests.map(friendRequest=> {
    const requestDate = new Date (friendRequest.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    // console.log(friendRequest.date,friendRequest.sender,friendRequest.receiver);
    return (
      <UserFriendRequestItem
        key={friendRequest.sender._id}
        friendRequest={friendRequest}
        date={requestDate}
        sender={friendRequest.sender}
        receiver={friendRequest.receiver}
        onAccept={props.onAccept}
        onReject={props.onReject}
        received={props.received}
      />
    );
  });

  return <ul className="user__list1_master">{userFriendRequests}</ul>;
};

export default userFriendRequestList;
