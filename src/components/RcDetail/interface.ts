export interface DetailColumnProps {
    label: string;
    key: string;
    render: (value: any) => string;
    span: 1 | 2 | 3 | 4;
}

export interface DetailProps<T> {
    title: string;
    data: T;
    children?: DetailColumnProps[];
}

export interface DetailState<T> {
    data: T;
}
