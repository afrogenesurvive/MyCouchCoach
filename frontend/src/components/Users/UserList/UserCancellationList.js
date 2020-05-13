import React from 'react';

import UserCancellationItem from './UserItem/UserCancellationItem';
import './UserList.css';

const userCancellationList = props => {

  const cancellations = props.userCancellations.map(cancellation => {
    // const cancellationDate = new Date (cancellation.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    const sessionDate = new Date (cancellation.sessionDate.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <UserCancellationItem
        key={cancellation.lesson._id}
        authId={props.authId}
        cancellation={cancellation}
        date={cancellation.date}
        reason={cancellation.reason}
        sesssionDate={sessionDate}
        sessionTitle={cancellation.sessionTitle}
        lesson={cancellation.lesson}
      />
    );
  });

  return <ul className="user__list1_master">{cancellations}</ul>;
};

export default userCancellationList;
