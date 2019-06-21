import React, { PureComponent, Fragment } from 'react';
import router from 'umi/router';

import { Radio } from 'antd';
const AntRadioGroup = Radio.Group;
const AntRadioButton = Radio.Button;

class TabMenuNav extends PureComponent {
    handleChange = e => {
        router.push(e.target.value);
    };

    render() {
        const { radioGroupDef = [] } = this.props;
        const {
            location: { pathname },
        } = window;
        const hasMatchedPath = radioGroupDef.some(i => {
            return i.path === pathname;
        });
        const defaulRadioGroupValue = hasMatchedPath ? pathname : radioGroupDef[0].path;
        return (
            <Fragment>
                <AntRadioGroup
                    defaultValue={defaulRadioGroupValue}
                    buttonStyle="solid"
                    style={{ marginBottom: 16 }}
                >
                    {radioGroupDef.map(i => {
                        return (
                            <AntRadioButton
                                key={i.path}
                                value={i.path}
                                onChange={this.handleChange}
                            >
                                {i.label}
                            </AntRadioButton>
                        );
                    })}
                </AntRadioGroup>
            </Fragment>
        );
    }
}

export default TabMenuNav;
