import React from 'react';

import UserItem from './UserItem/UserItem';
import './UserList.css';

const userList = props => {

  const users = props.users.map(user => {
    return (
      <UserItem
        key={user._id}
        user={user}
        authId={props.authId}
        _id={user._id}
        username={user.username}
        topImage={user.profileImages[0].path}
        bio={user.bio}
        interest1={user.interests[0]}
        interest2={user.interests[1]}
        interest3={user.interests[2]}
        onDetail={props.onViewDetail}
        canReport={props.canReport}
        onReport={props.onReport}
        onSelectNoDetail={props.onSelectNoDetail}
        onSelectMessageReceiver={props.onSelectMessageReceiver}
      />
    );
  });

  return <ul className="user__list1_master">{users}</ul>;
};

export default userList;
