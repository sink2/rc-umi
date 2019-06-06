import React, { Component } from 'react';
import { Spin } from 'antd';

const RcLoading = (options: any = {}) => {
    return WrappedComponent => {
        class RcLoadingHelper extends Component {
            state = {
                loading: false,
            };

            loading(...args) {
                this.setState({
                    loading: true,
                });
                Promise.all(args).then(() => {
                    this.setState({
                        loading: false,
                    });
                });
            }

            render() {
                const { loading } = this.state;
                const rcLoading = {
                    loading: this.loading.bind(this),
                };
                return (
                    <Spin spinning={loading}>
                        <WrappedComponent {...this.props} rcLoading={rcLoading} />
                    </Spin>
                );
            }
        }
        return RcLoadingHelper;
    };
};

export default RcLoading;
