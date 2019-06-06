import React, { Fragment, PureComponent } from 'react';
import { Layout, Icon } from 'antd';
import { GlobalFooter } from 'ant-design-pro';
import { connect } from 'dva';

const { Footer } = Layout;
export default
@connect(({ setting }) => ({
    setting,
}))
class FooterView extends PureComponent {
    render() {
        const {
            setting: { oem },
            className,
        } = this.props;
        const date = new Date();
        return (
            <Footer className={className} style={{ padding: 0 }}>
                <GlobalFooter
                    links={[]}
                    copyright={
                        <Fragment>
                            Copyright <Icon type="copyright" />
                            {date.getFullYear()} {oem}
                        </Fragment>
                    }
                />
            </Footer>
        );
    }
}
