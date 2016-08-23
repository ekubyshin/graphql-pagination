'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function resolveAuthorizationHeader(header) {
    if (!header || !header.authorization) {
        return;
    }

    var parts = header.authorization.split(' ');

    if (parts.length === 2) {
        var _parts = _slicedToArray(parts, 2);

        var scheme = _parts[0];
        var credentials = _parts[1];


        if (/^Bearer$/i.test(scheme)) {
            return credentials;
        }
    } else {
        return false;
    }
}

exports.default = function (securityToken) {
    var throw403 = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (!securityToken || typeof securityToken !== 'string') {
        throw new Error('Provide security token');
    }
    return function () {
        var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
            var token, userData;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            ctx.state = ctx.state || {};
                            token = resolveAuthorizationHeader(ctx.headers);

                            if (token) {
                                _context.next = 11;
                                break;
                            }

                            if (!throw403) {
                                _context.next = 7;
                                break;
                            }

                            ctx.throw(403);
                            _context.next = 9;
                            break;

                        case 7:
                            _context.next = 9;
                            return next();

                        case 9:
                            _context.next = 25;
                            break;

                        case 11:
                            userData = function () {
                                try {
                                    return _jsonwebtoken2.default.verify(token, securityToken);
                                } catch (e) {
                                    return null;
                                }
                            }();

                            if (!userData) {
                                _context.next = 19;
                                break;
                            }

                            ctx.state = ctx.state || {};
                            ctx.state.user = userData;
                            _context.next = 17;
                            return next();

                        case 17:
                            _context.next = 25;
                            break;

                        case 19:
                            if (!throw403) {
                                _context.next = 23;
                                break;
                            }

                            ctx.throw(403);
                            _context.next = 25;
                            break;

                        case 23:
                            _context.next = 25;
                            return next();

                        case 25:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x2, _x3) {
            return _ref.apply(this, arguments);
        };
    }();
};
