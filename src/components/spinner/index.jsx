export const Spinner = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`rounded-full border-4 border-gray-200 border-t-primary-red ${sizeClasses[size]} animate-spin`}
      ></div>
    </div>
  );
};
