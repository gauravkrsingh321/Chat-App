import React from "react";

const Input = (
  {
  typeOfInput = "text",
  placeholderValue = "",
  value = "",
  changeHandler,
  // ...rest, //<-- this collects all other remaining props i.e. This is useful when you want to pass any extra HTML attributes (like disabled, maxLength, aria-*, data-*, etc.) without explicitly listing them in your component.
}
) => {
  return (
    <>
      <input
        type={typeOfInput}
        className={`input input-bordered w-full pl-9`}
        placeholder={placeholderValue}
        value={value}
        onChange={changeHandler}
      />
    </>
  );
};

export default Input;
