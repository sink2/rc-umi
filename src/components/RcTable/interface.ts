import { ReactNode } from 'react';

export type Render<T> = (value: any, record: T, index: number) => ReactNode;
export type ConvertType = 'date' | 'dateTime' | 'number' | 'string' | '';
export interface Convert {
    type: ConvertType;
    timezone?: number;
    format?: string;
}

export interface TableColumnProps<T> {
    label: string | ReactNode;
    key: string;
    render?: Render<T>;
    align?: 'left' | 'right' | 'center';
    colSpan?: number;
    width?: string | number;
    className?: string;
    sort?: boolean;
    defaultSort?: 'ascend' | 'descend';
    group?: string;
    visible?: boolean;
    convert?: ConvertType | Convert;
}

type ActionOnClick<T> = (selectedRows: Array<T>, rows: Array<T>) => void;
type ColumnActionOnClick<T> = (record: T, index: number) => void;
export interface Disabled {
    disabled: boolean;
    tooltipMsg?: string;
}
type ActionDisabled<T> = (selectedRows: Array<T>, rows: Array<T>) => Disabled;
type ColumnActionDisabled<T> = (record: T, index: number) => Disabled;
type ActionVisible<T> = (selectedRows: Array<T>, rows: Array<T>) => boolean;
type ColumnActionVisible<T> = (record: T, index: number) => boolean;

/**
 * @description
 * @property {string} label - Action label.
 * @property {ActionOnClick<T> | ColumnActionOnClick<T>} onClick - Action click callback.
 * @property {boolean | Disabled | ActionDisabled<T> | ColumnActionDisabled<T>} [disabled=false] - Whether action is disabled.
 * @property {ReactNode} [icon] - Action icon.
 * @property {string} [color] - Column action font color.
 * @property {boolean} [collapse=false] - Whether action is collapsed.
 */
export interface TableActionProps<T> {
    label: string;
    onClick: ActionOnClick<T> | ColumnActionOnClick<T>;
    disabled?: boolean | Disabled | ActionDisabled<T> | ColumnActionDisabled<T>;
    visible?: boolean | ActionVisible<T> | ColumnActionVisible<T>;
    icon?: ReactNode;
    color?: string;
    float?: 'left' | 'right';
    type?: 'primary' | 'dashed' | 'danger' | 'link';
}

export interface TableActionMenuProps {
    label: string;
    trigger?: 'click' | 'hover';
    // disabled?: boolean | Disabled | ActionDisabled<T> | ColumnActionDisabled<T>;
    float?: 'left' | 'right';
    children: any;
}

export interface TableFilterProps {
    children: any;
}

export interface Options {
    label: string;
    value: string | boolean | number;
}

export interface TableFilterItemProps {
    label: string;
    key: string;
    type?: 'text' | 'date' | 'dateTime' | 'range' | 'enum';
    render?: (value: any) => string | number;
    options?: Options[];
    [key: string]: any;
}

export interface TableProps {
    data: any;
    rowKey?: string;
    refs?: (ins: any) => void;
}
export interface TableFilters {
    label: string;
    key: string;
    value: any;
    type?: 'text' | 'date' | 'dateTime' | 'range' | 'enum';
    render?: (value: any) => string | number;
}
export interface TableSorters {
    key: string;
    value: 'ascend' | 'descend';
}
export interface TablePaginationProps {
    pageSize?: number;
    pageSizeOptions?: string[];
    render?: (total: number, range: number[]) => string;
}
export interface TableRowSelectionProps<T> {
    type: 'checkbox' | 'radio';
    fixed?: boolean;
    width?: string | number;
    disabled?: (record: T) => boolean;
}
export interface TableState<T> {
    currentPage: number;
    pageSize: number;
    data: T[];
    total: number;
    filters: TableFilters[];
    sorters: TableSorters[];
    selectedRows: T[];
    loading: boolean;
    currentFilter?: any;
    currentFilterValue?: any;
}
export interface TableRequestData<T> {
    currentPage?: number;
    pageSize?: number;
    data?: T[];
    filters?: TableFilters[];
    sorters?: TableSorters[];
    selectedRows?: T[];
    total?: number;
}
