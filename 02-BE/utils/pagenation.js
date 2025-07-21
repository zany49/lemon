/**
 * Common pagination utility using TypeORM repositories
 * @param {Repository} repo - TypeORM repository
 * @param {Object} options - Options object
 * @param {number} options.page - Current page number
 * @param {number} options.limit - Number of items per page
 * @param {Object} options.where - Optional where clause
 * @param {Object} options.relations - Optional relations
 * @param {Object} options.order - Optional ordering
 */
export const paginate = async (repo, { page = 1, limit = 10, where = {}, relations = [], order = {} }) => {
    const skip = (page - 1) * limit;
  
    // const [data, total] = await repo.findAndCount({
    //   where,
    //   relations,
    //   skip,
    //   take: limit,
    //   order,
    // });
  
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };
  
  // module.exports = { paginate };