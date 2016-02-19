import CSSCore from 'fbjs/lib/CSSCore';
import React, {Component, PropTypes, dangerouslySetInnerHTML} from 'react'; //  eslint-disable-line no-unused-vars
import classnames from 'classnames';

import {onCSSTransitionEnd} from './utils';
import config from './config';

export default class ToastrBox extends Component {
  static displayName = 'ToastrBox';

  static propTypes = {
    item: PropTypes.object.isRequired,
    remove: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.isHiding = false;
    this.intervalId = null;
    this.transitionIn = 'bounceIn';
    this.transitionOut = 'bounceOut';
  }

  componentDidMount() {
    const {item} = this.props;
    const timeOut = config.timeOut;
    const time = item.options.timeOut || timeOut;

    this._setIntervalId(setTimeout(this._removeToastr, time));
    this._setTransition();
    onCSSTransitionEnd(this.toastrBox, this._onAnimationComplite);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  handleRemoveItem = () => {
    this._removeToastr();
  };

  mouseEnter = () => {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this._setIntervalId(null);
      if (this.isHiding) {
        this._setIsHiding(false);
      }
    }
  };

  mouseLeave = () => {
    if (!this.isHiding) {
      this._setIntervalId(setTimeout(this._removeToastr, 1000));
    }
  };

  _onAnimationComplite = () => {
    const {remove, item} = this.props;
    const {onHideComplete, onShowComplete} = item.options;

    if (this.isHiding) {
      this._setIsHiding(false);
      remove(item.id);
      if (onHideComplete) {
        onHideComplete();
      }
    } else if (!this.isHiding && onShowComplete) {
      onShowComplete();
    }
  };

  _removeToastr = () => {
    if (!this.isHiding) {
      this._setIsHiding(true);
      this._setTransition(true);
      onCSSTransitionEnd(this.toastrBox, this._onAnimationComplite);
    }
  };

  _setTransition = (hide) => {
    const node = this.toastrBox;
    const animationType = hide ? this.transitionOut : this.transitionIn;

    const onEndListener = (e) => {
      if (e && e.target == node) {
        CSSCore.removeClass(node, animationType);
      }
    };

    onCSSTransitionEnd(this.toastrBox, onEndListener);
    CSSCore.addClass(node, animationType);
  };

  _clearTransition = () => {
    const node = this.toastrBox;
    CSSCore.removeClass(node, this.transitionIn);
    CSSCore.removeClass(node, this.transitionOut);
  };

  _setIntervalId = (intervalId) => {
    this.intervalId = intervalId;
  };

  _setIsHiding = (val) => {
    this.isHiding = val;
  };

  render() {
    const {options, type, message, title} = this.props.item;
    const classes = classnames('toastr', 'animated', options.icon, type);
    return (
      <div
        className={classes}
        onMouseEnter={() => this.mouseEnter()}
        onMouseLeave={() => this.mouseLeave()}
        onClick={() => this.handleRemoveItem()}
        ref={(ref) => this.toastrBox = ref}>
        <div className="message-holder">
          {title && <div className="title">{title}</div>}
          <div className="message">{message}</div>
        </div>
      </div>
    );
  }
}
