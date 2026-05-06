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