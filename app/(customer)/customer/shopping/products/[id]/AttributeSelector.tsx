import React from "react";

interface AttributeSelectorProps {
  attributeName: string;
  options: string[];
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const AttributeSelector: React.FC<AttributeSelectorProps> = ({
  attributeName,
  options,
  selectedOption,
  onOptionChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 capitalize">
        {attributeName}
      </label>
      <div className="mt-1 flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => onOptionChange(option)}
            className={`px-3 py-1 rounded-full ${
              selectedOption === option
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AttributeSelector);
