import {mapToToastrMessage} from './utils.js';
import EventEmitter from 'eventemitter3';
const emitter = new EventEmitter();

export const EE = emitter;
export const toastrEmitter = {
  message: (...args) => addToToastr('message', args),
  info: (...args) => addToToastr('info', args),
  success: (...args) => addToToastr('success', args),
  warning: (...args) => addToToastr('warning', args),
  error: (...args) => addToToastr('error', args),
  clean: () => emitter.emit('clean/toastr'),
  confirm: (...args) => {
    emitter.emit('toastr/confirm', {
      message: args[0].toString(),
      options: args[1]
    });
  }
};

function addToToastr(type, array) {
  emitter.emit('add/toastr', mapToToastrMessage(type, array));
}
