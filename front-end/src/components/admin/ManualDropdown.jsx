import React, { useState, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

const ManualDropdown = ({ options = [], onSelect, selected }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Internal state for showing the selected value
  const [selectedValue, setSelectedValue] = useState(selected || "");

  //Sync if parent sends a new selected value (Edit Mode)
  useEffect(() => {
    setSelectedValue(selected || "");
  }, [selected]);

  const handleSelect = (option) => {
    setSelectedValue(option);
    onSelect && onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative w-60">
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-4 py-2.5 
        bg-gray-50 border border-gray-300 rounded-lg 
        text-gray-700 cursor-pointer hover:bg-gray-100 transition"
      >
        <span className={`${!selectedValue ? "text-gray-400" : ""}`}>
          {selectedValue || "Select"}
        </span>

        <FiChevronDown
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white 
        border border-gray-200 rounded-lg shadow-md z-20 overflow-hidden"
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2.5 cursor-pointer text-gray-700 
              hover:bg-gray-100 transition
              ${selectedValue === option ? "bg-gray-100 font-medium" : ""}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManualDropdown;
