/**
 * Copyright (c) 2020 ZorrillosDev

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 *
 */

const DEFAULT_OFFSET_RESULT = 0;
const DEFAULT_MAX_LIMIT_RESULT = 3000;
const DEFAULT_ORDER_RESULT = 'asc';
const DEFAULT_SORT_RESULT = 'first_name';

export default {
    Query: {

        // User resolver
        User: (_, {id}, context) => {
            /***
             * Fetch user by id
             * @param id: <int>
             */
            return context.mongo
                .collection('users')
                .findOne({id: id});

        },

        // Users resolver
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
        }
    }
};
