package services

import (
	"container/heap"
	"time"

	"campus-hiring-backend/logger"
	"campus-hiring-backend/model"
	"campus-hiring-backend/repository"
)

type NotificationItem struct {
	Notification model.Notification
	Score        int64
	Index        int
}

type PriorityQueue []*NotificationItem

func (pq PriorityQueue) Len() int { return len(pq) }
func (pq PriorityQueue) Less(i, j int) bool { return pq[i].Score < pq[j].Score }
func (pq PriorityQueue) Swap(i, j int) {
	pq[i], pq[j] = pq[j], pq[i]
	pq[i].Index = i
	pq[j].Index = j
}
func (pq *PriorityQueue) Push(x interface{}) {
	n := len(*pq)
	item := x.(*NotificationItem)
	item.Index = n
	*pq = append(*pq, item)
}
func (pq *PriorityQueue) Pop() interface{} {
	old := *pq
	n := len(old)
	item := old[n-1]
	old[n-1] = nil
	item.Index = -1
	*pq = old[0 : n-1]
	return item
}

func calculateScore(n model.Notification) int64 {
	var weight int64
	switch n.Type {
	case "Placement":
		weight = 30000000000
	case "Result":
		weight = 20000000000
	case "Event":
		weight = 10000000000
	}
	
	t, err := time.Parse("2006-01-02 15:04:05", n.Timestamp)
	if err != nil {
		return weight
	}
	recency := t.Unix()
	return weight + recency
}

func GetTopNNotifications(n int) ([]model.Notification, error) {
	logger.Info("Executing GetTopNNotifications logic")
	
	notifications, err := repository.FetchNotificationsFromAPI()
	if err != nil {
		return nil, err
	}

	pq := make(PriorityQueue, 0)
	heap.Init(&pq)

	for _, notif := range notifications {
		score := calculateScore(notif)
		item := &NotificationItem{
			Notification: notif,
			Score:        score,
		}

		if pq.Len() < n {
			heap.Push(&pq, item)
		} else if score > pq[0].Score {
			heap.Pop(&pq)
			heap.Push(&pq, item)
		}
	}

	result := make([]model.Notification, pq.Len())
	for i := pq.Len() - 1; i >= 0; i-- {
		result[i] = heap.Pop(&pq).(*NotificationItem).Notification
	}

	logger.Info("Successfully computed top notifications")
	return result, nil
}

func GetAllNotifications() ([]model.Notification, error) {
    logger.Info("Getting all notifications")
    return repository.FetchNotificationsFromAPI()
}
