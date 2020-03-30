import React from 'react';

import UserModelItem from './UserItem/UserModelItem';
import './UserList.css';

const UserModelList = props => {
  const userModels = props.userModels.map(userModel => {

    return (
      <UserModelItem
        key={userModel._id}
        authId={props.authId}
        _id={userModel._id}
        userModel={userModel}
        username={userModel.username}
        modelName={userModel.modelNames[0]}
        topImage={userModel.profileImages[0].path}
        bio={userModel.bio}
        interest1={userModel.interests[0]}
        interest2={userModel.interests[1]}
        interest3={userModel.interests[2]}
        canDelete={props.canDelete}
        onDelete={props.onDelete}
      />
    );
  });

  return <ul className="user__list1_master">{userModels}</ul>;
};

export default UserModelList;
