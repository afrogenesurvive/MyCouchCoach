import React from 'react';

import MeetingSessionItem from './LessonItem/MeetingSessionItem';
import './UserList.css';

const meetingSessionList = props => {

  const sessions = props.lessonSessions.map(session => {
    const sessionDate = new Date (session.date.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <MeetingSessionItem
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
        bookedAmount={session.bookedAmount}
        attendedAmount={session.attendedAmount}
        viewSessionDetails={props.viewSessionDetails}
      />
    );
  });

  return <ul className="user__list1_master">{sessions}</ul>;
};

export default meetingSessionList;
