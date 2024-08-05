package controller

import (
	"fmt"
	"net/http"

	"github.com/fci/datasource/pkg/constant"
	"github.com/fci/datasource/pkg/util"
)

func HandleGetComponents(w http.ResponseWriter, req *http.Request) {
	// Verify method exists
	if req.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Call Attachment getList
	url := fmt.Sprintf("%s/components", constant.API_URL_RELATION)
	responseIncident, statusCode, err := util.CallAPI(http.MethodGet, url, nil)

	// Response
	w.Header().Add("Content-Type", "application/json")
	if err != nil {
		fmt.Println("Error calling component Service Get component:", err)
		return
	}

	if _, err := w.Write([]byte(responseIncident)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: not working
	w.WriteHeader(statusCode)
}
