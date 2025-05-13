import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleBlock } from '../../slices/adminManagement/customer/customerSlice';

export default function ToggleBlockButton({ userId, isBlocked }) {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(toggleBlock(userId));
  };

  return (
    <button onClick={handleClick} style={{ color: isBlocked ? 'green' : 'red' }}>
      {isBlocked ? 'Unblock' : 'Block'}
    </button>
  );
}
