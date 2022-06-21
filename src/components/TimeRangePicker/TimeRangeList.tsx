import clsx from "clsx";
import { memo, useCallback } from "react";
import { RangeOption, rangeOptions } from "./rangeOptions";

type TimeRangeListProps = {
  closePicker: () => void;
  currentRange: RangeOption;
  changeRangeValue: (val: RangeOption) => void;
  setShowCalendar: (val: boolean) => void;
};

export const TimeRangeListFC = ({
  closePicker = () => {},
  currentRange,
  changeRangeValue = () => {},
  setShowCalendar = () => {}
}: TimeRangeListProps) => {
  const isChecked = useCallback((option: RangeOption, value: RangeOption) => {
    if (!option || !value) {
      return false;
    }

    return option.from === value.from && option.to === value.to;
  }, []);

  const setOption = useCallback(
    (option: RangeOption) => {
      const { from, to } = option;
      changeRangeValue({
        from,
        to
      });
      closePicker();
      setShowCalendar(false);
    },
    [changeRangeValue, closePicker, setShowCalendar]
  );

  return (
    <div>
      {rangeOptions.map((option, index) => {
        return (
          <button
            type="button"
            onClick={() => setOption(option)}
            key={option.display}
            className={clsx(
              "option-item hover:bg-gray-100 flex justify-between items-center w-full",
              { "bg-gray-50": isChecked(option, currentRange) }
            )}
          >
            <label
              htmlFor={`checkbox-${index}`}
              className="cursor-pointer py-1.5 px-2"
            >
              {option.display}
            </label>
            <input
              type="checkbox"
              className="opacity-0 cursor-pointer"
              checked={isChecked(option, currentRange)}
              onChange={() => {}}
              name="range-checkbox"
              id={`checkbox-${index}`}
            />
          </button>
        );
      })}
    </div>
  );
};

export const TimeRangeList = memo(TimeRangeListFC);
