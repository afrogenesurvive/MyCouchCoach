import React from 'react';

import UserInterestItem from './UserItem/UserInterestItem';
import './UserList.css';

const userInterestList = props => {
  const userInterests = props.userInterests.map(interest => {

    return (
      <UserInterestItem
        key={interest}
        authId={props.authId}
        interest={interest}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userInterests}</ul>;
};

export default userInterestList;
