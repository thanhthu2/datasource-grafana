package util

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

var noContent = `{
    "data": [],
    "status_code": 204,
    "status": "SUCCESS",
    "message": "Success"
}`

func CallAPI(method, url string, requestBody []byte) (string, int, error) {
	client := &http.Client{}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(requestBody))
	if err != nil {
		return "", 500, fmt.Errorf("error creating request: %s", err)
	}

	// Set appropriate headers, if required
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-FMON-TOKEN-HEADER", "b7KtKwLq!duuu1")

	resp, err := client.Do(req)
	if err != nil {
		return "", 400, fmt.Errorf("error making request to %s: %s", url, err)
	}
	defer resp.Body.Close()

	// No content
	if resp.StatusCode == 204 {
		return noContent, 204, nil
	}

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", 400, fmt.Errorf("error reading response from %s: %s", url, err)
	}

	return string(body), resp.StatusCode, nil
}
