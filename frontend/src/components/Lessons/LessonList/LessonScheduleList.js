import React from 'react';

import LessonScheduleItem from './LessonItem/LessonScheduleItem';
import './UserList.css';

const lessonScheduleList = props => {
  const {...filter} = props.filter;
  let lessonSchedule2 = props.lessonSchedule;
  let propsLessonSchedule = [];

  if (filter.field === 'lessonDetail' && filter.key === 'schedule' && filter.value === 'dateAscending') {
    propsLessonSchedule = lessonSchedule2.sort((a, b) => (a.date > b.date) ? 1 : -1);
    // console.log('...filtering lesson schedule by...'+filter.key+'...'+filter.value);
    // console.log('lessonSchedule2',lessonSchedule2);
    // console.log('propsLessonSchedule',propsLessonSchedule);
    // console.log('props.lessonSchedule',props.lessonSchedule);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'schedule' && filter.value === 'dateDescending') {
    propsLessonSchedule = lessonSchedule2.sort((a, b) => (a.date < b.date) ? 1 : -1);
    // console.log('...filtering lesson schedule by...'+filter.key+'...'+filter.value);
    // console.log('lessonSchedule2',lessonSchedule2);
    // console.log('propsLessonSchedule',propsLessonSchedule);
    // console.log('props.lessonSchedule',props.lessonSchedule);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'schedule' && filter.value === 'timeAscending') {
    propsLessonSchedule = lessonSchedule2.sort((a, b) => (a.time > b.time) ? 1 : -1);
    // console.log('...filtering lesson schedule by...'+filter.key+'...'+filter.value);
    // console.log('lessonSchedule2',lessonSchedule2);
    // console.log('propsLessonSchedule',propsLessonSchedule);
    // console.log('props.lessonSchedule',props.lessonSchedule);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'schedule' && filter.value === 'timeDescending') {
    propsLessonSchedule = lessonSchedule2.sort((a, b) => (a.time < b.time) ? 1 : -1);
    // console.log('...filtering lesson schedule by...'+filter.key+'...'+filter.value);
    // console.log('lessonSchedule2',lessonSchedule2);
    // console.log('propsLessonSchedule',propsLessonSchedule);
    // console.log('props.lessonSchedule',props.lessonSchedule);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'schedule') {
    propsLessonSchedule = lessonSchedule2;
    // console.log('...no lessons schedule filter...'+filter.key+'...'+filter.value);
    // console.log('lessonSchedule2',lessonSchedule2);
    // console.log('propsLessonSchedule',propsLessonSchedule);
    // console.log('props.lessonSchedule',props.lessonSchedule);
  }

  const dates = propsLessonSchedule.map(date => {
    // console.log(date);
    const scheduleDate = new Date (date.date.substr(0,10)*1000).toISOString().slice(0,10);;
    console.log(`
        length: ${propsLessonSchedule.length},
        count: ${propsLessonSchedule.indexOf(date)+1},
        date: ${date.date},
        time: ${date.time}
      `);

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
