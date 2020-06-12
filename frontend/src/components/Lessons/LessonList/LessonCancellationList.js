import React from 'react';

import LessonCancellationItem from './LessonItem/LessonCancellationItem';
import './UserList.css';

const lessonCancellationList = props => {

  const {...filter} = props.filter;
  let lessonCancellations2 = props.lessonCancellations;
  let propsLessonCancellations = [];
  let count = 0;

  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'dateAscending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'dateDescending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'reasonAscending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.reason > b.reason) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'reasonDescending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.reason < b.reason) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'sessionDateAscending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.sessionDate > b.sessionDate) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'sessionDateDescending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.sessionDate < b.sessionDate) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'sessionDateAscending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.sessionTitle > b.sessionTitle) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'sessionDateDescending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.sessionTitle < b.sessionTitle) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'usernameAscending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.user.username > b.user.username) ? 1 : -1);
  }
  if (filter.field === 'lessonDetail' && filter.key === 'cancellations' && filter.value === 'usernameDescending') {
    propsLessonCancellations = props.lessonCancellations.sort((a, b) => (a.user.username < b.user.username) ? 1 : -1);
  }
  if (filter.field !== 'lessonDetail' && filter.key !== 'cancellations') {
    propsLessonCancellations = props.lessonCancellations;
  }

  const cancellations = propsLessonCancellations.map(cancellation => {
    // console.log('cancellations',cancellation);
    // const cancellationDate = new Date (cancellation.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const sessionDate = new Date (cancellation.sessionDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    // console.log(sessionDate);
    count = propsLessonCancellations.indexOf(cancellation);
    return (
      <LessonCancellationItem
        key={count}
        authId={props.authId}
        cancellation={cancellation}
        date={cancellation.date}
        reason={cancellation.reason}
        sessionDate={sessionDate}
        sessionTitle={cancellation.sessionTitle}
        user={cancellation.user}
      />
    );
  });

  return <ul className="user__list1_master">{cancellations}</ul>;
};

export default lessonCancellationList;
