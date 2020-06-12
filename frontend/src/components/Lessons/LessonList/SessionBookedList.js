import React from 'react';

import SessionBookedItem from './LessonItem/SessionBookedItem';
import './UserList.css';

const sessionBookedList = props => {

  let canCancel = false;
  const booked = props.booked.map(user => {

    if (props.authId === user._id) {
      canCancel = true;
    }
    let userAttended = false;
    const userAttended2 = props.attended.filter(x => x._id === user._id);
    if (userAttended2.length === 0) {
      userAttended = false;
    }
    if (userAttended2.length !== 0) {
      userAttended = true;
    }
    // console.log(userAttended2);
    const attendance = {
      user: user,
      sessionDate: props.session.date,
      sessionTitle: props.session.title,
    };
    return (
      <SessionBookedItem
        meeting={props.meeting}
        lessonType={props.lessonType}
        session={props.session}
        key={user._id}
        attendance={attendance}
        user={user}
        _id={user._id}
        username={user.username}
        isInstructor={props.isInstructor}
        userAttended={userAttended}
        addSessionAttendance={props.addSessionAttendance}
        canCancel={canCancel}
        cancelSessionBooking={props.cancelSessionBooking}
      />
    );
  });

  return <ul className="user__list1_master">{booked}</ul>;
};

export default sessionBookedList;
