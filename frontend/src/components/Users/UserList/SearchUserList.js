import React from 'react';

import SearchUserItem from './UserItem/UserItem';
import './UserList.css';

const searchUserList = props => {

  const {...filter} = props.filter;
  let users2 = props.users;
  let propsUsers = [];

  if (filter.field === 'userSearchList' && filter.key === 'username' && filter.value === 'Ascending') {
    propsUsers = users2.sort((a, b) => (a.username > b.username) ? 1 : -1);
    // console.log('...no users filter...'+filter.key+'...'+filter.value);
    // console.log('user2',user2);
    // console.log('propsUsers',propsUsers);
    // console.log('props.users',props.users);
  }
  if (filter.field === 'userSearchList' && filter.key === 'username' && filter.value === 'Descending') {
    propsUsers = users2.sort((a, b) => (a.username < b.username) ? 1 : -1);
    // console.log('...no users filter...'+filter.key+'...'+filter.value);
    // console.log('user2',user2);
    // console.log('propsUsers',propsUsers);
    // console.log('props.users',props.users);
  }
  if (filter.field === 'userSearchList' && filter.key === 'role') {
    propsUsers = users2.filter(x => x.role === filter.value);
    // console.log('...no users filter...'+filter.key+'...'+filter.value);
    // console.log('user2',user2);
    // console.log('propsUsers',propsUsers);
    // console.log('props.users',props.users);
  }
  if (filter.field !== 'userSearchList') {
    propsUsers = users2;
    // console.log('...no users filter...'+filter.key+'...'+filter.value);
    // console.log('user2',user2);
    // console.log('propsUsers',propsUsers);
    // console.log('props.users',props.users);
  }

  const users = propsUsers.map(user => {
    return (
      <SearchUserItem
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

export default searchUserList;
