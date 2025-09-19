import React from "react";

const TextField = ({ title, data }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">{title}</label>
      <input
        type="text"
        value={data}
        className="shadow appearance-none border rounded w-full py-2 px-3 h-[40px] leading-tight focus:outline-none focus:shadow-outline bg-gray-100"
        readOnly
      />
    </div>
  );
};

export default TextField;
