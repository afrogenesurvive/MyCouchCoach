import React from 'react';

import LessonSessionItem from './LessonItem/LessonSessionItem';
import './UserList.css';

const lessonSessionList = props => {

  const lessons = props.lessonSessions.map(session => {
    const sessionDate = new Date (session.date.substr(0,10)*1000).toISOString().slice(0,10);;
    return (
      <LessonSessionItem
        key={session.title}
        session={session}
        authId={props.authId}
        title={session.title}
        date={sessionDate}
        time={session.time}
        onBookSession={props.onBookSession}
        onAddCartLesson={props.onAddCartLesson}
      />
    );
  });

  return <ul className="user__list1_master">{lessons}</ul>;
};

export default lessonSessionList;
