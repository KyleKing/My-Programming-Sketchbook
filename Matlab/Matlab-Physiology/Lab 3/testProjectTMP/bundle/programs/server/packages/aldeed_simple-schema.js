(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var check = Package.check.check;
var Match = Package.check.Match;
var Random = Package.random.Random;

/* Package-scope variables */
var SimpleSchema, MongoObject, Utility, S, doValidation1, doValidation2, SimpleSchemaValidationContext;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/mongo-object.js                                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
 * @constructor                                                                                                        // 2
 * @param {Object} objOrModifier                                                                                       // 3
 * @param {string[]} blackBoxKeys - A list of the names of keys that shouldn't be traversed                            // 4
 * @returns {undefined}                                                                                                // 5
 *                                                                                                                     // 6
 * Creates a new MongoObject instance. The object passed as the first argument                                         // 7
 * will be modified in place by calls to instance methods. Also, immediately                                           // 8
 * upon creation of the instance, the object will have any `undefined` keys                                            // 9
 * removed recursively.                                                                                                // 10
 */                                                                                                                    // 11
MongoObject = function(objOrModifier, blackBoxKeys) {                                                                  // 12
  var self = this;                                                                                                     // 13
  self._obj = objOrModifier;                                                                                           // 14
  self._affectedKeys = {};                                                                                             // 15
  self._genericAffectedKeys = {};                                                                                      // 16
  self._parentPositions = [];                                                                                          // 17
  self._positionsInsideArrays = [];                                                                                    // 18
  self._objectPositions = [];                                                                                          // 19
                                                                                                                       // 20
  function parseObj(val, currentPosition, affectedKey, operator, adjusted, isWithinArray) {                            // 21
                                                                                                                       // 22
    // Adjust for first-level modifier operators                                                                       // 23
    if (!operator && affectedKey && affectedKey.substring(0, 1) === "$") {                                             // 24
      operator = affectedKey;                                                                                          // 25
      affectedKey = null;                                                                                              // 26
    }                                                                                                                  // 27
                                                                                                                       // 28
    var affectedKeyIsBlackBox = false;                                                                                 // 29
    var affectedKeyGeneric;                                                                                            // 30
    var stop = false;                                                                                                  // 31
    if (affectedKey) {                                                                                                 // 32
                                                                                                                       // 33
      // Adjust for $push and $addToSet and $pull and $pop                                                             // 34
      if (!adjusted) {                                                                                                 // 35
        if (operator === "$push" || operator === "$addToSet" || operator === "$pop") {                                 // 36
          // Adjust for $each                                                                                          // 37
          // We can simply jump forward and pretend like the $each array                                               // 38
          // is the array for the field. This has the added benefit of                                                 // 39
          // skipping past any $slice, which we also don't care about.                                                 // 40
          if (isBasicObject(val) && "$each" in val) {                                                                  // 41
            val = val.$each;                                                                                           // 42
            currentPosition = currentPosition + "[$each]";                                                             // 43
          } else {                                                                                                     // 44
            affectedKey = affectedKey + ".0";                                                                          // 45
          }                                                                                                            // 46
          adjusted = true;                                                                                             // 47
        } else if (operator === "$pull") {                                                                             // 48
          affectedKey = affectedKey + ".0";                                                                            // 49
          if (isBasicObject(val)) {                                                                                    // 50
            stop = true;                                                                                               // 51
          }                                                                                                            // 52
          adjusted = true;                                                                                             // 53
        }                                                                                                              // 54
      }                                                                                                                // 55
                                                                                                                       // 56
      // Make generic key                                                                                              // 57
      affectedKeyGeneric = makeGeneric(affectedKey);                                                                   // 58
                                                                                                                       // 59
      // Determine whether affected key should be treated as a black box                                               // 60
      affectedKeyIsBlackBox = _.contains(blackBoxKeys, affectedKeyGeneric);                                            // 61
                                                                                                                       // 62
      // Mark that this position affects this generic and non-generic key                                              // 63
      if (currentPosition) {                                                                                           // 64
        self._affectedKeys[currentPosition] = affectedKey;                                                             // 65
        self._genericAffectedKeys[currentPosition] = affectedKeyGeneric;                                               // 66
                                                                                                                       // 67
        // If we're within an array, mark this position so we can omit it from flat docs                               // 68
        isWithinArray && self._positionsInsideArrays.push(currentPosition);                                            // 69
      }                                                                                                                // 70
    }                                                                                                                  // 71
                                                                                                                       // 72
    if (stop)                                                                                                          // 73
      return;                                                                                                          // 74
                                                                                                                       // 75
    // Loop through arrays                                                                                             // 76
    if (_.isArray(val) && !_.isEmpty(val)) {                                                                           // 77
      if (currentPosition) {                                                                                           // 78
        // Mark positions with arrays that should be ignored when we want endpoints only                               // 79
        self._parentPositions.push(currentPosition);                                                                   // 80
      }                                                                                                                // 81
                                                                                                                       // 82
      // Loop                                                                                                          // 83
      _.each(val, function(v, i) {                                                                                     // 84
        parseObj(v, (currentPosition ? currentPosition + "[" + i + "]" : i), affectedKey + '.' + i, operator, adjusted, true);
      });                                                                                                              // 86
    }                                                                                                                  // 87
                                                                                                                       // 88
    // Loop through object keys, only for basic objects,                                                               // 89
    // but always for the passed-in object, even if it                                                                 // 90
    // is a custom object.                                                                                             // 91
    else if ((isBasicObject(val) && !affectedKeyIsBlackBox) || !currentPosition) {                                     // 92
      if (currentPosition && !_.isEmpty(val)) {                                                                        // 93
        // Mark positions with objects that should be ignored when we want endpoints only                              // 94
        self._parentPositions.push(currentPosition);                                                                   // 95
        // Mark positions with objects that should be left out of flat docs.                                           // 96
        self._objectPositions.push(currentPosition);                                                                   // 97
      }                                                                                                                // 98
      // Loop                                                                                                          // 99
      _.each(val, function(v, k) {                                                                                     // 100
        if (v === void 0) {                                                                                            // 101
          delete val[k];                                                                                               // 102
        } else if (k !== "$slice") {                                                                                   // 103
          parseObj(v, (currentPosition ? currentPosition + "[" + k + "]" : k), appendAffectedKey(affectedKey, k), operator, adjusted, isWithinArray);
        }                                                                                                              // 105
      });                                                                                                              // 106
    }                                                                                                                  // 107
                                                                                                                       // 108
  }                                                                                                                    // 109
  parseObj(self._obj);                                                                                                 // 110
                                                                                                                       // 111
  function reParseObj() {                                                                                              // 112
    self._affectedKeys = {};                                                                                           // 113
    self._genericAffectedKeys = {};                                                                                    // 114
    self._parentPositions = [];                                                                                        // 115
    self._positionsInsideArrays = [];                                                                                  // 116
    self._objectPositions = [];                                                                                        // 117
    parseObj(self._obj);                                                                                               // 118
  }                                                                                                                    // 119
                                                                                                                       // 120
  /**                                                                                                                  // 121
   * @method MongoObject.forEachNode                                                                                   // 122
   * @param {Function} func                                                                                            // 123
   * @param {Object} [options]                                                                                         // 124
   * @param {Boolean} [options.endPointsOnly=true] - Only call function for endpoints and not for nodes that contain other nodes
   * @returns {undefined}                                                                                              // 126
   *                                                                                                                   // 127
   * Runs a function for each endpoint node in the object tree, including all items in every array.                    // 128
   * The function arguments are                                                                                        // 129
   * (1) the value at this node                                                                                        // 130
   * (2) a string representing the node position                                                                       // 131
   * (3) the representation of what would be changed in mongo, using mongo dot notation                                // 132
   * (4) the generic equivalent of argument 3, with "$" instead of numeric pieces                                      // 133
   */                                                                                                                  // 134
  self.forEachNode = function(func, options) {                                                                         // 135
    if (typeof func !== "function")                                                                                    // 136
      throw new Error("filter requires a loop function");                                                              // 137
                                                                                                                       // 138
    options = _.extend({                                                                                               // 139
      endPointsOnly: true                                                                                              // 140
    }, options);                                                                                                       // 141
                                                                                                                       // 142
    var updatedValues = {};                                                                                            // 143
    _.each(self._affectedKeys, function(affectedKey, position) {                                                       // 144
      if (options.endPointsOnly && _.contains(self._parentPositions, position))                                        // 145
        return; //only endpoints                                                                                       // 146
      func.call({                                                                                                      // 147
        value: self.getValueForPosition(position),                                                                     // 148
        operator: extractOp(position),                                                                                 // 149
        position: position,                                                                                            // 150
        key: affectedKey,                                                                                              // 151
        genericKey: self._genericAffectedKeys[position],                                                               // 152
        updateValue: function(newVal) {                                                                                // 153
          updatedValues[position] = newVal;                                                                            // 154
        },                                                                                                             // 155
        remove: function() {                                                                                           // 156
          updatedValues[position] = void 0;                                                                            // 157
        }                                                                                                              // 158
      });                                                                                                              // 159
    });                                                                                                                // 160
                                                                                                                       // 161
    // Actually update/remove values as instructed                                                                     // 162
    _.each(updatedValues, function(newVal, position) {                                                                 // 163
      self.setValueForPosition(position, newVal);                                                                      // 164
    });                                                                                                                // 165
                                                                                                                       // 166
  };                                                                                                                   // 167
                                                                                                                       // 168
  self.getValueForPosition = function(position) {                                                                      // 169
    var subkey, subkeys = position.split("["), current = self._obj;                                                    // 170
    for (var i = 0, ln = subkeys.length; i < ln; i++) {                                                                // 171
      subkey = subkeys[i];                                                                                             // 172
      // If the subkey ends in "]", remove the ending                                                                  // 173
      if (subkey.slice(-1) === "]") {                                                                                  // 174
        subkey = subkey.slice(0, -1);                                                                                  // 175
      }                                                                                                                // 176
      current = current[subkey];                                                                                       // 177
      if (!_.isArray(current) && !isBasicObject(current) && i < ln - 1) {                                              // 178
        return;                                                                                                        // 179
      }                                                                                                                // 180
    }                                                                                                                  // 181
    return current;                                                                                                    // 182
  };                                                                                                                   // 183
                                                                                                                       // 184
  /**                                                                                                                  // 185
   * @method MongoObject.prototype.setValueForPosition                                                                 // 186
   * @param {String} position                                                                                          // 187
   * @param {Any} value                                                                                                // 188
   * @returns {undefined}                                                                                              // 189
   */                                                                                                                  // 190
  self.setValueForPosition = function(position, value) {                                                               // 191
    var nextPiece, subkey, subkeys = position.split("["), current = self._obj;                                         // 192
                                                                                                                       // 193
    for (var i = 0, ln = subkeys.length; i < ln; i++) {                                                                // 194
      subkey = subkeys[i];                                                                                             // 195
      // If the subkey ends in "]", remove the ending                                                                  // 196
      if (subkey.slice(-1) === "]") {                                                                                  // 197
        subkey = subkey.slice(0, -1);                                                                                  // 198
      }                                                                                                                // 199
      // If we've reached the key in the object tree that needs setting or                                             // 200
      // deleting, do it.                                                                                              // 201
      if (i === ln - 1) {                                                                                              // 202
        current[subkey] = value;                                                                                       // 203
        //if value is undefined, delete the property                                                                   // 204
        if (value === void 0)                                                                                          // 205
          delete current[subkey];                                                                                      // 206
      }                                                                                                                // 207
      // Otherwise attempt to keep moving deeper into the object.                                                      // 208
      else {                                                                                                           // 209
        // If we're setting (as opposed to deleting) a key and we hit a place                                          // 210
        // in the ancestor chain where the keys are not yet created, create them.                                      // 211
        if (current[subkey] === void 0 && value !== void 0) {                                                          // 212
          //see if the next piece is a number                                                                          // 213
          nextPiece = subkeys[i + 1];                                                                                  // 214
          nextPiece = parseInt(nextPiece, 10);                                                                         // 215
          current[subkey] = isNaN(nextPiece) ? {} : [];                                                                // 216
        }                                                                                                              // 217
                                                                                                                       // 218
        // Move deeper into the object                                                                                 // 219
        current = current[subkey];                                                                                     // 220
                                                                                                                       // 221
        // If we can go no further, then quit                                                                          // 222
        if (!_.isArray(current) && !isBasicObject(current) && i < ln - 1) {                                            // 223
          return;                                                                                                      // 224
        }                                                                                                              // 225
      }                                                                                                                // 226
    }                                                                                                                  // 227
                                                                                                                       // 228
    reParseObj();                                                                                                      // 229
  };                                                                                                                   // 230
                                                                                                                       // 231
  /**                                                                                                                  // 232
   * @method MongoObject.prototype.removeValueForPosition                                                              // 233
   * @param {String} position                                                                                          // 234
   * @returns {undefined}                                                                                              // 235
   */                                                                                                                  // 236
  self.removeValueForPosition = function(position) {                                                                   // 237
    self.setValueForPosition(position, void 0);                                                                        // 238
  };                                                                                                                   // 239
                                                                                                                       // 240
  /**                                                                                                                  // 241
   * @method MongoObject.prototype.getKeyForPosition                                                                   // 242
   * @param {String} position                                                                                          // 243
   * @returns {undefined}                                                                                              // 244
   */                                                                                                                  // 245
  self.getKeyForPosition = function(position) {                                                                        // 246
    return self._affectedKeys[position];                                                                               // 247
  };                                                                                                                   // 248
                                                                                                                       // 249
  /**                                                                                                                  // 250
   * @method MongoObject.prototype.getGenericKeyForPosition                                                            // 251
   * @param {String} position                                                                                          // 252
   * @returns {undefined}                                                                                              // 253
   */                                                                                                                  // 254
  self.getGenericKeyForPosition = function(position) {                                                                 // 255
    return self._genericAffectedKeys[position];                                                                        // 256
  };                                                                                                                   // 257
                                                                                                                       // 258
  /**                                                                                                                  // 259
   * @method MongoObject.getInfoForKey                                                                                 // 260
   * @param {String} key - Non-generic key                                                                             // 261
   * @returns {undefined|Object}                                                                                       // 262
   *                                                                                                                   // 263
   * Returns the value and operator of the requested non-generic key.                                                  // 264
   * Example: {value: 1, operator: "$pull"}                                                                            // 265
   */                                                                                                                  // 266
  self.getInfoForKey = function(key) {                                                                                 // 267
    // Get the info                                                                                                    // 268
    var position = self.getPositionForKey(key);                                                                        // 269
    if (position) {                                                                                                    // 270
      return {                                                                                                         // 271
        value: self.getValueForPosition(position),                                                                     // 272
        operator: extractOp(position)                                                                                  // 273
      };                                                                                                               // 274
    }                                                                                                                  // 275
                                                                                                                       // 276
    // If we haven't returned yet, check to see if there is an array value                                             // 277
    // corresponding to this key                                                                                       // 278
    // We find the first item within the array, strip the last piece off the                                           // 279
    // position string, and then return whatever is at that new position in                                            // 280
    // the original object.                                                                                            // 281
    var positions = self.getPositionsForGenericKey(key + ".$"), p, v;                                                  // 282
    for (var i = 0, ln = positions.length; i < ln; i++) {                                                              // 283
      p = positions[i];                                                                                                // 284
      v = self.getValueForPosition(p) || self.getValueForPosition(p.slice(0, p.lastIndexOf("[")));                     // 285
      if (v) {                                                                                                         // 286
        return {                                                                                                       // 287
          value: v,                                                                                                    // 288
          operator: extractOp(p)                                                                                       // 289
        };                                                                                                             // 290
      }                                                                                                                // 291
    }                                                                                                                  // 292
  };                                                                                                                   // 293
                                                                                                                       // 294
  /**                                                                                                                  // 295
   * @method MongoObject.getPositionForKey                                                                             // 296
   * @param {String} key - Non-generic key                                                                             // 297
   * @returns {undefined|String} Position string                                                                       // 298
   *                                                                                                                   // 299
   * Returns the position string for the place in the object that                                                      // 300
   * affects the requested non-generic key.                                                                            // 301
   * Example: 'foo[bar][0]'                                                                                            // 302
   */                                                                                                                  // 303
  self.getPositionForKey = function(key) {                                                                             // 304
    // Get the info                                                                                                    // 305
    for (var position in self._affectedKeys) {                                                                         // 306
      if (self._affectedKeys.hasOwnProperty(position)) {                                                               // 307
        if (self._affectedKeys[position] === key) {                                                                    // 308
          // We return the first one we find. While it's                                                               // 309
          // possible that multiple update operators could                                                             // 310
          // affect the same non-generic key, we'll assume that's not the case.                                        // 311
          return position;                                                                                             // 312
        }                                                                                                              // 313
      }                                                                                                                // 314
    }                                                                                                                  // 315
                                                                                                                       // 316
    // If we haven't returned yet, we need to check for affected keys                                                  // 317
  };                                                                                                                   // 318
                                                                                                                       // 319
  /**                                                                                                                  // 320
   * @method MongoObject.getPositionsForGenericKey                                                                     // 321
   * @param {String} key - Generic key                                                                                 // 322
   * @returns {String[]} Array of position strings                                                                     // 323
   *                                                                                                                   // 324
   * Returns an array of position strings for the places in the object that                                            // 325
   * affect the requested generic key.                                                                                 // 326
   * Example: ['foo[bar][0]']                                                                                          // 327
   */                                                                                                                  // 328
  self.getPositionsForGenericKey = function(key) {                                                                     // 329
    // Get the info                                                                                                    // 330
    var list = [];                                                                                                     // 331
    for (var position in self._genericAffectedKeys) {                                                                  // 332
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 333
        if (self._genericAffectedKeys[position] === key) {                                                             // 334
          list.push(position);                                                                                         // 335
        }                                                                                                              // 336
      }                                                                                                                // 337
    }                                                                                                                  // 338
                                                                                                                       // 339
    return list;                                                                                                       // 340
  };                                                                                                                   // 341
                                                                                                                       // 342
  /**                                                                                                                  // 343
   * @deprecated Use getInfoForKey                                                                                     // 344
   * @method MongoObject.getValueForKey                                                                                // 345
   * @param {String} key - Non-generic key                                                                             // 346
   * @returns {undefined|Any}                                                                                          // 347
   *                                                                                                                   // 348
   * Returns the value of the requested non-generic key                                                                // 349
   */                                                                                                                  // 350
  self.getValueForKey = function(key) {                                                                                // 351
    var position = self.getPositionForKey(key);                                                                        // 352
    if (position) {                                                                                                    // 353
      return self.getValueForPosition(position);                                                                       // 354
    }                                                                                                                  // 355
  };                                                                                                                   // 356
                                                                                                                       // 357
  /**                                                                                                                  // 358
   * @method MongoObject.prototype.addKey                                                                              // 359
   * @param {String} key - Key to set                                                                                  // 360
   * @param {Any} val - Value to give this key                                                                         // 361
   * @param {String} op - Operator under which to set it, or `null` for a non-modifier object                          // 362
   * @returns {undefined}                                                                                              // 363
   *                                                                                                                   // 364
   * Adds `key` with value `val` under operator `op` to the source object.                                             // 365
   */                                                                                                                  // 366
  self.addKey = function(key, val, op) {                                                                               // 367
    var position = op ? op + "[" + key + "]" : MongoObject._keyToPosition(key);                                        // 368
    self.setValueForPosition(position, val);                                                                           // 369
  };                                                                                                                   // 370
                                                                                                                       // 371
  /**                                                                                                                  // 372
   * @method MongoObject.prototype.removeGenericKeys                                                                   // 373
   * @param {String[]} keys                                                                                            // 374
   * @returns {undefined}                                                                                              // 375
   *                                                                                                                   // 376
   * Removes anything that affects any of the generic keys in the list                                                 // 377
   */                                                                                                                  // 378
  self.removeGenericKeys = function(keys) {                                                                            // 379
    for (var position in self._genericAffectedKeys) {                                                                  // 380
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 381
        if (_.contains(keys, self._genericAffectedKeys[position])) {                                                   // 382
          self.removeValueForPosition(position);                                                                       // 383
        }                                                                                                              // 384
      }                                                                                                                // 385
    }                                                                                                                  // 386
  };                                                                                                                   // 387
                                                                                                                       // 388
  /**                                                                                                                  // 389
   * @method MongoObject.removeGenericKey                                                                              // 390
   * @param {String} key                                                                                               // 391
   * @returns {undefined}                                                                                              // 392
   *                                                                                                                   // 393
   * Removes anything that affects the requested generic key                                                           // 394
   */                                                                                                                  // 395
  self.removeGenericKey = function(key) {                                                                              // 396
    for (var position in self._genericAffectedKeys) {                                                                  // 397
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 398
        if (self._genericAffectedKeys[position] === key) {                                                             // 399
          self.removeValueForPosition(position);                                                                       // 400
        }                                                                                                              // 401
      }                                                                                                                // 402
    }                                                                                                                  // 403
  };                                                                                                                   // 404
                                                                                                                       // 405
  /**                                                                                                                  // 406
   * @method MongoObject.removeKey                                                                                     // 407
   * @param {String} key                                                                                               // 408
   * @returns {undefined}                                                                                              // 409
   *                                                                                                                   // 410
   * Removes anything that affects the requested non-generic key                                                       // 411
   */                                                                                                                  // 412
  self.removeKey = function(key) {                                                                                     // 413
    // We don't use getPositionForKey here because we want to be sure to                                               // 414
    // remove for all positions if there are multiple.                                                                 // 415
    for (var position in self._affectedKeys) {                                                                         // 416
      if (self._affectedKeys.hasOwnProperty(position)) {                                                               // 417
        if (self._affectedKeys[position] === key) {                                                                    // 418
          self.removeValueForPosition(position);                                                                       // 419
        }                                                                                                              // 420
      }                                                                                                                // 421
    }                                                                                                                  // 422
  };                                                                                                                   // 423
                                                                                                                       // 424
  /**                                                                                                                  // 425
   * @method MongoObject.removeKeys                                                                                    // 426
   * @param {String[]} keys                                                                                            // 427
   * @returns {undefined}                                                                                              // 428
   *                                                                                                                   // 429
   * Removes anything that affects any of the non-generic keys in the list                                             // 430
   */                                                                                                                  // 431
  self.removeKeys = function(keys) {                                                                                   // 432
    for (var i = 0, ln = keys.length; i < ln; i++) {                                                                   // 433
      self.removeKey(keys[i]);                                                                                         // 434
    }                                                                                                                  // 435
  };                                                                                                                   // 436
                                                                                                                       // 437
  /**                                                                                                                  // 438
   * @method MongoObject.filterGenericKeys                                                                             // 439
   * @param {Function} test - Test function                                                                            // 440
   * @returns {undefined}                                                                                              // 441
   *                                                                                                                   // 442
   * Passes all affected keys to a test function, which                                                                // 443
   * should return false to remove whatever is affecting that key                                                      // 444
   */                                                                                                                  // 445
  self.filterGenericKeys = function(test) {                                                                            // 446
    var gk, checkedKeys = [], keysToRemove = [];                                                                       // 447
    for (var position in self._genericAffectedKeys) {                                                                  // 448
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 449
        gk = self._genericAffectedKeys[position];                                                                      // 450
        if (!_.contains(checkedKeys, gk)) {                                                                            // 451
          checkedKeys.push(gk);                                                                                        // 452
          if (gk && !test(gk)) {                                                                                       // 453
            keysToRemove.push(gk);                                                                                     // 454
          }                                                                                                            // 455
        }                                                                                                              // 456
      }                                                                                                                // 457
    }                                                                                                                  // 458
                                                                                                                       // 459
    _.each(keysToRemove, function(key) {                                                                               // 460
      self.removeGenericKey(key);                                                                                      // 461
    });                                                                                                                // 462
  };                                                                                                                   // 463
                                                                                                                       // 464
  /**                                                                                                                  // 465
   * @method MongoObject.setValueForKey                                                                                // 466
   * @param {String} key                                                                                               // 467
   * @param {Any} val                                                                                                  // 468
   * @returns {undefined}                                                                                              // 469
   *                                                                                                                   // 470
   * Sets the value for every place in the object that affects                                                         // 471
   * the requested non-generic key                                                                                     // 472
   */                                                                                                                  // 473
  self.setValueForKey = function(key, val) {                                                                           // 474
    // We don't use getPositionForKey here because we want to be sure to                                               // 475
    // set the value for all positions if there are multiple.                                                          // 476
    for (var position in self._affectedKeys) {                                                                         // 477
      if (self._affectedKeys.hasOwnProperty(position)) {                                                               // 478
        if (self._affectedKeys[position] === key) {                                                                    // 479
          self.setValueForPosition(position, val);                                                                     // 480
        }                                                                                                              // 481
      }                                                                                                                // 482
    }                                                                                                                  // 483
  };                                                                                                                   // 484
                                                                                                                       // 485
  /**                                                                                                                  // 486
   * @method MongoObject.setValueForGenericKey                                                                         // 487
   * @param {String} key                                                                                               // 488
   * @param {Any} val                                                                                                  // 489
   * @returns {undefined}                                                                                              // 490
   *                                                                                                                   // 491
   * Sets the value for every place in the object that affects                                                         // 492
   * the requested generic key                                                                                         // 493
   */                                                                                                                  // 494
  self.setValueForGenericKey = function(key, val) {                                                                    // 495
    // We don't use getPositionForKey here because we want to be sure to                                               // 496
    // set the value for all positions if there are multiple.                                                          // 497
    for (var position in self._genericAffectedKeys) {                                                                  // 498
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 499
        if (self._genericAffectedKeys[position] === key) {                                                             // 500
          self.setValueForPosition(position, val);                                                                     // 501
        }                                                                                                              // 502
      }                                                                                                                // 503
    }                                                                                                                  // 504
  };                                                                                                                   // 505
                                                                                                                       // 506
  /**                                                                                                                  // 507
   * @method MongoObject.getObject                                                                                     // 508
   * @returns {Object}                                                                                                 // 509
   *                                                                                                                   // 510
   * Get the source object, potentially modified by other method calls on this                                         // 511
   * MongoObject instance.                                                                                             // 512
   */                                                                                                                  // 513
  self.getObject = function() {                                                                                        // 514
    return self._obj;                                                                                                  // 515
  };                                                                                                                   // 516
                                                                                                                       // 517
  /**                                                                                                                  // 518
   * @method MongoObject.getFlatObject                                                                                 // 519
   * @returns {Object}                                                                                                 // 520
   *                                                                                                                   // 521
   * Gets a flat object based on the MongoObject instance.                                                             // 522
   * In a flat object, the key is the name of the non-generic affectedKey,                                             // 523
   * with mongo dot notation if necessary, and the value is the value for                                              // 524
   * that key.                                                                                                         // 525
   *                                                                                                                   // 526
   * With `keepArrays: true`, we don't flatten within arrays. Currently                                                // 527
   * MongoDB does not see a key such as `a.0.b` and automatically assume                                               // 528
   * an array. Instead it would create an object with key "0" if there                                                 // 529
   * wasn't already an array saved as the value of `a`, which is rarely                                                // 530
   * if ever what we actually want. To avoid this confusion, we                                                        // 531
   * set entire arrays.                                                                                                // 532
   */                                                                                                                  // 533
  self.getFlatObject = function(options) {                                                                             // 534
    options = options || {};                                                                                           // 535
    var newObj = {};                                                                                                   // 536
    _.each(self._affectedKeys, function(affectedKey, position) {                                                       // 537
      if (typeof affectedKey === "string" &&                                                                           // 538
        (options.keepArrays === true && !_.contains(self._positionsInsideArrays, position) && !_.contains(self._objectPositions, position)) ||
        (!options.keepArrays && !_.contains(self._parentPositions, position))                                          // 540
        ) {                                                                                                            // 541
        newObj[affectedKey] = self.getValueForPosition(position);                                                      // 542
      }                                                                                                                // 543
    });                                                                                                                // 544
    return newObj;                                                                                                     // 545
  };                                                                                                                   // 546
                                                                                                                       // 547
  /**                                                                                                                  // 548
   * @method MongoObject.affectsKey                                                                                    // 549
   * @param {String} key                                                                                               // 550
   * @returns {Object}                                                                                                 // 551
   *                                                                                                                   // 552
   * Returns true if the non-generic key is affected by this object                                                    // 553
   */                                                                                                                  // 554
  self.affectsKey = function(key) {                                                                                    // 555
    return !!self.getPositionForKey(key);                                                                              // 556
  };                                                                                                                   // 557
                                                                                                                       // 558
  /**                                                                                                                  // 559
   * @method MongoObject.affectsGenericKey                                                                             // 560
   * @param {String} key                                                                                               // 561
   * @returns {Object}                                                                                                 // 562
   *                                                                                                                   // 563
   * Returns true if the generic key is affected by this object                                                        // 564
   */                                                                                                                  // 565
  self.affectsGenericKey = function(key) {                                                                             // 566
    for (var position in self._genericAffectedKeys) {                                                                  // 567
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 568
        if (self._genericAffectedKeys[position] === key) {                                                             // 569
          return true;                                                                                                 // 570
        }                                                                                                              // 571
      }                                                                                                                // 572
    }                                                                                                                  // 573
    return false;                                                                                                      // 574
  };                                                                                                                   // 575
                                                                                                                       // 576
  /**                                                                                                                  // 577
   * @method MongoObject.affectsGenericKeyImplicit                                                                     // 578
   * @param {String} key                                                                                               // 579
   * @returns {Object}                                                                                                 // 580
   *                                                                                                                   // 581
   * Like affectsGenericKey, but will return true if a child key is affected                                           // 582
   */                                                                                                                  // 583
  self.affectsGenericKeyImplicit = function(key) {                                                                     // 584
    for (var position in self._genericAffectedKeys) {                                                                  // 585
      if (self._genericAffectedKeys.hasOwnProperty(position)) {                                                        // 586
        var affectedKey = self._genericAffectedKeys[position];                                                         // 587
                                                                                                                       // 588
        // If the affected key is the test key                                                                         // 589
        if (affectedKey === key) {                                                                                     // 590
          return true;                                                                                                 // 591
        }                                                                                                              // 592
                                                                                                                       // 593
        // If the affected key implies the test key because the affected key                                           // 594
        // starts with the test key followed by a period                                                               // 595
        if (affectedKey.substring(0, key.length + 1) === key + ".") {                                                  // 596
          return true;                                                                                                 // 597
        }                                                                                                              // 598
                                                                                                                       // 599
        // If the affected key implies the test key because the affected key                                           // 600
        // starts with the test key and the test key ends with ".$"                                                    // 601
        var lastTwo = key.slice(-2);                                                                                   // 602
        if (lastTwo === ".$" && key.slice(0, -2) === affectedKey) {                                                    // 603
          return true;                                                                                                 // 604
        }                                                                                                              // 605
      }                                                                                                                // 606
    }                                                                                                                  // 607
    return false;                                                                                                      // 608
  };                                                                                                                   // 609
};                                                                                                                     // 610
                                                                                                                       // 611
/** Takes a string representation of an object key and its value                                                       // 612
 *  and updates "obj" to contain that key with that value.                                                             // 613
 *                                                                                                                     // 614
 *  Example keys and results if val is 1:                                                                              // 615
 *    "a" -> {a: 1}                                                                                                    // 616
 *    "a[b]" -> {a: {b: 1}}                                                                                            // 617
 *    "a[b][0]" -> {a: {b: [1]}}                                                                                       // 618
 *    "a[b.0.c]" -> {a: {'b.0.c': 1}}                                                                                  // 619
 */                                                                                                                    // 620
                                                                                                                       // 621
/** Takes a string representation of an object key and its value                                                       // 622
 *  and updates "obj" to contain that key with that value.                                                             // 623
 *                                                                                                                     // 624
 *  Example keys and results if val is 1:                                                                              // 625
 *    "a" -> {a: 1}                                                                                                    // 626
 *    "a[b]" -> {a: {b: 1}}                                                                                            // 627
 *    "a[b][0]" -> {a: {b: [1]}}                                                                                       // 628
 *    "a[b.0.c]" -> {a: {'b.0.c': 1}}                                                                                  // 629
 *                                                                                                                     // 630
 * @param {any} val                                                                                                    // 631
 * @param {String} key                                                                                                 // 632
 * @param {Object} obj                                                                                                 // 633
 * @returns {undefined}                                                                                                // 634
 */                                                                                                                    // 635
MongoObject.expandKey = function(val, key, obj) {                                                                      // 636
  var nextPiece, subkey, subkeys = key.split("["), current = obj;                                                      // 637
  for (var i = 0, ln = subkeys.length; i < ln; i++) {                                                                  // 638
    subkey = subkeys[i];                                                                                               // 639
    if (subkey.slice(-1) === "]") {                                                                                    // 640
      subkey = subkey.slice(0, -1);                                                                                    // 641
    }                                                                                                                  // 642
    if (i === ln - 1) {                                                                                                // 643
      //last iteration; time to set the value; always overwrite                                                        // 644
      current[subkey] = val;                                                                                           // 645
      //if val is undefined, delete the property                                                                       // 646
      if (val === void 0)                                                                                              // 647
        delete current[subkey];                                                                                        // 648
    } else {                                                                                                           // 649
      //see if the next piece is a number                                                                              // 650
      nextPiece = subkeys[i + 1];                                                                                      // 651
      nextPiece = parseInt(nextPiece, 10);                                                                             // 652
      if (!current[subkey]) {                                                                                          // 653
        current[subkey] = isNaN(nextPiece) ? {} : [];                                                                  // 654
      }                                                                                                                // 655
    }                                                                                                                  // 656
    current = current[subkey];                                                                                         // 657
  }                                                                                                                    // 658
};                                                                                                                     // 659
                                                                                                                       // 660
MongoObject._keyToPosition = function keyToPosition(key, wrapAll) {                                                    // 661
  var position = '';                                                                                                   // 662
  _.each(key.split("."), function (piece, i) {                                                                         // 663
    if (i === 0 && !wrapAll) {                                                                                         // 664
      position += piece;                                                                                               // 665
    } else {                                                                                                           // 666
      position += "[" + piece + "]";                                                                                   // 667
    }                                                                                                                  // 668
  });                                                                                                                  // 669
  return position;                                                                                                     // 670
};                                                                                                                     // 671
                                                                                                                       // 672
/**                                                                                                                    // 673
 * @method MongoObject._positionToKey                                                                                  // 674
 * @param {String} position                                                                                            // 675
 * @returns {String} The key that this position in an object would affect.                                             // 676
 *                                                                                                                     // 677
 * This is different from MongoObject.prototype.getKeyForPosition in that                                              // 678
 * this method does not depend on the requested position actually being                                                // 679
 * present in any particular MongoObject.                                                                              // 680
 */                                                                                                                    // 681
MongoObject._positionToKey = function positionToKey(position) {                                                        // 682
  //XXX Probably a better way to do this, but this is                                                                  // 683
  //foolproof for now.                                                                                                 // 684
  var mDoc = new MongoObject({});                                                                                      // 685
  mDoc.setValueForPosition(position, 1); //value doesn't matter                                                        // 686
  var key = mDoc.getKeyForPosition(position);                                                                          // 687
  mDoc = null;                                                                                                         // 688
  return key;                                                                                                          // 689
};                                                                                                                     // 690
                                                                                                                       // 691
var isArray = _.isArray;                                                                                               // 692
                                                                                                                       // 693
var isObject = function(obj) {                                                                                         // 694
  return obj === Object(obj);                                                                                          // 695
};                                                                                                                     // 696
                                                                                                                       // 697
// getPrototypeOf polyfill                                                                                             // 698
if (typeof Object.getPrototypeOf !== "function") {                                                                     // 699
  if (typeof "".__proto__ === "object") {                                                                              // 700
    Object.getPrototypeOf = function(object) {                                                                         // 701
      return object.__proto__;                                                                                         // 702
    };                                                                                                                 // 703
  } else {                                                                                                             // 704
    Object.getPrototypeOf = function(object) {                                                                         // 705
      // May break if the constructor has been tampered with                                                           // 706
      return object.constructor.prototype;                                                                             // 707
    };                                                                                                                 // 708
  }                                                                                                                    // 709
}                                                                                                                      // 710
                                                                                                                       // 711
/* Tests whether "obj" is an Object as opposed to                                                                      // 712
 * something that inherits from Object                                                                                 // 713
 *                                                                                                                     // 714
 * @param {any} obj                                                                                                    // 715
 * @returns {Boolean}                                                                                                  // 716
 */                                                                                                                    // 717
var isBasicObject = function(obj) {                                                                                    // 718
  return isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;                                             // 719
};                                                                                                                     // 720
                                                                                                                       // 721
/* Takes a specific string that uses mongo-style dot notation                                                          // 722
 * and returns a generic string equivalent. Replaces all numeric                                                       // 723
 * "pieces" with a dollar sign ($).                                                                                    // 724
 *                                                                                                                     // 725
 * @param {type} name                                                                                                  // 726
 * @returns {unresolved}                                                                                               // 727
 */                                                                                                                    // 728
var makeGeneric = function makeGeneric(name) {                                                                         // 729
  if (typeof name !== "string")                                                                                        // 730
    return null;                                                                                                       // 731
  return name.replace(/\.[0-9]+\./g, '.$.').replace(/\.[0-9]+/g, '.$');                                                // 732
};                                                                                                                     // 733
                                                                                                                       // 734
var appendAffectedKey = function appendAffectedKey(affectedKey, key) {                                                 // 735
  if (key === "$each") {                                                                                               // 736
    return affectedKey;                                                                                                // 737
  } else {                                                                                                             // 738
    return (affectedKey ? affectedKey + "." + key : key);                                                              // 739
  }                                                                                                                    // 740
};                                                                                                                     // 741
                                                                                                                       // 742
// Extracts operator piece, if present, from position string                                                           // 743
var extractOp = function extractOp(position) {                                                                         // 744
  var firstPositionPiece = position.slice(0, position.indexOf("["));                                                   // 745
  return (firstPositionPiece.substring(0, 1) === "$") ? firstPositionPiece : null;                                     // 746
};                                                                                                                     // 747
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/simple-schema-utility.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
Utility = {                                                                                                            // 1
  appendAffectedKey: function appendAffectedKey(affectedKey, key) {                                                    // 2
    if (key === "$each") {                                                                                             // 3
      return affectedKey;                                                                                              // 4
    } else {                                                                                                           // 5
      return (affectedKey ? affectedKey + "." + key : key);                                                            // 6
    }                                                                                                                  // 7
  },                                                                                                                   // 8
  shouldCheck: function shouldCheck(key) {                                                                             // 9
    if (key === "$pushAll") {                                                                                          // 10
      throw new Error("$pushAll is not supported; use $push + $each");                                                 // 11
    }                                                                                                                  // 12
    return !_.contains(["$pull", "$pullAll", "$pop", "$slice"], key);                                                  // 13
  },                                                                                                                   // 14
  errorObject: function errorObject(errorType, keyName, keyValue, def, ss) {                                           // 15
    return {name: keyName, type: errorType, value: keyValue};                                                          // 16
  },                                                                                                                   // 17
  // Tests whether it's an Object as opposed to something that inherits from Object                                    // 18
  isBasicObject: function isBasicObject(obj) {                                                                         // 19
    return _.isObject(obj) && Object.getPrototypeOf(obj) === Object.prototype;                                         // 20
  },                                                                                                                   // 21
  // The latest Safari returns false for Uint8Array, etc. instanceof Function                                          // 22
  // unlike other browsers.                                                                                            // 23
  safariBugFix: function safariBugFix(type) {                                                                          // 24
    return (typeof Uint8Array !== "undefined" && type === Uint8Array)                                                  // 25
    || (typeof Uint16Array !== "undefined" && type === Uint16Array)                                                    // 26
    || (typeof Uint32Array !== "undefined" && type === Uint32Array)                                                    // 27
    || (typeof Uint8ClampedArray !== "undefined" && type === Uint8ClampedArray);                                       // 28
  },                                                                                                                   // 29
  isNotNullOrUndefined: function isNotNullOrUndefined(val) {                                                           // 30
    return val !== void 0 && val !== null;                                                                             // 31
  },                                                                                                                   // 32
  // Extracts operator piece, if present, from position string                                                         // 33
  extractOp: function extractOp(position) {                                                                            // 34
    var firstPositionPiece = position.slice(0, position.indexOf("["));                                                 // 35
    return (firstPositionPiece.substring(0, 1) === "$") ? firstPositionPiece : null;                                   // 36
  },                                                                                                                   // 37
  deleteIfPresent: function deleteIfPresent(obj, key) {                                                                // 38
    if (key in obj) {                                                                                                  // 39
      delete obj[key];                                                                                                 // 40
    }                                                                                                                  // 41
  },                                                                                                                   // 42
  looksLikeModifier: function looksLikeModifier(obj) {                                                                 // 43
    for (var key in obj) {                                                                                             // 44
      if (obj.hasOwnProperty(key) && key.substring(0, 1) === "$") {                                                    // 45
        return true;                                                                                                   // 46
      }                                                                                                                // 47
    }                                                                                                                  // 48
    return false;                                                                                                      // 49
  },                                                                                                                   // 50
  dateToDateString: function dateToDateString(date) {                                                                  // 51
    var m = (date.getUTCMonth() + 1);                                                                                  // 52
    if (m < 10) {                                                                                                      // 53
      m = "0" + m;                                                                                                     // 54
    }                                                                                                                  // 55
    var d = date.getUTCDate();                                                                                         // 56
    if (d < 10) {                                                                                                      // 57
      d = "0" + d;                                                                                                     // 58
    }                                                                                                                  // 59
    return date.getUTCFullYear() + '-' + m + '-' + d;                                                                  // 60
  }                                                                                                                    // 61
};                                                                                                                     // 62
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/simple-schema.js                                                                      //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
if (Meteor.isServer) {                                                                                                 // 1
  S = Npm.require("string");                                                                                           // 2
}                                                                                                                      // 3
if (Meteor.isClient) {                                                                                                 // 4
  S = window.S;                                                                                                        // 5
}                                                                                                                      // 6
                                                                                                                       // 7
var schemaDefinition = {                                                                                               // 8
  type: Match.Any,                                                                                                     // 9
  label: Match.Optional(Match.OneOf(String, Function)),                                                                // 10
  optional: Match.Optional(Match.OneOf(Boolean, Function)),                                                            // 11
  min: Match.Optional(Match.OneOf(Number, Date, Function)),                                                            // 12
  max: Match.Optional(Match.OneOf(Number, Date, Function)),                                                            // 13
  minCount: Match.Optional(Match.OneOf(Number, Function)),                                                             // 14
  maxCount: Match.Optional(Match.OneOf(Number, Function)),                                                             // 15
  allowedValues: Match.Optional(Match.OneOf([Match.Any], Function)),                                                   // 16
  decimal: Match.Optional(Boolean),                                                                                    // 17
  regEx: Match.Optional(Match.OneOf(RegExp, [RegExp])),                                                                // 18
  custom: Match.Optional(Function),                                                                                    // 19
  blackbox: Match.Optional(Boolean),                                                                                   // 20
  autoValue: Match.Optional(Function),                                                                                 // 21
  defaultValue: Match.Optional(Match.Any),                                                                             // 22
  trim: Match.Optional(Boolean)                                                                                        // 23
};                                                                                                                     // 24
                                                                                                                       // 25
//exported                                                                                                             // 26
SimpleSchema = function(schemas, options) {                                                                            // 27
  var self = this;                                                                                                     // 28
  var firstLevelSchemaKeys = [];                                                                                       // 29
  var fieldNameRoot;                                                                                                   // 30
  options = options || {};                                                                                             // 31
  schemas = schemas || {};                                                                                             // 32
                                                                                                                       // 33
  if (!_.isArray(schemas)) {                                                                                           // 34
    schemas = [schemas];                                                                                               // 35
  }                                                                                                                    // 36
                                                                                                                       // 37
  // adjust and store a copy of the schema definitions                                                                 // 38
  self._schema = mergeSchemas(schemas);                                                                                // 39
                                                                                                                       // 40
  // store the list of defined keys for speedier checking                                                              // 41
  self._schemaKeys = [];                                                                                               // 42
                                                                                                                       // 43
  // store autoValue functions by key                                                                                  // 44
  self._autoValues = {};                                                                                               // 45
                                                                                                                       // 46
  // store the list of blackbox keys for passing to MongoObject constructor                                            // 47
  self._blackboxKeys = [];                                                                                             // 48
                                                                                                                       // 49
  // a place to store custom validators for this instance                                                              // 50
  self._validators = [];                                                                                               // 51
                                                                                                                       // 52
  // a place to store custom error messages for this schema                                                            // 53
  self._messages = {};                                                                                                 // 54
                                                                                                                       // 55
  self._depsMessages = new Deps.Dependency;                                                                            // 56
  self._depsLabels = {};                                                                                               // 57
                                                                                                                       // 58
  _.each(self._schema, function(definition, fieldName) {                                                               // 59
    // Validate the field definition                                                                                   // 60
    if (!Match.test(definition, schemaDefinition)) {                                                                   // 61
      throw new Error('Invalid definition for ' + fieldName + ' field.');                                              // 62
    }                                                                                                                  // 63
                                                                                                                       // 64
    fieldNameRoot = fieldName.split(".")[0];                                                                           // 65
                                                                                                                       // 66
    self._schemaKeys.push(fieldName);                                                                                  // 67
                                                                                                                       // 68
    // We support defaultValue shortcut by converting it immediately into an                                           // 69
    // autoValue.                                                                                                      // 70
    if ('defaultValue' in definition) {                                                                                // 71
      if ('autoValue' in definition) {                                                                                 // 72
        console.warn('SimpleSchema: Found both autoValue and defaultValue options for "' + fieldName + '". Ignoring defaultValue.');
      } else {                                                                                                         // 74
        if (fieldName.slice(-2) === ".$") {                                                                            // 75
          throw new Error('An array item field (one that ends with ".$") cannot have defaultValue.')                   // 76
        }                                                                                                              // 77
        self._autoValues[fieldName] = (function defineAutoValue(v) {                                                   // 78
          return function() {                                                                                          // 79
            if (this.operator === null && !this.isSet) {                                                               // 80
              return v;                                                                                                // 81
            }                                                                                                          // 82
          };                                                                                                           // 83
        })(definition.defaultValue);                                                                                   // 84
      }                                                                                                                // 85
    }                                                                                                                  // 86
                                                                                                                       // 87
    if ('autoValue' in definition) {                                                                                   // 88
      if (fieldName.slice(-2) === ".$") {                                                                              // 89
        throw new Error('An array item field (one that ends with ".$") cannot have autoValue.')                        // 90
      }                                                                                                                // 91
      self._autoValues[fieldName] = definition.autoValue;                                                              // 92
    }                                                                                                                  // 93
                                                                                                                       // 94
    self._depsLabels[fieldName] = new Deps.Dependency;                                                                 // 95
                                                                                                                       // 96
    if (definition.blackbox === true) {                                                                                // 97
      self._blackboxKeys.push(fieldName);                                                                              // 98
    }                                                                                                                  // 99
                                                                                                                       // 100
    if (!_.contains(firstLevelSchemaKeys, fieldNameRoot)) {                                                            // 101
      firstLevelSchemaKeys.push(fieldNameRoot);                                                                        // 102
    }                                                                                                                  // 103
  });                                                                                                                  // 104
                                                                                                                       // 105
                                                                                                                       // 106
  // Cache these lists                                                                                                 // 107
  self._firstLevelSchemaKeys = firstLevelSchemaKeys;                                                                   // 108
  self._objectKeys = getObjectKeys(self._schema, self._schemaKeys);                                                    // 109
                                                                                                                       // 110
  // We will store named validation contexts here                                                                      // 111
  self._validationContexts = {};                                                                                       // 112
};                                                                                                                     // 113
                                                                                                                       // 114
// This allows other packages or users to extend the schema                                                            // 115
// definition options that are supported.                                                                              // 116
SimpleSchema.extendOptions = function(options) {                                                                       // 117
  _.extend(schemaDefinition, options);                                                                                 // 118
};                                                                                                                     // 119
                                                                                                                       // 120
// this domain regex matches all domains that have at least one .                                                      // 121
// sadly IPv4 Adresses will be caught too but technically those are valid domains                                      // 122
// this expression is extracted from the original RFC 5322 mail expression                                             // 123
// a modification enforces that the tld consists only of characters                                                    // 124
var RX_DOMAIN = '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z](?:[a-z-]*[a-z])?';                                       // 125
// this domain regex matches everythign that could be a domain in intranet                                             // 126
// that means "localhost" is a valid domain                                                                            // 127
var RX_NAME_DOMAIN = '(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\\.|$))+';                                                  // 128
// strict IPv4 expression which allows 0-255 per oktett                                                                // 129
var RX_IPv4 = '(?:(?:[0-1]?\\d{1,2}|2[0-4]\\d|25[0-5])(?:\\.|$)){4}';                                                  // 130
// strict IPv6 expression which allows (and validates) all shortcuts                                                   // 131
var RX_IPv6 = '(?:(?:[\\dA-Fa-f]{1,4}(?::|$)){8}' // full adress                                                       // 132
  + '|(?=(?:[^:\\s]|:[^:\\s])*::(?:[^:\\s]|:[^:\\s])*$)' // or min/max one '::'                                        // 133
  + '[\\dA-Fa-f]{0,4}(?:::?(?:[\\dA-Fa-f]{1,4}|$)){1,6})'; // and short adress                                         // 134
// this allows domains (also localhost etc) and ip adresses                                                            // 135
var RX_WEAK_DOMAIN = '(?:' + [RX_NAME_DOMAIN,RX_IPv4,RX_IPv6].join('|') + ')';                                         // 136
                                                                                                                       // 137
SimpleSchema.RegEx = {                                                                                                 // 138
  // We use the RegExp suggested by W3C in http://www.w3.org/TR/html5/forms.html#valid-e-mail-address                  // 139
  // This is probably the same logic used by most browsers when type=email, which is our goal. It is                   // 140
  // a very permissive expression. Some apps may wish to be more strict and can write their own RegExp.                // 141
  Email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                                                                                                       // 143
  Domain: new RegExp('^' + RX_DOMAIN + '$'),                                                                           // 144
  WeakDomain: new RegExp('^' + RX_WEAK_DOMAIN + '$'),                                                                  // 145
                                                                                                                       // 146
  IP: new RegExp('^(?:' + RX_IPv4 + '|' + RX_IPv6 + ')$'),                                                             // 147
  IPv4: new RegExp('^' + RX_IPv4 + '$'),                                                                               // 148
  IPv6: new RegExp('^' + RX_IPv6 + '$'),                                                                               // 149
  // URL RegEx from https://gist.github.com/dperini/729294                                                             // 150
  // http://mathiasbynens.be/demo/url-regex                                                                            // 151
  Url: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i,
  // unique id from the random package also used by minimongo                                                          // 153
  // character list: https://github.com/meteor/meteor/blob/release/0.8.0/packages/random/random.js#L88                 // 154
  // string length: https://github.com/meteor/meteor/blob/release/0.8.0/packages/random/random.js#L143                 // 155
  Id: /^[23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz]{17}$/                                                // 156
};                                                                                                                     // 157
                                                                                                                       // 158
SimpleSchema._makeGeneric = function(name) {                                                                           // 159
  if (typeof name !== "string")                                                                                        // 160
    return null;                                                                                                       // 161
                                                                                                                       // 162
  return name.replace(/\.[0-9]+\./g, '.$.').replace(/\.[0-9]+/g, '.$');                                                // 163
};                                                                                                                     // 164
                                                                                                                       // 165
SimpleSchema._depsGlobalMessages = new Deps.Dependency;                                                                // 166
                                                                                                                       // 167
// Inherit from Match.Where                                                                                            // 168
// This allow SimpleSchema instance to be recognized as a Match.Where instance as well                                 // 169
// as a SimpleSchema instance                                                                                          // 170
SimpleSchema.prototype = new Match.Where();                                                                            // 171
                                                                                                                       // 172
// If an object is an instance of Match.Where, Meteor built-in check API will look at                                  // 173
// the function named `condition` and will pass it the document to validate                                            // 174
SimpleSchema.prototype.condition = function(obj) {                                                                     // 175
  var self = this;                                                                                                     // 176
                                                                                                                       // 177
  //determine whether obj is a modifier                                                                                // 178
  var isModifier, isNotModifier;                                                                                       // 179
  _.each(obj, function(val, key) {                                                                                     // 180
    if (key.substring(0, 1) === "$") {                                                                                 // 181
      isModifier = true;                                                                                               // 182
    } else {                                                                                                           // 183
      isNotModifier = true;                                                                                            // 184
    }                                                                                                                  // 185
  });                                                                                                                  // 186
                                                                                                                       // 187
  if (isModifier && isNotModifier)                                                                                     // 188
    throw new Match.Error("Object cannot contain modifier operators alongside other keys");                            // 189
                                                                                                                       // 190
  if (!self.newContext().validate(obj, {modifier: isModifier, filter: false, autoConvert: false}))                     // 191
    throw new Match.Error("One or more properties do not match the schema.");                                          // 192
                                                                                                                       // 193
  return true;                                                                                                         // 194
};                                                                                                                     // 195
                                                                                                                       // 196
function logInvalidKeysForContext(context, name) {                                                                     // 197
  Meteor.startup(function() {                                                                                          // 198
    Deps.autorun(function() {                                                                                          // 199
      if (!context.isValid()) {                                                                                        // 200
        console.log('SimpleSchema invalid keys for "' + name + '" context:', context.invalidKeys());                   // 201
      }                                                                                                                // 202
    });                                                                                                                // 203
  });                                                                                                                  // 204
}                                                                                                                      // 205
                                                                                                                       // 206
SimpleSchema.prototype.namedContext = function(name) {                                                                 // 207
  var self = this;                                                                                                     // 208
  if (typeof name !== "string") {                                                                                      // 209
    name = "default";                                                                                                  // 210
  }                                                                                                                    // 211
  if (!self._validationContexts[name]) {                                                                               // 212
    self._validationContexts[name] = new SimpleSchemaValidationContext(self);                                          // 213
                                                                                                                       // 214
    // In debug mode, log all invalid key errors to the browser console                                                // 215
    if (SimpleSchema.debug && Meteor.isClient) {                                                                       // 216
      Deps.nonreactive(function() {                                                                                    // 217
        logInvalidKeysForContext(self._validationContexts[name], name);                                                // 218
      });                                                                                                              // 219
    }                                                                                                                  // 220
  }                                                                                                                    // 221
  return self._validationContexts[name];                                                                               // 222
};                                                                                                                     // 223
                                                                                                                       // 224
// Global custom validators                                                                                            // 225
SimpleSchema._validators = [];                                                                                         // 226
SimpleSchema.addValidator = function(func) {                                                                           // 227
  SimpleSchema._validators.push(func);                                                                                 // 228
};                                                                                                                     // 229
                                                                                                                       // 230
// Instance custom validators                                                                                          // 231
// validator is deprecated; use addValidator                                                                           // 232
SimpleSchema.prototype.addValidator = SimpleSchema.prototype.validator = function(func) {                              // 233
  this._validators.push(func);                                                                                         // 234
};                                                                                                                     // 235
                                                                                                                       // 236
/**                                                                                                                    // 237
 * @method SimpleSchema.prototype.pick                                                                                 // 238
 * @param {[fields]} The list of fields to pick to instantiate the subschema                                           // 239
 * @returns {SimpleSchema} The subschema                                                                               // 240
 */                                                                                                                    // 241
SimpleSchema.prototype.pick = function(/* arguments */) {                                                              // 242
  var self = this;                                                                                                     // 243
  var args = _.toArray(arguments);                                                                                     // 244
  args.unshift(self._schema);                                                                                          // 245
                                                                                                                       // 246
  var newSchema = _.pick.apply(null, args);                                                                            // 247
  return new SimpleSchema(newSchema);                                                                                  // 248
};                                                                                                                     // 249
                                                                                                                       // 250
/**                                                                                                                    // 251
 * @method SimpleSchema.prototype.clean                                                                                // 252
 * @param {Object} doc - Document or modifier to clean. Referenced object will be modified in place.                   // 253
 * @param {Object} [options]                                                                                           // 254
 * @param {Boolean} [options.filter=true] - Do filtering?                                                              // 255
 * @param {Boolean} [options.autoConvert=true] - Do automatic type converting?                                         // 256
 * @param {Boolean} [options.removeEmptyStrings=true] - Remove keys in normal object or $set where the value is an empty string?
 * @param {Boolean} [options.trimStrings=true] - Trim string values?                                                   // 258
 * @param {Boolean} [options.getAutoValues=true] - Inject automatic and default values?                                // 259
 * @param {Boolean} [options.isModifier=false] - Is doc a modifier object?                                             // 260
 * @param {Object} [options.extendAutoValueContext] - This object will be added to the `this` context of autoValue functions.
 * @returns {Object} The modified doc.                                                                                 // 262
 *                                                                                                                     // 263
 * Cleans a document or modifier object. By default, will filter, automatically                                        // 264
 * type convert where possible, and inject automatic/default values. Use the options                                   // 265
 * to skip one or more of these.                                                                                       // 266
 */                                                                                                                    // 267
SimpleSchema.prototype.clean = function(doc, options) {                                                                // 268
  var self = this;                                                                                                     // 269
                                                                                                                       // 270
  // By default, doc will be filtered and autoconverted                                                                // 271
  options = _.extend({                                                                                                 // 272
    filter: true,                                                                                                      // 273
    autoConvert: true,                                                                                                 // 274
    removeEmptyStrings: true,                                                                                          // 275
    trimStrings: true,                                                                                                 // 276
    getAutoValues: true,                                                                                               // 277
    isModifier: false,                                                                                                 // 278
    extendAutoValueContext: {}                                                                                         // 279
  }, options || {});                                                                                                   // 280
                                                                                                                       // 281
  // Convert $pushAll (deprecated) to $push with $each                                                                 // 282
  if ("$pushAll" in doc) {                                                                                             // 283
    console.warn("SimpleSchema.clean: $pushAll is deprecated; converting to $push with $each");                        // 284
    doc.$push = doc.$push || {};                                                                                       // 285
    for (var field in doc.$pushAll) {                                                                                  // 286
      doc.$push[field] = doc.$push[field] || {};                                                                       // 287
      doc.$push[field].$each = doc.$push[field].$each || [];                                                           // 288
      for (var i = 0, ln = doc.$pushAll[field].length; i < ln; i++) {                                                  // 289
        doc.$push[field].$each.push(doc.$pushAll[field][i]);                                                           // 290
      }                                                                                                                // 291
      delete doc.$pushAll;                                                                                             // 292
    }                                                                                                                  // 293
  }                                                                                                                    // 294
                                                                                                                       // 295
  var mDoc = new MongoObject(doc, self._blackboxKeys);                                                                 // 296
                                                                                                                       // 297
  // Clean loop                                                                                                        // 298
  if (options.filter || options.autoConvert || options.removeEmptyStrings || options.trimStrings) {                    // 299
    mDoc.forEachNode(function() {                                                                                      // 300
      var gKey = this.genericKey;                                                                                      // 301
      if (gKey) {                                                                                                      // 302
        var def = self._schema[gKey];                                                                                  // 303
        var val = this.value;                                                                                          // 304
        // Filter out props if necessary; any property is OK for $unset because we want to                             // 305
        // allow conversions to remove props that have been removed from the schema.                                   // 306
        if (options.filter && this.operator !== "$unset" && !self.allowsKey(gKey)) {                                   // 307
          // XXX Special handling for $each; maybe this could be made nicer                                            // 308
          if (this.position.slice(-7) === "[$each]") {                                                                 // 309
            mDoc.removeValueForPosition(this.position.slice(0, -7));                                                   // 310
          } else {                                                                                                     // 311
            this.remove();                                                                                             // 312
          }                                                                                                            // 313
          if (SimpleSchema.debug) {                                                                                    // 314
            console.info('SimpleSchema.clean: filtered out value that would have affected key "' + gKey + '", which is not allowed by the schema');
          }                                                                                                            // 316
          return; // no reason to do more                                                                              // 317
        }                                                                                                              // 318
        if (val !== void 0) {                                                                                          // 319
          // Autoconvert values if requested and if possible                                                           // 320
          var wasAutoConverted = false;                                                                                // 321
          if (options.autoConvert && def) {                                                                            // 322
            var newVal = typeconvert(val, def.type);                                                                   // 323
            if (newVal !== void 0 && newVal !== val) {                                                                 // 324
              // remove empty strings                                                                                  // 325
              if (options.removeEmptyStrings && (!this.operator || this.operator === "$set") && typeof newVal === "string" && !newVal.length) {
                // For a document, we remove any fields that are being set to an empty string                          // 327
                newVal = void 0;                                                                                       // 328
                // For a modifier, we $unset any fields that are being set to an empty string                          // 329
                if (this.operator === "$set") {                                                                        // 330
                  var p = this.position.replace("$set", "$unset");                                                     // 331
                  mDoc.setValueForPosition(p, "");                                                                     // 332
                }                                                                                                      // 333
              }                                                                                                        // 334
              // trim strings                                                                                          // 335
              else if (options.trimStrings && typeof newVal === "string") {                                            // 336
                newVal = S(newVal).trim().s;                                                                           // 337
              }                                                                                                        // 338
                                                                                                                       // 339
              // Change value; if undefined, will remove it                                                            // 340
              SimpleSchema.debug && console.info('SimpleSchema.clean: autoconverted value ' + val + ' from ' + typeof val + ' to ' + typeof newVal + ' for ' + gKey);
              this.updateValue(newVal);                                                                                // 342
              wasAutoConverted = true;                                                                                 // 343
            }                                                                                                          // 344
          }                                                                                                            // 345
          if (!wasAutoConverted) {                                                                                     // 346
            // remove empty strings                                                                                    // 347
            if (options.removeEmptyStrings && (!this.operator || this.operator === "$set") && typeof val === "string" && !val.length) {
              // For a document, we remove any fields that are being set to an empty string                            // 349
              this.remove();                                                                                           // 350
              // For a modifier, we $unset any fields that are being set to an empty string                            // 351
              if (this.operator === "$set") {                                                                          // 352
                var p = this.position.replace("$set", "$unset");                                                       // 353
                mDoc.setValueForPosition(p, "");                                                                       // 354
              }                                                                                                        // 355
            }                                                                                                          // 356
            // trim strings                                                                                            // 357
            else if (options.trimStrings && typeof val === "string" && (!def || (def && def.trim !== false))) {        // 358
              this.updateValue(S(val).trim().s);                                                                       // 359
            }                                                                                                          // 360
          }                                                                                                            // 361
        }                                                                                                              // 362
      }                                                                                                                // 363
    }, {endPointsOnly: false});                                                                                        // 364
  }                                                                                                                    // 365
                                                                                                                       // 366
  // Set automatic values                                                                                              // 367
  options.getAutoValues && getAutoValues.call(self, mDoc, options.isModifier, options.extendAutoValueContext);         // 368
                                                                                                                       // 369
  return doc;                                                                                                          // 370
};                                                                                                                     // 371
                                                                                                                       // 372
// Returns the entire schema object or just the definition for one key                                                 // 373
// in the schema.                                                                                                      // 374
SimpleSchema.prototype.schema = function(key) {                                                                        // 375
  var self = this;                                                                                                     // 376
  // if not null or undefined (more specific)                                                                          // 377
  if (key != null) {                                                                                                   // 378
    return self._schema[SimpleSchema._makeGeneric(key)];                                                               // 379
  } else {                                                                                                             // 380
    return self._schema;                                                                                               // 381
  }                                                                                                                    // 382
};                                                                                                                     // 383
                                                                                                                       // 384
// Returns the evaluated definition for one key in the schema                                                          // 385
// key = non-generic key                                                                                               // 386
// [propList] = props to include in the result, for performance                                                        // 387
// [functionContext] = used for evaluating schema options that are functions                                           // 388
SimpleSchema.prototype.getDefinition = function(key, propList, functionContext) {                                      // 389
  var self = this;                                                                                                     // 390
  var defs = self.schema(key);                                                                                         // 391
  if (!defs)                                                                                                           // 392
    return;                                                                                                            // 393
                                                                                                                       // 394
  if (_.isArray(propList)) {                                                                                           // 395
    defs = _.pick(defs, propList);                                                                                     // 396
  } else {                                                                                                             // 397
    defs = _.clone(defs);                                                                                              // 398
  }                                                                                                                    // 399
                                                                                                                       // 400
  // For any options that support specifying a function,                                                               // 401
  // evaluate the functions.                                                                                           // 402
  _.each(['min', 'max', 'minCount', 'maxCount', 'allowedValues', 'optional', 'label'], function (prop) {               // 403
    if (_.isFunction(defs[prop])) {                                                                                    // 404
      defs[prop] = defs[prop].call(functionContext || {});                                                             // 405
    }                                                                                                                  // 406
  });                                                                                                                  // 407
                                                                                                                       // 408
  // Inflect label if not defined                                                                                      // 409
  defs["label"] = defs["label"] || inflectedLabel(key);                                                                // 410
                                                                                                                       // 411
  return defs;                                                                                                         // 412
};                                                                                                                     // 413
                                                                                                                       // 414
// Check if the key is a nested dot-syntax key inside of a blackbox object                                             // 415
SimpleSchema.prototype.keyIsInBlackBox = function(key) {                                                               // 416
  var self = this;                                                                                                     // 417
  var parentPath = SimpleSchema._makeGeneric(key), lastDot, def;                                                       // 418
                                                                                                                       // 419
  // Iterate the dot-syntax hierarchy until we find a key in our schema                                                // 420
  do {                                                                                                                 // 421
    lastDot = parentPath.lastIndexOf('.');                                                                             // 422
    if (lastDot !== -1) {                                                                                              // 423
      parentPath = parentPath.slice(0, lastDot); // Remove last path component                                         // 424
      def = self.getDefinition(parentPath);                                                                            // 425
    }                                                                                                                  // 426
  } while (lastDot !== -1 && !def);                                                                                    // 427
                                                                                                                       // 428
  return !!(def && def.blackbox);                                                                                      // 429
};                                                                                                                     // 430
                                                                                                                       // 431
// Use to dynamically change the schema labels.                                                                        // 432
SimpleSchema.prototype.labels = function(labels) {                                                                     // 433
  var self = this;                                                                                                     // 434
  _.each(labels, function(label, fieldName) {                                                                          // 435
    if (!_.isString(label) && !_.isFunction(label))                                                                    // 436
      return;                                                                                                          // 437
                                                                                                                       // 438
    if (!(fieldName in self._schema))                                                                                  // 439
      return;                                                                                                          // 440
                                                                                                                       // 441
    self._schema[fieldName].label = label;                                                                             // 442
    self._depsLabels[fieldName] && self._depsLabels[fieldName].changed();                                              // 443
  });                                                                                                                  // 444
};                                                                                                                     // 445
                                                                                                                       // 446
// should be used to safely get a label as string                                                                      // 447
SimpleSchema.prototype.label = function(key) {                                                                         // 448
  var self = this;                                                                                                     // 449
                                                                                                                       // 450
  // Get all labels                                                                                                    // 451
  if (key == null) {                                                                                                   // 452
    var result = {};                                                                                                   // 453
    _.each(self.schema(), function(def, fieldName) {                                                                   // 454
      result[fieldName] = self.label(fieldName);                                                                       // 455
    });                                                                                                                // 456
    return result;                                                                                                     // 457
  }                                                                                                                    // 458
                                                                                                                       // 459
  // Get label for one field                                                                                           // 460
  var def = self.getDefinition(key);                                                                                   // 461
  if (def) {                                                                                                           // 462
    var genericKey = SimpleSchema._makeGeneric(key);                                                                   // 463
    self._depsLabels[genericKey] && self._depsLabels[genericKey].depend();                                             // 464
    return def.label;                                                                                                  // 465
  }                                                                                                                    // 466
                                                                                                                       // 467
  return null;                                                                                                         // 468
};                                                                                                                     // 469
                                                                                                                       // 470
// Global messages                                                                                                     // 471
                                                                                                                       // 472
SimpleSchema._globalMessages = {                                                                                       // 473
  required: "[label] is required",                                                                                     // 474
  minString: "[label] must be at least [min] characters",                                                              // 475
  maxString: "[label] cannot exceed [max] characters",                                                                 // 476
  minNumber: "[label] must be at least [min]",                                                                         // 477
  maxNumber: "[label] cannot exceed [max]",                                                                            // 478
  minDate: "[label] must be on or after [min]",                                                                        // 479
  maxDate: "[label] cannot be after [max]",                                                                            // 480
  minCount: "You must specify at least [minCount] values",                                                             // 481
  maxCount: "You cannot specify more than [maxCount] values",                                                          // 482
  noDecimal: "[label] must be an integer",                                                                             // 483
  notAllowed: "[value] is not an allowed value",                                                                       // 484
  expectedString: "[label] must be a string",                                                                          // 485
  expectedNumber: "[label] must be a number",                                                                          // 486
  expectedBoolean: "[label] must be a boolean",                                                                        // 487
  expectedArray: "[label] must be an array",                                                                           // 488
  expectedObject: "[label] must be an object",                                                                         // 489
  expectedConstructor: "[label] must be a [type]",                                                                     // 490
  regEx: [                                                                                                             // 491
    {msg: "[label] failed regular expression validation"},                                                             // 492
    {exp: SimpleSchema.RegEx.Email, msg: "[label] must be a valid e-mail address"},                                    // 493
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] must be a valid e-mail address"},                                // 494
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] must be a valid domain"},                                           // 495
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] must be a valid domain"},                                       // 496
    {exp: SimpleSchema.RegEx.IP, msg: "[label] must be a valid IPv4 or IPv6 address"},                                 // 497
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] must be a valid IPv4 address"},                                       // 498
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] must be a valid IPv6 address"},                                       // 499
    {exp: SimpleSchema.RegEx.Url, msg: "[label] must be a valid URL"},                                                 // 500
    {exp: SimpleSchema.RegEx.Id, msg: "[label] must be a valid alphanumeric ID"}                                       // 501
  ],                                                                                                                   // 502
  keyNotInSchema: "[label] is not allowed by the schema"                                                               // 503
};                                                                                                                     // 504
                                                                                                                       // 505
SimpleSchema.messages = function(messages) {                                                                           // 506
  _.extend(SimpleSchema._globalMessages, messages);                                                                    // 507
  SimpleSchema._depsGlobalMessages.changed();                                                                          // 508
};                                                                                                                     // 509
                                                                                                                       // 510
// Schema-specific messages                                                                                            // 511
                                                                                                                       // 512
SimpleSchema.prototype.messages = function(messages) {                                                                 // 513
  var self = this;                                                                                                     // 514
  _.extend(self._messages, messages);                                                                                  // 515
  self._depsMessages.changed();                                                                                        // 516
};                                                                                                                     // 517
                                                                                                                       // 518
// Returns a string message for the given error type and key. Uses the                                                 // 519
// def and value arguments to fill in placeholders in the error messages.                                              // 520
SimpleSchema.prototype.messageForError = function(type, key, def, value) {                                             // 521
  var self = this;                                                                                                     // 522
                                                                                                                       // 523
  // We proceed even if we can't get a definition because it might be a keyNotInSchema error                           // 524
  def = def || self.getDefinition(key, ['regEx', 'label', 'minCount', 'maxCount', 'min', 'max', 'type']) || {};        // 525
                                                                                                                       // 526
  // Adjust for complex types, currently only regEx,                                                                   // 527
  // where we might have regEx.1 meaning the second                                                                    // 528
  // expression in the array.                                                                                          // 529
  var firstTypePeriod = type.indexOf("."), index = null;                                                               // 530
  if (firstTypePeriod !== -1) {                                                                                        // 531
    index = type.substring(firstTypePeriod + 1);                                                                       // 532
    index = parseInt(index, 10);                                                                                       // 533
    type = type.substring(0, firstTypePeriod);                                                                         // 534
  }                                                                                                                    // 535
                                                                                                                       // 536
  // Which regExp is it?                                                                                               // 537
  var regExpMatch;                                                                                                     // 538
  if (type === "regEx") {                                                                                              // 539
    if (index != null && !isNaN(index)) {                                                                              // 540
      regExpMatch = def.regEx[index];                                                                                  // 541
    } else {                                                                                                           // 542
      regExpMatch = def.regEx;                                                                                         // 543
    }                                                                                                                  // 544
    if (regExpMatch) {                                                                                                 // 545
      regExpMatch = regExpMatch.toString();                                                                            // 546
    }                                                                                                                  // 547
  }                                                                                                                    // 548
                                                                                                                       // 549
  // Prep some strings to be used when finding the correct message for this error                                      // 550
  var typePlusKey = type + " " + key;                                                                                  // 551
  var genericKey = SimpleSchema._makeGeneric(key);                                                                     // 552
  var typePlusGenKey = type + " " + genericKey;                                                                        // 553
                                                                                                                       // 554
  // reactively update when message templates or labels are changed                                                    // 555
  SimpleSchema._depsGlobalMessages.depend();                                                                           // 556
  self._depsMessages.depend();                                                                                         // 557
  self._depsLabels[key] && self._depsLabels[key].depend();                                                             // 558
                                                                                                                       // 559
  // Prep a function that finds the correct message for regEx errors                                                   // 560
  function findRegExError(message) {                                                                                   // 561
    if (type !== "regEx" || !_.isArray(message)) {                                                                     // 562
      return message;                                                                                                  // 563
    }                                                                                                                  // 564
    // Parse regEx messages, which are provided in a special object array format                                       // 565
    // [{exp: RegExp, msg: "Foo"}]                                                                                     // 566
    // Where `exp` is optional                                                                                         // 567
                                                                                                                       // 568
    var msgObj;                                                                                                        // 569
    // First see if there's one where exp matches this expression                                                      // 570
    if (regExpMatch) {                                                                                                 // 571
      msgObj = _.find(message, function (o) {                                                                          // 572
        return o.exp && o.exp.toString() === regExpMatch;                                                              // 573
      });                                                                                                              // 574
    }                                                                                                                  // 575
                                                                                                                       // 576
    // If not, see if there's a default message defined                                                                // 577
    if (!msgObj) {                                                                                                     // 578
      msgObj = _.findWhere(message, {exp: null});                                                                      // 579
      if (!msgObj) {                                                                                                   // 580
        msgObj = _.findWhere(message, {exp: void 0});                                                                  // 581
      }                                                                                                                // 582
    }                                                                                                                  // 583
                                                                                                                       // 584
    return msgObj ? msgObj.msg : null;                                                                                 // 585
  }                                                                                                                    // 586
                                                                                                                       // 587
  // Try finding the correct message to use at various levels, from most                                               // 588
  // specific to least specific.                                                                                       // 589
  var message = self._messages[typePlusKey] ||                  // (1) Use schema-specific message for specific key    // 590
                self._messages[typePlusGenKey] ||               // (2) Use schema-specific message for generic key     // 591
                self._messages[type];                           // (3) Use schema-specific message for type            // 592
  message = findRegExError(message);                                                                                   // 593
                                                                                                                       // 594
  if (!message) {                                                                                                      // 595
    message = SimpleSchema._globalMessages[typePlusKey] ||      // (4) Use global message for specific key             // 596
              SimpleSchema._globalMessages[typePlusGenKey] ||   // (5) Use global message for generic key              // 597
              SimpleSchema._globalMessages[type];               // (6) Use global message for type                     // 598
    message = findRegExError(message);                                                                                 // 599
  }                                                                                                                    // 600
                                                                                                                       // 601
  if (!message) {                                                                                                      // 602
    return "Unknown validation error";                                                                                 // 603
  }                                                                                                                    // 604
                                                                                                                       // 605
  // Now replace all placeholders in the message with the correct values                                               // 606
                                                                                                                       // 607
  // [label]                                                                                                           // 608
  self._depsLabels[key] && self._depsLabels[key].depend(); // React to label changes                                   // 609
  message = message.replace("[label]", def.label);                                                                     // 610
                                                                                                                       // 611
  // [minCount]                                                                                                        // 612
  if (typeof def.minCount !== "undefined") {                                                                           // 613
    message = message.replace("[minCount]", def.minCount);                                                             // 614
  }                                                                                                                    // 615
                                                                                                                       // 616
  // [maxCount]                                                                                                        // 617
  if (typeof def.maxCount !== "undefined") {                                                                           // 618
    message = message.replace("[maxCount]", def.maxCount);                                                             // 619
  }                                                                                                                    // 620
                                                                                                                       // 621
  // [value]                                                                                                           // 622
  if (value !== void 0 && value !== null) {                                                                            // 623
    message = message.replace("[value]", value.toString());                                                            // 624
  } else {                                                                                                             // 625
    message = message.replace("[value]", 'null');                                                                      // 626
  }                                                                                                                    // 627
                                                                                                                       // 628
  // [min] and [max]                                                                                                   // 629
  var min = def.min;                                                                                                   // 630
  var max = def.max;                                                                                                   // 631
  if (def.type === Date || def.type === [Date]) {                                                                      // 632
    if (typeof min !== "undefined") {                                                                                  // 633
      message = message.replace("[min]", Utility.dateToDateString(min));                                               // 634
    }                                                                                                                  // 635
    if (typeof max !== "undefined") {                                                                                  // 636
      message = message.replace("[max]", Utility.dateToDateString(max));                                               // 637
    }                                                                                                                  // 638
  } else {                                                                                                             // 639
    if (typeof min !== "undefined") {                                                                                  // 640
      message = message.replace("[min]", min);                                                                         // 641
    }                                                                                                                  // 642
    if (typeof max !== "undefined") {                                                                                  // 643
      message = message.replace("[max]", max);                                                                         // 644
    }                                                                                                                  // 645
  }                                                                                                                    // 646
                                                                                                                       // 647
  // [type]                                                                                                            // 648
  if (def.type instanceof Function) {                                                                                  // 649
    message = message.replace("[type]", def.type.name);                                                                // 650
  }                                                                                                                    // 651
                                                                                                                       // 652
  // Now return the message                                                                                            // 653
  return message;                                                                                                      // 654
};                                                                                                                     // 655
                                                                                                                       // 656
// Returns true if key is explicitly allowed by the schema or implied                                                  // 657
// by other explicitly allowed keys.                                                                                   // 658
// The key string should have $ in place of any numeric array positions.                                               // 659
SimpleSchema.prototype.allowsKey = function(key) {                                                                     // 660
  var self = this;                                                                                                     // 661
                                                                                                                       // 662
  // Loop through all keys in the schema                                                                               // 663
  return _.any(self._schemaKeys, function(schemaKey) {                                                                 // 664
                                                                                                                       // 665
    // If the schema key is the test key, it's allowed.                                                                // 666
    if (schemaKey === key) {                                                                                           // 667
      return true;                                                                                                     // 668
    }                                                                                                                  // 669
                                                                                                                       // 670
    // Black box handling                                                                                              // 671
    if (self.schema(schemaKey).blackbox === true) {                                                                    // 672
      var kl = schemaKey.length;                                                                                       // 673
      var compare1 = key.slice(0, kl + 2);                                                                             // 674
      var compare2 = compare1.slice(0, -1);                                                                            // 675
                                                                                                                       // 676
      // If the test key is the black box key + ".$", then the test                                                    // 677
      // key is NOT allowed because black box keys are by definition                                                   // 678
      // only for objects, and not for arrays.                                                                         // 679
      if (compare1 === schemaKey + '.$')                                                                               // 680
        return false;                                                                                                  // 681
                                                                                                                       // 682
      // Otherwise                                                                                                     // 683
      if (compare2 === schemaKey + '.')                                                                                // 684
        return true;                                                                                                   // 685
    }                                                                                                                  // 686
                                                                                                                       // 687
    return false;                                                                                                      // 688
  });                                                                                                                  // 689
};                                                                                                                     // 690
                                                                                                                       // 691
SimpleSchema.prototype.newContext = function() {                                                                       // 692
  return new SimpleSchemaValidationContext(this);                                                                      // 693
};                                                                                                                     // 694
                                                                                                                       // 695
// Returns all the child keys for the object identified by the generic prefix,                                         // 696
// or all the top level keys if no prefix is supplied.                                                                 // 697
SimpleSchema.prototype.objectKeys = function(keyPrefix) {                                                              // 698
  var self = this;                                                                                                     // 699
  if (!keyPrefix) {                                                                                                    // 700
    return self._firstLevelSchemaKeys;                                                                                 // 701
  }                                                                                                                    // 702
  return self._objectKeys[keyPrefix + "."] || [];                                                                      // 703
};                                                                                                                     // 704
                                                                                                                       // 705
/*                                                                                                                     // 706
 * PRIVATE FUNCTIONS                                                                                                   // 707
 */                                                                                                                    // 708
                                                                                                                       // 709
//called by clean()                                                                                                    // 710
var typeconvert = function(value, type) {                                                                              // 711
  if (_.isArray(value) || (_.isObject(value) && !(value instanceof Date)))                                             // 712
    return value; //can't and shouldn't convert arrays or objects                                                      // 713
  if (type === String) {                                                                                               // 714
    if (typeof value !== "undefined" && value !== null && typeof value !== "string") {                                 // 715
      return value.toString();                                                                                         // 716
    }                                                                                                                  // 717
    return value;                                                                                                      // 718
  }                                                                                                                    // 719
  if (type === Number) {                                                                                               // 720
    if (typeof value === "string" && !S(value).isEmpty()) {                                                            // 721
      //try to convert numeric strings to numbers                                                                      // 722
      var numberVal = Number(value);                                                                                   // 723
      if (!isNaN(numberVal)) {                                                                                         // 724
        return numberVal;                                                                                              // 725
      } else {                                                                                                         // 726
        return value; //leave string; will fail validation                                                             // 727
      }                                                                                                                // 728
    }                                                                                                                  // 729
    return value;                                                                                                      // 730
  }                                                                                                                    // 731
  return value;                                                                                                        // 732
};                                                                                                                     // 733
                                                                                                                       // 734
var mergeSchemas = function(schemas) {                                                                                 // 735
                                                                                                                       // 736
  // Merge all provided schema definitions.                                                                            // 737
  // This is effectively a shallow clone of each object, too,                                                          // 738
  // which is what we want since we are going to manipulate it.                                                        // 739
  var mergedSchema = {};                                                                                               // 740
  _.each(schemas, function(schema) {                                                                                   // 741
                                                                                                                       // 742
    // Create a temporary SS instance so that the internal object                                                      // 743
    // we use for merging/extending will be fully expanded                                                             // 744
    if (Match.test(schema, SimpleSchema)) {                                                                            // 745
      schema = schema._schema;                                                                                         // 746
    } else {                                                                                                           // 747
      schema = addImplicitKeys(expandSchema(schema));                                                                  // 748
    }                                                                                                                  // 749
                                                                                                                       // 750
    // Loop through and extend each individual field                                                                   // 751
    // definition. That way you can extend and overwrite                                                               // 752
    // base field definitions.                                                                                         // 753
    _.each(schema, function(def, field) {                                                                              // 754
      mergedSchema[field] = mergedSchema[field] || {};                                                                 // 755
      _.extend(mergedSchema[field], def);                                                                              // 756
    });                                                                                                                // 757
                                                                                                                       // 758
  });                                                                                                                  // 759
                                                                                                                       // 760
  // If we merged some schemas, do this again to make sure                                                             // 761
  // extended definitions are pushed into array item field                                                             // 762
  // definitions properly.                                                                                             // 763
  schemas.length && adjustArrayFields(mergedSchema);                                                                   // 764
                                                                                                                       // 765
  return mergedSchema;                                                                                                 // 766
};                                                                                                                     // 767
                                                                                                                       // 768
var expandSchema = function(schema) {                                                                                  // 769
  // Flatten schema by inserting nested definitions                                                                    // 770
  _.each(schema, function(val, key) {                                                                                  // 771
    var dot, type;                                                                                                     // 772
    if (!val)                                                                                                          // 773
      return;                                                                                                          // 774
    if (Match.test(val.type, SimpleSchema)) {                                                                          // 775
      dot = '.';                                                                                                       // 776
      type = val.type;                                                                                                 // 777
      val.type = Object;                                                                                               // 778
    } else if (Match.test(val.type, [SimpleSchema])) {                                                                 // 779
      dot = '.$.';                                                                                                     // 780
      type = val.type[0];                                                                                              // 781
      val.type = [Object];                                                                                             // 782
    } else {                                                                                                           // 783
      return;                                                                                                          // 784
    }                                                                                                                  // 785
    //add child schema definitions to parent schema                                                                    // 786
    _.each(type._schema, function(subVal, subKey) {                                                                    // 787
      var newKey = key + dot + subKey;                                                                                 // 788
      if (!(newKey in schema))                                                                                         // 789
        schema[newKey] = subVal;                                                                                       // 790
    });                                                                                                                // 791
  });                                                                                                                  // 792
  return schema;                                                                                                       // 793
};                                                                                                                     // 794
                                                                                                                       // 795
var adjustArrayFields = function(schema) {                                                                             // 796
  _.each(schema, function(def, existingKey) {                                                                          // 797
    if (_.isArray(def.type) || def.type === Array) {                                                                   // 798
      // Copy some options to array-item definition                                                                    // 799
      var itemKey = existingKey + ".$";                                                                                // 800
      if (!(itemKey in schema)) {                                                                                      // 801
        schema[itemKey] = {};                                                                                          // 802
      }                                                                                                                // 803
      if (_.isArray(def.type)) {                                                                                       // 804
        schema[itemKey].type = def.type[0];                                                                            // 805
      }                                                                                                                // 806
      if (def.label) {                                                                                                 // 807
        schema[itemKey].label = def.label;                                                                             // 808
      }                                                                                                                // 809
      schema[itemKey].optional = true;                                                                                 // 810
      if (typeof def.min !== "undefined") {                                                                            // 811
        schema[itemKey].min = def.min;                                                                                 // 812
      }                                                                                                                // 813
      if (typeof def.max !== "undefined") {                                                                            // 814
        schema[itemKey].max = def.max;                                                                                 // 815
      }                                                                                                                // 816
      if (typeof def.allowedValues !== "undefined") {                                                                  // 817
        schema[itemKey].allowedValues = def.allowedValues;                                                             // 818
      }                                                                                                                // 819
      if (typeof def.decimal !== "undefined") {                                                                        // 820
        schema[itemKey].decimal = def.decimal;                                                                         // 821
      }                                                                                                                // 822
      if (typeof def.regEx !== "undefined") {                                                                          // 823
        schema[itemKey].regEx = def.regEx;                                                                             // 824
      }                                                                                                                // 825
      if (typeof def.blackbox !== "undefined") {                                                                       // 826
        schema[itemKey].blackbox = def.blackbox;                                                                       // 827
      }                                                                                                                // 828
      // Remove copied options and adjust type                                                                         // 829
      def.type = Array;                                                                                                // 830
      _.each(['min', 'max', 'allowedValues', 'decimal', 'regEx', 'blackbox'], function(k) {                            // 831
        Utility.deleteIfPresent(def, k);                                                                               // 832
      });                                                                                                              // 833
    }                                                                                                                  // 834
  });                                                                                                                  // 835
};                                                                                                                     // 836
                                                                                                                       // 837
/**                                                                                                                    // 838
 * Adds implied keys.                                                                                                  // 839
 * * If schema contains a key like "foo.$.bar" but not "foo", adds "foo".                                              // 840
 * * If schema contains a key like "foo" with an array type, adds "foo.$".                                             // 841
 * @param {Object} schema                                                                                              // 842
 * @returns {Object} modified schema                                                                                   // 843
 */                                                                                                                    // 844
var addImplicitKeys = function(schema) {                                                                               // 845
  var arrayKeysToAdd = [], objectKeysToAdd = [], newKey, key;                                                          // 846
                                                                                                                       // 847
  // Pass 1 (objects)                                                                                                  // 848
  _.each(schema, function(def, existingKey) {                                                                          // 849
    var pos = existingKey.indexOf(".");                                                                                // 850
    while (pos !== -1) {                                                                                               // 851
      newKey = existingKey.substring(0, pos);                                                                          // 852
                                                                                                                       // 853
      // It's an array item; nothing to add                                                                            // 854
      if (newKey.substring(newKey.length - 2) === ".$") {                                                              // 855
        pos = -1;                                                                                                      // 856
      }                                                                                                                // 857
      // It's an array of objects; add it with type [Object] if not already in the schema                              // 858
      else if (existingKey.substring(pos, pos + 3) === ".$.") {                                                        // 859
        arrayKeysToAdd.push(newKey); // add later, since we are iterating over schema right now                        // 860
        pos = existingKey.indexOf(".", pos + 3); // skip over next dot, find the one after                             // 861
      }                                                                                                                // 862
      // It's an object; add it with type Object if not already in the schema                                          // 863
      else {                                                                                                           // 864
        objectKeysToAdd.push(newKey); // add later, since we are iterating over schema right now                       // 865
        pos = existingKey.indexOf(".", pos + 1); // find next dot                                                      // 866
      }                                                                                                                // 867
    }                                                                                                                  // 868
  });                                                                                                                  // 869
                                                                                                                       // 870
  for (var i = 0, ln = arrayKeysToAdd.length; i < ln; i++) {                                                           // 871
    key = arrayKeysToAdd[i];                                                                                           // 872
    if (!(key in schema)) {                                                                                            // 873
      schema[key] = {type: [Object], optional: true};                                                                  // 874
    }                                                                                                                  // 875
  }                                                                                                                    // 876
                                                                                                                       // 877
  for (var i = 0, ln = objectKeysToAdd.length; i < ln; i++) {                                                          // 878
    key = objectKeysToAdd[i];                                                                                          // 879
    if (!(key in schema)) {                                                                                            // 880
      schema[key] = {type: Object, optional: true};                                                                    // 881
    }                                                                                                                  // 882
  }                                                                                                                    // 883
                                                                                                                       // 884
  // Pass 2 (arrays)                                                                                                   // 885
  adjustArrayFields(schema);                                                                                           // 886
                                                                                                                       // 887
  return schema;                                                                                                       // 888
};                                                                                                                     // 889
                                                                                                                       // 890
// Returns an object relating the keys in the list                                                                     // 891
// to their parent object.                                                                                             // 892
var getObjectKeys = function(schema, schemaKeyList) {                                                                  // 893
  var keyPrefix, remainingText, rKeys = {}, loopArray;                                                                 // 894
  _.each(schema, function(definition, fieldName) {                                                                     // 895
    if (definition.type === Object) {                                                                                  // 896
      //object                                                                                                         // 897
      keyPrefix = fieldName + ".";                                                                                     // 898
    } else {                                                                                                           // 899
      return;                                                                                                          // 900
    }                                                                                                                  // 901
                                                                                                                       // 902
    loopArray = [];                                                                                                    // 903
    _.each(schemaKeyList, function(fieldName2) {                                                                       // 904
      if (S(fieldName2).startsWith(keyPrefix)) {                                                                       // 905
        remainingText = fieldName2.substring(keyPrefix.length);                                                        // 906
        if (remainingText.indexOf(".") === -1) {                                                                       // 907
          loopArray.push(remainingText);                                                                               // 908
        }                                                                                                              // 909
      }                                                                                                                // 910
    });                                                                                                                // 911
    rKeys[keyPrefix] = loopArray;                                                                                      // 912
  });                                                                                                                  // 913
  return rKeys;                                                                                                        // 914
};                                                                                                                     // 915
                                                                                                                       // 916
// returns an inflected version of fieldName to use as the label                                                       // 917
var inflectedLabel = function(fieldName) {                                                                             // 918
  var label = fieldName, lastPeriod = label.lastIndexOf(".");                                                          // 919
  if (lastPeriod !== -1) {                                                                                             // 920
    label = label.substring(lastPeriod + 1);                                                                           // 921
    if (label === "$") {                                                                                               // 922
      var pcs = fieldName.split(".");                                                                                  // 923
      label = pcs[pcs.length - 2];                                                                                     // 924
    }                                                                                                                  // 925
  }                                                                                                                    // 926
  if (label === "_id")                                                                                                 // 927
    return "ID";                                                                                                       // 928
  return S(label).humanize().s;                                                                                        // 929
};                                                                                                                     // 930
                                                                                                                       // 931
/**                                                                                                                    // 932
 * @method getAutoValues                                                                                               // 933
 * @private                                                                                                            // 934
 * @param {MongoObject} mDoc                                                                                           // 935
 * @param {Boolean} [isModifier=false] - Is it a modifier doc?                                                         // 936
 * @param {Object} [extendedAutoValueContext] - Object that will be added to the context when calling each autoValue function
 * @returns {undefined}                                                                                                // 938
 *                                                                                                                     // 939
 * Updates doc with automatic values from autoValue functions or default                                               // 940
 * values from defaultValue. Modifies the referenced object in place.                                                  // 941
 */                                                                                                                    // 942
function getAutoValues(mDoc, isModifier, extendedAutoValueContext) {                                                   // 943
  var self = this;                                                                                                     // 944
  var doneKeys = [];                                                                                                   // 945
                                                                                                                       // 946
  //on the client we can add the userId if not already in the custom context                                           // 947
  if (Meteor.isClient && extendedAutoValueContext.userId === void 0) {                                                 // 948
    extendedAutoValueContext.userId = (Meteor.userId && Meteor.userId()) || null;                                      // 949
  }                                                                                                                    // 950
                                                                                                                       // 951
  function runAV(func) {                                                                                               // 952
    var affectedKey = this.key;                                                                                        // 953
    // If already called for this key, skip it                                                                         // 954
    if (_.contains(doneKeys, affectedKey))                                                                             // 955
      return;                                                                                                          // 956
    var lastDot = affectedKey.lastIndexOf('.');                                                                        // 957
    var fieldParentName = lastDot === -1 ? '' : affectedKey.slice(0, lastDot + 1);                                     // 958
    var doUnset = false;                                                                                               // 959
    var autoValue = func.call(_.extend({                                                                               // 960
      isSet: (this.value !== void 0),                                                                                  // 961
      unset: function() {                                                                                              // 962
        doUnset = true;                                                                                                // 963
      },                                                                                                               // 964
      value: this.value,                                                                                               // 965
      operator: this.operator,                                                                                         // 966
      field: function(fName) {                                                                                         // 967
        var keyInfo = mDoc.getInfoForKey(fName) || {};                                                                 // 968
        return {                                                                                                       // 969
          isSet: (keyInfo.value !== void 0),                                                                           // 970
          value: keyInfo.value,                                                                                        // 971
          operator: keyInfo.operator || null                                                                           // 972
        };                                                                                                             // 973
      },                                                                                                               // 974
      siblingField: function(fName) {                                                                                  // 975
        var keyInfo = mDoc.getInfoForKey(fieldParentName + fName) || {};                                               // 976
        return {                                                                                                       // 977
          isSet: (keyInfo.value !== void 0),                                                                           // 978
          value: keyInfo.value,                                                                                        // 979
          operator: keyInfo.operator || null                                                                           // 980
        };                                                                                                             // 981
      }                                                                                                                // 982
    }, extendedAutoValueContext || {}), mDoc.getObject());                                                             // 983
                                                                                                                       // 984
    // Update tracking of which keys we've run autovalue for                                                           // 985
    doneKeys.push(affectedKey);                                                                                        // 986
                                                                                                                       // 987
    if (autoValue === void 0) {                                                                                        // 988
      if (doUnset) {                                                                                                   // 989
        mDoc.removeValueForPosition(this.position);                                                                    // 990
      }                                                                                                                // 991
      return;                                                                                                          // 992
    }                                                                                                                  // 993
                                                                                                                       // 994
    // If the user's auto value is of the pseudo-modifier format, parse it                                             // 995
    // into operator and value.                                                                                        // 996
    var op, newValue;                                                                                                  // 997
    if (_.isObject(autoValue)) {                                                                                       // 998
      for (var key in autoValue) {                                                                                     // 999
        if (autoValue.hasOwnProperty(key) && key.substring(0, 1) === "$") {                                            // 1000
          op = key;                                                                                                    // 1001
          newValue = autoValue[key];                                                                                   // 1002
          break;                                                                                                       // 1003
        }                                                                                                              // 1004
      }                                                                                                                // 1005
    }                                                                                                                  // 1006
                                                                                                                       // 1007
    // Add $set for updates and upserts if necessary                                                                   // 1008
    if (!op && isModifier && this.position.slice(0, 1) !== '$') {                                                      // 1009
      op = "$set";                                                                                                     // 1010
      newValue = autoValue;                                                                                            // 1011
    }                                                                                                                  // 1012
                                                                                                                       // 1013
    // Update/change value                                                                                             // 1014
    if (op) {                                                                                                          // 1015
      mDoc.removeValueForPosition(this.position);                                                                      // 1016
      mDoc.setValueForPosition(op + '[' + affectedKey + ']', newValue);                                                // 1017
    } else {                                                                                                           // 1018
      mDoc.setValueForPosition(this.position, autoValue);                                                              // 1019
    }                                                                                                                  // 1020
  }                                                                                                                    // 1021
                                                                                                                       // 1022
  _.each(self._autoValues, function(func, fieldName) {                                                                 // 1023
    var positionSuffix, key, keySuffix, positions;                                                                     // 1024
                                                                                                                       // 1025
    // If we're under an array, run autovalue for all the properties of                                                // 1026
    // any objects that are present in the nearest ancestor array.                                                     // 1027
    if (fieldName.indexOf("$") !== -1) {                                                                               // 1028
      var testField = fieldName.slice(0, fieldName.lastIndexOf("$") + 1);                                              // 1029
      keySuffix = fieldName.slice(testField.length + 1);                                                               // 1030
      positionSuffix = MongoObject._keyToPosition(keySuffix, true);                                                    // 1031
      keySuffix = '.' + keySuffix;                                                                                     // 1032
      positions = mDoc.getPositionsForGenericKey(testField);                                                           // 1033
    } else {                                                                                                           // 1034
                                                                                                                       // 1035
      // See if anything in the object affects this key                                                                // 1036
      positions = mDoc.getPositionsForGenericKey(fieldName);                                                           // 1037
                                                                                                                       // 1038
      // Run autovalue for properties that are set in the object                                                       // 1039
      if (positions.length) {                                                                                          // 1040
        key = fieldName;                                                                                               // 1041
        keySuffix = '';                                                                                                // 1042
        positionSuffix = '';                                                                                           // 1043
      }                                                                                                                // 1044
                                                                                                                       // 1045
      // Run autovalue for properties that are NOT set in the object                                                   // 1046
      else {                                                                                                           // 1047
        key = fieldName;                                                                                               // 1048
        keySuffix = '';                                                                                                // 1049
        positionSuffix = '';                                                                                           // 1050
        if (isModifier) {                                                                                              // 1051
          positions = ["$set[" + fieldName + "]"];                                                                     // 1052
        } else {                                                                                                       // 1053
          positions = [MongoObject._keyToPosition(fieldName)];                                                         // 1054
        }                                                                                                              // 1055
      }                                                                                                                // 1056
                                                                                                                       // 1057
    }                                                                                                                  // 1058
                                                                                                                       // 1059
    _.each(positions, function(position) {                                                                             // 1060
      runAV.call({                                                                                                     // 1061
        key: (key || MongoObject._positionToKey(position)) + keySuffix,                                                // 1062
        value: mDoc.getValueForPosition(position + positionSuffix),                                                    // 1063
        operator: Utility.extractOp(position),                                                                         // 1064
        position: position + positionSuffix                                                                            // 1065
      }, func);                                                                                                        // 1066
    });                                                                                                                // 1067
  });                                                                                                                  // 1068
}                                                                                                                      // 1069
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/simple-schema-validation.js                                                           //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
doValidation1 = function doValidation1(obj, isModifier, isUpsert, keyToValidate, ss, extendedCustomContext) {          // 1
  // First do some basic checks of the object, and throw errors if necessary                                           // 2
  if (!_.isObject(obj)) {                                                                                              // 3
    throw new Error("The first argument of validate() or validateOne() must be an object");                            // 4
  }                                                                                                                    // 5
                                                                                                                       // 6
  if (!isModifier && Utility.looksLikeModifier(obj)) {                                                                 // 7
    throw new Error("When the validation object contains mongo operators, you must set the modifier option to true");  // 8
  }                                                                                                                    // 9
                                                                                                                       // 10
  var invalidKeys = [];                                                                                                // 11
  var mDoc; // for caching the MongoObject if necessary                                                                // 12
                                                                                                                       // 13
  // Validation function called for each affected key                                                                  // 14
  function validate(val, affectedKey, affectedKeyGeneric, def, op, skipRequiredCheck, isInArrayItemObject, isInSubObject) {
                                                                                                                       // 16
    // Get the schema for this key, marking invalid if there isn't one.                                                // 17
    if (!def) {                                                                                                        // 18
      invalidKeys.push(Utility.errorObject("keyNotInSchema", affectedKey, val, def, ss));                              // 19
      return;                                                                                                          // 20
    }                                                                                                                  // 21
                                                                                                                       // 22
    // Check for missing required values. The general logic is this:                                                   // 23
    // * If the operator is $unset or $rename, it's invalid.                                                           // 24
    // * If the value is null, it's invalid.                                                                           // 25
    // * If the value is undefined and one of the following are true, it's invalid:                                    // 26
    //     * We're validating a key of a sub-object.                                                                   // 27
    //     * We're validating a key of an object that is an array item.                                                // 28
    //     * We're validating a document (as opposed to a modifier).                                                   // 29
    //     * We're validating a key under the $set operator in a modifier, and it's an upsert.                         // 30
    if (!skipRequiredCheck && !def.optional) {                                                                         // 31
      if (                                                                                                             // 32
        val === null ||                                                                                                // 33
        op === "$unset" ||                                                                                             // 34
        op === "$rename" ||                                                                                            // 35
        (val === void 0 && (isInArrayItemObject || isInSubObject || !op || op === "$set"))                             // 36
        ) {                                                                                                            // 37
        invalidKeys.push(Utility.errorObject("required", affectedKey, null, def, ss));                                 // 38
        return;                                                                                                        // 39
      }                                                                                                                // 40
    }                                                                                                                  // 41
                                                                                                                       // 42
    // For $rename, make sure that the new name is allowed by the schema                                               // 43
    if (op === "$rename" && typeof val === "string" && !ss.allowsKey(val)) {                                           // 44
      invalidKeys.push(Utility.errorObject("keyNotInSchema", val, null, null, ss));                                    // 45
      return;                                                                                                          // 46
    }                                                                                                                  // 47
                                                                                                                       // 48
    // Value checks are not necessary for null or undefined values                                                     // 49
    // or for $unset or $rename values                                                                                 // 50
    if (op !== "$unset" && op !== "$rename" && Utility.isNotNullOrUndefined(val)) {                                    // 51
                                                                                                                       // 52
      // Check that value is of the correct type                                                                       // 53
      var typeError = doTypeChecks(def, val, op);                                                                      // 54
      if (typeError) {                                                                                                 // 55
        invalidKeys.push(Utility.errorObject(typeError, affectedKey, val, def, ss));                                   // 56
        return;                                                                                                        // 57
      }                                                                                                                // 58
                                                                                                                       // 59
      // Check value against allowedValues array                                                                       // 60
      if (def.allowedValues && !_.contains(def.allowedValues, val)) {                                                  // 61
        invalidKeys.push(Utility.errorObject("notAllowed", affectedKey, val, def, ss));                                // 62
        return;                                                                                                        // 63
      }                                                                                                                // 64
                                                                                                                       // 65
    }                                                                                                                  // 66
                                                                                                                       // 67
    // Perform custom validation                                                                                       // 68
    var lastDot = affectedKey.lastIndexOf('.');                                                                        // 69
    var fieldParentName = lastDot === -1 ? '' : affectedKey.slice(0, lastDot + 1);                                     // 70
    var validators = def.custom ? [def.custom] : [];                                                                   // 71
    validators = validators.concat(ss._validators).concat(SimpleSchema._validators);                                   // 72
    _.every(validators, function(validator) {                                                                          // 73
      var errorType = validator.call(_.extend({                                                                        // 74
        key: affectedKey,                                                                                              // 75
        genericKey: affectedKeyGeneric,                                                                                // 76
        definition: def,                                                                                               // 77
        isSet: (val !== void 0),                                                                                       // 78
        value: val,                                                                                                    // 79
        operator: op,                                                                                                  // 80
        field: function(fName) {                                                                                       // 81
          mDoc = mDoc || new MongoObject(obj, ss._blackboxKeys); //create if necessary, cache for speed                // 82
          var keyInfo = mDoc.getInfoForKey(fName) || {};                                                               // 83
          return {                                                                                                     // 84
            isSet: (keyInfo.value !== void 0),                                                                         // 85
            value: keyInfo.value,                                                                                      // 86
            operator: keyInfo.operator                                                                                 // 87
          };                                                                                                           // 88
        },                                                                                                             // 89
        siblingField: function(fName) {                                                                                // 90
          mDoc = mDoc || new MongoObject(obj, ss._blackboxKeys); //create if necessary, cache for speed                // 91
          var keyInfo = mDoc.getInfoForKey(fieldParentName + fName) || {};                                             // 92
          return {                                                                                                     // 93
            isSet: (keyInfo.value !== void 0),                                                                         // 94
            value: keyInfo.value,                                                                                      // 95
            operator: keyInfo.operator                                                                                 // 96
          };                                                                                                           // 97
        }                                                                                                              // 98
      }, extendedCustomContext || {}));                                                                                // 99
      if (typeof errorType === "string") {                                                                             // 100
        invalidKeys.push(Utility.errorObject(errorType, affectedKey, val, def, ss));                                   // 101
        return false;                                                                                                  // 102
      }                                                                                                                // 103
      return true;                                                                                                     // 104
    });                                                                                                                // 105
  }                                                                                                                    // 106
                                                                                                                       // 107
  // The recursive function                                                                                            // 108
  function checkObj(val, affectedKey, operator, setKeys, isInArrayItemObject, isInSubObject) {                         // 109
    var affectedKeyGeneric, def;                                                                                       // 110
                                                                                                                       // 111
    if (affectedKey) {                                                                                                 // 112
      // When we hit a blackbox key, we don't progress any further                                                     // 113
      if (ss.keyIsInBlackBox(affectedKey)) {                                                                           // 114
        return;                                                                                                        // 115
      }                                                                                                                // 116
                                                                                                                       // 117
      // Make a generic version of the affected key, and use that                                                      // 118
      // to get the schema for this key.                                                                               // 119
      affectedKeyGeneric = SimpleSchema._makeGeneric(affectedKey);                                                     // 120
      def = ss.getDefinition(affectedKey);                                                                             // 121
                                                                                                                       // 122
      // Perform validation for this key                                                                               // 123
      if (!keyToValidate || keyToValidate === affectedKey || keyToValidate === affectedKeyGeneric) {                   // 124
        // We can skip the required check for keys that are ancestors                                                  // 125
        // of those in $set or $setOnInsert because they will be created                                               // 126
        // by MongoDB while setting.                                                                                   // 127
        var skipRequiredCheck = _.some(setKeys, function(sk) {                                                         // 128
          return (sk.slice(0, affectedKey.length + 1) === affectedKey + ".");                                          // 129
        });                                                                                                            // 130
        validate(val, affectedKey, affectedKeyGeneric, def, operator, skipRequiredCheck, isInArrayItemObject, isInSubObject);
      }                                                                                                                // 132
    }                                                                                                                  // 133
                                                                                                                       // 134
    // Temporarily convert missing objects to empty objects                                                            // 135
    // so that the looping code will be called and required                                                            // 136
    // descendent keys can be validated.                                                                               // 137
    if ((val === void 0 || val === null) && (!def || (def.type === Object && !def.optional))) {                        // 138
      val = {};                                                                                                        // 139
    }                                                                                                                  // 140
                                                                                                                       // 141
    // Loop through arrays                                                                                             // 142
    if (_.isArray(val)) {                                                                                              // 143
      _.each(val, function(v, i) {                                                                                     // 144
        checkObj(v, affectedKey + '.' + i, operator, setKeys);                                                         // 145
      });                                                                                                              // 146
    }                                                                                                                  // 147
                                                                                                                       // 148
    // Loop through object keys                                                                                        // 149
    else if (Utility.isBasicObject(val) && (!def || !def.blackbox)) {                                                  // 150
                                                                                                                       // 151
      // Get list of present keys                                                                                      // 152
      var presentKeys = _.keys(val);                                                                                   // 153
                                                                                                                       // 154
      // Check all present keys plus all keys defined by the schema.                                                   // 155
      // This allows us to detect extra keys not allowed by the schema plus                                            // 156
      // any missing required keys, and to run any custom functions for other keys.                                    // 157
      var keysToCheck = _.union(presentKeys, ss.objectKeys(affectedKeyGeneric));                                       // 158
                                                                                                                       // 159
      // If this object is within an array, make sure we check for                                                     // 160
      // required as if it's not a modifier                                                                            // 161
      var isInArrayItemObject = (affectedKeyGeneric && affectedKeyGeneric.slice(-2) === ".$");                         // 162
                                                                                                                       // 163
      // Check all keys in the merged list                                                                             // 164
      _.each(keysToCheck, function(key) {                                                                              // 165
        checkObj(val[key], Utility.appendAffectedKey(affectedKey, key), operator, setKeys, isInArrayItemObject, true); // 166
      });                                                                                                              // 167
    }                                                                                                                  // 168
                                                                                                                       // 169
  }                                                                                                                    // 170
                                                                                                                       // 171
  function checkModifier(mod) {                                                                                        // 172
    // Check for empty modifier                                                                                        // 173
    if (_.isEmpty(mod)) {                                                                                              // 174
      throw new Error("When the modifier option is true, validation object must have at least one operator");          // 175
    }                                                                                                                  // 176
                                                                                                                       // 177
    // Get a list of all keys in $set and $setOnInsert combined, for use later                                         // 178
    var setKeys = _.keys(mod.$set || {}).concat(_.keys(mod.$setOnInsert || {}));                                       // 179
                                                                                                                       // 180
    // If this is an upsert, add all the $setOnInsert keys to $set;                                                    // 181
    // since we don't know whether it will be an insert or update, we'll                                               // 182
    // validate upserts as if they will be an insert.                                                                  // 183
    if ("$setOnInsert" in mod) {                                                                                       // 184
      if (isUpsert) {                                                                                                  // 185
        mod.$set = mod.$set || {};                                                                                     // 186
        mod.$set = _.extend(mod.$set, mod.$setOnInsert);                                                               // 187
      }                                                                                                                // 188
      delete mod.$setOnInsert;                                                                                         // 189
    }                                                                                                                  // 190
                                                                                                                       // 191
    // Loop through operators                                                                                          // 192
    _.each(mod, function (opObj, op) {                                                                                 // 193
      // If non-operators are mixed in, throw error                                                                    // 194
      if (op.slice(0, 1) !== "$") {                                                                                    // 195
        throw new Error("When the modifier option is true, all validation object keys must be operators. Did you forget `$set`?");
      }                                                                                                                // 197
      if (Utility.shouldCheck(op)) {                                                                                   // 198
        // For an upsert, missing props would not be set if an insert is performed,                                    // 199
        // so we add null keys to the modifier to force any "required" checks to fail                                  // 200
        if (isUpsert && op === "$set") {                                                                               // 201
          var presentKeys = _.keys(opObj);                                                                             // 202
          _.each(ss.objectKeys(), function (schemaKey) {                                                               // 203
            if (!_.contains(presentKeys, schemaKey)) {                                                                 // 204
              checkObj(void 0, schemaKey, op, setKeys);                                                                // 205
            }                                                                                                          // 206
          });                                                                                                          // 207
        }                                                                                                              // 208
        _.each(opObj, function (v, k) {                                                                                // 209
          if (op === "$push" || op === "$addToSet") {                                                                  // 210
            if (Utility.isBasicObject(v) && "$each" in v) {                                                            // 211
              v = v.$each;                                                                                             // 212
            } else {                                                                                                   // 213
              k = k + ".0";                                                                                            // 214
            }                                                                                                          // 215
          }                                                                                                            // 216
          checkObj(v, k, op, setKeys);                                                                                 // 217
        });                                                                                                            // 218
      }                                                                                                                // 219
    });                                                                                                                // 220
  }                                                                                                                    // 221
                                                                                                                       // 222
  // Kick off the validation                                                                                           // 223
  if (isModifier)                                                                                                      // 224
    checkModifier(obj);                                                                                                // 225
  else                                                                                                                 // 226
    checkObj(obj);                                                                                                     // 227
                                                                                                                       // 228
  // Make sure there is only one error per fieldName                                                                   // 229
  var addedFieldNames = [];                                                                                            // 230
  invalidKeys = _.filter(invalidKeys, function(errObj) {                                                               // 231
    if (!_.contains(addedFieldNames, errObj.name)) {                                                                   // 232
      addedFieldNames.push(errObj.name);                                                                               // 233
      return true;                                                                                                     // 234
    }                                                                                                                  // 235
    return false;                                                                                                      // 236
  });                                                                                                                  // 237
                                                                                                                       // 238
  return invalidKeys;                                                                                                  // 239
};                                                                                                                     // 240
                                                                                                                       // 241
function doTypeChecks(def, keyValue, op) {                                                                             // 242
  var expectedType = def.type;                                                                                         // 243
                                                                                                                       // 244
  // String checks                                                                                                     // 245
  if (expectedType === String) {                                                                                       // 246
    if (typeof keyValue !== "string") {                                                                                // 247
      return "expectedString";                                                                                         // 248
    } else if (def.max !== null && def.max < keyValue.length) {                                                        // 249
      return "maxString";                                                                                              // 250
    } else if (def.min !== null && def.min > keyValue.length) {                                                        // 251
      return "minString";                                                                                              // 252
    } else if (def.regEx instanceof RegExp && !def.regEx.test(keyValue)) {                                             // 253
      return "regEx";                                                                                                  // 254
    } else if (_.isArray(def.regEx)) {                                                                                 // 255
      var regExError;                                                                                                  // 256
      _.every(def.regEx, function(re, i) {                                                                             // 257
        if (!re.test(keyValue)) {                                                                                      // 258
          regExError = "regEx." + i;                                                                                   // 259
          return false;                                                                                                // 260
        }                                                                                                              // 261
        return true;                                                                                                   // 262
      });                                                                                                              // 263
      if (regExError)                                                                                                  // 264
        return regExError;                                                                                             // 265
    }                                                                                                                  // 266
  }                                                                                                                    // 267
                                                                                                                       // 268
  // Number checks                                                                                                     // 269
  else if (expectedType === Number) {                                                                                  // 270
    if (typeof keyValue !== "number" || isNaN(keyValue)) {                                                             // 271
      return "expectedNumber";                                                                                         // 272
    } else if (op !== "$inc" && def.max !== null && def.max < keyValue) {                                              // 273
      return "maxNumber";                                                                                              // 274
    } else if (op !== "$inc" && def.min !== null && def.min > keyValue) {                                              // 275
      return "minNumber";                                                                                              // 276
    } else if (!def.decimal && keyValue.toString().indexOf(".") > -1) {                                                // 277
      return "noDecimal";                                                                                              // 278
    }                                                                                                                  // 279
  }                                                                                                                    // 280
                                                                                                                       // 281
  // Boolean checks                                                                                                    // 282
  else if (expectedType === Boolean) {                                                                                 // 283
    if (typeof keyValue !== "boolean") {                                                                               // 284
      return "expectedBoolean";                                                                                        // 285
    }                                                                                                                  // 286
  }                                                                                                                    // 287
                                                                                                                       // 288
  // Object checks                                                                                                     // 289
  else if (expectedType === Object) {                                                                                  // 290
    if (!Utility.isBasicObject(keyValue)) {                                                                            // 291
      return "expectedObject";                                                                                         // 292
    }                                                                                                                  // 293
  }                                                                                                                    // 294
                                                                                                                       // 295
  // Array checks                                                                                                      // 296
  else if (expectedType === Array) {                                                                                   // 297
    if (!_.isArray(keyValue)) {                                                                                        // 298
      return "expectedArray";                                                                                          // 299
    } else if (def.minCount !== null && keyValue.length < def.minCount) {                                              // 300
      return "minCount";                                                                                               // 301
    } else if (def.maxCount !== null && keyValue.length > def.maxCount) {                                              // 302
      return "maxCount";                                                                                               // 303
    }                                                                                                                  // 304
  }                                                                                                                    // 305
                                                                                                                       // 306
  // Constructor function checks                                                                                       // 307
  else if (expectedType instanceof Function || Utility.safariBugFix(expectedType)) {                                   // 308
                                                                                                                       // 309
    // Generic constructor checks                                                                                      // 310
    if (!(keyValue instanceof expectedType)) {                                                                         // 311
      return "expectedConstructor";                                                                                    // 312
    }                                                                                                                  // 313
                                                                                                                       // 314
    // Date checks                                                                                                     // 315
    else if (expectedType === Date) {                                                                                  // 316
      if (_.isDate(def.min) && def.min.getTime() > keyValue.getTime()) {                                               // 317
        return "minDate";                                                                                              // 318
      } else if (_.isDate(def.max) && def.max.getTime() < keyValue.getTime()) {                                        // 319
        return "maxDate";                                                                                              // 320
      }                                                                                                                // 321
    }                                                                                                                  // 322
  }                                                                                                                    // 323
                                                                                                                       // 324
}                                                                                                                      // 325
                                                                                                                       // 326
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/simple-schema-validation-new.js                                                       //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
doValidation2 = function doValidation2(obj, isModifier, isUpsert, keyToValidate, ss, extendedCustomContext) {          // 1
                                                                                                                       // 2
  // First do some basic checks of the object, and throw errors if necessary                                           // 3
  if (!_.isObject(obj)) {                                                                                              // 4
    throw new Error("The first argument of validate() or validateOne() must be an object");                            // 5
  }                                                                                                                    // 6
                                                                                                                       // 7
  if (isModifier) {                                                                                                    // 8
    if (_.isEmpty(obj)) {                                                                                              // 9
      throw new Error("When the modifier option is true, validation object must have at least one operator");          // 10
    } else {                                                                                                           // 11
      var allKeysAreOperators = _.every(obj, function(v, k) {                                                          // 12
        return (k.substring(0, 1) === "$");                                                                            // 13
      });                                                                                                              // 14
      if (!allKeysAreOperators) {                                                                                      // 15
        throw new Error("When the modifier option is true, all validation object keys must be operators");             // 16
      }                                                                                                                // 17
                                                                                                                       // 18
      // We use a LocalCollection to figure out what the resulting doc                                                 // 19
      // would be in a worst case scenario. Then we validate that doc                                                  // 20
      // so that we don't have to validate the modifier object directly.                                               // 21
      obj = convertModifierToDoc(obj, ss.schema(), isUpsert);                                                          // 22
    }                                                                                                                  // 23
  } else if (Utility.looksLikeModifier(obj)) {                                                                         // 24
    throw new Error("When the validation object contains mongo operators, you must set the modifier option to true");  // 25
  }                                                                                                                    // 26
                                                                                                                       // 27
  var invalidKeys = [];                                                                                                // 28
  var mDoc; // for caching the MongoObject if necessary                                                                // 29
                                                                                                                       // 30
  // Validation function called for each affected key                                                                  // 31
  function validate(val, affectedKey, affectedKeyGeneric, def, op, skipRequiredCheck, strictRequiredCheck) {           // 32
                                                                                                                       // 33
    // Get the schema for this key, marking invalid if there isn't one.                                                // 34
    if (!def) {                                                                                                        // 35
      invalidKeys.push(Utility.errorObject("keyNotInSchema", affectedKey, val, def, ss));                              // 36
      return;                                                                                                          // 37
    }                                                                                                                  // 38
                                                                                                                       // 39
    // Check for missing required values. The general logic is this:                                                   // 40
    // * If the operator is $unset or $rename, it's invalid.                                                           // 41
    // * If the value is null, it's invalid.                                                                           // 42
    // * If the value is undefined and one of the following are true, it's invalid:                                    // 43
    //     * We're validating a key of a sub-object.                                                                   // 44
    //     * We're validating a key of an object that is an array item.                                                // 45
    //     * We're validating a document (as opposed to a modifier).                                                   // 46
    //     * We're validating a key under the $set operator in a modifier, and it's an upsert.                         // 47
    if (!skipRequiredCheck && !def.optional) {                                                                         // 48
      if (val === null || val === void 0) {                                                                            // 49
        invalidKeys.push(Utility.errorObject("required", affectedKey, null, def, ss));                                 // 50
        return;                                                                                                        // 51
      }                                                                                                                // 52
    }                                                                                                                  // 53
                                                                                                                       // 54
    // Value checks are not necessary for null or undefined values                                                     // 55
    if (Utility.isNotNullOrUndefined(val)) {                                                                           // 56
                                                                                                                       // 57
      // Check that value is of the correct type                                                                       // 58
      var typeError = doTypeChecks(def, val, op);                                                                      // 59
      if (typeError) {                                                                                                 // 60
        invalidKeys.push(Utility.errorObject(typeError, affectedKey, val, def, ss));                                   // 61
        return;                                                                                                        // 62
      }                                                                                                                // 63
                                                                                                                       // 64
      // Check value against allowedValues array                                                                       // 65
      if (def.allowedValues && !_.contains(def.allowedValues, val)) {                                                  // 66
        invalidKeys.push(Utility.errorObject("notAllowed", affectedKey, val, def, ss));                                // 67
        return;                                                                                                        // 68
      }                                                                                                                // 69
                                                                                                                       // 70
    }                                                                                                                  // 71
                                                                                                                       // 72
    // Perform custom validation                                                                                       // 73
    var lastDot = affectedKey.lastIndexOf('.');                                                                        // 74
    var fieldParentName = lastDot === -1 ? '' : affectedKey.slice(0, lastDot + 1);                                     // 75
    var validators = def.custom ? [def.custom] : [];                                                                   // 76
    validators = validators.concat(ss._validators).concat(SimpleSchema._validators);                                   // 77
    _.every(validators, function(validator) {                                                                          // 78
      var errorType = validator.call(_.extend({                                                                        // 79
        key: affectedKey,                                                                                              // 80
        genericKey: affectedKeyGeneric,                                                                                // 81
        definition: def,                                                                                               // 82
        isSet: (val !== void 0),                                                                                       // 83
        value: val,                                                                                                    // 84
        operator: op,                                                                                                  // 85
        field: function(fName) {                                                                                       // 86
          mDoc = mDoc || new MongoObject(obj, ss._blackboxKeys); //create if necessary, cache for speed                // 87
          var keyInfo = mDoc.getInfoForKey(fName) || {};                                                               // 88
          return {                                                                                                     // 89
            isSet: (keyInfo.value !== void 0),                                                                         // 90
            value: keyInfo.value,                                                                                      // 91
            operator: keyInfo.operator                                                                                 // 92
          };                                                                                                           // 93
        },                                                                                                             // 94
        siblingField: function(fName) {                                                                                // 95
          mDoc = mDoc || new MongoObject(obj, ss._blackboxKeys); //create if necessary, cache for speed                // 96
          var keyInfo = mDoc.getInfoForKey(fieldParentName + fName) || {};                                             // 97
          return {                                                                                                     // 98
            isSet: (keyInfo.value !== void 0),                                                                         // 99
            value: keyInfo.value,                                                                                      // 100
            operator: keyInfo.operator                                                                                 // 101
          };                                                                                                           // 102
        }                                                                                                              // 103
      }, extendedCustomContext || {}));                                                                                // 104
      if (typeof errorType === "string") {                                                                             // 105
        invalidKeys.push(Utility.errorObject(errorType, affectedKey, val, def, ss));                                   // 106
        return false;                                                                                                  // 107
      }                                                                                                                // 108
      return true;                                                                                                     // 109
    });                                                                                                                // 110
  }                                                                                                                    // 111
                                                                                                                       // 112
  // The recursive function                                                                                            // 113
  function checkObj(val, affectedKey, skipRequiredCheck, strictRequiredCheck) {                                        // 114
    var affectedKeyGeneric, def;                                                                                       // 115
                                                                                                                       // 116
    if (affectedKey) {                                                                                                 // 117
                                                                                                                       // 118
      // When we hit a blackbox key, we don't progress any further                                                     // 119
      if (ss.keyIsInBlackBox(affectedKey)) {                                                                           // 120
        return;                                                                                                        // 121
      }                                                                                                                // 122
                                                                                                                       // 123
      // Make a generic version of the affected key, and use that                                                      // 124
      // to get the schema for this key.                                                                               // 125
      affectedKeyGeneric = SimpleSchema._makeGeneric(affectedKey);                                                     // 126
      def = ss.getDefinition(affectedKey);                                                                             // 127
                                                                                                                       // 128
      // Perform validation for this key                                                                               // 129
      if (!keyToValidate || keyToValidate === affectedKey || keyToValidate === affectedKeyGeneric) {                   // 130
        validate(val, affectedKey, affectedKeyGeneric, def, null, skipRequiredCheck, strictRequiredCheck);             // 131
      }                                                                                                                // 132
    }                                                                                                                  // 133
                                                                                                                       // 134
    // Temporarily convert missing objects to empty objects                                                            // 135
    // so that the looping code will be called and required                                                            // 136
    // descendent keys can be validated.                                                                               // 137
    if ((val === void 0 || val === null) && (!def || (def.type === Object && !def.optional))) {                        // 138
      val = {};                                                                                                        // 139
    }                                                                                                                  // 140
                                                                                                                       // 141
    // Loop through arrays                                                                                             // 142
    if (_.isArray(val)) {                                                                                              // 143
      _.each(val, function(v, i) {                                                                                     // 144
        checkObj(v, affectedKey + '.' + i);                                                                            // 145
      });                                                                                                              // 146
    }                                                                                                                  // 147
                                                                                                                       // 148
    // Loop through object keys                                                                                        // 149
    else if (Utility.isBasicObject(val) && (!def || !def.blackbox)) {                                                  // 150
                                                                                                                       // 151
      // Get list of present keys                                                                                      // 152
      var presentKeys = _.keys(val);                                                                                   // 153
                                                                                                                       // 154
      // Check all present keys plus all keys defined by the schema.                                                   // 155
      // This allows us to detect extra keys not allowed by the schema plus                                            // 156
      // any missing required keys, and to run any custom functions for other keys.                                    // 157
      var keysToCheck = _.union(presentKeys, ss._schemaKeys);                                                          // 158
                                                                                                                       // 159
      // If this object is within an array, make sure we check for                                                     // 160
      // required as if it's not a modifier                                                                            // 161
      var strictRequiredCheck = (affectedKeyGeneric && affectedKeyGeneric.slice(-2) === ".$");                         // 162
                                                                                                                       // 163
      // Check all keys in the merged list                                                                             // 164
      _.each(keysToCheck, function(key) {                                                                              // 165
        if (Utility.shouldCheck(key)) {                                                                                // 166
          checkObj(val[key], Utility.appendAffectedKey(affectedKey, key), skipRequiredCheck, strictRequiredCheck);     // 167
        }                                                                                                              // 168
      });                                                                                                              // 169
    }                                                                                                                  // 170
                                                                                                                       // 171
  }                                                                                                                    // 172
                                                                                                                       // 173
  // Kick off the validation                                                                                           // 174
  checkObj(obj);                                                                                                       // 175
                                                                                                                       // 176
  // Make sure there is only one error per fieldName                                                                   // 177
  var addedFieldNames = [];                                                                                            // 178
  invalidKeys = _.filter(invalidKeys, function(errObj) {                                                               // 179
    if (!_.contains(addedFieldNames, errObj.name)) {                                                                   // 180
      addedFieldNames.push(errObj.name);                                                                               // 181
      return true;                                                                                                     // 182
    }                                                                                                                  // 183
    return false;                                                                                                      // 184
  });                                                                                                                  // 185
                                                                                                                       // 186
  return invalidKeys;                                                                                                  // 187
};                                                                                                                     // 188
                                                                                                                       // 189
function convertModifierToDoc(mod, schema, isUpsert) {                                                                 // 190
  // Create unmanaged LocalCollection as scratchpad                                                                    // 191
  var t = new Meteor.Collection(null);                                                                                 // 192
                                                                                                                       // 193
  // LocalCollections are in memory, and it seems                                                                      // 194
  // that it's fine to use them synchronously on                                                                       // 195
  // either client or server                                                                                           // 196
  var id;                                                                                                              // 197
  if (isUpsert) {                                                                                                      // 198
    // We assume upserts will be inserts (conservative                                                                 // 199
    // validation of requiredness)                                                                                     // 200
    id = Random.id();                                                                                                  // 201
    t.upsert({_id: id}, mod);                                                                                          // 202
  } else {                                                                                                             // 203
    var mDoc = new MongoObject(mod);                                                                                   // 204
    // Create a ficticious existing document                                                                           // 205
    var fakeDoc = new MongoObject({});                                                                                 // 206
    _.each(schema, function (def, fieldName) {                                                                         // 207
      var setVal;                                                                                                      // 208
      // Prefill doc with empty arrays to avoid the                                                                    // 209
      // mongodb issue where it does not understand                                                                    // 210
      // that numeric pieces should create arrays.                                                                     // 211
      if (def.type === Array && mDoc.affectsGenericKey(fieldName)) {                                                   // 212
        setVal = [];                                                                                                   // 213
      }                                                                                                                // 214
      // Set dummy values for required fields because                                                                  // 215
      // we assume any existing data would be valid.                                                                   // 216
      else if (!def.optional) {                                                                                        // 217
        // TODO correct value type based on schema type                                                                // 218
        if (def.type === Boolean)                                                                                      // 219
          setVal = true;                                                                                               // 220
        else if (def.type === Number)                                                                                  // 221
          setVal = def.min || 0;                                                                                       // 222
        else if (def.type === Date)                                                                                    // 223
          setVal = def.min || new Date;                                                                                // 224
        else if (def.type === Array)                                                                                   // 225
          setVal = [];                                                                                                 // 226
        else if (def.type === Object)                                                                                  // 227
          setVal = {};                                                                                                 // 228
        else                                                                                                           // 229
          setVal = "0";                                                                                                // 230
      }                                                                                                                // 231
                                                                                                                       // 232
      if (setVal !== void 0) {                                                                                         // 233
        var key = fieldName.replace(/\.\$/g, ".0");                                                                    // 234
        var pos = MongoObject._keyToPosition(key, false);                                                              // 235
        fakeDoc.setValueForPosition(pos, setVal);                                                                      // 236
      }                                                                                                                // 237
    });                                                                                                                // 238
    fakeDoc = fakeDoc.getObject();                                                                                     // 239
    // Insert fake doc into local scratch collection                                                                   // 240
    id = t.insert(fakeDoc);                                                                                            // 241
    // Now update it with the modifier                                                                                 // 242
    t.update(id, mod);                                                                                                 // 243
  }                                                                                                                    // 244
                                                                                                                       // 245
  var doc = t.findOne(id);                                                                                             // 246
  // We're done with it                                                                                                // 247
  t.remove(id);                                                                                                        // 248
  // Currently we don't validate _id unless it is                                                                      // 249
  // explicitly added to the schema                                                                                    // 250
  if (!schema._id) {                                                                                                   // 251
    delete doc._id;                                                                                                    // 252
  }                                                                                                                    // 253
  return doc;                                                                                                          // 254
}                                                                                                                      // 255
                                                                                                                       // 256
function doTypeChecks(def, keyValue, op) {                                                                             // 257
  var expectedType = def.type;                                                                                         // 258
                                                                                                                       // 259
  // String checks                                                                                                     // 260
  if (expectedType === String) {                                                                                       // 261
    if (typeof keyValue !== "string") {                                                                                // 262
      return "expectedString";                                                                                         // 263
    } else if (def.max !== null && def.max < keyValue.length) {                                                        // 264
      return "maxString";                                                                                              // 265
    } else if (def.min !== null && def.min > keyValue.length) {                                                        // 266
      return "minString";                                                                                              // 267
    } else if (def.regEx instanceof RegExp && !def.regEx.test(keyValue)) {                                             // 268
      return "regEx";                                                                                                  // 269
    } else if (_.isArray(def.regEx)) {                                                                                 // 270
      var regExError;                                                                                                  // 271
      _.every(def.regEx, function(re, i) {                                                                             // 272
        if (!re.test(keyValue)) {                                                                                      // 273
          regExError = "regEx." + i;                                                                                   // 274
          return false;                                                                                                // 275
        }                                                                                                              // 276
        return true;                                                                                                   // 277
      });                                                                                                              // 278
      if (regExError)                                                                                                  // 279
        return regExError;                                                                                             // 280
    }                                                                                                                  // 281
  }                                                                                                                    // 282
                                                                                                                       // 283
  // Number checks                                                                                                     // 284
  else if (expectedType === Number) {                                                                                  // 285
    if (typeof keyValue !== "number" || isNaN(keyValue)) {                                                             // 286
      return "expectedNumber";                                                                                         // 287
    } else if (op !== "$inc" && def.max !== null && def.max < keyValue) {                                              // 288
      return "maxNumber";                                                                                              // 289
    } else if (op !== "$inc" && def.min !== null && def.min > keyValue) {                                              // 290
      return "minNumber";                                                                                              // 291
    } else if (!def.decimal && keyValue.toString().indexOf(".") > -1) {                                                // 292
      return "noDecimal";                                                                                              // 293
    }                                                                                                                  // 294
  }                                                                                                                    // 295
                                                                                                                       // 296
  // Boolean checks                                                                                                    // 297
  else if (expectedType === Boolean) {                                                                                 // 298
    if (typeof keyValue !== "boolean") {                                                                               // 299
      return "expectedBoolean";                                                                                        // 300
    }                                                                                                                  // 301
  }                                                                                                                    // 302
                                                                                                                       // 303
  // Object checks                                                                                                     // 304
  else if (expectedType === Object) {                                                                                  // 305
    if (!Utility.isBasicObject(keyValue)) {                                                                            // 306
      return "expectedObject";                                                                                         // 307
    }                                                                                                                  // 308
  }                                                                                                                    // 309
                                                                                                                       // 310
  // Array checks                                                                                                      // 311
  else if (expectedType === Array) {                                                                                   // 312
    if (!_.isArray(keyValue)) {                                                                                        // 313
      return "expectedArray";                                                                                          // 314
    } else if (def.minCount !== null && keyValue.length < def.minCount) {                                              // 315
      return "minCount";                                                                                               // 316
    } else if (def.maxCount !== null && keyValue.length > def.maxCount) {                                              // 317
      return "maxCount";                                                                                               // 318
    }                                                                                                                  // 319
  }                                                                                                                    // 320
                                                                                                                       // 321
  // Constructor function checks                                                                                       // 322
  else if (expectedType instanceof Function || Utility.safariBugFix(expectedType)) {                                   // 323
                                                                                                                       // 324
    // Generic constructor checks                                                                                      // 325
    if (!(keyValue instanceof expectedType)) {                                                                         // 326
      return "expectedConstructor";                                                                                    // 327
    }                                                                                                                  // 328
                                                                                                                       // 329
    // Date checks                                                                                                     // 330
    else if (expectedType === Date) {                                                                                  // 331
      if (_.isDate(def.min) && def.min.getTime() > keyValue.getTime()) {                                               // 332
        return "minDate";                                                                                              // 333
      } else if (_.isDate(def.max) && def.max.getTime() < keyValue.getTime()) {                                        // 334
        return "maxDate";                                                                                              // 335
      }                                                                                                                // 336
    }                                                                                                                  // 337
  }                                                                                                                    // 338
                                                                                                                       // 339
}                                                                                                                      // 340
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                     //
// packages/aldeed:simple-schema/simple-schema-context.js                                                              //
//                                                                                                                     //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                       //
/*                                                                                                                     // 1
 * PUBLIC API                                                                                                          // 2
 */                                                                                                                    // 3
                                                                                                                       // 4
SimpleSchemaValidationContext = function SimpleSchemaValidationContext(ss) {                                           // 5
  var self = this;                                                                                                     // 6
  self._simpleSchema = ss;                                                                                             // 7
  self._schema = ss.schema();                                                                                          // 8
  self._schemaKeys = _.keys(self._schema);                                                                             // 9
  self._invalidKeys = [];                                                                                              // 10
  //set up validation dependencies                                                                                     // 11
  self._deps = {};                                                                                                     // 12
  self._depsAny = new Deps.Dependency;                                                                                 // 13
  _.each(self._schemaKeys, function(name) {                                                                            // 14
    self._deps[name] = new Deps.Dependency;                                                                            // 15
  });                                                                                                                  // 16
};                                                                                                                     // 17
                                                                                                                       // 18
//validates the object against the simple schema and sets a reactive array of error objects                            // 19
SimpleSchemaValidationContext.prototype.validate = function SimpleSchemaValidationContext_validate(doc, options) {     // 20
  var self = this;                                                                                                     // 21
  options = _.extend({                                                                                                 // 22
    modifier: false,                                                                                                   // 23
    upsert: false,                                                                                                     // 24
    extendedCustomContext: {}                                                                                          // 25
  }, options || {});                                                                                                   // 26
                                                                                                                       // 27
  //on the client we can add the userId if not already in the custom context                                           // 28
  if (Meteor.isClient && options.extendedCustomContext.userId === void 0) {                                            // 29
    options.extendedCustomContext.userId = (Meteor.userId && Meteor.userId()) || null;                                 // 30
  }                                                                                                                    // 31
                                                                                                                       // 32
  var invalidKeys = doValidation(doc, options.modifier, options.upsert, null, self._simpleSchema, options.extendedCustomContext);
                                                                                                                       // 34
  //now update self._invalidKeys and dependencies                                                                      // 35
                                                                                                                       // 36
  //note any currently invalid keys so that we can mark them as changed                                                // 37
  //due to new validation (they may be valid now, or invalid in a different way)                                       // 38
  var removedKeys = _.pluck(self._invalidKeys, "name");                                                                // 39
                                                                                                                       // 40
  //update                                                                                                             // 41
  self._invalidKeys = invalidKeys;                                                                                     // 42
                                                                                                                       // 43
  //add newly invalid keys to changedKeys                                                                              // 44
  var addedKeys = _.pluck(self._invalidKeys, "name");                                                                  // 45
                                                                                                                       // 46
  //mark all changed keys as changed                                                                                   // 47
  var changedKeys = _.union(addedKeys, removedKeys);                                                                   // 48
  self._markKeysChanged(changedKeys);                                                                                  // 49
                                                                                                                       // 50
  // Return true if it was valid; otherwise, return false                                                              // 51
  return self._invalidKeys.length === 0;                                                                               // 52
};                                                                                                                     // 53
                                                                                                                       // 54
//validates doc against self._schema for one key and sets a reactive array of error objects                            // 55
SimpleSchemaValidationContext.prototype.validateOne = function SimpleSchemaValidationContext_validateOne(doc, keyName, options) {
  var self = this;                                                                                                     // 57
  options = _.extend({                                                                                                 // 58
    modifier: false,                                                                                                   // 59
    upsert: false,                                                                                                     // 60
    extendedCustomContext: {}                                                                                          // 61
  }, options || {});                                                                                                   // 62
                                                                                                                       // 63
  //on the client we can add the userId if not already in the custom context                                           // 64
  if (Meteor.isClient && options.extendedCustomContext.userId === void 0) {                                            // 65
    options.extendedCustomContext.userId = (Meteor.userId && Meteor.userId()) || null;                                 // 66
  }                                                                                                                    // 67
                                                                                                                       // 68
  var invalidKeys = doValidation(doc, options.modifier, options.upsert, keyName, self._simpleSchema, options.extendedCustomContext);
                                                                                                                       // 70
  //now update self._invalidKeys and dependencies                                                                      // 71
                                                                                                                       // 72
  //remove objects from self._invalidKeys where name = keyName                                                         // 73
  var newInvalidKeys = [];                                                                                             // 74
  for (var i = 0, ln = self._invalidKeys.length, k; i < ln; i++) {                                                     // 75
    k = self._invalidKeys[i];                                                                                          // 76
    if (k.name !== keyName) {                                                                                          // 77
      newInvalidKeys.push(k);                                                                                          // 78
    }                                                                                                                  // 79
  }                                                                                                                    // 80
  self._invalidKeys = newInvalidKeys;                                                                                  // 81
                                                                                                                       // 82
  //merge invalidKeys into self._invalidKeys                                                                           // 83
  for (var i = 0, ln = invalidKeys.length, k; i < ln; i++) {                                                           // 84
    k = invalidKeys[i];                                                                                                // 85
    self._invalidKeys.push(k);                                                                                         // 86
  }                                                                                                                    // 87
                                                                                                                       // 88
  //mark key as changed due to new validation (they may be valid now, or invalid in a different way)                   // 89
  self._markKeysChanged([keyName]);                                                                                    // 90
                                                                                                                       // 91
  // Return true if it was valid; otherwise, return false                                                              // 92
  return !self._keyIsInvalid(keyName);                                                                                 // 93
};                                                                                                                     // 94
                                                                                                                       // 95
function doValidation(obj, isModifier, isUpsert, keyToValidate, ss, extendedCustomContext) {                           // 96
  var useOld = true; //for now this can be manually changed to try the experimental method, which doesn't yet work properly
  var func = useOld ? doValidation1 : doValidation2;                                                                   // 98
  return func(obj, isModifier, isUpsert, keyToValidate, ss, extendedCustomContext);                                    // 99
}                                                                                                                      // 100
                                                                                                                       // 101
//reset the invalidKeys array                                                                                          // 102
SimpleSchemaValidationContext.prototype.resetValidation = function SimpleSchemaValidationContext_resetValidation() {   // 103
  var self = this;                                                                                                     // 104
  var removedKeys = _.pluck(self._invalidKeys, "name");                                                                // 105
  self._invalidKeys = [];                                                                                              // 106
  self._markKeysChanged(removedKeys);                                                                                  // 107
};                                                                                                                     // 108
                                                                                                                       // 109
SimpleSchemaValidationContext.prototype.isValid = function SimpleSchemaValidationContext_isValid() {                   // 110
  var self = this;                                                                                                     // 111
  self._depsAny.depend();                                                                                              // 112
  return !self._invalidKeys.length;                                                                                    // 113
};                                                                                                                     // 114
                                                                                                                       // 115
SimpleSchemaValidationContext.prototype.invalidKeys = function SimpleSchemaValidationContext_invalidKeys() {           // 116
  var self = this;                                                                                                     // 117
  self._depsAny.depend();                                                                                              // 118
  return self._invalidKeys;                                                                                            // 119
};                                                                                                                     // 120
                                                                                                                       // 121
SimpleSchemaValidationContext.prototype.addInvalidKeys = function SimpleSchemaValidationContext_addInvalidKeys(errors) {
  var self = this;                                                                                                     // 123
                                                                                                                       // 124
  if (!errors || !errors.length)                                                                                       // 125
    return;                                                                                                            // 126
                                                                                                                       // 127
  var changedKeys = [];                                                                                                // 128
  _.each(errors, function (errorObject) {                                                                              // 129
    changedKeys.push(errorObject.name);                                                                                // 130
    self._invalidKeys.push(errorObject);                                                                               // 131
  });                                                                                                                  // 132
                                                                                                                       // 133
  self._markKeysChanged(changedKeys);                                                                                  // 134
};                                                                                                                     // 135
                                                                                                                       // 136
SimpleSchemaValidationContext.prototype._markKeysChanged = function SimpleSchemaValidationContext__markKeysChanged(keys) {
  var self = this;                                                                                                     // 138
                                                                                                                       // 139
  if (!keys || !keys.length)                                                                                           // 140
    return;                                                                                                            // 141
                                                                                                                       // 142
  _.each(keys, function(name) {                                                                                        // 143
    var genericName = SimpleSchema._makeGeneric(name);                                                                 // 144
    if (genericName in self._deps) {                                                                                   // 145
      self._deps[genericName].changed();                                                                               // 146
    }                                                                                                                  // 147
  });                                                                                                                  // 148
  self._depsAny.changed();                                                                                             // 149
};                                                                                                                     // 150
                                                                                                                       // 151
SimpleSchemaValidationContext.prototype._getInvalidKeyObject = function SimpleSchemaValidationContext__getInvalidKeyObject(name, genericName) {
  var self = this;                                                                                                     // 153
  genericName = genericName || SimpleSchema._makeGeneric(name);                                                        // 154
                                                                                                                       // 155
  var errorObj = _.findWhere(self._invalidKeys, {name: name});                                                         // 156
  if (!errorObj) {                                                                                                     // 157
    errorObj = _.findWhere(self._invalidKeys, {name: genericName});                                                    // 158
  }                                                                                                                    // 159
  return errorObj;                                                                                                     // 160
};                                                                                                                     // 161
                                                                                                                       // 162
SimpleSchemaValidationContext.prototype._keyIsInvalid = function SimpleSchemaValidationContext__keyIsInvalid(name, genericName) {
  return !!this._getInvalidKeyObject(name, genericName);                                                               // 164
};                                                                                                                     // 165
                                                                                                                       // 166
// Like the internal one, but with deps                                                                                // 167
SimpleSchemaValidationContext.prototype.keyIsInvalid = function SimpleSchemaValidationContext_keyIsInvalid(name) {     // 168
  var self = this, genericName = SimpleSchema._makeGeneric(name);                                                      // 169
  self._deps[genericName] && self._deps[genericName].depend();                                                         // 170
                                                                                                                       // 171
  return self._keyIsInvalid(name, genericName);                                                                        // 172
};                                                                                                                     // 173
                                                                                                                       // 174
SimpleSchemaValidationContext.prototype.keyErrorMessage = function SimpleSchemaValidationContext_keyErrorMessage(name) {
  var self = this, genericName = SimpleSchema._makeGeneric(name);                                                      // 176
  self._deps[genericName] && self._deps[genericName].depend();                                                         // 177
                                                                                                                       // 178
  var errorObj = self._getInvalidKeyObject(name, genericName);                                                         // 179
  if (!errorObj) {                                                                                                     // 180
    return "";                                                                                                         // 181
  }                                                                                                                    // 182
                                                                                                                       // 183
  return self._simpleSchema.messageForError(errorObj.type, errorObj.name, null, errorObj.value);                       // 184
};                                                                                                                     // 185
                                                                                                                       // 186
SimpleSchemaValidationContext.prototype.getErrorObject = function SimpleSchemaValidationContext_getErrorObject(context) {
  var self = this, message, invalidKeys = this._invalidKeys;                                                           // 188
  if (invalidKeys.length) {                                                                                            // 189
    message = self.keyErrorMessage(invalidKeys[0].name);                                                               // 190
    // We add `message` prop to the invalidKeys.                                                                       // 191
    invalidKeys = _.map(invalidKeys, function (o) {                                                                    // 192
      return _.extend({message: self.keyErrorMessage(o.name)}, o);                                                     // 193
    });                                                                                                                // 194
  } else {                                                                                                             // 195
    message = "Failed validation";                                                                                     // 196
  }                                                                                                                    // 197
  var error = new Error(message);                                                                                      // 198
  error.invalidKeys = invalidKeys;                                                                                     // 199
  // If on the server, we add a sanitized error, too, in case we're                                                    // 200
  // called from a method.                                                                                             // 201
  if (Meteor.isServer) {                                                                                               // 202
    error.sanitizedError = new Meteor.Error(400, message);                                                             // 203
  }                                                                                                                    // 204
  return error;                                                                                                        // 205
};                                                                                                                     // 206
                                                                                                                       // 207
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:simple-schema'] = {
  SimpleSchema: SimpleSchema,
  MongoObject: MongoObject
};

})();

//# sourceMappingURL=aldeed_simple-schema.js.map
