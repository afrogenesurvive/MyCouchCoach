import React from 'react';

import UserFriendRequestItem from './UserItem/UserFriendRequestItem';
import './UserList.css';

const userFriendRequestList = props => {

  const {...filter} = props.filter;
  let userFriendRequests2 = props.userFriendRequests;
  let propsUserFriendRequests = [];

  if (filter.field === 'friendRequests' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }
  if (filter.field === 'friendRequests' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }
  if (filter.field === 'friendRequests' && filter.key === 'sender' && filter.value === 'Ascending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.sender.username > b.sender.username) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }
  if (filter.field === 'friendRequests' && filter.key === 'sender' && filter.value === 'Descending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.sender.username < b.sender.username) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }
  if (filter.field === 'friendRequests' && filter.key === 'receiver' && filter.value === 'Ascending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.receiver.username > b.receiver.username) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }
  if (filter.field === 'friendRequests' && filter.key === 'receiver' && filter.value === 'Descending') {
    propsUserFriendRequests = userFriendRequests2.sort((a, b) => (a.receiver.username < b.receiver.username) ? 1 : -1);
    // console.log('...filter friendRequests...by...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }

  if (filter.field !== 'friendRequests') {
    propsUserFriendRequests = userFriendRequests2;
    // console.log('...no friendRequest filter...'+filter.key+'...'+filter.value);
    // console.log('userFriendRequests2',userFriendRequests2);
    // console.log('propsUserFriendRequests',propsUserFriendRequests);
    // console.log('props.userFriendRequests',props.userFriendRequests);
  }

  const userFriendRequests = propsUserFriendRequests.map(friendRequest=> {
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
