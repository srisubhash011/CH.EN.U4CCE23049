package controller

import (
	"encoding/json"
	"net/http"

	"campus-hiring-backend/logger"
	"campus-hiring-backend/services"
)

func EnableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
}

func GetTopNotificationsHandler(w http.ResponseWriter, r *http.Request) {
    EnableCORS(&w)
    if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	logger.Info("Received request for Top 10 notifications")
	notifs, err := services.GetTopNNotifications(10)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}

func GetAllNotificationsHandler(w http.ResponseWriter, r *http.Request) {
    EnableCORS(&w)
    if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
    
    logger.Info("Received request for All notifications")
    notifs, err := services.GetAllNotifications()
    if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}
