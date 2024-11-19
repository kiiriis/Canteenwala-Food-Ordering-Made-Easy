import React from 'react';

const TextInput = ({ Label, LabelId, field, setField, fieldType }) => {
  return (
    <div className='relative'>
      <input
        value={field}
        onChange={e => {
          setField(e.target.value);
        }}
        className='peer  rounded-md border-2 border-black px-1 py-1 pl-2 placeholder-transparent focus:border-black focus:ring-black'
        placeholder={Label}
        type={fieldType}
        id={LabelId}
      />
      <label
        htmlFor={LabelId}
        className=' absolute -top-[0.6rem] left-[0.61rem]  bg-white px-1 text-sm font-bold text-gray-800 transition-all duration-300 ease-out peer-placeholder-shown:top-[0.4rem] peer-placeholder-shown:text-base peer-placeholder-shown:font-semibold peer-placeholder-shown:text-gray-400 peer-focus:-top-[0.6rem] peer-focus:z-10 peer-focus:text-sm peer-focus:font-bold peer-focus:text-gray-800 '
      >
        {Label}
      </label>
    </div>
  );
};

export default TextInput;
