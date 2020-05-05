import React from 'react';

import LessonScheduleItem from './LessonItem/LessonScheduleItem';
import './UserList.css';

const lessonScheduleList = props => {

  const dates = props.lessonSchedule.map(date => {
    // console.log(date);
    const scheduleDate = new Date (date.date.substr(0,10)*1000).toISOString().slice(0,10);;

    return (
      <LessonScheduleItem
        key={date}
        date={scheduleDate}
        time={date.time}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{dates}</ul>;
};

export default lessonScheduleList;
