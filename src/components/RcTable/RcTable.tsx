import React, { Component, Fragment, ReactNode } from 'react';
import {
    Table as AntdTable,
    Divider,
    Tooltip,
    Menu,
    Icon,
    Row,
    Dropdown,
    Button,
    Col,
    Select,
    DatePicker,
    Input,
    Tag,
} from 'antd';
import { pick, isBoolean, find, isEmpty } from 'lodash';
import { exec, isBlank, convertToLocalDate, formatNumber, formatString } from 'rc-js-utils';
import TableAction from './props/TableAction';
import TableActionMenu from './props/TableActionMenu';
import TableCloumn from './props/TableColumn';
import TableHead from './props/TableHead';
import TableFilter from './props/TableFilter';
import TableFilterItem from './props/TableFilterItem';
import TablePagination from './props/TablePagination';
import TableRowSelection from './props/TableRowSelection';
import {
    TableProps,
    TableState,
    TableColumnProps,
    TableActionProps,
    TableActionMenuProps,
    TableFilterProps,
    TableFilterItemProps,
    TableFilters,
    TableSorters,
    TablePaginationProps,
    TableRequestData,
    Disabled,
    Render,
    ConvertType,
    Convert,
    TableRowSelectionProps,
} from './interface';
import { isArray } from 'util';

const { Column, ColumnGroup } = AntdTable;
const { RangePicker } = DatePicker;

/**
 * @description 根据传入的组件类型返回对应子组件的props
 * @param {any[]} children - Table component children.
 * @param {any} ComponentType - Child component type.
 * @param {boolean} [single=false] - Single sign.
 */
function getTableComponentProps(
    children: any[] | any,
    ComponentType: any,
    single: boolean = false
) {
    const componentProps = [];
    React.Children.map(children, child => {
        const { type } = child;
        if (type === ComponentType) {
            const { props, key } = child;
            componentProps.push({ ...props, key });
        }
    });
    return single ? componentProps[0] : componentProps;
}

/**
 * @description 将`convert`属性转换为`render`属性
 * @param {null | ConvertType | Convert} convert - Table column `convert` props.
 */
function convertToRender(convert: null | ConvertType | Convert): Render<any> {
    if (isBlank(convert)) {
        return null;
    }
    let convertRender;
    const isConvertType = (convert: any): convert is ConvertType =>
        typeof (convert as ConvertType)['type'] === 'undefined';
    let convertObject: Convert = { type: '' };
    if (isConvertType(convert)) {
        convertObject.type = convert;
    } else {
        convertObject = Object.assign(convertObject, convert);
    }
    switch (convertObject.type) {
        case 'date':
            const options: any = { format: 'YYYY-MM-DD' };
            if (!isBlank(convertObject.timezone)) {
                options.timezone = convertObject.timezone;
            }
            if (!isBlank(convertObject.format)) {
                options.format = convertObject.format;
            }
            convertRender = (val: any) => (val ? convertToLocalDate(val, options) : '-');
            break;
        case 'dateTime':
            if (!isBlank(convertObject.timezone)) {
                options.timezone = convertObject.timezone;
            }
            if (!isBlank(convertObject.format)) {
                options.format = convertObject.format;
            }
            convertRender = (val: any) => (val ? convertToLocalDate(val, options) : '-');
            break;
        case 'number':
            convertRender = (val: any) => formatNumber(val) || '-';
            break;
        case 'string':
            convertRender = (val: any) => formatString(val) || '-';
            break;
        default:
            convertRender = (val: any) => val || '-';
    }
    return convertRender;
}

/**
 * @description 将TableColumn的props转变为AntdTable的Column属性
 * @param {TableColumnProps} column - TableColumn props.
 */
function convertColumnProps(column: TableColumnProps<any>) {
    const { convert } = column;
    const convertRender = convertToRender(convert);
    return {
        ...pick(column, ['key', 'align', 'colSpan', 'width', 'className', 'group']),
        title: column.label,
        dataIndex: column.key,
        render: convertRender || column.render || (val => val || '-'),
        sorter: column.sort,
        defaultSortOrder: column.defaultSort,
    };
}

/**
 * @description 将TableColumnAction转变成antd Table.Column
 * @param {TableActionProps<any>[]} actions - Row actions.
 * @param {any} record - Row record.
 * @param {number} index - Record index.
 */
function convertColumnAction(
    actions: TableActionProps<any>[],
    actionMenus: TableActionMenuProps[],
    record: any,
    index: number
) {
    const actMenus = actionMenus.map((i, index) => {
        const { children } = i;
        const actMenus = [];
        React.Children.map(children, child => {
            const { type, props } = child;
            if (type === TableAction) {
                // Handle `visible`
                const visible = exec(props.visible, record, index);
                if (!isBlank(visible) && !visible) return null;
                actMenus.push(props);
            }
        });
        if (!actMenus.length) return null;
        const actionMenu = (
            <Menu>
                {actMenus.map(act => {
                    // Handle `disabled`
                    const disabled = exec(act.disabled, record, index);
                    const isDisabled = isBoolean(disabled)
                        ? disabled
                        : disabled && disabled.disabled;
                    // Handle color
                    const style: any = {};
                    if (act.color) style.color = act.color;
                    return (
                        <Menu.Item disabled={isDisabled} key={act.label}>
                            <Tooltip title={disabled && disabled.tooltipMsg}>
                                {act.icon ? (
                                    <span style={{ marginRight: 8, ...style }}>{act.icon}</span>
                                ) : null}
                                <span style={style}>{act.label}</span>
                            </Tooltip>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
        const { label, trigger } = i;
        return (
            <Fragment key={i.label}>
                <Dropdown overlay={actionMenu} trigger={[trigger || 'hover']}>
                    <a>
                        {label}
                        <Icon type="down" />
                    </a>
                </Dropdown>
                {actionMenus.length === index + 1 ? null : <Divider type="vertical" />}
            </Fragment>
        );
    });
    return actions
        .map((action, i) => {
            // Handle `disabled` props
            const disabled: Disabled = exec(action.disabled, record, index);
            const { tooltipMsg = '' } = disabled || {};
            // Handle `visible` props
            const visible: boolean = exec(action.visible, record, index);
            if (!isBlank(action.visible) && !visible) return null;
            // Handle `color` props
            const style: any = {};
            if (action.color) {
                style.color = action.color;
            }
            return (
                <Fragment key={action.label}>
                    <Tooltip title={tooltipMsg}>
                        <span key={action.label}>
                            <a
                                onClick={() => exec(action.onClick, record, index)}
                                disabled={disabled}
                                style={style}
                            >
                                {action.label}
                            </a>
                        </span>
                    </Tooltip>
                    {actions.length === i + 1 && !actionMenus.length ? null : (
                        <Divider type="vertical" />
                    )}
                </Fragment>
            );
        })
        .concat(actMenus);
}

/**
 * @description 计算action column的宽度
 * @param {TableActionProps<any>[]} actions - Row actions.
 */
function calcColumnActionWidth(
    actions: TableActionProps<any>[],
    actionMenus: TableActionMenuProps[]
): number {
    // const hasCollapse = !!actions.filter(act => act.collapse).length;
    const strLength = actions
        // .filter(act => !act.collapse)
        .map(act => act.label)
        .concat(actionMenus.map(act => `${act.label}D`))
        .join('');
    const width = strLength.length * 14 + (actions.length + actionMenus.length - 1) * 17 + 36;
    return width;
}

function getPagination(pagination: TablePaginationProps | undefined) {
    if (!pagination) return false;
    const { pageSize, pageSizeOptions, render } = pagination;
    return {
        pageSize,
        pageSizeOptions,
        showSizeChanger: pageSizeOptions ? true : false,
        showTotal: render,
        total: 0,
    };
}

class Table extends Component<TableProps, TableState<any>> {
    static handleRequestData(
        props: TableProps,
        currentPage: number,
        pageSize: number,
        filters: TableFilters[],
        sorters: TableSorters[],
        selectedRows: any[]
    ): Promise<TableRequestData<any>> {
        const { data } = props;
        return new Promise(resolve => {
            resolve({
                data,
                currentPage,
                pageSize,
                filters,
                sorters,
                selectedRows,
            });
        });
    }

    constructor(props) {
        super(props);
        const { refs, children } = props;
        const fn = {
            loadData: this.loadData.bind(this),
            getData: this.getData.bind(this),
            setData: this.setData.bind(this),
        };
        exec(refs, fn);
        const head = getTableComponentProps(children, TableHead, true);
        const columns = getTableComponentProps(children, TableCloumn);
        const defaultSortColumn = find(columns, col => col.sort && col.defaultSort);
        const pagination = getTableComponentProps(children, TablePagination, true);
        const paginationSetting = getPagination(pagination);
        if (defaultSortColumn) {
            this.state.sorters.push({
                key: defaultSortColumn.key,
                value: defaultSortColumn.defaultSort,
            });
        }
        if (head && head.children) {
            const filter = getTableComponentProps(head.children, TableFilter, true);
            if (filter) {
                const childProps = Array.isArray(filter.children)
                    ? filter.children[0].props
                    : filter.children.props;
                const childKey = Array.isArray(filter.children)
                    ? filter.children[0].key
                    : filter.children.key;
                this.state.currentFilter = {
                    ...childProps,
                    key: childKey,
                };
            }
        }
        if (paginationSetting) {
            const { pageSize } = paginationSetting;
            this.state.pageSize = pageSize;
        }
    }

    state: TableState<any> = {
        currentPage: 1,
        pageSize: 10,
        data: [],
        total: 0,
        filters: [],
        sorters: [],
        selectedRows: [],
        loading: false,
        currentFilter: {},
        currentFilterValue: undefined,
    };

    componentDidMount() {
        this.loadData();
    }

    renderHead(head: any) {
        const { children } = head;
        const headItems = [];
        React.Children.map(children, child => {
            const { type, props } = child;
            if (type === TableActionMenu) headItems.push(this.renderActionMenu(props));
            if (type === TableAction) headItems.push(this.renderAction(props));
            if (type === TableFilter) headItems.push(this.renderFilter(props));
        });
        return headItems;
    }

    renderAction(action: TableActionProps<any>) {
        const { data, selectedRows, loading } = this.state;
        // Handle `visible`
        const visible = exec(action.visible, selectedRows, data);
        if (!isBlank(visible) && !visible) return null;
        // Handle `disabled`
        const disabled = exec(action.disabled, selectedRows, data);
        const isDisabled = isBoolean(disabled) ? disabled : disabled && disabled.disabled;
        // Handle `float`
        const style: any = { width: 'auto' };
        if (action.float && action.float === 'right') {
            style.marginLeft = 10;
            style.float = 'right';
        } else {
            style.marginRight = 10;
        }
        return (
            <Col span={1} style={style} key={action.label}>
                <Tooltip title={disabled && disabled.tooltipMsg}>
                    <Button
                        onClick={() => exec(action.onClick, selectedRows, data)}
                        type={action.type}
                        disabled={isDisabled || loading}
                    >
                        <span>{action.label}</span>
                    </Button>
                </Tooltip>
            </Col>
        );
    }

    renderActionMenu(actionMenu: TableActionMenuProps) {
        const menuActions = [];
        const { children } = actionMenu;
        const { selectedRows, data, loading } = this.state;
        React.Children.map(children, child => {
            const { type, props } = child;
            if (type === TableAction) {
                // Handle `visible`
                const visible = exec(props.visible, selectedRows, data);
                if (!isBlank(visible) && !visible) return null;
                menuActions.push(props);
            }
        });
        if (!menuActions.length) return null;
        const actionMenus = (
            <Menu>
                {menuActions.map(act => {
                    // Handle `disabled`
                    const disabled = exec(act.disabled, selectedRows, data);
                    const isDisabled = isBoolean(disabled)
                        ? disabled
                        : disabled && disabled.disabled;
                    // Handle color
                    const style: any = {};
                    if (act.color) style.color = act.color;
                    return (
                        <Menu.Item disabled={isDisabled} key={act.label}>
                            <Tooltip title={disabled && disabled.tooltipMsg}>
                                {act.icon ? (
                                    <span style={{ marginRight: 8, ...style }}>{act.icon}</span>
                                ) : null}
                                <span style={style}>{act.label}</span>
                            </Tooltip>
                        </Menu.Item>
                    );
                })}
            </Menu>
        );
        const { label, trigger } = actionMenu;
        // Handle `float`
        const style: any = { width: 'auto' };
        if (actionMenu.float && actionMenu.float === 'right') {
            style.marginLeft = 10;
            style.float = 'right';
        } else {
            style.marginRight = 10;
        }
        return (
            <Col span={1} style={style} key={actionMenu.label}>
                <Dropdown overlay={actionMenus} trigger={[trigger || 'hover']} disabled={loading}>
                    <Button>
                        {label}
                        <Icon type="down" />
                    </Button>
                </Dropdown>
            </Col>
        );
    }

    renderFilter(filter: TableFilterProps) {
        const { children } = filter;
        const filterItems: TableFilterItemProps[] = [];
        const { currentFilter, currentFilterValue, loading } = this.state;
        React.Children.map(children, child => {
            const { type, props, key } = child;
            if (type === TableFilterItem) filterItems.push({ ...props, key });
        });
        const { Option } = Select;
        const selectFilter = (
            <Select
                dropdownMatchSelectWidth={false}
                value={currentFilter.key}
                onChange={val => {
                    const nextFilter = find(filterItems, i => i.key === val);
                    this.setState({ currentFilter: nextFilter, currentFilterValue: undefined });
                }}
                disabled={loading}
            >
                {filterItems.map(item => (
                    <Option value={item.key} key={item.key}>
                        {item.label}
                    </Option>
                ))}
            </Select>
        );
        let filterInput: ReactNode;
        const filterProps = {
            style: { width: 220 },
            value: currentFilterValue,
            disabled: loading,
        };
        const handleFilterChange = (format: Function = val => val) => {
            return val => this.setState({ currentFilterValue: format(val) });
        };
        const handleSearch = () => {
            const {
                filters,
                currentFilter: { key, label, type, render },
            } = this.state;
            const currentFilterItem = find(filters, f => f.key === key);
            if (
                !currentFilterValue ||
                (isArray(currentFilterValue) && !currentFilterValue.length)
            ) {
                return;
            }
            if (!currentFilterItem) {
                filters.push({
                    label: label,
                    key: key,
                    value: currentFilterValue,
                    type: type,
                    render: render,
                });
            } else {
                currentFilterItem.value = currentFilterValue;
            }
            this.setState(
                {
                    filters,
                    currentFilterValue: undefined,
                },
                () => this.loadData()
            );
        };
        switch (currentFilter.type) {
            case 'date':
            case 'dateTime':
                filterInput = (
                    <RangePicker
                        {...currentFilter}
                        {...filterProps}
                        showTime={currentFilter.type === 'dateTime'}
                        style={{ width: 320 }}
                        onChange={handleFilterChange()}
                    />
                );
                break;
            case 'enum':
                filterInput = (
                    <Select
                        {...currentFilter}
                        {...filterProps}
                        style={{ width: 200 }}
                        notFoundContent="暂无数据"
                        onChange={handleFilterChange()}
                    >
                        {currentFilter.options.map(opt => (
                            <Select.Option value={opt.value} key={opt.value}>
                                {opt.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
                break;
            default:
                filterInput = (
                    <Input
                        {...currentFilter}
                        {...filterProps}
                        onPressEnter={handleSearch}
                        onChange={handleFilterChange(e => e.target.value)}
                    />
                );
        }
        return (
            <Fragment key={currentFilter.label}>
                <Col span={1} style={{ marginRight: 8, width: 'auto' }}>
                    {selectFilter}
                </Col>
                <Col span={1} style={{ width: 'auto' }}>
                    <Input.Group compact>
                        {filterInput}
                        <Button
                            icon="search"
                            type="primary"
                            onClick={handleSearch}
                            disabled={loading}
                        />
                    </Input.Group>
                </Col>
            </Fragment>
        );
    }

    renderFilterTags() {
        const { filters, currentFilter } = this.state;
        const handleFilterClose = (key: string, index: number) => {
            const { filters } = this.state;
            filters.splice(index, 1);
            this.setState({ filters }, this.loadData);
        };
        return filters.map((filter, index) => {
            const { render } = filter;
            let convert: Function;
            switch (filter.type) {
                case 'date':
                case 'dateTime':
                    convert =
                        render ||
                        (value => {
                            const startTime = value[0].format(
                                currentFilter.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                            );
                            const endTime = value[1].format(
                                currentFilter.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'
                            );
                            return `${startTime}~${endTime}`;
                        });
                    break;
                default:
                    convert = render || (val => val);
            }
            return (
                <Tag
                    color="#108ee9"
                    key={filter.key}
                    closable
                    onClose={() => handleFilterClose(filter.key, index)}
                >
                    {filter.label}: {exec(convert, filter.value)}
                </Tag>
            );
        });
    }

    getTableRowSelection(rowSelection: TableRowSelectionProps<any>): any {
        if (!rowSelection) return false;
        const { rowKey = 'id' } = this.props;
        const { selectedRows } = this.state;
        const { type, fixed, width, disabled } = rowSelection;
        const getCheckboxProps = (record: any) => {
            return { disabled: exec(disabled, record) };
        };
        const rowSelectionSetting: any = {
            type,
            fixed,
            columnWidth: width,
            getCheckboxProps,
            selectedRowKeys: selectedRows.map(i => i[rowKey]),
            onChange: (_, selectedRows) => this.setState({ selectedRows: selectedRows }),
        };
        return rowSelectionSetting;
    }

    getData(): TableState<any> {
        return pick(this.state, [
            'currentPage',
            'pageSize',
            'data',
            'filters',
            'sorters',
            'selectedRows',
            'total',
        ]);
    }

    setData(options: TableState<any>) {
        this.setState(
            pick(options, [
                'currentPage',
                'pageSize',
                'data',
                'filters',
                'sorters',
                'selectedRows',
                'loading',
                'total',
            ])
        );
    }

    loadData(loading: boolean = true) {
        this.setState({ loading }, async () => {
            const {
                currentPage,
                pageSize,
                filters,
                sorters,
                selectedRows,
                data,
                total,
            } = this.state;
            const result = await Table.handleRequestData(
                this.props,
                currentPage,
                pageSize,
                filters,
                sorters,
                selectedRows
            );
            const nextState: TableState<any> = {
                currentPage: result.currentPage || currentPage,
                pageSize: result.pageSize || pageSize,
                filters: result.filters || filters,
                sorters: result.sorters || sorters,
                selectedRows: result.selectedRows || selectedRows,
                data: result.data || data,
                loading: false,
                total: result.total || total,
            };
            this.setState({ ...nextState });
        });
    }

    handleTableChange(pagination, filters, sorter) {
        const { current, pageSize } = pagination;
        const sorts = [];
        if (sorter && !isEmpty(sorter)) {
            const { columnKey, order } = sorter;
            sorts.push({ key: columnKey, value: order });
        }

        this.setState(
            {
                sorters: sorts,
                currentPage: current,
                pageSize,
            },
            this.loadData.bind(this)
        );
    }

    render() {
        const { children, rowKey } = this.props;
        const columnGroups = [];
        const { data, loading, filters, total, pageSize } = this.state;
        // TODO: optimise
        const columns = getTableComponentProps(children, TableCloumn);
        const columnActions = getTableComponentProps(children, TableAction);
        const columnActionMenu = getTableComponentProps(children, TableActionMenu);
        const head = getTableComponentProps(children, TableHead, true);
        const pagination = getTableComponentProps(children, TablePagination, true);
        const paginationSetting = getPagination(pagination);
        if (paginationSetting) {
            paginationSetting.total = total;
            paginationSetting.pageSize = pageSize;
        }
        const rowSelection = getTableComponentProps(children, TableRowSelection, true);
        return (
            <Fragment>
                {head ? <Row>{this.renderHead(head)}</Row> : null}
                <Row style={{ marginTop: 8 }}>{this.renderFilterTags()}</Row>
                {filters.length ? <p /> : null}
                <AntdTable
                    bordered
                    rowKey={rowKey || 'id'}
                    {...this.props}
                    dataSource={data}
                    loading={loading}
                    onChange={this.handleTableChange.bind(this)}
                    pagination={paginationSetting}
                    rowSelection={this.getTableRowSelection(rowSelection)}
                >
                    {columns
                        .filter(col => isBlank(col.visible) || col.visible)
                        .map(column => {
                            if (!column.group) {
                                return <Column {...convertColumnProps(column)} />;
                            }
                            if (columnGroups.indexOf(column.group) >= 0) {
                                return null;
                            }
                            columnGroups.push(column.group);
                            return (
                                <ColumnGroup title={column.group} key={column.group}>
                                    {columns
                                        .filter(col => col.group === column.group)
                                        .filter(col => isBlank(col.visible) || col.visible)
                                        .map(col => (
                                            <Column {...convertColumnProps(col)} />
                                        ))}
                                </ColumnGroup>
                            );
                        })}
                    {columnActions.length ? (
                        <Column
                            title="操作"
                            render={(_, record, index) =>
                                convertColumnAction(columnActions, columnActionMenu, record, index)
                            }
                            width={calcColumnActionWidth(columnActions, columnActionMenu)}
                        />
                    ) : null}
                </AntdTable>
            </Fragment>
        );
    }
}

export default Table;
