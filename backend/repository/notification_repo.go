package repository

import (
	"encoding/json"
	"net/http"

	"campus-hiring-backend/logger"
	"campus-hiring-backend/model"
)

func FetchNotificationsFromAPI() ([]model.Notification, error) {
	logger.Info("Fetching notifications from external API")
	resp, err := http.Get("http://20.207.122.201/evaluation-service/notifications")
	if err != nil {
		logger.Error("Failed to fetch from API: " + err.Error())
		return nil, err
	}
	defer resp.Body.Close()

	var apiResp model.APIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResp); err != nil {
		logger.Error("Failed to decode API response: " + err.Error())
		return nil, err
	}

	logger.Info("Successfully fetched notifications")
	return apiResp.Notifications, nil
}
