import React from 'react';

import UserAddressItem from './UserItem/UserAddressItem';
import './UserList.css';

const userAddressList = props => {
  const userAddresses = props.userAddresses.map(address => {

    return (
      <UserAddressItem
        key={address.path}
        authId={props.authId}
        type={address.type}
        number={address.number}
        street={address.street}
        town={address.town}
        city={address.city}
        country={address.country}
        postalCode={address.postalCode}
        primary={address.primary}
        address={address}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userAddresses}</ul>;
};

export default userAddressList;
