import React from "react";
import {
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select";

interface SelectOption {
  value: string;
  label: React.ReactNode;
}

interface ElectiveFilterProps {
  options: SelectOption[];
  onChange: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

const ElectiveFilter = ({
  options,
  onChange,
  defaultValue,
  placeholder = "Select...",
  triggerClassName,
  icon,
  ariaLabel,
}: ElectiveFilterProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Visible label */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{placeholder}</span>
        {icon ? <span className="ml-2 text-gray-500">{icon}</span> : null}
      </div>

      {/* Accessible select */}
      <Select onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger
          className={`w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-left shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-300 ${triggerClassName ?? ""}`}
          aria-label={ariaLabel ?? placeholder}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ElectiveFilter;
