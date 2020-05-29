import React from 'react';

import UserInterestItem from './UserItem/UserInterestItem';
import './UserList.css';

const userInterestList = props => {

  const {...filter} = props.filter;
  let userInterests2 = props.userInterests;
  let propsUserInterests = [];

  if (filter.field === 'interests' && filter.key === 'interest' && filter.value === 'Ascending') {
    propsUserInterests = userInterests2.sort((a, b) => (a < b) ? 1 : -1);
    console.log('...no interest filter...'+filter.key+'...'+filter.value);
    console.log('userInterests2',userInterests2);
    console.log('propsUserInterests',propsUserInterests);
    console.log('propsUserInterests',propsUserInterests);
  }
  if (filter.field === 'interests' && filter.key === 'interest' && filter.value === 'Descending') {
    propsUserInterests = userInterests2.sort((a, b) => (a > b) ? 1 : -1);
    console.log('...no interest filter...'+filter.key+'...'+filter.value);
    console.log('userInterests2',userInterests2);
    console.log('propsUserInterests',propsUserInterests);
    console.log('propsUserInterests',propsUserInterests);
  }
  if (filter.field !== 'interests') {
    propsUserInterests = userInterests2;
    console.log('...no interest filter...'+filter.key+'...'+filter.value);
    console.log('userInterests2',userInterests2);
    console.log('propsUserInterests',propsUserInterests);
    console.log('propsUserInterests',propsUserInterests);
  }

  const userInterests = propsUserInterests.map(interest => {

    return (
      <UserInterestItem
        key={interest}
        authId={props.authId}
        interest={interest}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userInterests}</ul>;
};

export default userInterestList;
