"use client";
import * as React from "react";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
}

export function MultiSelect({
  options,
  value = [],
  onChange,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    onChange(value.filter(i => i !== item));
  };

  const handleSelect = (item: string) => {
    if (value.includes(item)) {
      onChange(value.filter(i => i !== item));
    } else {
      onChange([...value, item]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full min-h-[2.5rem] h-auto justify-between",
            className
          )}
        >
          <div className="flex flex-wrap gap-1 py-1">
            {value.length > 0 ? (
              value.map(item => (
                <Badge
                  variant="secondary"
                  key={item}
                  className="mr-1 max-w-[calc(100%-1rem)] sm:max-w-xs"
                  onClick={e => {
                    e.stopPropagation();
                    handleUnselect(item);
                  }}
                >
                  <span className="truncate">{item}</span>
                  <button
                    className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        handleUnselect(item);
                      }
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground px-1">
                Select categories...
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full min-w-[200px] max-w-[min(calc(100vw-2rem),400px)] p-0"
        align="start"
      >
        <div className="max-h-[300px] overflow-auto">
          {options.map(option => (
            <div
              key={option}
              className={cn(
                "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent",
                value.includes(option) && "bg-accent"
              )}
              onClick={() => handleSelect(option)}
            >
              <span className="truncate pr-2">{option}</span>
              {value.includes(option) && (
                <Check className="h-4 w-4 flex-shrink-0 text-primary" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
