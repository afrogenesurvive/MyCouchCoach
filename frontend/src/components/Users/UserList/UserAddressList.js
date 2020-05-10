import React from 'react';

import UserAddressItem from './UserItem/UserAddressItem';
import './UserList.css';

const userAddressList = props => {

  const {...filter} = props.filter;
  let userAddresses = [];
  if (filter.field === 'addresses' && filter.key === 'primary') {
    console.log('...filtered addresses...',filter);
  }

  if (filter.field === 'addresses' && filter.key === 'type') {
    console.log('...filtered addresses...',filter);
  }

  if (filter.field === null && filter.key === null && filter.value === null) {
    console.log('...unfiltered addresses...',filter);

  }

  userAddresses = props.userAddresses.map(address => {
    return (
      <UserAddressItem
        key={address.postalCode}
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
        orderForm={props.orderForm}
        addToOrder={props.addToOrder}
        makeAddressPrimary={props.makeAddressPrimary}
      />
    );
  });



  return <ul className="user__list1_detail">{userAddresses}</ul>;
};

export default userAddressList;
