"use strict";
/*
 * Scramjet service worker.
 * Intercepts requests for proxied pages and serves them through Scramjet.
 * Anything that is not a Scramjet route is passed through untouched, so the
 * notepad homepage and static assets keep working normally.
 */
importScripts("/scram/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

function errorPage(message) {
	return (
		"<!doctype html><html><head><meta charset=\"utf-8\"><title>Couldn't load page</title>" +
		"<style>body{font:15px/1.6 system-ui,sans-serif;color:#333;background:#fafafa;" +
		"display:flex;align-items:center;justify-content:center;height:100vh;margin:0}" +
		"div{max-width:520px;padding:32px}h1{font-size:19px;margin:0 0 10px}" +
		"code{font-size:12px;background:#eee;padding:2px 6px;border-radius:4px;word-break:break-all}</style></head>" +
		"<body><div><h1>This page couldn't be loaded through the proxy.</h1>" +
		"<p>The request failed while being fetched. This can happen when the site is " +
		"down, blocks proxies, or the proxy backend is unreachable.</p>" +
		"<p><code>" + String(message).replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c])) + "</code></p>" +
		"<p>Use the back button or address bar to continue.</p></div></body></html>"
	);
}

async function handleRequest(event) {
	let isScramjetRoute = false;
	try {
		await scramjet.loadConfig();
		isScramjetRoute = scramjet.config && scramjet.route(event);
	} catch (err) {
		isScramjetRoute = false;
	}

	if (isScramjetRoute) {
		try {
			return await scramjet.fetch(event);
		} catch (err) {
			return new Response(errorPage(err && err.message ? err.message : err), {
				status: 502,
				headers: { "Content-Type": "text/html" },
			});
		}
	}

	// Not a proxied URL: serve normally.
	return fetch(event.request);
}

self.addEventListener("fetch", (event) => {
	event.respondWith(handleRequest(event));
});
