import React, {Component, PropTypes} from 'react';
import {connect}            from 'react-redux';
import classnames           from 'classnames';

import ToastrBox            from './ToastrBox';
import ToastrConfirm        from './ToastrConfirm';
import * as tActions        from './actions';
import {EE}                 from './toastrEmitter';
import config               from './config';

@connect(state => ({
  toastr: state.toastr
}), tActions)
export default class ReduxToastr extends Component {
  static displayName = 'ReduxToastr';

  static propTypes = {
    toastr: PropTypes.object,
    options: PropTypes.object,
    position: PropTypes.string,
    newestOnTop: PropTypes.bool,
    timeOut: PropTypes.number,
    confirmOptions: PropTypes.object
  };

  static defaultProps = {
    position: 'top-right',
    newestOnTop: true,
    timeOut: 5000,
    confirmOptions: {
      okText: 'ok',
      cancelText: 'cancel'
    }
  };

  constructor(props) {
    super(props);
    config.set('timeOut', this.props.timeOut);
    config.set('newestOnTop', this.props.newestOnTop);
  }

  componentDidMount() {
    const {addToastrAction, showConfirm, clean} = this.props;
    EE.on('toastr/confirm', showConfirm);
    EE.on('add/toastr', addToastrAction);
    EE.on('clean/toastr', clean);
  }

  componentWillUnmount() {
    EE.removeListener('toastr/confirm');
    EE.removeListener('add/toastr');
    EE.removeListener('clean/toastr');
  }

  render() {
    const classes = classnames('redux-toastr', this.props.position);
    const {confirm, toastrs} = this.props.toastr;

    return (
      <div className={classes}>
        <ToastrConfirm confirm={confirm} {...this.props}/>
        {toastrs.map(item => <ToastrBox key={item.id} item={item}  {...this.props}/>)}
      </div>
    );
  }
}
