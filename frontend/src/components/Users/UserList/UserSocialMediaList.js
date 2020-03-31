import React from 'react';

import UserSocialMediaItem from './UserItem/UserSocialMediaItem';
import './UserList.css';

const userSocialMediaList = props => {
  const userSocialMedia = props.userSocialMedia.map(socialMediaAccount => {

    return (
      <UserProfileImageItem
        key={socialMediaAccount.path}
        authId={props.authId}
        platform={socialMediaAccount.platform}
        handle={socialMediaAccount.handle}
        socialMediaAccount={socialMediaAccount}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userSocialMedia}</ul>;
};

export default userSocialMediaList;
