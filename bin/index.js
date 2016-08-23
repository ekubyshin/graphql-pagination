'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.paginationArgs = exports.responseFromArray = exports.responseFromCursor = exports.paginationResponse = undefined;

var _type = require('graphql/type');

var PageInfo = function PageInfo(name) {
    return new _type.GraphQLObjectType({
        name: 'PageInfo' + name,
        fields: {
            count: {
                type: _type.GraphQLInt
            },
            limit: {
                type: _type.GraphQLInt,
                default: 20
            },
            page: {
                type: _type.GraphQLInt,
                default: 0
            },
            hasNextPage: {
                type: _type.GraphQLBoolean
            },
            hasPrevPage: {
                type: _type.GraphQLBoolean
            }
        }
    });
};

var paginationResponse = exports.paginationResponse = function paginationResponse(_ref) {
    var type = _ref.type;
    var _ref$name = _ref.name;
    var name = _ref$name === undefined ? type.name : _ref$name;
    return new _type.GraphQLObjectType({
        name: name + "Edge",
        fields: {
            pageInfo: {
                type: new _type.GraphQLNonNull(PageInfo(name))
            },
            edges: {
                type: new _type.GraphQLList(type)
            }
        }
    });
};

var responseFromCursor = exports.responseFromCursor = function responseFromCursor(cursor) {
    var args = arguments.length <= 1 || arguments[1] === undefined ? { limit: 20, skip: 0 } : arguments[1];
    var resolver = arguments[2];

    var cursorCount = cursor.clone();
    var cursorQuery = cursor.clone();
    return new Promise(function (resolve, reject) {
        return cursorCount.count(function (err, count) {
            if (err) {
                reject(err);
            } else {
                cursorQuery.limit(args.limit).skip(args.limit * args.page).toArray(function (err, edges) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            pageInfo: {
                                count: count,
                                page: args.page,
                                limit: args.limit,
                                hasNextPage: Math.ceil(count / args.limit) - 1 > args.page,
                                hasPrevPage: args.page > 0
                            },
                            edges: typeof resolver == 'function' ? resolver(edges) : edges
                        });
                    }
                });
            }
        });
    });
};

var responseFromArray = exports.responseFromArray = function responseFromArray(arr, args) {
    return {
        pageInfo: {
            count: args.count,
            page: args.page,
            limit: args.limit,
            hasNextPage: Math.ceil(args.count / args.limit) - 1 > args.page,
            hasPrevPage: args.page > 0
        },
        edges: arr
    };
};

var paginationArgs = exports.paginationArgs = {
    page: {
        type: _type.GraphQLInt,
        defaultValue: 0
    },
    limit: {
        type: _type.GraphQLInt,
        defaultValue: 20
    }
};
