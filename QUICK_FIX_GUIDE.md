# Quick Fix Guide - Prisma Naming Issues

## Problem
Prisma uses PascalCase for relations, frontend expects camelCase.

## Solution Pattern

### 1. In Prisma Queries - Use PascalCase
```typescript
// ❌ WRONG
include: {
  user: true,
  items: true,
  variants: true,
  addons: true
}

// ✅ CORRECT
include: {
  User: true,
  OrderItem: true,
  Variant: true,
  ItemAddon: true
}
```

### 2. In API Responses - Transform to camelCase
```typescript
import { transformOrder } from '../utils/transform';

// After Prisma query
const order = await prisma.order.findUnique({
  where: { id },
  include: { User: true, OrderItem: true }
});

// Before sending response
res.json(transformOrder(order));
```

### 3. Available Transform Functions

```typescript
// From apps/api/src/utils/transform.ts

transformItem(item)        // Item with options, addons, variants
transformCategory(category) // Category with items
transformUser(user)         // User object
transformOrder(order)       // Order with user, items, address, deliveryPartner
transformAuthResponse(token, user) // Auth response
```

## Common Mistakes to Avoid

1. **Don't use lowercase in Prisma includes**
2. **Don't include relations you're creating in the same operation**
3. **Always transform responses before sending to frontend**
4. **Check Prisma schema for exact relation names**

## Prisma Schema Reference

```prisma
model Order {
  User            User?            // Not 'user'
  OrderItem       OrderItem[]      // Not 'items'
  Address         Address?         // Not 'address'
  DeliveryPartner DeliveryPartner? // Not 'deliveryPartner'
}

model Item {
  Variant    Variant[]    // Not 'variants'
  ItemOption ItemOption[] // Not 'options'
  ItemAddon  ItemAddon[]  // Not 'addons'
}
```

## Quick Checklist

- [ ] All Prisma queries use PascalCase relation names
- [ ] All API responses use transform functions
- [ ] No `include` in `create` operations with nested creates
- [ ] Import transform functions where needed
