import React from 'react';

import UserActivityItem from './UserItem/UserActivityItem';
import './UserList.css';

const userActivityList = props => {

  const activity = props.userActivity.map(activity => {
    const activityDate = new Date (activity.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <UserActivityItem
        key={activity.request}
        activity={activity}
        date={activityDate}
        request={activity.request}
        authId={props.authId}
      />
    );
  });

  return <ul className="user__list1_master">{activity}</ul>;
};

export default userActivityList;
