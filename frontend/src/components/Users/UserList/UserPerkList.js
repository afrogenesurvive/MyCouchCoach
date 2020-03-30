import React from 'react';

import UserPerkItem from './UserItem/UserPerkItem';
import './UserList.css';

const userPerkList = props => {
  const userPerks = props.userPerks.map(perk => {

    let perkDate = 0;
    if (perk.date !== null && perk.date !== "") {
      perkDate = new Date (perk.date.substr(0,10)*1000).toISOString().slice(0,10);
    }

    return (
      <UserPerkItem
        key={perk.description}
        authId={props.authId}
        name={perk.name}
        date={perkDate}
        description={perk.description}
        imageLink={perk.imageLink}
        perk={perk}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userPerks}</ul>;
};

export default userPerkList;
