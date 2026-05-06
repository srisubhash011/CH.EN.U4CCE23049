package main

import (
	"net/http"

	"campus-hiring-backend/controller"
	"campus-hiring-backend/logger"
)

func main() {
	logger.Info("Starting backend server on port 8080")
	http.HandleFunc("/api/notifications/top", controller.GetTopNotificationsHandler)
	http.HandleFunc("/api/notifications", controller.GetAllNotificationsHandler)
	
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		logger.Error("Server failed to start: " + err.Error())
	}
}
