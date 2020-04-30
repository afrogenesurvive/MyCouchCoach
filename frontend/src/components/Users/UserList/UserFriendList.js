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
        name={friend.name}
        username={friend.username}
        phone={friend.contact.phone}
        email={friend.contact.email}
        loggedIn={friend.loggedIn}
        online={friend.clientConnected}
        profileImages={friend.profileImages}
        socialMedia={friend.socialMedia}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userFriends}</ul>;
};

export default userFriendList;
