import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { SortAsc, SortDesc } from 'lucide-react';

const SortButton = ({ options, selectedOption, onSelect, onToggleOrder }) => {
  return (
    <div className='mx-4'>
      <Listbox value={selectedOption} onChange={onSelect}>
        {({ open }) => (
          <>
            <Listbox.Button className="relative py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:ring focus:border-blue-300 sm:text-sm">
              <span className="block truncate">{selectedOption ? selectedOption.label : 'Sort By'}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                {selectedOption && selectedOption.order === 'asc' ? (
                  <SortAsc size={20} strokeWidth={1} />
                ) : (
                  <SortDesc size={20} strokeWidth={1} />
                )}
              </span>
            </Listbox.Button>

            {open && (
              <div className={`absolute z-5 w-25 mx-1 py-1 mt-1 overflow-auto text-base bg-white border border-gray-300 rounded-md shadow-md max-h-60 focus:outline-none sm:text-sm ${open ? 'block' : 'hidden'}`}>
                {options.map((option) => (
                  <Listbox.Option key={option.value} value={option}>
                    {({ active, selected }) => (
                      <div
                        onClick={() => {
                          onSelect(option); // Call onSelect with the selected option
                          onToggleOrder(option.value);
                        }}
                        className={`${active ? 'text-white bg-blue-500' : 'text-gray-900'
                          } cursor-pointer select-none relative py-2 pl-3 pr-9`}
                      >
                        <span>{option.label}</span>
                        {selected && (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4">
                            {option.order === 'asc' ? (
                              <SortAsc size={20} strokeWidth={1} />
                            ) : (
                              <SortDesc size={20} strokeWidth={1} />
                            )}
                          </span>
                        )}
                      </div>
                    )}
                  </Listbox.Option>
                ))}

                {/* Toggle button inside Listbox.Options */}
                <button
                  onClick={() => {
                    onToggleOrder(selectedOption.value);
                  }}
                  className="ml-2 p-2 focus:outline-none"
                >
                  {selectedOption && selectedOption.order === 'asc' ? (
                    <SortDesc size={20} strokeWidth={1} />
                  ) : (
                    <SortAsc size={20} strokeWidth={1} />
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </Listbox>
    </div>
  );
};

export default SortButton;