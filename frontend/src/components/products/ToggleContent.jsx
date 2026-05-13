import {useState} from 'react';
import MaterialIcon from '../common/MaterialIcon';

// A functional icon to hide or show content (default: show)
const ToggleContent = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden">
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex justify-between items-center"
      >
        <span className="text-heading2 font-display font-bold">{title}</span>
        {/* <span
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
            <MaterialIcon icon="expand_more" size={24} />
        </span> */}
        <span
            className={`transition-all duration-200}`}
            >
            <MaterialIcon icon={isOpen ? "remove" : "add"} size={24} />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="py-layout-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToggleContent;