import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CostumedDebounceInput from "./CostumedDebounceInput";

export default function CustomSelect({
  placeholder,
  options = [],
  onSelect,
  defaultValue = null,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue);
  const dropdownRef = useRef(null);

  const [displayOptions, setDisplayOptions] = useState([]);

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
    onSelect?.(option);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="costumedSelect w-full justify-between flex items-center"
      >
        {selected?.name || placeholder}
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <>
          <ul
            className={`absolute z-10 mt-2 p-2 flex flex-col gap-1 w-full costumedSelectOptionContainer max-h-[174px] h-[calc(${options.length} * 48px)] overflow-y-auto rounded-card`}
          >
            {options.length > 1 && (
              <div className={`sticky top-0 bg-base-100 z-99 mb-1 `}>
                <CostumedDebounceInput
                  name={"searchInput"}
                  onChange={(value) => {
                    setDisplayOptions(
                      options.filter((opt) =>
                        opt[0].name.toLowerCase().includes(value.toLowerCase())
                      )
                    );
                  }}
                  placeholder={"Tìm kiếm..."}
                />
              </div>
            )}

            <li key={"no-option"} className="">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-base-200 text-sm h-[48px] rounded-btn"
                onClick={() => handleSelect(null)}
              >
                Lựa chọn rỗng
              </button>
            </li>

            {displayOptions.map((opt, idx) => {
              return (
                <li key={opt[0].id || idx} className="">
                  <button
                    type="button"
                    className="block w-full text-left px-4 py-2 hover:bg-base-200 text-sm h-[48px] rounded-btn"
                    onClick={() => handleSelect(opt[0])}
                  >
                    {opt[0].name}
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
