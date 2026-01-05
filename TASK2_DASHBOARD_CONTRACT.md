# TASK 2: DASHBOARD DATA CONTRACT - RUNTIME TRUTH

**Time:** 2026-01-05 17:20 IST

---

## **BACKEND RESPONSE SHAPE (ACTUAL)**

**Endpoint:** `GET /admin/metrics/stats`

**Response:**
```json
{
  "totalSalesToday": 0,
  "totalOrdersToday": 0,
  "activeOrders": 0,
  "lowStockItems": 0,
  "repeatCustomerRate": 0,
  "totalUsers": 0,
  "pendingOrders": 0,
  "preparingOrders": 0,
  "outForDeliveryOrders": 0,
  "newComplaints": 0,
  "newFeedbacks": 0
}
```

---

## **FRONTEND EXPECTATION (FROM NORMALIZER)**

**File:** `apps/admin/src/lib/api-normalizers.ts`

**Expected:**
```typescript
{
  totalSales: number,      // ❌ MISMATCH: backend sends "totalSalesToday"
  pending: number,         // ✅ MATCH: backend sends "pendingOrders"
  preparing: number,       // ✅ MATCH: backend sends "preparingOrders"
  onDelivery: number,      // ❌ MISMATCH: backend sends "outForDeliveryOrders"
  lowStock: number,        // ❌ MISMATCH: backend sends "lowStockItems"
  complaints: number,      // ❌ MISMATCH: backend sends "newComplaints"
  feedbacks: number        // ❌ MISMATCH: backend sends "newFeedbacks"
}
```

---

## **CONTRACT VIOLATIONS**

| Frontend Field | Backend Field | Status |
|---|---|---|
| `totalSales` | `totalSalesToday` | ❌ MISMATCH |
| `pending` | `pendingOrders` | ❌ MISMATCH |
| `preparing` | `preparingOrders` | ❌ MISMATCH |
| `onDelivery` | `outForDeliveryOrders` | ❌ MISMATCH |
| `lowStock` | `lowStockItems` | ❌ MISMATCH |
| `complaints` | `newComplaints` | ❌ MISMATCH |
| `feedbacks` | `newFeedbacks` | ❌ MISMATCH |

**ALL FIELDS MISMATCH!**

---

## **ROOT CAUSE**

The normalizer was created based on assumptions, not actual backend response.

---

## **FIX REQUIRED**

Update `normalizeDashboardStats()` to map backend fields correctly:

```typescript
export function normalizeDashboardStats(data: any): DashboardStats {
    return {
        totalSales: Number(data?.totalSalesToday) || 0,        // ✅ FIXED
        pending: Number(data?.pendingOrders) || 0,             // ✅ FIXED
        preparing: Number(data?.preparingOrders) || 0,         // ✅ FIXED
        onDelivery: Number(data?.outForDeliveryOrders) || 0,   // ✅ FIXED
        lowStock: Number(data?.lowStockItems) || 0,            // ✅ FIXED
        complaints: Number(data?.newComplaints) || 0,          // ✅ FIXED
        feedbacks: Number(data?.newFeedbacks) || 0,            // ✅ FIXED
    };
}
```

---

## **VERIFICATION**

After fix, dashboard will:
- ✅ Load with real data
- ✅ Show correct numbers
- ✅ Not crash on missing fields
- ✅ Default to 0 for all metrics

---

**STATUS:** Contract violation identified, fix ready to apply
