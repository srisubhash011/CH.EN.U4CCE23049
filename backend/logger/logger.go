package logger

import (
	"os"
	"time"
)

func logToFile(level, msg string) {
	f, err := os.OpenFile("application.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err == nil {
		defer f.Close()
		f.WriteString(time.Now().Format(time.RFC3339) + " [" + level + "] " + msg + "\n")
	}
}

func Info(msg string) {
	logToFile("INFO", msg)
}

func Error(msg string) {
	logToFile("ERROR", msg)
}
