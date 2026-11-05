"use strict";
/*
 * Frontend configuration — the ONLY place the backend URL is set.
 *
 * BACKEND_URL:   The URL of your Render backend, with no trailing slash.
 *                Local testing:  "http://localhost:3000"
 *                After deploy:   "https://your-app-name.onrender.com"
 *
 * SEARCH_ENGINE: Template used when the address bar input is a search
 *                query instead of a URL. "%s" is replaced with the
 *                URL-encoded search term.
 */
var CONFIG = {
	BACKEND_URL: "http://localhost:3000",
	SEARCH_ENGINE: "https://duckduckgo.com/?q=%s",
};
