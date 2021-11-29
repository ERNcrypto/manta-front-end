import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select } from 'element-react';

const FormSelect = ({
  className,
  options,
  selectedOption,
  setSelectedOption,
  selectedAssetIsPrivate,
  disabled,
}) => {
  useEffect(() => {
    if (!selectedOption && options && options.length) {
      setSelectedOption(options[0]);
    }
  }, [selectedOption, options]);

  useEffect(() => {
    options && options.length && setSelectedOption(options[0]);
  }, [selectedAssetIsPrivate]);

  return (
    <div className={classNames('pt-4 pb-6', className)}>
      <div className='flex relative bottom-1 rounded-lg btn-primary bg-fourth pt-3 pb-1'>
        <img
          className='w-12 h-12 p-3 z-10 left-3 absolute manta-bg-secondary rounded-full'
          src={selectedOption?.icon}
          alt='icon'
        />
        <div className='relative w-full'>
          <span className='text-sm absolute form-select-label top-0 z-10 block text-white'>
            {selectedOption?.ticker}
          </span>
          <Select
            className='white'
            onChange={(option) => setSelectedOption(option)}
            value={selectedOption}
            placeholder='select'
            disabled={disabled}
          >
            {options &&
              options.map((option) => {
                return (
                  <Select.Option
                    key={option.name}
                    label={option.name}
                    value={option}
                  >
                    <div className='flex items-center'>
                      <img
                        className='w-10 h-10 p-2 px-3 rounded-full manta-bg-secondary'
                        src={option.icon}
                        alt='icon'
                      />
                      <div className='px-3'>
                        <span className='text-sm block'>{option.ticker}</span>
                        <span className='text-lg'>{option.name}</span>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
          </Select>
        </div>
      </div>
    </div>
  );
};

FormSelect.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormSelect;
