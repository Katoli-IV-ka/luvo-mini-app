import classnames from "classnames";

export const Button = ({
  type = "button",
  onClick,
  children,
  className,
  disabled = false,
  styleType = "primary",
  ...props
}) => {
  return (
    <button
      {...props}
      type={type}
      onClick={onClick}
      className={classnames(
        className,
        "min-w-fit py-[18.5px] px-4 flex items-center justify-center rounded-[30px] font-bold text-xl leading-5",
        "transition-colors cursor-pointer disabled:opacity-30",
        {
          "bg-primary-red hover:bg-primary-red/80 active:bg-primary-red/60 text-white":
            styleType === "primary",
          "bg-white/10 hover:bg-white/16 active:bg-white/24 text-white":
            styleType === "secondary",
          "": disabled,
        }
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
