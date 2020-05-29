import React from 'react';

import UserFriendItem from './UserItem/UserFriendItem';
import './UserList.css';

const userFriendList = props => {

  const {...filter} = props.filter;
  // console.log('filter',filter);
  let userFriends2 = props.userFriends;
  let propsUserFriends = [];

  if (filter.field === 'friends' && filter.key === 'username' && filter.value === 'Ascending') {
    propsUserFriends = userFriends2.sort((a, b) => (a.username < b.username) ? 1 : -1);
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }
  if (filter.field === 'friends' && filter.key === 'username' && filter.value === 'Descending') {
    propsUserFriends = userFriends2.sort((a, b) => (a.username > b.username) ? 1 : -1);
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }
  if (filter.field === 'friends' && filter.key === 'name' && filter.value === 'Ascending') {
    propsUserFriends = userFriends2.sort((a, b) => (a.name < b.name) ? 1 : -1);
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }
  if (filter.field === 'friends' && filter.key === 'name' && filter.value === 'Descending') {
    propsUserFriends = userFriends2.sort((a, b) => (a.name > b.name) ? 1 : -1);
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }
  if (filter.field === 'friends' && filter.key === 'public' ) {
    propsUserFriends = userFriends2.filter(x => x.public === filter.value)
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }
  if (filter.field === 'friends' && filter.key === 'role' ) {
    propsUserFriends = userFriends2.filter(x => x.role === filter.value)
    console.log('...filter friend by...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }

  if (filter.field !== 'friends') {
    propsUserFriends = userFriends2;
    console.log('...no friend filter...'+filter.key+'...'+filter.value);
    console.log('userFriends2',userFriends2);
    console.log('propsUserFriends',propsUserFriends);
    console.log('propsUserFriends',props.userFriends);
  }

  const userFriends = propsUserFriends.map(friend => {
    const friendDob = new Date (friend.dob.substr(0,10)*1000).toISOString().slice(0,10);
    return (
      <UserFriendItem
        key={friend._id}
        friend={friend}
        _id={friend._id}
        name={friend.name}
        username={friend.username}
        role={friend.role}
        dob={friendDob}
        phone={friend.contact.phone}
        email={friend.contact.email}
        loggedIn={friend.loggedIn}
        online={friend.clientConnected}
        public={friend.public}
        bio={friend.bio}
        interests={friend.interests}
        tags={friend.tags}
        profileImages={friend.profileImages}
        socialMedia={friend.socialMedia}
        onSelect={props.onSelect}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
        viewFriendDetails={props.viewFriendDetails}
      />
    );
  });

  return <ul className="user__list1_master">{userFriends}</ul>;
};

export default userFriendList;
