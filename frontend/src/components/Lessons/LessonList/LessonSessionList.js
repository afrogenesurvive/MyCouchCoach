import React from 'react';

import LessonSessionItem from './LessonItem/LessonSessionItem';
import './UserList.css';

const lessonSessionList = props => {

  const lessons = props.lessonSessions.map(session => {
    // console.log(session);
    const sessionDate = new Date (session.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);;
    return (
      <LessonSessionItem
        key={session.title}
        session={session}
        authId={props.authId}
        title={session.title}
        date={sessionDate}
        time={session.time}
        full={session.full}
        limit={session.limit}
        amount={session.amount}
        url={session.url}
        booked={session.booked}
        bookedAmount={session.bookedAmount}
        attended={session.attended}
        attendedAmount={session.attendedAmount}
        onBookSession={props.onBookSession}
        onAddCartLesson={props.onAddCartLesson}
        editSessionField={props.editSessionField}
        showSessionBooked={props.showSessionBooked}
        showSessionAttended={props.showSessionAttended}
        hideSessionBooked={props.hideSessionBooked}
        hideSessionAttended={props.hideSessionAttended}
        sessionBookedState={props.sessionBookedState}
        sessionAttendedState={props.sessionAttendedState}
      />
    );
  });

  return <ul className="user__list1_master">{lessons}</ul>;
};

export default lessonSessionList;
