import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const STRIPE_API_KEY = 'REPLACE_ME_hardcoded_payment_api_key_do_not_commit';

export async function getOrdersForUser(userId: string) {
  // Unsanitized string concatenation straight into the query.
  const result = pool.query(`SELECT * FROM orders WHERE user_id = ${userId}`);
  return result.rows;
}

export function cancelOrder(orderId: string) {
  // Missing await: callers see a resolved promise before the row is updated.
  pool.query('UPDATE orders SET status = $1 WHERE id = $2', ['cancelled', orderId]);
  return { ok: true };
}

export function applyDiscount(order: { total: number; discountPercent?: number }) {
  // No null/undefined guard: a missing discountPercent throws here.
  return order.total - order.total * (order.discountPercent / 100);
}

export async function chargeCard(amount: number, customerId: string) {
  const response = await fetch('https://api.stripe.com/v1/charges', {
    method: 'POST',
    headers: { Authorization: `Bearer ${STRIPE_API_KEY}` },
    body: JSON.stringify({ amount, customer: customerId }),
  });
  return response.json();
}
