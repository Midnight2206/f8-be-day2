export default class BasePagination {
  constructor({
    page = 1,
    limit = 20,
    maxLimit = 500,
    sortBy = ["id"],
    sortOrder = ["ASC"],
  }) {
    this.page = Math.max(1, Number(page));
    this.limit = Math.min(Math.max(1, Number(limit)), maxLimit);
    this.offset = (this.page - 1) * this.limit;
    this.sortBy = Array.isArray(sortBy) ? sortBy : [sortBy];
    this.sortOrder = Array.isArray(sortOrder) ? sortOrder : [sortOrder];
    this.sortOrder = this.sortBy.map((_, index) => {
      const order = String(this.sortOrder[index] || "ASC").toUpperCase();
      return ["ASC", "DESC"].includes(order) ? order : "ASC";
    });
  }
  async count() {
    throw new Error("count() must be implemented");
  }

  async getData() {
    throw new Error("getData() must be implemented");
  }
  
  async handleRes(total, data) {
    const from = total === 0 ? 0 : this.offset + 1;
    const to = this.offset + data.length;

    return {
      data,
      pagination: {
        total,
        per_page: this.limit,
        from,
        to,
        current_page: this.page,
      },
    };
  }
  async execute() {
    const total = await this.count();
    const data = total === 0 ? [] : await this.getData();
    return this.handleRes(total, data);
  }
}
