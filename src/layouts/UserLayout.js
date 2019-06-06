import React, { Fragment } from 'react';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
import { GlobalFooter } from 'ant-design-pro';
import SelectLang from '@/components/SelectLang';
import { connect } from 'dva';
import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
    render() {
        const { children } = this.props;
        const { oem } = this.props;
        const copyright = (
            <Fragment>
                Copyright <Icon type="copyright" />
                {new Date().getFullYear()} {oem}
            </Fragment>
        );
        return (
            <DocumentTitle title={`登录 - ${oem}`}>
                <div className={styles.container}>
                    <div className={styles.lang}>
                        <SelectLang />
                    </div>
                    <div className={styles.content}>
                        <div className={styles.top}>
                            <div className={styles.header} />
                        </div>
                        {children}
                    </div>
                    <GlobalFooter links={[]} copyright={copyright} />
                </div>
            </DocumentTitle>
        );
    }
}

export default connect(({ setting }) => ({
    ...setting,
}))(UserLayout);
