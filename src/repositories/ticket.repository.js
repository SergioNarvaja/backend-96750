export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  create = (ticket) => this.dao.create(ticket);
}