import React from 'react';

import UserComplaintItem from './UserItem/UserComplaintItem';
import './UserList.css';

const userComplaintList = props => {
  const userComplaints = props.userComplaints.map(complaint => {
    const complainant = complaint.complainant;
    
    return (
      <UserComplaintItem
        key={complaint.path}
        authId={props.authId}
        date={complaint.date}
        type={complaint.type}
        description={complaint.description}
        complainant={complaint.complainant}
        complaint={complaint}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userComplaints}</ul>;
};

export default userComplaintList;
