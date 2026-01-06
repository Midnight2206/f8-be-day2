import BasePagination from "./BasePagination.service.js";
import {countPosts, findAllPosts} from "#models/post.model.js"
export class PostPagination extends BasePagination {
    constructor({ page, limit, filter = {} }) {
    super({ page, limit });
    this.filter = filter;
  }
  buildFilter() {
    const {userId } = this.filter
    return {
      ...(userId !== undefined ? {userId} : {})
    }
  }
  async count() {
    return countPosts(this.buildFilter());
  }

  async getData() {
    return findAllPosts({
      filter: this.buildFilter(),
      limit: this.limit,
      offset: this.offset,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder
    });
  }
}