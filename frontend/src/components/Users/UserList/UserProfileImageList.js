import React from 'react';

import UserProfileImageItem from './UserItem/UserProfileImageItem';
import './UserList.css';

const userProfileImageList = props => {
  const userProfileImages = props.userProfileImages.map(profileImage => {

    return (
      <UserProfileImageItem
        key={profileImage.path}
        authId={props.authId}
        name={profileImage.name}
        type={profileImage.type}
        path={profileImage.path}
        profileImage={profileImage}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userProfileImages}</ul>;
};

export default userProfileImageList;
