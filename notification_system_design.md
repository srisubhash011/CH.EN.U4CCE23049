# Stage 1

## Core Actions
1. **Fetch Notifications**: Retrieve a list of notifications for the logged-in user.
2. **Mark as Read**: Update the status of a specific notification to 'read'.
3. **Mark All as Read**: Update all unread notifications for the user to 'read'.
4. **Get Unread Count**: Retrieve the total number of unread notifications for badge display.

## REST API Endpoints

### 1. Fetch Notifications
- **Endpoint**: `GET /api/v1/notifications`
- **Headers**: 
  - `Authorization: Bearer <token>`
- **Query Parameters**:
  - `limit` (optional): Number of records (e.g., 20)
  - `page` (optional): Page number (e.g., 1)
  - `notification_type` (optional): Filter by type (Event, Result, Placement)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "d146095a-0d86-4a34-9e69-3900a14576bc",
        "type": "Result",
        "message": "mid-sem",
        "timestamp": "2026-04-22 17:51:30",
        "is_read": false
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100
    }
  }
}
```

### 2. Mark Notification as Read
- **Endpoint**: `PATCH /api/v1/notifications/:id/read`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: None
- **Response**:
```json
{
  "status": "success",
  "message": "Notification marked as read."
}
```

### 3. Mark All Notifications as Read
- **Endpoint**: `POST /api/v1/notifications/read-all`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: None
- **Response**:
```json
{
  "status": "success",
  "message": "All notifications marked as read."
}
```

### 4. Get Unread Count
- **Endpoint**: `GET /api/v1/notifications/unread-count`
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
```json
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

## Real-Time Notifications Mechanism
For real-time notifications, **Server-Sent Events (SSE)** is the optimal choice since notifications are predominantly one-way (server to client). 
Alternatively, **WebSockets** can be used if bidirectional communication is anticipated in the future. A lightweight WebSocket server (e.g., Socket.io or native WebSockets in Go) would push events to the client whenever a new notification is generated.

# Stage 2

## Persistent Storage (DB) Suggestion
**Choice:** PostgreSQL (Relational SQL Database).
**Reasoning:** Notifications possess a strictly defined schema (User ID, Type, Message, Timestamp, Read Status). PostgreSQL is highly robust, ACID compliant, and offers excellent indexing capabilities (including partial and composite indexes) which are crucial for quickly querying unread notifications or filtering by type.

## DB Schema
```sql
CREATE TYPE notification_type AS ENUM ('Event', 'Result', 'Placement');

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id INT NOT NULL,
    type notification_type NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Potential Problems with Data Volume Growth
1. **Slow Queries**: As the table grows to millions of rows, querying unread notifications for a user will become slow due to table scans.
2. **Storage Costs**: Unbounded growth of notification records consumes significant storage.
3. **Write Bottlenecks**: Heavy insert operations during bulk notifications (e.g., "Notify All") can lock the table and degrade read performance.

## Solutions
1. **Indexing**: Add composite indexes on `(student_id, is_read, created_at)` to optimize the most common read queries.
2. **Archiving/Partitioning**: Partition the table by date (e.g., monthly). Move notifications older than 6 months to a cheaper "cold storage" table or database since they are rarely accessed.
3. **Caching**: Cache the `unread_count` in Redis to avoid hitting the DB for every page load.

## Queries
- **Fetch unread notifications for a user**:
  ```sql
  SELECT * FROM notifications WHERE student_id = 123 AND is_read = FALSE ORDER BY created_at DESC LIMIT 20;
  ```
- **Insert a new notification**:
  ```sql
  INSERT INTO notifications (student_id, type, message) VALUES (123, 'Placement', 'New drive scheduled');
  ```

  # Stage 3

## Query Evaluation
```sql
SELECT FROM notifications
WHERE studentID = 1042 AND isRead = false
ORDER BY createdAt ASC;
```
**Is this query accurate?** 
No, it contains a syntax error. It should be `SELECT * FROM notifications` (or specific column names). Also, returning results in `ASC` order might show the oldest unread notifications first, whereas users typically want to see the most recent (`DESC`).

**Why is this slow?**
Without appropriate indexes, the database must perform a "Full Table Scan" across 5,000,000 rows to find matches for `studentID = 1042` and `isRead = false`.

**What would you change and computation cost?**
I would add a composite index on `(studentID, isRead, createdAt)`.
With this index, the database can use an Index Seek to instantly locate the relevant rows and retrieve them already sorted by `createdAt`. The computation cost drops from O(N) (scanning all rows) to O(log N) (B-Tree traversal).

**Is adding indexes on every column effective?**
No, this is terrible advice. 
1. **Write Penalty**: Every INSERT/UPDATE/DELETE requires updating all indexes, drastically slowing down write performance.
2. **Storage Overhead**: Indexes consume significant disk space.
3. **Optimizer Confusion**: Too many indexes can confuse the database query optimizer, sometimes leading to sub-optimal execution plans.

## Query for Placement Notifications in Last 7 Days
```sql
SELECT DISTINCT studentID 
FROM notifications 
WHERE notificationType = 'Placement' 
  AND createdAt >= NOW() - INTERVAL '7 days';
```

