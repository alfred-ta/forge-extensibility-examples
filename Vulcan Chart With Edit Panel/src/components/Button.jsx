import React from 'react';
import cls from 'classnames';

const Button = (props) => {
  const {
    variant = 'primary',
    size = 'md',
    disabled = false,
    className,
    children,
    ...rest
  } = props;
  return (
    <button
      className={cls(className, 'btn', {
        'btn-lg': size === 'lg',
        'btn-md': size === 'md',
        'btn-sm': size === 'sm',
        'btn-icon': size === 'icon',
        'btn-primary': variant === 'primary' && !disabled,
        'btn-secondary':
          variant === 'secondary' || (variant === 'primary' && disabled)
      })}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
