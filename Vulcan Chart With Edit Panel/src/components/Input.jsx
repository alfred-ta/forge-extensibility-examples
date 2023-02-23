import React from 'react';


const Input = (props) => {
  const {
    name,
    label,
    onChange,
    ...rest
  } = props;
  return (
    <div className='form-control flex items-center mb-8'>
      <label
        htmlFor={name}
        className='text-gray-90 font-bold mb-2 text-xs flex-1'
      >
        {label}
      </label>
      <input
        type='text'
        className='px-3 py-2 border border-solid border-gray-40 rounded-lg w-full leading-5 text-sm flex-2'
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
    </div>
  );
};

export default Input;
