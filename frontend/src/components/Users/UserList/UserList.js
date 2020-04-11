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
        role={user.role}
        public={user.public}
        clientConnected={user.clientConnected}
        onDetail={props.onViewDetail}
        canReport={props.canReport}
        onReport={props.onReport}
        onSelectNoDetail={props.onSelectNoDetail}
        onSelectMessageReceiver={props.onSelectMessageReceiver}
        onFriendRequest={props.onFriendRequest}
      />
    );
  });

  return <ul className="user__list1_master">{users}</ul>;
};

export default userList;
