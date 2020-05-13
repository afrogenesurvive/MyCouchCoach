import React from 'react';

import LessonCancellationItem from './LessonItem/LessonCancellationItem';
import './UserList.css';

const lessonCancellationList = props => {

  const cancellations = props.lessonCancellations.map(cancellation => {
    // const cancellationDate = new Date (cancellation.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const sessionDate = new Date (cancellation.sessionDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <LessonCancellationItem
        key={cancellation.user._id}
        authId={props.authId}
        cancellation={cancellation}
        date={cancellation.date}
        reason={cancellation.reason}
        sesssionDate={sessionDate}
        sessionTitle={cancellation.sessionTitle}
        user={cancellation.user}
      />
    );
  });

  return <ul className="user__list1_master">{cancellations}</ul>;
};

export default lessonCancellationList;
