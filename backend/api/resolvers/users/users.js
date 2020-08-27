const DEFAULT_OFFSET_RESULT = 0;
const DEFAULT_MAX_LIMIT_RESULT = 3000;
const DEFAULT_ORDER_RESULT = 'asc';
const DEFAULT_SORT_RESULT = 'first_name';

export default {
    Query: {

        //User resolver
        user: async (_, {id}, context) => {
            /***
             * Fetch user by id
             * @param id: <int>
             */
            return await context.mongo
                .collection('users')
                .findOne({id: id});

        },
        //Users resolver
        Users: async (_, {filter, by}, context) => {
            /***
             * Fetch filtered movies
             * @param limit: <int>
             * @param offset: <int>
             * @param sort_by: <string>
             * @param order: <string>
             */
                //Get movies
            let movies = await context.mongo
                    .collection('users')
                    .find(by || {});


            //Default filtering
            let limit = filter && filter.limit || DEFAULT_MAX_LIMIT_RESULT;
            let offset = filter && filter.offset || DEFAULT_OFFSET_RESULT;
            let sort_by = filter && filter.sort_by || DEFAULT_SORT_RESULT;
            let order = filter && filter.order || DEFAULT_ORDER_RESULT;


            //Pagination
            let _limit = limit > DEFAULT_MAX_LIMIT_RESULT && DEFAULT_MAX_LIMIT_RESULT || limit;
            let _offset = (offset > 0 ? ((offset - 1) * limit) : 0);

            //Filtering
            movies = movies.skip(_offset);
            movies = movies.limit(_limit);
            movies = movies.sort({[sort_by]: (order === 'asc' && 1 || -1)});

            return movies.toArray()
        },
        hello: () => 'Hello World2!'
    }
};
