import React from 'react';

import SessionAttendedItem from './LessonItem/SessionAttendedItem';
import './UserList.css';

const sessionAttendedList = props => {

  const attended = props.attended.map(user => {
    return (
      <SessionAttendedItem
        key={user._id}
        user={user}
        _id={user._id}
        username={user.username}
      />
    );
  });

  return <ul className="user__list1_master">{attended}</ul>;
};

export default sessionAttendedList;
