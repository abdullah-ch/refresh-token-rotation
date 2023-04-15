import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const SpinnerButton = ({ label, isLoading, handleClick, className }) => {
  return (
    <button onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading ? (
        <ClipLoader size={20} color={'#ffffff'} loading={isLoading} />
      ) : (
        label
      )}
    </button>
  );
};

export default SpinnerButton;
