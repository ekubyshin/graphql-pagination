# graphql-pagination
GraphQLObjectType fabric to provide ability make pagination response.

Use with mongodb only.

Doesn't support Relay response schema.

#Response schema

	{
		pageInfo: {
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
        },
        edges: {
        	type: GraphQLCustomUserType
        }
	}

#API
	paginationResponse - return new GraphQLObjectType response
	responseFromCursor - take mongodb cursor, get count of quering objects and does a query
	paginationArgs - limit, page
	responseFromArray - create pagination response from array of models. You must provide a total count of models in collection

#Usage:

    import {
    	paginationResponse,
    	responseFromCursor, 
    	paginationArgs
	} from 'graphql-pagination'
	import {
		GraphQLSchema,
		GraphQLObjectType
	} from 'graphql/type'

    //Create GraphqGL Query and use in GraphQL Schema
    const paginatedQueryFromCursor = {
    	name: 'PaginatedQueryFromCursor',
    	type: paginationResponse({type: GraphQLObjectType, name: 'YourCustomName'}),
    	args: {
    		//your arguments
	        ...paginationArgs
	    },
	    resolve: async (_, args, context)  => {
	        //write your action
	        return await responseFromCursor(db.collection('some_collection').find(query), args);
	    }
	});

	const paginatedQueryFromArray = {
    	name: 'PaginatedQueryFromArray',
    	type: paginationResponse({type: GraphQLObjectType, name: 'YourCustomName'}),
    	args: {
    		//your arguments
	        ...paginationArgs
	    },
	    resolve: async (_, args, context)  => {
	        //write your action
	        const count = await db.collection('some_collection').find(query).count();
	        const results = await db.collection('some_collection')
	        					.find(query)
        						.limit(args.limit)
        						.take(args.page * args.limit)
        						.toArray();
	        return responseFromCursor(results, {...args, count});
	    }
	});

	const schema = new GraphQLSchema({
		query: new GraphQLObjectType({
				name: 'RootQuery',
				fields: {
					paginatedQueryFromCursor,
					paginatedQueryFromArray
				}
			})
	})

	//use schema in your server


      
