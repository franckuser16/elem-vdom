import * as Utils from '../utils';
import * as Elem from '../main';
import ErrorStackParser from 'error-stack-parser';
import _ from '../lodash';

export const RedboxStyle = Utils.stylesheet({

  redbox: {
    boxSizing: 'border-box',
    fontFamily: 'sans-serif',
    fontSize: '1em',
    position: 'fixed',
    padding: '10px',
    top: '0',
    bottom: '0',
    width: '100%',
    background: 'rgb(204, 0, 0)',
    color: 'white'
  },

  message: {
    fontWeight: 'bold'
  },

  stack: {
    fontFamily: 'monospace',
    marginTop: '2em'
  },

  stackframe: {
    marginTop: '1em'
  },

  stackframeFile: {
    fontSize: '0.8em',
    color: 'rgba(255, 255, 255, 0.7)'
  },

  stackframeFileLink: {
    textDecoration: 'none',
    color: 'rgba(255, 255, 255, 0.7)'
  }
});

export function Redbox(error) {
  const frames = ErrorStackParser.parse(error).map(f => {
    const link = `${f.fileName}#${f.lineNumber}:${f.columnNumber}`;
    return Elem.el('div', { style: RedboxStyle.stackframe }, [
      Elem.el('div', f.functionName || '<anonymous function>'),
      Elem.el('div', { style: RedboxStyle.stackframeFile }, [
        Elem.el('a', { href: link, style: RedboxStyle.stackframeFileLink }, link)
      ])
    ]);
  });
  return Elem.el('div', { style: RedboxStyle.redbox }, [
    Elem.el('div', { style: RedboxStyle.message }, `${error.name}: ${error.message}`),
    Elem.el('div', { style: RedboxStyle.stack }, frames)
  ]);
}

export function ErrorMonitor(wrapped) {
  if (!_.isFunction(wrapped)) {
    throw new Error('ErrorMonitor should only wrap functions');
  }
  return (ctx) => {
    try {
      return wrapped(ctx);
    } catch(e) {
      return Redbox(e);
    }
  };
}
