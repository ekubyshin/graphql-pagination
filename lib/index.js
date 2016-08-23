import {
    GraphQLInt,
    GraphQLObjectType,
    GraphQLList,
    GraphQLBoolean,
    GraphQLNonNull
} from 'graphql/type'

const PageInfo = name => (new GraphQLObjectType({
    name: 'PageInfo' + name,
    fields: {
        count: {
            type: GraphQLInt
        },
        limit: {
            type: GraphQLInt,
            default: 20
        },
        page: {
            type: GraphQLInt,
            default: 0
        },
        hasNextPage: {
            type: GraphQLBoolean
        },
        hasPrevPage: {
            type: GraphQLBoolean
        }
    }
}));

export const paginationResponse = ({type, name = type.name}) => (
    new GraphQLObjectType({
        name: name + "Edge",
        fields: {
            pageInfo: {
                type: new GraphQLNonNull(PageInfo(name))
            },
            edges: {
                type: new GraphQLList(type)
            }
        }
    })
);

export const responseFromCursor = (cursor, args = {limit: 20, skip: 0}, resolver) => {
    const cursorCount = cursor.clone();
    const cursorQuery = cursor.clone();
    return new Promise((resolve, reject) => (
        cursorCount.count((err, count) => {
            if (err) {
                reject(err);
            } else {
                cursorQuery.limit(args.limit).skip(args.limit * args.page).toArray((err, edges) => {
                    if (err) {
                        reject(err);
                    }  else {
                        resolve({
                            pageInfo: {
                                count: count,
                                page: args.page,
                                limit: args.limit,
                                hasNextPage: Math.ceil(count / args.limit) - 1 > args.page,
                                hasPrevPage: args.page > 0
                            },
                            edges: typeof resolver == 'function' ? resolver(edges) : edges
                        })
                    }
                });
            }
        })
    ))
};

export const responseFromArray = (arr, args) => {
    return {
        pageInfo: {
            count: args.count,
            page: args.page,
            limit: args.limit,
            hasNextPage: Math.ceil(args.count / args.limit) - 1 > args.page,
            hasPrevPage: args.page > 0
        },
        edges: arr
    }
};

export const paginationArgs = {
    page: {
        type: GraphQLInt,
        defaultValue: 0
    },
    limit: {
        type: GraphQLInt,
        defaultValue: 20
    }
};
