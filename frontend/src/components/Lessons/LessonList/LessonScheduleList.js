import React from 'react';

import LessonScheduleItem from './LessonItem/LessonScheduleItem';
import './UserList.css';

const lessonScheduleList = props => {

  const dates = props.lessonSchedule.map(date => {
    // const scheduleDate = new Date (date.substr(0,10)*1000).toISOString().slice(0,10);
    // console.log(date);
    return (
      <LessonScheduleItem
        key={date}
        date={date}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{dates}</ul>;
};

export default lessonScheduleList;
