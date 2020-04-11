import React from 'react';

import UserFriendItem from './UserItem/UserFriendItem';
import './UserList.css';

const userFriendList = props => {

  const userFriends = props.userFriends.map(friend=> {
    return (
      <UserFriendItem
        key={friend._id}
        friend={friend}
        _id={friend._id}
        username={friend.username}
        loggedIn={friend.loggedIn}
        online={friend.clientConnected}
        profileImages={friend.profileImages}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userFriends}</ul>;
};

export default userFriendList;
