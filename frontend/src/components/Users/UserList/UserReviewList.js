import React from 'react';

import UserReviewItem from './UserItem/UserReviewItem';
import './UserList.css';

const userReviewList = props => {

  const userReviews = props.userReviews.map(review => {
    const reviewDate = new Date (review.date.substr(0,10)*1000).toLocaleDateString().slice(0,10);
    return (
      <UserReviewItem
        key={review._id}
        authId={props.authId}
        _id={review._id}
        date={reviewDate}
        type={review.type}
        body={review.body}
        rating={review.rating}
        review={review}
        lesson={review.lesson}
      />
    );
  });

  return <ul className="user__list1_master">{userReviews}</ul>;
};

export default userReviewList;
