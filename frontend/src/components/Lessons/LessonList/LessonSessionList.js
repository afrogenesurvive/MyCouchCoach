import React from 'react';

import LessonSessionItem from './LessonItem/LessonSessionItem';
import './UserList.css';

const lessonSessionList = props => {

  const sessions = props.lessonSessions.map(session => {
    const sessionDate = new Date (session.date.substr(0,10)*1000).toISOString().slice(0,10);;
    const sessionEndDate = new Date (session.endDate.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <LessonSessionItem
        profile={props.profile}
        key={session.title}
        session={session}
        authId={props.authId}
        isInstructor={props.isInstructor}
        title={session.title}
        date={sessionDate}
        endDate={sessionEndDate}
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
        addSessionAttendance={props.addSessionAttendance}
        cancelSessionBooking={props.cancelSessionBooking}
      />
    );
  });

  return <ul className="user__list1_master">{sessions}</ul>;
};

export default lessonSessionList;
