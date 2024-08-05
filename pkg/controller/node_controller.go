package controller

import (
	"fmt"
	"net/http"

	"github.com/fci/datasource/pkg/constant"
	"github.com/fci/datasource/pkg/util"
)

func HandleGetNodesByTagID(w http.ResponseWriter, req *http.Request) {
	params := req.URL.Query()
	tagID := params.Get("tagID")
	// Verify method exists
	if req.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Call Attachment getList
	url := fmt.Sprintf("%s/nodes/?tag_id=%s", constant.API_URL_RELATION, tagID)
	responseIncident, statusCode, err := util.CallAPI(http.MethodGet, url, nil)

	// Response
	w.Header().Add("Content-Type", "application/json")
	if err != nil {
		fmt.Println("Error calling node Service Get node:", err)
		return
	}

	if _, err := w.Write([]byte(responseIncident)); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: not working
	w.WriteHeader(statusCode)
}
