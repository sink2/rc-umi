import React, { Component } from 'react';
import Table, { TableColumn, TableAction, TableHead } from '@/components/RcTable';

export default class Welcome extends Component {
    componentDidMount() {}

    render() {
        return (
            <Table
                data={[{ id: 1, name: 'a' }]}
                refs={ins => {
                    this.table = ins;
                }}
            >
                <TableHead>
                    {/* <TableFilter>
                        <TableFilter.Item />
                        <TableFilter.Item />
                        <TableFilter.Item />
                    </TableFilter> */}
                    <TableAction label="创建" onClick={() => {}} />
                    <TableAction label="编辑" onClick={() => {}} collapse />
                    <TableAction label="删除" onClick={() => {}} collapse />
                </TableHead>
                <TableColumn label="Name" key="name" />
                <TableColumn label="Age" key="age" />
                <TableColumn label="Address" key="address" />
                <TableColumn label="Address1" key="address1" group="Address Info" />
                <TableColumn label="Address2" key="address2" group="Address Info" />
                <TableColumn label="Address3" key="address3" group="Address Info" />
                <TableAction
                    label="编辑"
                    onClick={() => {}}
                    disabled={{ disabled: true, tooltipMsg: 'test' }}
                />
                <TableAction label="删除" onClick={() => {}} visible={() => true} />
            </Table>
        );
    }
}
