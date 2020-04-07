import React from 'react';

import UserFriendRequestItem from './UserItem/UserFriendRequestItem';
import './UserList.css';

const userFriendRequestList = props => {

  const userFriendRequests = props.userFriendRequests.map(friendRequest=> {

    return (
      <UserFriendRequestItem
        key={friendRequest.sender._id}
        friendRequest={friendRequest}
        date={friendRequest.date}
        sender={friendRequest.sender}
        receiver={friendRequest.receiver}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userFriendRequests}</ul>;
};

export default userFriendRequestList;
