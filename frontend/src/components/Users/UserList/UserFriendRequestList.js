import React from 'react';

import UserFriendRequestItem from './UserItem/UserFriendRequestItem';
import './UserList.css';

const userFriendRequestList = props => {

  const userFriendRequests = props.userFriendRequests.map(friendRequest=> {
    // console.log(friendRequest.date,friendRequest.sender,friendRequest.receiver);
    return (
      <UserFriendRequestItem
        key={friendRequest.sender._id}
        friendRequest={friendRequest}
        date={friendRequest.date}
        sender={friendRequest.sender}
        receiver={friendRequest.receiver}
        onAccept={props.onAccept}
        onReject={props.onReject}
      />
    );
  });

  return <ul className="user__list1_master">{userFriendRequests}</ul>;
};

export default userFriendRequestList;
