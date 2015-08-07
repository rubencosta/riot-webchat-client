/******/ (function(modules) { // webpackBootstrap
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(callback) { // eslint-disable-line no-unused-vars
/******/ 		if(typeof XMLHttpRequest === "undefined")
/******/ 			return callback(new Error("No browser support"));
/******/ 		try {
/******/ 			var request = new XMLHttpRequest();
/******/ 			var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 			request.open("GET", requestPath, true);
/******/ 			request.timeout = 10000;
/******/ 			request.send(null);
/******/ 		} catch(err) {
/******/ 			return callback(err);
/******/ 		}
/******/ 		request.onreadystatechange = function() {
/******/ 			if(request.readyState !== 4) return;
/******/ 			if(request.status === 0) {
/******/ 				// timeout
/******/ 				callback(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 			} else if(request.status === 404) {
/******/ 				// no update available
/******/ 				callback();
/******/ 			} else if(request.status !== 200 && request.status !== 304) {
/******/ 				// other failure
/******/ 				callback(new Error("Manifest request to " + requestPath + " failed."));
/******/ 			} else {
/******/ 				// success
/******/ 				try {
/******/ 					var update = JSON.parse(request.responseText);
/******/ 				} catch(e) {
/******/ 					callback(e);
/******/ 					return;
/******/ 				}
/******/ 				callback(null, update);
/******/ 			}
/******/ 		};
/******/ 	}

/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "283bb4d5384d14bffb61"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					if(me.children.indexOf(request) < 0)
/******/ 						me.children.push(request);
/******/ 				} else hotCurrentParents = [moduleId];
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name)) {
/******/ 				fn[name] = __webpack_require__[name];
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId, callback) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			__webpack_require__.e(chunkId, function() {
/******/ 				try {
/******/ 					callback.call(null, fn);
/******/ 				} finally {
/******/ 					finishChunkLoading();
/******/ 				}
/******/ 	
/******/ 				function finishChunkLoading() {
/******/ 					hotChunksLoading--;
/******/ 					if(hotStatus === "prepare") {
/******/ 						if(!hotWaitingFilesMap[chunkId]) {
/******/ 							hotEnsureUpdateChunk(chunkId);
/******/ 						}
/******/ 						if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 							hotUpdateDownloaded();
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback;
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback;
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "number")
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 				else
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailibleFilesMap = {};
/******/ 	var hotCallback;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply, callback) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		if(typeof apply === "function") {
/******/ 			hotApplyOnUpdate = false;
/******/ 			callback = apply;
/******/ 		} else {
/******/ 			hotApplyOnUpdate = apply;
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 		hotSetStatus("check");
/******/ 		hotDownloadManifest(function(err, update) {
/******/ 			if(err) return callback(err);
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				callback(null, null);
/******/ 				return;
/******/ 			}
/******/ 	
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotAvailibleFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			for(var i = 0; i < update.c.length; i++)
/******/ 				hotAvailibleFilesMap[update.c[i]] = true;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			hotCallback = callback;
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailibleFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailibleFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var callback = hotCallback;
/******/ 		hotCallback = null;
/******/ 		if(!callback) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate, callback);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			callback(null, outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options, callback) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		if(typeof options === "function") {
/******/ 			callback = options;
/******/ 			options = {};
/******/ 		} else if(options && typeof options === "object") {
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		} else {
/******/ 			options = {};
/******/ 			callback = callback || function(err) {
/******/ 				if(err) throw err;
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function getAffectedStuff(module) {
/******/ 			var outdatedModules = [module];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice();
/******/ 			while(queue.length > 0) {
/******/ 				var moduleId = queue.pop();
/******/ 				var module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return new Error("Aborted because of self decline: " + moduleId);
/******/ 				}
/******/ 				if(moduleId === 0) {
/******/ 					return;
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return new Error("Aborted because of declined dependency: " + moduleId + " in " + parentId);
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push(parentId);
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return [outdatedModules, outdatedDependencies];
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				var moduleId = toModuleId(id);
/******/ 				var result = getAffectedStuff(moduleId);
/******/ 				if(!result) {
/******/ 					if(options.ignoreUnaccepted)
/******/ 						continue;
/******/ 					hotSetStatus("abort");
/******/ 					return callback(new Error("Aborted because " + moduleId + " is not accepted"));
/******/ 				}
/******/ 				if(result instanceof Error) {
/******/ 					hotSetStatus("abort");
/******/ 					return callback(result);
/******/ 				}
/******/ 				appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 				addAllToSet(outdatedModules, result[0]);
/******/ 				for(var moduleId in result[1]) {
/******/ 					if(Object.prototype.hasOwnProperty.call(result[1], moduleId)) {
/******/ 						if(!outdatedDependencies[moduleId])
/******/ 							outdatedDependencies[moduleId] = [];
/******/ 						addAllToSet(outdatedDependencies[moduleId], result[1][moduleId]);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(var i = 0; i < outdatedModules.length; i++) {
/******/ 			var moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			var moduleId = queue.pop();
/******/ 			var module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(var j = 0; j < disposeHandlers.length; j++) {
/******/ 				var cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(var j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				var idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				for(var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 					var dependency = moduleOutdatedDependencies[j];
/******/ 					var idx = module.children.indexOf(dependency);
/******/ 					if(idx >= 0) module.children.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(var moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(var moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				var module = installedModules[moduleId];
/******/ 				var moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(var i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					var dependency = moduleOutdatedDependencies[i];
/******/ 					var cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(var i = 0; i < callbacks.length; i++) {
/******/ 					var cb = callbacks[i];
/******/ 					try {
/******/ 						cb(outdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(var i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			var moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else if(!error)
/******/ 					error = err;
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return callback(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		callback(null, outdatedModules);
/******/ 	}

/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: hotCurrentParents,
/******/ 			children: []
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };

/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(14);
	__webpack_require__(15);
	module.exports = __webpack_require__(25);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(true) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_require__.h()) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}

				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}

				if(!upToDate()) {
					check();
				}

				__webpack_require__(2)(updatedModules, updatedModules);

				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}

			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 2 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	module.exports = function(updatedModules, renewedModules) {
		var unacceptedModules = updatedModules.filter(function(moduleId) {
			return renewedModules && renewedModules.indexOf(moduleId) < 0;
		});

		if(unacceptedModules.length > 0) {
			console.warn("[HMR] The following modules couldn't be hot updated: (They would need a full reload!)");
			unacceptedModules.forEach(function(moduleId) {
				console.warn("[HMR]  - " + moduleId);
			});
		}

		if(!renewedModules || renewedModules.length === 0) {
			console.log("[HMR] Nothing hot updated.");
		} else {
			console.log("[HMR] Updated modules:");
			renewedModules.forEach(function(moduleId) {
				console.log("[HMR]  - " + moduleId);
			});
		}
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';
	__webpack_require__(5);

	riot.mount('*');
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Riot v2.2.3, @license MIT, (c) 2015 Muut Inc. + contributors */

	;(function(window, undefined) {
	  'use strict'
	  var riot = { version: 'v2.2.3', settings: {} },
	      // counter to give a unique id to all the Tag instances
	      __uid = 0

	  // This globals 'const' helps code size reduction

	  // for typeof == '' comparisons
	  var T_STRING = 'string',
	      T_OBJECT = 'object',
	      T_UNDEF  = 'undefined',
	      T_FUNCTION  = 'function',
	      RESERVED_WORDS_BLACKLIST = ['update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one']

	  // for IE8 and rest of the world
	  /* istanbul ignore next */
	  var isArray = Array.isArray || (function () {
	    var _ts = Object.prototype.toString
	    return function (v) { return _ts.call(v) === '[object Array]' }
	  })()

	  // Version# for IE 8-11, 0 for others
	  var ieVersion = (function (win) {
	    return (window && window.document || {}).documentMode | 0
	  })()

	riot.observable = function(el) {

	  el = el || {}

	  var callbacks = {},
	      _id = 0

	  el.on = function(events, fn) {
	    if (isFunction(fn)) {
	      if (typeof fn.id === T_UNDEF) fn._id = _id++

	      events.replace(/\S+/g, function(name, pos) {
	        (callbacks[name] = callbacks[name] || []).push(fn)
	        fn.typed = pos > 0
	      })
	    }
	    return el
	  }

	  el.off = function(events, fn) {
	    if (events == '*') callbacks = {}
	    else {
	      events.replace(/\S+/g, function(name) {
	        if (fn) {
	          var arr = callbacks[name]
	          for (var i = 0, cb; (cb = arr && arr[i]); ++i) {
	            if (cb._id == fn._id) arr.splice(i--, 1)
	          }
	        } else {
	          callbacks[name] = []
	        }
	      })
	    }
	    return el
	  }

	  // only single event supported
	  el.one = function(name, fn) {
	    function on() {
	      el.off(name, on)
	      fn.apply(el, arguments)
	    }
	    return el.on(name, on)
	  }

	  el.trigger = function(name) {
	    var args = [].slice.call(arguments, 1),
	        fns = callbacks[name] || []

	    for (var i = 0, fn; (fn = fns[i]); ++i) {
	      if (!fn.busy) {
	        fn.busy = 1
	        fn.apply(el, fn.typed ? [name].concat(args) : args)
	        if (fns[i] !== fn) { i-- }
	        fn.busy = 0
	      }
	    }

	    if (callbacks.all && name != 'all') {
	      el.trigger.apply(el, ['all', name].concat(args))
	    }

	    return el
	  }

	  return el

	}
	riot.mixin = (function() {
	  var mixins = {}

	  return function(name, mixin) {
	    if (!mixin) return mixins[name]
	    mixins[name] = mixin
	  }

	})()

	;(function(riot, evt, win) {

	  // browsers only
	  if (!win) return

	  var loc = win.location,
	      fns = riot.observable(),
	      started = false,
	      current

	  function hash() {
	    return loc.href.split('#')[1] || ''
	  }

	  function parser(path) {
	    return path.split('/')
	  }

	  function emit(path) {
	    if (path.type) path = hash()

	    if (path != current) {
	      fns.trigger.apply(null, ['H'].concat(parser(path)))
	      current = path
	    }
	  }

	  var r = riot.route = function(arg) {
	    // string
	    if (arg[0]) {
	      loc.hash = arg
	      emit(arg)

	    // function
	    } else {
	      fns.on('H', arg)
	    }
	  }

	  r.exec = function(fn) {
	    fn.apply(null, parser(hash()))
	  }

	  r.parser = function(fn) {
	    parser = fn
	  }

	  r.stop = function () {
	    if (!started) return
	    win.removeEventListener ? win.removeEventListener(evt, emit, false) : win.detachEvent('on' + evt, emit)
	    fns.off('*')
	    started = false
	  }

	  r.start = function () {
	    if (started) return
	    win.addEventListener ? win.addEventListener(evt, emit, false) : win.attachEvent('on' + evt, emit)
	    started = true
	  }

	  // autostart the router
	  r.start()

	})(riot, 'hashchange', window)
	/*

	//// How it works?


	Three ways:

	1. Expressions: tmpl('{ value }', data).
	   Returns the result of evaluated expression as a raw object.

	2. Templates: tmpl('Hi { name } { surname }', data).
	   Returns a string with evaluated expressions.

	3. Filters: tmpl('{ show: !done, highlight: active }', data).
	   Returns a space separated list of trueish keys (mainly
	   used for setting html classes), e.g. "show highlight".


	// Template examples

	tmpl('{ title || "Untitled" }', data)
	tmpl('Results are { results ? "ready" : "loading" }', data)
	tmpl('Today is { new Date() }', data)
	tmpl('{ message.length > 140 && "Message is too long" }', data)
	tmpl('This item got { Math.round(rating) } stars', data)
	tmpl('<h1>{ title }</h1>{ body }', data)


	// Falsy expressions in templates

	In templates (as opposed to single expressions) all falsy values
	except zero (undefined/null/false) will default to empty string:

	tmpl('{ undefined } - { false } - { null } - { 0 }', {})
	// will return: " - - - 0"

	*/


	var brackets = (function(orig) {

	  var cachedBrackets,
	      r,
	      b,
	      re = /[{}]/g

	  return function(x) {

	    // make sure we use the current setting
	    var s = riot.settings.brackets || orig

	    // recreate cached vars if needed
	    if (cachedBrackets !== s) {
	      cachedBrackets = s
	      b = s.split(' ')
	      r = b.map(function (e) { return e.replace(/(?=.)/g, '\\') })
	    }

	    // if regexp given, rewrite it with current brackets (only if differ from default)
	    return x instanceof RegExp ? (
	        s === orig ? x :
	        new RegExp(x.source.replace(re, function(b) { return r[~~(b === '}')] }), x.global ? 'g' : '')
	      ) :
	      // else, get specific bracket
	      b[x]
	  }
	})('{ }')


	var tmpl = (function() {

	  var cache = {},
	      reVars = /(['"\/]).*?[^\\]\1|\.\w*|\w*:|\b(?:(?:new|typeof|in|instanceof) |(?:this|true|false|null|undefined)\b|function *\()|([a-z_$]\w*)/gi
	              // [ 1               ][ 2  ][ 3 ][ 4                                                                                  ][ 5       ]
	              // find variable names:
	              // 1. skip quoted strings and regexps: "a b", 'a b', 'a \'b\'', /a b/
	              // 2. skip object properties: .name
	              // 3. skip object literals: name:
	              // 4. skip javascript keywords
	              // 5. match var name

	  // build a template (or get it from cache), render with data
	  return function(str, data) {
	    return str && (cache[str] = cache[str] || tmpl(str))(data)
	  }


	  // create a template instance

	  function tmpl(s, p) {

	    // default template string to {}
	    s = (s || (brackets(0) + brackets(1)))

	      // temporarily convert \{ and \} to a non-character
	      .replace(brackets(/\\{/g), '\uFFF0')
	      .replace(brackets(/\\}/g), '\uFFF1')

	    // split string to expression and non-expresion parts
	    p = split(s, extract(s, brackets(/{/), brackets(/}/)))

	    return new Function('d', 'return ' + (

	      // is it a single expression or a template? i.e. {x} or <b>{x}</b>
	      !p[0] && !p[2] && !p[3]

	        // if expression, evaluate it
	        ? expr(p[1])

	        // if template, evaluate all expressions in it
	        : '[' + p.map(function(s, i) {

	            // is it an expression or a string (every second part is an expression)
	          return i % 2

	              // evaluate the expressions
	              ? expr(s, true)

	              // process string parts of the template:
	              : '"' + s

	                  // preserve new lines
	                  .replace(/\n/g, '\\n')

	                  // escape quotes
	                  .replace(/"/g, '\\"')

	                + '"'

	        }).join(',') + '].join("")'
	      )

	      // bring escaped { and } back
	      .replace(/\uFFF0/g, brackets(0))
	      .replace(/\uFFF1/g, brackets(1))

	    + ';')

	  }


	  // parse { ... } expression

	  function expr(s, n) {
	    s = s

	      // convert new lines to spaces
	      .replace(/\n/g, ' ')

	      // trim whitespace, brackets, strip comments
	      .replace(brackets(/^[{ ]+|[ }]+$|\/\*.+?\*\//g), '')

	    // is it an object literal? i.e. { key : value }
	    return /^\s*[\w- "']+ *:/.test(s)

	      // if object literal, return trueish keys
	      // e.g.: { show: isOpen(), done: item.done } -> "show done"
	      ? '[' +

	          // extract key:val pairs, ignoring any nested objects
	          extract(s,

	              // name part: name:, "name":, 'name':, name :
	              /["' ]*[\w- ]+["' ]*:/,

	              // expression part: everything upto a comma followed by a name (see above) or end of line
	              /,(?=["' ]*[\w- ]+["' ]*:)|}|$/
	              ).map(function(pair) {

	                // get key, val parts
	                return pair.replace(/^[ "']*(.+?)[ "']*: *(.+?),? *$/, function(_, k, v) {

	                  // wrap all conditional parts to ignore errors
	                  return v.replace(/[^&|=!><]+/g, wrap) + '?"' + k + '":"",'

	                })

	              }).join('')

	        + '].join(" ").trim()'

	      // if js expression, evaluate as javascript
	      : wrap(s, n)

	  }


	  // execute js w/o breaking on errors or undefined vars

	  function wrap(s, nonull) {
	    s = s.trim()
	    return !s ? '' : '(function(v){try{v='

	        // prefix vars (name => data.name)
	        + (s.replace(reVars, function(s, _, v) { return v ? '(d.'+v+'===undefined?'+(typeof window == 'undefined' ? 'global.' : 'window.')+v+':d.'+v+')' : s })

	          // break the expression if its empty (resulting in undefined value)
	          || 'x')
	      + '}catch(e){'
	      + '}finally{return '

	        // default to empty string for falsy values except zero
	        + (nonull === true ? '!v&&v!==0?"":v' : 'v')

	      + '}}).call(d)'
	  }


	  // split string by an array of substrings

	  function split(str, substrings) {
	    var parts = []
	    substrings.map(function(sub, i) {

	      // push matched expression and part before it
	      i = str.indexOf(sub)
	      parts.push(str.slice(0, i), sub)
	      str = str.slice(i + sub.length)
	    })

	    // push the remaining part
	    return parts.concat(str)
	  }


	  // match strings between opening and closing regexp, skipping any inner/nested matches

	  function extract(str, open, close) {

	    var start,
	        level = 0,
	        matches = [],
	        re = new RegExp('('+open.source+')|('+close.source+')', 'g')

	    str.replace(re, function(_, open, close, pos) {

	      // if outer inner bracket, mark position
	      if (!level && open) start = pos

	      // in(de)crease bracket level
	      level += open ? 1 : -1

	      // if outer closing bracket, grab the match
	      if (!level && close != null) matches.push(str.slice(start, pos+close.length))

	    })

	    return matches
	  }

	})()

	// { key, i in items} -> { key, i, items }
	function loopKeys(expr) {
	  var b0 = brackets(0),
	      els = expr.trim().slice(b0.length).match(/^\s*(\S+?)\s*(?:,\s*(\S+))?\s+in\s+(.+)$/)
	  return els ? { key: els[1], pos: els[2], val: b0 + els[3] } : { val: expr }
	}

	function mkitem(expr, key, val) {
	  var item = {}
	  item[expr.key] = key
	  if (expr.pos) item[expr.pos] = val
	  return item
	}


	/* Beware: heavy stuff */
	function _each(dom, parent, expr) {

	  remAttr(dom, 'each')

	  var tagName = getTagName(dom),
	      template = dom.outerHTML,
	      hasImpl = !!tagImpl[tagName],
	      impl = tagImpl[tagName] || {
	        tmpl: template
	      },
	      root = dom.parentNode,
	      placeholder = document.createComment('riot placeholder'),
	      tags = [],
	      child = getTag(dom),
	      checksum

	  root.insertBefore(placeholder, dom)

	  expr = loopKeys(expr)

	  // clean template code
	  parent
	    .one('premount', function () {
	      if (root.stub) root = parent.root
	      // remove the original DOM node
	      dom.parentNode.removeChild(dom)
	    })
	    .on('update', function () {
	      var items = tmpl(expr.val, parent)

	      // object loop. any changes cause full redraw
	      if (!isArray(items)) {

	        checksum = items ? JSON.stringify(items) : ''

	        items = !items ? [] :
	          Object.keys(items).map(function (key) {
	            return mkitem(expr, key, items[key])
	          })
	      }

	      var frag = document.createDocumentFragment(),
	          i = tags.length,
	          j = items.length

	      // unmount leftover items
	      while (i > j) {
	        tags[--i].unmount()
	        tags.splice(i, 1)
	      }

	      for (i = 0; i < j; ++i) {
	        var _item = !checksum && !!expr.key ? mkitem(expr, items[i], i) : items[i]

	        if (!tags[i]) {
	          // mount new
	          (tags[i] = new Tag(impl, {
	              parent: parent,
	              isLoop: true,
	              hasImpl: hasImpl,
	              root: hasImpl ? dom.cloneNode() : root,
	              item: _item
	            }, dom.innerHTML)
	          ).mount()

	          frag.appendChild(tags[i].root)
	        } else
	          tags[i].update(_item)

	        tags[i]._item = _item

	      }

	      root.insertBefore(frag, placeholder)

	      if (child) parent.tags[tagName] = tags

	    }).one('updated', function() {
	      var keys = Object.keys(parent)// only set new values
	      walk(root, function(node) {
	        // only set element node and not isLoop
	        if (node.nodeType == 1 && !node.isLoop && !node._looped) {
	          node._visited = false // reset _visited for loop node
	          node._looped = true // avoid set multiple each
	          setNamed(node, parent, keys)
	        }
	      })
	    })

	}


	function parseNamedElements(root, parent, childTags) {

	  walk(root, function(dom) {
	    if (dom.nodeType == 1) {
	      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || dom.getAttribute('each')) ? 1 : 0

	      // custom child tag
	      var child = getTag(dom)

	      if (child && !dom.isLoop) {
	        var tag = new Tag(child, { root: dom, parent: parent }, dom.innerHTML),
	            tagName = getTagName(dom),
	            ptag = getImmediateCustomParentTag(parent),
	            cachedTag

	        // fix for the parent attribute in the looped elements
	        tag.parent = ptag

	        cachedTag = ptag.tags[tagName]

	        // if there are multiple children tags having the same name
	        if (cachedTag) {
	          // if the parent tags property is not yet an array
	          // create it adding the first cached tag
	          if (!isArray(cachedTag))
	            ptag.tags[tagName] = [cachedTag]
	          // add the new nested tag to the array
	          ptag.tags[tagName].push(tag)
	        } else {
	          ptag.tags[tagName] = tag
	        }

	        // empty the child node once we got its template
	        // to avoid that its children get compiled multiple times
	        dom.innerHTML = ''
	        childTags.push(tag)
	      }

	      if (!dom.isLoop)
	        setNamed(dom, parent, [])
	    }

	  })

	}

	function parseExpressions(root, tag, expressions) {

	  function addExpr(dom, val, extra) {
	    if (val.indexOf(brackets(0)) >= 0) {
	      var expr = { dom: dom, expr: val }
	      expressions.push(extend(expr, extra))
	    }
	  }

	  walk(root, function(dom) {
	    var type = dom.nodeType

	    // text node
	    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
	    if (type != 1) return

	    /* element */

	    // loop
	    var attr = dom.getAttribute('each')

	    if (attr) { _each(dom, tag, attr); return false }

	    // attribute expressions
	    each(dom.attributes, function(attr) {
	      var name = attr.name,
	        bool = name.split('__')[1]

	      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
	      if (bool) { remAttr(dom, name); return false }

	    })

	    // skip custom tags
	    if (getTag(dom)) return false

	  })

	}
	function Tag(impl, conf, innerHTML) {

	  var self = riot.observable(this),
	      opts = inherit(conf.opts) || {},
	      dom = mkdom(impl.tmpl),
	      parent = conf.parent,
	      isLoop = conf.isLoop,
	      hasImpl = conf.hasImpl,
	      item = cleanUpData(conf.item),
	      expressions = [],
	      childTags = [],
	      root = conf.root,
	      fn = impl.fn,
	      tagName = root.tagName.toLowerCase(),
	      attr = {},
	      propsInSyncWithParent = [],
	      loopDom


	  if (fn && root._tag) {
	    root._tag.unmount(true)
	  }

	  // not yet mounted
	  this.isMounted = false
	  root.isLoop = isLoop

	  // keep a reference to the tag just created
	  // so we will be able to mount this tag multiple times
	  root._tag = this

	  // create a unique id to this tag
	  // it could be handy to use it also to improve the virtual dom rendering speed
	  this._id = __uid++

	  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

	  // grab attributes
	  each(root.attributes, function(el) {
	    var val = el.value
	    // remember attributes with expressions only
	    if (brackets(/\{.*\}/).test(val)) attr[el.name] = val
	  })

	  if (dom.innerHTML && !/select|optgroup|tbody|tr/.test(tagName))
	    // replace all the yield tags with the tag inner html
	    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

	  // options
	  function updateOpts() {
	    var ctx = hasImpl && isLoop ? self : parent || self

	    // update opts from current DOM attributes
	    each(root.attributes, function(el) {
	      opts[el.name] = tmpl(el.value, ctx)
	    })
	    // recover those with expressions
	    each(Object.keys(attr), function(name) {
	      opts[name] = cleanUpData(tmpl(attr[name], ctx))
	    })
	  }

	  function normalizeData(data) {
	    for (var key in item) {
	      if (typeof self[key] !== T_UNDEF)
	        self[key] = data[key]
	    }
	  }

	  function inheritFromParent () {
	    if (!self.parent || !isLoop) return
	    each(Object.keys(self.parent), function(k) {
	      // some properties must be always in sync with the parent tag
	      var mustSync = ~propsInSyncWithParent.indexOf(k)
	      if (typeof self[k] === T_UNDEF || mustSync) {
	        // track the property to keep in sync
	        // so we can keep it updated
	        if (!mustSync) propsInSyncWithParent.push(k)
	        self[k] = self.parent[k]
	      }
	    })
	  }

	  this.update = function(data) {
	    // make sure the data passed will not override
	    // the component core methods
	    data = cleanUpData(data)
	    // inherit properties from the parent
	    inheritFromParent()
	    // normalize the tag properties in case an item object was initially passed
	    if (typeof item === T_OBJECT) {
	      normalizeData(data || {})
	      item = data
	    }
	    extend(self, data)
	    updateOpts()
	    self.trigger('update', data)
	    update(expressions, self)
	    self.trigger('updated')
	  }

	  this.mixin = function() {
	    each(arguments, function(mix) {
	      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix
	      each(Object.keys(mix), function(key) {
	        // bind methods to self
	        if (key != 'init')
	          self[key] = isFunction(mix[key]) ? mix[key].bind(self) : mix[key]
	      })
	      // init method will be called automatically
	      if (mix.init) mix.init.bind(self)()
	    })
	  }

	  this.mount = function() {

	    updateOpts()

	    // initialiation
	    fn && fn.call(self, opts)

	    // parse layout after init. fn may calculate args for nested custom tags
	    parseExpressions(dom, self, expressions)

	    // mount the child tags
	    toggle(true)

	    // update the root adding custom attributes coming from the compiler
	    if (impl.attrs) {
	      walkAttributes(impl.attrs, function (k, v) { root.setAttribute(k, v) })
	      parseExpressions(self.root, self, expressions)
	    }

	    if (!self.parent || isLoop) self.update(item)

	    // internal use only, fixes #403
	    self.trigger('premount')

	    if (isLoop && !hasImpl) {
	      // update the root attribute for the looped elements
	      self.root = root = loopDom = dom.firstChild

	    } else {
	      while (dom.firstChild) root.appendChild(dom.firstChild)
	      if (root.stub) self.root = root = parent.root
	    }
	    // if it's not a child tag we can trigger its mount event
	    if (!self.parent || self.parent.isMounted) {
	      self.isMounted = true
	      self.trigger('mount')
	    }
	    // otherwise we need to wait that the parent event gets triggered
	    else self.parent.one('mount', function() {
	      // avoid to trigger the `mount` event for the tags
	      // not visible included in an if statement
	      if (!isInStub(self.root)) {
	        self.parent.isMounted = self.isMounted = true
	        self.trigger('mount')
	      }
	    })
	  }


	  this.unmount = function(keepRootTag) {
	    var el = loopDom || root,
	        p = el.parentNode,
	        ptag

	    if (p) {

	      if (parent) {
	        ptag = getImmediateCustomParentTag(parent)
	        // remove this tag from the parent tags object
	        // if there are multiple nested tags with same name..
	        // remove this element form the array
	        if (isArray(ptag.tags[tagName]))
	          each(ptag.tags[tagName], function(tag, i) {
	            if (tag._id == self._id)
	              ptag.tags[tagName].splice(i, 1)
	          })
	        else
	          // otherwise just delete the tag instance
	          ptag.tags[tagName] = undefined
	      }

	      else
	        while (el.firstChild) el.removeChild(el.firstChild)

	      if (!keepRootTag)
	        p.removeChild(el)

	    }


	    self.trigger('unmount')
	    toggle()
	    self.off('*')
	    // somehow ie8 does not like `delete root._tag`
	    root._tag = null

	  }

	  function toggle(isMount) {

	    // mount/unmount children
	    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

	    // listen/unlisten parent (events flow one way from parent to children)
	    if (parent) {
	      var evt = isMount ? 'on' : 'off'

	      // the loop tags will be always in sync with the parent automatically
	      if (isLoop)
	        parent[evt]('unmount', self.unmount)
	      else
	        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
	    }
	  }

	  // named elements available for fn
	  parseNamedElements(dom, this, childTags)


	}

	function setEventHandler(name, handler, dom, tag) {

	  dom[name] = function(e) {

	    var item = tag._item,
	        ptag = tag.parent,
	        el

	    if (!item)
	      while (ptag) {
	        item = ptag._item
	        ptag = item ? false : ptag.parent
	      }

	    // cross browser event fix
	    e = e || window.event

	    // ignore error on some browsers
	    try {
	      e.currentTarget = dom
	      if (!e.target) e.target = e.srcElement
	      if (!e.which) e.which = e.charCode || e.keyCode
	    } catch (ignored) { '' }

	    e.item = item

	    // prevent default behaviour (by default)
	    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
	      e.preventDefault && e.preventDefault()
	      e.returnValue = false
	    }

	    if (!e.preventUpdate) {
	      el = item ? getImmediateCustomParentTag(ptag) : tag
	      el.update()
	    }

	  }

	}

	// used by if- attribute
	function insertTo(root, node, before) {
	  if (root) {
	    root.insertBefore(before, node)
	    root.removeChild(node)
	  }
	}

	function update(expressions, tag) {

	  each(expressions, function(expr, i) {

	    var dom = expr.dom,
	        attrName = expr.attr,
	        value = tmpl(expr.expr, tag),
	        parent = expr.dom.parentNode

	    if (value == null) value = ''

	    // leave out riot- prefixes from strings inside textarea
	    if (parent && parent.tagName == 'TEXTAREA') value = value.replace(/riot-/g, '')

	    // no change
	    if (expr.value === value) return
	    expr.value = value

	    // text node
	    if (!attrName) return dom.nodeValue = value.toString()

	    // remove original attribute
	    remAttr(dom, attrName)
	    // event handler
	    if (isFunction(value)) {
	      setEventHandler(attrName, value, dom, tag)

	    // if- conditional
	    } else if (attrName == 'if') {
	      var stub = expr.stub

	      // add to DOM
	      if (value) {
	        if (stub) {
	          insertTo(stub.parentNode, stub, dom)
	          dom.inStub = false
	          // avoid to trigger the mount event if the tags is not visible yet
	          // maybe we can optimize this avoiding to mount the tag at all
	          if (!isInStub(dom)) {
	            walk(dom, function(el) {
	              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
	            })
	          }
	        }
	      // remove from DOM
	      } else {
	        stub = expr.stub = stub || document.createTextNode('')
	        insertTo(dom.parentNode, dom, stub)
	        dom.inStub = true
	      }
	    // show / hide
	    } else if (/^(show|hide)$/.test(attrName)) {
	      if (attrName == 'hide') value = !value
	      dom.style.display = value ? '' : 'none'

	    // field value
	    } else if (attrName == 'value') {
	      dom.value = value

	    // <img src="{ expr }">
	    } else if (attrName.slice(0, 5) == 'riot-' && attrName != 'riot-tag') {
	      attrName = attrName.slice(5)
	      value ? dom.setAttribute(attrName, value) : remAttr(dom, attrName)

	    } else {
	      if (expr.bool) {
	        dom[attrName] = value
	        if (!value) return
	        value = attrName
	      }

	      if (typeof value !== T_OBJECT) dom.setAttribute(attrName, value)

	    }

	  })

	}
	function each(els, fn) {
	  for (var i = 0, len = (els || []).length, el; i < len; i++) {
	    el = els[i]
	    // return false -> remove current item during loop
	    if (el != null && fn(el, i) === false) i--
	  }
	  return els
	}

	function isFunction(v) {
	  return typeof v === T_FUNCTION || false   // avoid IE problems
	}

	function remAttr(dom, name) {
	  dom.removeAttribute(name)
	}

	function getTag(dom) {
	  return tagImpl[dom.getAttribute(RIOT_TAG) || dom.tagName.toLowerCase()]
	}

	function getImmediateCustomParentTag(tag) {
	  var ptag = tag
	  while (!getTag(ptag.root)) {
	    if (!ptag.parent) break
	    ptag = ptag.parent
	  }
	  return ptag
	}

	function getTagName(dom) {
	  var child = getTag(dom),
	    namedTag = dom.getAttribute('name'),
	    tagName = namedTag && namedTag.indexOf(brackets(0)) < 0 ? namedTag : child ? child.name : dom.tagName.toLowerCase()

	  return tagName
	}

	function extend(src) {
	  var obj, args = arguments
	  for (var i = 1; i < args.length; ++i) {
	    if ((obj = args[i])) {
	      for (var key in obj) {      // eslint-disable-line guard-for-in
	        src[key] = obj[key]
	      }
	    }
	  }
	  return src
	}

	// with this function we avoid that the current Tag methods get overridden
	function cleanUpData(data) {
	  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

	  var o = {}
	  for (var key in data) {
	    if (!~RESERVED_WORDS_BLACKLIST.indexOf(key))
	      o[key] = data[key]
	  }
	  return o
	}

	function mkdom(template) {
	  var checkie = ieVersion && ieVersion < 10,
	      matches = /^\s*<([\w-]+)/.exec(template),
	      tagName = matches ? matches[1].toLowerCase() : '',
	      rootTag = (tagName === 'th' || tagName === 'td') ? 'tr' :
	                (tagName === 'tr' ? 'tbody' : 'div'),
	      el = mkEl(rootTag)

	  el.stub = true

	  if (checkie) {
	    if (tagName === 'optgroup')
	      optgroupInnerHTML(el, template)
	    else if (tagName === 'option')
	      optionInnerHTML(el, template)
	    else if (rootTag !== 'div')
	      tbodyInnerHTML(el, template, tagName)
	    else
	      checkie = 0
	  }
	  if (!checkie) el.innerHTML = template

	  return el
	}

	function walk(dom, fn) {
	  if (dom) {
	    if (fn(dom) === false) walk(dom.nextSibling, fn)
	    else {
	      dom = dom.firstChild

	      while (dom) {
	        walk(dom, fn)
	        dom = dom.nextSibling
	      }
	    }
	  }
	}

	// minimize risk: only zero or one _space_ between attr & value
	function walkAttributes(html, fn) {
	  var m,
	      re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

	  while ((m = re.exec(html))) {
	    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
	  }
	}

	function isInStub(dom) {
	  while (dom) {
	    if (dom.inStub) return true
	    dom = dom.parentNode
	  }
	  return false
	}

	function mkEl(name) {
	  return document.createElement(name)
	}

	function replaceYield (tmpl, innerHTML) {
	  return tmpl.replace(/<(yield)\/?>(<\/\1>)?/gim, innerHTML || '')
	}

	function $$(selector, ctx) {
	  return (ctx || document).querySelectorAll(selector)
	}

	function $(selector, ctx) {
	  return (ctx || document).querySelector(selector)
	}

	function inherit(parent) {
	  function Child() {}
	  Child.prototype = parent
	  return new Child()
	}

	function setNamed(dom, parent, keys) {
	  if (dom._visited) return
	  var p,
	      v = dom.getAttribute('id') || dom.getAttribute('name')

	  if (v) {
	    if (keys.indexOf(v) < 0) {
	      p = parent[v]
	      if (!p)
	        parent[v] = dom
	      else
	        isArray(p) ? p.push(dom) : (parent[v] = [p, dom])
	    }
	    dom._visited = true
	  }
	}
	/**
	 *
	 * Hacks needed for the old internet explorer versions [lower than IE10]
	 *
	 */
	/* istanbul ignore next */
	function tbodyInnerHTML(el, html, tagName) {
	  var div = mkEl('div'),
	      loops = /td|th/.test(tagName) ? 3 : 2,
	      child

	  div.innerHTML = '<table>' + html + '</table>'
	  child = div.firstChild

	  while (loops--) child = child.firstChild

	  el.appendChild(child)

	}
	/* istanbul ignore next */
	function optionInnerHTML(el, html) {
	  var opt = mkEl('option'),
	      valRegx = /value=[\"'](.+?)[\"']/,
	      selRegx = /selected=[\"'](.+?)[\"']/,
	      eachRegx = /each=[\"'](.+?)[\"']/,
	      ifRegx = /if=[\"'](.+?)[\"']/,
	      innerRegx = />([^<]*)</,
	      valuesMatch = html.match(valRegx),
	      selectedMatch = html.match(selRegx),
	      innerValue = html.match(innerRegx),
	      eachMatch = html.match(eachRegx),
	      ifMatch = html.match(ifRegx)

	  if (innerValue) opt.innerHTML = innerValue[1]
	  else opt.innerHTML = html

	  if (valuesMatch) opt.value = valuesMatch[1]
	  if (selectedMatch) opt.setAttribute('riot-selected', selectedMatch[1])
	  if (eachMatch) opt.setAttribute('each', eachMatch[1])
	  if (ifMatch) opt.setAttribute('if', ifMatch[1])

	  el.appendChild(opt)
	}
	/* istanbul ignore next */
	function optgroupInnerHTML(el, html) {
	  var opt = mkEl('optgroup'),
	      labelRegx = /label=[\"'](.+?)[\"']/,
	      elementRegx = /^<([^>]*)>/,
	      tagRegx = /^<([^ \>]*)/,
	      labelMatch = html.match(labelRegx),
	      elementMatch = html.match(elementRegx),
	      tagMatch = html.match(tagRegx),
	      innerContent = html

	  if (elementMatch) {
	    var options = html.slice(elementMatch[1].length+2, -tagMatch[1].length-3).trim()
	    innerContent = options
	  }

	  if (labelMatch) opt.setAttribute('riot-label', labelMatch[1])

	  if (innerContent) {
	    var innerOpt = mkEl('div')

	    optionInnerHTML(innerOpt, innerContent)

	    opt.appendChild(innerOpt.firstChild)
	  }

	  el.appendChild(opt)
	}

	/*
	 Virtual dom is an array of custom tags on the document.
	 Updates and unmounts propagate downwards from parent to children.
	*/

	var virtualDom = [],
	    tagImpl = {},
	    styleNode

	var RIOT_TAG = 'riot-tag'

	function injectStyle(css) {

	  if (riot.render) return // skip injection on the server

	  if (!styleNode) {
	    styleNode = mkEl('style')
	    styleNode.setAttribute('type', 'text/css')
	  }

	  var head = document.head || document.getElementsByTagName('head')[0]

	  if (styleNode.styleSheet)
	    styleNode.styleSheet.cssText += css
	  else
	    styleNode.innerHTML += css

	  if (!styleNode._rendered)
	    if (styleNode.styleSheet) {
	      document.body.appendChild(styleNode)
	    } else {
	      var rs = $('style[type=riot]')
	      if (rs) {
	        rs.parentNode.insertBefore(styleNode, rs)
	        rs.parentNode.removeChild(rs)
	      } else head.appendChild(styleNode)

	    }

	  styleNode._rendered = true

	}

	function mountTo(root, tagName, opts) {
	  var tag = tagImpl[tagName],
	      // cache the inner HTML to fix #855
	      innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

	  // clear the inner html
	  root.innerHTML = ''

	  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

	  if (tag && tag.mount) {
	    tag.mount()
	    virtualDom.push(tag)
	    return tag.on('unmount', function() {
	      virtualDom.splice(virtualDom.indexOf(tag), 1)
	    })
	  }

	}

	riot.tag = function(name, html, css, attrs, fn) {
	  if (isFunction(attrs)) {
	    fn = attrs
	    if (/^[\w\-]+\s?=/.test(css)) {
	      attrs = css
	      css = ''
	    } else attrs = ''
	  }
	  if (css) {
	    if (isFunction(css)) fn = css
	    else injectStyle(css)
	  }
	  tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
	  return name
	}

	riot.mount = function(selector, tagName, opts) {

	  var els,
	      allTags,
	      tags = []

	  // helper functions

	  function addRiotTags(arr) {
	    var list = ''
	    each(arr, function (e) {
	      list += ', *[riot-tag="'+ e.trim() + '"]'
	    })
	    return list
	  }

	  function selectAllTags() {
	    var keys = Object.keys(tagImpl)
	    return keys + addRiotTags(keys)
	  }

	  function pushTags(root) {
	    var last
	    if (root.tagName) {
	      if (tagName && (!(last = root.getAttribute(RIOT_TAG)) || last != tagName))
	        root.setAttribute(RIOT_TAG, tagName)

	      var tag = mountTo(root,
	        tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

	      if (tag) tags.push(tag)
	    }
	    else if (root.length) {
	      each(root, pushTags)   // assume nodeList
	    }
	  }

	  // ----- mount code -----

	  if (typeof tagName === T_OBJECT) {
	    opts = tagName
	    tagName = 0
	  }

	  // crawl the DOM to find the tag
	  if (typeof selector === T_STRING) {
	    if (selector === '*')
	      // select all the tags registered
	      // and also the tags found with the riot-tag attribute set
	      selector = allTags = selectAllTags()
	    else
	      // or just the ones named like the selector
	      selector += addRiotTags(selector.split(','))

	    els = $$(selector)
	  }
	  else
	    // probably you have passed already a tag or a NodeList
	    els = selector

	  // select all the registered and mount them inside their root elements
	  if (tagName === '*') {
	    // get all custom tags
	    tagName = allTags || selectAllTags()
	    // if the root els it's just a single tag
	    if (els.tagName)
	      els = $$(tagName, els)
	    else {
	      // select all the children for all the different root elements
	      var nodeList = []
	      each(els, function (_el) {
	        nodeList.push($$(tagName, _el))
	      })
	      els = nodeList
	    }
	    // get rid of the tagName
	    tagName = 0
	  }

	  if (els.tagName)
	    pushTags(els)
	  else
	    each(els, pushTags)

	  return tags
	}

	// update everything
	riot.update = function() {
	  return each(virtualDom, function(tag) {
	    tag.update()
	  })
	}

	// @deprecated
	riot.mountTo = riot.mount

	  // share methods for other riot parts, e.g. compiler
	  riot.util = { brackets: brackets, tmpl: tmpl }

	  // support CommonJS, AMD & browser
	  /* istanbul ignore next */
	  if (typeof exports === T_OBJECT)
	    module.exports = riot
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return window.riot = riot }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
	  else
	    window.riot = riot

	})(typeof window != 'undefined' ? window : void 0);


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(14);
	__webpack_require__(15);

	__webpack_require__(17);

	__webpack_require__(6);
	__webpack_require__(19);
	__webpack_require__(23);

	riot.tag('app', '<div class="mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--overlay-drawer-button"> <div class="mdl-layout__drawer"> <span class="mdl-layout-title">Chats</span> <nav class="mdl-navigation"> <chat-list title="chats"></chat-list> </nav> </div> <main class="mdl-layout__content"> <div class="page-content"> <message-box></message-box> </div> <reply-box></reply-box> </main> </div>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(7);
	__webpack_require__(11);

	var messageStore = __webpack_require__(12);

	riot.tag('message-box', '<div each="{messages}" class="{message-item: true, reply: isReply(from)}"> <div class="{mdl-shadow--2dp: true, message-item-content: true, reply: isReply(from)}"> {contents} </div> </div>', 'message-box .message-item.reply, [riot-tag="message-box"] .message-item.reply{ justify-content: flex-end; } message-box .message-item-content.reply, [riot-tag="message-box"] .message-item-content.reply{ background-color: #757575; color: rgb(250, 250, 250); }', function (opts) {
	    this.on('update', function () {
	        this.messages = messageStore.getChatById(messageStore.getOpenChatID()).messages;
	    });

	    this.on('mount', function () {
	        messageStore.on('updated', this.update);
	    });

	    this.on('unmount', function () {
	        messageStore.off('updated', this.update);
	    });

	    this.isReply = function (from) {
	        return from === 1;
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(8);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(8, function() {
				var newContent = __webpack_require__(8);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, ".message-item {\n  margin: 16px;\n  align-self: flex-start;\n  display: flex;\n  justify-content: flex-start;\n  color: #757575;\n}\n.message-item > * {\n  padding: 4px;\n}\n", ""]);

	// exports


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}

	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag('rmdl-layout-content', '<main class="mdl-layout__content"> <div class="page-content"></div> </main>', function (opts) {
	    this.on('mount', function () {
	        componentHandler.upgradeDom();
	    });
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

	var _actionsChatActions = __webpack_require__(13);

	var _actionsChatActions2 = _interopRequireDefault(_actionsChatActions);

	var chats = [{
	    id: 1,
	    user: {
	        profilePicture: 'https://avatars0.githubusercontent.com/u/7922109?v=3&s=460',
	        id: 2,
	        name: 'Ryan Clark',
	        status: 'online'
	    },
	    lastAccess: {
	        recipient: 1424469794050,
	        currentUser: 1424469794080
	    },
	    messages: [{
	        contents: 'Hey!',
	        from: 2,
	        timestamp: 1424469793023
	    }, {
	        contents: 'Hey, what\'s up?',
	        from: 1,
	        timestamp: 1424469794000
	    }]
	}, {
	    id: 2,
	    user: {
	        read: true,
	        profilePicture: 'https://avatars3.githubusercontent.com/u/2955483?v=3&s=460',
	        name: 'Jilles Soeters',
	        id: 3,
	        status: 'online'
	    },
	    lastAccess: {
	        recipient: 1424352522000,
	        currentUser: 1424352522080
	    },
	    messages: [{
	        contents: 'Want a game of ping pong?',
	        from: 3,
	        timestamp: 1424352522000
	    }]
	}, {
	    id: 3,
	    user: {
	        name: 'Todd Motto',
	        id: 4,
	        profilePicture: 'https://avatars1.githubusercontent.com/u/1655968?v=3&s=460',
	        status: 'online'
	    },
	    lastAccess: {
	        recipient: 1424423579000,
	        currentUser: 1424423574000
	    },
	    messages: [{
	        contents: 'Please follow me on twitter I\'ll pay you',
	        timestamp: 1424423579000,
	        from: 4
	    }]
	}];

	var openChatID = parseInt(chats[0].id, 10);

	var MessageStore = (function () {
	    function MessageStore() {
	        _classCallCheck(this, MessageStore);

	        riot.observable(this);
	        for (var key in _actionsChatActions2['default']) {
	            var action = _actionsChatActions2['default'][key];
	            this.on(action, this.actionHandler[action]);
	        }
	    }

	    _createClass(MessageStore, [{
	        key: 'getOpenChatID',
	        value: function getOpenChatID() {
	            return openChatID;
	        }
	    }, {
	        key: 'getChatById',
	        value: function getChatById(id) {
	            for (var i = 0; i < chats.length; i++) {
	                if (chats[i].id === id) {
	                    return chats[i];
	                }
	            }
	        }
	    }, {
	        key: 'getAllChats',
	        value: function getAllChats() {
	            return chats;
	        }
	    }]);

	    return MessageStore;
	})();

	MessageStore.prototype.actionHandler = {
	    updateOpenChatID: function updateOpenChatID(id) {
	        openChatID = id;
	        chats.forEach(function (chat) {
	            if (chat.id === id) {
	                chat.lastAccess.currentUser = +new Date();
	            }
	        });

	        this.trigger('updated');
	    },
	    sendMessage: function sendMessage(message) {
	        var _this = this;

	        chats.forEach(function (chat) {
	            if (chat.id === openChatID) {
	                chat.messages.push(message);
	                _this.trigger('updated');
	            }
	        });
	    }
	};

	var messageStore = new MessageStore();

	module.exports = messageStore;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    updateOpenChatID: 'updateOpenChatID',
	    sendMessage: 'sendMessage'
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * A component handler interface using the revealing module design pattern.
	 * More details on this design pattern here:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @author Jason Mayes.
	 */
	/* exported componentHandler */
	var componentHandler = (function() {
	  'use strict';

	  var registeredComponents_ = [];
	  var createdComponents_ = [];
	  var downgradeMethod_ = 'mdlDowngrade_';
	  var componentConfigProperty_ = 'mdlComponentConfigInternal_';

	  /**
	   * Searches registered components for a class we are interested in using.
	   * Optionally replaces a match with passed object if specified.
	   * @param {string} name The name of a class we want to use.
	   * @param {Object=} optReplace Optional object to replace match with.
	   * @return {Object | boolean}
	   * @private
	   */
	  function findRegisteredClass_(name, optReplace) {
	    for (var i = 0; i < registeredComponents_.length; i++) {
	      if (registeredComponents_[i].className === name) {
	        if (optReplace !== undefined) {
	          registeredComponents_[i] = optReplace;
	        }
	        return registeredComponents_[i];
	      }
	    }
	    return false;
	  }

	  /**
	   * Returns an array of the classNames of the upgraded classes on the element.
	   * @param {HTMLElement} element The element to fetch data from.
	   * @return {Array<string>}
	   * @private
	   */
	  function getUpgradedListOfElement_(element) {
	    var dataUpgraded = element.getAttribute('data-upgraded');
	    // Use `['']` as default value to conform the `,name,name...` style.
	    return dataUpgraded === null ? [''] : dataUpgraded.split(',');
	  }

	  /**
	   * Returns true if the given element has already been upgraded for the given
	   * class.
	   * @param {HTMLElement} element The element we want to check.
	   * @param {string} jsClass The class to check for.
	   * @return boolean
	   * @private
	   */
	  function isElementUpgraded_(element, jsClass) {
	    var upgradedList = getUpgradedListOfElement_(element);
	    return upgradedList.indexOf(jsClass) !== -1;
	  }

	  /**
	   * Searches existing DOM for elements of our component type and upgrades them
	   * if they have not already been upgraded.
	   * @param {!string=} optJsClass the programatic name of the element class we
	   * need to create a new instance of.
	   * @param {!string=} optCssClass the name of the CSS class elements of this
	   * type will have.
	   */
	  function upgradeDomInternal(optJsClass, optCssClass) {
	    if (optJsClass === undefined && optCssClass === undefined) {
	      for (var i = 0; i < registeredComponents_.length; i++) {
	        upgradeDomInternal(registeredComponents_[i].className,
	            registeredComponents_[i].cssClass);
	      }
	    } else {
	      var jsClass = /** @type {!string} */ (optJsClass);
	      if (optCssClass === undefined) {
	        var registeredClass = findRegisteredClass_(jsClass);
	        if (registeredClass) {
	          optCssClass = registeredClass.cssClass;
	        }
	      }

	      var elements = document.querySelectorAll('.' + optCssClass);
	      for (var n = 0; n < elements.length; n++) {
	        upgradeElementInternal(elements[n], jsClass);
	      }
	    }
	  }

	  /**
	   * Upgrades a specific element rather than all in the DOM.
	   * @param {HTMLElement} element The element we wish to upgrade.
	   * @param {!string=} optJsClass Optional name of the class we want to upgrade
	   * the element to.
	   */
	  function upgradeElementInternal(element, optJsClass) {
	    // Verify argument type.
	    if (!(typeof element === 'object' && element instanceof Element)) {
	      throw new Error('Invalid argument provided to upgrade MDL element.');
	    }
	    var upgradedList = getUpgradedListOfElement_(element);
	    var classesToUpgrade = [];
	    // If jsClass is not provided scan the registered components to find the
	    // ones matching the element's CSS classList.
	    if (!optJsClass) {
	      var classList = element.classList;
	      registeredComponents_.forEach(function (component) {
	        // Match CSS & Not to be upgraded & Not upgraded.
	        if (classList.contains(component.cssClass) &&
	            classesToUpgrade.indexOf(component) === -1 &&
	            !isElementUpgraded_(element, component.className)) {
	          classesToUpgrade.push(component);
	        }
	      });
	    } else if (!isElementUpgraded_(element, optJsClass)) {
	      classesToUpgrade.push(findRegisteredClass_(optJsClass));
	    }

	    // Upgrade the element for each classes.
	    for (var i = 0, n = classesToUpgrade.length, registeredClass; i < n; i++) {
	      registeredClass = classesToUpgrade[i];
	      if (registeredClass) {
	        // Mark element as upgraded.
	        upgradedList.push(registeredClass.className);
	        element.setAttribute('data-upgraded', upgradedList.join(','));
	        var instance = new registeredClass.classConstructor(element);
	        instance[componentConfigProperty_] = registeredClass;
	        createdComponents_.push(instance);
	        // Call any callbacks the user has registered with this component type.
	        for (var j = 0, m = registeredClass.callbacks.length; j < m; j++) {
	          registeredClass.callbacks[j](element);
	        }

	        if (registeredClass.widget) {
	          // Assign per element instance for control over API
	          element[registeredClass.className] = instance;
	        }
	      } else {
	        throw new Error(
	          'Unable to find a registered component for the given class.');
	      }

	      var ev = document.createEvent('Events');
	      ev.initEvent('mdl-componentupgraded', true, true);
	      element.dispatchEvent(ev);
	    }
	  }

	  /**
	   * Upgrades a specific list of elements rather than all in the DOM.
	   * @param {HTMLElement | Array<HTMLElement> | NodeList | HTMLCollection} elements
	   * The elements we wish to upgrade.
	   */
	  function upgradeElementsInternal(elements) {
	    if (!Array.isArray(elements)) {
	      if (typeof elements.item === 'function') {
	        elements = Array.prototype.slice.call(elements);
	      } else {
	        elements = [elements];
	      }
	    }
	    for (var i = 0, n = elements.length, element; i < n; i++) {
	      element = elements[i];
	      if (element instanceof HTMLElement) {
	        if (element.children.length > 0) {
	          upgradeElementsInternal(element.children);
	        }
	        upgradeElementInternal(element);
	      }
	    }
	  }

	  /**
	   * Registers a class for future use and attempts to upgrade existing DOM.
	   * @param {Object} config An object containing:
	   * {constructor: Constructor, classAsString: string, cssClass: string}
	   */
	  function registerInternal(config) {
	    var newConfig = {
	      'classConstructor': config.constructor,
	      'className': config.classAsString,
	      'cssClass': config.cssClass,
	      'widget': config.widget === undefined ? true : config.widget,
	      'callbacks': []
	    };

	    registeredComponents_.forEach(function(item) {
	      if (item.cssClass === newConfig.cssClass) {
	        throw new Error('The provided cssClass has already been registered.');
	      }
	      if (item.className === newConfig.className) {
	        throw new Error('The provided className has already been registered');
	      }
	    });

	    if (config.constructor.prototype
	        .hasOwnProperty(componentConfigProperty_)) {
	      throw new Error(
	        'MDL component classes must not have ' + componentConfigProperty_ +
	          ' defined as a property.');
	    }

	    var found = findRegisteredClass_(config.classAsString, newConfig);

	    if (!found) {
	      registeredComponents_.push(newConfig);
	    }
	  }

	  /**
	   * Allows user to be alerted to any upgrades that are performed for a given
	   * component type
	   * @param {string} jsClass The class name of the MDL component we wish
	   * to hook into for any upgrades performed.
	   * @param {!Function} callback The function to call upon an upgrade. This
	   * function should expect 1 parameter - the HTMLElement which got upgraded.
	   */
	  function registerUpgradedCallbackInternal(jsClass, callback) {
	    var regClass = findRegisteredClass_(jsClass);
	    if (regClass) {
	      regClass.callbacks.push(callback);
	    }
	  }

	  /**
	   * Upgrades all registered components found in the current DOM. This is
	   * automatically called on window load.
	   */
	  function upgradeAllRegisteredInternal() {
	    for (var n = 0; n < registeredComponents_.length; n++) {
	      upgradeDomInternal(registeredComponents_[n].className);
	    }
	  }

	  /**
	   * Finds a created component by a given DOM node.
	   *
	   * @param {!Element} node
	   * @return {*}
	   */
	  function findCreatedComponentByNodeInternal(node) {
	    for (var n = 0; n < createdComponents_.length; n++) {
	      var component = createdComponents_[n];
	      if (component.element_ === node) {
	        return component;
	      }
	    }
	  }

	  /**
	   * Check the component for the downgrade method.
	   * Execute if found.
	   * Remove component from createdComponents list.
	   *
	   * @param {*} component
	   */
	  function deconstructComponentInternal(component) {
	    if (component &&
	        component[componentConfigProperty_]
	          .classConstructor.prototype
	          .hasOwnProperty(downgradeMethod_)) {
	      component[downgradeMethod_]();
	      var componentIndex = createdComponents_.indexOf(component);
	      createdComponents_.splice(componentIndex, 1);

	      var upgrades = component.element_.getAttribute('data-upgraded').split(',');
	      var componentPlace = upgrades.indexOf(
	          component[componentConfigProperty_].classAsString);
	      upgrades.splice(componentPlace, 1);
	      component.element_.setAttribute('data-upgraded', upgrades.join(','));

	      var ev = document.createEvent('Events');
	      ev.initEvent('mdl-componentdowngraded', true, true);
	      component.element_.dispatchEvent(ev);
	    }
	  }

	  /**
	   * Downgrade either a given node, an array of nodes, or a NodeList.
	   *
	   * @param {*} nodes
	   */
	  function downgradeNodesInternal(nodes) {
	    var downgradeNode = function(node) {
	      deconstructComponentInternal(findCreatedComponentByNodeInternal(node));
	    };
	    if (nodes instanceof Array || nodes instanceof NodeList) {
	      for (var n = 0; n < nodes.length; n++) {
	        downgradeNode(nodes[n]);
	      }
	    } else if (nodes instanceof Node) {
	      downgradeNode(nodes);
	    } else {
	      throw new Error('Invalid argument provided to downgrade MDL nodes.');
	    }
	  }

	  // Now return the functions that should be made public with their publicly
	  // facing names...
	  return {
	    upgradeDom: upgradeDomInternal,
	    upgradeElement: upgradeElementInternal,
	    upgradeElements: upgradeElementsInternal,
	    upgradeAllRegistered: upgradeAllRegisteredInternal,
	    registerUpgradedCallback: registerUpgradedCallbackInternal,
	    register: registerInternal,
	    downgradeElements: downgradeNodesInternal
	  };
	})();

	window.addEventListener('load', function() {
	  'use strict';

	  /**
	   * Performs a "Cutting the mustard" test. If the browser supports the features
	   * tested, adds a mdl-js class to the <html> element. It then upgrades all MDL
	   * components requiring JavaScript.
	   */
	  if ('classList' in document.createElement('div') &&
	      'querySelector' in document &&
	      'addEventListener' in window && Array.prototype.forEach) {
	    document.documentElement.classList.add('mdl-js');
	    componentHandler.upgradeAllRegistered();
	  } else {
	    componentHandler.upgradeElement =
	        componentHandler.register = function() {};
	  }
	});

	// Source: https://github.com/darius/requestAnimationFrame/blob/master/requestAnimationFrame.js
	// Adapted from https://gist.github.com/paulirish/1579671 which derived from
	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller.
	// Fixes from Paul Irish, Tino Zijdel, Andrew Mao, Klemen Slavič, Darius Bacon

	// MIT license

	(function() {
	'use strict';

	if (!Date.now) {
	  Date.now = function() { return new Date().getTime(); };
	}

	var vendors = ['webkit', 'moz'];
	for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
	  var vp = vendors[i];
	  window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
	  window.cancelAnimationFrame = (window[vp + 'CancelAnimationFrame'] ||
	  window[vp + 'CancelRequestAnimationFrame']);
	}

	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
	  var lastTime = 0;
	  window.requestAnimationFrame = function(callback) {
	      var now = Date.now();
	      var nextTime = Math.max(lastTime + 16, now);
	      return setTimeout(function() { callback(lastTime = nextTime); },
	                        nextTime - now);
	    };
	  window.cancelAnimationFrame = clearTimeout;
	}

	})();


	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Button MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialButton(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialButton.prototype.Constant_ = {
	  // None for now.
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialButton.prototype.CssClasses_ = {
	  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_CONTAINER: 'mdl-button__ripple-container',
	  RIPPLE: 'mdl-ripple'
	};

	/**
	 * Handle blur of element.
	 * @param {HTMLElement} element The instance of a button we want to blur.
	 * @private
	 */
	MaterialButton.prototype.blurHandler = function(event) {
	  'use strict';

	  if (event) {
	    this.element_.blur();
	  }
	};

	// Public methods.

	/**
	 * Disable button.
	 * @public
	 */
	MaterialButton.prototype.disable = function() {
	  'use strict';

	  this.element_.disabled = true;
	};

	/**
	 * Enable button.
	 * @public
	 */
	MaterialButton.prototype.enable = function() {
	  'use strict';

	  this.element_.disabled = false;
	};

	/**
	 * Initialize element.
	 */
	MaterialButton.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	      var rippleContainer = document.createElement('span');
	      rippleContainer.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	      this.rippleElement_ = document.createElement('span');
	      this.rippleElement_.classList.add(this.CssClasses_.RIPPLE);
	      rippleContainer.appendChild(this.rippleElement_);
	      this.boundRippleBlurHandler = this.blurHandler.bind(this);
	      this.rippleElement_.addEventListener('mouseup', this.boundRippleBlurHandler);
	      this.element_.appendChild(rippleContainer);
	    }
	    this.boundButtonBlurHandler = this.blurHandler.bind(this);
	    this.element_.addEventListener('mouseup', this.boundButtonBlurHandler);
	    this.element_.addEventListener('mouseleave', this.boundButtonBlurHandler);
	  }
	};

	/**
	 * Downgrade the element.
	 */
	MaterialButton.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  if (this.rippleElement_) {
	    this.rippleElement_.removeEventListener('mouseup', this.boundRippleBlurHandler);
	  }
	  this.element_.removeEventListener('mouseup', this.boundButtonBlurHandler);
	  this.element_.removeEventListener('mouseleave', this.boundButtonBlurHandler);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialButton,
	  classAsString: 'MaterialButton',
	  cssClass: 'mdl-js-button',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Checkbox MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialCheckbox(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialCheckbox.prototype.Constant_ = {
	  TINY_TIMEOUT: 0.001
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialCheckbox.prototype.CssClasses_ = {
	  INPUT: 'mdl-checkbox__input',
	  BOX_OUTLINE: 'mdl-checkbox__box-outline',
	  FOCUS_HELPER: 'mdl-checkbox__focus-helper',
	  TICK_OUTLINE: 'mdl-checkbox__tick-outline',
	  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE_CONTAINER: 'mdl-checkbox__ripple-container',
	  RIPPLE_CENTER: 'mdl-ripple--center',
	  RIPPLE: 'mdl-ripple',
	  IS_FOCUSED: 'is-focused',
	  IS_DISABLED: 'is-disabled',
	  IS_CHECKED: 'is-checked',
	  IS_UPGRADED: 'is-upgraded'
	};

	/**
	 * Handle change of state.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialCheckbox.prototype.onChange_ = function(event) {
	  'use strict';

	  this.updateClasses_();
	};

	/**
	 * Handle focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialCheckbox.prototype.onFocus_ = function(event) {
	  'use strict';

	  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle lost focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialCheckbox.prototype.onBlur_ = function(event) {
	  'use strict';

	  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle mouseup.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialCheckbox.prototype.onMouseUp_ = function(event) {
	  'use strict';

	  this.blur_();
	};

	/**
	 * Handle class updates.
	 * @param {HTMLElement} button The button whose classes we should update.
	 * @param {HTMLElement} label The label whose classes we should update.
	 * @private
	 */
	MaterialCheckbox.prototype.updateClasses_ = function() {
	  'use strict';
	  this.checkDisabled();
	  this.checkToggleState();
	};

	/**
	 * Add blur.
	 * @private
	 */
	MaterialCheckbox.prototype.blur_ = function(event) {
	  'use strict';

	  // TODO: figure out why there's a focus event being fired after our blur,
	  // so that we can avoid this hack.
	  window.setTimeout(function() {
	    this.inputElement_.blur();
	  }.bind(this), this.Constant_.TINY_TIMEOUT);
	};

	// Public methods.

	/**
	* Check the inputs toggle state and update display.
	* @public
	*/
	MaterialCheckbox.prototype.checkToggleState = function() {
	  'use strict';
	  if (this.inputElement_.checked) {
	    this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	  }
	};

	/**
	* Check the inputs disabled state and update display.
	* @public
	*/
	MaterialCheckbox.prototype.checkDisabled = function() {
	  'use strict';
	  if (this.inputElement_.disabled) {
	    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	  }
	};

	/**
	 * Disable checkbox.
	 * @public
	 */
	MaterialCheckbox.prototype.disable = function() {
	  'use strict';

	  this.inputElement_.disabled = true;
	  this.updateClasses_();
	};

	/**
	 * Enable checkbox.
	 * @public
	 */
	MaterialCheckbox.prototype.enable = function() {
	  'use strict';

	  this.inputElement_.disabled = false;
	  this.updateClasses_();
	};

	/**
	 * Check checkbox.
	 * @public
	 */
	MaterialCheckbox.prototype.check = function() {
	  'use strict';

	  this.inputElement_.checked = true;
	  this.updateClasses_();
	};

	/**
	 * Uncheck checkbox.
	 * @public
	 */
	MaterialCheckbox.prototype.uncheck = function() {
	  'use strict';

	  this.inputElement_.checked = false;
	  this.updateClasses_();
	};

	/**
	 * Initialize element.
	 */
	MaterialCheckbox.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.inputElement_ = this.element_.querySelector('.' +
	        this.CssClasses_.INPUT);

	    var boxOutline = document.createElement('span');
	    boxOutline.classList.add(this.CssClasses_.BOX_OUTLINE);

	    var tickContainer = document.createElement('span');
	    tickContainer.classList.add(this.CssClasses_.FOCUS_HELPER);

	    var tickOutline = document.createElement('span');
	    tickOutline.classList.add(this.CssClasses_.TICK_OUTLINE);

	    boxOutline.appendChild(tickOutline);

	    this.element_.appendChild(tickContainer);
	    this.element_.appendChild(boxOutline);

	    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	      this.rippleContainerElement_ = document.createElement('span');
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	      this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	      this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

	      var ripple = document.createElement('span');
	      ripple.classList.add(this.CssClasses_.RIPPLE);

	      this.rippleContainerElement_.appendChild(ripple);
	      this.element_.appendChild(this.rippleContainerElement_);
	    }
	    this.boundInputOnChange = this.onChange_.bind(this);
	    this.boundInputOnFocus = this.onFocus_.bind(this);
	    this.boundInputOnBlur = this.onBlur_.bind(this);
	    this.boundElementMouseUp = this.onMouseUp_.bind(this);
	    this.inputElement_.addEventListener('change', this.boundInputOnChange);
	    this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	    this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	    this.element_.addEventListener('mouseup', this.boundElementMouseUp);

	    this.updateClasses_();
	    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	/*
	* Downgrade the component.
	*/
	MaterialCheckbox.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  if (this.rippleContainerElement_) {
	    this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
	  }
	  this.inputElement_.removeEventListener('change', this.boundInputOnChange);
	  this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
	  this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
	  this.element_.removeEventListener('mouseup', this.boundElementMouseUp);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialCheckbox,
	  classAsString: 'MaterialCheckbox',
	  cssClass: 'mdl-js-checkbox',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for icon toggle MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialIconToggle(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialIconToggle.prototype.Constant_ = {
	  TINY_TIMEOUT: 0.001
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialIconToggle.prototype.CssClasses_ = {
	  INPUT: 'mdl-icon-toggle__input',
	  JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE_CONTAINER: 'mdl-icon-toggle__ripple-container',
	  RIPPLE_CENTER: 'mdl-ripple--center',
	  RIPPLE: 'mdl-ripple',
	  IS_FOCUSED: 'is-focused',
	  IS_DISABLED: 'is-disabled',
	  IS_CHECKED: 'is-checked'
	};

	/**
	 * Handle change of state.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialIconToggle.prototype.onChange_ = function(event) {
	  'use strict';

	  this.updateClasses_();
	};

	/**
	 * Handle focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialIconToggle.prototype.onFocus_ = function(event) {
	  'use strict';

	  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle lost focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialIconToggle.prototype.onBlur_ = function(event) {
	  'use strict';

	  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle mouseup.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialIconToggle.prototype.onMouseUp_ = function(event) {
	  'use strict';

	  this.blur_();
	};

	/**
	 * Handle class updates.
	 * @param {HTMLElement} button The button whose classes we should update.
	 * @param {HTMLElement} label The label whose classes we should update.
	 * @private
	 */
	MaterialIconToggle.prototype.updateClasses_ = function() {
	  'use strict';
	  this.checkDisabled();
	  this.checkToggleState();
	};

	/**
	 * Add blur.
	 * @private
	 */
	MaterialIconToggle.prototype.blur_ = function(event) {
	  'use strict';

	  // TODO: figure out why there's a focus event being fired after our blur,
	  // so that we can avoid this hack.
	  window.setTimeout(function() {
	    this.inputElement_.blur();
	  }.bind(this), this.Constant_.TINY_TIMEOUT);
	};

	// Public methods.

	/**
	* Check the inputs toggle state and update display.
	* @public
	*/
	MaterialIconToggle.prototype.checkToggleState = function() {
	  'use strict';
	  if (this.inputElement_.checked) {
	    this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	  }
	};

	/**
	* Check the inputs disabled state and update display.
	* @public
	*/
	MaterialIconToggle.prototype.checkDisabled = function() {
	  'use strict';
	  if (this.inputElement_.disabled) {
	    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	  }
	};

	/**
	 * Disable icon toggle.
	 * @public
	 */
	MaterialIconToggle.prototype.disable = function() {
	  'use strict';

	  this.inputElement_.disabled = true;
	  this.updateClasses_();
	};

	/**
	 * Enable icon toggle.
	 * @public
	 */
	MaterialIconToggle.prototype.enable = function() {
	  'use strict';

	  this.inputElement_.disabled = false;
	  this.updateClasses_();
	};

	/**
	 * Check icon toggle.
	 * @public
	 */
	MaterialIconToggle.prototype.check = function() {
	  'use strict';

	  this.inputElement_.checked = true;
	  this.updateClasses_();
	};

	/**
	 * Uncheck icon toggle.
	 * @public
	 */
	MaterialIconToggle.prototype.uncheck = function() {
	  'use strict';

	  this.inputElement_.checked = false;
	  this.updateClasses_();
	};

	/**
	 * Initialize element.
	 */
	MaterialIconToggle.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.inputElement_ =
	        this.element_.querySelector('.' + this.CssClasses_.INPUT);

	    if (this.element_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	      this.rippleContainerElement_ = document.createElement('span');
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CONTAINER);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.JS_RIPPLE_EFFECT);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	      this.boundRippleMouseUp = this.onMouseUp_.bind(this);
	      this.rippleContainerElement_.addEventListener('mouseup', this.boundRippleMouseUp);

	      var ripple = document.createElement('span');
	      ripple.classList.add(this.CssClasses_.RIPPLE);

	      this.rippleContainerElement_.appendChild(ripple);
	      this.element_.appendChild(this.rippleContainerElement_);
	    }

	    this.boundInputOnChange = this.onChange_.bind(this);
	    this.boundInputOnFocus = this.onFocus_.bind(this);
	    this.boundInputOnBlur = this.onBlur_.bind(this);
	    this.boundElementOnMouseUp = this.onMouseUp_.bind(this);
	    this.inputElement_.addEventListener('change', this.boundInputOnChange);
	    this.inputElement_.addEventListener('focus', this.boundInputOnFocus);
	    this.inputElement_.addEventListener('blur', this.boundInputOnBlur);
	    this.element_.addEventListener('mouseup', this.boundElementOnMouseUp);

	    this.updateClasses_();
	    this.element_.classList.add('is-upgraded');
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialIconToggle.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  if (this.rippleContainerElement_) {
	    this.rippleContainerElement_.removeEventListener('mouseup', this.boundRippleMouseUp);
	  }
	  this.inputElement_.removeEventListener('change', this.boundInputOnChange);
	  this.inputElement_.removeEventListener('focus', this.boundInputOnFocus);
	  this.inputElement_.removeEventListener('blur', this.boundInputOnBlur);
	  this.element_.removeEventListener('mouseup', this.boundElementOnMouseUp);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialIconToggle,
	  classAsString: 'MaterialIconToggle',
	  cssClass: 'mdl-js-icon-toggle',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for dropdown MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialMenu(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialMenu.prototype.Constant_ = {
	  // Total duration of the menu animation.
	  TRANSITION_DURATION_SECONDS: 0.3,
	  // The fraction of the total duration we want to use for menu item animations.
	  TRANSITION_DURATION_FRACTION: 0.8,
	  // How long the menu stays open after choosing an option (so the user can see
	  // the ripple).
	  CLOSE_TIMEOUT: 150
	};

	/**
	 * Keycodes, for code readability.
	 * @enum {number}
	 * @private
	 */
	MaterialMenu.prototype.Keycodes_ = {
	  ENTER: 13,
	  ESCAPE: 27,
	  SPACE: 32,
	  UP_ARROW: 38,
	  DOWN_ARROW: 40
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialMenu.prototype.CssClasses_ = {
	  CONTAINER: 'mdl-menu__container',
	  OUTLINE: 'mdl-menu__outline',
	  ITEM: 'mdl-menu__item',
	  ITEM_RIPPLE_CONTAINER: 'mdl-menu__item-ripple-container',
	  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE: 'mdl-ripple',
	  // Statuses
	  IS_UPGRADED: 'is-upgraded',
	  IS_VISIBLE: 'is-visible',
	  IS_ANIMATING: 'is-animating',
	  // Alignment options
	  BOTTOM_LEFT: 'mdl-menu--bottom-left',  // This is the default.
	  BOTTOM_RIGHT: 'mdl-menu--bottom-right',
	  TOP_LEFT: 'mdl-menu--top-left',
	  TOP_RIGHT: 'mdl-menu--top-right',
	  UNALIGNED: 'mdl-menu--unaligned'
	};

	/**
	 * Initialize element.
	 */
	MaterialMenu.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    // Create container for the menu.
	    var container = document.createElement('div');
	    container.classList.add(this.CssClasses_.CONTAINER);
	    this.element_.parentElement.insertBefore(container, this.element_);
	    this.element_.parentElement.removeChild(this.element_);
	    container.appendChild(this.element_);
	    this.container_ = container;

	    // Create outline for the menu (shadow and background).
	    var outline = document.createElement('div');
	    outline.classList.add(this.CssClasses_.OUTLINE);
	    this.outline_ = outline;
	    container.insertBefore(outline, this.element_);

	    // Find the "for" element and bind events to it.
	    var forElId = this.element_.getAttribute('for');
	    var forEl = null;
	    if (forElId) {
	      forEl = document.getElementById(forElId);
	      if (forEl) {
	        this.forElement_ = forEl;
	        forEl.addEventListener('click', this.handleForClick_.bind(this));
	        forEl.addEventListener('keydown',
	            this.handleForKeyboardEvent_.bind(this));
	      }
	    }

	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

	    for (var i = 0; i < items.length; i++) {
	      // Add a listener to each menu item.
	      items[i].addEventListener('click', this.handleItemClick_.bind(this));
	      // Add a tab index to each menu item.
	      items[i].tabIndex = '-1';
	      // Add a keyboard listener to each menu item.
	      items[i].addEventListener('keydown',
	          this.handleItemKeyboardEvent_.bind(this));
	    }

	    // Add ripple classes to each item, if the user has enabled ripples.
	    if (this.element_.classList.contains(this.CssClasses_.RIPPLE_EFFECT)) {
	      this.element_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);

	      for (i = 0; i < items.length; i++) {
	        var item = items[i];

	        var rippleContainer = document.createElement('span');
	        rippleContainer.classList.add(this.CssClasses_.ITEM_RIPPLE_CONTAINER);

	        var ripple = document.createElement('span');
	        ripple.classList.add(this.CssClasses_.RIPPLE);
	        rippleContainer.appendChild(ripple);

	        item.appendChild(rippleContainer);
	        item.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	      }
	    }

	    // Copy alignment classes to the container, so the outline can use them.
	    if (this.element_.classList.contains(this.CssClasses_.BOTTOM_LEFT)) {
	      this.outline_.classList.add(this.CssClasses_.BOTTOM_LEFT);
	    }
	    if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	      this.outline_.classList.add(this.CssClasses_.BOTTOM_RIGHT);
	    }
	    if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	      this.outline_.classList.add(this.CssClasses_.TOP_LEFT);
	    }
	    if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	      this.outline_.classList.add(this.CssClasses_.TOP_RIGHT);
	    }
	    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	      this.outline_.classList.add(this.CssClasses_.UNALIGNED);
	    }

	    container.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	/**
	 * Handles a click on the "for" element, by positioning the menu and then
	 * toggling it.
	 * @private
	 */
	MaterialMenu.prototype.handleForClick_ = function(evt) {
	  'use strict';

	  if (this.element_ && this.forElement_) {
	    var rect = this.forElement_.getBoundingClientRect();
	    var forRect = this.forElement_.parentElement.getBoundingClientRect();

	    if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	      // Do not position the menu automatically. Requires the developer to
	      // manually specify position.
	    } else if (this.element_.classList.contains(
	        this.CssClasses_.BOTTOM_RIGHT)) {
	      // Position below the "for" element, aligned to its right.
	      this.container_.style.right = (forRect.right - rect.right) + 'px';
	      this.container_.style.top =
	          this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	      // Position above the "for" element, aligned to its left.
	      this.container_.style.left = this.forElement_.offsetLeft + 'px';
	      this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
	    } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	      // Position above the "for" element, aligned to its right.
	      this.container_.style.right = (forRect.right - rect.right) + 'px';
	      this.container_.style.bottom = (forRect.bottom - rect.top) + 'px';
	    } else {
	      // Default: position below the "for" element, aligned to its left.
	      this.container_.style.left = this.forElement_.offsetLeft + 'px';
	      this.container_.style.top =
	          this.forElement_.offsetTop + this.forElement_.offsetHeight + 'px';
	    }
	  }

	  this.toggle(evt);
	};

	/**
	 * Handles a keyboard event on the "for" element.
	 * @private
	 */
	MaterialMenu.prototype.handleForKeyboardEvent_ = function(evt) {
	  'use strict';

	  if (this.element_ && this.container_ && this.forElement_) {
	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
	      ':not([disabled])');

	    if (items && items.length > 0 &&
	        this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	      if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	        evt.preventDefault();
	        items[items.length - 1].focus();
	      } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	        evt.preventDefault();
	        items[0].focus();
	      }
	    }
	  }
	};

	/**
	 * Handles a keyboard event on an item.
	 * @private
	 */
	MaterialMenu.prototype.handleItemKeyboardEvent_ = function(evt) {
	  'use strict';

	  if (this.element_ && this.container_) {
	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM +
	      ':not([disabled])');

	    if (items && items.length > 0 &&
	        this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	      var currentIndex = Array.prototype.slice.call(items).indexOf(evt.target);

	      if (evt.keyCode === this.Keycodes_.UP_ARROW) {
	        evt.preventDefault();
	        if (currentIndex > 0) {
	          items[currentIndex - 1].focus();
	        } else {
	          items[items.length - 1].focus();
	        }
	      } else if (evt.keyCode === this.Keycodes_.DOWN_ARROW) {
	        evt.preventDefault();
	        if (items.length > currentIndex + 1) {
	          items[currentIndex + 1].focus();
	        } else {
	          items[0].focus();
	        }
	      } else if (evt.keyCode === this.Keycodes_.SPACE ||
	            evt.keyCode === this.Keycodes_.ENTER) {
	        evt.preventDefault();
	        // Send mousedown and mouseup to trigger ripple.
	        var e = new MouseEvent('mousedown');
	        evt.target.dispatchEvent(e);
	        e = new MouseEvent('mouseup');
	        evt.target.dispatchEvent(e);
	        // Send click.
	        evt.target.click();
	      } else if (evt.keyCode === this.Keycodes_.ESCAPE) {
	        evt.preventDefault();
	        this.hide();
	      }
	    }
	  }
	};

	/**
	 * Handles a click event on an item.
	 * @private
	 */
	MaterialMenu.prototype.handleItemClick_ = function(evt) {
	  'use strict';

	  if (evt.target.getAttribute('disabled') !== null) {
	    evt.stopPropagation();
	  } else {
	    // Wait some time before closing menu, so the user can see the ripple.
	    this.closing_ = true;
	    window.setTimeout(function(evt) {
	      this.hide();
	      this.closing_ = false;
	    }.bind(this), this.Constant_.CLOSE_TIMEOUT);
	  }
	};

	/**
	 * Calculates the initial clip (for opening the menu) or final clip (for closing
	 * it), and applies it. This allows us to animate from or to the correct point,
	 * that is, the point it's aligned to in the "for" element.
	 * @private
	 */
	MaterialMenu.prototype.applyClip_ = function(height, width) {
	  'use strict';

	  if (this.element_.classList.contains(this.CssClasses_.UNALIGNED)) {
	    // Do not clip.
	    this.element_.style.clip = null;
	  } else if (this.element_.classList.contains(this.CssClasses_.BOTTOM_RIGHT)) {
	    // Clip to the top right corner of the menu.
	    this.element_.style.clip =
	        'rect(0 ' + width + 'px ' + '0 ' + width + 'px)';
	  } else if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT)) {
	    // Clip to the bottom left corner of the menu.
	    this.element_.style.clip =
	        'rect(' + height + 'px 0 ' + height + 'px 0)';
	  } else if (this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	    // Clip to the bottom right corner of the menu.
	    this.element_.style.clip = 'rect(' + height + 'px ' + width + 'px ' +
	        height + 'px ' + width + 'px)';
	  } else {
	    // Default: do not clip (same as clipping to the top left corner).
	    this.element_.style.clip = null;
	  }
	};

	/**
	 * Adds an event listener to clean up after the animation ends.
	 * @private
	 */
	MaterialMenu.prototype.addAnimationEndListener_ = function() {
	  'use strict';

	  var cleanup = function () {
	    this.element_.removeEventListener('transitionend', cleanup);
	    this.element_.removeEventListener('webkitTransitionEnd', cleanup);
	    this.element_.classList.remove(this.CssClasses_.IS_ANIMATING);
	  }.bind(this);

	  // Remove animation class once the transition is done.
	  this.element_.addEventListener('transitionend', cleanup);
	  this.element_.addEventListener('webkitTransitionEnd', cleanup);
	};

	/**
	 * Displays the menu.
	 * @public
	 */
	MaterialMenu.prototype.show = function(evt) {
	  'use strict';

	  if (this.element_ && this.container_ && this.outline_) {
	    // Measure the inner element.
	    var height = this.element_.getBoundingClientRect().height;
	    var width = this.element_.getBoundingClientRect().width;

	    // Apply the inner element's size to the container and outline.
	    this.container_.style.width = width + 'px';
	    this.container_.style.height = height + 'px';
	    this.outline_.style.width = width + 'px';
	    this.outline_.style.height = height + 'px';

	    var transitionDuration = this.Constant_.TRANSITION_DURATION_SECONDS *
	        this.Constant_.TRANSITION_DURATION_FRACTION;

	    // Calculate transition delays for individual menu items, so that they fade
	    // in one at a time.
	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);
	    for (var i = 0; i < items.length; i++) {
	      var itemDelay = null;
	      if (this.element_.classList.contains(this.CssClasses_.TOP_LEFT) ||
	          this.element_.classList.contains(this.CssClasses_.TOP_RIGHT)) {
	        itemDelay = ((height - items[i].offsetTop - items[i].offsetHeight) /
	            height * transitionDuration) + 's';
	      } else {
	        itemDelay = (items[i].offsetTop / height * transitionDuration) + 's';
	      }
	      items[i].style.transitionDelay = itemDelay;
	    }

	    // Apply the initial clip to the text before we start animating.
	    this.applyClip_(height, width);

	    // Wait for the next frame, turn on animation, and apply the final clip.
	    // Also make it visible. This triggers the transitions.
	    window.requestAnimationFrame(function() {
	      this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	      this.element_.style.clip = 'rect(0 ' + width + 'px ' + height + 'px 0)';
	      this.container_.classList.add(this.CssClasses_.IS_VISIBLE);
	    }.bind(this));

	    // Clean up after the animation is complete.
	    this.addAnimationEndListener_();

	    // Add a click listener to the document, to close the menu.
	    var callback = function(e) {
	      // Check to see if the document is processing the same event that
	      // displayed the menu in the first place. If so, do nothing.
	      // Also check to see if the menu is in the process of closing itself, and
	      // do nothing in that case.
	      if (e !== evt && !this.closing_) {
	        document.removeEventListener('click', callback);
	        this.hide();
	      }
	    }.bind(this);
	    document.addEventListener('click', callback);
	  }
	};

	/**
	 * Hides the menu.
	 * @public
	 */
	MaterialMenu.prototype.hide = function() {
	  'use strict';

	  if (this.element_ && this.container_ && this.outline_) {
	    var items = this.element_.querySelectorAll('.' + this.CssClasses_.ITEM);

	    // Remove all transition delays; menu items fade out concurrently.
	    for (var i = 0; i < items.length; i++) {
	      items[i].style.transitionDelay = null;
	    }

	    // Measure the inner element.
	    var height = this.element_.getBoundingClientRect().height;
	    var width = this.element_.getBoundingClientRect().width;

	    // Turn on animation, and apply the final clip. Also make invisible.
	    // This triggers the transitions.
	    this.element_.classList.add(this.CssClasses_.IS_ANIMATING);
	    this.applyClip_(height, width);
	    this.container_.classList.remove(this.CssClasses_.IS_VISIBLE);

	    // Clean up after the animation is complete.
	    this.addAnimationEndListener_();
	  }
	};

	/**
	 * Displays or hides the menu, depending on current state.
	 * @public
	 */
	MaterialMenu.prototype.toggle = function(evt) {
	  'use strict';

	  if (this.container_.classList.contains(this.CssClasses_.IS_VISIBLE)) {
	    this.hide();
	  } else {
	    this.show(evt);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialMenu,
	  classAsString: 'MaterialMenu',
	  cssClass: 'mdl-js-menu',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Progress MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialProgress(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialProgress.prototype.Constant_ = {
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialProgress.prototype.CssClasses_ = {
	  INDETERMINATE_CLASS: 'mdl-progress__indeterminate'
	};

	MaterialProgress.prototype.setProgress = function(p) {
	  'use strict';

	  if (this.element_.classList.contains(this.CssClasses_.INDETERMINATE_CLASS)) {
	    return;
	  }

	  this.progressbar_.style.width = p + '%';
	};

	MaterialProgress.prototype.setBuffer = function(p) {
	  'use strict';

	  this.bufferbar_.style.width = p + '%';
	  this.auxbar_.style.width = (100 - p) + '%';
	};

	/**
	 * Initialize element.
	 */
	MaterialProgress.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    var el = document.createElement('div');
	    el.className = 'progressbar bar bar1';
	    this.element_.appendChild(el);
	    this.progressbar_ = el;

	    el = document.createElement('div');
	    el.className = 'bufferbar bar bar2';
	    this.element_.appendChild(el);
	    this.bufferbar_ = el;

	    el = document.createElement('div');
	    el.className = 'auxbar bar bar3';
	    this.element_.appendChild(el);
	    this.auxbar_ = el;

	    this.progressbar_.style.width = '0%';
	    this.bufferbar_.style.width = '100%';
	    this.auxbar_.style.width = '0%';

	    this.element_.classList.add('is-upgraded');
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialProgress.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  while (this.element_.firstChild) {
	    this.element_.removeChild(this.element_.firstChild);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialProgress,
	  classAsString: 'MaterialProgress',
	  cssClass: 'mdl-js-progress',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Radio MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialRadio(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialRadio.prototype.Constant_ = {
	  TINY_TIMEOUT: 0.001
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialRadio.prototype.CssClasses_ = {
	  IS_FOCUSED: 'is-focused',
	  IS_DISABLED: 'is-disabled',
	  IS_CHECKED: 'is-checked',
	  IS_UPGRADED: 'is-upgraded',
	  JS_RADIO: 'mdl-js-radio',
	  RADIO_BTN: 'mdl-radio__button',
	  RADIO_OUTER_CIRCLE: 'mdl-radio__outer-circle',
	  RADIO_INNER_CIRCLE: 'mdl-radio__inner-circle',
	  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE_CONTAINER: 'mdl-radio__ripple-container',
	  RIPPLE_CENTER: 'mdl-ripple--center',
	  RIPPLE: 'mdl-ripple'
	};

	/**
	 * Handle change of state.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRadio.prototype.onChange_ = function(event) {
	  'use strict';

	  // Since other radio buttons don't get change events, we need to look for
	  // them to update their classes.
	  var radios = document.getElementsByClassName(this.CssClasses_.JS_RADIO);
	  for (var i = 0; i < radios.length; i++) {
	    var button = radios[i].querySelector('.' + this.CssClasses_.RADIO_BTN);
	    // Different name == different group, so no point updating those.
	    if (button.getAttribute('name') === this.btnElement_.getAttribute('name')) {
	      radios[i].MaterialRadio.updateClasses_();
	    }
	  }
	};

	/**
	 * Handle focus.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRadio.prototype.onFocus_ = function(event) {
	  'use strict';

	  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle lost focus.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRadio.prototype.onBlur_ = function(event) {
	  'use strict';

	  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle mouseup.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRadio.prototype.onMouseup_ = function(event) {
	  'use strict';

	  this.blur_();
	};

	/**
	 * Update classes.
	 * @private
	 */
	MaterialRadio.prototype.updateClasses_ = function() {
	  'use strict';
	  this.checkDisabled();
	  this.checkToggleState();
	};

	/**
	 * Add blur.
	 * @private
	 */
	MaterialRadio.prototype.blur_ = function(event) {
	  'use strict';

	  // TODO: figure out why there's a focus event being fired after our blur,
	  // so that we can avoid this hack.
	  window.setTimeout(function() {
	    this.btnElement_.blur();
	  }.bind(this), this.Constant_.TINY_TIMEOUT);
	};

	// Public methods.

	/**
	* Check the components disabled state.
	* @public
	*/
	MaterialRadio.prototype.checkDisabled = function() {
	  'use strict';
	  if (this.btnElement_.disabled) {
	    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	  }
	};

	/**
	* Check the components toggled state.
	* @public
	*/
	MaterialRadio.prototype.checkToggleState = function() {
	  'use strict';
	  if (this.btnElement_.checked) {
	    this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	  }
	};

	/**
	 * Disable radio.
	 * @public
	 */
	MaterialRadio.prototype.disable = function() {
	  'use strict';

	  this.btnElement_.disabled = true;
	  this.updateClasses_();
	};

	/**
	 * Enable radio.
	 * @public
	 */
	MaterialRadio.prototype.enable = function() {
	  'use strict';

	  this.btnElement_.disabled = false;
	  this.updateClasses_();
	};

	/**
	 * Check radio.
	 * @public
	 */
	MaterialRadio.prototype.check = function() {
	  'use strict';

	  this.btnElement_.checked = true;
	  this.updateClasses_();
	};

	/**
	 * Uncheck radio.
	 * @public
	 */
	MaterialRadio.prototype.uncheck = function() {
	  'use strict';

	  this.btnElement_.checked = false;
	  this.updateClasses_();
	};

	/**
	 * Initialize element.
	 */
	MaterialRadio.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.btnElement_ = this.element_.querySelector('.' +
	        this.CssClasses_.RADIO_BTN);

	    var outerCircle = document.createElement('span');
	    outerCircle.classList.add(this.CssClasses_.RADIO_OUTER_CIRCLE);

	    var innerCircle = document.createElement('span');
	    innerCircle.classList.add(this.CssClasses_.RADIO_INNER_CIRCLE);

	    this.element_.appendChild(outerCircle);
	    this.element_.appendChild(innerCircle);

	    var rippleContainer;
	    if (this.element_.classList.contains(
	        this.CssClasses_.RIPPLE_EFFECT)) {
	      this.element_.classList.add(
	          this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	      rippleContainer = document.createElement('span');
	      rippleContainer.classList.add(
	          this.CssClasses_.RIPPLE_CONTAINER);
	      rippleContainer.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	      rippleContainer.classList.add(this.CssClasses_.RIPPLE_CENTER);
	      rippleContainer.addEventListener('mouseup', this.onMouseup_.bind(this));

	      var ripple = document.createElement('span');
	      ripple.classList.add(this.CssClasses_.RIPPLE);

	      rippleContainer.appendChild(ripple);
	      this.element_.appendChild(rippleContainer);
	    }

	    this.btnElement_.addEventListener('change', this.onChange_.bind(this));
	    this.btnElement_.addEventListener('focus', this.onFocus_.bind(this));
	    this.btnElement_.addEventListener('blur', this.onBlur_.bind(this));
	    this.element_.addEventListener('mouseup', this.onMouseup_.bind(this));

	    this.updateClasses_();
	    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialRadio,
	  classAsString: 'MaterialRadio',
	  cssClass: 'mdl-js-radio',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Slider MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialSlider(element) {
	  'use strict';

	  this.element_ = element;
	  // Browser feature detection.
	  this.isIE_ = window.navigator.msPointerEnabled;
	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialSlider.prototype.Constant_ = {
	  // None for now.
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialSlider.prototype.CssClasses_ = {
	  IE_CONTAINER: 'mdl-slider__ie-container',
	  SLIDER_CONTAINER: 'mdl-slider__container',
	  BACKGROUND_FLEX: 'mdl-slider__background-flex',
	  BACKGROUND_LOWER: 'mdl-slider__background-lower',
	  BACKGROUND_UPPER: 'mdl-slider__background-upper',
	  IS_LOWEST_VALUE: 'is-lowest-value',
	  IS_UPGRADED: 'is-upgraded'
	};

	/**
	 * Handle input on element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSlider.prototype.onInput_ = function(event) {
	  'use strict';

	  this.updateValueStyles_();
	};

	/**
	 * Handle change on element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSlider.prototype.onChange_ = function(event) {
	  'use strict';

	  this.updateValueStyles_();
	};

	/**
	 * Handle mouseup on element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSlider.prototype.onMouseUp_ = function(event) {
	  'use strict';

	  event.target.blur();
	};

	/**
	 * Handle mousedown on container element.
	 * This handler is purpose is to not require the use to click
	 * exactly on the 2px slider element, as FireFox seems to be very
	 * strict about this.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSlider.prototype.onContainerMouseDown_ = function(event) {
	  'use strict';

	  // If this click is not on the parent element (but rather some child)
	  // ignore. It may still bubble up.
	  if (event.target !== this.element_.parentElement) {
	    return;
	  }

	  // Discard the original event and create a new event that
	  // is on the slider element.
	  event.preventDefault();
	  var newEvent = new MouseEvent('mousedown', {
	    target: event.target,
	    buttons: event.buttons,
	    clientX: event.clientX,
	    clientY: this.element_.getBoundingClientRect().y
	  });
	  this.element_.dispatchEvent(newEvent);
	};

	/**
	 * Handle updating of values.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSlider.prototype.updateValueStyles_ = function(event) {
	  'use strict';

	  // Calculate and apply percentages to div structure behind slider.
	  var fraction = (this.element_.value - this.element_.min) /
	      (this.element_.max - this.element_.min);

	  if (fraction === 0) {
	    this.element_.classList.add(this.CssClasses_.IS_LOWEST_VALUE);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_LOWEST_VALUE);
	  }

	  if (!this.isIE_) {
	    this.backgroundLower_.style.flex = fraction;
	    this.backgroundLower_.style.webkitFlex = fraction;
	    this.backgroundUpper_.style.flex = 1 - fraction;
	    this.backgroundUpper_.style.webkitFlex = 1 - fraction;
	  }
	};

	// Public methods.

	/**
	 * Disable slider.
	 * @public
	 */
	MaterialSlider.prototype.disable = function() {
	  'use strict';

	  this.element_.disabled = true;
	};

	/**
	 * Enable slider.
	 * @public
	 */
	MaterialSlider.prototype.enable = function() {
	  'use strict';

	  this.element_.disabled = false;
	};

	/**
	 * Update slider value.
	 * @param {Number} value The value to which to set the control (optional).
	 * @public
	 */
	MaterialSlider.prototype.change = function(value) {
	  'use strict';

	  if (value) {
	    this.element_.value = value;
	  }
	  this.updateValueStyles_();
	};

	/**
	 * Initialize element.
	 */
	MaterialSlider.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    if (this.isIE_) {
	      // Since we need to specify a very large height in IE due to
	      // implementation limitations, we add a parent here that trims it down to
	      // a reasonable size.
	      var containerIE = document.createElement('div');
	      containerIE.classList.add(this.CssClasses_.IE_CONTAINER);
	      this.element_.parentElement.insertBefore(containerIE, this.element_);
	      this.element_.parentElement.removeChild(this.element_);
	      containerIE.appendChild(this.element_);
	    } else {
	      // For non-IE browsers, we need a div structure that sits behind the
	      // slider and allows us to style the left and right sides of it with
	      // different colors.
	      var container = document.createElement('div');
	      container.classList.add(this.CssClasses_.SLIDER_CONTAINER);
	      this.element_.parentElement.insertBefore(container, this.element_);
	      this.element_.parentElement.removeChild(this.element_);
	      container.appendChild(this.element_);
	      var backgroundFlex = document.createElement('div');
	      backgroundFlex.classList.add(this.CssClasses_.BACKGROUND_FLEX);
	      container.appendChild(backgroundFlex);
	      this.backgroundLower_ = document.createElement('div');
	      this.backgroundLower_.classList.add(this.CssClasses_.BACKGROUND_LOWER);
	      backgroundFlex.appendChild(this.backgroundLower_);
	      this.backgroundUpper_ = document.createElement('div');
	      this.backgroundUpper_.classList.add(this.CssClasses_.BACKGROUND_UPPER);
	      backgroundFlex.appendChild(this.backgroundUpper_);
	    }

	    this.boundInputHandler = this.onInput_.bind(this);
	    this.boundChangeHandler = this.onChange_.bind(this);
	    this.boundMouseUpHandler = this.onMouseUp_.bind(this);
	    this.boundContainerMouseDownHandler = this.onContainerMouseDown_.bind(this);
	    this.element_.addEventListener('input', this.boundInputHandler);
	    this.element_.addEventListener('change', this.boundChangeHandler);
	    this.element_.addEventListener('mouseup', this.boundMouseUpHandler);
	    this.element_.parentElement.addEventListener('mousedown', this.boundContainerMouseDownHandler);

	    this.updateValueStyles_();
	    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialSlider.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  this.element_.removeEventListener('input', this.boundInputHandler);
	  this.element_.removeEventListener('change', this.boundChangeHandler);
	  this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
	  this.element_.parentElement.removeEventListener('mousedown', this.boundContainerMouseDownHandler);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialSlider,
	  classAsString: 'MaterialSlider',
	  cssClass: 'mdl-js-slider',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Spinner MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 * @constructor
	 */
	function MaterialSpinner(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialSpinner.prototype.Constant_ = {
	  MDL_SPINNER_LAYER_COUNT: 4
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialSpinner.prototype.CssClasses_ = {
	  MDL_SPINNER_LAYER: 'mdl-spinner__layer',
	  MDL_SPINNER_CIRCLE_CLIPPER: 'mdl-spinner__circle-clipper',
	  MDL_SPINNER_CIRCLE: 'mdl-spinner__circle',
	  MDL_SPINNER_GAP_PATCH: 'mdl-spinner__gap-patch',
	  MDL_SPINNER_LEFT: 'mdl-spinner__left',
	  MDL_SPINNER_RIGHT: 'mdl-spinner__right'
	};

	/**
	* Auxiliary method to create a spinner layer.
	*/
	MaterialSpinner.prototype.createLayer = function(index) {
	  'use strict';

	  var layer = document.createElement('div');
	  layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER);
	  layer.classList.add(this.CssClasses_.MDL_SPINNER_LAYER + '-' + index);

	  var leftClipper = document.createElement('div');
	  leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	  leftClipper.classList.add(this.CssClasses_.MDL_SPINNER_LEFT);

	  var gapPatch = document.createElement('div');
	  gapPatch.classList.add(this.CssClasses_.MDL_SPINNER_GAP_PATCH);

	  var rightClipper = document.createElement('div');
	  rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE_CLIPPER);
	  rightClipper.classList.add(this.CssClasses_.MDL_SPINNER_RIGHT);

	  var circleOwners = [leftClipper, gapPatch, rightClipper];

	  for (var i = 0; i < circleOwners.length; i++) {
	    var circle = document.createElement('div');
	    circle.classList.add(this.CssClasses_.MDL_SPINNER_CIRCLE);
	    circleOwners[i].appendChild(circle);
	  }

	  layer.appendChild(leftClipper);
	  layer.appendChild(gapPatch);
	  layer.appendChild(rightClipper);

	  this.element_.appendChild(layer);
	};

	/**
	* Stops the spinner animation.
	* Public method for users who need to stop the spinner for any reason.
	* @public
	*/
	MaterialSpinner.prototype.stop = function() {
	  'use strict';

	  this.element_.classList.remove('is-active');
	};

	/**
	* Starts the spinner animation.
	* Public method for users who need to manually start the spinner for any reason
	* (instead of just adding the 'is-active' class to their markup).
	* @public
	*/
	MaterialSpinner.prototype.start = function() {
	  'use strict';

	  this.element_.classList.add('is-active');
	};

	/**
	 * Initialize element.
	 */
	MaterialSpinner.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    for (var i = 1; i <= this.Constant_.MDL_SPINNER_LAYER_COUNT; i++) {
	      this.createLayer(i);
	    }

	    this.element_.classList.add('is-upgraded');
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialSpinner,
	  classAsString: 'MaterialSpinner',
	  cssClass: 'mdl-js-spinner',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Checkbox MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialSwitch(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialSwitch.prototype.Constant_ = {
	  TINY_TIMEOUT: 0.001
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialSwitch.prototype.CssClasses_ = {
	  INPUT: 'mdl-switch__input',
	  TRACK: 'mdl-switch__track',
	  THUMB: 'mdl-switch__thumb',
	  FOCUS_HELPER: 'mdl-switch__focus-helper',
	  RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE_CONTAINER: 'mdl-switch__ripple-container',
	  RIPPLE_CENTER: 'mdl-ripple--center',
	  RIPPLE: 'mdl-ripple',
	  IS_FOCUSED: 'is-focused',
	  IS_DISABLED: 'is-disabled',
	  IS_CHECKED: 'is-checked'
	};

	/**
	 * Handle change of state.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSwitch.prototype.onChange_ = function(event) {
	  'use strict';

	  this.updateClasses_();
	};

	/**
	 * Handle focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSwitch.prototype.onFocus_ = function(event) {
	  'use strict';

	  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle lost focus of element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSwitch.prototype.onBlur_ = function(event) {
	  'use strict';

	  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle mouseup.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialSwitch.prototype.onMouseUp_ = function(event) {
	  'use strict';

	  this.blur_();
	};

	/**
	 * Handle class updates.
	 * @private
	 */
	MaterialSwitch.prototype.updateClasses_ = function() {
	  'use strict';
	  this.checkDisabled();
	  this.checkToggleState();
	};

	/**
	 * Add blur.
	 * @private
	 */
	MaterialSwitch.prototype.blur_ = function(event) {
	  'use strict';

	  // TODO: figure out why there's a focus event being fired after our blur,
	  // so that we can avoid this hack.
	  window.setTimeout(function() {
	    this.inputElement_.blur();
	  }.bind(this), this.Constant_.TINY_TIMEOUT);
	};

	// Public methods.

	/**
	* Check the components disabled state.
	* @public
	*/
	MaterialSwitch.prototype.checkDisabled = function() {
	  'use strict';
	  if (this.inputElement_.disabled) {
	    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	  }
	};

	/**
	* Check the components toggled state.
	* @public
	*/
	MaterialSwitch.prototype.checkToggleState = function() {
	  'use strict';
	  if (this.inputElement_.checked) {
	    this.element_.classList.add(this.CssClasses_.IS_CHECKED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_CHECKED);
	  }
	};

	/**
	 * Disable switch.
	 * @public
	 */
	MaterialSwitch.prototype.disable = function() {
	  'use strict';

	  this.inputElement_.disabled = true;
	  this.updateClasses_();
	};

	/**
	 * Enable switch.
	 * @public
	 */
	MaterialSwitch.prototype.enable = function() {
	  'use strict';

	  this.inputElement_.disabled = false;
	  this.updateClasses_();
	};

	/**
	 * Activate switch.
	 * @public
	 */
	MaterialSwitch.prototype.on = function() {
	  'use strict';

	  this.inputElement_.checked = true;
	  this.updateClasses_();
	};

	/**
	 * Deactivate switch.
	 * @public
	 */
	MaterialSwitch.prototype.off = function() {
	  'use strict';

	  this.inputElement_.checked = false;
	  this.updateClasses_();
	};

	/**
	 * Initialize element.
	 */
	MaterialSwitch.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.inputElement_ = this.element_.querySelector('.' +
	        this.CssClasses_.INPUT);

	    var track = document.createElement('div');
	    track.classList.add(this.CssClasses_.TRACK);

	    var thumb = document.createElement('div');
	    thumb.classList.add(this.CssClasses_.THUMB);

	    var focusHelper = document.createElement('span');
	    focusHelper.classList.add(this.CssClasses_.FOCUS_HELPER);

	    thumb.appendChild(focusHelper);

	    this.element_.appendChild(track);
	    this.element_.appendChild(thumb);

	    this.boundMouseUpHandler = this.onMouseUp_.bind(this);

	    if (this.element_.classList.contains(
	        this.CssClasses_.RIPPLE_EFFECT)) {
	      this.element_.classList.add(
	          this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	      this.rippleContainerElement_ = document.createElement('span');
	      this.rippleContainerElement_.classList.add(
	          this.CssClasses_.RIPPLE_CONTAINER);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_EFFECT);
	      this.rippleContainerElement_.classList.add(this.CssClasses_.RIPPLE_CENTER);
	      this.rippleContainerElement_.addEventListener('mouseup', this.boundMouseUpHandler);

	      var ripple = document.createElement('span');
	      ripple.classList.add(this.CssClasses_.RIPPLE);

	      this.rippleContainerElement_.appendChild(ripple);
	      this.element_.appendChild(this.rippleContainerElement_);
	    }

	    this.boundChangeHandler = this.onChange_.bind(this);
	    this.boundFocusHandler = this.onFocus_.bind(this);
	    this.boundBlurHandler = this.onBlur_.bind(this);

	    this.inputElement_.addEventListener('change', this.boundChangeHandler);
	    this.inputElement_.addEventListener('focus', this.boundFocusHandler);
	    this.inputElement_.addEventListener('blur', this.boundBlurHandler);
	    this.element_.addEventListener('mouseup', this.boundMouseUpHandler);

	    this.updateClasses_();
	    this.element_.classList.add('is-upgraded');
	  }
	};

	/*
	* Downgrade the component.
	*/
	MaterialSwitch.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  if (this.rippleContainerElement_) {
	    this.rippleContainerElement_.removeEventListener('mouseup', this.boundMouseUpHandler);
	  }
	  this.inputElement_.removeEventListener('change', this.boundChangeHandler);
	  this.inputElement_.removeEventListener('focus', this.boundFocusHandler);
	  this.inputElement_.removeEventListener('blur', this.boundBlurHandler);
	  this.element_.removeEventListener('mouseup', this.boundMouseUpHandler);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialSwitch,
	  classAsString: 'MaterialSwitch',
	  cssClass: 'mdl-js-switch',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Tabs MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialTabs(element) {
	  'use strict';

	  // Stores the HTML element.
	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string}
	 * @private
	 */
	MaterialTabs.prototype.Constant_ = {
	  // None at the moment.
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialTabs.prototype.CssClasses_ = {
	  TAB_CLASS: 'mdl-tabs__tab',
	  PANEL_CLASS: 'mdl-tabs__panel',
	  ACTIVE_CLASS: 'is-active',
	  UPGRADED_CLASS: 'is-upgraded',

	  MDL_JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  MDL_RIPPLE_CONTAINER: 'mdl-tabs__ripple-container',
	  MDL_RIPPLE: 'mdl-ripple',
	  MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events'
	};

	/**
	 * Handle clicks to a tabs component
	 * @private
	 */
	MaterialTabs.prototype.initTabs_ = function(e) {
	  'use strict';

	  if (this.element_.classList.contains(this.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	    this.element_.classList.add(
	      this.CssClasses_.MDL_JS_RIPPLE_EFFECT_IGNORE_EVENTS);
	  }

	  // Select element tabs, document panels
	  this.tabs_ = this.element_.querySelectorAll('.' + this.CssClasses_.TAB_CLASS);
	  this.panels_ =
	      this.element_.querySelectorAll('.' + this.CssClasses_.PANEL_CLASS);

	  // Create new tabs for each tab element
	  for (var i = 0; i < this.tabs_.length; i++) {
	    new MaterialTab(this.tabs_[i], this);
	  }

	  this.element_.classList.add(this.CssClasses_.UPGRADED_CLASS);
	};

	/**
	 * Reset tab state, dropping active classes
	 * @private
	 */
	MaterialTabs.prototype.resetTabState_ = function() {
	  'use strict';

	  for (var k = 0; k < this.tabs_.length; k++) {
	    this.tabs_[k].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	  }
	};

	/**
	 * Reset panel state, droping active classes
	 * @private
	 */
	MaterialTabs.prototype.resetPanelState_ = function() {
	  'use strict';

	  for (var j = 0; j < this.panels_.length; j++) {
	    this.panels_[j].classList.remove(this.CssClasses_.ACTIVE_CLASS);
	  }
	};

	MaterialTabs.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.initTabs_();
	  }
	};

	function MaterialTab(tab, ctx) {
	  'use strict';

	  if (tab) {
	    if (ctx.element_.classList.contains(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT)) {
	      var rippleContainer = document.createElement('span');
	      rippleContainer.classList.add(ctx.CssClasses_.MDL_RIPPLE_CONTAINER);
	      rippleContainer.classList.add(ctx.CssClasses_.MDL_JS_RIPPLE_EFFECT);
	      var ripple = document.createElement('span');
	      ripple.classList.add(ctx.CssClasses_.MDL_RIPPLE);
	      rippleContainer.appendChild(ripple);
	      tab.appendChild(rippleContainer);
	    }

	    tab.addEventListener('click', function(e) {
	      e.preventDefault();
	      var href = tab.href.split('#')[1];
	      var panel = ctx.element_.querySelector('#' + href);
	      ctx.resetTabState_();
	      ctx.resetPanelState_();
	      tab.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
	      panel.classList.add(ctx.CssClasses_.ACTIVE_CLASS);
	    });

	  }
	}

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialTabs,
	  classAsString: 'MaterialTabs',
	  cssClass: 'mdl-js-tabs'
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Textfield MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialTextfield(element) {
	  'use strict';

	  this.element_ = element;
	  this.maxRows = this.Constant_.NO_MAX_ROWS;
	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialTextfield.prototype.Constant_ = {
	  NO_MAX_ROWS: -1,
	  MAX_ROWS_ATTRIBUTE: 'maxrows'
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialTextfield.prototype.CssClasses_ = {
	  LABEL: 'mdl-textfield__label',
	  INPUT: 'mdl-textfield__input',
	  IS_DIRTY: 'is-dirty',
	  IS_FOCUSED: 'is-focused',
	  IS_DISABLED: 'is-disabled',
	  IS_INVALID: 'is-invalid',
	  IS_UPGRADED: 'is-upgraded'
	};

	/**
	 * Handle input being entered.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialTextfield.prototype.onKeyDown_ = function(event) {
	  'use strict';

	  var currentRowCount = event.target.value.split('\n').length;
	  if (event.keyCode === 13) {
	    if (currentRowCount >= this.maxRows) {
	      event.preventDefault();
	    }
	  }
	};

	/**
	 * Handle focus.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialTextfield.prototype.onFocus_ = function(event) {
	  'use strict';

	  this.element_.classList.add(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle lost focus.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialTextfield.prototype.onBlur_ = function(event) {
	  'use strict';

	  this.element_.classList.remove(this.CssClasses_.IS_FOCUSED);
	};

	/**
	 * Handle class updates.
	 * @param {HTMLElement} button The button whose classes we should update.
	 * @param {HTMLElement} label The label whose classes we should update.
	 * @private
	 */
	MaterialTextfield.prototype.updateClasses_ = function() {
	  'use strict';
	  this.checkDisabled();
	  this.checkValidity();
	  this.checkDirty();
	};

	// Public methods.

	/**
	 * Check the disabled state and update field accordingly.
	 * @public
	 */
	MaterialTextfield.prototype.checkDisabled = function() {
	  'use strict';
	  if (this.input_.disabled) {
	    this.element_.classList.add(this.CssClasses_.IS_DISABLED);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DISABLED);
	  }
	};

	/**
	 * Check the validity state and update field accordingly.
	 * @public
	 */
	MaterialTextfield.prototype.checkValidity = function() {
	  'use strict';
	  if (this.input_.validity.valid) {
	    this.element_.classList.remove(this.CssClasses_.IS_INVALID);
	  } else {
	    this.element_.classList.add(this.CssClasses_.IS_INVALID);
	  }
	};

	/**
	* Check the dirty state and update field accordingly.
	* @public
	*/
	MaterialTextfield.prototype.checkDirty = function() {
	  'use strict';
	  if (this.input_.value && this.input_.value.length > 0) {
	    this.element_.classList.add(this.CssClasses_.IS_DIRTY);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_DIRTY);
	  }
	};

	/**
	 * Disable text field.
	 * @public
	 */
	MaterialTextfield.prototype.disable = function() {
	  'use strict';

	  this.input_.disabled = true;
	  this.updateClasses_();
	};

	/**
	 * Enable text field.
	 * @public
	 */
	MaterialTextfield.prototype.enable = function() {
	  'use strict';

	  this.input_.disabled = false;
	  this.updateClasses_();
	};

	/**
	 * Update text field value.
	 * @param {String} value The value to which to set the control (optional).
	 * @public
	 */
	MaterialTextfield.prototype.change = function(value) {
	  'use strict';

	  if (value) {
	    this.input_.value = value;
	  }
	  this.updateClasses_();
	};

	/**
	 * Initialize element.
	 */
	MaterialTextfield.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    this.label_ = this.element_.querySelector('.' + this.CssClasses_.LABEL);
	    this.input_ = this.element_.querySelector('.' + this.CssClasses_.INPUT);

	    if (this.input_) {
	      if (this.input_.hasAttribute(this.Constant_.MAX_ROWS_ATTRIBUTE)) {
	        this.maxRows = parseInt(this.input_.getAttribute(
	            this.Constant_.MAX_ROWS_ATTRIBUTE), 10);
	        if (isNaN(this.maxRows)) {
	          this.maxRows = this.Constant_.NO_MAX_ROWS;
	        }
	      }

	      this.boundUpdateClassesHandler = this.updateClasses_.bind(this);
	      this.boundFocusHandler = this.onFocus_.bind(this);
	      this.boundBlurHandler = this.onBlur_.bind(this);
	      this.input_.addEventListener('input', this.boundUpdateClassesHandler);
	      this.input_.addEventListener('focus', this.boundFocusHandler);
	      this.input_.addEventListener('blur', this.boundBlurHandler);

	      if (this.maxRows !== this.Constant_.NO_MAX_ROWS) {
	        // TODO: This should handle pasting multi line text.
	        // Currently doesn't.
	        this.boundKeyDownHandler = this.onKeyDown_.bind(this);
	        this.input_.addEventListener('keydown', this.boundKeyDownHandler);
	      }

	      this.updateClasses_();
	      this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	    }
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialTextfield.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  this.input_.removeEventListener('input', this.boundUpdateClassesHandler);
	  this.input_.removeEventListener('focus', this.boundFocusHandler);
	  this.input_.removeEventListener('blur', this.boundBlurHandler);
	  if (this.boundKeyDownHandler) {
	    this.input_.removeEventListener('keydown', this.boundKeyDownHandler);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialTextfield,
	  classAsString: 'MaterialTextfield',
	  cssClass: 'mdl-js-textfield',
	  widget: true
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Tooltip MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialTooltip(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialTooltip.prototype.Constant_ = {
	  // None for now.
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialTooltip.prototype.CssClasses_ = {
	  IS_ACTIVE: 'is-active'
	};

	/**
	 * Handle mouseenter for tooltip.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialTooltip.prototype.handleMouseEnter_ = function(event) {
	  'use strict';

	  event.stopPropagation();
	  var props = event.target.getBoundingClientRect();
	  var left = props.left + (props.width / 2);
	  var marginLeft = -1 * (this.element_.offsetWidth / 2);

	  if (left + marginLeft < 0) {
	    this.element_.style.left = 0;
	    this.element_.style.marginLeft = 0;
	  } else {
	    this.element_.style.left = left + 'px';
	    this.element_.style.marginLeft = marginLeft + 'px';
	  }

	  this.element_.style.top = props.top + props.height + 10 + 'px';
	  this.element_.classList.add(this.CssClasses_.IS_ACTIVE);
	  window.addEventListener('scroll', this.boundMouseLeaveHandler, false);
	  window.addEventListener('touchmove', this.boundMouseLeaveHandler, false);
	};

	/**
	 * Handle mouseleave for tooltip.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialTooltip.prototype.handleMouseLeave_ = function(event) {
	  'use strict';

	  event.stopPropagation();
	  this.element_.classList.remove(this.CssClasses_.IS_ACTIVE);
	  window.removeEventListener('scroll', this.boundMouseLeaveHandler);
	  window.removeEventListener('touchmove', this.boundMouseLeaveHandler, false);
	};

	/**
	 * Initialize element.
	 */
	MaterialTooltip.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    var forElId = this.element_.getAttribute('for');

	    if (forElId) {
	      this.forElement_ = document.getElementById(forElId);
	    }

	    if (this.forElement_) {
	      // Tabindex needs to be set for `blur` events to be emitted
	      if (!this.forElement_.getAttribute('tabindex')) {
	        this.forElement_.setAttribute('tabindex', '0');
	      }

	      this.boundMouseEnterHandler = this.handleMouseEnter_.bind(this);
	      this.boundMouseLeaveHandler = this.handleMouseLeave_.bind(this);
	      this.forElement_.addEventListener('mouseenter', this.boundMouseEnterHandler,
	          false);
	      this.forElement_.addEventListener('click', this.boundMouseEnterHandler,
	          false);
	      this.forElement_.addEventListener('blur', this.boundMouseLeaveHandler);
	      this.forElement_.addEventListener('touchstart', this.boundMouseEnterHandler,
	          false);
	      this.forElement_.addEventListener('mouseleave', this.boundMouseLeaveHandler);
	    }
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialTooltip.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  if (this.forElement_) {
	    this.forElement_.removeEventListener('mouseenter', this.boundMouseEnterHandler, false);
	    this.forElement_.removeEventListener('click', this.boundMouseEnterHandler, false);
	    this.forElement_.removeEventListener('touchstart', this.boundMouseEnterHandler, false);
	    this.forElement_.removeEventListener('mouseleave', this.boundMouseLeaveHandler);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialTooltip,
	  classAsString: 'MaterialTooltip',
	  cssClass: 'mdl-tooltip'
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Layout MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialLayout(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialLayout.prototype.Constant_ = {
	  MAX_WIDTH: '(max-width: 1024px)',
	  TAB_SCROLL_PIXELS: 100,

	  MENU_ICON: 'menu',
	  CHEVRON_LEFT: 'chevron_left',
	  CHEVRON_RIGHT: 'chevron_right'
	};

	/**
	 * Modes.
	 * @enum {number}
	 * @private
	 */
	MaterialLayout.prototype.Mode_ = {
	  STANDARD: 0,
	  SEAMED: 1,
	  WATERFALL: 2,
	  SCROLL: 3
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialLayout.prototype.CssClasses_ = {
	  CONTAINER: 'mdl-layout__container',
	  HEADER: 'mdl-layout__header',
	  DRAWER: 'mdl-layout__drawer',
	  CONTENT: 'mdl-layout__content',
	  DRAWER_BTN: 'mdl-layout__drawer-button',

	  ICON: 'material-icons',

	  JS_RIPPLE_EFFECT: 'mdl-js-ripple-effect',
	  RIPPLE_CONTAINER: 'mdl-layout__tab-ripple-container',
	  RIPPLE: 'mdl-ripple',
	  RIPPLE_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',

	  HEADER_SEAMED: 'mdl-layout__header--seamed',
	  HEADER_WATERFALL: 'mdl-layout__header--waterfall',
	  HEADER_SCROLL: 'mdl-layout__header--scroll',

	  FIXED_HEADER: 'mdl-layout--fixed-header',
	  OBFUSCATOR: 'mdl-layout__obfuscator',

	  TAB_BAR: 'mdl-layout__tab-bar',
	  TAB_CONTAINER: 'mdl-layout__tab-bar-container',
	  TAB: 'mdl-layout__tab',
	  TAB_BAR_BUTTON: 'mdl-layout__tab-bar-button',
	  TAB_BAR_LEFT_BUTTON: 'mdl-layout__tab-bar-left-button',
	  TAB_BAR_RIGHT_BUTTON: 'mdl-layout__tab-bar-right-button',
	  PANEL: 'mdl-layout__tab-panel',

	  HAS_DRAWER: 'has-drawer',
	  HAS_TABS: 'has-tabs',
	  HAS_SCROLLING_HEADER: 'has-scrolling-header',
	  CASTING_SHADOW: 'is-casting-shadow',
	  IS_COMPACT: 'is-compact',
	  IS_SMALL_SCREEN: 'is-small-screen',
	  IS_DRAWER_OPEN: 'is-visible',
	  IS_ACTIVE: 'is-active',
	  IS_UPGRADED: 'is-upgraded',
	  IS_ANIMATING: 'is-animating',

	  ON_LARGE_SCREEN : 'mdl-layout--large-screen-only',
	  ON_SMALL_SCREEN  : 'mdl-layout--small-screen-only'

	};

	/**
	 * Handles scrolling on the content.
	 * @private
	 */
	MaterialLayout.prototype.contentScrollHandler_ = function() {
	  'use strict';

	  if (this.header_.classList.contains(this.CssClasses_.IS_ANIMATING)) {
	    return;
	  }

	  if (this.content_.scrollTop > 0 &&
	      !this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	    this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	    this.header_.classList.add(this.CssClasses_.IS_COMPACT);
	    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	  } else if (this.content_.scrollTop <= 0 &&
	      this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	    this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	    this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	  }
	};

	/**
	 * Handles changes in screen size.
	 * @private
	 */
	MaterialLayout.prototype.screenSizeHandler_ = function() {
	  'use strict';

	  if (this.screenSizeMediaQuery_.matches) {
	    this.element_.classList.add(this.CssClasses_.IS_SMALL_SCREEN);
	  } else {
	    this.element_.classList.remove(this.CssClasses_.IS_SMALL_SCREEN);
	    // Collapse drawer (if any) when moving to a large screen size.
	    if (this.drawer_) {
	      this.drawer_.classList.remove(this.CssClasses_.IS_DRAWER_OPEN);
	    }
	  }
	};

	/**
	 * Handles toggling of the drawer.
	 * @param {Element} drawer The drawer container element.
	 * @private
	 */
	MaterialLayout.prototype.drawerToggleHandler_ = function() {
	  'use strict';

	  this.drawer_.classList.toggle(this.CssClasses_.IS_DRAWER_OPEN);
	};

	/**
	 * Handles (un)setting the `is-animating` class
	 */
	MaterialLayout.prototype.headerTransitionEndHandler = function() {
	  'use strict';

	  this.header_.classList.remove(this.CssClasses_.IS_ANIMATING);
	};

	/**
	 * Handles expanding the header on click
	 */
	MaterialLayout.prototype.headerClickHandler = function() {
	  'use strict';

	  if (this.header_.classList.contains(this.CssClasses_.IS_COMPACT)) {
	    this.header_.classList.remove(this.CssClasses_.IS_COMPACT);
	    this.header_.classList.add(this.CssClasses_.IS_ANIMATING);
	  }
	};

	/**
	 * Reset tab state, dropping active classes
	 * @private
	 */
	MaterialLayout.prototype.resetTabState_ = function(tabBar) {
	  'use strict';

	  for (var k = 0; k < tabBar.length; k++) {
	    tabBar[k].classList.remove(this.CssClasses_.IS_ACTIVE);
	  }
	};

	/**
	 * Reset panel state, droping active classes
	 * @private
	 */
	MaterialLayout.prototype.resetPanelState_ = function(panels) {
	  'use strict';

	  for (var j = 0; j < panels.length; j++) {
	    panels[j].classList.remove(this.CssClasses_.IS_ACTIVE);
	  }
	};

	/**
	 * Initialize element.
	 */
	MaterialLayout.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    var container = document.createElement('div');
	    container.classList.add(this.CssClasses_.CONTAINER);
	    this.element_.parentElement.insertBefore(container, this.element_);
	    this.element_.parentElement.removeChild(this.element_);
	    container.appendChild(this.element_);

	    var directChildren = this.element_.childNodes;
	    for (var c = 0; c < directChildren.length; c++) {
	      var child = directChildren[c];
	      if (child.classList &&
	          child.classList.contains(this.CssClasses_.HEADER)) {
	        this.header_ = child;
	      }

	      if (child.classList &&
	          child.classList.contains(this.CssClasses_.DRAWER)) {
	        this.drawer_ = child;
	      }

	      if (child.classList &&
	          child.classList.contains(this.CssClasses_.CONTENT)) {
	        this.content_ = child;
	      }
	    }

	    if (this.header_) {
	      this.tabBar_ = this.header_.querySelector('.' + this.CssClasses_.TAB_BAR);
	    }

	    var mode = this.Mode_.STANDARD;

	    // Keep an eye on screen size, and add/remove auxiliary class for styling
	    // of small screens.
	    this.screenSizeMediaQuery_ = window.matchMedia(this.Constant_.MAX_WIDTH);
	    this.screenSizeMediaQuery_.addListener(this.screenSizeHandler_.bind(this));
	    this.screenSizeHandler_();

	    if (this.header_) {
	      if (this.header_.classList.contains(this.CssClasses_.HEADER_SEAMED)) {
	        mode = this.Mode_.SEAMED;
	      } else if (this.header_.classList.contains(
	          this.CssClasses_.HEADER_WATERFALL)) {
	        mode = this.Mode_.WATERFALL;
	        this.header_.addEventListener('transitionend',
	          this.headerTransitionEndHandler.bind(this));
	        this.header_.addEventListener('click',
	          this.headerClickHandler.bind(this));
	      } else if (this.header_.classList.contains(
	          this.CssClasses_.HEADER_SCROLL)) {
	        mode = this.Mode_.SCROLL;
	        container.classList.add(this.CssClasses_.HAS_SCROLLING_HEADER);
	      }

	      if (mode === this.Mode_.STANDARD) {
	        this.header_.classList.add(this.CssClasses_.CASTING_SHADOW);
	        if (this.tabBar_) {
	          this.tabBar_.classList.add(this.CssClasses_.CASTING_SHADOW);
	        }
	      } else if (mode === this.Mode_.SEAMED || mode === this.Mode_.SCROLL) {
	        this.header_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	        if (this.tabBar_) {
	          this.tabBar_.classList.remove(this.CssClasses_.CASTING_SHADOW);
	        }
	      } else if (mode === this.Mode_.WATERFALL) {
	        // Add and remove shadows depending on scroll position.
	        // Also add/remove auxiliary class for styling of the compact version of
	        // the header.
	        this.content_.addEventListener('scroll',
	            this.contentScrollHandler_.bind(this));
	        this.contentScrollHandler_();
	      }
	    }

	    // Add drawer toggling button to our layout, if we have an openable drawer.
	    if (this.drawer_) {
	      var drawerButton = document.createElement('div');
	      drawerButton.classList.add(this.CssClasses_.DRAWER_BTN);

	      if (this.drawer_.classList.contains(this.CssClasses_.ON_LARGE_SCREEN)) {
	        //If drawer has ON_LARGE_SCREEN class then add it to the drawer toggle button as well.
	        drawerButton.classList.add(this.CssClasses_.ON_LARGE_SCREEN);
	      } else if (this.drawer_.classList.contains(this.CssClasses_.ON_SMALL_SCREEN)) {
	        //If drawer has ON_SMALL_SCREEN class then add it to the drawer toggle button as well.
	        drawerButton.classList.add(this.CssClasses_.ON_SMALL_SCREEN);
	      }
	      var drawerButtonIcon = document.createElement('i');
	      drawerButtonIcon.classList.add(this.CssClasses_.ICON);
	      drawerButtonIcon.textContent = this.Constant_.MENU_ICON;
	      drawerButton.appendChild(drawerButtonIcon);
	      drawerButton.addEventListener('click',
	          this.drawerToggleHandler_.bind(this));

	      // Add a class if the layout has a drawer, for altering the left padding.
	      // Adds the HAS_DRAWER to the elements since this.header_ may or may
	      // not be present.
	      this.element_.classList.add(this.CssClasses_.HAS_DRAWER);

	      // If we have a fixed header, add the button to the header rather than
	      // the layout.
	      if (this.element_.classList.contains(this.CssClasses_.FIXED_HEADER)) {
	        this.header_.insertBefore(drawerButton, this.header_.firstChild);
	      } else {
	        this.element_.insertBefore(drawerButton, this.content_);
	      }

	      var obfuscator = document.createElement('div');
	      obfuscator.classList.add(this.CssClasses_.OBFUSCATOR);
	      this.element_.appendChild(obfuscator);
	      obfuscator.addEventListener('click',
	          this.drawerToggleHandler_.bind(this));
	    }

	    // Initialize tabs, if any.
	    if (this.header_ && this.tabBar_) {
	      this.element_.classList.add(this.CssClasses_.HAS_TABS);

	      var tabContainer = document.createElement('div');
	      tabContainer.classList.add(this.CssClasses_.TAB_CONTAINER);
	      this.header_.insertBefore(tabContainer, this.tabBar_);
	      this.header_.removeChild(this.tabBar_);

	      var leftButton = document.createElement('div');
	      leftButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	      leftButton.classList.add(this.CssClasses_.TAB_BAR_LEFT_BUTTON);
	      var leftButtonIcon = document.createElement('i');
	      leftButtonIcon.classList.add(this.CssClasses_.ICON);
	      leftButtonIcon.textContent = this.Constant_.CHEVRON_LEFT;
	      leftButton.appendChild(leftButtonIcon);
	      leftButton.addEventListener('click', function() {
	        this.tabBar_.scrollLeft -= this.Constant_.TAB_SCROLL_PIXELS;
	      }.bind(this));

	      var rightButton = document.createElement('div');
	      rightButton.classList.add(this.CssClasses_.TAB_BAR_BUTTON);
	      rightButton.classList.add(this.CssClasses_.TAB_BAR_RIGHT_BUTTON);
	      var rightButtonIcon = document.createElement('i');
	      rightButtonIcon.classList.add(this.CssClasses_.ICON);
	      rightButtonIcon.textContent = this.Constant_.CHEVRON_RIGHT;
	      rightButton.appendChild(rightButtonIcon);
	      rightButton.addEventListener('click', function() {
	        this.tabBar_.scrollLeft += this.Constant_.TAB_SCROLL_PIXELS;
	      }.bind(this));

	      tabContainer.appendChild(leftButton);
	      tabContainer.appendChild(this.tabBar_);
	      tabContainer.appendChild(rightButton);

	      // Add and remove buttons depending on scroll position.
	      var tabScrollHandler = function() {
	        if (this.tabBar_.scrollLeft > 0) {
	          leftButton.classList.add(this.CssClasses_.IS_ACTIVE);
	        } else {
	          leftButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	        }

	        if (this.tabBar_.scrollLeft <
	            this.tabBar_.scrollWidth - this.tabBar_.offsetWidth) {
	          rightButton.classList.add(this.CssClasses_.IS_ACTIVE);
	        } else {
	          rightButton.classList.remove(this.CssClasses_.IS_ACTIVE);
	        }
	      }.bind(this);

	      this.tabBar_.addEventListener('scroll', tabScrollHandler);
	      tabScrollHandler();

	      if (this.tabBar_.classList.contains(this.CssClasses_.JS_RIPPLE_EFFECT)) {
	        this.tabBar_.classList.add(this.CssClasses_.RIPPLE_IGNORE_EVENTS);
	      }

	      // Select element tabs, document panels
	      var tabs = this.tabBar_.querySelectorAll('.' + this.CssClasses_.TAB);
	      var panels = this.content_.querySelectorAll('.' + this.CssClasses_.PANEL);

	      // Create new tabs for each tab element
	      for (var i = 0; i < tabs.length; i++) {
	        new MaterialLayoutTab(tabs[i], tabs, panels, this);
	      }
	    }

	    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	function MaterialLayoutTab(tab, tabs, panels, layout) {
	  'use strict';

	  if (tab) {
	    if (layout.tabBar_.classList.contains(
	        layout.CssClasses_.JS_RIPPLE_EFFECT)) {
	      var rippleContainer = document.createElement('span');
	      rippleContainer.classList.add(layout.CssClasses_.RIPPLE_CONTAINER);
	      rippleContainer.classList.add(layout.CssClasses_.JS_RIPPLE_EFFECT);
	      var ripple = document.createElement('span');
	      ripple.classList.add(layout.CssClasses_.RIPPLE);
	      rippleContainer.appendChild(ripple);
	      tab.appendChild(rippleContainer);
	    }

	    tab.addEventListener('click', function(e) {
	      e.preventDefault();
	      var href = tab.href.split('#')[1];
	      var panel = layout.content_.querySelector('#' + href);
	      layout.resetTabState_(tabs);
	      layout.resetPanelState_(panels);
	      tab.classList.add(layout.CssClasses_.IS_ACTIVE);
	      panel.classList.add(layout.CssClasses_.IS_ACTIVE);
	    });

	  }
	}

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialLayout,
	  classAsString: 'MaterialLayout',
	  cssClass: 'mdl-js-layout'
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Data Table Card MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialDataTable(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialDataTable.prototype.Constant_ = {
	  // None at the moment.
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialDataTable.prototype.CssClasses_ = {
	  DATA_TABLE: 'mdl-data-table',
	  SELECTABLE: 'mdl-data-table--selectable',
	  IS_SELECTED: 'is-selected',
	  IS_UPGRADED: 'is-upgraded'
	};

	MaterialDataTable.prototype.selectRow_ = function(checkbox, row, rows) {
	  'use strict';

	  if (row) {
	    return function() {
	      if (checkbox.checked) {
	        row.classList.add(this.CssClasses_.IS_SELECTED);
	      } else {
	        row.classList.remove(this.CssClasses_.IS_SELECTED);
	      }
	    }.bind(this);
	  }

	  if (rows) {
	    return function() {
	      var i;
	      var el;
	      if (checkbox.checked) {
	        for (i = 0; i < rows.length; i++) {
	          el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
	          el.MaterialCheckbox.check();
	          rows[i].classList.add(this.CssClasses_.IS_SELECTED);
	        }
	      } else {
	        for (i = 0; i < rows.length; i++) {
	          el = rows[i].querySelector('td').querySelector('.mdl-checkbox');
	          el.MaterialCheckbox.uncheck();
	          rows[i].classList.remove(this.CssClasses_.IS_SELECTED);
	        }
	      }
	    }.bind(this);
	  }
	};

	MaterialDataTable.prototype.createCheckbox_ = function(row, rows) {
	  'use strict';

	  var label = document.createElement('label');
	  label.classList.add('mdl-checkbox');
	  label.classList.add('mdl-js-checkbox');
	  label.classList.add('mdl-js-ripple-effect');
	  label.classList.add('mdl-data-table__select');
	  var checkbox = document.createElement('input');
	  checkbox.type = 'checkbox';
	  checkbox.classList.add('mdl-checkbox__input');
	  if (row) {
	    checkbox.addEventListener('change', this.selectRow_(checkbox, row));
	  } else if (rows) {
	    checkbox.addEventListener('change', this.selectRow_(checkbox, null, rows));
	  }
	  label.appendChild(checkbox);
	  componentHandler.upgradeElement(label, 'MaterialCheckbox');
	  return label;
	};

	/**
	 * Initialize element.
	 */
	MaterialDataTable.prototype.init = function() {
	  'use strict';

	  if (this.element_) {

	    var firstHeader = this.element_.querySelector('th');
	    var rows = this.element_.querySelector('tbody').querySelectorAll('tr');

	    if (this.element_.classList.contains(this.CssClasses_.SELECTABLE)) {
	      var th = document.createElement('th');
	      var headerCheckbox = this.createCheckbox_(null, rows);
	      th.appendChild(headerCheckbox);
	      firstHeader.parentElement.insertBefore(th, firstHeader);

	      for (var i = 0; i < rows.length; i++) {
	        var firstCell = rows[i].querySelector('td');
	        if (firstCell) {
	          var td = document.createElement('td');
	          var rowCheckbox = this.createCheckbox_(rows[i]);
	          td.appendChild(rowCheckbox);
	          rows[i].insertBefore(td, firstCell);
	        }
	      }
	    }

	    this.element_.classList.add(this.CssClasses_.IS_UPGRADED);
	  }
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialDataTable,
	  classAsString: 'MaterialDataTable',
	  cssClass: 'mdl-js-data-table'
	});

	/**
	 * @license
	 * Copyright 2015 Google Inc. All Rights Reserved.
	 *
	 * Licensed under the Apache License, Version 2.0 (the "License");
	 * you may not use this file except in compliance with the License.
	 * You may obtain a copy of the License at
	 *
	 *      http://www.apache.org/licenses/LICENSE-2.0
	 *
	 * Unless required by applicable law or agreed to in writing, software
	 * distributed under the License is distributed on an "AS IS" BASIS,
	 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	 * See the License for the specific language governing permissions and
	 * limitations under the License.
	 */

	/**
	 * Class constructor for Ripple MDL component.
	 * Implements MDL component design pattern defined at:
	 * https://github.com/jasonmayes/mdl-component-design-pattern
	 * @param {HTMLElement} element The element that will be upgraded.
	 */
	function MaterialRipple(element) {
	  'use strict';

	  this.element_ = element;

	  // Initialize instance.
	  this.init();
	}

	/**
	 * Store constants in one place so they can be updated easily.
	 * @enum {string | number}
	 * @private
	 */
	MaterialRipple.prototype.Constant_ = {
	  INITIAL_SCALE: 'scale(0.0001, 0.0001)',
	  INITIAL_SIZE: '1px',
	  INITIAL_OPACITY: '0.4',
	  FINAL_OPACITY: '0',
	  FINAL_SCALE: ''
	};

	/**
	 * Store strings for class names defined by this component that are used in
	 * JavaScript. This allows us to simply change it in one place should we
	 * decide to modify at a later date.
	 * @enum {string}
	 * @private
	 */
	MaterialRipple.prototype.CssClasses_ = {
	  RIPPLE_CENTER: 'mdl-ripple--center',
	  RIPPLE_EFFECT_IGNORE_EVENTS: 'mdl-js-ripple-effect--ignore-events',
	  RIPPLE: 'mdl-ripple',
	  IS_ANIMATING: 'is-animating',
	  IS_VISIBLE: 'is-visible'
	};

	/**
	 * Handle mouse / finger down on element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRipple.prototype.downHandler_ = function(event) {
	  'use strict';

	  if (!this.rippleElement_.style.width && !this.rippleElement_.style.height) {
	    var rect = this.element_.getBoundingClientRect();
	    this.boundHeight = rect.height;
	    this.boundWidth = rect.width;
	    this.rippleSize_ = Math.sqrt(rect.width * rect.width +
	        rect.height * rect.height) * 2 + 2;
	    this.rippleElement_.style.width = this.rippleSize_ + 'px';
	    this.rippleElement_.style.height = this.rippleSize_ + 'px';
	  }

	  this.rippleElement_.classList.add(this.CssClasses_.IS_VISIBLE);

	  if (event.type === 'mousedown' && this.ignoringMouseDown_) {
	    this.ignoringMouseDown_ = false;
	  } else {
	    if (event.type === 'touchstart') {
	      this.ignoringMouseDown_ = true;
	    }
	    var frameCount = this.getFrameCount();
	    if (frameCount > 0) {
	      return;
	    }
	    this.setFrameCount(1);
	    var bound = event.currentTarget.getBoundingClientRect();
	    var x;
	    var y;
	    // Check if we are handling a keyboard click.
	    if (event.clientX === 0 && event.clientY === 0) {
	      x = Math.round(bound.width / 2);
	      y = Math.round(bound.height / 2);
	    } else {
	      var clientX = event.clientX ? event.clientX : event.touches[0].clientX;
	      var clientY = event.clientY ? event.clientY : event.touches[0].clientY;
	      x = Math.round(clientX - bound.left);
	      y = Math.round(clientY - bound.top);
	    }
	    this.setRippleXY(x, y);
	    this.setRippleStyles(true);
	    window.requestAnimationFrame(this.animFrameHandler.bind(this));
	  }
	};

	/**
	 * Handle mouse / finger up on element.
	 * @param {Event} event The event that fired.
	 * @private
	 */
	MaterialRipple.prototype.upHandler_ = function(event) {
	  'use strict';

	  // Don't fire for the artificial "mouseup" generated by a double-click.
	  if (event && event.detail !== 2) {
	    this.rippleElement_.classList.remove(this.CssClasses_.IS_VISIBLE);
	  }
	};

	/**
	 * Initialize element.
	 */
	MaterialRipple.prototype.init = function() {
	  'use strict';

	  if (this.element_) {
	    var recentering =
	        this.element_.classList.contains(this.CssClasses_.RIPPLE_CENTER);
	    if (!this.element_.classList.contains(
	        this.CssClasses_.RIPPLE_EFFECT_IGNORE_EVENTS)) {
	      this.rippleElement_ = this.element_.querySelector('.' +
	          this.CssClasses_.RIPPLE);
	      this.frameCount_ = 0;
	      this.rippleSize_ = 0;
	      this.x_ = 0;
	      this.y_ = 0;

	      // Touch start produces a compat mouse down event, which would cause a
	      // second ripples. To avoid that, we use this property to ignore the first
	      // mouse down after a touch start.
	      this.ignoringMouseDown_ = false;

	      this.boundDownHandler = this.downHandler_.bind(this);
	      this.element_.addEventListener('mousedown',
	        this.boundDownHandler);
	      this.element_.addEventListener('touchstart',
	          this.boundDownHandler);

	      this.boundUpHandler = this.upHandler_.bind(this);
	      this.element_.addEventListener('mouseup', this.boundUpHandler);
	      this.element_.addEventListener('mouseleave', this.boundUpHandler);
	      this.element_.addEventListener('touchend', this.boundUpHandler);
	      this.element_.addEventListener('blur', this.boundUpHandler);

	      this.getFrameCount = function() {
	        return this.frameCount_;
	      };

	      this.setFrameCount = function(fC) {
	        this.frameCount_ = fC;
	      };

	      this.getRippleElement = function() {
	        return this.rippleElement_;
	      };

	      this.setRippleXY = function(newX, newY) {
	        this.x_ = newX;
	        this.y_ = newY;
	      };

	      this.setRippleStyles = function(start) {
	        if (this.rippleElement_ !== null) {
	          var transformString;
	          var scale;
	          var size;
	          var offset = 'translate(' + this.x_ + 'px, ' + this.y_ + 'px)';

	          if (start) {
	            scale = this.Constant_.INITIAL_SCALE;
	            size = this.Constant_.INITIAL_SIZE;
	          } else {
	            scale = this.Constant_.FINAL_SCALE;
	            size = this.rippleSize_ + 'px';
	            if (recentering) {
	              offset = 'translate(' + this.boundWidth / 2 + 'px, ' +
	                this.boundHeight / 2 + 'px)';
	            }
	          }

	          transformString = 'translate(-50%, -50%) ' + offset + scale;

	          this.rippleElement_.style.webkitTransform = transformString;
	          this.rippleElement_.style.msTransform = transformString;
	          this.rippleElement_.style.transform = transformString;

	          if (start) {
	            this.rippleElement_.classList.remove(this.CssClasses_.IS_ANIMATING);
	          } else {
	            this.rippleElement_.classList.add(this.CssClasses_.IS_ANIMATING);
	          }
	        }
	      };

	      this.animFrameHandler = function() {
	        if (this.frameCount_-- > 0) {
	          window.requestAnimationFrame(this.animFrameHandler.bind(this));
	        } else {
	          this.setRippleStyles(false);
	        }
	      };
	    }
	  }
	};

	/*
	* Downgrade the component
	*/
	MaterialRipple.prototype.mdlDowngrade_ = function() {
	  'use strict';
	  this.element_.removeEventListener('mousedown',
	  this.boundDownHandler);
	  this.element_.removeEventListener('touchstart',
	      this.boundDownHandler);

	  this.element_.removeEventListener('mouseup', this.boundUpHandler);
	  this.element_.removeEventListener('mouseleave', this.boundUpHandler);
	  this.element_.removeEventListener('touchend', this.boundUpHandler);
	  this.element_.removeEventListener('blur', this.boundUpHandler);
	};

	// The component registers itself. It can assume componentHandler is available
	// in the global scope.
	componentHandler.register({
	  constructor: MaterialRipple,
	  classAsString: 'MaterialRipple',
	  cssClass: 'mdl-js-ripple-effect',
	  widget: false
	});


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(16);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(16, function() {
				var newContent = __webpack_require__(16);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, "/**\n * material-design-lite - Material Design Components in CSS, JS and HTML\n * @version v1.0.2\n * @license Apache-2.0\n * @copyright 2015 Google, Inc.\n * @link https://github.com/google/material-design-lite\n */\n@charset \"UTF-8\";\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Material Design Lite */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/*\n * What follows is the result of much research on cross-browser styling.\n * Credit left inline and big thanks to Nicolas Gallagher, Jonathan Neal,\n * Kroc Camen, and the H5BP dev community and team.\n */\n/* ==========================================================================\n   Base styles: opinionated defaults\n   ========================================================================== */\nhtml {\n  color: rgba(0,0,0, 0.87);\n  font-size: 1em;\n  line-height: 1.4; }\n\n/*\n * Remove text-shadow in selection highlight: h5bp.com/i\n * These selection rule sets have to be separate.\n * Customize the background color to match your design.\n */\n::-moz-selection {\n  background: #b3d4fc;\n  text-shadow: none; }\n\n::selection {\n  background: #b3d4fc;\n  text-shadow: none; }\n\n/*\n * A better looking default horizontal rule\n */\nhr {\n  display: block;\n  height: 1px;\n  border: 0;\n  border-top: 1px solid #ccc;\n  margin: 1em 0;\n  padding: 0; }\n\n/*\n * Remove the gap between images, videos, audio and canvas and the bottom of\n * their containers: h5bp.com/i/440\n */\naudio,\ncanvas,\nimg,\nsvg,\nvideo {\n  vertical-align: middle; }\n\n/*\n * Remove default fieldset styles.\n */\nfieldset {\n  border: 0;\n  margin: 0;\n  padding: 0; }\n\n/*\n * Allow only vertical resizing of textareas.\n */\ntextarea {\n  resize: vertical; }\n\n/* ==========================================================================\n   Browse Happy prompt\n   ========================================================================== */\n.browsehappy {\n  margin: 0.2em 0;\n  background: #ccc;\n  color: #000;\n  padding: 0.2em 0; }\n\n/* ==========================================================================\n   Author's custom styles\n   ========================================================================== */\n/* ==========================================================================\n   Helper classes\n   ========================================================================== */\n/*\n * Hide visually and from screen readers: h5bp.com/u\n */\n.hidden {\n  display: none !important;\n  visibility: hidden; }\n\n/*\n * Hide only visually, but have it available for screen readers: h5bp.com/v\n */\n.visuallyhidden {\n  border: 0;\n  clip: rect(0 0 0 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px; }\n\n/*\n * Extends the .visuallyhidden class to allow the element to be focusable\n * when navigated to via the keyboard: h5bp.com/p\n */\n.visuallyhidden.focusable:active,\n.visuallyhidden.focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto; }\n\n/*\n * Hide visually and from screen readers, but maintain layout\n */\n.invisible {\n  visibility: hidden; }\n\n/*\n * Clearfix: contain floats\n *\n * For modern browsers\n * 1. The space content is one way to avoid an Opera bug when the\n *    `contenteditable` attribute is included anywhere else in the document.\n *    Otherwise it causes space to appear at the top and bottom of elements\n *    that receive the `clearfix` class.\n * 2. The use of `table` rather than `block` is only necessary if using\n *    `:before` to contain the top-margins of child elements.\n */\n.clearfix:before,\n.clearfix:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */ }\n\n.clearfix:after {\n  clear: both; }\n\n/* ==========================================================================\n   EXAMPLE Media Queries for Responsive Design.\n   These examples override the primary ('mobile first') styles.\n   Modify as content requires.\n   ========================================================================== */\n/* ==========================================================================\n   Print styles.\n   Inlined to avoid the additional HTTP request: h5bp.com/r\n   ========================================================================== */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    /* Black prints faster: h5bp.com/s */\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  /*\n     * Don't show links that are fragment identifiers,\n     * or use the `javascript:` pseudo protocol\n     */\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\"; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group;\n    /* h5bp.com/t */ }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Remove the unwanted box around FAB buttons */\n/* More info: http://goo.gl/IPwKi */\na, .mdl-accordion, .mdl-button, .mdl-card, .mdl-checkbox, .mdl-dropdown-menu,\n.mdl-icon-toggle, .mdl-item, .mdl-radio, .mdl-slider, .mdl-switch, .mdl-tabs__tab {\n  -webkit-tap-highlight-color: transparent;\n  -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }\n\n/*\n * Make html take up the entire screen\n * Then set touch-action to avoid touch delay on mobile IE\n */\nhtml {\n  width: 100%;\n  height: 100%;\n  -ms-touch-action: manipulation;\n  touch-action: manipulation; }\n\n/*\n* Make body take up the entire screen\n* Remove body margin so layout containers don't cause extra overflow.\n*/\nbody {\n  width: 100%;\n  min-height: 100%;\n  margin: 0; }\n\n/*\n * Main display reset for IE support.\n * Source: http://weblog.west-wind.com/posts/2015/Jan/12/main-HTML5-Tag-not-working-in-Internet-Explorer-91011\n */\nmain {\n  display: block; }\n\n/*\n* Apply no display to elements with the hidden attribute.\n* IE 9 and 10 support.\n*/\n*[hidden] {\n  display: none !important; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\nhtml, body {\n  font-family: \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 20px; }\n\nh1, h2, h3, h4, h5, h6, p {\n  margin: 0;\n  padding: 0; }\n\n/**\n  * Styles for HTML elements\n  */\nh1 small, h2 small, h3 small, h4 small, h5 small, h6 small {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  opacity: 0.54;\n  font-size: 0.6em; }\n\nh1 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  margin-top: 24px;\n  margin-bottom: 24px; }\n\nh2 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 45px;\n  font-weight: 400;\n  line-height: 48px;\n  margin-top: 24px;\n  margin-bottom: 24px; }\n\nh3 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 34px;\n  font-weight: 400;\n  line-height: 40px;\n  margin-top: 24px;\n  margin-bottom: 24px; }\n\nh4 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 24px;\n  font-weight: 400;\n  line-height: 32px;\n  -moz-osx-font-smoothing: grayscale;\n  margin-top: 24px;\n  margin-bottom: 16px; }\n\nh5 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  margin-top: 24px;\n  margin-bottom: 16px; }\n\nh6 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em;\n  margin-top: 24px;\n  margin-bottom: 16px; }\n\np {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  margin-bottom: 16px; }\n\na {\n  color: rgb(255,64,129);\n  font-weight: 500; }\n\nblockquote {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  position: relative;\n  font-size: 24px;\n  font-weight: 300;\n  font-style: italic;\n  line-height: 1.35;\n  letter-spacing: 0.08em; }\n  blockquote:before {\n    position: absolute;\n    left: -0.5em;\n    content: '\\201C'; }\n  blockquote:after {\n    content: '\\201D';\n    margin-left: -0.05em; }\n\nmark {\n  background-color: #f4ff81; }\n\ndt {\n  font-weight: 700; }\n\naddress {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0;\n  font-style: normal; }\n\nul, ol {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0; }\n\n/**\n * Class Name Styles\n */\n.mdl-typography--display-4 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 112px;\n  font-weight: 300;\n  line-height: 1;\n  letter-spacing: -0.04em; }\n\n.mdl-typography--display-4-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 112px;\n  font-weight: 300;\n  line-height: 1;\n  letter-spacing: -0.04em;\n  opacity: 0.54; }\n\n.mdl-typography--display-3 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em; }\n\n.mdl-typography--display-3-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 56px;\n  font-weight: 400;\n  line-height: 1.35;\n  letter-spacing: -0.02em;\n  opacity: 0.54; }\n\n.mdl-typography--display-2 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 45px;\n  font-weight: 400;\n  line-height: 48px; }\n\n.mdl-typography--display-2-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 45px;\n  font-weight: 400;\n  line-height: 48px;\n  opacity: 0.54; }\n\n.mdl-typography--display-1 {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 34px;\n  font-weight: 400;\n  line-height: 40px; }\n\n.mdl-typography--display-1-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 34px;\n  font-weight: 400;\n  line-height: 40px;\n  opacity: 0.54; }\n\n.mdl-typography--headline {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 24px;\n  font-weight: 400;\n  line-height: 32px;\n  -moz-osx-font-smoothing: grayscale; }\n\n.mdl-typography--headline-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 24px;\n  font-weight: 400;\n  line-height: 32px;\n  -moz-osx-font-smoothing: grayscale;\n  opacity: 0.87; }\n\n.mdl-typography--title {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em; }\n\n.mdl-typography--title-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  opacity: 0.87; }\n\n.mdl-typography--subhead {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em; }\n\n.mdl-typography--subhead-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 16px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0.04em;\n  opacity: 0.87; }\n\n.mdl-typography--body-2 {\n  font-size: 14px;\n  font-weight: bold;\n  line-height: 24px;\n  letter-spacing: 0; }\n\n.mdl-typography--body-2-color-contrast {\n  font-size: 14px;\n  font-weight: bold;\n  line-height: 24px;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--body-1 {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0; }\n\n.mdl-typography--body-1-color-contrast {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--body-2-force-preferred-font {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 24px;\n  letter-spacing: 0; }\n\n.mdl-typography--body-2-force-preferred-font-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 24px;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--body-1-force-preferred-font {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0; }\n\n.mdl-typography--body-1-force-preferred-font-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--caption {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0; }\n\n.mdl-typography--caption-force-preferred-font {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0; }\n\n.mdl-typography--caption-color-contrast {\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0;\n  opacity: 0.54; }\n\n.mdl-typography--caption-force-preferred-font-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 12px;\n  font-weight: 400;\n  line-height: 1;\n  letter-spacing: 0;\n  opacity: 0.54; }\n\n.mdl-typography--menu {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0; }\n\n.mdl-typography--menu-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--button {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  line-height: 1;\n  letter-spacing: 0; }\n\n.mdl-typography--button-color-contrast {\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  line-height: 1;\n  letter-spacing: 0;\n  opacity: 0.87; }\n\n.mdl-typography--text-left {\n  text-align: left; }\n\n.mdl-typography--text-right {\n  text-align: right; }\n\n.mdl-typography--text-center {\n  text-align: center; }\n\n.mdl-typography--text-justify {\n  text-align: justify; }\n\n.mdl-typography--text-nowrap {\n  white-space: nowrap; }\n\n.mdl-typography--text-lowercase {\n  text-transform: lowercase; }\n\n.mdl-typography--text-uppercase {\n  text-transform: uppercase; }\n\n.mdl-typography--text-capitalize {\n  text-transform: capitalize; }\n\n.mdl-typography--font-thin {\n  font-weight: 200 !important; }\n\n.mdl-typography--font-light {\n  font-weight: 300 !important; }\n\n.mdl-typography--font-regular {\n  font-weight: 400 !important; }\n\n.mdl-typography--font-medium {\n  font-weight: 500 !important; }\n\n.mdl-typography--font-bold {\n  font-weight: 700 !important; }\n\n.mdl-typography--font-black {\n  font-weight: 900 !important; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-color-text--red {\n  color: rgb(244,67,54) !important; }\n\n.mdl-color--red {\n  background-color: rgb(244,67,54) !important; }\n\n.mdl-color-text--red-50 {\n  color: rgb(255,235,238) !important; }\n\n.mdl-color--red-50 {\n  background-color: rgb(255,235,238) !important; }\n\n.mdl-color-text--red-100 {\n  color: rgb(255,205,210) !important; }\n\n.mdl-color--red-100 {\n  background-color: rgb(255,205,210) !important; }\n\n.mdl-color-text--red-200 {\n  color: rgb(239,154,154) !important; }\n\n.mdl-color--red-200 {\n  background-color: rgb(239,154,154) !important; }\n\n.mdl-color-text--red-300 {\n  color: rgb(229,115,115) !important; }\n\n.mdl-color--red-300 {\n  background-color: rgb(229,115,115) !important; }\n\n.mdl-color-text--red-400 {\n  color: rgb(239,83,80) !important; }\n\n.mdl-color--red-400 {\n  background-color: rgb(239,83,80) !important; }\n\n.mdl-color-text--red-500 {\n  color: rgb(244,67,54) !important; }\n\n.mdl-color--red-500 {\n  background-color: rgb(244,67,54) !important; }\n\n.mdl-color-text--red-600 {\n  color: rgb(229,57,53) !important; }\n\n.mdl-color--red-600 {\n  background-color: rgb(229,57,53) !important; }\n\n.mdl-color-text--red-700 {\n  color: rgb(211,47,47) !important; }\n\n.mdl-color--red-700 {\n  background-color: rgb(211,47,47) !important; }\n\n.mdl-color-text--red-800 {\n  color: rgb(198,40,40) !important; }\n\n.mdl-color--red-800 {\n  background-color: rgb(198,40,40) !important; }\n\n.mdl-color-text--red-900 {\n  color: rgb(183,28,28) !important; }\n\n.mdl-color--red-900 {\n  background-color: rgb(183,28,28) !important; }\n\n.mdl-color-text--red-A100 {\n  color: rgb(255,138,128) !important; }\n\n.mdl-color--red-A100 {\n  background-color: rgb(255,138,128) !important; }\n\n.mdl-color-text--red-A200 {\n  color: rgb(255,82,82) !important; }\n\n.mdl-color--red-A200 {\n  background-color: rgb(255,82,82) !important; }\n\n.mdl-color-text--red-A400 {\n  color: rgb(255,23,68) !important; }\n\n.mdl-color--red-A400 {\n  background-color: rgb(255,23,68) !important; }\n\n.mdl-color-text--red-A700 {\n  color: rgb(213,0,0) !important; }\n\n.mdl-color--red-A700 {\n  background-color: rgb(213,0,0) !important; }\n\n.mdl-color-text--pink {\n  color: rgb(233,30,99) !important; }\n\n.mdl-color--pink {\n  background-color: rgb(233,30,99) !important; }\n\n.mdl-color-text--pink-50 {\n  color: rgb(252,228,236) !important; }\n\n.mdl-color--pink-50 {\n  background-color: rgb(252,228,236) !important; }\n\n.mdl-color-text--pink-100 {\n  color: rgb(248,187,208) !important; }\n\n.mdl-color--pink-100 {\n  background-color: rgb(248,187,208) !important; }\n\n.mdl-color-text--pink-200 {\n  color: rgb(244,143,177) !important; }\n\n.mdl-color--pink-200 {\n  background-color: rgb(244,143,177) !important; }\n\n.mdl-color-text--pink-300 {\n  color: rgb(240,98,146) !important; }\n\n.mdl-color--pink-300 {\n  background-color: rgb(240,98,146) !important; }\n\n.mdl-color-text--pink-400 {\n  color: rgb(236,64,122) !important; }\n\n.mdl-color--pink-400 {\n  background-color: rgb(236,64,122) !important; }\n\n.mdl-color-text--pink-500 {\n  color: rgb(233,30,99) !important; }\n\n.mdl-color--pink-500 {\n  background-color: rgb(233,30,99) !important; }\n\n.mdl-color-text--pink-600 {\n  color: rgb(216,27,96) !important; }\n\n.mdl-color--pink-600 {\n  background-color: rgb(216,27,96) !important; }\n\n.mdl-color-text--pink-700 {\n  color: rgb(194,24,91) !important; }\n\n.mdl-color--pink-700 {\n  background-color: rgb(194,24,91) !important; }\n\n.mdl-color-text--pink-800 {\n  color: rgb(173,20,87) !important; }\n\n.mdl-color--pink-800 {\n  background-color: rgb(173,20,87) !important; }\n\n.mdl-color-text--pink-900 {\n  color: rgb(136,14,79) !important; }\n\n.mdl-color--pink-900 {\n  background-color: rgb(136,14,79) !important; }\n\n.mdl-color-text--pink-A100 {\n  color: rgb(255,128,171) !important; }\n\n.mdl-color--pink-A100 {\n  background-color: rgb(255,128,171) !important; }\n\n.mdl-color-text--pink-A200 {\n  color: rgb(255,64,129) !important; }\n\n.mdl-color--pink-A200 {\n  background-color: rgb(255,64,129) !important; }\n\n.mdl-color-text--pink-A400 {\n  color: rgb(245,0,87) !important; }\n\n.mdl-color--pink-A400 {\n  background-color: rgb(245,0,87) !important; }\n\n.mdl-color-text--pink-A700 {\n  color: rgb(197,17,98) !important; }\n\n.mdl-color--pink-A700 {\n  background-color: rgb(197,17,98) !important; }\n\n.mdl-color-text--purple {\n  color: rgb(156,39,176) !important; }\n\n.mdl-color--purple {\n  background-color: rgb(156,39,176) !important; }\n\n.mdl-color-text--purple-50 {\n  color: rgb(243,229,245) !important; }\n\n.mdl-color--purple-50 {\n  background-color: rgb(243,229,245) !important; }\n\n.mdl-color-text--purple-100 {\n  color: rgb(225,190,231) !important; }\n\n.mdl-color--purple-100 {\n  background-color: rgb(225,190,231) !important; }\n\n.mdl-color-text--purple-200 {\n  color: rgb(206,147,216) !important; }\n\n.mdl-color--purple-200 {\n  background-color: rgb(206,147,216) !important; }\n\n.mdl-color-text--purple-300 {\n  color: rgb(186,104,200) !important; }\n\n.mdl-color--purple-300 {\n  background-color: rgb(186,104,200) !important; }\n\n.mdl-color-text--purple-400 {\n  color: rgb(171,71,188) !important; }\n\n.mdl-color--purple-400 {\n  background-color: rgb(171,71,188) !important; }\n\n.mdl-color-text--purple-500 {\n  color: rgb(156,39,176) !important; }\n\n.mdl-color--purple-500 {\n  background-color: rgb(156,39,176) !important; }\n\n.mdl-color-text--purple-600 {\n  color: rgb(142,36,170) !important; }\n\n.mdl-color--purple-600 {\n  background-color: rgb(142,36,170) !important; }\n\n.mdl-color-text--purple-700 {\n  color: rgb(123,31,162) !important; }\n\n.mdl-color--purple-700 {\n  background-color: rgb(123,31,162) !important; }\n\n.mdl-color-text--purple-800 {\n  color: rgb(106,27,154) !important; }\n\n.mdl-color--purple-800 {\n  background-color: rgb(106,27,154) !important; }\n\n.mdl-color-text--purple-900 {\n  color: rgb(74,20,140) !important; }\n\n.mdl-color--purple-900 {\n  background-color: rgb(74,20,140) !important; }\n\n.mdl-color-text--purple-A100 {\n  color: rgb(234,128,252) !important; }\n\n.mdl-color--purple-A100 {\n  background-color: rgb(234,128,252) !important; }\n\n.mdl-color-text--purple-A200 {\n  color: rgb(224,64,251) !important; }\n\n.mdl-color--purple-A200 {\n  background-color: rgb(224,64,251) !important; }\n\n.mdl-color-text--purple-A400 {\n  color: rgb(213,0,249) !important; }\n\n.mdl-color--purple-A400 {\n  background-color: rgb(213,0,249) !important; }\n\n.mdl-color-text--purple-A700 {\n  color: rgb(170,0,255) !important; }\n\n.mdl-color--purple-A700 {\n  background-color: rgb(170,0,255) !important; }\n\n.mdl-color-text--deep-purple {\n  color: rgb(103,58,183) !important; }\n\n.mdl-color--deep-purple {\n  background-color: rgb(103,58,183) !important; }\n\n.mdl-color-text--deep-purple-50 {\n  color: rgb(237,231,246) !important; }\n\n.mdl-color--deep-purple-50 {\n  background-color: rgb(237,231,246) !important; }\n\n.mdl-color-text--deep-purple-100 {\n  color: rgb(209,196,233) !important; }\n\n.mdl-color--deep-purple-100 {\n  background-color: rgb(209,196,233) !important; }\n\n.mdl-color-text--deep-purple-200 {\n  color: rgb(179,157,219) !important; }\n\n.mdl-color--deep-purple-200 {\n  background-color: rgb(179,157,219) !important; }\n\n.mdl-color-text--deep-purple-300 {\n  color: rgb(149,117,205) !important; }\n\n.mdl-color--deep-purple-300 {\n  background-color: rgb(149,117,205) !important; }\n\n.mdl-color-text--deep-purple-400 {\n  color: rgb(126,87,194) !important; }\n\n.mdl-color--deep-purple-400 {\n  background-color: rgb(126,87,194) !important; }\n\n.mdl-color-text--deep-purple-500 {\n  color: rgb(103,58,183) !important; }\n\n.mdl-color--deep-purple-500 {\n  background-color: rgb(103,58,183) !important; }\n\n.mdl-color-text--deep-purple-600 {\n  color: rgb(94,53,177) !important; }\n\n.mdl-color--deep-purple-600 {\n  background-color: rgb(94,53,177) !important; }\n\n.mdl-color-text--deep-purple-700 {\n  color: rgb(81,45,168) !important; }\n\n.mdl-color--deep-purple-700 {\n  background-color: rgb(81,45,168) !important; }\n\n.mdl-color-text--deep-purple-800 {\n  color: rgb(69,39,160) !important; }\n\n.mdl-color--deep-purple-800 {\n  background-color: rgb(69,39,160) !important; }\n\n.mdl-color-text--deep-purple-900 {\n  color: rgb(49,27,146) !important; }\n\n.mdl-color--deep-purple-900 {\n  background-color: rgb(49,27,146) !important; }\n\n.mdl-color-text--deep-purple-A100 {\n  color: rgb(179,136,255) !important; }\n\n.mdl-color--deep-purple-A100 {\n  background-color: rgb(179,136,255) !important; }\n\n.mdl-color-text--deep-purple-A200 {\n  color: rgb(124,77,255) !important; }\n\n.mdl-color--deep-purple-A200 {\n  background-color: rgb(124,77,255) !important; }\n\n.mdl-color-text--deep-purple-A400 {\n  color: rgb(101,31,255) !important; }\n\n.mdl-color--deep-purple-A400 {\n  background-color: rgb(101,31,255) !important; }\n\n.mdl-color-text--deep-purple-A700 {\n  color: rgb(98,0,234) !important; }\n\n.mdl-color--deep-purple-A700 {\n  background-color: rgb(98,0,234) !important; }\n\n.mdl-color-text--indigo {\n  color: rgb(63,81,181) !important; }\n\n.mdl-color--indigo {\n  background-color: rgb(63,81,181) !important; }\n\n.mdl-color-text--indigo-50 {\n  color: rgb(232,234,246) !important; }\n\n.mdl-color--indigo-50 {\n  background-color: rgb(232,234,246) !important; }\n\n.mdl-color-text--indigo-100 {\n  color: rgb(197,202,233) !important; }\n\n.mdl-color--indigo-100 {\n  background-color: rgb(197,202,233) !important; }\n\n.mdl-color-text--indigo-200 {\n  color: rgb(159,168,218) !important; }\n\n.mdl-color--indigo-200 {\n  background-color: rgb(159,168,218) !important; }\n\n.mdl-color-text--indigo-300 {\n  color: rgb(121,134,203) !important; }\n\n.mdl-color--indigo-300 {\n  background-color: rgb(121,134,203) !important; }\n\n.mdl-color-text--indigo-400 {\n  color: rgb(92,107,192) !important; }\n\n.mdl-color--indigo-400 {\n  background-color: rgb(92,107,192) !important; }\n\n.mdl-color-text--indigo-500 {\n  color: rgb(63,81,181) !important; }\n\n.mdl-color--indigo-500 {\n  background-color: rgb(63,81,181) !important; }\n\n.mdl-color-text--indigo-600 {\n  color: rgb(57,73,171) !important; }\n\n.mdl-color--indigo-600 {\n  background-color: rgb(57,73,171) !important; }\n\n.mdl-color-text--indigo-700 {\n  color: rgb(48,63,159) !important; }\n\n.mdl-color--indigo-700 {\n  background-color: rgb(48,63,159) !important; }\n\n.mdl-color-text--indigo-800 {\n  color: rgb(40,53,147) !important; }\n\n.mdl-color--indigo-800 {\n  background-color: rgb(40,53,147) !important; }\n\n.mdl-color-text--indigo-900 {\n  color: rgb(26,35,126) !important; }\n\n.mdl-color--indigo-900 {\n  background-color: rgb(26,35,126) !important; }\n\n.mdl-color-text--indigo-A100 {\n  color: rgb(140,158,255) !important; }\n\n.mdl-color--indigo-A100 {\n  background-color: rgb(140,158,255) !important; }\n\n.mdl-color-text--indigo-A200 {\n  color: rgb(83,109,254) !important; }\n\n.mdl-color--indigo-A200 {\n  background-color: rgb(83,109,254) !important; }\n\n.mdl-color-text--indigo-A400 {\n  color: rgb(61,90,254) !important; }\n\n.mdl-color--indigo-A400 {\n  background-color: rgb(61,90,254) !important; }\n\n.mdl-color-text--indigo-A700 {\n  color: rgb(48,79,254) !important; }\n\n.mdl-color--indigo-A700 {\n  background-color: rgb(48,79,254) !important; }\n\n.mdl-color-text--blue {\n  color: rgb(33,150,243) !important; }\n\n.mdl-color--blue {\n  background-color: rgb(33,150,243) !important; }\n\n.mdl-color-text--blue-50 {\n  color: rgb(227,242,253) !important; }\n\n.mdl-color--blue-50 {\n  background-color: rgb(227,242,253) !important; }\n\n.mdl-color-text--blue-100 {\n  color: rgb(187,222,251) !important; }\n\n.mdl-color--blue-100 {\n  background-color: rgb(187,222,251) !important; }\n\n.mdl-color-text--blue-200 {\n  color: rgb(144,202,249) !important; }\n\n.mdl-color--blue-200 {\n  background-color: rgb(144,202,249) !important; }\n\n.mdl-color-text--blue-300 {\n  color: rgb(100,181,246) !important; }\n\n.mdl-color--blue-300 {\n  background-color: rgb(100,181,246) !important; }\n\n.mdl-color-text--blue-400 {\n  color: rgb(66,165,245) !important; }\n\n.mdl-color--blue-400 {\n  background-color: rgb(66,165,245) !important; }\n\n.mdl-color-text--blue-500 {\n  color: rgb(33,150,243) !important; }\n\n.mdl-color--blue-500 {\n  background-color: rgb(33,150,243) !important; }\n\n.mdl-color-text--blue-600 {\n  color: rgb(30,136,229) !important; }\n\n.mdl-color--blue-600 {\n  background-color: rgb(30,136,229) !important; }\n\n.mdl-color-text--blue-700 {\n  color: rgb(25,118,210) !important; }\n\n.mdl-color--blue-700 {\n  background-color: rgb(25,118,210) !important; }\n\n.mdl-color-text--blue-800 {\n  color: rgb(21,101,192) !important; }\n\n.mdl-color--blue-800 {\n  background-color: rgb(21,101,192) !important; }\n\n.mdl-color-text--blue-900 {\n  color: rgb(13,71,161) !important; }\n\n.mdl-color--blue-900 {\n  background-color: rgb(13,71,161) !important; }\n\n.mdl-color-text--blue-A100 {\n  color: rgb(130,177,255) !important; }\n\n.mdl-color--blue-A100 {\n  background-color: rgb(130,177,255) !important; }\n\n.mdl-color-text--blue-A200 {\n  color: rgb(68,138,255) !important; }\n\n.mdl-color--blue-A200 {\n  background-color: rgb(68,138,255) !important; }\n\n.mdl-color-text--blue-A400 {\n  color: rgb(41,121,255) !important; }\n\n.mdl-color--blue-A400 {\n  background-color: rgb(41,121,255) !important; }\n\n.mdl-color-text--blue-A700 {\n  color: rgb(41,98,255) !important; }\n\n.mdl-color--blue-A700 {\n  background-color: rgb(41,98,255) !important; }\n\n.mdl-color-text--light-blue {\n  color: rgb(3,169,244) !important; }\n\n.mdl-color--light-blue {\n  background-color: rgb(3,169,244) !important; }\n\n.mdl-color-text--light-blue-50 {\n  color: rgb(225,245,254) !important; }\n\n.mdl-color--light-blue-50 {\n  background-color: rgb(225,245,254) !important; }\n\n.mdl-color-text--light-blue-100 {\n  color: rgb(179,229,252) !important; }\n\n.mdl-color--light-blue-100 {\n  background-color: rgb(179,229,252) !important; }\n\n.mdl-color-text--light-blue-200 {\n  color: rgb(129,212,250) !important; }\n\n.mdl-color--light-blue-200 {\n  background-color: rgb(129,212,250) !important; }\n\n.mdl-color-text--light-blue-300 {\n  color: rgb(79,195,247) !important; }\n\n.mdl-color--light-blue-300 {\n  background-color: rgb(79,195,247) !important; }\n\n.mdl-color-text--light-blue-400 {\n  color: rgb(41,182,246) !important; }\n\n.mdl-color--light-blue-400 {\n  background-color: rgb(41,182,246) !important; }\n\n.mdl-color-text--light-blue-500 {\n  color: rgb(3,169,244) !important; }\n\n.mdl-color--light-blue-500 {\n  background-color: rgb(3,169,244) !important; }\n\n.mdl-color-text--light-blue-600 {\n  color: rgb(3,155,229) !important; }\n\n.mdl-color--light-blue-600 {\n  background-color: rgb(3,155,229) !important; }\n\n.mdl-color-text--light-blue-700 {\n  color: rgb(2,136,209) !important; }\n\n.mdl-color--light-blue-700 {\n  background-color: rgb(2,136,209) !important; }\n\n.mdl-color-text--light-blue-800 {\n  color: rgb(2,119,189) !important; }\n\n.mdl-color--light-blue-800 {\n  background-color: rgb(2,119,189) !important; }\n\n.mdl-color-text--light-blue-900 {\n  color: rgb(1,87,155) !important; }\n\n.mdl-color--light-blue-900 {\n  background-color: rgb(1,87,155) !important; }\n\n.mdl-color-text--light-blue-A100 {\n  color: rgb(128,216,255) !important; }\n\n.mdl-color--light-blue-A100 {\n  background-color: rgb(128,216,255) !important; }\n\n.mdl-color-text--light-blue-A200 {\n  color: rgb(64,196,255) !important; }\n\n.mdl-color--light-blue-A200 {\n  background-color: rgb(64,196,255) !important; }\n\n.mdl-color-text--light-blue-A400 {\n  color: rgb(0,176,255) !important; }\n\n.mdl-color--light-blue-A400 {\n  background-color: rgb(0,176,255) !important; }\n\n.mdl-color-text--light-blue-A700 {\n  color: rgb(0,145,234) !important; }\n\n.mdl-color--light-blue-A700 {\n  background-color: rgb(0,145,234) !important; }\n\n.mdl-color-text--cyan {\n  color: rgb(0,188,212) !important; }\n\n.mdl-color--cyan {\n  background-color: rgb(0,188,212) !important; }\n\n.mdl-color-text--cyan-50 {\n  color: rgb(224,247,250) !important; }\n\n.mdl-color--cyan-50 {\n  background-color: rgb(224,247,250) !important; }\n\n.mdl-color-text--cyan-100 {\n  color: rgb(178,235,242) !important; }\n\n.mdl-color--cyan-100 {\n  background-color: rgb(178,235,242) !important; }\n\n.mdl-color-text--cyan-200 {\n  color: rgb(128,222,234) !important; }\n\n.mdl-color--cyan-200 {\n  background-color: rgb(128,222,234) !important; }\n\n.mdl-color-text--cyan-300 {\n  color: rgb(77,208,225) !important; }\n\n.mdl-color--cyan-300 {\n  background-color: rgb(77,208,225) !important; }\n\n.mdl-color-text--cyan-400 {\n  color: rgb(38,198,218) !important; }\n\n.mdl-color--cyan-400 {\n  background-color: rgb(38,198,218) !important; }\n\n.mdl-color-text--cyan-500 {\n  color: rgb(0,188,212) !important; }\n\n.mdl-color--cyan-500 {\n  background-color: rgb(0,188,212) !important; }\n\n.mdl-color-text--cyan-600 {\n  color: rgb(0,172,193) !important; }\n\n.mdl-color--cyan-600 {\n  background-color: rgb(0,172,193) !important; }\n\n.mdl-color-text--cyan-700 {\n  color: rgb(0,151,167) !important; }\n\n.mdl-color--cyan-700 {\n  background-color: rgb(0,151,167) !important; }\n\n.mdl-color-text--cyan-800 {\n  color: rgb(0,131,143) !important; }\n\n.mdl-color--cyan-800 {\n  background-color: rgb(0,131,143) !important; }\n\n.mdl-color-text--cyan-900 {\n  color: rgb(0,96,100) !important; }\n\n.mdl-color--cyan-900 {\n  background-color: rgb(0,96,100) !important; }\n\n.mdl-color-text--cyan-A100 {\n  color: rgb(132,255,255) !important; }\n\n.mdl-color--cyan-A100 {\n  background-color: rgb(132,255,255) !important; }\n\n.mdl-color-text--cyan-A200 {\n  color: rgb(24,255,255) !important; }\n\n.mdl-color--cyan-A200 {\n  background-color: rgb(24,255,255) !important; }\n\n.mdl-color-text--cyan-A400 {\n  color: rgb(0,229,255) !important; }\n\n.mdl-color--cyan-A400 {\n  background-color: rgb(0,229,255) !important; }\n\n.mdl-color-text--cyan-A700 {\n  color: rgb(0,184,212) !important; }\n\n.mdl-color--cyan-A700 {\n  background-color: rgb(0,184,212) !important; }\n\n.mdl-color-text--teal {\n  color: rgb(0,150,136) !important; }\n\n.mdl-color--teal {\n  background-color: rgb(0,150,136) !important; }\n\n.mdl-color-text--teal-50 {\n  color: rgb(224,242,241) !important; }\n\n.mdl-color--teal-50 {\n  background-color: rgb(224,242,241) !important; }\n\n.mdl-color-text--teal-100 {\n  color: rgb(178,223,219) !important; }\n\n.mdl-color--teal-100 {\n  background-color: rgb(178,223,219) !important; }\n\n.mdl-color-text--teal-200 {\n  color: rgb(128,203,196) !important; }\n\n.mdl-color--teal-200 {\n  background-color: rgb(128,203,196) !important; }\n\n.mdl-color-text--teal-300 {\n  color: rgb(77,182,172) !important; }\n\n.mdl-color--teal-300 {\n  background-color: rgb(77,182,172) !important; }\n\n.mdl-color-text--teal-400 {\n  color: rgb(38,166,154) !important; }\n\n.mdl-color--teal-400 {\n  background-color: rgb(38,166,154) !important; }\n\n.mdl-color-text--teal-500 {\n  color: rgb(0,150,136) !important; }\n\n.mdl-color--teal-500 {\n  background-color: rgb(0,150,136) !important; }\n\n.mdl-color-text--teal-600 {\n  color: rgb(0,137,123) !important; }\n\n.mdl-color--teal-600 {\n  background-color: rgb(0,137,123) !important; }\n\n.mdl-color-text--teal-700 {\n  color: rgb(0,121,107) !important; }\n\n.mdl-color--teal-700 {\n  background-color: rgb(0,121,107) !important; }\n\n.mdl-color-text--teal-800 {\n  color: rgb(0,105,92) !important; }\n\n.mdl-color--teal-800 {\n  background-color: rgb(0,105,92) !important; }\n\n.mdl-color-text--teal-900 {\n  color: rgb(0,77,64) !important; }\n\n.mdl-color--teal-900 {\n  background-color: rgb(0,77,64) !important; }\n\n.mdl-color-text--teal-A100 {\n  color: rgb(167,255,235) !important; }\n\n.mdl-color--teal-A100 {\n  background-color: rgb(167,255,235) !important; }\n\n.mdl-color-text--teal-A200 {\n  color: rgb(100,255,218) !important; }\n\n.mdl-color--teal-A200 {\n  background-color: rgb(100,255,218) !important; }\n\n.mdl-color-text--teal-A400 {\n  color: rgb(29,233,182) !important; }\n\n.mdl-color--teal-A400 {\n  background-color: rgb(29,233,182) !important; }\n\n.mdl-color-text--teal-A700 {\n  color: rgb(0,191,165) !important; }\n\n.mdl-color--teal-A700 {\n  background-color: rgb(0,191,165) !important; }\n\n.mdl-color-text--green {\n  color: rgb(76,175,80) !important; }\n\n.mdl-color--green {\n  background-color: rgb(76,175,80) !important; }\n\n.mdl-color-text--green-50 {\n  color: rgb(232,245,233) !important; }\n\n.mdl-color--green-50 {\n  background-color: rgb(232,245,233) !important; }\n\n.mdl-color-text--green-100 {\n  color: rgb(200,230,201) !important; }\n\n.mdl-color--green-100 {\n  background-color: rgb(200,230,201) !important; }\n\n.mdl-color-text--green-200 {\n  color: rgb(165,214,167) !important; }\n\n.mdl-color--green-200 {\n  background-color: rgb(165,214,167) !important; }\n\n.mdl-color-text--green-300 {\n  color: rgb(129,199,132) !important; }\n\n.mdl-color--green-300 {\n  background-color: rgb(129,199,132) !important; }\n\n.mdl-color-text--green-400 {\n  color: rgb(102,187,106) !important; }\n\n.mdl-color--green-400 {\n  background-color: rgb(102,187,106) !important; }\n\n.mdl-color-text--green-500 {\n  color: rgb(76,175,80) !important; }\n\n.mdl-color--green-500 {\n  background-color: rgb(76,175,80) !important; }\n\n.mdl-color-text--green-600 {\n  color: rgb(67,160,71) !important; }\n\n.mdl-color--green-600 {\n  background-color: rgb(67,160,71) !important; }\n\n.mdl-color-text--green-700 {\n  color: rgb(56,142,60) !important; }\n\n.mdl-color--green-700 {\n  background-color: rgb(56,142,60) !important; }\n\n.mdl-color-text--green-800 {\n  color: rgb(46,125,50) !important; }\n\n.mdl-color--green-800 {\n  background-color: rgb(46,125,50) !important; }\n\n.mdl-color-text--green-900 {\n  color: rgb(27,94,32) !important; }\n\n.mdl-color--green-900 {\n  background-color: rgb(27,94,32) !important; }\n\n.mdl-color-text--green-A100 {\n  color: rgb(185,246,202) !important; }\n\n.mdl-color--green-A100 {\n  background-color: rgb(185,246,202) !important; }\n\n.mdl-color-text--green-A200 {\n  color: rgb(105,240,174) !important; }\n\n.mdl-color--green-A200 {\n  background-color: rgb(105,240,174) !important; }\n\n.mdl-color-text--green-A400 {\n  color: rgb(0,230,118) !important; }\n\n.mdl-color--green-A400 {\n  background-color: rgb(0,230,118) !important; }\n\n.mdl-color-text--green-A700 {\n  color: rgb(0,200,83) !important; }\n\n.mdl-color--green-A700 {\n  background-color: rgb(0,200,83) !important; }\n\n.mdl-color-text--light-green {\n  color: rgb(139,195,74) !important; }\n\n.mdl-color--light-green {\n  background-color: rgb(139,195,74) !important; }\n\n.mdl-color-text--light-green-50 {\n  color: rgb(241,248,233) !important; }\n\n.mdl-color--light-green-50 {\n  background-color: rgb(241,248,233) !important; }\n\n.mdl-color-text--light-green-100 {\n  color: rgb(220,237,200) !important; }\n\n.mdl-color--light-green-100 {\n  background-color: rgb(220,237,200) !important; }\n\n.mdl-color-text--light-green-200 {\n  color: rgb(197,225,165) !important; }\n\n.mdl-color--light-green-200 {\n  background-color: rgb(197,225,165) !important; }\n\n.mdl-color-text--light-green-300 {\n  color: rgb(174,213,129) !important; }\n\n.mdl-color--light-green-300 {\n  background-color: rgb(174,213,129) !important; }\n\n.mdl-color-text--light-green-400 {\n  color: rgb(156,204,101) !important; }\n\n.mdl-color--light-green-400 {\n  background-color: rgb(156,204,101) !important; }\n\n.mdl-color-text--light-green-500 {\n  color: rgb(139,195,74) !important; }\n\n.mdl-color--light-green-500 {\n  background-color: rgb(139,195,74) !important; }\n\n.mdl-color-text--light-green-600 {\n  color: rgb(124,179,66) !important; }\n\n.mdl-color--light-green-600 {\n  background-color: rgb(124,179,66) !important; }\n\n.mdl-color-text--light-green-700 {\n  color: rgb(104,159,56) !important; }\n\n.mdl-color--light-green-700 {\n  background-color: rgb(104,159,56) !important; }\n\n.mdl-color-text--light-green-800 {\n  color: rgb(85,139,47) !important; }\n\n.mdl-color--light-green-800 {\n  background-color: rgb(85,139,47) !important; }\n\n.mdl-color-text--light-green-900 {\n  color: rgb(51,105,30) !important; }\n\n.mdl-color--light-green-900 {\n  background-color: rgb(51,105,30) !important; }\n\n.mdl-color-text--light-green-A100 {\n  color: rgb(204,255,144) !important; }\n\n.mdl-color--light-green-A100 {\n  background-color: rgb(204,255,144) !important; }\n\n.mdl-color-text--light-green-A200 {\n  color: rgb(178,255,89) !important; }\n\n.mdl-color--light-green-A200 {\n  background-color: rgb(178,255,89) !important; }\n\n.mdl-color-text--light-green-A400 {\n  color: rgb(118,255,3) !important; }\n\n.mdl-color--light-green-A400 {\n  background-color: rgb(118,255,3) !important; }\n\n.mdl-color-text--light-green-A700 {\n  color: rgb(100,221,23) !important; }\n\n.mdl-color--light-green-A700 {\n  background-color: rgb(100,221,23) !important; }\n\n.mdl-color-text--lime {\n  color: rgb(205,220,57) !important; }\n\n.mdl-color--lime {\n  background-color: rgb(205,220,57) !important; }\n\n.mdl-color-text--lime-50 {\n  color: rgb(249,251,231) !important; }\n\n.mdl-color--lime-50 {\n  background-color: rgb(249,251,231) !important; }\n\n.mdl-color-text--lime-100 {\n  color: rgb(240,244,195) !important; }\n\n.mdl-color--lime-100 {\n  background-color: rgb(240,244,195) !important; }\n\n.mdl-color-text--lime-200 {\n  color: rgb(230,238,156) !important; }\n\n.mdl-color--lime-200 {\n  background-color: rgb(230,238,156) !important; }\n\n.mdl-color-text--lime-300 {\n  color: rgb(220,231,117) !important; }\n\n.mdl-color--lime-300 {\n  background-color: rgb(220,231,117) !important; }\n\n.mdl-color-text--lime-400 {\n  color: rgb(212,225,87) !important; }\n\n.mdl-color--lime-400 {\n  background-color: rgb(212,225,87) !important; }\n\n.mdl-color-text--lime-500 {\n  color: rgb(205,220,57) !important; }\n\n.mdl-color--lime-500 {\n  background-color: rgb(205,220,57) !important; }\n\n.mdl-color-text--lime-600 {\n  color: rgb(192,202,51) !important; }\n\n.mdl-color--lime-600 {\n  background-color: rgb(192,202,51) !important; }\n\n.mdl-color-text--lime-700 {\n  color: rgb(175,180,43) !important; }\n\n.mdl-color--lime-700 {\n  background-color: rgb(175,180,43) !important; }\n\n.mdl-color-text--lime-800 {\n  color: rgb(158,157,36) !important; }\n\n.mdl-color--lime-800 {\n  background-color: rgb(158,157,36) !important; }\n\n.mdl-color-text--lime-900 {\n  color: rgb(130,119,23) !important; }\n\n.mdl-color--lime-900 {\n  background-color: rgb(130,119,23) !important; }\n\n.mdl-color-text--lime-A100 {\n  color: rgb(244,255,129) !important; }\n\n.mdl-color--lime-A100 {\n  background-color: rgb(244,255,129) !important; }\n\n.mdl-color-text--lime-A200 {\n  color: rgb(238,255,65) !important; }\n\n.mdl-color--lime-A200 {\n  background-color: rgb(238,255,65) !important; }\n\n.mdl-color-text--lime-A400 {\n  color: rgb(198,255,0) !important; }\n\n.mdl-color--lime-A400 {\n  background-color: rgb(198,255,0) !important; }\n\n.mdl-color-text--lime-A700 {\n  color: rgb(174,234,0) !important; }\n\n.mdl-color--lime-A700 {\n  background-color: rgb(174,234,0) !important; }\n\n.mdl-color-text--yellow {\n  color: rgb(255,235,59) !important; }\n\n.mdl-color--yellow {\n  background-color: rgb(255,235,59) !important; }\n\n.mdl-color-text--yellow-50 {\n  color: rgb(255,253,231) !important; }\n\n.mdl-color--yellow-50 {\n  background-color: rgb(255,253,231) !important; }\n\n.mdl-color-text--yellow-100 {\n  color: rgb(255,249,196) !important; }\n\n.mdl-color--yellow-100 {\n  background-color: rgb(255,249,196) !important; }\n\n.mdl-color-text--yellow-200 {\n  color: rgb(255,245,157) !important; }\n\n.mdl-color--yellow-200 {\n  background-color: rgb(255,245,157) !important; }\n\n.mdl-color-text--yellow-300 {\n  color: rgb(255,241,118) !important; }\n\n.mdl-color--yellow-300 {\n  background-color: rgb(255,241,118) !important; }\n\n.mdl-color-text--yellow-400 {\n  color: rgb(255,238,88) !important; }\n\n.mdl-color--yellow-400 {\n  background-color: rgb(255,238,88) !important; }\n\n.mdl-color-text--yellow-500 {\n  color: rgb(255,235,59) !important; }\n\n.mdl-color--yellow-500 {\n  background-color: rgb(255,235,59) !important; }\n\n.mdl-color-text--yellow-600 {\n  color: rgb(253,216,53) !important; }\n\n.mdl-color--yellow-600 {\n  background-color: rgb(253,216,53) !important; }\n\n.mdl-color-text--yellow-700 {\n  color: rgb(251,192,45) !important; }\n\n.mdl-color--yellow-700 {\n  background-color: rgb(251,192,45) !important; }\n\n.mdl-color-text--yellow-800 {\n  color: rgb(249,168,37) !important; }\n\n.mdl-color--yellow-800 {\n  background-color: rgb(249,168,37) !important; }\n\n.mdl-color-text--yellow-900 {\n  color: rgb(245,127,23) !important; }\n\n.mdl-color--yellow-900 {\n  background-color: rgb(245,127,23) !important; }\n\n.mdl-color-text--yellow-A100 {\n  color: rgb(255,255,141) !important; }\n\n.mdl-color--yellow-A100 {\n  background-color: rgb(255,255,141) !important; }\n\n.mdl-color-text--yellow-A200 {\n  color: rgb(255,255,0) !important; }\n\n.mdl-color--yellow-A200 {\n  background-color: rgb(255,255,0) !important; }\n\n.mdl-color-text--yellow-A400 {\n  color: rgb(255,234,0) !important; }\n\n.mdl-color--yellow-A400 {\n  background-color: rgb(255,234,0) !important; }\n\n.mdl-color-text--yellow-A700 {\n  color: rgb(255,214,0) !important; }\n\n.mdl-color--yellow-A700 {\n  background-color: rgb(255,214,0) !important; }\n\n.mdl-color-text--amber {\n  color: rgb(255,193,7) !important; }\n\n.mdl-color--amber {\n  background-color: rgb(255,193,7) !important; }\n\n.mdl-color-text--amber-50 {\n  color: rgb(255,248,225) !important; }\n\n.mdl-color--amber-50 {\n  background-color: rgb(255,248,225) !important; }\n\n.mdl-color-text--amber-100 {\n  color: rgb(255,236,179) !important; }\n\n.mdl-color--amber-100 {\n  background-color: rgb(255,236,179) !important; }\n\n.mdl-color-text--amber-200 {\n  color: rgb(255,224,130) !important; }\n\n.mdl-color--amber-200 {\n  background-color: rgb(255,224,130) !important; }\n\n.mdl-color-text--amber-300 {\n  color: rgb(255,213,79) !important; }\n\n.mdl-color--amber-300 {\n  background-color: rgb(255,213,79) !important; }\n\n.mdl-color-text--amber-400 {\n  color: rgb(255,202,40) !important; }\n\n.mdl-color--amber-400 {\n  background-color: rgb(255,202,40) !important; }\n\n.mdl-color-text--amber-500 {\n  color: rgb(255,193,7) !important; }\n\n.mdl-color--amber-500 {\n  background-color: rgb(255,193,7) !important; }\n\n.mdl-color-text--amber-600 {\n  color: rgb(255,179,0) !important; }\n\n.mdl-color--amber-600 {\n  background-color: rgb(255,179,0) !important; }\n\n.mdl-color-text--amber-700 {\n  color: rgb(255,160,0) !important; }\n\n.mdl-color--amber-700 {\n  background-color: rgb(255,160,0) !important; }\n\n.mdl-color-text--amber-800 {\n  color: rgb(255,143,0) !important; }\n\n.mdl-color--amber-800 {\n  background-color: rgb(255,143,0) !important; }\n\n.mdl-color-text--amber-900 {\n  color: rgb(255,111,0) !important; }\n\n.mdl-color--amber-900 {\n  background-color: rgb(255,111,0) !important; }\n\n.mdl-color-text--amber-A100 {\n  color: rgb(255,229,127) !important; }\n\n.mdl-color--amber-A100 {\n  background-color: rgb(255,229,127) !important; }\n\n.mdl-color-text--amber-A200 {\n  color: rgb(255,215,64) !important; }\n\n.mdl-color--amber-A200 {\n  background-color: rgb(255,215,64) !important; }\n\n.mdl-color-text--amber-A400 {\n  color: rgb(255,196,0) !important; }\n\n.mdl-color--amber-A400 {\n  background-color: rgb(255,196,0) !important; }\n\n.mdl-color-text--amber-A700 {\n  color: rgb(255,171,0) !important; }\n\n.mdl-color--amber-A700 {\n  background-color: rgb(255,171,0) !important; }\n\n.mdl-color-text--orange {\n  color: rgb(255,152,0) !important; }\n\n.mdl-color--orange {\n  background-color: rgb(255,152,0) !important; }\n\n.mdl-color-text--orange-50 {\n  color: rgb(255,243,224) !important; }\n\n.mdl-color--orange-50 {\n  background-color: rgb(255,243,224) !important; }\n\n.mdl-color-text--orange-100 {\n  color: rgb(255,224,178) !important; }\n\n.mdl-color--orange-100 {\n  background-color: rgb(255,224,178) !important; }\n\n.mdl-color-text--orange-200 {\n  color: rgb(255,204,128) !important; }\n\n.mdl-color--orange-200 {\n  background-color: rgb(255,204,128) !important; }\n\n.mdl-color-text--orange-300 {\n  color: rgb(255,183,77) !important; }\n\n.mdl-color--orange-300 {\n  background-color: rgb(255,183,77) !important; }\n\n.mdl-color-text--orange-400 {\n  color: rgb(255,167,38) !important; }\n\n.mdl-color--orange-400 {\n  background-color: rgb(255,167,38) !important; }\n\n.mdl-color-text--orange-500 {\n  color: rgb(255,152,0) !important; }\n\n.mdl-color--orange-500 {\n  background-color: rgb(255,152,0) !important; }\n\n.mdl-color-text--orange-600 {\n  color: rgb(251,140,0) !important; }\n\n.mdl-color--orange-600 {\n  background-color: rgb(251,140,0) !important; }\n\n.mdl-color-text--orange-700 {\n  color: rgb(245,124,0) !important; }\n\n.mdl-color--orange-700 {\n  background-color: rgb(245,124,0) !important; }\n\n.mdl-color-text--orange-800 {\n  color: rgb(239,108,0) !important; }\n\n.mdl-color--orange-800 {\n  background-color: rgb(239,108,0) !important; }\n\n.mdl-color-text--orange-900 {\n  color: rgb(230,81,0) !important; }\n\n.mdl-color--orange-900 {\n  background-color: rgb(230,81,0) !important; }\n\n.mdl-color-text--orange-A100 {\n  color: rgb(255,209,128) !important; }\n\n.mdl-color--orange-A100 {\n  background-color: rgb(255,209,128) !important; }\n\n.mdl-color-text--orange-A200 {\n  color: rgb(255,171,64) !important; }\n\n.mdl-color--orange-A200 {\n  background-color: rgb(255,171,64) !important; }\n\n.mdl-color-text--orange-A400 {\n  color: rgb(255,145,0) !important; }\n\n.mdl-color--orange-A400 {\n  background-color: rgb(255,145,0) !important; }\n\n.mdl-color-text--orange-A700 {\n  color: rgb(255,109,0) !important; }\n\n.mdl-color--orange-A700 {\n  background-color: rgb(255,109,0) !important; }\n\n.mdl-color-text--deep-orange {\n  color: rgb(255,87,34) !important; }\n\n.mdl-color--deep-orange {\n  background-color: rgb(255,87,34) !important; }\n\n.mdl-color-text--deep-orange-50 {\n  color: rgb(251,233,231) !important; }\n\n.mdl-color--deep-orange-50 {\n  background-color: rgb(251,233,231) !important; }\n\n.mdl-color-text--deep-orange-100 {\n  color: rgb(255,204,188) !important; }\n\n.mdl-color--deep-orange-100 {\n  background-color: rgb(255,204,188) !important; }\n\n.mdl-color-text--deep-orange-200 {\n  color: rgb(255,171,145) !important; }\n\n.mdl-color--deep-orange-200 {\n  background-color: rgb(255,171,145) !important; }\n\n.mdl-color-text--deep-orange-300 {\n  color: rgb(255,138,101) !important; }\n\n.mdl-color--deep-orange-300 {\n  background-color: rgb(255,138,101) !important; }\n\n.mdl-color-text--deep-orange-400 {\n  color: rgb(255,112,67) !important; }\n\n.mdl-color--deep-orange-400 {\n  background-color: rgb(255,112,67) !important; }\n\n.mdl-color-text--deep-orange-500 {\n  color: rgb(255,87,34) !important; }\n\n.mdl-color--deep-orange-500 {\n  background-color: rgb(255,87,34) !important; }\n\n.mdl-color-text--deep-orange-600 {\n  color: rgb(244,81,30) !important; }\n\n.mdl-color--deep-orange-600 {\n  background-color: rgb(244,81,30) !important; }\n\n.mdl-color-text--deep-orange-700 {\n  color: rgb(230,74,25) !important; }\n\n.mdl-color--deep-orange-700 {\n  background-color: rgb(230,74,25) !important; }\n\n.mdl-color-text--deep-orange-800 {\n  color: rgb(216,67,21) !important; }\n\n.mdl-color--deep-orange-800 {\n  background-color: rgb(216,67,21) !important; }\n\n.mdl-color-text--deep-orange-900 {\n  color: rgb(191,54,12) !important; }\n\n.mdl-color--deep-orange-900 {\n  background-color: rgb(191,54,12) !important; }\n\n.mdl-color-text--deep-orange-A100 {\n  color: rgb(255,158,128) !important; }\n\n.mdl-color--deep-orange-A100 {\n  background-color: rgb(255,158,128) !important; }\n\n.mdl-color-text--deep-orange-A200 {\n  color: rgb(255,110,64) !important; }\n\n.mdl-color--deep-orange-A200 {\n  background-color: rgb(255,110,64) !important; }\n\n.mdl-color-text--deep-orange-A400 {\n  color: rgb(255,61,0) !important; }\n\n.mdl-color--deep-orange-A400 {\n  background-color: rgb(255,61,0) !important; }\n\n.mdl-color-text--deep-orange-A700 {\n  color: rgb(221,44,0) !important; }\n\n.mdl-color--deep-orange-A700 {\n  background-color: rgb(221,44,0) !important; }\n\n.mdl-color-text--brown {\n  color: rgb(121,85,72) !important; }\n\n.mdl-color--brown {\n  background-color: rgb(121,85,72) !important; }\n\n.mdl-color-text--brown-50 {\n  color: rgb(239,235,233) !important; }\n\n.mdl-color--brown-50 {\n  background-color: rgb(239,235,233) !important; }\n\n.mdl-color-text--brown-100 {\n  color: rgb(215,204,200) !important; }\n\n.mdl-color--brown-100 {\n  background-color: rgb(215,204,200) !important; }\n\n.mdl-color-text--brown-200 {\n  color: rgb(188,170,164) !important; }\n\n.mdl-color--brown-200 {\n  background-color: rgb(188,170,164) !important; }\n\n.mdl-color-text--brown-300 {\n  color: rgb(161,136,127) !important; }\n\n.mdl-color--brown-300 {\n  background-color: rgb(161,136,127) !important; }\n\n.mdl-color-text--brown-400 {\n  color: rgb(141,110,99) !important; }\n\n.mdl-color--brown-400 {\n  background-color: rgb(141,110,99) !important; }\n\n.mdl-color-text--brown-500 {\n  color: rgb(121,85,72) !important; }\n\n.mdl-color--brown-500 {\n  background-color: rgb(121,85,72) !important; }\n\n.mdl-color-text--brown-600 {\n  color: rgb(109,76,65) !important; }\n\n.mdl-color--brown-600 {\n  background-color: rgb(109,76,65) !important; }\n\n.mdl-color-text--brown-700 {\n  color: rgb(93,64,55) !important; }\n\n.mdl-color--brown-700 {\n  background-color: rgb(93,64,55) !important; }\n\n.mdl-color-text--brown-800 {\n  color: rgb(78,52,46) !important; }\n\n.mdl-color--brown-800 {\n  background-color: rgb(78,52,46) !important; }\n\n.mdl-color-text--brown-900 {\n  color: rgb(62,39,35) !important; }\n\n.mdl-color--brown-900 {\n  background-color: rgb(62,39,35) !important; }\n\n.mdl-color-text--grey {\n  color: rgb(158,158,158) !important; }\n\n.mdl-color--grey {\n  background-color: rgb(158,158,158) !important; }\n\n.mdl-color-text--grey-50 {\n  color: rgb(250,250,250) !important; }\n\n.mdl-color--grey-50 {\n  background-color: rgb(250,250,250) !important; }\n\n.mdl-color-text--grey-100 {\n  color: rgb(245,245,245) !important; }\n\n.mdl-color--grey-100 {\n  background-color: rgb(245,245,245) !important; }\n\n.mdl-color-text--grey-200 {\n  color: rgb(238,238,238) !important; }\n\n.mdl-color--grey-200 {\n  background-color: rgb(238,238,238) !important; }\n\n.mdl-color-text--grey-300 {\n  color: rgb(224,224,224) !important; }\n\n.mdl-color--grey-300 {\n  background-color: rgb(224,224,224) !important; }\n\n.mdl-color-text--grey-400 {\n  color: rgb(189,189,189) !important; }\n\n.mdl-color--grey-400 {\n  background-color: rgb(189,189,189) !important; }\n\n.mdl-color-text--grey-500 {\n  color: rgb(158,158,158) !important; }\n\n.mdl-color--grey-500 {\n  background-color: rgb(158,158,158) !important; }\n\n.mdl-color-text--grey-600 {\n  color: rgb(117,117,117) !important; }\n\n.mdl-color--grey-600 {\n  background-color: rgb(117,117,117) !important; }\n\n.mdl-color-text--grey-700 {\n  color: rgb(97,97,97) !important; }\n\n.mdl-color--grey-700 {\n  background-color: rgb(97,97,97) !important; }\n\n.mdl-color-text--grey-800 {\n  color: rgb(66,66,66) !important; }\n\n.mdl-color--grey-800 {\n  background-color: rgb(66,66,66) !important; }\n\n.mdl-color-text--grey-900 {\n  color: rgb(33,33,33) !important; }\n\n.mdl-color--grey-900 {\n  background-color: rgb(33,33,33) !important; }\n\n.mdl-color-text--blue-grey {\n  color: rgb(96,125,139) !important; }\n\n.mdl-color--blue-grey {\n  background-color: rgb(96,125,139) !important; }\n\n.mdl-color-text--blue-grey-50 {\n  color: rgb(236,239,241) !important; }\n\n.mdl-color--blue-grey-50 {\n  background-color: rgb(236,239,241) !important; }\n\n.mdl-color-text--blue-grey-100 {\n  color: rgb(207,216,220) !important; }\n\n.mdl-color--blue-grey-100 {\n  background-color: rgb(207,216,220) !important; }\n\n.mdl-color-text--blue-grey-200 {\n  color: rgb(176,190,197) !important; }\n\n.mdl-color--blue-grey-200 {\n  background-color: rgb(176,190,197) !important; }\n\n.mdl-color-text--blue-grey-300 {\n  color: rgb(144,164,174) !important; }\n\n.mdl-color--blue-grey-300 {\n  background-color: rgb(144,164,174) !important; }\n\n.mdl-color-text--blue-grey-400 {\n  color: rgb(120,144,156) !important; }\n\n.mdl-color--blue-grey-400 {\n  background-color: rgb(120,144,156) !important; }\n\n.mdl-color-text--blue-grey-500 {\n  color: rgb(96,125,139) !important; }\n\n.mdl-color--blue-grey-500 {\n  background-color: rgb(96,125,139) !important; }\n\n.mdl-color-text--blue-grey-600 {\n  color: rgb(84,110,122) !important; }\n\n.mdl-color--blue-grey-600 {\n  background-color: rgb(84,110,122) !important; }\n\n.mdl-color-text--blue-grey-700 {\n  color: rgb(69,90,100) !important; }\n\n.mdl-color--blue-grey-700 {\n  background-color: rgb(69,90,100) !important; }\n\n.mdl-color-text--blue-grey-800 {\n  color: rgb(55,71,79) !important; }\n\n.mdl-color--blue-grey-800 {\n  background-color: rgb(55,71,79) !important; }\n\n.mdl-color-text--blue-grey-900 {\n  color: rgb(38,50,56) !important; }\n\n.mdl-color--blue-grey-900 {\n  background-color: rgb(38,50,56) !important; }\n\n.mdl-color--black {\n  background-color: rgb(0,0,0) !important; }\n\n.mdl-color-text--black {\n  color: rgb(0,0,0) !important; }\n\n.mdl-color--white {\n  background-color: rgb(255,255,255) !important; }\n\n.mdl-color-text--white {\n  color: rgb(255,255,255) !important; }\n\n.mdl-color--primary {\n  background-color: rgb(63,81,181) !important; }\n\n.mdl-color--primary-contrast {\n  background-color: rgb(255,255,255) !important; }\n\n.mdl-color--primary-dark {\n  background-color: rgb(48,63,159) !important; }\n\n.mdl-color--accent {\n  background-color: rgb(255,64,129) !important; }\n\n.mdl-color--accent-contrast {\n  background-color: rgb(255,255,255) !important; }\n\n.mdl-color-text--primary {\n  color: rgb(63,81,181) !important; }\n\n.mdl-color-text--primary-contrast {\n  color: rgb(255,255,255) !important; }\n\n.mdl-color-text--primary-dark {\n  color: rgb(48,63,159) !important; }\n\n.mdl-color-text--accent {\n  color: rgb(255,64,129) !important; }\n\n.mdl-color-text--accent-contrast {\n  color: rgb(255,255,255) !important; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-ripple {\n  background: rgb(0,0,0);\n  border-radius: 50%;\n  height: 50px;\n  left: 0;\n  opacity: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 0;\n  -webkit-transform: translate(-50%, -50%);\n      -ms-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  width: 50px;\n  overflow: hidden; }\n  .mdl-ripple.is-animating {\n    -webkit-transition: -webkit-transform 0.3s cubic-bezier(0, 0, 0.2, 1), width 0.3s cubic-bezier(0, 0, 0.2, 1), height 0.3s cubic-bezier(0, 0, 0.2, 1), opacity 0.6s cubic-bezier(0, 0, 0.2, 1);\n            transition: transform 0.3s cubic-bezier(0, 0, 0.2, 1), width 0.3s cubic-bezier(0, 0, 0.2, 1), height 0.3s cubic-bezier(0, 0, 0.2, 1), opacity 0.6s cubic-bezier(0, 0, 0.2, 1); }\n  .mdl-ripple.is-visible {\n    opacity: 0.3; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-animation--default {\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdl-animation--fast-out-slow-in {\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdl-animation--linear-out-slow-in {\n  -webkit-transition-timing-function: cubic-bezier(0, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }\n\n.mdl-animation--fast-out-linear-in {\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 1, 1); }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-badge {\n  position: relative;\n  white-space: nowrap;\n  margin-right: 24px; }\n  .mdl-badge:not([data-badge]) {\n    margin-right: auto; }\n  .mdl-badge[data-badge]:after {\n    content: attr(data-badge);\n    display: -webkit-box;\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: row;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap;\n    -webkit-box-pack: center;\n    -webkit-justify-content: center;\n        -ms-flex-pack: center;\n            justify-content: center;\n    -webkit-align-content: center;\n        -ms-flex-line-pack: center;\n            align-content: center;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n        -ms-flex-align: center;\n            align-items: center;\n    position: absolute;\n    top: -11px;\n    right: -24px;\n    font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n    font-weight: 600;\n    font-size: 12px;\n    width: 22px;\n    height: 22px;\n    border-radius: 50%;\n    background: rgb(255,64,129);\n    color: rgb(255,255,255); }\n    .mdl-button .mdl-badge[data-badge]:after {\n      top: -10px;\n      right: -5px; }\n  .mdl-badge.mdl-badge--no-background[data-badge]:after {\n    color: rgb(255,64,129);\n    background: rgba(255,255,255,0.2);\n    box-shadow: 0 0 1px gray; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-button {\n  background: transparent;\n  border: none;\n  border-radius: 2px;\n  color: rgb(0,0,0);\n  display: block;\n  position: relative;\n  height: 36px;\n  min-width: 64px;\n  padding: 0 8px;\n  display: inline-block;\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 14px;\n  font-weight: 500;\n  text-transform: uppercase;\n  line-height: 1;\n  letter-spacing: 0;\n  overflow: hidden;\n  will-change: box-shadow, transform;\n  -webkit-transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: box-shadow 0.2s cubic-bezier(0.4, 0, 1, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  outline: none;\n  cursor: pointer;\n  text-decoration: none;\n  text-align: center;\n  line-height: 36px;\n  vertical-align: middle; }\n  .mdl-button::-moz-focus-inner {\n    border: 0; }\n  .mdl-button:hover {\n    background-color: rgba(158,158,158, 0.20); }\n  .mdl-button:focus:not(:active) {\n    background-color: rgba(0,0,0, 0.12); }\n  .mdl-button:active {\n    background-color: rgba(158,158,158, 0.40); }\n  .mdl-button.mdl-button--colored {\n    color: rgb(63,81,181); }\n    .mdl-button.mdl-button--colored:focus:not(:active) {\n      background-color: rgba(0,0,0, 0.12); }\n\ninput.mdl-button[type=\"submit\"] {\n  -webkit-appearance: none; }\n\n.mdl-button--raised {\n  background: rgba(158,158,158, 0.20);\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n  .mdl-button--raised:active {\n    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);\n    background-color: rgba(158,158,158, 0.40); }\n  .mdl-button--raised:focus:not(:active) {\n    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.36);\n    background-color: rgba(158,158,158, 0.40); }\n  .mdl-button--raised.mdl-button--colored {\n    background: rgb(63,81,181);\n    color: rgb(255,255,255); }\n    .mdl-button--raised.mdl-button--colored:hover {\n      background-color: rgb(63,81,181); }\n    .mdl-button--raised.mdl-button--colored:active {\n      background-color: rgb(63,81,181); }\n    .mdl-button--raised.mdl-button--colored:focus:not(:active) {\n      background-color: rgb(63,81,181); }\n    .mdl-button--raised.mdl-button--colored .mdl-ripple {\n      background: rgb(255,255,255); }\n\n.mdl-button--fab {\n  border-radius: 50%;\n  font-size: 24px;\n  height: 56px;\n  margin: auto;\n  min-width: 56px;\n  width: 56px;\n  padding: 0;\n  overflow: hidden;\n  background: rgba(158,158,158, 0.20);\n  box-shadow: 0 1px 1.5px 0 rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.24);\n  position: relative;\n  line-height: normal; }\n  .mdl-button--fab .material-icons {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-12px, -12px);\n        -ms-transform: translate(-12px, -12px);\n            transform: translate(-12px, -12px);\n    line-height: 24px;\n    width: 24px; }\n  .mdl-button--fab.mdl-button--mini-fab {\n    height: 40px;\n    min-width: 40px;\n    width: 40px; }\n  .mdl-button--fab .mdl-button__ripple-container {\n    border-radius: 50%;\n    -webkit-mask-image: -webkit-radial-gradient(circle, white, black); }\n  .mdl-button--fab:active {\n    box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);\n    background-color: rgba(158,158,158, 0.40); }\n  .mdl-button--fab:focus:not(:active) {\n    box-shadow: 0 0 8px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.36);\n    background-color: rgba(158,158,158, 0.40); }\n  .mdl-button--fab.mdl-button--colored {\n    background: rgb(255,64,129);\n    color: rgb(255,255,255); }\n    .mdl-button--fab.mdl-button--colored:hover {\n      background-color: rgb(255,64,129); }\n    .mdl-button--fab.mdl-button--colored:focus:not(:active) {\n      background-color: rgb(255,64,129); }\n    .mdl-button--fab.mdl-button--colored:active {\n      background-color: rgb(255,64,129); }\n    .mdl-button--fab.mdl-button--colored .mdl-ripple {\n      background: rgb(255,255,255); }\n\n.mdl-button--icon {\n  border-radius: 50%;\n  font-size: 24px;\n  height: 32px;\n  margin-left: 0;\n  margin-right: 0;\n  min-width: 32px;\n  width: 32px;\n  padding: 0;\n  overflow: hidden;\n  color: inherit;\n  line-height: normal; }\n  .mdl-button--icon .material-icons {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    -webkit-transform: translate(-12px, -12px);\n        -ms-transform: translate(-12px, -12px);\n            transform: translate(-12px, -12px);\n    line-height: 24px;\n    width: 24px; }\n  .mdl-button--icon.mdl-button--mini-icon {\n    height: 24px;\n    min-width: 24px;\n    width: 24px; }\n    .mdl-button--icon.mdl-button--mini-icon .material-icons {\n      top: 0px;\n      left: 0px; }\n  .mdl-button--icon .mdl-button__ripple-container {\n    border-radius: 50%;\n    -webkit-mask-image: -webkit-radial-gradient(circle, white, black); }\n\n.mdl-button__ripple-container {\n  display: block;\n  height: 100%;\n  left: 0px;\n  position: absolute;\n  top: 0px;\n  width: 100%;\n  z-index: 0;\n  overflow: hidden; }\n  .mdl-button[disabled] .mdl-button__ripple-container .mdl-ripple {\n    background-color: transparent; }\n\n.mdl-button--primary.mdl-button--primary {\n  color: rgb(63,81,181); }\n  .mdl-button--primary.mdl-button--primary .mdl-ripple {\n    background: rgb(255,255,255); }\n  .mdl-button--primary.mdl-button--primary.mdl-button--raised, .mdl-button--primary.mdl-button--primary.mdl-button--fab {\n    color: rgb(255,255,255);\n    background-color: rgb(63,81,181); }\n\n.mdl-button--accent.mdl-button--accent {\n  color: rgb(255,64,129); }\n  .mdl-button--accent.mdl-button--accent .mdl-ripple {\n    background: rgb(255,255,255); }\n  .mdl-button--accent.mdl-button--accent.mdl-button--raised, .mdl-button--accent.mdl-button--accent.mdl-button--fab {\n    color: rgb(255,255,255);\n    background-color: rgb(255,64,129); }\n\n.mdl-button[disabled][disabled] {\n  color: rgba(0,0,0, 0.26);\n  cursor: auto;\n  background-color: transparent; }\n\n.mdl-button--fab[disabled][disabled] {\n  background-color: rgba(0,0,0, 0.12);\n  color: rgba(0,0,0, 0.26);\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n.mdl-button--raised[disabled][disabled] {\n  background-color: rgba(0,0,0, 0.12);\n  color: rgba(0,0,0, 0.26);\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n.mdl-button--colored[disabled][disabled] {\n  background-color: rgba(0,0,0, 0.12);\n  color: rgba(0,0,0, 0.26);\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-card {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  font-size: 16px;\n  font-weight: 400;\n  min-height: 200px;\n  overflow: hidden;\n  width: 330px;\n  z-index: 1;\n  position: relative;\n  background: rgb(255,255,255);\n  border-radius: 2px;\n  box-sizing: border-box; }\n\n.mdl-card__media {\n  background-color: rgb(255,64,129);\n  background-repeat: repeat;\n  background-position: 50% 50%;\n  background-size: cover;\n  background-origin: padding-box;\n  background-attachment: scroll;\n  box-sizing: border-box; }\n\n.mdl-card__title {\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  color: rgb(0,0,0);\n  display: block;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: stretch;\n  -webkit-justify-content: stretch;\n      -ms-flex-pack: stretch;\n          justify-content: stretch;\n  line-height: normal;\n  padding: 16px 16px;\n  -webkit-perspective-origin: 165px 56px;\n          perspective-origin: 165px 56px;\n  -webkit-transform-origin: 165px 56px;\n      -ms-transform-origin: 165px 56px;\n          transform-origin: 165px 56px;\n  box-sizing: border-box; }\n  .mdl-card__title.mdl-card--border {\n    border-bottom: 1px solid rgba(0, 0, 0, 0.1); }\n\n.mdl-card__title-text {\n  -webkit-align-self: flex-end;\n      -ms-flex-item-align: end;\n          align-self: flex-end;\n  color: inherit;\n  display: block;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  font-size: 24px;\n  font-weight: 300;\n  line-height: normal;\n  overflow: hidden;\n  -webkit-transform-origin: 149px 48px;\n      -ms-transform-origin: 149px 48px;\n          transform-origin: 149px 48px;\n  margin: 0; }\n\n.mdl-card__subtitle-text {\n  font-size: 14px;\n  color: grey;\n  margin: 0; }\n\n.mdl-card__supporting-text {\n  color: rgba(0,0,0, 0.54);\n  font-size: 13px;\n  line-height: 18px;\n  overflow: hidden;\n  padding: 16px 16px;\n  width: 90%; }\n\n.mdl-card__actions {\n  font-size: 16px;\n  line-height: normal;\n  width: 100%;\n  background-color: transparent;\n  padding: 8px;\n  box-sizing: border-box; }\n  .mdl-card__actions.mdl-card--border {\n    border-top: 1px solid rgba(0, 0, 0, 0.1); }\n\n.mdl-card--expand {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.mdl-card__menu {\n  position: absolute;\n  right: 16px;\n  top: 16px; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-checkbox {\n  position: relative;\n  z-index: 1;\n  vertical-align: middle;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 100%;\n  height: 24px;\n  margin: 0;\n  padding: 0; }\n  .mdl-checkbox.is-upgraded {\n    padding-left: 24px; }\n\n.mdl-checkbox__input {\n  line-height: 24px; }\n  .mdl-checkbox.is-upgraded .mdl-checkbox__input {\n    position: absolute;\n    width: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    opacity: 0;\n    -ms-appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    appearance: none;\n    border: none; }\n\n.mdl-checkbox__box-outline {\n  position: absolute;\n  top: 3px;\n  left: 0;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  cursor: pointer;\n  overflow: hidden;\n  border: 2px solid rgba(0,0,0, 0.54);\n  border-radius: 2px;\n  z-index: 2; }\n  .mdl-checkbox.is-checked .mdl-checkbox__box-outline {\n    border: 2px solid rgb(63,81,181); }\n  .mdl-checkbox.is-disabled .mdl-checkbox__box-outline {\n    border: 2px solid rgba(0,0,0, 0.26);\n    cursor: auto; }\n\n.mdl-checkbox__focus-helper {\n  position: absolute;\n  top: 3px;\n  left: 0;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  border-radius: 50%;\n  background-color: transparent; }\n  .mdl-checkbox.is-focused .mdl-checkbox__focus-helper {\n    box-shadow: 0 0 0px 8px rgba(0, 0, 0, 0.1);\n    background-color: rgba(0, 0, 0, 0.1); }\n  .mdl-checkbox.is-focused.is-checked .mdl-checkbox__focus-helper {\n    box-shadow: 0 0 0px 8px rgba(63,81,181, 0.26);\n    background-color: rgba(63,81,181, 0.26); }\n\n.mdl-checkbox__tick-outline {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  -webkit-mask: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==\");\n          mask: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8ZGVmcz4KICAgIDxjbGlwUGF0aCBpZD0iY2xpcCI+CiAgICAgIDxwYXRoCiAgICAgICAgIGQ9Ik0gMCwwIDAsMSAxLDEgMSwwIDAsMCB6IE0gMC44NTM0Mzc1LDAuMTY3MTg3NSAwLjk1OTY4NzUsMC4yNzMxMjUgMC40MjkzNzUsMC44MDM0Mzc1IDAuMzIzMTI1LDAuOTA5Njg3NSAwLjIxNzE4NzUsMC44MDM0Mzc1IDAuMDQwMzEyNSwwLjYyNjg3NSAwLjE0NjU2MjUsMC41MjA2MjUgMC4zMjMxMjUsMC42OTc1IDAuODUzNDM3NSwwLjE2NzE4NzUgeiIKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KICAgIDwvY2xpcFBhdGg+CiAgICA8bWFzayBpZD0ibWFzayIgbWFza1VuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgbWFza0NvbnRlbnRVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPgogICAgICA8cGF0aAogICAgICAgICBkPSJNIDAsMCAwLDEgMSwxIDEsMCAwLDAgeiBNIDAuODUzNDM3NSwwLjE2NzE4NzUgMC45NTk2ODc1LDAuMjczMTI1IDAuNDI5Mzc1LDAuODAzNDM3NSAwLjMyMzEyNSwwLjkwOTY4NzUgMC4yMTcxODc1LDAuODAzNDM3NSAwLjA0MDMxMjUsMC42MjY4NzUgMC4xNDY1NjI1LDAuNTIwNjI1IDAuMzIzMTI1LDAuNjk3NSAwLjg1MzQzNzUsMC4xNjcxODc1IHoiCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmUiIC8+CiAgICA8L21hc2s+CiAgPC9kZWZzPgogIDxyZWN0CiAgICAgd2lkdGg9IjEiCiAgICAgaGVpZ2h0PSIxIgogICAgIHg9IjAiCiAgICAgeT0iMCIKICAgICBjbGlwLXBhdGg9InVybCgjY2xpcCkiCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZSIgLz4KPC9zdmc+Cg==\");\n  background: transparent;\n  -webkit-transition-duration: 0.28s;\n          transition-duration: 0.28s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-property: background;\n          transition-property: background; }\n  .mdl-checkbox.is-checked .mdl-checkbox__tick-outline {\n    background: rgb(63,81,181) url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K\"); }\n  .mdl-checkbox.is-checked.is-disabled .mdl-checkbox__tick-outline {\n    background: rgba(0,0,0, 0.26) url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMSAxIgogICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0Ij4KICA8cGF0aAogICAgIGQ9Ik0gMC4wNDAzODA1OSwwLjYyNjc3NjcgMC4xNDY0NDY2MSwwLjUyMDcxMDY4IDAuNDI5Mjg5MzIsMC44MDM1NTMzOSAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IE0gMC4yMTcxNTcyOSwwLjgwMzU1MzM5IDAuODUzNTUzMzksMC4xNjcxNTcyOSAwLjk1OTYxOTQxLDAuMjczMjIzMyAwLjMyMzIyMzMsMC45MDk2MTk0MSB6IgogICAgIGlkPSJyZWN0Mzc4MCIKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lIiAvPgo8L3N2Zz4K\"); }\n\n.mdl-checkbox__label {\n  position: relative;\n  cursor: pointer;\n  font-size: 16px;\n  line-height: 24px;\n  margin: 0; }\n  .mdl-checkbox.is-disabled .mdl-checkbox__label {\n    color: rgba(0,0,0, 0.26);\n    cursor: auto; }\n\n.mdl-checkbox__ripple-container {\n  position: absolute;\n  z-index: 2;\n  top: -6px;\n  left: -10px;\n  box-sizing: border-box;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  cursor: pointer;\n  overflow: hidden;\n  -webkit-mask-image: -webkit-radial-gradient(circle, white, black); }\n  .mdl-checkbox__ripple-container .mdl-ripple {\n    background: rgb(63,81,181); }\n  .mdl-checkbox.is-disabled .mdl-checkbox__ripple-container {\n    cursor: auto; }\n  .mdl-checkbox.is-disabled .mdl-checkbox__ripple-container .mdl-ripple {\n    background: transparent; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-data-table {\n  position: relative;\n  border: 1px solid rgba(0, 0, 0, 0.12);\n  border-collapse: collapse;\n  white-space: nowrap;\n  font-size: 13px;\n  background-color: rgb(255,255,255); }\n  .mdl-data-table thead {\n    padding-bottom: 3px; }\n    .mdl-data-table thead .mdl-data-table__select {\n      margin-top: 0; }\n  .mdl-data-table tbody tr {\n    position: relative;\n    height: 48px;\n    -webkit-transition-duration: 0.28s;\n            transition-duration: 0.28s;\n    -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    -webkit-transition-property: background-color;\n            transition-property: background-color; }\n    .mdl-data-table tbody tr.is-selected {\n      background-color: #e0e0e0; }\n    .mdl-data-table tbody tr:hover {\n      background-color: #eeeeee; }\n  .mdl-data-table td, .mdl-data-table th {\n    padding: 0 18px 0 18px;\n    text-align: right; }\n    .mdl-data-table td:first-of-type, .mdl-data-table th:first-of-type {\n      padding-left: 24px; }\n    .mdl-data-table td:last-of-type, .mdl-data-table th:last-of-type {\n      padding-right: 24px; }\n  .mdl-data-table td {\n    position: relative;\n    vertical-align: top;\n    height: 48px;\n    border-top: 1px solid rgba(0, 0, 0, 0.12);\n    border-bottom: 1px solid rgba(0, 0, 0, 0.12);\n    padding-top: 12px;\n    box-sizing: border-box; }\n    .mdl-data-table td .mdl-data-table__select {\n      vertical-align: top;\n      position: absolute;\n      left: 24px; }\n  .mdl-data-table th {\n    position: relative;\n    vertical-align: bottom;\n    text-overflow: ellipsis;\n    font-size: 14px;\n    font-weight: bold;\n    line-height: 24px;\n    letter-spacing: 0;\n    height: 48px;\n    font-size: 12px;\n    color: rgba(0, 0, 0, 0.54);\n    padding-bottom: 8px;\n    box-sizing: border-box; }\n    .mdl-data-table th .mdl-data-table__select {\n      position: relative; }\n\n.mdl-data-table__select {\n  width: 16px; }\n\n.mdl-data-table__cell--non-numeric.mdl-data-table__cell--non-numeric {\n  text-align: left; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-mega-footer {\n  padding: 16px 40px;\n  color: rgb(158,158,158);\n  background-color: rgb(66,66,66); }\n\n.mdl-mega-footer--top-section:after,\n.mdl-mega-footer--middle-section:after,\n.mdl-mega-footer--bottom-section:after,\n.mdl-mega-footer__top-section:after,\n.mdl-mega-footer__middle-section:after,\n.mdl-mega-footer__bottom-section:after {\n  content: '';\n  display: block;\n  clear: both; }\n\n.mdl-mega-footer--left-section,\n.mdl-mega-footer__left-section {\n  margin-bottom: 16px; }\n\n.mdl-mega-footer--right-section,\n.mdl-mega-footer__right-section {\n  margin-bottom: 16px; }\n\n.mdl-mega-footer--right-section a,\n.mdl-mega-footer__right-section a {\n  display: block;\n  margin-bottom: 16px;\n  color: inherit;\n  text-decoration: none; }\n\n@media screen and (min-width: 760px) {\n  .mdl-mega-footer--left-section,\n  .mdl-mega-footer__left-section {\n    float: left; }\n  .mdl-mega-footer--right-section,\n  .mdl-mega-footer__right-section {\n    float: right; }\n  .mdl-mega-footer--right-section a,\n  .mdl-mega-footer__right-section a {\n    display: inline-block;\n    margin-left: 16px;\n    line-height: 36px;\n    vertical-align: middle; } }\n\n.mdl-mega-footer--social-btn,\n.mdl-mega-footer__social-btn {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  margin: 0;\n  background-color: rgb(158,158,158);\n  border: none; }\n\n.mdl-mega-footer--drop-down-section,\n.mdl-mega-footer__drop-down-section {\n  display: block;\n  position: relative; }\n\n@media screen and (min-width: 760px) {\n  .mdl-mega-footer--drop-down-section,\n  .mdl-mega-footer__drop-down-section {\n    width: 33%; }\n  .mdl-mega-footer--drop-down-section:nth-child(1),\n  .mdl-mega-footer--drop-down-section:nth-child(2),\n  .mdl-mega-footer__drop-down-section:nth-child(1),\n  .mdl-mega-footer__drop-down-section:nth-child(2) {\n    float: left; }\n  .mdl-mega-footer--drop-down-section:nth-child(3),\n  .mdl-mega-footer__drop-down-section:nth-child(3) {\n    float: right; }\n    .mdl-mega-footer--drop-down-section:nth-child(3):after,\n    .mdl-mega-footer__drop-down-section:nth-child(3):after {\n      clear: right; }\n  .mdl-mega-footer--drop-down-section:nth-child(4),\n  .mdl-mega-footer__drop-down-section:nth-child(4) {\n    clear: right;\n    float: right; }\n  .mdl-mega-footer--middle-section:after,\n  .mdl-mega-footer__middle-section:after {\n    content: '';\n    display: block;\n    clear: both; }\n  .mdl-mega-footer--bottom-section,\n  .mdl-mega-footer__bottom-section {\n    padding-top: 0; } }\n\n@media screen and (min-width: 1024px) {\n  .mdl-mega-footer--drop-down-section,\n  .mdl-mega-footer--drop-down-section:nth-child(3),\n  .mdl-mega-footer--drop-down-section:nth-child(4),\n  .mdl-mega-footer__drop-down-section,\n  .mdl-mega-footer__drop-down-section:nth-child(3),\n  .mdl-mega-footer__drop-down-section:nth-child(4) {\n    width: 24%;\n    float: left; } }\n\n.mdl-mega-footer--heading-checkbox,\n.mdl-mega-footer__heading-checkbox {\n  position: absolute;\n  width: 100%;\n  height: 55.8px;\n  padding: 32px;\n  margin: 0;\n  margin-top: -16px;\n  cursor: pointer;\n  z-index: 1;\n  opacity: 0; }\n  .mdl-mega-footer--heading-checkbox ~ .mdl-mega-footer--heading:after,\n  .mdl-mega-footer--heading-checkbox ~ .mdl-mega-footer__heading:after,\n  .mdl-mega-footer__heading-checkbox ~ .mdl-mega-footer--heading:after,\n  .mdl-mega-footer__heading-checkbox ~ .mdl-mega-footer__heading:after {\n    font-family: 'Material Icons';\n    content: '\\E5CE'; }\n\n.mdl-mega-footer--heading-checkbox:checked ~ ul,\n.mdl-mega-footer__heading-checkbox:checked ~ ul {\n  display: none; }\n\n.mdl-mega-footer--heading-checkbox:checked ~ .mdl-mega-footer--heading:after,\n.mdl-mega-footer--heading-checkbox:checked ~ .mdl-mega-footer__heading:after,\n.mdl-mega-footer__heading-checkbox:checked ~ .mdl-mega-footer--heading:after,\n.mdl-mega-footer__heading-checkbox:checked ~ .mdl-mega-footer__heading:after {\n  font-family: 'Material Icons';\n  content: '\\E5CF'; }\n\n.mdl-mega-footer--heading,\n.mdl-mega-footer__heading {\n  position: relative;\n  width: 100%;\n  padding-right: 39.8px;\n  margin-bottom: 16px;\n  box-sizing: border-box;\n  font-size: 14px;\n  line-height: 23.8px;\n  font-weight: 500;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  color: rgb(224,224,224); }\n\n.mdl-mega-footer--heading:after,\n.mdl-mega-footer__heading:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  right: 0;\n  display: block;\n  width: 23.8px;\n  height: 23.8px;\n  background-size: cover; }\n\n.mdl-mega-footer--link-list,\n.mdl-mega-footer__link-list {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n  margin-bottom: 32px; }\n  .mdl-mega-footer--link-list:after,\n  .mdl-mega-footer__link-list:after {\n    clear: both;\n    display: block;\n    content: ''; }\n\n.mdl-mega-footer--link-list li,\n.mdl-mega-footer__link-list li {\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  line-height: 20px; }\n\n.mdl-mega-footer--link-list a,\n.mdl-mega-footer__link-list a {\n  color: inherit;\n  text-decoration: none;\n  white-space: nowrap; }\n\n@media screen and (min-width: 760px) {\n  .mdl-mega-footer--heading-checkbox,\n  .mdl-mega-footer__heading-checkbox {\n    display: none; }\n    .mdl-mega-footer--heading-checkbox ~ .mdl-mega-footer--heading:after,\n    .mdl-mega-footer--heading-checkbox ~ .mdl-mega-footer__heading:after,\n    .mdl-mega-footer__heading-checkbox ~ .mdl-mega-footer--heading:after,\n    .mdl-mega-footer__heading-checkbox ~ .mdl-mega-footer__heading:after {\n      background-image: none; }\n  .mdl-mega-footer--heading-checkbox:checked ~ ul,\n  .mdl-mega-footer__heading-checkbox:checked ~ ul {\n    display: block; }\n  .mdl-mega-footer--heading-checkbox:checked ~ .mdl-mega-footer--heading:after,\n  .mdl-mega-footer--heading-checkbox:checked ~ .mdl-mega-footer__heading:after,\n  .mdl-mega-footer__heading-checkbox:checked ~ .mdl-mega-footer--heading:after,\n  .mdl-mega-footer__heading-checkbox:checked ~ .mdl-mega-footer__heading:after {\n    content: ''; } }\n\n.mdl-mega-footer--bottom-section,\n.mdl-mega-footer__bottom-section {\n  padding-top: 16px;\n  margin-bottom: 16px; }\n\n.mdl-logo {\n  margin-bottom: 16px;\n  color: white; }\n\n.mdl-mega-footer--bottom-section .mdl-mega-footer--link-list li,\n.mdl-mega-footer__bottom-section .mdl-mega-footer__link-list li {\n  float: left;\n  margin-bottom: 0;\n  margin-right: 16px; }\n\n@media screen and (min-width: 760px) {\n  .mdl-logo {\n    float: left;\n    margin-bottom: 0;\n    margin-right: 16px; } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-mini-footer {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row wrap;\n      -ms-flex-flow: row wrap;\n          flex-flow: row wrap;\n  -webkit-box-pack: justify;\n  -webkit-justify-content: space-between;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  padding: 32px 16px;\n  color: rgb(158,158,158);\n  background-color: rgb(66,66,66); }\n  .mdl-mini-footer:after {\n    content: '';\n    display: block; }\n  .mdl-mini-footer .mdl-logo {\n    line-height: 36px; }\n\n.mdl-mini-footer--link-list,\n.mdl-mini-footer__link-list {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row nowrap;\n      -ms-flex-flow: row nowrap;\n          flex-flow: row nowrap;\n  list-style: none;\n  margin: 0;\n  padding: 0; }\n  .mdl-mini-footer--link-list li,\n  .mdl-mini-footer__link-list li {\n    margin-bottom: 0;\n    margin-right: 16px; }\n    @media screen and (min-width: 760px) {\n      .mdl-mini-footer--link-list li,\n      .mdl-mini-footer__link-list li {\n        line-height: 36px; } }\n  .mdl-mini-footer--link-list a,\n  .mdl-mini-footer__link-list a {\n    color: inherit;\n    text-decoration: none;\n    white-space: nowrap; }\n\n.mdl-mini-footer--left-section,\n.mdl-mini-footer__left-section {\n  display: inline-block;\n  -webkit-box-ordinal-group: 1;\n  -webkit-order: 0;\n      -ms-flex-order: 0;\n          order: 0; }\n\n.mdl-mini-footer--right-section,\n.mdl-mini-footer__right-section {\n  display: inline-block;\n  -webkit-box-ordinal-group: 2;\n  -webkit-order: 1;\n      -ms-flex-order: 1;\n          order: 1; }\n\n.mdl-mini-footer--social-btn,\n.mdl-mini-footer__social-btn {\n  width: 36px;\n  height: 36px;\n  padding: 0;\n  margin: 0;\n  background-color: rgb(158,158,158);\n  border: none; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-icon-toggle {\n  position: relative;\n  z-index: 1;\n  vertical-align: middle;\n  display: inline-block;\n  height: 32px;\n  margin: 0;\n  padding: 0; }\n\n.mdl-icon-toggle__input {\n  line-height: 32px; }\n  .mdl-icon-toggle.is-upgraded .mdl-icon-toggle__input {\n    position: absolute;\n    width: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    opacity: 0;\n    -ms-appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    appearance: none;\n    border: none; }\n\n.mdl-icon-toggle__label {\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  height: 32px;\n  width: 32px;\n  min-width: 32px;\n  color: rgb(97,97,97);\n  border-radius: 50%;\n  padding: 0;\n  margin-left: 0;\n  margin-right: 0;\n  text-align: center;\n  background-color: transparent;\n  will-change: background-color;\n  -webkit-transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1), color 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdl-icon-toggle__label.material-icons {\n    line-height: 32px;\n    font-size: 24px; }\n  .mdl-icon-toggle.is-checked .mdl-icon-toggle__label {\n    color: rgb(63,81,181); }\n  .mdl-icon-toggle.is-disabled .mdl-icon-toggle__label {\n    color: rgba(0,0,0, 0.26);\n    cursor: auto;\n    -webkit-transition: none;\n            transition: none; }\n  .mdl-icon-toggle.is-focused .mdl-icon-toggle__label {\n    background-color: rgba(0,0,0, 0.12); }\n  .mdl-icon-toggle.is-focused.is-checked .mdl-icon-toggle__label {\n    background-color: rgba(63,81,181, 0.26); }\n\n.mdl-icon-toggle__ripple-container {\n  position: absolute;\n  z-index: 2;\n  top: -2px;\n  left: -2px;\n  box-sizing: border-box;\n  width: 36px;\n  height: 36px;\n  border-radius: 50%;\n  cursor: pointer;\n  overflow: hidden;\n  -webkit-mask-image: -webkit-radial-gradient(circle, white, black); }\n  .mdl-icon-toggle__ripple-container .mdl-ripple {\n    background: rgb(97,97,97); }\n  .mdl-icon-toggle.is-disabled .mdl-icon-toggle__ripple-container {\n    cursor: auto; }\n  .mdl-icon-toggle.is-disabled .mdl-icon-toggle__ripple-container .mdl-ripple {\n    background: transparent; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-menu__container {\n  display: block;\n  margin: 0;\n  padding: 0;\n  border: none;\n  position: absolute;\n  overflow: visible;\n  height: 0;\n  width: 0;\n  z-index: -1; }\n  .mdl-menu__container.is-visible {\n    z-index: 999; }\n\n.mdl-menu__outline {\n  display: block;\n  background: rgb(255,255,255);\n  margin: 0;\n  padding: 0;\n  border: none;\n  border-radius: 2px;\n  position: absolute;\n  top: 0;\n  left: 0;\n  overflow: hidden;\n  opacity: 0;\n  -webkit-transform: scale(0);\n      -ms-transform: scale(0);\n          transform: scale(0);\n  -webkit-transform-origin: 0 0;\n      -ms-transform-origin: 0 0;\n          transform-origin: 0 0;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  will-change: transform;\n  -webkit-transition: -webkit-transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  z-index: -1; }\n  .mdl-menu__container.is-visible .mdl-menu__outline {\n    opacity: 1;\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1);\n    z-index: 999; }\n  .mdl-menu__outline.mdl-menu--bottom-right {\n    -webkit-transform-origin: 100% 0;\n        -ms-transform-origin: 100% 0;\n            transform-origin: 100% 0; }\n  .mdl-menu__outline.mdl-menu--top-left {\n    -webkit-transform-origin: 0 100%;\n        -ms-transform-origin: 0 100%;\n            transform-origin: 0 100%; }\n  .mdl-menu__outline.mdl-menu--top-right {\n    -webkit-transform-origin: 100% 100%;\n        -ms-transform-origin: 100% 100%;\n            transform-origin: 100% 100%; }\n\n.mdl-menu {\n  position: absolute;\n  list-style: none;\n  top: 0;\n  left: 0;\n  height: auto;\n  width: auto;\n  min-width: 124px;\n  padding: 8px 0;\n  margin: 0;\n  opacity: 0;\n  clip: rect(0 0 0 0);\n  z-index: -1; }\n  .mdl-menu__container.is-visible .mdl-menu {\n    opacity: 1;\n    z-index: 999; }\n  .mdl-menu.is-animating {\n    -webkit-transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), clip 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), clip 0.3s cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdl-menu.mdl-menu--bottom-right {\n    left: auto;\n    right: 0; }\n  .mdl-menu.mdl-menu--top-left {\n    top: auto;\n    bottom: 0; }\n  .mdl-menu.mdl-menu--top-right {\n    top: auto;\n    left: auto;\n    bottom: 0;\n    right: 0; }\n  .mdl-menu.mdl-menu--unaligned {\n    top: auto;\n    left: auto; }\n\n.mdl-menu__item {\n  display: block;\n  border: none;\n  color: rgba(0,0,0, 0.87);\n  background-color: transparent;\n  text-align: left;\n  margin: 0;\n  padding: 0 16px;\n  outline-color: rgb(189,189,189);\n  position: relative;\n  overflow: hidden;\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 24px;\n  letter-spacing: 0;\n  text-decoration: none;\n  cursor: pointer;\n  height: 48px;\n  line-height: 48px;\n  white-space: nowrap;\n  opacity: 0;\n  -webkit-transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n  .mdl-menu__container.is-visible .mdl-menu__item {\n    opacity: 1; }\n  .mdl-menu__item::-moz-focus-inner {\n    border: 0; }\n  .mdl-menu__item[disabled] {\n    color: rgb(189,189,189);\n    background-color: transparent;\n    cursor: auto; }\n    .mdl-menu__item[disabled]:hover {\n      background-color: transparent; }\n    .mdl-menu__item[disabled]:focus {\n      background-color: transparent; }\n    .mdl-menu__item[disabled] .mdl-ripple {\n      background: transparent; }\n  .mdl-menu__item:hover {\n    background-color: rgb(238,238,238); }\n  .mdl-menu__item:focus {\n    outline: none;\n    background-color: rgb(238,238,238); }\n  .mdl-menu__item:active {\n    background-color: rgb(224,224,224); }\n\n.mdl-menu__item--ripple-container {\n  display: block;\n  height: 100%;\n  left: 0px;\n  position: absolute;\n  top: 0px;\n  width: 100%;\n  z-index: 0;\n  overflow: hidden; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-progress {\n  display: block;\n  position: relative;\n  height: 4px;\n  width: 500px; }\n\n.mdl-progress > .bar {\n  display: block;\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 0%;\n  -webkit-transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1); }\n\n.mdl-progress > .progressbar {\n  background-color: rgb(63,81,181);\n  z-index: 1;\n  left: 0; }\n\n.mdl-progress > .bufferbar {\n  background-image: -webkit-linear-gradient(left, rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), -webkit-linear-gradient(left, rgb(63,81,181), rgb(63,81,181));\n  background-image: linear-gradient(to right, rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), linear-gradient(to right, rgb(63,81,181), rgb(63,81,181));\n  z-index: 0;\n  left: 0; }\n\n.mdl-progress > .auxbar {\n  right: 0; }\n\n@supports (-webkit-appearance: none) {\n  .mdl-progress:not(.mdl-progress__indeterminate):not(.mdl-progress__indeterminate) > .auxbar {\n    background-image: -webkit-linear-gradient(left, rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), -webkit-linear-gradient(left, rgb(63,81,181), rgb(63,81,181));\n    background-image: linear-gradient(to right, rgba(255,255,255, 0.7), rgba(255,255,255, 0.7)), linear-gradient(to right, rgb(63,81,181), rgb(63,81,181));\n    -webkit-mask: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=\");\n            mask: url(\"data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+Cjxzdmcgd2lkdGg9IjEyIiBoZWlnaHQ9IjQiIHZpZXdQb3J0PSIwIDAgMTIgNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxlbGxpcHNlIGN4PSIyIiBjeT0iMiIgcng9IjIiIHJ5PSIyIj4KICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9ImN4IiBmcm9tPSIyIiB0bz0iLTEwIiBkdXI9IjAuNnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiAvPgogIDwvZWxsaXBzZT4KICA8ZWxsaXBzZSBjeD0iMTQiIGN5PSIyIiByeD0iMiIgcnk9IjIiIGNsYXNzPSJsb2FkZXIiPgogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iY3giIGZyb209IjE0IiB0bz0iMiIgZHVyPSIwLjZzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KICA8L2VsbGlwc2U+Cjwvc3ZnPgo=\"); } }\n\n.mdl-progress:not(.mdl-progress__indeterminate) > .auxbar {\n  background-image: -webkit-linear-gradient(left, rgba(255,255,255, 0.9), rgba(255,255,255, 0.9)), -webkit-linear-gradient(left, rgb(63,81,181), rgb(63,81,181));\n  background-image: linear-gradient(to right, rgba(255,255,255, 0.9), rgba(255,255,255, 0.9)), linear-gradient(to right, rgb(63,81,181), rgb(63,81,181)); }\n\n.mdl-progress.mdl-progress__indeterminate > .bar1 {\n  background-color: rgb(63,81,181);\n  -webkit-animation-name: indeterminate1;\n          animation-name: indeterminate1;\n  -webkit-animation-duration: 2s;\n          animation-duration: 2s;\n  -webkit-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n          animation-timing-function: linear; }\n\n.mdl-progress.mdl-progress__indeterminate > .bar3 {\n  background-image: none;\n  background-color: rgb(63,81,181);\n  -webkit-animation-name: indeterminate2;\n          animation-name: indeterminate2;\n  -webkit-animation-duration: 2s;\n          animation-duration: 2s;\n  -webkit-animation-iteration-count: infinite;\n          animation-iteration-count: infinite;\n  -webkit-animation-timing-function: linear;\n          animation-timing-function: linear; }\n\n@-webkit-keyframes indeterminate1 {\n  0% {\n    left: 0%;\n    width: 0%; }\n  50% {\n    left: 25%;\n    width: 75%; }\n  75% {\n    left: 100%;\n    width: 0%; } }\n\n@keyframes indeterminate1 {\n  0% {\n    left: 0%;\n    width: 0%; }\n  50% {\n    left: 25%;\n    width: 75%; }\n  75% {\n    left: 100%;\n    width: 0%; } }\n\n@-webkit-keyframes indeterminate2 {\n  0% {\n    left: 0%;\n    width: 0%; }\n  50% {\n    left: 0%;\n    width: 0%; }\n  75% {\n    left: 0%;\n    width: 25%; }\n  100% {\n    left: 100%;\n    width: 0%; } }\n\n@keyframes indeterminate2 {\n  0% {\n    left: 0%;\n    width: 0%; }\n  50% {\n    left: 0%;\n    width: 0%; }\n  75% {\n    left: 0%;\n    width: 25%; }\n  100% {\n    left: 100%;\n    width: 0%; } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-navigation {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-wrap: nowrap;\n      -ms-flex-wrap: nowrap;\n          flex-wrap: nowrap;\n  box-sizing: border-box; }\n\n.mdl-navigation__link {\n  color: rgb(66,66,66);\n  text-decoration: none;\n  font-weight: 500;\n  font-size: 13px;\n  margin: 0; }\n\n.mdl-layout {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: relative;\n  -webkit-overflow-scrolling: touch; }\n\n.mdl-layout.is-small-screen .mdl-layout--large-screen-only {\n  display: none; }\n\n.mdl-layout:not(.is-small-screen) .mdl-layout--small-screen-only {\n  display: none; }\n\n.mdl-layout__container {\n  position: absolute;\n  width: 100%;\n  height: 100%; }\n\n.mdl-layout-title {\n  display: block;\n  position: relative;\n  font-family: \"Roboto\", \"Helvetica\", \"Arial\", sans-serif;\n  font-size: 20px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: 0.02em;\n  font-weight: 400;\n  box-sizing: border-box; }\n\n.mdl-layout-spacer {\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1; }\n\n.mdl-layout__drawer {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-flex-wrap: nowrap;\n      -ms-flex-wrap: nowrap;\n          flex-wrap: nowrap;\n  width: 240px;\n  height: 100%;\n  max-height: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  box-sizing: border-box;\n  border-right: 1px solid rgb(224,224,224);\n  background: rgb(250,250,250);\n  -webkit-transform: translateX(-250px);\n      -ms-transform: translateX(-250px);\n          transform: translateX(-250px);\n  -webkit-transform-style: preserve-3d;\n          transform-style: preserve-3d;\n  will-change: transform;\n  -webkit-transition-duration: 0.2s;\n          transition-duration: 0.2s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-property: -webkit-transform;\n          transition-property: transform;\n  color: rgb(66,66,66);\n  overflow: visible;\n  overflow-y: auto;\n  z-index: 5; }\n  .mdl-layout__drawer.is-visible {\n    -webkit-transform: translateX(0);\n        -ms-transform: translateX(0);\n            transform: translateX(0); }\n  .mdl-layout__drawer > * {\n    -webkit-flex-shrink: 0;\n        -ms-flex-negative: 0;\n            flex-shrink: 0; }\n  .mdl-layout__drawer > .mdl-layout-title {\n    line-height: 64px;\n    padding-left: 40px; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__drawer > .mdl-layout-title {\n        line-height: 56px;\n        padding-left: 16px; } }\n  .mdl-layout__drawer .mdl-navigation {\n    -webkit-box-orient: vertical;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: column;\n        -ms-flex-direction: column;\n            flex-direction: column;\n    -webkit-box-align: stretch;\n    -webkit-align-items: stretch;\n        -ms-flex-align: stretch;\n            align-items: stretch;\n    padding-top: 16px; }\n    .mdl-layout__drawer .mdl-navigation .mdl-navigation__link {\n      display: block;\n      -webkit-flex-shrink: 0;\n          -ms-flex-negative: 0;\n              flex-shrink: 0;\n      padding: 16px 40px;\n      margin: 0;\n      color: #757575; }\n      @media screen and (max-width: 1024px) {\n        .mdl-layout__drawer .mdl-navigation .mdl-navigation__link {\n          padding: 16px 16px; } }\n      .mdl-layout__drawer .mdl-navigation .mdl-navigation__link:hover {\n        background-color: rgb(224,224,224); }\n      .mdl-layout__drawer .mdl-navigation .mdl-navigation__link--current {\n        background-color: rgb(0,0,0);\n        color: rgb(63,81,181); }\n  @media screen and (min-width: 1025px) {\n    .mdl-layout--fixed-drawer > .mdl-layout__drawer {\n      -webkit-transform: translateX(0);\n          -ms-transform: translateX(0);\n              transform: translateX(0); } }\n\n.mdl-layout__drawer-button {\n  display: block;\n  position: absolute;\n  height: 48px;\n  width: 48px;\n  border: 0;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  overflow: hidden;\n  text-align: center;\n  cursor: pointer;\n  font-size: 26px;\n  line-height: 50px;\n  font-family: Helvetica, Arial, sans-serif;\n  margin: 10px 12px;\n  top: 0;\n  left: 0;\n  color: rgb(255,255,255);\n  z-index: 4; }\n  .mdl-layout__header .mdl-layout__drawer-button {\n    position: absolute;\n    color: rgb(255,255,255);\n    background-color: inherit; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header .mdl-layout__drawer-button {\n        margin: 4px; } }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__drawer-button {\n      margin: 4px;\n      color: rgba(0, 0, 0, 0.5); } }\n  @media screen and (min-width: 1025px) {\n    .mdl-layout--fixed-drawer > .mdl-layout__drawer-button {\n      display: none; } }\n\n.mdl-layout__header {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: column;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-flex-wrap: nowrap;\n      -ms-flex-wrap: nowrap;\n          flex-wrap: nowrap;\n  -webkit-box-pack: start;\n  -webkit-justify-content: flex-start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  box-sizing: border-box;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  border: none;\n  min-height: 64px;\n  max-height: 1000px;\n  z-index: 3;\n  background-color: rgb(63,81,181);\n  color: rgb(255,255,255);\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  -webkit-transition-duration: 0.2s;\n          transition-duration: 0.2s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-property: max-height, box-shadow;\n          transition-property: max-height, box-shadow; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__header {\n      min-height: 56px; } }\n  .mdl-layout--fixed-drawer:not(.is-small-screen) > .mdl-layout__header {\n    margin-left: 240px;\n    width: calc(100% - 240px); }\n  .mdl-layout--fixed-drawer > .mdl-layout__header .mdl-layout__header-row {\n    padding-left: 40px; }\n  .mdl-layout__header > .mdl-layout-icon {\n    position: absolute;\n    left: 40px;\n    top: 16px;\n    height: 32px;\n    width: 32px;\n    overflow: hidden;\n    z-index: 3;\n    display: block; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header > .mdl-layout-icon {\n        left: 16px;\n        top: 12px; } }\n  .mdl-layout.has-drawer .mdl-layout__header > .mdl-layout-icon {\n    display: none; }\n  .mdl-layout__header.is-compact {\n    max-height: 64px; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header.is-compact {\n        max-height: 56px; } }\n  .mdl-layout__header.is-compact.has-tabs {\n    height: 112px; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header.is-compact.has-tabs {\n        min-height: 104px; } }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__header {\n      display: none; }\n    .mdl-layout--fixed-header > .mdl-layout__header {\n      display: -webkit-box;\n      display: -webkit-flex;\n      display: -ms-flexbox;\n      display: flex; } }\n\n.mdl-layout__header--transparent.mdl-layout__header--transparent {\n  background-color: transparent;\n  box-shadow: none; }\n\n.mdl-layout__header--seamed {\n  box-shadow: none; }\n\n.mdl-layout__header--scroll {\n  box-shadow: none; }\n\n.mdl-layout__header--waterfall {\n  box-shadow: none;\n  overflow: hidden; }\n  .mdl-layout__header--waterfall.is-casting-shadow {\n    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n.mdl-layout__header-row {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-flex-wrap: nowrap;\n      -ms-flex-wrap: nowrap;\n          flex-wrap: nowrap;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  box-sizing: border-box;\n  -webkit-align-self: stretch;\n      -ms-flex-item-align: stretch;\n          align-self: stretch;\n  -webkit-box-align: center;\n  -webkit-align-items: center;\n      -ms-flex-align: center;\n          align-items: center;\n  height: 64px;\n  margin: 0;\n  padding: 0 40px 0 80px; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__header-row {\n      height: 56px;\n      padding: 0 16px 0 72px; } }\n  .mdl-layout__header-row > * {\n    -webkit-flex-shrink: 0;\n        -ms-flex-negative: 0;\n            flex-shrink: 0; }\n  .mdl-layout__header--scroll .mdl-layout__header-row {\n    width: 100%; }\n  .mdl-layout__header-row .mdl-navigation {\n    margin: 0;\n    padding: 0;\n    height: 64px;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n    -webkit-flex-direction: row;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    -webkit-box-align: center;\n    -webkit-align-items: center;\n        -ms-flex-align: center;\n            align-items: center; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header-row .mdl-navigation {\n        height: 56px; } }\n  .mdl-layout__header-row .mdl-navigation__link {\n    display: block;\n    color: rgb(255,255,255);\n    line-height: 64px;\n    padding: 0 24px; }\n    @media screen and (max-width: 1024px) {\n      .mdl-layout__header-row .mdl-navigation__link {\n        line-height: 56px;\n        padding: 0 16px; } }\n\n.mdl-layout__obfuscator {\n  background-color: transparent;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  width: 100%;\n  z-index: 4;\n  visibility: hidden;\n  -webkit-transition-property: background-color;\n          transition-property: background-color;\n  -webkit-transition-duration: 0.2s;\n          transition-duration: 0.2s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdl-layout__drawer.is-visible ~ .mdl-layout__obfuscator {\n    background-color: rgba(0, 0, 0, 0.5);\n    visibility: visible; }\n\n.mdl-layout__content {\n  -ms-flex: 0 1 auto;\n  display: inline-block;\n  overflow-y: auto;\n  overflow-x: hidden;\n  -webkit-box-flex: 1;\n  -webkit-flex-grow: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  z-index: 1;\n  -webkit-overflow-scrolling: touch; }\n  .mdl-layout--fixed-drawer > .mdl-layout__content {\n    margin-left: 240px; }\n  .mdl-layout__container.has-scrolling-header .mdl-layout__content {\n    overflow: visible; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout--fixed-drawer > .mdl-layout__content {\n      margin-left: 0; }\n    .mdl-layout__container.has-scrolling-header .mdl-layout__content {\n      overflow-y: auto;\n      overflow-x: hidden; } }\n\n.mdl-layout__tab-bar {\n  height: 96px;\n  margin: 0;\n  width: calc(100% -         112px);\n  padding: 0 0 0 56px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  background-color: rgb(63,81,181);\n  overflow-y: hidden;\n  overflow-x: scroll; }\n  .mdl-layout__tab-bar::-webkit-scrollbar {\n    display: none; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__tab-bar {\n      width: calc(100% -           60px);\n      padding: 0 0 0 60px; } }\n  .mdl-layout--fixed-tabs .mdl-layout__tab-bar {\n    padding: 0;\n    overflow: hidden;\n    width: 100%; }\n\n.mdl-layout__tab-bar-container {\n  position: relative;\n  height: 48px;\n  width: 100%;\n  border: none;\n  margin: 0;\n  z-index: 2;\n  -webkit-box-flex: 0;\n  -webkit-flex-grow: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  overflow: hidden; }\n  .mdl-layout__container > .mdl-layout__tab-bar-container {\n    position: absolute;\n    top: 0;\n    left: 0; }\n\n.mdl-layout__tab-bar-button {\n  display: inline-block;\n  position: absolute;\n  top: 0;\n  height: 48px;\n  width: 56px;\n  z-index: 4;\n  text-align: center;\n  background-color: rgb(63,81,181);\n  color: transparent;\n  cursor: pointer;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__tab-bar-button {\n      display: none;\n      width: 60px; } }\n  .mdl-layout--fixed-tabs .mdl-layout__tab-bar-button {\n    display: none; }\n  .mdl-layout__tab-bar-button .material-icons {\n    line-height: 48px; }\n  .mdl-layout__tab-bar-button.is-active {\n    color: rgb(255,255,255); }\n\n.mdl-layout__tab-bar-left-button {\n  left: 0; }\n\n.mdl-layout__tab-bar-right-button {\n  right: 0; }\n\n.mdl-layout__tab {\n  margin: 0;\n  border: none;\n  padding: 0 24px 0 24px;\n  float: left;\n  position: relative;\n  display: block;\n  -webkit-box-flex: 0;\n  -webkit-flex-grow: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -webkit-flex-shrink: 0;\n      -ms-flex-negative: 0;\n          flex-shrink: 0;\n  text-decoration: none;\n  height: 48px;\n  line-height: 48px;\n  text-align: center;\n  font-weight: 500;\n  font-size: 14px;\n  text-transform: uppercase;\n  color: rgba(255,255,255, 0.6);\n  overflow: hidden; }\n  @media screen and (max-width: 1024px) {\n    .mdl-layout__tab {\n      padding: 0 12px 0 12px; } }\n  .mdl-layout--fixed-tabs .mdl-layout__tab {\n    float: none;\n    -webkit-box-flex: 1;\n    -webkit-flex-grow: 1;\n        -ms-flex-positive: 1;\n            flex-grow: 1;\n    padding: 0; }\n  .mdl-layout.is-upgraded .mdl-layout__tab.is-active {\n    color: rgb(255,255,255); }\n  .mdl-layout.is-upgraded .mdl-layout__tab.is-active::after {\n    height: 2px;\n    width: 100%;\n    display: block;\n    content: \" \";\n    bottom: 0;\n    left: 0;\n    position: absolute;\n    background: rgb(255,64,129);\n    -webkit-animation: border-expand 0.2s cubic-bezier(0.4, 0, 0.4, 1) 0.01s alternate forwards;\n            animation: border-expand 0.2s cubic-bezier(0.4, 0, 0.4, 1) 0.01s alternate forwards;\n    -webkit-transition: all 1s cubic-bezier(0.4, 0, 1, 1);\n            transition: all 1s cubic-bezier(0.4, 0, 1, 1); }\n  .mdl-layout__tab .mdl-layout__tab-ripple-container {\n    display: block;\n    position: absolute;\n    height: 100%;\n    width: 100%;\n    left: 0;\n    top: 0;\n    z-index: 1;\n    overflow: hidden; }\n    .mdl-layout__tab .mdl-layout__tab-ripple-container .mdl-ripple {\n      background-color: rgb(255,255,255); }\n\n.mdl-layout__tab-panel {\n  display: block; }\n  .mdl-layout.is-upgraded .mdl-layout__tab-panel {\n    display: none; }\n  .mdl-layout.is-upgraded .mdl-layout__tab-panel.is-active {\n    display: block; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-radio {\n  position: relative;\n  font-size: 16px;\n  line-height: 24px;\n  display: inline-block;\n  box-sizing: border-box;\n  margin: 0;\n  padding-left: 0; }\n  .mdl-radio.is-upgraded {\n    padding-left: 24px; }\n\n.mdl-radio__button {\n  line-height: 24px; }\n  .mdl-radio.is-upgraded .mdl-radio__button {\n    position: absolute;\n    width: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    opacity: 0;\n    -ms-appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    appearance: none;\n    border: none; }\n\n.mdl-radio__outer-circle {\n  position: absolute;\n  top: 2px;\n  left: 0;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 16px;\n  height: 16px;\n  margin: 0;\n  cursor: pointer;\n  border: 2px solid rgba(0,0,0, 0.54);\n  border-radius: 50%;\n  z-index: 2; }\n  .mdl-radio.is-checked .mdl-radio__outer-circle {\n    border: 2px solid rgb(63,81,181); }\n  .mdl-radio.is-disabled .mdl-radio__outer-circle {\n    border: 2px solid rgba(0,0,0, 0.26);\n    cursor: auto; }\n\n.mdl-radio__inner-circle {\n  position: absolute;\n  z-index: 1;\n  margin: 0;\n  top: 6px;\n  left: 4px;\n  box-sizing: border-box;\n  width: 8px;\n  height: 8px;\n  cursor: pointer;\n  -webkit-transition-duration: 0.28s;\n          transition-duration: 0.28s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-property: -webkit-transform;\n          transition-property: transform;\n  -webkit-transform: scale3d(0, 0, 0);\n          transform: scale3d(0, 0, 0);\n  border-radius: 50%;\n  background: rgb(63,81,181); }\n  .mdl-radio.is-checked .mdl-radio__inner-circle {\n    -webkit-transform: scale3d(1, 1, 1);\n            transform: scale3d(1, 1, 1); }\n  .mdl-radio.is-disabled .mdl-radio__inner-circle {\n    background: rgba(0,0,0, 0.26);\n    cursor: auto; }\n  .mdl-radio.is-focused .mdl-radio__inner-circle {\n    box-shadow: 0 0 0px 10px rgba(0, 0, 0, 0.1); }\n\n.mdl-radio__label {\n  cursor: pointer; }\n  .mdl-radio.is-disabled .mdl-radio__label {\n    color: rgba(0,0,0, 0.26);\n    cursor: auto; }\n\n.mdl-radio__ripple-container {\n  position: absolute;\n  z-index: 2;\n  top: -9px;\n  left: -13px;\n  box-sizing: border-box;\n  width: 42px;\n  height: 42px;\n  border-radius: 50%;\n  cursor: pointer;\n  overflow: hidden;\n  -webkit-mask-image: -webkit-radial-gradient(circle, white, black); }\n  .mdl-radio__ripple-container .mdl-ripple {\n    background: rgb(63,81,181); }\n  .mdl-radio.is-disabled .mdl-radio__ripple-container {\n    cursor: auto; }\n  .mdl-radio.is-disabled .mdl-radio__ripple-container .mdl-ripple {\n    background: transparent; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n_:-ms-input-placeholder, :root .mdl-slider.mdl-slider.is-upgraded {\n  -ms-appearance: none;\n  height: 32px;\n  margin: 0; }\n\n.mdl-slider {\n  width: calc(100% - 40px);\n  margin: 0 20px; }\n  .mdl-slider.is-upgraded {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    height: 2px;\n    background: transparent;\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    -ms-user-select: none;\n        user-select: none;\n    outline: 0;\n    padding: 0;\n    color: rgb(63,81,181);\n    -webkit-align-self: center;\n        -ms-flex-item-align: center;\n            align-self: center;\n    z-index: 1;\n    /**************************** Tracks ****************************/\n    /**************************** Thumbs ****************************/\n    /**************************** 0-value ****************************/\n    /**************************** Disabled ****************************/ }\n    .mdl-slider.is-upgraded::-moz-focus-outer {\n      border: 0; }\n    .mdl-slider.is-upgraded::-ms-tooltip {\n      display: none; }\n    .mdl-slider.is-upgraded::-webkit-slider-runnable-track {\n      background: transparent; }\n    .mdl-slider.is-upgraded::-moz-range-track {\n      background: transparent;\n      border: none; }\n    .mdl-slider.is-upgraded::-ms-track {\n      background: none;\n      color: transparent;\n      height: 2px;\n      width: 100%;\n      border: none; }\n    .mdl-slider.is-upgraded::-ms-fill-lower {\n      padding: 0;\n      background: linear-gradient(to right, transparent, transparent 16px, rgb(63,81,181) 16px, rgb(63,81,181) 0); }\n    .mdl-slider.is-upgraded::-ms-fill-upper {\n      padding: 0;\n      background: linear-gradient(to left, transparent, transparent 16px, rgba(0,0,0, 0.26) 16px, rgba(0,0,0, 0.26) 0); }\n    .mdl-slider.is-upgraded::-webkit-slider-thumb {\n      -webkit-appearance: none;\n      width: 12px;\n      height: 12px;\n      box-sizing: border-box;\n      border-radius: 50%;\n      background: rgb(63,81,181);\n      border: none;\n      -webkit-transition: -webkit-transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), border 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s cubic-bezier(0.4, 0, 0.2, 1);\n              transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), border 0.18s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.18s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s cubic-bezier(0.4, 0, 0.2, 1); }\n    .mdl-slider.is-upgraded::-moz-range-thumb {\n      -moz-appearance: none;\n      width: 12px;\n      height: 12px;\n      box-sizing: border-box;\n      border-radius: 50%;\n      background-image: none;\n      background: rgb(63,81,181);\n      border: none; }\n    .mdl-slider.is-upgraded:focus:not(:active)::-webkit-slider-thumb {\n      box-shadow: 0 0 0 10px rgba(63,81,181, 0.26); }\n    .mdl-slider.is-upgraded:focus:not(:active)::-moz-range-thumb {\n      box-shadow: 0 0 0 10px rgba(63,81,181, 0.26); }\n    .mdl-slider.is-upgraded:active::-webkit-slider-thumb {\n      background-image: none;\n      background: rgb(63,81,181);\n      -webkit-transform: scale(1.5);\n              transform: scale(1.5); }\n    .mdl-slider.is-upgraded:active::-moz-range-thumb {\n      background-image: none;\n      background: rgb(63,81,181);\n      transform: scale(1.5); }\n    .mdl-slider.is-upgraded::-ms-thumb {\n      width: 32px;\n      height: 32px;\n      border: none;\n      border-radius: 50%;\n      background: rgb(63,81,181);\n      -ms-transform: scale(0.375);\n          transform: scale(0.375);\n      transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1), background 0.28s cubic-bezier(0.4, 0, 0.2, 1); }\n    .mdl-slider.is-upgraded:focus:not(:active)::-ms-thumb {\n      background: radial-gradient(circle closest-side, rgb(63,81,181) 0%, rgb(63,81,181) 37.5%, rgba(63,81,181, 0.26) 37.5%, rgba(63,81,181, 0.26) 100%);\n      -ms-transform: scale(1);\n          transform: scale(1); }\n    .mdl-slider.is-upgraded:active::-ms-thumb {\n      background: rgb(63,81,181);\n      -ms-transform: scale(0.5625);\n          transform: scale(0.5625); }\n    .mdl-slider.is-upgraded.is-lowest-value::-webkit-slider-thumb {\n      border: 2px solid rgba(0,0,0, 0.26);\n      background: transparent; }\n    .mdl-slider.is-upgraded.is-lowest-value::-moz-range-thumb {\n      border: 2px solid rgba(0,0,0, 0.26);\n      background: transparent; }\n    .mdl-slider.is-upgraded.is-lowest-value ~\n.mdl-slider__background-flex > .mdl-slider__background-upper {\n      left: 6px; }\n    .mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-webkit-slider-thumb {\n      box-shadow: 0 0 0 10px rgba(0,0,0, 0.12);\n      background: rgba(0,0,0, 0.12); }\n    .mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-moz-range-thumb {\n      box-shadow: 0 0 0 10px rgba(0,0,0, 0.12);\n      background: rgba(0,0,0, 0.12); }\n    .mdl-slider.is-upgraded.is-lowest-value:active::-webkit-slider-thumb {\n      border: 1.6px solid rgba(0,0,0, 0.26);\n      -webkit-transform: scale(1.5);\n              transform: scale(1.5); }\n    .mdl-slider.is-upgraded.is-lowest-value:active ~\n.mdl-slider__background-flex > .mdl-slider__background-upper {\n      left: 9px; }\n    .mdl-slider.is-upgraded.is-lowest-value:active::-moz-range-thumb {\n      border: 1.5px solid rgba(0,0,0, 0.26);\n      transform: scale(1.5); }\n    .mdl-slider.is-upgraded.is-lowest-value::-ms-thumb {\n      background: radial-gradient(circle closest-side, transparent 0%, transparent 66.67%, rgba(0,0,0, 0.26) 66.67%, rgba(0,0,0, 0.26) 100%); }\n    .mdl-slider.is-upgraded.is-lowest-value:focus:not(:active)::-ms-thumb {\n      background: radial-gradient(circle closest-side, rgba(0,0,0, 0.12) 0%, rgba(0,0,0, 0.12) 25%, rgba(0,0,0, 0.26) 25%, rgba(0,0,0, 0.26) 37.5%, rgba(0,0,0, 0.12) 37.5%, rgba(0,0,0, 0.12) 100%);\n      -ms-transform: scale(1);\n          transform: scale(1); }\n    .mdl-slider.is-upgraded.is-lowest-value:active::-ms-thumb {\n      -ms-transform: scale(0.5625);\n          transform: scale(0.5625);\n      background: radial-gradient(circle closest-side, transparent 0%, transparent 77.78%, rgba(0,0,0, 0.26) 77.78%, rgba(0,0,0, 0.26) 100%); }\n    .mdl-slider.is-upgraded.is-lowest-value::-ms-fill-lower {\n      background: transparent; }\n    .mdl-slider.is-upgraded.is-lowest-value::-ms-fill-upper {\n      margin-left: 6px; }\n    .mdl-slider.is-upgraded.is-lowest-value:active::-ms-fill-upper {\n      margin-left: 9px; }\n    .mdl-slider.is-upgraded:disabled:focus::-webkit-slider-thumb,\n    .mdl-slider.is-upgraded:disabled:active::-webkit-slider-thumb,\n    .mdl-slider.is-upgraded:disabled::-webkit-slider-thumb {\n      -webkit-transform: scale(0.667);\n              transform: scale(0.667);\n      background: rgba(0,0,0, 0.26); }\n    .mdl-slider.is-upgraded:disabled:focus::-moz-range-thumb,\n    .mdl-slider.is-upgraded:disabled:active::-moz-range-thumb,\n    .mdl-slider.is-upgraded:disabled::-moz-range-thumb {\n      transform: scale(0.667);\n      background: rgba(0,0,0, 0.26); }\n    .mdl-slider.is-upgraded:disabled ~\n.mdl-slider__background-flex > .mdl-slider__background-lower {\n      background-color: rgba(0,0,0, 0.26);\n      left: -6px; }\n    .mdl-slider.is-upgraded:disabled ~\n.mdl-slider__background-flex > .mdl-slider__background-upper {\n      left: 6px; }\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-webkit-slider-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:active::-webkit-slider-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled::-webkit-slider-thumb {\n      border: 3px solid rgba(0,0,0, 0.26);\n      background: transparent;\n      -webkit-transform: scale(0.667);\n              transform: scale(0.667); }\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-moz-range-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:active::-moz-range-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled::-moz-range-thumb {\n      border: 3px solid rgba(0,0,0, 0.26);\n      background: transparent;\n      transform: scale(0.667); }\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:active ~\n.mdl-slider__background-flex > .mdl-slider__background-upper {\n      left: 6px; }\n    .mdl-slider.is-upgraded:disabled:focus::-ms-thumb,\n    .mdl-slider.is-upgraded:disabled:active::-ms-thumb,\n    .mdl-slider.is-upgraded:disabled::-ms-thumb {\n      -ms-transform: scale(0.25);\n          transform: scale(0.25);\n      background: rgba(0,0,0, 0.26); }\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:focus::-ms-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:active::-ms-thumb,\n    .mdl-slider.is-upgraded.is-lowest-value:disabled::-ms-thumb {\n      -ms-transform: scale(0.25);\n          transform: scale(0.25);\n      background: radial-gradient(circle closest-side, transparent 0%, transparent 50%, rgba(0,0,0, 0.26) 50%, rgba(0,0,0, 0.26) 100%); }\n    .mdl-slider.is-upgraded:disabled::-ms-fill-lower {\n      margin-right: 6px;\n      background: linear-gradient(to right, transparent, transparent 25px, rgba(0,0,0, 0.26) 25px, rgba(0,0,0, 0.26) 0); }\n    .mdl-slider.is-upgraded:disabled::-ms-fill-upper {\n      margin-left: 6px; }\n    .mdl-slider.is-upgraded.is-lowest-value:disabled:active::-ms-fill-upper {\n      margin-left: 6px; }\n\n.mdl-slider__ie-container {\n  height: 18px;\n  overflow: visible;\n  border: none;\n  margin: none;\n  padding: none; }\n\n.mdl-slider__container {\n  height: 18px;\n  position: relative;\n  background: none;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row; }\n\n.mdl-slider__background-flex {\n  background: transparent;\n  position: absolute;\n  height: 2px;\n  width: calc(100% - 52px);\n  top: 50%;\n  left: 0;\n  margin: 0 26px;\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  overflow: hidden;\n  border: 0;\n  padding: 0;\n  -webkit-transform: translate(0, -1px);\n      -ms-transform: translate(0, -1px);\n          transform: translate(0, -1px); }\n\n.mdl-slider__background-lower {\n  background: rgb(63,81,181);\n  -webkit-box-flex: 0;\n  -webkit-flex: 0;\n      -ms-flex: 0;\n          flex: 0;\n  position: relative;\n  border: 0;\n  padding: 0; }\n\n.mdl-slider__background-upper {\n  background: rgba(0,0,0, 0.26);\n  -webkit-box-flex: 0;\n  -webkit-flex: 0;\n      -ms-flex: 0;\n          flex: 0;\n  position: relative;\n  border: 0;\n  padding: 0;\n  -webkit-transition: left 0.18s cubic-bezier(0.4, 0, 0.2, 1);\n          transition: left 0.18s cubic-bezier(0.4, 0, 0.2, 1); }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-spinner {\n  display: inline-block;\n  position: relative;\n  width: 28px;\n  height: 28px; }\n  .mdl-spinner:not(.is-upgraded).is-active:after {\n    content: \"Loading...\"; }\n  .mdl-spinner.is-upgraded.is-active {\n    -webkit-animation: mdl-spinner__container-rotate 1568.23529412ms linear infinite;\n            animation: mdl-spinner__container-rotate 1568.23529412ms linear infinite; }\n\n@-webkit-keyframes mdl-spinner__container-rotate {\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes mdl-spinner__container-rotate {\n  to {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n.mdl-spinner__layer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0; }\n\n.mdl-spinner__layer-1 {\n  border-color: rgb(66,165,245); }\n  .mdl-spinner--single-color .mdl-spinner__layer-1 {\n    border-color: rgb(63,81,181); }\n  .mdl-spinner.is-active .mdl-spinner__layer-1 {\n    -webkit-animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-1-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n            animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-1-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.mdl-spinner__layer-2 {\n  border-color: rgb(244,67,54); }\n  .mdl-spinner--single-color .mdl-spinner__layer-2 {\n    border-color: rgb(63,81,181); }\n  .mdl-spinner.is-active .mdl-spinner__layer-2 {\n    -webkit-animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-2-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n            animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-2-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.mdl-spinner__layer-3 {\n  border-color: rgb(253,216,53); }\n  .mdl-spinner--single-color .mdl-spinner__layer-3 {\n    border-color: rgb(63,81,181); }\n  .mdl-spinner.is-active .mdl-spinner__layer-3 {\n    -webkit-animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-3-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n            animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-3-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.mdl-spinner__layer-4 {\n  border-color: rgb(76,175,80); }\n  .mdl-spinner--single-color .mdl-spinner__layer-4 {\n    border-color: rgb(63,81,181); }\n  .mdl-spinner.is-active .mdl-spinner__layer-4 {\n    -webkit-animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-4-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n            animation: mdl-spinner__fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, mdl-spinner__layer-4-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes mdl-spinner__fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg);\n            transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg);\n            transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg);\n            transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg);\n            transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg);\n            transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg);\n            transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg);\n            transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg);\n            transform: rotate(1080deg); } }\n\n@keyframes mdl-spinner__fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg);\n            transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg);\n            transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg);\n            transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg);\n            transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg);\n            transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg);\n            transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg);\n            transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg);\n            transform: rotate(1080deg); } }\n\n/**\n* HACK: Even though the intention is to have the current .mdl-spinner__layer-N\n* at `opacity: 1`, we set it to `opacity: 0.99` instead since this forces Chrome\n* to do proper subpixel rendering for the elements being animated. This is\n* especially visible in Chrome 39 on Ubuntu 14.04. See:\n*\n* - https://github.com/Polymer/paper-spinner/issues/9\n* - https://code.google.com/p/chromium/issues/detail?id=436255\n*/\n@-webkit-keyframes mdl-spinner__layer-1-fade-in-out {\n  from {\n    opacity: 0.99; }\n  25% {\n    opacity: 0.99; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 0.99; }\n  100% {\n    opacity: 0.99; } }\n@keyframes mdl-spinner__layer-1-fade-in-out {\n  from {\n    opacity: 0.99; }\n  25% {\n    opacity: 0.99; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 0.99; }\n  100% {\n    opacity: 0.99; } }\n\n@-webkit-keyframes mdl-spinner__layer-2-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 0.99; }\n  50% {\n    opacity: 0.99; }\n  51% {\n    opacity: 0; } }\n\n@keyframes mdl-spinner__layer-2-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 0.99; }\n  50% {\n    opacity: 0.99; }\n  51% {\n    opacity: 0; } }\n\n@-webkit-keyframes mdl-spinner__layer-3-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 0.99; }\n  75% {\n    opacity: 0.99; }\n  76% {\n    opacity: 0; } }\n\n@keyframes mdl-spinner__layer-3-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 0.99; }\n  75% {\n    opacity: 0.99; }\n  76% {\n    opacity: 0; } }\n\n@-webkit-keyframes mdl-spinner__layer-4-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 0.99; }\n  90% {\n    opacity: 0.99; }\n  100% {\n    opacity: 0; } }\n\n@keyframes mdl-spinner__layer-4-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 0.99; }\n  90% {\n    opacity: 0.99; }\n  100% {\n    opacity: 0; } }\n\n/**\n* Patch the gap that appear between the two adjacent\n* div.mdl-spinner__circle-clipper while the spinner is rotating\n* (appears on Chrome 38, Safari 7.1, and IE 11).\n*\n* Update: the gap no longer appears on Chrome when .mdl-spinner__layer-N's\n* opacity is 0.99, but still does on Safari and IE.\n*/\n.mdl-spinner__gap-patch {\n  position: absolute;\n  box-sizing: border-box;\n  top: 0;\n  left: 45%;\n  width: 10%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n  .mdl-spinner__gap-patch .mdl-spinner__circle {\n    width: 1000%;\n    left: -450%; }\n\n.mdl-spinner__circle-clipper {\n  display: inline-block;\n  position: relative;\n  width: 50%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n  .mdl-spinner__circle-clipper .mdl-spinner__circle {\n    width: 200%; }\n\n.mdl-spinner__circle {\n  box-sizing: border-box;\n  height: 100%;\n  border-width: 3px;\n  border-style: solid;\n  border-color: inherit;\n  border-bottom-color: transparent !important;\n  border-radius: 50%;\n  -webkit-animation: none;\n          animation: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0; }\n  .mdl-spinner__left .mdl-spinner__circle {\n    border-right-color: transparent !important;\n    -webkit-transform: rotate(129deg);\n        -ms-transform: rotate(129deg);\n            transform: rotate(129deg); }\n    .mdl-spinner.is-active .mdl-spinner__left .mdl-spinner__circle {\n      -webkit-animation: mdl-spinner__left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n              animation: mdl-spinner__left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n  .mdl-spinner__right .mdl-spinner__circle {\n    left: -100%;\n    border-left-color: transparent !important;\n    -webkit-transform: rotate(-129deg);\n        -ms-transform: rotate(-129deg);\n            transform: rotate(-129deg); }\n    .mdl-spinner.is-active .mdl-spinner__right .mdl-spinner__circle {\n      -webkit-animation: mdl-spinner__right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n              animation: mdl-spinner__right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes mdl-spinner__left-spin {\n  from {\n    -webkit-transform: rotate(130deg);\n            transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg);\n            transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg);\n            transform: rotate(130deg); } }\n\n@keyframes mdl-spinner__left-spin {\n  from {\n    -webkit-transform: rotate(130deg);\n            transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg);\n            transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg);\n            transform: rotate(130deg); } }\n\n@-webkit-keyframes mdl-spinner__right-spin {\n  from {\n    -webkit-transform: rotate(-130deg);\n            transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg);\n            transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg);\n            transform: rotate(-130deg); } }\n\n@keyframes mdl-spinner__right-spin {\n  from {\n    -webkit-transform: rotate(-130deg);\n            transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg);\n            transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg);\n            transform: rotate(-130deg); } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-switch {\n  position: relative;\n  z-index: 1;\n  vertical-align: middle;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 100%;\n  height: 24px;\n  margin: 0;\n  padding: 0;\n  overflow: visible;\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n  .mdl-switch.is-upgraded {\n    padding-left: 28px; }\n\n.mdl-switch__input {\n  line-height: 24px; }\n  .mdl-switch.is-upgraded .mdl-switch__input {\n    position: absolute;\n    width: 0;\n    height: 0;\n    margin: 0;\n    padding: 0;\n    opacity: 0;\n    -ms-appearance: none;\n    -moz-appearance: none;\n    -webkit-appearance: none;\n    appearance: none;\n    border: none; }\n\n.mdl-switch__track {\n  background: rgba(0,0,0, 0.26);\n  position: absolute;\n  left: 0;\n  top: 5px;\n  height: 14px;\n  width: 36px;\n  border-radius: 14px;\n  cursor: pointer; }\n  .mdl-switch.is-checked .mdl-switch__track {\n    background: rgba(63,81,181, 0.5); }\n  .mdl-switch.is-disabled .mdl-switch__track {\n    background: rgba(0,0,0, 0.12);\n    cursor: auto; }\n\n.mdl-switch__thumb {\n  background: rgb(250,250,250);\n  position: absolute;\n  left: 0;\n  top: 2px;\n  height: 20px;\n  width: 20px;\n  border-radius: 50%;\n  cursor: pointer;\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);\n  -webkit-transition-duration: 0.28s;\n          transition-duration: 0.28s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-transition-property: left;\n          transition-property: left; }\n  .mdl-switch.is-checked .mdl-switch__thumb {\n    background: rgb(63,81,181);\n    left: 16px;\n    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.12); }\n  .mdl-switch.is-disabled .mdl-switch__thumb {\n    background: rgb(189,189,189);\n    cursor: auto; }\n\n.mdl-switch__focus-helper {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-4px, -4px);\n      -ms-transform: translate(-4px, -4px);\n          transform: translate(-4px, -4px);\n  display: inline-block;\n  box-sizing: border-box;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background-color: transparent; }\n  .mdl-switch.is-focused .mdl-switch__focus-helper {\n    box-shadow: 0 0 0px 20px rgba(0, 0, 0, 0.1);\n    background-color: rgba(0, 0, 0, 0.1); }\n  .mdl-switch.is-focused.is-checked .mdl-switch__focus-helper {\n    box-shadow: 0 0 0px 20px rgba(63,81,181, 0.26);\n    background-color: rgba(63,81,181, 0.26); }\n\n.mdl-switch__label {\n  position: relative;\n  cursor: pointer;\n  font-size: 16px;\n  line-height: 24px;\n  margin: 0;\n  left: 24px; }\n  .mdl-switch.is-disabled .mdl-switch__label {\n    color: rgb(189,189,189);\n    cursor: auto; }\n\n.mdl-switch__ripple-container {\n  position: absolute;\n  z-index: 2;\n  top: -12px;\n  left: -14px;\n  box-sizing: border-box;\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  cursor: pointer;\n  overflow: hidden;\n  -webkit-mask-image: -webkit-radial-gradient(circle, white, black);\n  -webkit-transition-duration: 0.40s;\n          transition-duration: 0.40s;\n  -webkit-transition-timing-function: step-end;\n          transition-timing-function: step-end;\n  -webkit-transition-property: left;\n          transition-property: left; }\n  .mdl-switch__ripple-container .mdl-ripple {\n    background: rgb(63,81,181); }\n  .mdl-switch.is-disabled .mdl-switch__ripple-container {\n    cursor: auto; }\n  .mdl-switch.is-disabled .mdl-switch__ripple-container .mdl-ripple {\n    background: transparent; }\n  .mdl-switch.is-checked .mdl-switch__ripple-container {\n    cursor: auto;\n    left: 2px; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-tabs {\n  display: block;\n  width: 100%; }\n\n.mdl-tabs__tab-bar {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n  -webkit-flex-direction: row;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: center;\n  -webkit-justify-content: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-align-content: space-between;\n      -ms-flex-line-pack: justify;\n          align-content: space-between;\n  -webkit-box-align: start;\n  -webkit-align-items: flex-start;\n      -ms-flex-align: start;\n          align-items: flex-start;\n  height: 48px;\n  padding: 0 0 0 0;\n  margin: 0;\n  border-bottom: 1px solid rgb(224,224,224); }\n\n.mdl-tabs__tab {\n  margin: 0;\n  border: none;\n  padding: 0 24px 0 24px;\n  float: left;\n  position: relative;\n  display: block;\n  color: red;\n  text-decoration: none;\n  height: 48px;\n  line-height: 48px;\n  text-align: center;\n  font-weight: 500;\n  font-size: 14px;\n  text-transform: uppercase;\n  color: rgba(0,0,0, 0.54);\n  overflow: hidden; }\n  .mdl-tabs.is-upgraded .mdl-tabs__tab.is-active {\n    color: rgba(0,0,0, 0.87); }\n  .mdl-tabs.is-upgraded .mdl-tabs__tab.is-active:after {\n    height: 2px;\n    width: 100%;\n    display: block;\n    content: \" \";\n    bottom: 0px;\n    left: 0px;\n    position: absolute;\n    background: rgb(63,81,181);\n    -webkit-animation: border-expand 0.2s cubic-bezier(0.4, 0, 0.4, 1) 0.01s alternate forwards;\n            animation: border-expand 0.2s cubic-bezier(0.4, 0, 0.4, 1) 0.01s alternate forwards;\n    -webkit-transition: all 1s cubic-bezier(0.4, 0, 1, 1);\n            transition: all 1s cubic-bezier(0.4, 0, 1, 1); }\n  .mdl-tabs__tab .mdl-tabs__ripple-container {\n    display: block;\n    position: absolute;\n    height: 100%;\n    width: 100%;\n    left: 0px;\n    top: 0px;\n    z-index: 1;\n    overflow: hidden; }\n    .mdl-tabs__tab .mdl-tabs__ripple-container .mdl-ripple {\n      background: rgb(63,81,181); }\n\n.mdl-tabs__panel {\n  display: block; }\n  .mdl-tabs.is-upgraded .mdl-tabs__panel {\n    display: none; }\n  .mdl-tabs.is-upgraded .mdl-tabs__panel.is-active {\n    display: block; }\n\n@-webkit-keyframes border-expand {\n  0% {\n    opacity: 0;\n    width: 0; }\n  100% {\n    opacity: 1;\n    width: 100%; } }\n\n@keyframes border-expand {\n  0% {\n    opacity: 0;\n    width: 0; }\n  100% {\n    opacity: 1;\n    width: 100%; } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-textfield {\n  position: relative;\n  font-size: 16px;\n  display: inline-block;\n  box-sizing: border-box;\n  width: 300px;\n  max-width: 100%;\n  margin: 0;\n  padding: 20px 0; }\n  .mdl-textfield .mdl-button {\n    position: absolute;\n    bottom: 20px; }\n\n.mdl-textfield--align-right {\n  text-align: right; }\n\n.mdl-textfield--full-width {\n  width: 100%; }\n\n.mdl-textfield--expandable {\n  min-width: 32px;\n  width: auto;\n  min-height: 32px; }\n\n.mdl-textfield__input {\n  border: none;\n  border-bottom: 1px solid rgba(0,0,0, 0.12);\n  display: inline-block;\n  font-size: 16px;\n  margin: 0;\n  padding: 4px 0;\n  width: 100%;\n  background: 16px;\n  text-align: left;\n  color: inherit; }\n  .mdl-textfield.is-focused .mdl-textfield__input {\n    outline: none; }\n  .mdl-textfield.is-invalid .mdl-textfield__input {\n    border-color: rgb(222, 50, 38);\n    box-shadow: none; }\n  .mdl-textfield.is-disabled .mdl-textfield__input {\n    background-color: transparent;\n    border-bottom: 1px dotted rgba(0,0,0, 0.12); }\n\n.mdl-textfield__label {\n  bottom: 0;\n  color: rgba(0,0,0, 0.26);\n  font-size: 16px;\n  left: 0;\n  right: 0;\n  pointer-events: none;\n  position: absolute;\n  top: 24px;\n  width: 100%;\n  overflow: hidden;\n  white-space: nowrap;\n  text-align: left; }\n  .mdl-textfield.is-dirty .mdl-textfield__label {\n    visibility: hidden; }\n  .mdl-textfield--floating-label .mdl-textfield__label {\n    -webkit-transition-duration: 0.2s;\n            transition-duration: 0.2s;\n    -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }\n  .mdl-textfield--floating-label.is-focused .mdl-textfield__label,\n  .mdl-textfield--floating-label.is-dirty .mdl-textfield__label {\n    color: rgb(63,81,181);\n    font-size: 12px;\n    top: 4px;\n    visibility: visible; }\n  .mdl-textfield--floating-label.is-focused .mdl-textfield__expandable-holder .mdl-textfield__label,\n  .mdl-textfield--floating-label.is-dirty .mdl-textfield__expandable-holder .mdl-textfield__label {\n    top: -16px; }\n  .mdl-textfield--floating-label.is-invalid .mdl-textfield__label {\n    color: rgb(222, 50, 38);\n    font-size: 12px; }\n  .mdl-textfield__label:after {\n    background-color: rgb(63,81,181);\n    bottom: 20px;\n    content: '';\n    height: 2px;\n    left: 45%;\n    position: absolute;\n    -webkit-transition-duration: 0.2s;\n            transition-duration: 0.2s;\n    -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    visibility: hidden;\n    width: 10px; }\n  .mdl-textfield.is-focused .mdl-textfield__label:after {\n    left: 0;\n    visibility: visible;\n    width: 100%; }\n  .mdl-textfield.is-invalid .mdl-textfield__label:after {\n    background-color: rgb(222, 50, 38); }\n\n.mdl-textfield__error {\n  color: rgb(222, 50, 38);\n  position: absolute;\n  font-size: 12px;\n  margin-top: 3px;\n  visibility: hidden; }\n  .mdl-textfield.is-invalid .mdl-textfield__error {\n    visibility: visible; }\n\n.mdl-textfield__expandable-holder {\n  display: inline-block;\n  position: relative;\n  margin-left: 32px;\n  -webkit-transition-duration: 0.2s;\n          transition-duration: 0.2s;\n  -webkit-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  display: inline-block;\n  max-width: 0.1px; }\n  .mdl-textfield.is-focused .mdl-textfield__expandable-holder, .mdl-textfield.is-dirty .mdl-textfield__expandable-holder {\n    max-width: 600px; }\n  .mdl-textfield__expandable-holder .mdl-textfield__label:after {\n    bottom: 0; }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-tooltip {\n  -webkit-transform: scale(0);\n      -ms-transform: scale(0);\n          transform: scale(0);\n  -webkit-transform-origin: top center;\n      -ms-transform-origin: top center;\n          transform-origin: top center;\n  will-change: transform;\n  z-index: 999;\n  background: rgba(97,97,97, 0.9);\n  border-radius: 2px;\n  color: rgb(255,255,255);\n  display: inline-block;\n  font-size: 10px;\n  font-weight: 500;\n  line-height: 14px;\n  max-width: 170px;\n  position: fixed;\n  top: -500px;\n  left: -500px;\n  padding: 8px;\n  text-align: center; }\n\n.mdl-tooltip.is-active {\n  -webkit-animation: pulse 200ms cubic-bezier(0, 0, 0.2, 1) forwards;\n          animation: pulse 200ms cubic-bezier(0, 0, 0.2, 1) forwards; }\n\n.mdl-tooltip--large {\n  line-height: 14px;\n  font-size: 14px;\n  padding: 16px; }\n\n@-webkit-keyframes pulse {\n  0% {\n    -webkit-transform: scale(0);\n            transform: scale(0);\n    opacity: 0; }\n  50% {\n    -webkit-transform: scale(0.99);\n            transform: scale(0.99); }\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n    opacity: 1;\n    visibility: visible; } }\n\n@keyframes pulse {\n  0% {\n    -webkit-transform: scale(0);\n            transform: scale(0);\n    opacity: 0; }\n  50% {\n    -webkit-transform: scale(0.99);\n            transform: scale(0.99); }\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n    opacity: 1;\n    visibility: visible; } }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* Typography */\n/* Shadows */\n/* Animations */\n.mdl-shadow--2dp {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12); }\n\n.mdl-shadow--3dp {\n  box-shadow: 0 3px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 3px -2px rgba(0, 0, 0, 0.2), 0 1px 8px 0 rgba(0, 0, 0, 0.12); }\n\n.mdl-shadow--4dp {\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2); }\n\n.mdl-shadow--6dp {\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2); }\n\n.mdl-shadow--8dp {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2); }\n\n.mdl-shadow--16dp {\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2); }\n\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/*------------------------------------*    $CONTENTS\n\\*------------------------------------*/\n/**\n * STYLE GUIDE VARIABLES------------------Declarations of Sass variables\n * -----Typography\n * -----Colors\n * -----Textfield\n * -----Switch\n * -----Spinner\n * -----Radio\n * -----Menu\n * -----List\n * -----Layout\n * -----Icon toggles\n * -----Footer\n * -----Column\n * -----Checkbox\n * -----Card\n * -----Button\n * -----Animation\n * -----Progress\n * -----Badge\n * -----Shadows\n * -----Grid\n * -----Data table\n */\n/* ==========  TYPOGRAPHY  ========== */\n/* We're splitting fonts into \"preferred\" and \"performance\" in order to optimize\n   page loading. For important text, such as the body, we want it to load\n   immediately and not wait for the web font load, whereas for other sections,\n   such as headers and titles, we're OK with things taking a bit longer to load.\n   We do have some optional classes and parameters in the mixins, in case you\n   definitely want to make sure you're using the preferred font and don't mind\n   the performance hit.\n   We should be able to improve on this once CSS Font Loading L3 becomes more\n   widely available.\n*/\n/* ==========  COLORS  ========== */\n/**\n*\n* Material design color palettes.\n* @see http://www.google.com/design/spec/style/color.html\n*\n**/\n/**\n * Copyright 2015 Google Inc. All Rights Reserved.\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n *      http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n */\n/* ==========  Color Palettes  ========== */\n/* colors.scss */\n/* ==========  Color & Themes  ========== */\n/* ==========  Typography  ========== */\n/* ==========  Components  ========== */\n/* ==========  Standard Buttons  ========== */\n/* ==========  Icon Toggles  ========== */\n/* ==========  Radio Buttons  ========== */\n/* ==========  Ripple effect  ========== */\n/* ==========  Layout  ========== */\n/* ==========  Content Tabs  ========== */\n/* ==========  Checkboxes  ========== */\n/* ==========  Switches  ========== */\n/* ==========  Spinner  ========== */\n/* ==========  Text fields  ========== */\n/* ==========  Card  ========== */\n/* ==========  Sliders ========== */\n/* ========== Progress ========== */\n/* ==========  List ========== */\n/* ==========  Item ========== */\n/* ==========  Dropdown menu ========== */\n/* ==========  Tooltips  ========== */\n/* ==========  Footer  ========== */\n/* TEXTFIELD */\n/* SWITCH */\n/* SPINNER */\n/* RADIO */\n/* MENU */\n/* LIST */\n/* ICONS */\n/* ICON TOGGLE */\n/* FOOTER */\n/*mega-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/*mini-footer*/\n/**************\n *\n * Sizes\n *\n *************/\n/* COLUMN LAYOUT */\n/* CHECKBOX */\n/* CARD */\n/* Card dimensions */\n/* Cover image */\n/* BUTTON */\n/**\n *\n * Dimensions\n *\n */\n/* ANIMATION */\n/* PROGRESS */\n/* BADGE */\n/* SHADOWS */\n/* GRID */\n/* DATA TABLE */\n.mdl-grid {\n  display: -webkit-box;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-flow: row wrap;\n      -ms-flex-flow: row wrap;\n          flex-flow: row wrap;\n  margin: 0 auto 0 auto;\n  -webkit-box-align: stretch;\n  -webkit-align-items: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch; }\n  .mdl-grid.mdl-grid--no-spacing {\n    padding: 0; }\n\n.mdl-cell {\n  box-sizing: border-box; }\n\n.mdl-cell--top {\n  -webkit-align-self: flex-start;\n      -ms-flex-item-align: start;\n          align-self: flex-start; }\n\n.mdl-cell--middle {\n  -webkit-align-self: center;\n      -ms-flex-item-align: center;\n          align-self: center; }\n\n.mdl-cell--bottom {\n  -webkit-align-self: flex-end;\n      -ms-flex-item-align: end;\n          align-self: flex-end; }\n\n.mdl-cell--stretch {\n  -webkit-align-self: stretch;\n      -ms-flex-item-align: stretch;\n          align-self: stretch; }\n\n.mdl-grid.mdl-grid--no-spacing > .mdl-cell {\n  margin: 0; }\n\n@media (max-width: 479px) {\n  .mdl-grid {\n    padding: 8px; }\n  .mdl-cell {\n    margin: 8px;\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell {\n      width: 100%; }\n  .mdl-cell--hide-phone {\n    display: none !important; }\n  .mdl-cell--1-col {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col {\n      width: 25%; }\n  .mdl-cell--1-col-phone.mdl-cell--1-col-phone {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col-phone.mdl-cell--1-col-phone {\n      width: 25%; }\n  .mdl-cell--2-col {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col {\n      width: 50%; }\n  .mdl-cell--2-col-phone.mdl-cell--2-col-phone {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col-phone.mdl-cell--2-col-phone {\n      width: 50%; }\n  .mdl-cell--3-col {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col {\n      width: 75%; }\n  .mdl-cell--3-col-phone.mdl-cell--3-col-phone {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col-phone.mdl-cell--3-col-phone {\n      width: 75%; }\n  .mdl-cell--4-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col {\n      width: 100%; }\n  .mdl-cell--4-col-phone.mdl-cell--4-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col-phone.mdl-cell--4-col-phone {\n      width: 100%; }\n  .mdl-cell--5-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col {\n      width: 100%; }\n  .mdl-cell--5-col-phone.mdl-cell--5-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col-phone.mdl-cell--5-col-phone {\n      width: 100%; }\n  .mdl-cell--6-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col {\n      width: 100%; }\n  .mdl-cell--6-col-phone.mdl-cell--6-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col-phone.mdl-cell--6-col-phone {\n      width: 100%; }\n  .mdl-cell--7-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col {\n      width: 100%; }\n  .mdl-cell--7-col-phone.mdl-cell--7-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col-phone.mdl-cell--7-col-phone {\n      width: 100%; }\n  .mdl-cell--8-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col {\n      width: 100%; }\n  .mdl-cell--8-col-phone.mdl-cell--8-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col-phone.mdl-cell--8-col-phone {\n      width: 100%; }\n  .mdl-cell--9-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col {\n      width: 100%; }\n  .mdl-cell--9-col-phone.mdl-cell--9-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col-phone.mdl-cell--9-col-phone {\n      width: 100%; }\n  .mdl-cell--10-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col {\n      width: 100%; }\n  .mdl-cell--10-col-phone.mdl-cell--10-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col-phone.mdl-cell--10-col-phone {\n      width: 100%; }\n  .mdl-cell--11-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col {\n      width: 100%; }\n  .mdl-cell--11-col-phone.mdl-cell--11-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col-phone.mdl-cell--11-col-phone {\n      width: 100%; }\n  .mdl-cell--12-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col {\n      width: 100%; }\n  .mdl-cell--12-col-phone.mdl-cell--12-col-phone {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col-phone.mdl-cell--12-col-phone {\n      width: 100%; } }\n\n@media (min-width: 480px) and (max-width: 839px) {\n  .mdl-grid {\n    padding: 8px; }\n  .mdl-cell {\n    margin: 8px;\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell {\n      width: 50%; }\n  .mdl-cell--hide-tablet {\n    display: none !important; }\n  .mdl-cell--1-col {\n    width: calc(12.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col {\n      width: 12.5%; }\n  .mdl-cell--1-col-tablet.mdl-cell--1-col-tablet {\n    width: calc(12.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col-tablet.mdl-cell--1-col-tablet {\n      width: 12.5%; }\n  .mdl-cell--2-col {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col {\n      width: 25%; }\n  .mdl-cell--2-col-tablet.mdl-cell--2-col-tablet {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col-tablet.mdl-cell--2-col-tablet {\n      width: 25%; }\n  .mdl-cell--3-col {\n    width: calc(37.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col {\n      width: 37.5%; }\n  .mdl-cell--3-col-tablet.mdl-cell--3-col-tablet {\n    width: calc(37.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col-tablet.mdl-cell--3-col-tablet {\n      width: 37.5%; }\n  .mdl-cell--4-col {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col {\n      width: 50%; }\n  .mdl-cell--4-col-tablet.mdl-cell--4-col-tablet {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col-tablet.mdl-cell--4-col-tablet {\n      width: 50%; }\n  .mdl-cell--5-col {\n    width: calc(62.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col {\n      width: 62.5%; }\n  .mdl-cell--5-col-tablet.mdl-cell--5-col-tablet {\n    width: calc(62.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col-tablet.mdl-cell--5-col-tablet {\n      width: 62.5%; }\n  .mdl-cell--6-col {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col {\n      width: 75%; }\n  .mdl-cell--6-col-tablet.mdl-cell--6-col-tablet {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col-tablet.mdl-cell--6-col-tablet {\n      width: 75%; }\n  .mdl-cell--7-col {\n    width: calc(87.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col {\n      width: 87.5%; }\n  .mdl-cell--7-col-tablet.mdl-cell--7-col-tablet {\n    width: calc(87.5% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col-tablet.mdl-cell--7-col-tablet {\n      width: 87.5%; }\n  .mdl-cell--8-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col {\n      width: 100%; }\n  .mdl-cell--8-col-tablet.mdl-cell--8-col-tablet {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col-tablet.mdl-cell--8-col-tablet {\n      width: 100%; }\n  .mdl-cell--9-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col {\n      width: 100%; }\n  .mdl-cell--9-col-tablet.mdl-cell--9-col-tablet {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col-tablet.mdl-cell--9-col-tablet {\n      width: 100%; }\n  .mdl-cell--10-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col {\n      width: 100%; }\n  .mdl-cell--10-col-tablet.mdl-cell--10-col-tablet {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col-tablet.mdl-cell--10-col-tablet {\n      width: 100%; }\n  .mdl-cell--11-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col {\n      width: 100%; }\n  .mdl-cell--11-col-tablet.mdl-cell--11-col-tablet {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col-tablet.mdl-cell--11-col-tablet {\n      width: 100%; }\n  .mdl-cell--12-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col {\n      width: 100%; }\n  .mdl-cell--12-col-tablet.mdl-cell--12-col-tablet {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col-tablet.mdl-cell--12-col-tablet {\n      width: 100%; } }\n\n@media (min-width: 840px) {\n  .mdl-grid {\n    padding: 8px; }\n  .mdl-cell {\n    margin: 8px;\n    width: calc(33.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell {\n      width: 33.3333333333%; }\n  .mdl-cell--hide-desktop {\n    display: none !important; }\n  .mdl-cell--1-col {\n    width: calc(8.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col {\n      width: 8.3333333333%; }\n  .mdl-cell--1-col-desktop.mdl-cell--1-col-desktop {\n    width: calc(8.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--1-col-desktop.mdl-cell--1-col-desktop {\n      width: 8.3333333333%; }\n  .mdl-cell--2-col {\n    width: calc(16.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col {\n      width: 16.6666666667%; }\n  .mdl-cell--2-col-desktop.mdl-cell--2-col-desktop {\n    width: calc(16.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--2-col-desktop.mdl-cell--2-col-desktop {\n      width: 16.6666666667%; }\n  .mdl-cell--3-col {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col {\n      width: 25%; }\n  .mdl-cell--3-col-desktop.mdl-cell--3-col-desktop {\n    width: calc(25% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--3-col-desktop.mdl-cell--3-col-desktop {\n      width: 25%; }\n  .mdl-cell--4-col {\n    width: calc(33.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col {\n      width: 33.3333333333%; }\n  .mdl-cell--4-col-desktop.mdl-cell--4-col-desktop {\n    width: calc(33.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--4-col-desktop.mdl-cell--4-col-desktop {\n      width: 33.3333333333%; }\n  .mdl-cell--5-col {\n    width: calc(41.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col {\n      width: 41.6666666667%; }\n  .mdl-cell--5-col-desktop.mdl-cell--5-col-desktop {\n    width: calc(41.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--5-col-desktop.mdl-cell--5-col-desktop {\n      width: 41.6666666667%; }\n  .mdl-cell--6-col {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col {\n      width: 50%; }\n  .mdl-cell--6-col-desktop.mdl-cell--6-col-desktop {\n    width: calc(50% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--6-col-desktop.mdl-cell--6-col-desktop {\n      width: 50%; }\n  .mdl-cell--7-col {\n    width: calc(58.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col {\n      width: 58.3333333333%; }\n  .mdl-cell--7-col-desktop.mdl-cell--7-col-desktop {\n    width: calc(58.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--7-col-desktop.mdl-cell--7-col-desktop {\n      width: 58.3333333333%; }\n  .mdl-cell--8-col {\n    width: calc(66.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col {\n      width: 66.6666666667%; }\n  .mdl-cell--8-col-desktop.mdl-cell--8-col-desktop {\n    width: calc(66.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--8-col-desktop.mdl-cell--8-col-desktop {\n      width: 66.6666666667%; }\n  .mdl-cell--9-col {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col {\n      width: 75%; }\n  .mdl-cell--9-col-desktop.mdl-cell--9-col-desktop {\n    width: calc(75% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--9-col-desktop.mdl-cell--9-col-desktop {\n      width: 75%; }\n  .mdl-cell--10-col {\n    width: calc(83.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col {\n      width: 83.3333333333%; }\n  .mdl-cell--10-col-desktop.mdl-cell--10-col-desktop {\n    width: calc(83.3333333333% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--10-col-desktop.mdl-cell--10-col-desktop {\n      width: 83.3333333333%; }\n  .mdl-cell--11-col {\n    width: calc(91.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col {\n      width: 91.6666666667%; }\n  .mdl-cell--11-col-desktop.mdl-cell--11-col-desktop {\n    width: calc(91.6666666667% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--11-col-desktop.mdl-cell--11-col-desktop {\n      width: 91.6666666667%; }\n  .mdl-cell--12-col {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col {\n      width: 100%; }\n  .mdl-cell--12-col-desktop.mdl-cell--12-col-desktop {\n    width: calc(100% - 16px); }\n    .mdl-grid--no-spacing > .mdl-cell--12-col-desktop.mdl-cell--12-col-desktop {\n      width: 100%; } }\n\nbody {\n  margin: 0px; }\n\n.styleguide-demo h1 {\n  margin: 48px 24px 0 24px; }\n\n.styleguide-demo h1:after {\n  content: '';\n  display: block;\n  width: 100%;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.5);\n  margin-top: 24px; }\n\n.styleguide-demo {\n  opacity: 0;\n  -webkit-transition: opacity 0.6s ease;\n          transition: opacity 0.6s ease; }\n\n.styleguide-masthead {\n  height: 256px;\n  background: rgb(33,33,33);\n  padding: 115px 16px 0; }\n\n.styleguide-container {\n  position: relative;\n  max-width: 960px;\n  width: 100%; }\n\n.styleguide-title {\n  color: #fff;\n  bottom: auto;\n  position: relative;\n  font-size: 56px;\n  font-weight: 300;\n  line-height: 1;\n  letter-spacing: -0.02em; }\n  .styleguide-title:after {\n    border-bottom: 0px; }\n  .styleguide-title span {\n    font-weight: 300; }\n\n.mdl-styleguide .mdl-layout__drawer .mdl-navigation__link {\n  padding: 10px 24px; }\n\n.demosLoaded .styleguide-demo {\n  opacity: 1; }\n\niframe {\n  display: block;\n  width: 100%;\n  border: none; }\n\niframe.heightSet {\n  overflow: hidden; }\n\n.demo-wrapper {\n  margin: 24px; }\n  .demo-wrapper iframe {\n    border: 1px solid rgba(0, 0, 0, 0.5); }\n", ""]);

	// exports


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(18);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(18, function() {
				var newContent = __webpack_require__(18);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);

	// module
	exports.push([module.id, "html body {\n  margin: 0;\n  padding: 0;\n  width: 100%;\n  height: 100%;\n  font-family: Roboto;\n}\n", ""]);

	// exports


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	__webpack_require__(20);

	var messageStore = __webpack_require__(12);
	var prettyDates = __webpack_require__(22);

	riot.tag('chat-list', '<a each="{chats}" href="#" onclick="{updateOpenChatID}" class="{mdl-navigation__link: true, active: active.call(this)}"> <div class="chat-user-list-item"> <div class="chat-user-list-image" riot-style="{this.getProfilePictureStyle(user.profilePicture)}"></div> <div class="chat-user-list-name">{user.name}</div> <div class="chat-user-list-timestamp">{prettyDates(lastMessage.timestamp)}</div> <div class="chat-user-list-message">{lastMessage.contents}</div> </div> </a>', 'chat-list a.active, [riot-tag="chat-list"] a.active{ background-color: #757575; color: rgb(250,250,250) !important; } chat-list a:hover, [riot-tag="chat-list"] a:hover{ background-color: rgb(224,224,224); color: #757575 !important; }', function (opts) {
	    this.on('update', function () {
	        var _this = this;

	        this.openChatID = messageStore.getOpenChatID();
	        this.chats = [];
	        var allChats = messageStore.getAllChats();
	        allChats.forEach(function (chat) {
	            var messagesLength = chat.messages.length;
	            _this.chats.push({
	                id: chat.id,
	                lastMessage: chat.messages[messagesLength - 1],
	                lastAccess: chat.lastAccess,
	                user: chat.user
	            });
	        });

	        this.chats.sort(function (a, b) {
	            if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
	                return -1;
	            }
	            if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
	                return 1;
	            }
	            return 0;
	        });
	    });

	    this.on('mount', function () {
	        messageStore.on('updated', this.update);
	    });

	    this.on('unmount', function () {
	        messageStore.off('updated', this.update);
	    });

	    this.active = function () {
	        return this.openChatID === this.id;
	    };

	    this.updateOpenChatID = function (e) {
	        messageStore.trigger('updateOpenChatID', e.item.id);
	    };

	    this.getProfilePictureStyle = function (imgUrl) {
	        return 'background-image: url("' + imgUrl + '")';
	    };

	    this.prettyDates = function (timestamp) {
	        return prettyDates.getShortDate(timestamp);
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(21);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(21, function() {
				var newContent = __webpack_require__(21);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, ".chat-user-list-item {\n  display: flex;\n  flex-flow: row wrap;\n}\n.chat-user-list-item > * {\n  flex: 1 100%;\n}\n.chat-user-list-image {\n  flex: 0 1 40px;\n  height: 40px;\n  border-radius: 50%;\n  background-position: center;\n  background-size: cover;\n}\n.chat-user-list-name {\n  margin-left: 4px;\n  flex: 2 0;\n}\n.chat-user-list-timestamp {\n  flex: 2 0;\n}\n.chat-user-list-message {\n  padding-top: 8px;\n}\n", ""]);

	// exports


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    getShortDate: function getShortDate(timestamp) {
	        var distance = Math.round((+new Date() - timestamp) / 60000);
	        var date = new Date(timestamp);

	        var hour = ('0' + date.getHours()).slice(-2);
	        var minutes = ('0' + date.getMinutes()).slice(-2);

	        if (distance > 2879) {
	            if (distance > 14567) {
	                return this.getNiceDate(timestamp);
	            } else {
	                return 'Yesterday at ' + hour + ':' + minutes;
	            }
	        } else {
	            return 'at ' + hour + ':' + minutes;
	        }
	    },
	    getNiceDate: function getNiceDate(timestamp) {
	        var defaultString = '%d %f%y at %h:%i';

	        var language = {
	            0: 'less than a minute ago',
	            1: '1 minute ago',
	            59: '%distance minutes ago',
	            118: 'an hour ago',
	            1439: '%r hours ago',
	            2879: 'Yesterday at %h:%i',
	            14567: '%l at %h:%i'
	        };
	        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

	        var date = new Date(timestamp);
	        var distance = Math.round((+new Date() - timestamp) / 60000);

	        var string;
	        for (var i in language) {
	            if (distance < i) {
	                string = language[i];

	                break;
	            }
	        }

	        var hour = ('0' + date.getHours()).slice(-2);
	        var minutes = ('0' + date.getMinutes()).slice(-2);
	        var day = days[date.getDay()];
	        var month = months[date.getMonth()];

	        var year = date.getFullYear();
	        if (new Date().getFullYear() === year) {
	            year = '';
	        }

	        if (string) {
	            var hoursAgo = Math.round(distance / 60);

	            return string.replace(/%distance/i, distance).replace(/%r/i, hoursAgo).replace(/%h/i, hour).replace(/%i/i, minutes).replace(/%l/i, day);
	        }

	        return defaultString.replace(/%d/i, day).replace(/%f/i, month).replace(/%y/i, year).replace(/%h/i, hour).replace(/%i/i, minutes);
	    }
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	var messageStore = __webpack_require__(12);
	__webpack_require__(24);

	riot.tag('reply-box', '<form onsubmit="{submit}"> <input type="text" name="input"> </form>', 'reply-box form, [riot-tag="reply-box"] form{ position: absolute; bottom: 0; width: 100%; } reply-box input, [riot-tag="reply-box"] input{ width: 100%; padding: 4px; }', function (opts) {
	    this.on('update', function () {
	        this.input.value = '';
	    });

	    this.on('mount', function () {
	        messageStore.on('updated', this.update);
	    });

	    this.on('unmount', function () {
	        messageStore.off('updated', this.update);
	    });

	    this.submit = function () {
	        if (!this.input.value) {
	            return false;
	        }
	        messageStore.trigger('sendMessage', {
	            contents: this.input.value,
	            timestamp: +new Date(),
	            from: 1
	        });
	    };
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(riot) {'use strict';

	riot.tag('rmdl-input', '<div class="mdl-textfield mdl-js-textfield {mdl-textfield--floating-label: !!opts.label}"> <input class="mdl-textfield__input" type="{ opts.type }" autocomplete="off" id="{ opts.id }"> <label class="mdl-textfield__label" for="{ opts.id }">{ opts.label }</label> </div>', function (opts) {});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(26);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(10)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(true) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept(26, function() {
				var newContent = __webpack_require__(26);
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(9)();
	// imports


	// module
	exports.push([module.id, "@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(27) + ");\n  src:  url(" + __webpack_require__(27) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(28) + ") format('woff2'),\n        url(" + __webpack_require__(29) + ") format('woff'),\n        url(" + __webpack_require__(30) + ") format('truetype'),\n        url(" + __webpack_require__(31) + "#Roboto) format('svg');\n  font-weight: 100;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Thin';\n  src:  url(" + __webpack_require__(27) + ");\n  src:  url(" + __webpack_require__(27) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(28) + ") format('woff2'),\n        url(" + __webpack_require__(29) + ") format('woff'),\n        url(" + __webpack_require__(30) + ") format('truetype'),\n        url(" + __webpack_require__(31) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(32) + ");\n  src:  url(" + __webpack_require__(32) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(33) + ") format('woff2'),\n        url(" + __webpack_require__(34) + ") format('woff'),\n        url(" + __webpack_require__(35) + ") format('truetype'),\n        url(" + __webpack_require__(36) + "#Roboto) format('svg');\n  font-weight: 100;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-ThinItalic';\n  src:  url(" + __webpack_require__(32) + ");\n  src:  url(" + __webpack_require__(32) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(33) + ") format('woff2'),\n        url(" + __webpack_require__(34) + ") format('woff'),\n        url(" + __webpack_require__(35) + ") format('truetype'),\n        url(" + __webpack_require__(36) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(37) + ");\n  src:  url(" + __webpack_require__(37) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(38) + ") format('woff2'),\n        url(" + __webpack_require__(39) + ") format('woff'),\n        url(" + __webpack_require__(40) + ") format('truetype'),\n        url(" + __webpack_require__(41) + "#Roboto) format('svg');\n  font-weight: 300;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Light';\n  src:  url(" + __webpack_require__(37) + ");\n  src:  url(" + __webpack_require__(37) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(38) + ") format('woff2'),\n        url(" + __webpack_require__(39) + ") format('woff'),\n        url(" + __webpack_require__(40) + ") format('truetype'),\n        url(" + __webpack_require__(41) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(42) + ");\n  src:  url(" + __webpack_require__(42) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(43) + ") format('woff2'),\n        url(" + __webpack_require__(44) + ") format('woff'),\n        url(" + __webpack_require__(45) + ") format('truetype'),\n        url(" + __webpack_require__(46) + "#Roboto) format('svg');\n  font-weight: 300;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-LightItalic';\n  src:  url(" + __webpack_require__(42) + ");\n  src:  url(" + __webpack_require__(42) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(43) + ") format('woff2'),\n        url(" + __webpack_require__(44) + ") format('woff'),\n        url(" + __webpack_require__(45) + ") format('truetype'),\n        url(" + __webpack_require__(46) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(47) + ");\n  src:  url(" + __webpack_require__(47) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(48) + ") format('woff2'),\n        url(" + __webpack_require__(49) + ") format('woff'),\n        url(" + __webpack_require__(50) + ") format('truetype'),\n        url(" + __webpack_require__(51) + "#Roboto) format('svg');\n  font-weight: 400;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Regular';\n  src:  url(" + __webpack_require__(47) + ");\n  src:  url(" + __webpack_require__(47) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(48) + ") format('woff2'),\n        url(" + __webpack_require__(49) + ") format('woff'),\n        url(" + __webpack_require__(50) + ") format('truetype'),\n        url(" + __webpack_require__(51) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(52) + ");\n  src:  url(" + __webpack_require__(52) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(53) + ") format('woff2'),\n        url(" + __webpack_require__(54) + ") format('woff'),\n        url(" + __webpack_require__(55) + ") format('truetype'),\n        url(" + __webpack_require__(56) + "#Roboto) format('svg');\n  font-weight: 400;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-RegularItalic';\n  src:  url(" + __webpack_require__(52) + ");\n  src:  url(" + __webpack_require__(52) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(53) + ") format('woff2'),\n        url(" + __webpack_require__(54) + ") format('woff'),\n        url(" + __webpack_require__(55) + ") format('truetype'),\n        url(" + __webpack_require__(56) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(57) + ");\n  src:  url(" + __webpack_require__(57) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(58) + ") format('woff2'),\n        url(" + __webpack_require__(59) + ") format('woff'),\n        url(" + __webpack_require__(60) + ") format('truetype'),\n        url(" + __webpack_require__(61) + "#Roboto) format('svg');\n  font-weight: 500;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Medium';\n  src:  url(" + __webpack_require__(57) + ");\n  src:  url(" + __webpack_require__(57) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(58) + ") format('woff2'),\n        url(" + __webpack_require__(59) + ") format('woff'),\n        url(" + __webpack_require__(60) + ") format('truetype'),\n        url(" + __webpack_require__(61) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(62) + ");\n  src:  url(" + __webpack_require__(62) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(63) + ") format('woff2'),\n        url(" + __webpack_require__(64) + ") format('woff'),\n        url(" + __webpack_require__(65) + ") format('truetype'),\n        url(" + __webpack_require__(66) + "#Roboto) format('svg');\n  font-weight: 500;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-MediumItalic';\n  src:  url(" + __webpack_require__(62) + ");\n  src:  url(" + __webpack_require__(62) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(63) + ") format('woff2'),\n        url(" + __webpack_require__(64) + ") format('woff'),\n        url(" + __webpack_require__(65) + ") format('truetype'),\n        url(" + __webpack_require__(66) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(67) + ");\n  src:  url(" + __webpack_require__(67) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(68) + ") format('woff2'),\n        url(" + __webpack_require__(69) + ") format('woff'),\n        url(" + __webpack_require__(70) + ") format('truetype'),\n        url(" + __webpack_require__(71) + "#Roboto) format('svg');\n  font-weight: 700;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Bold';\n  src:  url(" + __webpack_require__(67) + ");\n  src:  url(" + __webpack_require__(67) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(68) + ") format('woff2'),\n        url(" + __webpack_require__(69) + ") format('woff'),\n        url(" + __webpack_require__(70) + ") format('truetype'),\n        url(" + __webpack_require__(71) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(72) + ");\n  src:  url(" + __webpack_require__(72) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(73) + ") format('woff2'),\n        url(" + __webpack_require__(74) + ") format('woff'),\n        url(" + __webpack_require__(75) + ") format('truetype'),\n        url(" + __webpack_require__(76) + "#Roboto) format('svg');\n  font-weight: 700;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-BoldItalic';\n  src:  url(" + __webpack_require__(72) + ");\n  src:  url(" + __webpack_require__(72) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(73) + ") format('woff2'),\n        url(" + __webpack_require__(74) + ") format('woff'),\n        url(" + __webpack_require__(75) + ") format('truetype'),\n        url(" + __webpack_require__(76) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(77) + ");\n  src:  url(" + __webpack_require__(77) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(78) + ") format('woff2'),\n        url(" + __webpack_require__(79) + ") format('woff'),\n        url(" + __webpack_require__(80) + ") format('truetype'),\n        url(" + __webpack_require__(81) + "#Roboto) format('svg');\n  font-weight: 900;\n  font-style: normal;\n}\n\n@font-face {\n  font-family: 'Roboto-Black';\n  src:  url(" + __webpack_require__(77) + ");\n  src:  url(" + __webpack_require__(77) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(78) + ") format('woff2'),\n        url(" + __webpack_require__(79) + ") format('woff'),\n        url(" + __webpack_require__(80) + ") format('truetype'),\n        url(" + __webpack_require__(81) + "#Roboto) format('svg');\n}\n\n@font-face {\n  font-family: 'Roboto';\n  src:  url(" + __webpack_require__(82) + ");\n  src:  url(" + __webpack_require__(82) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(83) + ") format('woff2'),\n        url(" + __webpack_require__(84) + ") format('woff'),\n        url(" + __webpack_require__(85) + ") format('truetype'),\n        url(" + __webpack_require__(86) + "#Roboto) format('svg');\n  font-weight: 900;\n  font-style: italic;\n}\n\n@font-face {\n  font-family: 'Roboto-BlackItalic';\n  src:  url(" + __webpack_require__(82) + ");\n  src:  url(" + __webpack_require__(82) + "?#iefix) format('embedded-opentype'),\n        url(" + __webpack_require__(83) + ") format('woff2'),\n        url(" + __webpack_require__(84) + ") format('woff'),\n        url(" + __webpack_require__(85) + ") format('truetype'),\n        url(" + __webpack_require__(86) + "#Roboto) format('svg');\n}", ""]);

	// exports


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "950647b1867fbbc81425dea27f05ce55.eot"

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "790ebf41d0214f5eda4ef61263ed75f8.woff2"

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "90d3804f0231704c15ccc5861245e8ce.woff"

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "cc85ce37b4256966e6f3a3559239c5c0.ttf"

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ba422f71e799f3d29cbf99e6abded2bd.svg"

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "21a5b5b252902704a1db3dda5a29383b.eot"

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8a2c1a5de09de8bb2c45390a10f90c2b.woff2"

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "588293290e86dad97fcf33ed1719c083.woff"

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "11b5cc9584f2c007a22966a031ead20e.ttf"

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "21e9a2e5ed0b0d8d1bb7fd1e1f71104d.svg"

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "43769cf9b06a7698413fc68760bb687a.eot"

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8e0860f3581b197e9fa4713a706c7bcc.woff2"

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "37fbbbad5577a95bdf058307c717c882.woff"

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a2b8c641546c0e5a95e22e5a262f0357.ttf"

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "054fa50baa6598a7bf0c6deec135d3a4.svg"

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "917c7469e08ef2f1bf0a6c7cababeca6.eot"

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "879d940bccbb25f6096ec4361154d469.woff2"

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c7b4e746cf8ecbf412fc944146154d24.woff"

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "056caeabe95749fe2b973bb9a0cd0776.ttf"

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1a9e39e536aed26b863b243e68f97e3a.svg"

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "659df89e1c6f9e7767faa49e792a1aa3.eot"

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "b2a6341ae7440130ec4b4b186aff8413.woff2"

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "081b11ebaca8ad30fd092e01451015dc.woff"

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "99b14f0da0591e0d71678dc163eaff8b.ttf"

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "766c8926f6d9061fef24cd7269a341d0.svg"

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d62388680848928117049609352f857c.eot"

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "df8e3a9b9aed943417973988732b928f.woff2"

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "8add1ba317c27e39b7781c95fa174671.woff"

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "90dbf902b8d0592e1beb7c8829bcc1cb.ttf"

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "527502d7927a41ca0b6a194f9cb34656.svg"

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a71bea67fcac74d0b82c252b5b2d3fb4.eot"

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2741a14e49524efa6059c735010239d0.woff2"

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "303ded6436dcf7ea75157e2aeff876ce.woff"

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c54f2a3ee42d2a58d82f1da293995d20.ttf"

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2b4f394ce87ea4e7a68bd9d0cbba7c16.svg"

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2e9c552bf3775b8d2774b554767510e6.eot"

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f10d1f42838680a70ac2b66e62887106.woff2"

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "da059a7386fea889c55cce11253df175.woff"

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fa183350bf6b814ae5523c8d49de7c73.ttf"

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "eb65fb18d4446e4ac27d6e27c25fc224.svg"

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "661045d5079779fec4f6dc1eb01d3e2c.eot"

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ab96cca26751239828b8e9c524cca5bb.woff2"

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ad140ff02a7091257e2b31619106194e.woff"

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "56a76a220d9c9765946d0802d4d661c4.ttf"

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c7f4667b59b9bc95130e697009d3829c.svg"

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c23f13049fd10f5530045ac63575824a.eot"

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "355e388740673054493ce5fe32e37596.woff2"

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "a7dce23c0dd99a4afa5cdb4925f0358a.woff"

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "d23d5bdadc495f12ef69192243e95e4d.ttf"

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "c2e0f75da3677f645034d61c0445c9ba.svg"

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "081d897e71a7e841cfd65823eeee7e58.eot"

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "2b8d6922c2c9957356bc50f475de4e79.woff2"

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "4c3b6229efe63a13dbb4c3c32e292e61.woff"

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "44236ad507eddcbfd986333f38bd13d5.ttf"

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ab04c7611d94b690aee3c08a18ae8748.svg"

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f93ffed331cf6450bedddbb260ae4cda.eot"

/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "38d14dd4ff163c34e45b9701668652d4.woff2"

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "3a99796b2d8592471fcf278df4334d5d.woff"

/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "ad0f284c7113fd0aaf39b0e59b6afb09.ttf"

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "1f37c7545ae9f63d2279f99875678396.svg"

/***/ }
/******/ ]);