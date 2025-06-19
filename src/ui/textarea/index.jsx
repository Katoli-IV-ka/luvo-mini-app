import React from "react";
import classnames from "classnames";

export const Textarea = React.forwardRef(
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
          <label className="inline-block mb-2 text-white/40">{label}</label>
        )}

        <div className="relative flex items-center rounded-lg bg-white/10">
          <textarea
            ref={ref}
            rows={4}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={classnames(
              "w-full py-[18px] px-4 rounded-[30px] leading-5 text-xl text-black border-2 border-primary-gray/30 bg-gray-light resize-none",
              inputClassName
            )}
            disabled={disabled}
            {...props}
          />

          {children}
        </div>

        {error && <p className="mt-2 text-additional-red">{error.message}</p>}
      </div>
    );
  }
);
