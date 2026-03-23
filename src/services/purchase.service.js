import { v4 as uuidv4 } from "uuid";

export default class PurchaseService {
  constructor(cartRepository, productRepository, ticketRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.ticketRepository = ticketRepository;
  }

  async purchase(cartId, userEmail) {

    const cart = await this.cartRepository.getById(cartId);

    if (!cart) throw new Error("Carrito no encontrado");

    let totalAmount = 0;
    const productsPurchased = [];
    const productsNotPurchased = [];

    for (const item of cart.products) {
      const product = await this.productRepository.getById(item.product._id);

      if (product.stock >= item.quantity) {
        // ✅ hay stock → comprar
        product.stock -= item.quantity;
        await this.productRepository.update(product._id, product);

        totalAmount += product.price * item.quantity;

        productsPurchased.push(item);
      } else {
        // ❌ no hay stock
        productsNotPurchased.push(item);
      }
    }

    let ticket = null;

    if (productsPurchased.length > 0) {
      ticket = await this.ticketRepository.create({
        code: uuidv4(),
        amount: totalAmount,
        purchaser: userEmail
      });
    }

    cart.products = productsNotPurchased;
    await this.cartRepository.update(cart._id, cart);

    return {
      ticket,
      productsNotPurchased
    };
  }
}