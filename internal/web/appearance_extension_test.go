package web

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAppearanceExtensionStylesAreIsolatedAndServed(t *testing.T) {
	index, err := embeddedStaticFiles.ReadFile("static/index.html")
	if err != nil {
		t.Fatalf("read index: %v", err)
	}

	body := string(index)
	upstreamCSS := strings.Index(body, `href="/static/app/app.css"`)
	if upstreamCSS < 0 {
		t.Fatal("index missing upstream app.css")
	}

	paths := []string{
		"/static/app/appearance-theme.css",
		"/static/app/appearance-fonts.css",
		"/static/app/appearance-overrides.css",
	}

	s := NewServer(Config{})
	mux := http.NewServeMux()
	mux.Handle("/static/", http.StripPrefix("/static/", s.staticFileServer()))

	lastIndex := upstreamCSS
	for _, path := range paths {
		linkIndex := strings.Index(body, `href="`+path+`"`)
		if linkIndex < 0 {
			t.Errorf("index missing %s", path)
		} else if linkIndex <= lastIndex {
			t.Errorf("%s must load after upstream CSS and preceding extension modules", path)
		}
		lastIndex = linkIndex

		req := httptest.NewRequest(http.MethodGet, path, nil)
		w := httptest.NewRecorder()
		mux.ServeHTTP(w, req)
		if w.Code != http.StatusOK {
			t.Errorf("GET %s: status %d, want 200", path, w.Code)
		}
		if w.Body.Len() == 0 {
			t.Errorf("GET %s: empty body", path)
		}
	}
}
