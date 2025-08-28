import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const CostumedDebounceInput = ({
  type = "text",
  name,
  onChange,
  className,
  iconClassName = "",
  placeholder,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]);

  useEffect(() => {
    onChange(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <>
      <div className="relative w-full">
        <input
          type={type}
          name={name}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className={`input input-bordered w-full text-sm ${className}`}
          placeholder={placeholder}
        />
        <Search
          className={`size-4 absolute top-[calc(50%-8px)] right-4 opacity-20 ${iconClassName}`}
        />
      </div>
    </>
  );
};

export default CostumedDebounceInput;
