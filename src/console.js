require('./polyfill');

var _console = window.console;
function createElement(name) {
    return document.createElement(name);
}

function noop() {}

function parseHTML() {}

var root, group, fragment, currentFragment, currentGroup, toggleStatus, singleLogs, traceLogs, methods;

methods = ['log', 'info', 'error', 'warn', 'dir', 'count', 'group', 'groupEnd', 'time', 'timeEnd', 'trace', 'clear', 'debug'];
singleLogs = ['log', 'warn', 'debug', 'info'];
traceLogs = ['error', 'trace'];



//初始化面板
function init() {
    group = [];
    toggleStatus = false;
    fragment = document.createDocumentFragment();
    currentFragment = fragment.cloneNode(false);
    root = createElement('DIV');
    currentGroup = createElement('UL');
    group.push(currentGroup);
    root.appendChild(currentGroup);
    currentFragment.appendChild(root);
    toggle();
    document.body.appendChild(currentFragment);
}

function toggle() {
    toggleStatus = !toggleStatus;
    root.style.display = toggleStatus? 'display' : 'none';
}

//TODO: document.ready
window.onload = function() {
    init();
};

//获取行号
function getLineNo(stacks) {
    return stacks[2].match(/\((.*)\)/)[1];
}

//创建单行信息节点
function createSingleLog() {
    var log = createElement('LI'),
        type = arguments[0],
        args = Array.prototype.splice.call( arguments[1], 0, arguments[1].length),
        context = arguments[2];

    args.forEach(function(arg, i) {
        args[i] = '' + args[i];
    });

    currentFragment = fragment.cloneNode(false);
    log.innerHTML = ['[', type, ': ', new Date(), ']  '].concat(args.join(',')).concat(['  <span>', getLineNo(context), '</span>']).join('');
    currentFragment.appendChild(log);
    currentGroup.appendChild(currentFragment);
    return log;
}

//创建堆栈信息节点
function createTraceLog() {

    var parent = createSingleLog.apply(null, arguments),
        trace = createElement('UL'),
        context = arguments[2],
        content = [],
        start,
        end;

    context.slice(2, context.length).forEach(function(item) {
        start = item.indexOf('(');
        end = item.indexOf(')');
        content.push('<li>' + item.substring(0, start) + '<span>' + item.substring(start + 1, end) + '</span></li>');
    });

    trace.innerHTML = content.join('');
    parent.appendChild(trace);
    return parent;
}

function createDirLog() {

    var parent = createSingleLog.apply(null, arguments),
        dir = createElement('UL'),
        content = [];



}

var console = {
    dir: function() {},
    //Log the number of times this line has been called with the given label.
    count: function() {},
    group: function() {},
    groupEnd: function() {},
    time: function() {},
    timeEnd: function() {},
    clear: function() {}
};

function createMethod(name){

    var method;

    if(name === 'dir') {
        method = createDirLog;
    } else if(singleLogs.indexOf(name) > -1 ) {
        method = createSingleLog;
    } else if(traceLogs.indexOf(name) > -1) {
        method = createTraceLog;
    } else {
        method = noop;
    }

    return function()  {
        var context;
        try{
            a.b.c()
        }catch(e) {
            context = e.stack;
        }
        method.apply(null, [name].concat(arguments).concat([context.split('\n').map(function(item) {
            return item.trim();
        })]));
    };
}

methods.forEach(function(name) {
    console[name] = createMethod(name);
});

module.exports = console;