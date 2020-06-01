import React from 'react';

import UserAddressItem from './UserItem/UserAddressItem';
import './UserList.css';

const userAddressList = props => {

  const {...filter} = props.filter;
  // let userAddresses = [];
  let userAddresses = props.userAddresses;
  let propsUserAddresses = [];

  if (filter.field === 'addresses' && filter.key === 'primary') {
    propsUserAddresses = userAddresses.filter(x => x.primary === filter.value);
    // userAddresses = propsUserAddresses;

    // console.log('...filter addresses...by...'+filter.key+'...'+filter.value);
    // console.log('let userAddresses',userAddresses);
    // console.log('propsUserAddresses',propsUserAddresses);
    // console.log('props.userAddresses',props.userAddresses);

    // console.log('...propsUserAddresses...'+propsUserAddresses.length,JSON.stringify(propsUserAddresses));

    // console.log('...propsUserAddresses.filter stringify...',JSON.stringify(propsUserAddresses.filter(x => x.primary === filter.value)));
    // console.log('...filter addresses...by...'+filter.key+'...'+filter.value+'...result length...'+propsUserAddresses.filter(x => x.primary === filter.value).length,'...result...',JSON.stringify(propsUserAddresses.filter(x => x.primary === filter.value)));
    // console.log('...props.userAddresses filter ...',props.userAddresses.filter(x => x.primary === filter.value));

    // console.log('...props.userAddresses length...',props.userAddresses.length);
    // console.log('props.userAddresses',props.userAddresses);
    // console.log('let userAddresses',userAddresses);

  }
  if (filter.field === 'addresses' && filter.key === 'type') {
    propsUserAddresses = props.userAddresses.filter(x => x.type === filter.value);

    // console.log('...filter addresses...by...'+filter.key+'...'+filter.value);
    // console.log('let userAddresses',userAddresses);
    // console.log('propsUserAddresses',propsUserAddresses);
    // console.log('props.userAddresses',props.userAddresses);

  }
  if (filter.field === 'addresses' && filter.key === 'number' && filter.value === 'Ascending') {

    propsUserAddresses = props.userAddresses.sort((a, b) => (a.number > b.number) ? 1 : -1)

    // console.log('...filter addresses...by...'+filter.key+'...'+filter.value);
    // console.log('let userAddresses',userAddresses);
    // console.log('propsUserAddresses',propsUserAddresses);
    // console.log('props.userAddresses',props.userAddresses);
  }
  if (filter.field === 'addresses' && filter.key === 'number' && filter.value === 'Descending') {

    propsUserAddresses = props.userAddresses.sort((a, b) => (a.number < b.number) ? 1 : -1)

    // console.log('...filter addresses...by...'+filter.key+'...'+filter.value);
    // console.log('let userAddresses',userAddresses);
    // console.log('propsUserAddresses',propsUserAddresses);
    // console.log('props.userAddresses',props.userAddresses);
  }
  if (filter.field !== 'addresses') {

    // console.log('...no address filter...'+filter.key+'...'+filter.value);
    // console.log('let userAddresses',userAddresses);
    // console.log('propsUserAddresses',propsUserAddresses);
    // console.log('props.userAddresses',props.userAddresses);

    // userAddresses = props.userAddresses;
    propsUserAddresses = userAddresses;
    // propsUserAddresses = props.userAddresses;
  }

  userAddresses =  propsUserAddresses.map(address => {
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
