import React from 'react';

import UserCancellationItem from './UserItem/UserCancellationItem';
import './UserList.css';

const userCancellationList = props => {

  const {...filter} = props.filter;
  let userCancellations2 = props.userCancellations;
  let propsUserCancellations = [];

  let key = null;
  let count = 0;

  if (filter.field === 'cancellations' && filter.key === 'date' && filter.value === 'Ascending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.date > b.date) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'date' && filter.value === 'Descending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.date < b.date) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'reason' && filter.value === 'Ascending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.reason > b.reason) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'reason' && filter.value === 'Descending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.reason < b.reason) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'sessionDate' && filter.value === 'Ascending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.sessionDate > b.sessionDate) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'sessionDate' && filter.value === 'Descending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.sessionDate < b.sessionDate) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'sessionTitle' && filter.value === 'Ascending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.sessionTitle > b.sessionTitle) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'sessionTitle' && filter.value === 'Descending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.sessionTitle < b.sessionTitle) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'lessonTitle' && filter.value === 'Ascending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.lesson.title > b.lesson.title) ? 1 : -1);
  }
  if (filter.field === 'cancellations' && filter.key === 'lessonTitle' && filter.value === 'Descending') {
    propsUserCancellations = props.userCancellations.sort((a, b) => (a.lesson.title < b.lesson.title) ? 1 : -1);
  }
  if (filter.field !== 'cancellations') {
    propsUserCancellations = props.userCancellations;
  }

  const cancellations = propsUserCancellations.map(cancellation => {
    // console.log(cancellation);
    // const cancellationDate = new Date (cancellation.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const sessionDate = new Date (cancellation.sessionDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    // console.log(sessionDate);
    count = propsUserCancellations.indexOf(cancellation)+1;
    key = cancellation.lesson._id+cancellation.sessionTitle+cancellation.date+count;
    return (
      <UserCancellationItem
        key={count}
        authId={props.authId}
        cancellation={cancellation}
        date={cancellation.date}
        reason={cancellation.reason}
        sessionDate={sessionDate}
        sessionTitle={cancellation.sessionTitle}
        lesson={cancellation.lesson}
      />
    );
  });

  return <ul className="user__list1_master">{cancellations}</ul>;
};

export default userCancellationList;
