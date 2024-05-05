import React from 'react';

const InputField = ({ label, ...props }) => {
    return (
        <div className="w-72">
            <div className="relative w-full min-w-[200px] h-10">
                <input
                    {...props}
                    className="peer w-full h-full bg-transparent text-blue-gray-100 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
                    placeholder=" "
                />
                <label
                    className="absolute top-0 left-0 text-sm text-blue-gray-50 pointer-events-none"
                >
                    {label}
                </label>
            </div>
        </div>
    );
};

export default InputField;