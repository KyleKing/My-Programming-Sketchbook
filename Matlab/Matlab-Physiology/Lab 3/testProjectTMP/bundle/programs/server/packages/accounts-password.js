(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var NpmModuleBcrypt = Package['npm-bcrypt'].NpmModuleBcrypt;
var Accounts = Package['accounts-base'].Accounts;
var SRP = Package.srp.SRP;
var SHA256 = Package.sha.SHA256;
var Email = Package.email.Email;
var Random = Package.random.Random;
var check = Package.check.check;
var Match = Package.check.Match;
var _ = Package.underscore._;
var DDP = Package.ddp.DDP;
var DDPServer = Package.ddp.DDPServer;

(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/accounts-password/email_templates.js                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/**                                                                                        // 1
 * @summary Options to customize emails sent from the Accounts system.                     // 2
 * @locus Server                                                                           // 3
 */                                                                                        // 4
Accounts.emailTemplates = {                                                                // 5
  from: "Meteor Accounts <no-reply@meteor.com>",                                           // 6
  siteName: Meteor.absoluteUrl().replace(/^https?:\/\//, '').replace(/\/$/, ''),           // 7
                                                                                           // 8
  resetPassword: {                                                                         // 9
    subject: function(user) {                                                              // 10
      return "How to reset your password on " + Accounts.emailTemplates.siteName;          // 11
    },                                                                                     // 12
    text: function(user, url) {                                                            // 13
      var greeting = (user.profile && user.profile.name) ?                                 // 14
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 15
      return greeting + "\n"                                                               // 16
        + "\n"                                                                             // 17
        + "To reset your password, simply click the link below.\n"                         // 18
        + "\n"                                                                             // 19
        + url + "\n"                                                                       // 20
        + "\n"                                                                             // 21
        + "Thanks.\n";                                                                     // 22
    }                                                                                      // 23
  },                                                                                       // 24
  verifyEmail: {                                                                           // 25
    subject: function(user) {                                                              // 26
      return "How to verify email address on " + Accounts.emailTemplates.siteName;         // 27
    },                                                                                     // 28
    text: function(user, url) {                                                            // 29
      var greeting = (user.profile && user.profile.name) ?                                 // 30
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 31
      return greeting + "\n"                                                               // 32
        + "\n"                                                                             // 33
        + "To verify your account email, simply click the link below.\n"                   // 34
        + "\n"                                                                             // 35
        + url + "\n"                                                                       // 36
        + "\n"                                                                             // 37
        + "Thanks.\n";                                                                     // 38
    }                                                                                      // 39
  },                                                                                       // 40
  enrollAccount: {                                                                         // 41
    subject: function(user) {                                                              // 42
      return "An account has been created for you on " + Accounts.emailTemplates.siteName; // 43
    },                                                                                     // 44
    text: function(user, url) {                                                            // 45
      var greeting = (user.profile && user.profile.name) ?                                 // 46
            ("Hello " + user.profile.name + ",") : "Hello,";                               // 47
      return greeting + "\n"                                                               // 48
        + "\n"                                                                             // 49
        + "To start using the service, simply click the link below.\n"                     // 50
        + "\n"                                                                             // 51
        + url + "\n"                                                                       // 52
        + "\n"                                                                             // 53
        + "Thanks.\n";                                                                     // 54
    }                                                                                      // 55
  }                                                                                        // 56
};                                                                                         // 57
                                                                                           // 58
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function () {

/////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                         //
// packages/accounts-password/password_server.js                                           //
//                                                                                         //
/////////////////////////////////////////////////////////////////////////////////////////////
                                                                                           //
/// BCRYPT                                                                                 // 1
                                                                                           // 2
var bcrypt = NpmModuleBcrypt;                                                              // 3
var bcryptHash = Meteor.wrapAsync(bcrypt.hash);                                            // 4
var bcryptCompare = Meteor.wrapAsync(bcrypt.compare);                                      // 5
                                                                                           // 6
// User records have a 'services.password.bcrypt' field on them to hold                    // 7
// their hashed passwords (unless they have a 'services.password.srp'                      // 8
// field, in which case they will be upgraded to bcrypt the next time                      // 9
// they log in).                                                                           // 10
//                                                                                         // 11
// When the client sends a password to the server, it can either be a                      // 12
// string (the plaintext password) or an object with keys 'digest' and                     // 13
// 'algorithm' (must be "sha-256" for now). The Meteor client always sends                 // 14
// password objects { digest: *, algorithm: "sha-256" }, but DDP clients                   // 15
// that don't have access to SHA can just send plaintext passwords as                      // 16
// strings.                                                                                // 17
//                                                                                         // 18
// When the server receives a plaintext password as a string, it always                    // 19
// hashes it with SHA256 before passing it into bcrypt. When the server                    // 20
// receives a password as an object, it asserts that the algorithm is                      // 21
// "sha-256" and then passes the digest to bcrypt.                                         // 22
                                                                                           // 23
                                                                                           // 24
Accounts._bcryptRounds = 10;                                                               // 25
                                                                                           // 26
// Given a 'password' from the client, extract the string that we should                   // 27
// bcrypt. 'password' can be one of:                                                       // 28
//  - String (the plaintext password)                                                      // 29
//  - Object with 'digest' and 'algorithm' keys. 'algorithm' must be "sha-256".            // 30
//                                                                                         // 31
var getPasswordString = function (password) {                                              // 32
  if (typeof password === "string") {                                                      // 33
    password = SHA256(password);                                                           // 34
  } else { // 'password' is an object                                                      // 35
    if (password.algorithm !== "sha-256") {                                                // 36
      throw new Error("Invalid password hash algorithm. " +                                // 37
                      "Only 'sha-256' is allowed.");                                       // 38
    }                                                                                      // 39
    password = password.digest;                                                            // 40
  }                                                                                        // 41
  return password;                                                                         // 42
};                                                                                         // 43
                                                                                           // 44
// Use bcrypt to hash the password for storage in the database.                            // 45
// `password` can be a string (in which case it will be run through                        // 46
// SHA256 before bcrypt) or an object with properties `digest` and                         // 47
// `algorithm` (in which case we bcrypt `password.digest`).                                // 48
//                                                                                         // 49
var hashPassword = function (password) {                                                   // 50
  password = getPasswordString(password);                                                  // 51
  return bcryptHash(password, Accounts._bcryptRounds);                                     // 52
};                                                                                         // 53
                                                                                           // 54
// Check whether the provided password matches the bcrypt'ed password in                   // 55
// the database user record. `password` can be a string (in which case                     // 56
// it will be run through SHA256 before bcrypt) or an object with                          // 57
// properties `digest` and `algorithm` (in which case we bcrypt                            // 58
// `password.digest`).                                                                     // 59
//                                                                                         // 60
Accounts._checkPassword = function (user, password) {                                      // 61
  var result = {                                                                           // 62
    userId: user._id                                                                       // 63
  };                                                                                       // 64
                                                                                           // 65
  password = getPasswordString(password);                                                  // 66
                                                                                           // 67
  if (! bcryptCompare(password, user.services.password.bcrypt)) {                          // 68
    result.error = new Meteor.Error(403, "Incorrect password");                            // 69
  }                                                                                        // 70
                                                                                           // 71
  return result;                                                                           // 72
};                                                                                         // 73
var checkPassword = Accounts._checkPassword;                                               // 74
                                                                                           // 75
///                                                                                        // 76
/// LOGIN                                                                                  // 77
///                                                                                        // 78
                                                                                           // 79
// Users can specify various keys to identify themselves with.                             // 80
// @param user {Object} with one of `id`, `username`, or `email`.                          // 81
// @returns A selector to pass to mongo to get the user record.                            // 82
                                                                                           // 83
var selectorFromUserQuery = function (user) {                                              // 84
  if (user.id)                                                                             // 85
    return {_id: user.id};                                                                 // 86
  else if (user.username)                                                                  // 87
    return {username: user.username};                                                      // 88
  else if (user.email)                                                                     // 89
    return {"emails.address": user.email};                                                 // 90
  throw new Error("shouldn't happen (validation missed something)");                       // 91
};                                                                                         // 92
                                                                                           // 93
var findUserFromUserQuery = function (user) {                                              // 94
  var selector = selectorFromUserQuery(user);                                              // 95
                                                                                           // 96
  var user = Meteor.users.findOne(selector);                                               // 97
  if (!user)                                                                               // 98
    throw new Meteor.Error(403, "User not found");                                         // 99
                                                                                           // 100
  return user;                                                                             // 101
};                                                                                         // 102
                                                                                           // 103
// XXX maybe this belongs in the check package                                             // 104
var NonEmptyString = Match.Where(function (x) {                                            // 105
  check(x, String);                                                                        // 106
  return x.length > 0;                                                                     // 107
});                                                                                        // 108
                                                                                           // 109
var userQueryValidator = Match.Where(function (user) {                                     // 110
  check(user, {                                                                            // 111
    id: Match.Optional(NonEmptyString),                                                    // 112
    username: Match.Optional(NonEmptyString),                                              // 113
    email: Match.Optional(NonEmptyString)                                                  // 114
  });                                                                                      // 115
  if (_.keys(user).length !== 1)                                                           // 116
    throw new Match.Error("User property must have exactly one field");                    // 117
  return true;                                                                             // 118
});                                                                                        // 119
                                                                                           // 120
var passwordValidator = Match.OneOf(                                                       // 121
  String,                                                                                  // 122
  { digest: String, algorithm: String }                                                    // 123
);                                                                                         // 124
                                                                                           // 125
// Handler to login with a password.                                                       // 126
//                                                                                         // 127
// The Meteor client sets options.password to an object with keys                          // 128
// 'digest' (set to SHA256(password)) and 'algorithm' ("sha-256").                         // 129
//                                                                                         // 130
// For other DDP clients which don't have access to SHA, the handler                       // 131
// also accepts the plaintext password in options.password as a string.                    // 132
//                                                                                         // 133
// (It might be nice if servers could turn the plaintext password                          // 134
// option off. Or maybe it should be opt-in, not opt-out?                                  // 135
// Accounts.config option?)                                                                // 136
//                                                                                         // 137
// Note that neither password option is secure without SSL.                                // 138
//                                                                                         // 139
Accounts.registerLoginHandler("password", function (options) {                             // 140
  if (! options.password || options.srp)                                                   // 141
    return undefined; // don't handle                                                      // 142
                                                                                           // 143
  check(options, {                                                                         // 144
    user: userQueryValidator,                                                              // 145
    password: passwordValidator                                                            // 146
  });                                                                                      // 147
                                                                                           // 148
                                                                                           // 149
  var user = findUserFromUserQuery(options.user);                                          // 150
                                                                                           // 151
  if (!user.services || !user.services.password ||                                         // 152
      !(user.services.password.bcrypt || user.services.password.srp))                      // 153
    throw new Meteor.Error(403, "User has no password set");                               // 154
                                                                                           // 155
  if (!user.services.password.bcrypt) {                                                    // 156
    if (typeof options.password === "string") {                                            // 157
      // The client has presented a plaintext password, and the user is                    // 158
      // not upgraded to bcrypt yet. We don't attempt to tell the client                   // 159
      // to upgrade to bcrypt, because it might be a standalone DDP                        // 160
      // client doesn't know how to do such a thing.                                       // 161
      var verifier = user.services.password.srp;                                           // 162
      var newVerifier = SRP.generateVerifier(options.password, {                           // 163
        identity: verifier.identity, salt: verifier.salt});                                // 164
                                                                                           // 165
      if (verifier.verifier !== newVerifier.verifier) {                                    // 166
        return {                                                                           // 167
          userId: user._id,                                                                // 168
          error: new Meteor.Error(403, "Incorrect password")                               // 169
        };                                                                                 // 170
      }                                                                                    // 171
                                                                                           // 172
      return {userId: user._id};                                                           // 173
    } else {                                                                               // 174
      // Tell the client to use the SRP upgrade process.                                   // 175
      throw new Meteor.Error(400, "old password format", EJSON.stringify({                 // 176
        format: 'srp',                                                                     // 177
        identity: user.services.password.srp.identity                                      // 178
      }));                                                                                 // 179
    }                                                                                      // 180
  }                                                                                        // 181
                                                                                           // 182
  return checkPassword(                                                                    // 183
    user,                                                                                  // 184
    options.password                                                                       // 185
  );                                                                                       // 186
});                                                                                        // 187
                                                                                           // 188
// Handler to login using the SRP upgrade path. To use this login                          // 189
// handler, the client must provide:                                                       // 190
//   - srp: H(identity + ":" + password)                                                   // 191
//   - password: a string or an object with properties 'digest' and 'algorithm'            // 192
//                                                                                         // 193
// We use `options.srp` to verify that the client knows the correct                        // 194
// password without doing a full SRP flow. Once we've checked that, we                     // 195
// upgrade the user to bcrypt and remove the SRP information from the                      // 196
// user document.                                                                          // 197
//                                                                                         // 198
// The client ends up using this login handler after trying the normal                     // 199
// login handler (above), which throws an error telling the client to                      // 200
// try the SRP upgrade path.                                                               // 201
//                                                                                         // 202
// XXX COMPAT WITH 0.8.1.3                                                                 // 203
Accounts.registerLoginHandler("password", function (options) {                             // 204
  if (!options.srp || !options.password)                                                   // 205
    return undefined; // don't handle                                                      // 206
                                                                                           // 207
  check(options, {                                                                         // 208
    user: userQueryValidator,                                                              // 209
    srp: String,                                                                           // 210
    password: passwordValidator                                                            // 211
  });                                                                                      // 212
                                                                                           // 213
  var user = findUserFromUserQuery(options.user);                                          // 214
                                                                                           // 215
  // Check to see if another simultaneous login has already upgraded                       // 216
  // the user record to bcrypt.                                                            // 217
  if (user.services && user.services.password && user.services.password.bcrypt)            // 218
    return checkPassword(user, options.password);                                          // 219
                                                                                           // 220
  if (!(user.services && user.services.password && user.services.password.srp))            // 221
    throw new Meteor.Error(403, "User has no password set");                               // 222
                                                                                           // 223
  var v1 = user.services.password.srp.verifier;                                            // 224
  var v2 = SRP.generateVerifier(                                                           // 225
    null,                                                                                  // 226
    {                                                                                      // 227
      hashedIdentityAndPassword: options.srp,                                              // 228
      salt: user.services.password.srp.salt                                                // 229
    }                                                                                      // 230
  ).verifier;                                                                              // 231
  if (v1 !== v2)                                                                           // 232
    return {                                                                               // 233
      userId: user._id,                                                                    // 234
      error: new Meteor.Error(403, "Incorrect password")                                   // 235
    };                                                                                     // 236
                                                                                           // 237
  // Upgrade to bcrypt on successful login.                                                // 238
  var salted = hashPassword(options.password);                                             // 239
  Meteor.users.update(                                                                     // 240
    user._id,                                                                              // 241
    {                                                                                      // 242
      $unset: { 'services.password.srp': 1 },                                              // 243
      $set: { 'services.password.bcrypt': salted }                                         // 244
    }                                                                                      // 245
  );                                                                                       // 246
                                                                                           // 247
  return {userId: user._id};                                                               // 248
});                                                                                        // 249
                                                                                           // 250
                                                                                           // 251
///                                                                                        // 252
/// CHANGING                                                                               // 253
///                                                                                        // 254
                                                                                           // 255
// Let the user change their own password if they know the old                             // 256
// password. `oldPassword` and `newPassword` should be objects with keys                   // 257
// `digest` and `algorithm` (representing the SHA256 of the password).                     // 258
//                                                                                         // 259
// XXX COMPAT WITH 0.8.1.3                                                                 // 260
// Like the login method, if the user hasn't been upgraded from SRP to                     // 261
// bcrypt yet, then this method will throw an 'old password format'                        // 262
// error. The client should call the SRP upgrade login handler and then                    // 263
// retry this method again.                                                                // 264
//                                                                                         // 265
// UNLIKE the login method, there is no way to avoid getting SRP upgrade                   // 266
// errors thrown. The reasoning for this is that clients using this                        // 267
// method directly will need to be updated anyway because we no longer                     // 268
// support the SRP flow that they would have been doing to use this                        // 269
// method previously.                                                                      // 270
Meteor.methods({changePassword: function (oldPassword, newPassword) {                      // 271
  check(oldPassword, passwordValidator);                                                   // 272
  check(newPassword, passwordValidator);                                                   // 273
                                                                                           // 274
  if (!this.userId)                                                                        // 275
    throw new Meteor.Error(401, "Must be logged in");                                      // 276
                                                                                           // 277
  var user = Meteor.users.findOne(this.userId);                                            // 278
  if (!user)                                                                               // 279
    throw new Meteor.Error(403, "User not found");                                         // 280
                                                                                           // 281
  if (!user.services || !user.services.password ||                                         // 282
      (!user.services.password.bcrypt && !user.services.password.srp))                     // 283
    throw new Meteor.Error(403, "User has no password set");                               // 284
                                                                                           // 285
  if (! user.services.password.bcrypt) {                                                   // 286
    throw new Meteor.Error(400, "old password format", EJSON.stringify({                   // 287
      format: 'srp',                                                                       // 288
      identity: user.services.password.srp.identity                                        // 289
    }));                                                                                   // 290
  }                                                                                        // 291
                                                                                           // 292
  var result = checkPassword(user, oldPassword);                                           // 293
  if (result.error)                                                                        // 294
    throw result.error;                                                                    // 295
                                                                                           // 296
  var hashed = hashPassword(newPassword);                                                  // 297
                                                                                           // 298
  // It would be better if this removed ALL existing tokens and replaced                   // 299
  // the token for the current connection with a new one, but that would                   // 300
  // be tricky, so we'll settle for just replacing all tokens other than                   // 301
  // the one for the current connection.                                                   // 302
  var currentToken = Accounts._getLoginToken(this.connection.id);                          // 303
  Meteor.users.update(                                                                     // 304
    { _id: this.userId },                                                                  // 305
    {                                                                                      // 306
      $set: { 'services.password.bcrypt': hashed },                                        // 307
      $pull: {                                                                             // 308
        'services.resume.loginTokens': { hashedToken: { $ne: currentToken } }              // 309
      }                                                                                    // 310
    }                                                                                      // 311
  );                                                                                       // 312
                                                                                           // 313
  return {passwordChanged: true};                                                          // 314
}});                                                                                       // 315
                                                                                           // 316
                                                                                           // 317
// Force change the users password.                                                        // 318
                                                                                           // 319
/**                                                                                        // 320
 * @summary Forcibly change the password for a user.                                       // 321
 * @locus Server                                                                           // 322
 * @param {String} userId The id of the user to update.                                    // 323
 * @param {String} newPassword A new password for the user.                                // 324
 */                                                                                        // 325
Accounts.setPassword = function (userId, newPlaintextPassword) {                           // 326
  var user = Meteor.users.findOne(userId);                                                 // 327
  if (!user)                                                                               // 328
    throw new Meteor.Error(403, "User not found");                                         // 329
                                                                                           // 330
  Meteor.users.update(                                                                     // 331
    {_id: user._id},                                                                       // 332
    { $unset: {'services.password.srp': 1}, // XXX COMPAT WITH 0.8.1.3                     // 333
      $set: {'services.password.bcrypt': hashPassword(newPlaintextPassword)} }             // 334
  );                                                                                       // 335
};                                                                                         // 336
                                                                                           // 337
                                                                                           // 338
///                                                                                        // 339
/// RESETTING VIA EMAIL                                                                    // 340
///                                                                                        // 341
                                                                                           // 342
// Method called by a user to request a password reset email. This is                      // 343
// the start of the reset process.                                                         // 344
Meteor.methods({forgotPassword: function (options) {                                       // 345
  check(options, {email: String});                                                         // 346
                                                                                           // 347
  var user = Meteor.users.findOne({"emails.address": options.email});                      // 348
  if (!user)                                                                               // 349
    throw new Meteor.Error(403, "User not found");                                         // 350
                                                                                           // 351
  Accounts.sendResetPasswordEmail(user._id, options.email);                                // 352
}});                                                                                       // 353
                                                                                           // 354
// send the user an email with a link that when opened allows the user                     // 355
// to set a new password, without the old password.                                        // 356
                                                                                           // 357
/**                                                                                        // 358
 * @summary Send an email with a link the user can use to reset their password.            // 359
 * @locus Server                                                                           // 360
 * @param {String} userId The id of the user to send email to.                             // 361
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 */                                                                                        // 363
Accounts.sendResetPasswordEmail = function (userId, email) {                               // 364
  // Make sure the user exists, and email is one of their addresses.                       // 365
  var user = Meteor.users.findOne(userId);                                                 // 366
  if (!user)                                                                               // 367
    throw new Error("Can't find user");                                                    // 368
  // pick the first email if we weren't passed an email.                                   // 369
  if (!email && user.emails && user.emails[0])                                             // 370
    email = user.emails[0].address;                                                        // 371
  // make sure we have a valid email                                                       // 372
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))                 // 373
    throw new Error("No such email for user.");                                            // 374
                                                                                           // 375
  var token = Random.secret();                                                             // 376
  var when = new Date();                                                                   // 377
  var tokenRecord = {                                                                      // 378
    token: token,                                                                          // 379
    email: email,                                                                          // 380
    when: when                                                                             // 381
  };                                                                                       // 382
  Meteor.users.update(userId, {$set: {                                                     // 383
    "services.password.reset": tokenRecord                                                 // 384
  }});                                                                                     // 385
  // before passing to template, update user object with new token                         // 386
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                        // 387
                                                                                           // 388
  var resetPasswordUrl = Accounts.urls.resetPassword(token);                               // 389
                                                                                           // 390
  var options = {                                                                          // 391
    to: email,                                                                             // 392
    from: Accounts.emailTemplates.from,                                                    // 393
    subject: Accounts.emailTemplates.resetPassword.subject(user),                          // 394
    text: Accounts.emailTemplates.resetPassword.text(user, resetPasswordUrl)               // 395
  };                                                                                       // 396
                                                                                           // 397
  if (typeof Accounts.emailTemplates.resetPassword.html === 'function')                    // 398
    options.html =                                                                         // 399
      Accounts.emailTemplates.resetPassword.html(user, resetPasswordUrl);                  // 400
                                                                                           // 401
  Email.send(options);                                                                     // 402
};                                                                                         // 403
                                                                                           // 404
// send the user an email informing them that their account was created, with              // 405
// a link that when opened both marks their email as verified and forces them              // 406
// to choose their password. The email must be one of the addresses in the                 // 407
// user's emails field, or undefined to pick the first email automatically.                // 408
//                                                                                         // 409
// This is not called automatically. It must be called manually if you                     // 410
// want to use enrollment emails.                                                          // 411
                                                                                           // 412
/**                                                                                        // 413
 * @summary Send an email with a link the user can use to set their initial password.      // 414
 * @locus Server                                                                           // 415
 * @param {String} userId The id of the user to send email to.                             // 416
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first email in the list.
 */                                                                                        // 418
Accounts.sendEnrollmentEmail = function (userId, email) {                                  // 419
  // XXX refactor! This is basically identical to sendResetPasswordEmail.                  // 420
                                                                                           // 421
  // Make sure the user exists, and email is in their addresses.                           // 422
  var user = Meteor.users.findOne(userId);                                                 // 423
  if (!user)                                                                               // 424
    throw new Error("Can't find user");                                                    // 425
  // pick the first email if we weren't passed an email.                                   // 426
  if (!email && user.emails && user.emails[0])                                             // 427
    email = user.emails[0].address;                                                        // 428
  // make sure we have a valid email                                                       // 429
  if (!email || !_.contains(_.pluck(user.emails || [], 'address'), email))                 // 430
    throw new Error("No such email for user.");                                            // 431
                                                                                           // 432
  var token = Random.secret();                                                             // 433
  var when = new Date();                                                                   // 434
  var tokenRecord = {                                                                      // 435
    token: token,                                                                          // 436
    email: email,                                                                          // 437
    when: when                                                                             // 438
  };                                                                                       // 439
  Meteor.users.update(userId, {$set: {                                                     // 440
    "services.password.reset": tokenRecord                                                 // 441
  }});                                                                                     // 442
                                                                                           // 443
  // before passing to template, update user object with new token                         // 444
  Meteor._ensure(user, 'services', 'password').reset = tokenRecord;                        // 445
                                                                                           // 446
  var enrollAccountUrl = Accounts.urls.enrollAccount(token);                               // 447
                                                                                           // 448
  var options = {                                                                          // 449
    to: email,                                                                             // 450
    from: Accounts.emailTemplates.from,                                                    // 451
    subject: Accounts.emailTemplates.enrollAccount.subject(user),                          // 452
    text: Accounts.emailTemplates.enrollAccount.text(user, enrollAccountUrl)               // 453
  };                                                                                       // 454
                                                                                           // 455
  if (typeof Accounts.emailTemplates.enrollAccount.html === 'function')                    // 456
    options.html =                                                                         // 457
      Accounts.emailTemplates.enrollAccount.html(user, enrollAccountUrl);                  // 458
                                                                                           // 459
  Email.send(options);                                                                     // 460
};                                                                                         // 461
                                                                                           // 462
                                                                                           // 463
// Take token from sendResetPasswordEmail or sendEnrollmentEmail, change                   // 464
// the users password, and log them in.                                                    // 465
Meteor.methods({resetPassword: function (token, newPassword) {                             // 466
  var self = this;                                                                         // 467
  return Accounts._loginMethod(                                                            // 468
    self,                                                                                  // 469
    "resetPassword",                                                                       // 470
    arguments,                                                                             // 471
    "password",                                                                            // 472
    function () {                                                                          // 473
      check(token, String);                                                                // 474
      check(newPassword, passwordValidator);                                               // 475
                                                                                           // 476
      var user = Meteor.users.findOne({                                                    // 477
        "services.password.reset.token": token});                                          // 478
      if (!user)                                                                           // 479
        throw new Meteor.Error(403, "Token expired");                                      // 480
      var email = user.services.password.reset.email;                                      // 481
      if (!_.include(_.pluck(user.emails || [], 'address'), email))                        // 482
        return {                                                                           // 483
          userId: user._id,                                                                // 484
          error: new Meteor.Error(403, "Token has invalid email address")                  // 485
        };                                                                                 // 486
                                                                                           // 487
      var hashed = hashPassword(newPassword);                                              // 488
                                                                                           // 489
      // NOTE: We're about to invalidate tokens on the user, who we might be               // 490
      // logged in as. Make sure to avoid logging ourselves out if this                    // 491
      // happens. But also make sure not to leave the connection in a state                // 492
      // of having a bad token set if things fail.                                         // 493
      var oldToken = Accounts._getLoginToken(self.connection.id);                          // 494
      Accounts._setLoginToken(user._id, self.connection, null);                            // 495
      var resetToOldToken = function () {                                                  // 496
        Accounts._setLoginToken(user._id, self.connection, oldToken);                      // 497
      };                                                                                   // 498
                                                                                           // 499
      try {                                                                                // 500
        // Update the user record by:                                                      // 501
        // - Changing the password to the new one                                          // 502
        // - Forgetting about the reset token that was just used                           // 503
        // - Verifying their email, since they got the password reset via email.           // 504
        var affectedRecords = Meteor.users.update(                                         // 505
          {                                                                                // 506
            _id: user._id,                                                                 // 507
            'emails.address': email,                                                       // 508
            'services.password.reset.token': token                                         // 509
          },                                                                               // 510
          {$set: {'services.password.bcrypt': hashed,                                      // 511
                  'emails.$.verified': true},                                              // 512
           $unset: {'services.password.reset': 1,                                          // 513
                    'services.password.srp': 1}});                                         // 514
        if (affectedRecords !== 1)                                                         // 515
          return {                                                                         // 516
            userId: user._id,                                                              // 517
            error: new Meteor.Error(403, "Invalid email")                                  // 518
          };                                                                               // 519
      } catch (err) {                                                                      // 520
        resetToOldToken();                                                                 // 521
        throw err;                                                                         // 522
      }                                                                                    // 523
                                                                                           // 524
      // Replace all valid login tokens with new ones (changing                            // 525
      // password should invalidate existing sessions).                                    // 526
      Accounts._clearAllLoginTokens(user._id);                                             // 527
                                                                                           // 528
      return {userId: user._id};                                                           // 529
    }                                                                                      // 530
  );                                                                                       // 531
}});                                                                                       // 532
                                                                                           // 533
///                                                                                        // 534
/// EMAIL VERIFICATION                                                                     // 535
///                                                                                        // 536
                                                                                           // 537
                                                                                           // 538
// send the user an email with a link that when opened marks that                          // 539
// address as verified                                                                     // 540
                                                                                           // 541
/**                                                                                        // 542
 * @summary Send an email with a link the user can use verify their email address.         // 543
 * @locus Server                                                                           // 544
 * @param {String} userId The id of the user to send email to.                             // 545
 * @param {String} [email] Optional. Which address of the user's to send the email to. This address must be in the user's `emails` list. Defaults to the first unverified email in the list.
 */                                                                                        // 547
Accounts.sendVerificationEmail = function (userId, address) {                              // 548
  // XXX Also generate a link using which someone can delete this                          // 549
  // account if they own said address but weren't those who created                        // 550
  // this account.                                                                         // 551
                                                                                           // 552
  // Make sure the user exists, and address is one of their addresses.                     // 553
  var user = Meteor.users.findOne(userId);                                                 // 554
  if (!user)                                                                               // 555
    throw new Error("Can't find user");                                                    // 556
  // pick the first unverified address if we weren't passed an address.                    // 557
  if (!address) {                                                                          // 558
    var email = _.find(user.emails || [],                                                  // 559
                       function (e) { return !e.verified; });                              // 560
    address = (email || {}).address;                                                       // 561
  }                                                                                        // 562
  // make sure we have a valid address                                                     // 563
  if (!address || !_.contains(_.pluck(user.emails || [], 'address'), address))             // 564
    throw new Error("No such email address for user.");                                    // 565
                                                                                           // 566
                                                                                           // 567
  var tokenRecord = {                                                                      // 568
    token: Random.secret(),                                                                // 569
    address: address,                                                                      // 570
    when: new Date()};                                                                     // 571
  Meteor.users.update(                                                                     // 572
    {_id: userId},                                                                         // 573
    {$push: {'services.email.verificationTokens': tokenRecord}});                          // 574
                                                                                           // 575
  // before passing to template, update user object with new token                         // 576
  Meteor._ensure(user, 'services', 'email');                                               // 577
  if (!user.services.email.verificationTokens) {                                           // 578
    user.services.email.verificationTokens = [];                                           // 579
  }                                                                                        // 580
  user.services.email.verificationTokens.push(tokenRecord);                                // 581
                                                                                           // 582
  var verifyEmailUrl = Accounts.urls.verifyEmail(tokenRecord.token);                       // 583
                                                                                           // 584
  var options = {                                                                          // 585
    to: address,                                                                           // 586
    from: Accounts.emailTemplates.from,                                                    // 587
    subject: Accounts.emailTemplates.verifyEmail.subject(user),                            // 588
    text: Accounts.emailTemplates.verifyEmail.text(user, verifyEmailUrl)                   // 589
  };                                                                                       // 590
                                                                                           // 591
  if (typeof Accounts.emailTemplates.verifyEmail.html === 'function')                      // 592
    options.html =                                                                         // 593
      Accounts.emailTemplates.verifyEmail.html(user, verifyEmailUrl);                      // 594
                                                                                           // 595
  Email.send(options);                                                                     // 596
};                                                                                         // 597
                                                                                           // 598
// Take token from sendVerificationEmail, mark the email as verified,                      // 599
// and log them in.                                                                        // 600
Meteor.methods({verifyEmail: function (token) {                                            // 601
  var self = this;                                                                         // 602
  return Accounts._loginMethod(                                                            // 603
    self,                                                                                  // 604
    "verifyEmail",                                                                         // 605
    arguments,                                                                             // 606
    "password",                                                                            // 607
    function () {                                                                          // 608
      check(token, String);                                                                // 609
                                                                                           // 610
      var user = Meteor.users.findOne(                                                     // 611
        {'services.email.verificationTokens.token': token});                               // 612
      if (!user)                                                                           // 613
        throw new Meteor.Error(403, "Verify email link expired");                          // 614
                                                                                           // 615
      var tokenRecord = _.find(user.services.email.verificationTokens,                     // 616
                               function (t) {                                              // 617
                                 return t.token == token;                                  // 618
                               });                                                         // 619
      if (!tokenRecord)                                                                    // 620
        return {                                                                           // 621
          userId: user._id,                                                                // 622
          error: new Meteor.Error(403, "Verify email link expired")                        // 623
        };                                                                                 // 624
                                                                                           // 625
      var emailsRecord = _.find(user.emails, function (e) {                                // 626
        return e.address == tokenRecord.address;                                           // 627
      });                                                                                  // 628
      if (!emailsRecord)                                                                   // 629
        return {                                                                           // 630
          userId: user._id,                                                                // 631
          error: new Meteor.Error(403, "Verify email link is for unknown address")         // 632
        };                                                                                 // 633
                                                                                           // 634
      // By including the address in the query, we can use 'emails.$' in the               // 635
      // modifier to get a reference to the specific object in the emails                  // 636
      // array. See                                                                        // 637
      // http://www.mongodb.org/display/DOCS/Updating/#Updating-The%24positionaloperator)  // 638
      // http://www.mongodb.org/display/DOCS/Updating#Updating-%24pull                     // 639
      Meteor.users.update(                                                                 // 640
        {_id: user._id,                                                                    // 641
         'emails.address': tokenRecord.address},                                           // 642
        {$set: {'emails.$.verified': true},                                                // 643
         $pull: {'services.email.verificationTokens': {token: token}}});                   // 644
                                                                                           // 645
      return {userId: user._id};                                                           // 646
    }                                                                                      // 647
  );                                                                                       // 648
}});                                                                                       // 649
                                                                                           // 650
                                                                                           // 651
                                                                                           // 652
///                                                                                        // 653
/// CREATING USERS                                                                         // 654
///                                                                                        // 655
                                                                                           // 656
// Shared createUser function called from the createUser method, both                      // 657
// if originates in client or server code. Calls user provided hooks,                      // 658
// does the actual user insertion.                                                         // 659
//                                                                                         // 660
// returns the user id                                                                     // 661
var createUser = function (options) {                                                      // 662
  // Unknown keys allowed, because a onCreateUserHook can take arbitrary                   // 663
  // options.                                                                              // 664
  check(options, Match.ObjectIncluding({                                                   // 665
    username: Match.Optional(String),                                                      // 666
    email: Match.Optional(String),                                                         // 667
    password: Match.Optional(passwordValidator)                                            // 668
  }));                                                                                     // 669
                                                                                           // 670
  var username = options.username;                                                         // 671
  var email = options.email;                                                               // 672
  if (!username && !email)                                                                 // 673
    throw new Meteor.Error(400, "Need to set a username or email");                        // 674
                                                                                           // 675
  var user = {services: {}};                                                               // 676
  if (options.password) {                                                                  // 677
    var hashed = hashPassword(options.password);                                           // 678
    user.services.password = { bcrypt: hashed };                                           // 679
  }                                                                                        // 680
                                                                                           // 681
  if (username)                                                                            // 682
    user.username = username;                                                              // 683
  if (email)                                                                               // 684
    user.emails = [{address: email, verified: false}];                                     // 685
                                                                                           // 686
  return Accounts.insertUserDoc(options, user);                                            // 687
};                                                                                         // 688
                                                                                           // 689
// method for create user. Requests come from the client.                                  // 690
Meteor.methods({createUser: function (options) {                                           // 691
  var self = this;                                                                         // 692
  return Accounts._loginMethod(                                                            // 693
    self,                                                                                  // 694
    "createUser",                                                                          // 695
    arguments,                                                                             // 696
    "password",                                                                            // 697
    function () {                                                                          // 698
      // createUser() above does more checking.                                            // 699
      check(options, Object);                                                              // 700
      if (Accounts._options.forbidClientAccountCreation)                                   // 701
        return {                                                                           // 702
          error: new Meteor.Error(403, "Signups forbidden")                                // 703
        };                                                                                 // 704
                                                                                           // 705
      // Create user. result contains id and token.                                        // 706
      var userId = createUser(options);                                                    // 707
      // safety belt. createUser is supposed to throw on error. send 500 error             // 708
      // instead of sending a verification email with empty userid.                        // 709
      if (! userId)                                                                        // 710
        throw new Error("createUser failed to insert new user");                           // 711
                                                                                           // 712
      // If `Accounts._options.sendVerificationEmail` is set, register                     // 713
      // a token to verify the user's primary email, and send it to                        // 714
      // that address.                                                                     // 715
      if (options.email && Accounts._options.sendVerificationEmail)                        // 716
        Accounts.sendVerificationEmail(userId, options.email);                             // 717
                                                                                           // 718
      // client gets logged in as the new user afterwards.                                 // 719
      return {userId: userId};                                                             // 720
    }                                                                                      // 721
  );                                                                                       // 722
}});                                                                                       // 723
                                                                                           // 724
// Create user directly on the server.                                                     // 725
//                                                                                         // 726
// Unlike the client version, this does not log you in as this user                        // 727
// after creation.                                                                         // 728
//                                                                                         // 729
// returns userId or throws an error if it can't create                                    // 730
//                                                                                         // 731
// XXX add another argument ("server options") that gets sent to onCreateUser,             // 732
// which is always empty when called from the createUser method? eg, "admin:               // 733
// true", which we want to prevent the client from setting, but which a custom             // 734
// method calling Accounts.createUser could set?                                           // 735
//                                                                                         // 736
Accounts.createUser = function (options, callback) {                                       // 737
  options = _.clone(options);                                                              // 738
                                                                                           // 739
  // XXX allow an optional callback?                                                       // 740
  if (callback) {                                                                          // 741
    throw new Error("Accounts.createUser with callback not supported on the server yet."); // 742
  }                                                                                        // 743
                                                                                           // 744
  return createUser(options);                                                              // 745
};                                                                                         // 746
                                                                                           // 747
///                                                                                        // 748
/// PASSWORD-SPECIFIC INDEXES ON USERS                                                     // 749
///                                                                                        // 750
Meteor.users._ensureIndex('emails.validationTokens.token',                                 // 751
                          {unique: 1, sparse: 1});                                         // 752
Meteor.users._ensureIndex('services.password.reset.token',                                 // 753
                          {unique: 1, sparse: 1});                                         // 754
                                                                                           // 755
/////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['accounts-password'] = {};

})();

//# sourceMappingURL=accounts-password.js.map
