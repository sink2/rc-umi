import { ReactNode } from 'react';

export interface RcModalOptions {
    title: string;
    component: null | ReactNode;
    width: number | string;
}

export interface RcModalState {
    title: string;
    visible: boolean;
    component: null | ReactNode;
    width: number | string;
}
