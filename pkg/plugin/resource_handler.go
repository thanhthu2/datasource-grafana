package plugin

import (
	"net/http"

	"github.com/fci/datasource/pkg/controller"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/resource/httpadapter"
)

func newResourceHandler() backend.CallResourceHandler {
	mux := http.NewServeMux()
	// tag
	mux.HandleFunc("/tags", controller.HandleGetTags)
	// component
	mux.HandleFunc("/components", controller.HandleGetComponents)
	// node
	mux.HandleFunc("/nodes", controller.HandleGetNodesByTagID)
	mux.HandleFunc("/nodes-by-component", controller.HandleGetNodesByComponent)
	mux.HandleFunc("/nodes-by-node", controller.HandleGetNodesByNodeID)
	return httpadapter.New(mux)
}
