import React, { Component, Fragment } from 'react';
import { Modal } from 'antd';
import { RcModalOptions, RcModalState } from './interface';

const RcModal = (options: any = {}) => {
    // eslint-disable-next-line func-names
    return function(WrappedComponent) {
        class RcModalHelper extends Component<RcModalOptions, RcModalState> {
            state: RcModalState = {
                title: '',
                visible: false,
                component: null,
                width: 500,
            };

            showModal(options: RcModalOptions) {
                const { title = '', component = null, width = 500 } = options;
                this.setState({
                    visible: true,
                    title,
                    component,
                    width,
                });
            }

            closeModal() {
                this.setState({
                    visible: false,
                });
            }

            render() {
                const rcModal = {
                    closeModal: this.closeModal.bind(this),
                    showModal: this.showModal.bind(this),
                };
                const nextProps = {
                    ...this.props,
                    rcModal,
                };
                const { visible, title, component } = this.state;
                const Component = component ? component.type : <div />;
                const props = component ? component.props : {};
                const key = component ? component.key : undefined;
                return (
                    <Fragment>
                        <WrappedComponent {...nextProps} />
                        <Modal
                            title={title}
                            visible={visible}
                            footer={false}
                            destroyOnClose
                            maskClosable={false}
                            width={this.state.width}
                            onCancel={() => this.closeModal()}
                        >
                            <Component {...props} key={key} rcModal={rcModal} />
                        </Modal>
                    </Fragment>
                );
            }
        }
        return RcModalHelper;
    };
};

export default RcModal;
