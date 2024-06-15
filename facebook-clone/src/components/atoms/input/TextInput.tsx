import { useField } from 'formik';
import React, { InputHTMLAttributes, useRef, useState } from 'react';
import { cn } from '../../../utils';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


type ITextInputSize = 'small' | 'medium' | 'large';

type IProps = InputHTMLAttributes<HTMLInputElement> & {
  inputSize?: ITextInputSize;
};

const TextInput: React.FC<IProps> = (props) => {
  const { inputSize,type } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [field, { error, touched }] = useField(props as string);
  const [showpassword,setShowpassword] = useState<any>(false)
  const handleshow = () => {
    setShowpassword(!showpassword)
  }
  return (
    <div className=" relative  my-3 ">
      <input
        ref={inputRef}
        {...field}
        {...props}
        className={cn(
          'w-full px-2 border border-gray-300 rounded-md focus:border-primary outline-none',
          inputSize === 'small' ? 'h-7' : inputSize === 'large' ? 'h-12' : 'h-8'
        )}
        type={showpassword ? 'text' : type}
      />

{type === 'password' && (
        <div
          onClick={handleshow}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        >
          {showpassword ? <FaEyeSlash /> : <FaEye />}
        </div>
      )}

      {touched && error ? (
        <div className="text-sm w-full text-red-500">
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export { TextInput };
