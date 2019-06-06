import React, { Component, PureComponent } from 'react';
import { exec } from 'rc-js-utils';
import { DetailState, DetailProps } from './interface';

const tableStyle = {
    width: '100%',
    tableLayout: 'fixed',
    border: '1px solid #e8e8e8',
};

const theadStyle = {
    padding: '16px 16px',
    borderBottom: '1px solid #e8e8e8',
    background: '#fafafa',
    fontSize: 14,
    lineHeight: '14px',
};

const tdStyle = {
    padding: '16px 16px',
    borderRight: '1px solid #e8e8e8',
    borderBottom: '1px solid #e8e8e8',
};

const labelStyle = {
    color: '#999',
    fontSize: 14,
};

const valueStyle = {
    color: '#000',
    fontSize: 14,
};

interface Data {
    [key: string]: any;
}

export class DetailColumn extends PureComponent {}

export default class Detail extends Component<DetailProps<Data>, DetailState<Data>> {
    constructor(props) {
        super(props);
        const { data = {} } = this.props;
        this.state = {
            data,
        };
    }

    render() {
        const { children, title } = this.props;
        const cols = [];
        React.Children.map(children, child => {
            const { type, props, key } = child;
            if (type === DetailColumn) {
                cols.push({
                    span: 2,
                    ...props,
                    key,
                });
            }
        });
        const rows = [];
        let row = [];
        let spanCount = 0;
        cols.forEach((col, index) => {
            const { span } = col;
            row.push(col);
            spanCount += span;
            if (spanCount >= 4) {
                rows.push(row);
                row = [];
                spanCount = 0;
            }
            if (cols.length - 1 === index) {
                rows.push(row);
            }
        });
        const { data } = this.state;
        return (
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={theadStyle} colSpan={4}>
                            <span>{title}</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r => (
                        <tr>
                            {r.map(col => (
                                <td style={tdStyle} colSpan={col.span}>
                                    <span style={labelStyle}>
                                        {col.label ? `${col.label}：` : ''}
                                    </span>
                                    <span style={valueStyle}>
                                        {col.render
                                            ? exec(col.render, data[col.key])
                                            : data[col.key] || '-'}
                                    </span>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}
