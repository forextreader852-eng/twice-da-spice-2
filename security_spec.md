# Security Specification - Twice Da Spice

## Data Invariants
1. A menu item must have a positive price and a valid category.
2. An order must have at least one item and a total amount that is at least the sum of items + delivery fee.
3. Order status can only be modified by admins.
4. Menu items can only be created/updated/deleted by admins.

## The Dirty Dozen Payloads
1. **Unauthenticated Menu Write**: Attempt to create a menu item without being an admin.
2. **Shadow Menu Field**: Create a menu item with a hidden field `isAdmin: true`.
3. **Price Manipulation**: Create a menu item with a negative price.
4. **Order Without Items**: Create an order with an empty `items` array.
5. **Unauthorized Status Change**: Update an order status as a non-admin.
6. **Self-Admin Escalation**: Attempt to add a UID to `/admins/{uid}` collection.
7. **Junk ID Poisoning**: Attempt to create an order with a 1.5MB string as the document ID.
8. **Large Payload Attack**: Create an order with 10,000 items in the `items` array.
9. **PII Scraping**: Attempt to list all orders as an unauthenticated user.
10. **Order Spoofing**: Create an order with a `createdAt` timestamp from the future (client-provided).
11. **Negative Quantity**: Create an order item with -5 quantity.
12. **Menu Deletion**: Attempt to delete a menu item as an unauthenticated user.

## Test Runner (Draft)
A `firestore.rules.test.ts` would verify these payloads return `PERMISSION_DENIED`.

```typescript
// Example test cases (Logic only)
test('Unauthorized menu write should fail', async () => {
  const db = getFirestore(null); // Unauthenticated
  await assertFails(addDoc(collection(db, 'menu'), { name: 'Free Food', price: 0 }));
});

test('Order with negative price should fail', async () => {
  const db = getFirestore(null);
  await assertFails(addDoc(collection(db, 'orders'), { ..., totalAmount: -100 }));
});
```
