import { TicketModel } from "../models/ticket.model.js";

export default class TicketDAO {
  create = (ticket) => TicketModel.create(ticket);
}