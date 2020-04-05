import React from 'react';

import UserFriendItem from './UserItem/UserFriendItem';
import './UserList.css';

const userFriendList = props => {

  const userFriends = props.users.map(friend=> {
    return (
      <UserFriendItem
        key={friend._id}
        friend={friend}
        _id={friend._id}
        name={friend.name}
        username={friend.username}
        role={friend.role}
        age={friend.age}
        phone={friend.contact.phone}
        phone2={friend.contact.phone2}
        email={fieind.contact.email}
        bio={friend.bio}
        profileImages={friend.profileImages}
        socialMedia={friend.socialMedia}
        interests={friend.interests}
        tags={friend.tags}
        points={friend.points}
        loggedIn={friend.loggedIn}
        online={friend.clientConnected}
        onSelect={props.onSelect
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userFriends}</ul>;
};

export default userFriendList;
