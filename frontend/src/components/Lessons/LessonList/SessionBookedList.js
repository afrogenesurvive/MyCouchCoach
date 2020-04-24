import React from 'react';

import SessionBookedItem from './LessonItem/SessionBookedItem';
import './UserList.css';

const sessionBookedList = props => {

  const booked = props.booked.map(user => {
    return (
      <SessionBookedItem
        key={user._id}
        user={user}
        _id={user._id}
        username={user.username}
      />
    );
  });

  return <ul className="user__list1_master">{booked}</ul>;
};

export default sessionBookedList;
