import React from 'react';
// import Accordion from 'react-bootstrap/Accordion';
// import Button from 'react-bootstrap/Button';

import SearchUserItem from './UserItem/SearchUserItem';
import './UserList.css';

const searchUserList = props => {

  const searchUsers = props.searchUsers.map(user => {
    return (
      <React.Fragment>
      <SearchUserItem
        key={user._id}
        userId={props.authUserId}
        _id={user._id}
        name={user.name}
        onDetail={props.onViewDetail}
      />
      </React.Fragment>
    );
  });
  return <ul className="user__list1_master">{searchUsers}</ul>;
};

export default searchUserList;
