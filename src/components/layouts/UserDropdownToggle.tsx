// UserDropdownToggle.tsx
import React, { forwardRef } from 'react';


interface UserDropdownToggleProps {
  children?: React.ReactNode; 
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}


const UserDropdownToggle = forwardRef<HTMLButtonElement, UserDropdownToggleProps>(
  ({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault(); 
        onClick(e);
      }}
      className="btn hub-btn-gamer w-100 text-truncate" 
      style={{ maxWidth: '180px' }} 
    >
      {children}
    </button>
  )
);


UserDropdownToggle.displayName = 'UserDropdownToggle';

export default UserDropdownToggle;