
declare module 'react-datepicker' {
  import React from 'react';

  export interface ReactDatePickerProps {
    adjustDateOnChange?: boolean;
    allowSameDay?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    calendarClassName?: string;
    calendarStartDay?: number;
    children?: React.ReactNode;
    className?: string;
    customInput?: React.ReactNode;
    customInputRef?: string;
    dateFormat?: string | string[];
    dateFormatCalendar?: string;
    dayClassName?: (date: Date) => string | null;
    disabled?: boolean;
    disabledKeyboardNavigation?: boolean;
    dropdownMode?: 'scroll' | 'select';
    endDate?: Date | null;
    excludeDates?: Date[];
    excludeTimes?: Date[];
    filterDate?: (date: Date) => boolean;
    fixedHeight?: boolean;
    forceShowMonthNavigation?: boolean;
    formatWeekDay?: (formattedDate: string) => string;
    highlightDates?: Array<Date | { [className: string]: Date[] }>;
    id?: string;
    includeDates?: Date[];
    includeTimes?: Date[];
    inline?: boolean;
    isClearable?: boolean;
    locale?: string | { [key: string]: any };
    maxDate?: Date;
    maxTime?: Date;
    minDate?: Date;
    minTime?: Date;
    monthsShown?: number;
    name?: string;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (date: Date | null, event: React.SyntheticEvent<any> | undefined) => void;
    onChangeRaw?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onClickOutside?: (event: React.MouseEvent<HTMLDivElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onInputClick?: () => void;
    onInputError?: (err: { code: number; msg: string }) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>) => void;
    onMonthChange?: (date: Date) => void;
    onSelect?: (date: Date, event: React.SyntheticEvent<any> | undefined) => void;
    onWeekSelect?: (
      firstDayOfWeek: Date,
      weekNumber: string | number,
      event: React.SyntheticEvent<any> | undefined
    ) => void;
    onYearChange?: (date: Date) => void;
    openToDate?: Date;
    peekNextMonth?: boolean;
    placeholderText?: string;
    popperClassName?: string;
    popperContainer?: (props: { children: React.ReactNode[] }) => React.ReactNode;
    popperModifiers?: any;
    popperPlacement?: string;
    popperProps?: {};
    preventOpenOnFocus?: boolean;
    readOnly?: boolean;
    required?: boolean;
    scrollableMonthYearDropdown?: boolean;
    scrollableYearDropdown?: boolean;
    selected?: Date | null;
    selectsEnd?: boolean;
    selectsStart?: boolean;
    shouldCloseOnSelect?: boolean;
    showDisabledMonthNavigation?: boolean;
    showMonthDropdown?: boolean;
    showMonthYearDropdown?: boolean;
    showTimeSelect?: boolean;
    showTimeSelectOnly?: boolean;
    showWeekNumbers?: boolean;
    showYearDropdown?: boolean;
    startDate?: Date | null;
    startOpen?: boolean;
    tabIndex?: number;
    timeCaption?: string;
    timeFormat?: string;
    timeIntervals?: number;
    title?: string;
    todayButton?: React.ReactNode;
    useShortMonthInDropdown?: boolean;
    useWeekdaysShort?: boolean;
    value?: string;
    weekLabel?: string;
    withPortal?: boolean;
    wrapperClassName?: string;
    yearDropdownItemNumber?: number;
    timeInputLabel?: string;
    inlineFocusSelectedMonth?: boolean;
    onDayMouseEnter?: (date: Date) => void;
    onMonthMouseLeave?: () => void;
    showPopperArrow?: boolean;
    excludeDateIntervals?: Array<{ start: Date; end: Date }>;
    excludeScrollbar?: boolean;
    renderCustomHeader?: (params: {
      date: Date;
      changeYear: (year: number) => void;
      changeMonth: (month: number) => void;
      decreaseMonth: () => void;
      increaseMonth: () => void;
      prevMonthButtonDisabled: boolean;
      nextMonthButtonDisabled: boolean;
    }) => React.ReactNode;
    renderDayContents?: (dayOfMonth: number, date?: Date) => React.ReactNode;
    showTimeInput?: boolean;
    showMonthYearPicker?: boolean;
    showFullMonthYearPicker?: boolean;
    showTwoColumnMonthYearPicker?: boolean;
    strictParsing?: boolean;
    timeOnly?: boolean;
    timeInputLabel?: string;
    disabledDayAriaLabelPrefix?: string;
    monthAriaLabelPrefix?: string;
    weekAriaLabelPrefix?: string;
    containerRef?: React.RefObject<HTMLDivElement>;
    monthShowsEnabled?: boolean;
  }

  export default class DatePicker extends React.Component<ReactDatePickerProps> {
    setFocus(): void;
    setOpen(open: boolean, skipSetBlur?: boolean): void;
    setBlur(): void;
    isCalendarOpen(): boolean;
  }
}
