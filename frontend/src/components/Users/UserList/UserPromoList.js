import React from 'react';

import UserPromoItem from './UserItem/UserPromoItem';
import './UserList.css';

const userPromoList = props => {
  const userPromos = props.userPromos.map(promo => {
    let promoStartDate = 0;
    if (promo.startDate !== null && promo.startDate !== "") {
      promoStartDate = new Date (promo.startDate.substr(0,10)*1000).toISOString().slice(0,10);
    }
    let promoEndDate = 0;
    if (promo.endDate !== null && promo.endDate !== "") {
      promoEndDate = new Date (promo.endDate.substr(0,10)*1000).toISOString().slice(0,10);
    }

    return (
      <UserPromoItem
        key={promo._id}
        authId={props.authId}
        _id={promo._id}
        name={promo.name}
        type={promo.type}
        valid={promo.valid}
        startDate={promoStartDate}
        endDate={promoEndDate}
        description={promo.description}
        code={promo.code}
        imageLink={promo.imageLink}
        promo={promo}
        onDelete={props.onDelete}
        canDelete={props.canDelete}
      />
    );
  });

  return <ul className="user__list1_detail">{userPromos}</ul>;
};

export default userPromoList;
