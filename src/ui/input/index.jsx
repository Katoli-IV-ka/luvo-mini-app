import React from "react";
import classnames from "classnames";

export const Input = React.forwardRef(
  (
    {
      type = "text",
      label,
      value,
      error,
      onChange,
      children,
      disabled,
      className,
      placeholder,
      inputClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={classnames("w-full", className)}>
        {label && (
          <label className="inline-block mb-2 text-white dark:text-black">
            {label}
          </label>
        )}

        <div className="relative flex items-center rounded-[30px] bg-white/10">
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={classnames(
              "w-full py-[18px] px-4 rounded-[30px] leading-5 text-xl border-2 border-primary-gray/30 bg-gray-light text-black dark:bg-transparent dark:text-white",
              inputClassName
            )}
            disabled={disabled}
            {...props}
          />

          {children}
        </div>

        {error && (
          <p className="mt-2 font-semibold text-additional-red">
            {error.message}
          </p>
        )}
      </div>
    );
  }
);
