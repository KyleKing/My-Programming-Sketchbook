/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(2);
	module.exports = __webpack_require__(5);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

	(function(p) {
	  if (!p === undefined) {
	    console.error('Pebble object not found!?');
	    return;
	  }
	
	  // Aliases:
	  p.on = p.addEventListener;
	  p.off = p.removeEventListener;
	
	  // For Android (WebView-based) pkjs, print stacktrace for uncaught errors:
	  if (typeof window !== 'undefined' && window.addEventListener) {
	    window.addEventListener('error', function(event) {
	      if (event.error && event.error.stack) {
	        console.error('' + event.error + '\n' + event.error.stack);
	      }
	    });
	  }
	
	})(Pebble);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var utf8 = __webpack_require__(3);
	  var POSTMESSAGE_DEBUG = false;
	
	  // Super simple polyfill for Array.from() that only deals with a Uint8Array:
	  var arrayFromUint8Array = Array.from ? Array.from : function(uint8Array) {
	      return [].slice.call(uint8Array);
	  };
	
	  function debugLog() {
	    if (POSTMESSAGE_DEBUG) {
	      console.log.apply(console, arguments);
	    }
	  }
	
	  function createHandlersList() {
	    var pos = 0;
	    var handlers = [];
	
	    return {
	      add : function(handler) {
	        handlers.push(handler);
	      },
	      clear : function() {
	        handlers = [];
	        pos = 0;
	      },
	      isEmpty : function() {
	        return (handlers.length == 0);
	      },
	      remove : function(handler) {
	        var idx = handlers.indexOf(handler);
	        if (idx < 0) { return; } // Not registered
	        if (idx < pos) { pos = Math.max(pos - 1, 0); } // We've iterated past it, and it's been removed
	        handlers.splice(idx, 1);
	      },
	      newIterator : function() {
	        pos = 0; // new iterator, reset position
	        return {
	          next : function() {
	            if (pos < handlers.length) {
	              return handlers[pos++];
	            } else {
	              return undefined;
	            }
	          }
	        }
	      }
	    }
	  }
	
	  var EVENTS = {};
	
	  var _callHandler = function(handler, event_name, callback_data) {
	    var msg = { type: event_name };
	    if (callback_data !== undefined) {
	      msg.data = callback_data;
	    }
	    handler(msg);
	  };
	
	  var _callHandlersForEvent = function(event_name, callback_data) {
	    var handler;
	    if (!(event_name in EVENTS)) {
	      return;
	    }
	
	    var it = EVENTS[event_name].newIterator();
	    while ((handler = it.next())) {
	      _callHandler(handler, event_name, callback_data);
	    }
	  }
	
	  var _isPostMessageEvent = function(event_name) {
	    return (['message', 'postmessageerror',
	             'postmessageconnected', 'postmessagedisconnected'].indexOf(event_name)) > -1;
	  }
	
	  var __Pebble = Pebble;
	
	  // Create a new object with its prototype pointing to the original, using
	  // Object.create(). This way, we can rely on JavaScript's prototype chain
	  // traversal to make all properties on the original object "just work".
	  // Note however, that these won't be "own properties", so when using
	  // `for .. in`, Pebble.keys(), Object.getOwnPropertyNames(), etc. these
	  // "delegated properties" will not be found.
	  Pebble = Object.create(Pebble);
	
	  for (var attr in __Pebble) {
	    if (!__Pebble.hasOwnProperty(attr)) {
	      continue;
	    }
	    // Attributes of Pebble which can be bound, should be bound to the original object
	    if (__Pebble[attr].bind) {
	      Pebble[attr] = __Pebble[attr].bind(__Pebble);
	    } else {
	      Pebble[attr] = __Pebble[attr];
	    }
	  }
	
	  // Ensure that all exported functions exist.
	  ["addEventListener", "removeEventListener", "showSimpleNotificationOnPebble",
	   "sendAppMessage", "getTimelineToken", "timelineSubscribe",
	   "timelineUnsubscribe", "timelineSubscriptions", "getActiveWatchInfo",
	   "getAccountToken", "getWatchToken", "appGlanceReload"].forEach(
	      function(elem, idx, arr) {
	        if ((elem in Pebble) || ((typeof __Pebble[elem]) !== 'function')) {
	          // This function has already been copied over or doesn't actually exist.
	          return;
	        }
	        Pebble[elem] = __Pebble[elem].bind(__Pebble);
	      }
	   );
	
	  // sendAppMessage is not supported, make it undefined so a user will get a
	  // "not a function" error, and can check `typeof Pebble.sendAppMessage === 'function'`
	  // to test for support.
	  Pebble["sendAppMessage"] = undefined;
	
	  // The rocky implementation!
	
	  function _scheduleAsyncPostMessageError(jsonString, reason) {
	    _callHandlersForEvent('postmessageerror', JSON.parse(jsonString));
	    console.error("postMessage() failed. Reason: " + reason);
	  }
	
	  Pebble.postMessage = function(obj) {
	    _out.sendObject(obj);
	  };
	
	  var on = function(event_name, handler) {
	    if (typeof(handler) !== 'function') {
	      throw TypeError("Handler for event expected, received " + typeof(handler));
	    }
	    if (!(event_name in EVENTS)) {
	      EVENTS[event_name] = createHandlersList();
	    }
	    EVENTS[event_name].add(handler);
	
	    if ((event_name == "postmessageconnected" && _control.state == ControlStateSessionOpen) ||
	        (event_name == "postmessagedisconnected" && _control.state != ControlStateSessionOpen)) {
	      _callHandler(handler, event_name);
	    }
	  };
	
	  Pebble.addEventListener = function(event_name, handler) {
	    if (_isPostMessageEvent(event_name)) {
	      return on(event_name, handler);
	    } else if (event_name == 'appmessage') {
	      throw Error("App Message not supported with Rocky.js apps. See Pebble.postMessage()");
	    } else {
	      return __Pebble.addEventListener(event_name, handler);
	    }
	  };
	
	  // Alias to the overridden implementation:
	  Pebble.on = Pebble.addEventListener;
	
	  var off = function(event_name, handler) {
	    if (handler === undefined) {
	      throw TypeError('Not enough arguments (missing handler)');
	    }
	    if (event_name in EVENTS) {
	      EVENTS[event_name].remove(handler);
	    }
	  }
	
	  Pebble.removeEventListener = function(event_name, handler) {
	    if (_isPostMessageEvent(event_name)) {
	      off(event_name, handler);
	    } else {
	      return __Pebble.removeEventListener(event_name, handler);
	    }
	  }
	
	  // Alias to the overridden implementation:
	  Pebble.off = Pebble.removeEventListener;
	
	  /*********************************************************************************
	   * postMessage(): Outbound object and control message queuing, sending & chunking.
	   ********************************************************************************/
	
	  var _out = new Sender();
	
	  function Sender() {
	    this.controlQueue = [];
	    this.objectQueue = [];
	
	    this._currentMessageType = undefined;
	    this._failureCount = 0;
	    this._offsetBytes = 0;
	    this._chunkPayloadSize = 0;
	
	    this._resetCurrent = function() {
	      this._currentMessageType = undefined;
	      this._failureCount = 0;
	      this._offsetBytes = 0;
	      this._chunkPayloadSize = 0;
	    };
	
	    this._getNextMessageType = function() {
	      if (this.controlQueue.length > 0) {
	        return "control";
	      } else if (this.objectQueue.length > 0) {
	        return "object";
	      }
	      // No messages remaining
	      return undefined;
	    };
	
	    // Begin sending the next prioritized message
	    this._sendNext = function() {
	      if (this._currentMessageType !== undefined) {
	        return; // Already something in flight
	      }
	
	      var type = this._getNextMessageType();
	      if (type === undefined) {
	        return; // No message to send
	      }
	
	      if (type === "control") {
	        this._currentMessageType = type;
	        this._trySendNextControl();
	      } else if (type === "object") {
	        this._currentMessageType = type;
	        this._trySendNextChunk();
	      }
	    };
	
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Control Message Handling
	    //////////////////////////////////////////////////////////////////////////////
	
	    this._controlSuccess = function() {
	      this.controlQueue.shift();
	      this._resetCurrent();
	      this._sendNext();
	    };
	
	    this._controlFailure = function(e) {
	      this._failureCount++;
	      var willRetry = (this._failureCount <= 3);
	      if (willRetry) {
	        setTimeout(this._trySendNextControl.bind(this), 1000); // 1s retry
	      } else {
	        debugLog("Failed to send control message: " + e +
	                 ", entering disconnected state.");
	        this.controlQueue.shift();
	        this._resetCurrent();
	
	        _control.enter(ControlStateDisconnected);
	        this._sendNext();
	      }
	    };
	
	    this._trySendNextControl = function() {
	      var msg = this.controlQueue[0];
	      __Pebble.sendAppMessage(msg,
	                              this._controlSuccess.bind(this),
	                              this._controlFailure.bind(this));
	    };
	
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Object Message Handling
	    //////////////////////////////////////////////////////////////////////////////
	
	    this._createDataObject = function(obj) {
	      // Store obj as UTF-8 encoded JSON string into .data:
	      var native_str_msg;
	      try {
	        native_str_msg = JSON.stringify(obj);
	      } catch(e) {
	        throw Error("First argument must be JSON-serializable.");
	      }
	      // ECMA v5.1, 15.12.3, Note 5: Values that do not have a JSON
	      // representation (such as undefined and functions) do not produce a
	      // String. Instead they produce the undefined value.
	      if (native_str_msg === undefined) {
	        throw TypeError(
	          "Argument at index 0 is not a JSON.stringify()-able object");
	      }
	      var utf8_str_msg = utf8.encode(native_str_msg);
	      var data = [];
	      for (var i = 0; i < utf8_str_msg.length; i++) {
	        data.push(utf8_str_msg.charCodeAt(i));
	      }
	      data.push(0);  // zero-terminate
	
	      return {
	        obj: obj,
	        data: data,
	        json: native_str_msg,
	      };
	    };
	
	    this._completeObject = function(failureReasonOrUndefined) {
	      var completeObject = this.objectQueue.shift();
	      this._resetCurrent();
	
	      if (failureReasonOrUndefined === undefined) {
	        debugLog("Complete!");
	      } else {
	        _scheduleAsyncPostMessageError(completeObject.json, failureReasonOrUndefined);
	      }
	    };
	
	    this._chunkSuccess = function(e) {
	      var data = this.objectQueue[0].data;
	      debugLog("Sent " + this._chunkPayloadSize + " of " + data.length + " bytes");
	      this._offsetBytes += this._chunkPayloadSize;
	      if (this._offsetBytes === data.length) {
	        this._completeObject();
	        this._sendNext();
	      } else {
	        this._trySendNextChunk();
	      }
	    };
	
	    this._chunkFailure = function(e) {
	      this._failureCount++;
	      var willRetry = (this._failureCount <= 3);
	      console.error("Chunk failed to send (willRetry=" + willRetry + "): " + e);
	      if (willRetry) {
	        setTimeout(this._trySendNextChunk.bind(this), 1000); // 1s retry
	      } else {
	        this._completeObject("Too many failed transfer attempts");
	        this._sendNext();
	      }
	    };
	
	    this._trySendNextChunk = function() {
	      if (this._getNextMessageType() !== "object") {
	        // This is no longer our highest priority outgoing message.
	        // Send that message instead, and this message will be left in the queue
	        // andrestarted when appropriate.
	        this._resetCurrent();
	        this._sendNext();
	        return;
	      }
	
	      if (!_control.isSessionOpen()) {
	        // Make sure to start over if session is closed while chunks have been
	        // sent for the head object:
	        this._offsetBytes = 0;
	        this._chunkFailure("Session not open. Hint: check out the \"postmessageconnected\" event.");
	        return;
	      }
	
	      var data = this.objectQueue[0].data;
	      var sizeRemaining = data.length - this._offsetBytes;
	      debugLog("Sending next chunk, sizeRemaining: " + sizeRemaining);
	      this._chunkPayloadSize =
	        Math.min(_control.protocol.tx_chunk_size, sizeRemaining);
	      var n;
	      var isFirst = (this._offsetBytes === 0);
	      var isFirstBit;
	      if (isFirst) {
	        isFirstBit = (1 << 7);
	        n = data.length;
	      } else {
	        isFirstBit = 0;
	        n = this._offsetBytes;
	      }
	      var chunk = [
	        n & 255,
	        (n >> 8) & 255,
	        (n >> 16) & 255,
	        ((n >> 24) & ~(1 << 7)) | isFirstBit
	      ];
	      var chunkPayload = data.slice(
	        this._offsetBytes, this._offsetBytes + this._chunkPayloadSize);
	      Array.prototype.push.apply(chunk, chunkPayload);
	      debugLog("Sending Chunk Size: " + this._chunkPayloadSize);
	      __Pebble.sendAppMessage({ControlKeyChunk: chunk},
	        this._chunkSuccess.bind(this),
	        this._chunkFailure.bind(this));
	    };
	
	    //////////////////////////////////////////////////////////////////////////////
	    // Sender: Public Interface
	    //////////////////////////////////////////////////////////////////////////////
	
	    this.sendObject = function(obj) {
	      debugLog("Queuing up object message: " + JSON.stringify(obj));
	      var dataObj = this._createDataObject(obj);
	      this.objectQueue.push(dataObj)
	      this._sendNext();
	    };
	
	    this.sendControl = function(obj) {
	      debugLog("Sending control message: " + JSON.stringify(obj));
	      this.controlQueue.push(obj);
	      this._sendNext();
	    }
	  };
	
	  /*****************************************************************************
	   * postMessage(): Receiving chunks of inbound objects and reassembly
	   ****************************************************************************/
	
	  var _in = new ChunkReceiver();
	
	  function ChunkReceiver() {
	    this.utf8_json_string = "";
	    this.total_size_bytes = 0;
	    this.received_size_bytes = 0;
	
	    this.handleChunkReceived = function handleChunkReceived(chunk) {
	      if (!chunk) {
	        return false;
	      }
	      var isExpectingFirst = (this.utf8_json_string.length === 0);
	      if (chunk.is_first != isExpectingFirst) {
	        console.error(
	          "Protocol out of sync! chunk.is_first=" + chunk.is_first +
	          " isExpectingFirst=" + isExpectingFirst);
	        return false;
	      }
	      if (chunk.is_first) {
	        this.total_size_bytes = chunk.total_size_bytes;
	        this.received_size_bytes = 0;
	      } else {
	        if (this.received_size_bytes != chunk.offset_bytes) {
	          console.error(
	            "Protocol out of sync! received_size_bytes=" +
	            this.received_size_bytes + " chunk.offset_bytes=" + chunk.offset_bytes);
	          return false;
	        }
	        if (this.received_size_bytes + chunk.data.length > this.total_size_bytes) {
	          console.error(
	            "Protocol out of sync! received_size_bytes=" + this.received_size_bytes +
	            " chunk.data.length=" + chunk.data.length +
	            " total_size_bytes=" + this.total_size_bytes);
	          return false;
	        }
	      }
	
	      debugLog("Received (" + this.received_size_bytes + " / " +
	        this.total_size_bytes + " bytes)");
	      debugLog("Payload size: " + chunk.data.length);
	
	      this.received_size_bytes += chunk.data.length;
	      var isLastChunk = (this.received_size_bytes == this.total_size_bytes);
	      var isLastChunkZeroTerminated = undefined;
	      if (isLastChunk) {
	        isLastChunkZeroTerminated = (chunk.data[chunk.data.length - 1] === 0);
	      }
	
	      // Copy the received data over:
	      var end = isLastChunk ? chunk.data.length - 1 : chunk.data.length;
	      for (var i = 0; i < end; i++) {
	        this.utf8_json_string += String.fromCharCode(chunk.data[i]);
	      }
	
	      if (isLastChunk) {
	        if (isLastChunkZeroTerminated) {
	          var json_string = utf8.decode(this.utf8_json_string);
	          var data;
	          try {
	            data = JSON.parse(json_string);
	          } catch (e) {
	            console.error(
	              "Dropping message, failed to parse JSON with error: " + e +
	              " (json_string=" + json_string + ")");
	          }
	          if (data !== undefined) {
	            _callHandlersForEvent('message', data);
	          }
	        } else {
	          console.error("Last Chunk wasn't zero terminated! Dropping message.");
	        }
	
	        this.utf8_json_string = "";
	      }
	
	      return true;
	    }
	  }
	
	  /*****************************************************************************
	   * postMessage() Session Control Protocol
	   ****************************************************************************/
	
	  var ControlStateDisconnected = "ControlStateDisconnected";
	  var ControlStateAwaitingResetCompleteRemoteInitiated = "ControlStateAwaitingResetCompleteRemoteInitiated";
	  var ControlStateAwaitingResetCompleteLocalInitiated = "ControlStateAwaitingResetCompleteLocalInitiated";
	  var ControlStateSessionOpen = "ControlStateSessionOpen";
	
	  var ControlKeyResetRequest = "ControlKeyResetRequest";
	  var ControlKeyResetComplete = "ControlKeyResetComplete";
	  var ControlKeyChunk = "ControlKeyChunk";
	  var ControlKeyUnsupportedError = "ControlKeyUnsupportedError";
	
	  function _unpackResetCompleteMessage(data) {
	    debugLog("Got ResetComplete: " + data);
	    return {
	      min_version : data[0],
	      max_version : data[1],
	      max_tx_chunk_size : (data[2] << 8) | (data[3]),
	      max_rx_chunk_size : (data[4] << 8) | (data[5]),
	    };
	  };
	
	  function _unpackChunk(data) {
	    //debugLog("Got Chunk: " + data);
	    if (data.length <= 4) {
	      console.error("Chunk data too short to be valid!");
	      return;
	    }
	    var is_first_bit = (1 << 7);
	    var is_first = (is_first_bit === (data[3] & is_first_bit));
	    var chunk = {
	      is_first : is_first
	    };
	    var msbyte = (~is_first_bit) & data[3];
	    var num31bits = (msbyte << 24) | (data[2] << 16) | (data[1] << 8) | data[0];
	    if (is_first) {
	      chunk.total_size_bytes = num31bits;
	    } else {
	      chunk.offset_bytes = num31bits;
	    }
	    chunk.data = data.slice(4);
	    return chunk;
	  }
	
	  function _remoteProtocolValidateAndSet(remote) {
	    debugLog("Remote min: " + remote.min_version);
	    debugLog("Remote max: " + remote.max_version);
	    if (remote.min_version == undefined || remote.max_version == undefined ||
	        remote.min_version > PROTOCOL.max_version || remote.max_version < PROTOCOL.min_version) {
	      return false;
	    }
	
	    _control.protocol = {
	      version : Math.min(remote.max_version, PROTOCOL.max_version),
	      tx_chunk_size : Math.min(remote.max_rx_chunk_size, PROTOCOL.max_tx_chunk_size),
	      rx_chunk_size : Math.min(remote.max_tx_chunk_size, PROTOCOL.max_rx_chunk_size),
	    };
	
	    return true;
	  };
	
	  function _sendControlMessage(msg) {
	    _out.sendControl(msg);
	  }
	
	  function _controlSendResetComplete() {
	    var data = new Uint8Array(6);
	    data[0] = PROTOCOL.min_version;
	    data[1] = PROTOCOL.max_version;
	    data[2] = PROTOCOL.max_tx_chunk_size >> 8;
	    data[3] = PROTOCOL.max_tx_chunk_size;
	    data[4] = PROTOCOL.max_rx_chunk_size >> 8;
	    data[5] = PROTOCOL.max_rx_chunk_size;
	    _sendControlMessage({ ControlKeyResetComplete : arrayFromUint8Array(data) });
	  }
	
	  function _controlSendResetRequest() {
	    _sendControlMessage({ ControlKeyResetRequest : 0 });
	  }
	
	  function _controlSendUnsupportedError() {
	    _sendControlMessage({ ControlKeyUnsupportedError : 0 });
	  }
	
	  var ControlHandlers = {
	    ControlStateDisconnected : function(payload) {
	    },
	    ControlStateAwaitingResetCompleteRemoteInitiated : function(payload) {
	      if (ControlKeyResetComplete in payload) {
	        var remote_protocol = _unpackResetCompleteMessage(payload[ControlKeyResetComplete]);
	        // NOTE: This should *always* be true, we should never receive a
	        // ResetComplete response from the Remote in this state since it already
	        // knows it is unsupported
	        if (_remoteProtocolValidateAndSet(remote_protocol)) {
	          _control.enter(ControlStateSessionOpen);
	        }
	      } else if (ControlKeyResetRequest in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteRemoteInitiated); // Re-enter this state
	      } else if (ControlKeyChunk in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	      } else if (ControlKeyUnsupportedError in payload) {
	        throw Error("Unsupported protocol error: " + payload[ControlKeyUnsupportedError]);
	      }
	    },
	    ControlStateAwaitingResetCompleteLocalInitiated : function(payload) {
	      if (ControlKeyResetComplete in payload) {
	        var remote_protocol = _unpackResetCompleteMessage(payload[ControlKeyResetComplete]);
	        debugLog("Remote Protocol: " + remote_protocol);
	        if (_remoteProtocolValidateAndSet(remote_protocol)) {
	          debugLog("OK Remote protocol...");
	          _controlSendResetComplete();
	          _control.enter(ControlStateSessionOpen);
	        } else {
	          _controlSendUnsupportedError();
	        }
	      } else {
	        ; // Ignore, we're in this state because we already sent a ResetRequest
	      }
	    },
	    ControlStateSessionOpen : function(payload) {
	      if (ControlKeyChunk in payload) {
	        var chunk = _unpackChunk(payload[ControlKeyChunk]);
	        if (false === _in.handleChunkReceived(chunk)) {
	          _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	        }
	      } else if (ControlKeyResetRequest in payload) {
	        _control.enter(ControlStateAwaitingResetCompleteRemoteInitiated);
	      } else {
	        // FIXME: This could be an UnsupportedError, we probably don't want to
	        // keep on trying to negotiate protocol
	        _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	      }
	    },
	  };
	
	  var ControlTransitions = {
	    ControlStateDisconnected : function(from_state) {
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteRemoteInitiated;
	    },
	    ControlStateAwaitingResetCompleteRemoteInitiated : function(from_state) {
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteRemoteInitiated;
	      _controlSendResetComplete();
	    },
	    ControlStateAwaitingResetCompleteLocalInitiated : function(from_state) {
	      if (from_state != ControlStateAwaitingResetCompleteLocalInitiated) {
	        // Coming from elsewhere, send the ResetRequest
	        _controlSendResetRequest();
	      }
	      _control.resetProtocol();
	      _control.state = ControlStateAwaitingResetCompleteLocalInitiated;
	    },
	    ControlStateSessionOpen : function(from_state) {
	      _control.state = ControlStateSessionOpen;
	      _callHandlersForEvent('postmessageconnected');
	    },
	  };
	
	  var PROTOCOL = {
	    min_version : 1,
	    max_version : 1,
	    max_tx_chunk_size : 1000,
	    max_rx_chunk_size : 1000,
	  };
	
	  var _control = {
	    state : ControlStateDisconnected,
	    handle : function(msg) {
	      debugLog("Handle " + this.state + "(" + JSON.stringify(msg.payload) + "}");
	      ControlHandlers[this.state](msg.payload);
	    },
	    enter : function(to_state) {
	      debugLog("Enter " + this.state + " ===> " + to_state);
	      var prev_state = this.state;
	      ControlTransitions[to_state](this.state);
	      if (prev_state == ControlStateSessionOpen && to_state != ControlStateSessionOpen) {
	        _callHandlersForEvent('postmessagedisconnected');
	      }
	    },
	    isSessionOpen: function() {
	      return (this.state === ControlStateSessionOpen);
	    },
	    resetProtocol: function() {
	      this.protocol = {
	        version : 0,
	        tx_chunk_size : 0,
	        rx_chunk_size : 0,
	      };
	    },
	    protocol : {
	      version : 0,
	      tx_chunk_size : 0,
	      rx_chunk_size : 0,
	    },
	  };
	
	  __Pebble.addEventListener('appmessage', function(msg) {
	    _control.handle(msg);
	  });
	
	  __Pebble.addEventListener('ready', function(e) {
	    _control.enter(ControlStateAwaitingResetCompleteLocalInitiated);
	  });
	})();


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(module) {/*! https://mths.be/utf8js v2.1.2 by @mathias */
	;(function(root) {
	
		// Detect free variables `exports`
		var freeExports = typeof exports == 'object' && exports;
	
		// Detect free variable `module`
		var freeModule = typeof module == 'object' && module &&
			module.exports == freeExports && module;
	
		// Detect free variable `global`, from Node.js or Browserified code,
		// and use it as `root`
		var freeGlobal = typeof global == 'object' && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
			root = freeGlobal;
		}
	
		/*--------------------------------------------------------------------------*/
	
		var stringFromCharCode = String.fromCharCode;
	
		// Taken from https://mths.be/punycode
		function ucs2decode(string) {
			var output = [];
			var counter = 0;
			var length = string.length;
			var value;
			var extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
					// high surrogate, and there is a next character
					extra = string.charCodeAt(counter++);
					if ((extra & 0xFC00) == 0xDC00) { // low surrogate
						output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
					} else {
						// unmatched surrogate; only append this code unit, in case the next
						// code unit is the high surrogate of a surrogate pair
						output.push(value);
						counter--;
					}
				} else {
					output.push(value);
				}
			}
			return output;
		}
	
		// Taken from https://mths.be/punycode
		function ucs2encode(array) {
			var length = array.length;
			var index = -1;
			var value;
			var output = '';
			while (++index < length) {
				value = array[index];
				if (value > 0xFFFF) {
					value -= 0x10000;
					output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
					value = 0xDC00 | value & 0x3FF;
				}
				output += stringFromCharCode(value);
			}
			return output;
		}
	
		function checkScalarValue(codePoint) {
			if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
				throw Error(
					'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
					' is not a scalar value'
				);
			}
		}
		/*--------------------------------------------------------------------------*/
	
		function createByte(codePoint, shift) {
			return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
		}
	
		function encodeCodePoint(codePoint) {
			if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
				return stringFromCharCode(codePoint);
			}
			var symbol = '';
			if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
				symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
			}
			else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
				checkScalarValue(codePoint);
				symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
				symbol += createByte(codePoint, 6);
			}
			else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
				symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
				symbol += createByte(codePoint, 12);
				symbol += createByte(codePoint, 6);
			}
			symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
			return symbol;
		}
	
		function utf8encode(string) {
			var codePoints = ucs2decode(string);
			var length = codePoints.length;
			var index = -1;
			var codePoint;
			var byteString = '';
			while (++index < length) {
				codePoint = codePoints[index];
				byteString += encodeCodePoint(codePoint);
			}
			return byteString;
		}
	
		/*--------------------------------------------------------------------------*/
	
		function readContinuationByte() {
			if (byteIndex >= byteCount) {
				throw Error('Invalid byte index');
			}
	
			var continuationByte = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			if ((continuationByte & 0xC0) == 0x80) {
				return continuationByte & 0x3F;
			}
	
			// If we end up here, it’s not a continuation byte
			throw Error('Invalid continuation byte');
		}
	
		function decodeSymbol() {
			var byte1;
			var byte2;
			var byte3;
			var byte4;
			var codePoint;
	
			if (byteIndex > byteCount) {
				throw Error('Invalid byte index');
			}
	
			if (byteIndex == byteCount) {
				return false;
			}
	
			// Read first byte
			byte1 = byteArray[byteIndex] & 0xFF;
			byteIndex++;
	
			// 1-byte sequence (no continuation bytes)
			if ((byte1 & 0x80) == 0) {
				return byte1;
			}
	
			// 2-byte sequence
			if ((byte1 & 0xE0) == 0xC0) {
				byte2 = readContinuationByte();
				codePoint = ((byte1 & 0x1F) << 6) | byte2;
				if (codePoint >= 0x80) {
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 3-byte sequence (may include unpaired surrogates)
			if ((byte1 & 0xF0) == 0xE0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
				if (codePoint >= 0x0800) {
					checkScalarValue(codePoint);
					return codePoint;
				} else {
					throw Error('Invalid continuation byte');
				}
			}
	
			// 4-byte sequence
			if ((byte1 & 0xF8) == 0xF0) {
				byte2 = readContinuationByte();
				byte3 = readContinuationByte();
				byte4 = readContinuationByte();
				codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
					(byte3 << 0x06) | byte4;
				if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
					return codePoint;
				}
			}
	
			throw Error('Invalid UTF-8 detected');
		}
	
		var byteArray;
		var byteCount;
		var byteIndex;
		function utf8decode(byteString) {
			byteArray = ucs2decode(byteString);
			byteCount = byteArray.length;
			byteIndex = 0;
			var codePoints = [];
			var tmp;
			while ((tmp = decodeSymbol()) !== false) {
				codePoints.push(tmp);
			}
			return ucs2encode(codePoints);
		}
	
		/*--------------------------------------------------------------------------*/
	
		var utf8 = {
			'version': '2.1.2',
			'encode': utf8encode,
			'decode': utf8decode
		};
	
		// Some AMD build optimizers, like r.js, check for specific condition patterns
		// like the following:
		if (
			true
		) {
			!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
				return utf8;
			}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		}	else if (freeExports && !freeExports.nodeType) {
			if (freeModule) { // in Node.js or RingoJS v0.8.0+
				freeModule.exports = utf8;
			} else { // in Narwhal or RingoJS v0.7.0-
				var object = {};
				var hasOwnProperty = object.hasOwnProperty;
				for (var key in utf8) {
					hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
				}
			}
		} else { // in Rhino or a web browser
			root.utf8 = utf8;
		}
	
	}(this));
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	// PebbleKit JS (pkjs)
	
	var myAPIKey = 'bdecc599b3dc8bbf12ac58ccc6858d97';
	
	Pebble.on('message', function(event) {
	  // Get the message that was passed
	  var message = event.data;
	
	  if (message.fetch) {
	    navigator.geolocation.getCurrentPosition(function(pos) {
	      var url = 'http://api.openweathermap.org/data/2.5/weather' +
	              '?lat=' + pos.coords.latitude +
	              '&lon=' + pos.coords.longitude +
	              '&appid=' + myAPIKey;
	
	      request(url, 'GET', function(respText) {
	        var cityData = JSON.parse(respText);
	        
	      });
	      console.log("Lat/Long url:")
	      console.log(url)
	      // The URL must use the city ID or name and will not work for the Lat/Long (FYI)
	      //   http://bulk.openweathermap.org/sample/city.list.json.gz
	      url = "http://api.openweathermap.org/data/2.5/weather?id=4773711&appid=" + myAPIKey
	      http://api.openweathermap.org/data/2.1/find/city?lat=38.89&lon=-77.07=&cnt=1
	
	      request(url, 'GET', function(respText) {
	        var weatherData = JSON.parse(respText);
	
	        Pebble.postMessage({
	          'weather': {
	            // Convert from Kelvin
	            'celcius': Math.round(weatherData.main.temp - 273.15),
	            'fahrenheit': Math.round((weatherData.main.temp - 273.15) * 9 / 5 + 32),
	            'desc': weatherData.weather[0].main
	          }
	        });
	      });
	    }, function(err) {
	      console.error('Error getting location');
	    },
	    { timeout: 15000, maximumAge: 60000 });
	  } else {
	    Pebble.postMessage({
	      'weather': {
	        'celcius': 999,
	        'fahrenheit': 999,
	        'desc': "Testing"
	      }
	    });
	  }
	});
	
	function request(url, type, callback) {
	  var xhr = new XMLHttpRequest();
	  xhr.onload = function (e) {
	    // HTTP 4xx-5xx are errors:
	    if (xhr.status >= 400 && xhr.status < 600) {
	      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
	      return;
	    }
	    callback(this.responseText);
	  };
	  xhr.open(type, url);
	  xhr.send();
	}


/***/ })
/******/ ]);
//# sourceMappingURL=pebble-js-app.js.map