const Button = ({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const variants = {
    primary:
      "bg-[#2C5282] text-white hover:bg-[#1e3a5f] focus:ring-[#2C5282]",
    secondary:
      "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-300",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-sm",
    md: "px-8 py-2.5 text-sm rounded-sm",
    lg: "px-10 py-3 text-base rounded-md",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
