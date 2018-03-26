/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Exported root namespace
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.api = (function() {
    
        /**
         * Namespace api.
         * @exports api
         * @namespace
         */
        var api = {};
    
        api.Credentials = (function() {
    
            /**
             * Properties of a Credentials.
             * @memberof api
             * @interface ICredentials
             * @property {api.Credentials.IAws|null} [aws] Credentials aws
             * @property {api.Credentials.IS3Post|null} [s3Post] Credentials s3Post
             * @property {string|null} [bucket] Credentials bucket
             * @property {string|null} [region] Credentials region
             */
    
            /**
             * Constructs a new Credentials.
             * @memberof api
             * @classdesc Represents a Credentials.
             * @implements ICredentials
             * @constructor
             * @param {api.ICredentials=} [properties] Properties to set
             */
            function Credentials(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Credentials aws.
             * @member {api.Credentials.IAws|null|undefined} aws
             * @memberof api.Credentials
             * @instance
             */
            Credentials.prototype.aws = null;
    
            /**
             * Credentials s3Post.
             * @member {api.Credentials.IS3Post|null|undefined} s3Post
             * @memberof api.Credentials
             * @instance
             */
            Credentials.prototype.s3Post = null;
    
            /**
             * Credentials bucket.
             * @member {string} bucket
             * @memberof api.Credentials
             * @instance
             */
            Credentials.prototype.bucket = "";
    
            /**
             * Credentials region.
             * @member {string} region
             * @memberof api.Credentials
             * @instance
             */
            Credentials.prototype.region = "";
    
            /**
             * Creates a new Credentials instance using the specified properties.
             * @function create
             * @memberof api.Credentials
             * @static
             * @param {api.ICredentials=} [properties] Properties to set
             * @returns {api.Credentials} Credentials instance
             */
            Credentials.create = function create(properties) {
                return new Credentials(properties);
            };
    
            /**
             * Encodes the specified Credentials message. Does not implicitly {@link api.Credentials.verify|verify} messages.
             * @function encode
             * @memberof api.Credentials
             * @static
             * @param {api.ICredentials} message Credentials message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Credentials.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.aws != null && message.hasOwnProperty("aws"))
                    $root.api.Credentials.Aws.encode(message.aws, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.s3Post != null && message.hasOwnProperty("s3Post"))
                    $root.api.Credentials.S3Post.encode(message.s3Post, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.bucket != null && message.hasOwnProperty("bucket"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.bucket);
                if (message.region != null && message.hasOwnProperty("region"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.region);
                return writer;
            };
    
            /**
             * Encodes the specified Credentials message, length delimited. Does not implicitly {@link api.Credentials.verify|verify} messages.
             * @function encodeDelimited
             * @memberof api.Credentials
             * @static
             * @param {api.ICredentials} message Credentials message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Credentials.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Credentials message from the specified reader or buffer.
             * @function decode
             * @memberof api.Credentials
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.Credentials} Credentials
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Credentials.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.Credentials();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.aws = $root.api.Credentials.Aws.decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.s3Post = $root.api.Credentials.S3Post.decode(reader, reader.uint32());
                        break;
                    case 3:
                        message.bucket = reader.string();
                        break;
                    case 4:
                        message.region = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a Credentials message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof api.Credentials
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.Credentials} Credentials
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Credentials.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Credentials message.
             * @function verify
             * @memberof api.Credentials
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Credentials.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.aws != null && message.hasOwnProperty("aws")) {
                    var error = $root.api.Credentials.Aws.verify(message.aws);
                    if (error)
                        return "aws." + error;
                }
                if (message.s3Post != null && message.hasOwnProperty("s3Post")) {
                    var error = $root.api.Credentials.S3Post.verify(message.s3Post);
                    if (error)
                        return "s3Post." + error;
                }
                if (message.bucket != null && message.hasOwnProperty("bucket"))
                    if (!$util.isString(message.bucket))
                        return "bucket: string expected";
                if (message.region != null && message.hasOwnProperty("region"))
                    if (!$util.isString(message.region))
                        return "region: string expected";
                return null;
            };
    
            /**
             * Creates a Credentials message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof api.Credentials
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {api.Credentials} Credentials
             */
            Credentials.fromObject = function fromObject(object) {
                if (object instanceof $root.api.Credentials)
                    return object;
                var message = new $root.api.Credentials();
                if (object.aws != null) {
                    if (typeof object.aws !== "object")
                        throw TypeError(".api.Credentials.aws: object expected");
                    message.aws = $root.api.Credentials.Aws.fromObject(object.aws);
                }
                if (object.s3Post != null) {
                    if (typeof object.s3Post !== "object")
                        throw TypeError(".api.Credentials.s3Post: object expected");
                    message.s3Post = $root.api.Credentials.S3Post.fromObject(object.s3Post);
                }
                if (object.bucket != null)
                    message.bucket = String(object.bucket);
                if (object.region != null)
                    message.region = String(object.region);
                return message;
            };
    
            /**
             * Creates a plain object from a Credentials message. Also converts values to other types if specified.
             * @function toObject
             * @memberof api.Credentials
             * @static
             * @param {api.Credentials} message Credentials
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Credentials.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.aws = null;
                    object.s3Post = null;
                    object.bucket = "";
                    object.region = "";
                }
                if (message.aws != null && message.hasOwnProperty("aws"))
                    object.aws = $root.api.Credentials.Aws.toObject(message.aws, options);
                if (message.s3Post != null && message.hasOwnProperty("s3Post"))
                    object.s3Post = $root.api.Credentials.S3Post.toObject(message.s3Post, options);
                if (message.bucket != null && message.hasOwnProperty("bucket"))
                    object.bucket = message.bucket;
                if (message.region != null && message.hasOwnProperty("region"))
                    object.region = message.region;
                return object;
            };
    
            /**
             * Converts this Credentials to JSON.
             * @function toJSON
             * @memberof api.Credentials
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Credentials.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            Credentials.Aws = (function() {
    
                /**
                 * Properties of an Aws.
                 * @memberof api.Credentials
                 * @interface IAws
                 * @property {string|null} [accessKeyId] Aws accessKeyId
                 * @property {string|null} [secretAccessKey] Aws secretAccessKey
                 * @property {string|null} [sessionToken] Aws sessionToken
                 * @property {string|null} [expiration] Aws expiration
                 */
    
                /**
                 * Constructs a new Aws.
                 * @memberof api.Credentials
                 * @classdesc Represents an Aws.
                 * @implements IAws
                 * @constructor
                 * @param {api.Credentials.IAws=} [properties] Properties to set
                 */
                function Aws(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Aws accessKeyId.
                 * @member {string} accessKeyId
                 * @memberof api.Credentials.Aws
                 * @instance
                 */
                Aws.prototype.accessKeyId = "";
    
                /**
                 * Aws secretAccessKey.
                 * @member {string} secretAccessKey
                 * @memberof api.Credentials.Aws
                 * @instance
                 */
                Aws.prototype.secretAccessKey = "";
    
                /**
                 * Aws sessionToken.
                 * @member {string} sessionToken
                 * @memberof api.Credentials.Aws
                 * @instance
                 */
                Aws.prototype.sessionToken = "";
    
                /**
                 * Aws expiration.
                 * @member {string} expiration
                 * @memberof api.Credentials.Aws
                 * @instance
                 */
                Aws.prototype.expiration = "";
    
                /**
                 * Creates a new Aws instance using the specified properties.
                 * @function create
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {api.Credentials.IAws=} [properties] Properties to set
                 * @returns {api.Credentials.Aws} Aws instance
                 */
                Aws.create = function create(properties) {
                    return new Aws(properties);
                };
    
                /**
                 * Encodes the specified Aws message. Does not implicitly {@link api.Credentials.Aws.verify|verify} messages.
                 * @function encode
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {api.Credentials.IAws} message Aws message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Aws.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.accessKeyId != null && message.hasOwnProperty("accessKeyId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.accessKeyId);
                    if (message.secretAccessKey != null && message.hasOwnProperty("secretAccessKey"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.secretAccessKey);
                    if (message.sessionToken != null && message.hasOwnProperty("sessionToken"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sessionToken);
                    if (message.expiration != null && message.hasOwnProperty("expiration"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.expiration);
                    return writer;
                };
    
                /**
                 * Encodes the specified Aws message, length delimited. Does not implicitly {@link api.Credentials.Aws.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {api.Credentials.IAws} message Aws message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Aws.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Aws message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.Aws} Aws
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Aws.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.Credentials.Aws();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.accessKeyId = reader.string();
                            break;
                        case 2:
                            message.secretAccessKey = reader.string();
                            break;
                        case 3:
                            message.sessionToken = reader.string();
                            break;
                        case 4:
                            message.expiration = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes an Aws message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.Credentials.Aws} Aws
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Aws.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Aws message.
                 * @function verify
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Aws.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.accessKeyId != null && message.hasOwnProperty("accessKeyId"))
                        if (!$util.isString(message.accessKeyId))
                            return "accessKeyId: string expected";
                    if (message.secretAccessKey != null && message.hasOwnProperty("secretAccessKey"))
                        if (!$util.isString(message.secretAccessKey))
                            return "secretAccessKey: string expected";
                    if (message.sessionToken != null && message.hasOwnProperty("sessionToken"))
                        if (!$util.isString(message.sessionToken))
                            return "sessionToken: string expected";
                    if (message.expiration != null && message.hasOwnProperty("expiration"))
                        if (!$util.isString(message.expiration))
                            return "expiration: string expected";
                    return null;
                };
    
                /**
                 * Creates an Aws message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.Credentials.Aws)
                        return object;
                    var message = new $root.api.Credentials.Aws();
                    if (object.accessKeyId != null)
                        message.accessKeyId = String(object.accessKeyId);
                    if (object.secretAccessKey != null)
                        message.secretAccessKey = String(object.secretAccessKey);
                    if (object.sessionToken != null)
                        message.sessionToken = String(object.sessionToken);
                    if (object.expiration != null)
                        message.expiration = String(object.expiration);
                    return message;
                };
    
                /**
                 * Creates a plain object from an Aws message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.Credentials.Aws
                 * @static
                 * @param {api.Credentials.Aws} message Aws
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Aws.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.accessKeyId = "";
                        object.secretAccessKey = "";
                        object.sessionToken = "";
                        object.expiration = "";
                    }
                    if (message.accessKeyId != null && message.hasOwnProperty("accessKeyId"))
                        object.accessKeyId = message.accessKeyId;
                    if (message.secretAccessKey != null && message.hasOwnProperty("secretAccessKey"))
                        object.secretAccessKey = message.secretAccessKey;
                    if (message.sessionToken != null && message.hasOwnProperty("sessionToken"))
                        object.sessionToken = message.sessionToken;
                    if (message.expiration != null && message.hasOwnProperty("expiration"))
                        object.expiration = message.expiration;
                    return object;
                };
    
                /**
                 * Converts this Aws to JSON.
                 * @function toJSON
                 * @memberof api.Credentials.Aws
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Aws.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Aws;
            })();
    
            Credentials.S3Post = (function() {
    
                /**
                 * Properties of a S3Post.
                 * @memberof api.Credentials
                 * @interface IS3Post
                 * @property {string|null} [AWSAccessKeyId] S3Post AWSAccessKeyId
                 * @property {string|null} [policy] S3Post policy
                 * @property {string|null} [signature] S3Post signature
                 * @property {string|null} [acl] S3Post acl
                 */
    
                /**
                 * Constructs a new S3Post.
                 * @memberof api.Credentials
                 * @classdesc Represents a S3Post.
                 * @implements IS3Post
                 * @constructor
                 * @param {api.Credentials.IS3Post=} [properties] Properties to set
                 */
                function S3Post(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * S3Post AWSAccessKeyId.
                 * @member {string} AWSAccessKeyId
                 * @memberof api.Credentials.S3Post
                 * @instance
                 */
                S3Post.prototype.AWSAccessKeyId = "";
    
                /**
                 * S3Post policy.
                 * @member {string} policy
                 * @memberof api.Credentials.S3Post
                 * @instance
                 */
                S3Post.prototype.policy = "";
    
                /**
                 * S3Post signature.
                 * @member {string} signature
                 * @memberof api.Credentials.S3Post
                 * @instance
                 */
                S3Post.prototype.signature = "";
    
                /**
                 * S3Post acl.
                 * @member {string} acl
                 * @memberof api.Credentials.S3Post
                 * @instance
                 */
                S3Post.prototype.acl = "";
    
                /**
                 * Creates a new S3Post instance using the specified properties.
                 * @function create
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {api.Credentials.IS3Post=} [properties] Properties to set
                 * @returns {api.Credentials.S3Post} S3Post instance
                 */
                S3Post.create = function create(properties) {
                    return new S3Post(properties);
                };
    
                /**
                 * Encodes the specified S3Post message. Does not implicitly {@link api.Credentials.S3Post.verify|verify} messages.
                 * @function encode
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {api.Credentials.IS3Post} message S3Post message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                S3Post.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.AWSAccessKeyId != null && message.hasOwnProperty("AWSAccessKeyId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.AWSAccessKeyId);
                    if (message.policy != null && message.hasOwnProperty("policy"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.policy);
                    if (message.signature != null && message.hasOwnProperty("signature"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.signature);
                    if (message.acl != null && message.hasOwnProperty("acl"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.acl);
                    return writer;
                };
    
                /**
                 * Encodes the specified S3Post message, length delimited. Does not implicitly {@link api.Credentials.S3Post.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {api.Credentials.IS3Post} message S3Post message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                S3Post.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a S3Post message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.S3Post} S3Post
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                S3Post.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.Credentials.S3Post();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.AWSAccessKeyId = reader.string();
                            break;
                        case 2:
                            message.policy = reader.string();
                            break;
                        case 3:
                            message.signature = reader.string();
                            break;
                        case 4:
                            message.acl = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a S3Post message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.Credentials.S3Post} S3Post
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                S3Post.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a S3Post message.
                 * @function verify
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                S3Post.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.AWSAccessKeyId != null && message.hasOwnProperty("AWSAccessKeyId"))
                        if (!$util.isString(message.AWSAccessKeyId))
                            return "AWSAccessKeyId: string expected";
                    if (message.policy != null && message.hasOwnProperty("policy"))
                        if (!$util.isString(message.policy))
                            return "policy: string expected";
                    if (message.signature != null && message.hasOwnProperty("signature"))
                        if (!$util.isString(message.signature))
                            return "signature: string expected";
                    if (message.acl != null && message.hasOwnProperty("acl"))
                        if (!$util.isString(message.acl))
                            return "acl: string expected";
                    return null;
                };
    
                /**
                 * Creates a S3Post message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.Credentials.S3Post)
                        return object;
                    var message = new $root.api.Credentials.S3Post();
                    if (object.AWSAccessKeyId != null)
                        message.AWSAccessKeyId = String(object.AWSAccessKeyId);
                    if (object.policy != null)
                        message.policy = String(object.policy);
                    if (object.signature != null)
                        message.signature = String(object.signature);
                    if (object.acl != null)
                        message.acl = String(object.acl);
                    return message;
                };
    
                /**
                 * Creates a plain object from a S3Post message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.Credentials.S3Post
                 * @static
                 * @param {api.Credentials.S3Post} message S3Post
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                S3Post.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.AWSAccessKeyId = "";
                        object.policy = "";
                        object.signature = "";
                        object.acl = "";
                    }
                    if (message.AWSAccessKeyId != null && message.hasOwnProperty("AWSAccessKeyId"))
                        object.AWSAccessKeyId = message.AWSAccessKeyId;
                    if (message.policy != null && message.hasOwnProperty("policy"))
                        object.policy = message.policy;
                    if (message.signature != null && message.hasOwnProperty("signature"))
                        object.signature = message.signature;
                    if (message.acl != null && message.hasOwnProperty("acl"))
                        object.acl = message.acl;
                    return object;
                };
    
                /**
                 * Converts this S3Post to JSON.
                 * @function toJSON
                 * @memberof api.Credentials.S3Post
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                S3Post.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return S3Post;
            })();
    
            return Credentials;
        })();
    
        api.SecretboxRecord = (function() {
    
            /**
             * Properties of a SecretboxRecord.
             * @memberof api
             * @interface ISecretboxRecord
             * @property {Uint8Array|null} [encryptedData] SecretboxRecord encryptedData
             * @property {number|null} [counter] SecretboxRecord counter
             * @property {Uint8Array|null} [nonceRandom] SecretboxRecord nonceRandom
             */
    
            /**
             * Constructs a new SecretboxRecord.
             * @memberof api
             * @classdesc Represents a SecretboxRecord.
             * @implements ISecretboxRecord
             * @constructor
             * @param {api.ISecretboxRecord=} [properties] Properties to set
             */
            function SecretboxRecord(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SecretboxRecord encryptedData.
             * @member {Uint8Array} encryptedData
             * @memberof api.SecretboxRecord
             * @instance
             */
            SecretboxRecord.prototype.encryptedData = $util.newBuffer([]);
    
            /**
             * SecretboxRecord counter.
             * @member {number} counter
             * @memberof api.SecretboxRecord
             * @instance
             */
            SecretboxRecord.prototype.counter = 0;
    
            /**
             * SecretboxRecord nonceRandom.
             * @member {Uint8Array} nonceRandom
             * @memberof api.SecretboxRecord
             * @instance
             */
            SecretboxRecord.prototype.nonceRandom = $util.newBuffer([]);
    
            /**
             * Creates a new SecretboxRecord instance using the specified properties.
             * @function create
             * @memberof api.SecretboxRecord
             * @static
             * @param {api.ISecretboxRecord=} [properties] Properties to set
             * @returns {api.SecretboxRecord} SecretboxRecord instance
             */
            SecretboxRecord.create = function create(properties) {
                return new SecretboxRecord(properties);
            };
    
            /**
             * Encodes the specified SecretboxRecord message. Does not implicitly {@link api.SecretboxRecord.verify|verify} messages.
             * @function encode
             * @memberof api.SecretboxRecord
             * @static
             * @param {api.ISecretboxRecord} message SecretboxRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecretboxRecord.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.encryptedData != null && message.hasOwnProperty("encryptedData"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.encryptedData);
                if (message.counter != null && message.hasOwnProperty("counter"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.counter);
                if (message.nonceRandom != null && message.hasOwnProperty("nonceRandom"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.nonceRandom);
                return writer;
            };
    
            /**
             * Encodes the specified SecretboxRecord message, length delimited. Does not implicitly {@link api.SecretboxRecord.verify|verify} messages.
             * @function encodeDelimited
             * @memberof api.SecretboxRecord
             * @static
             * @param {api.ISecretboxRecord} message SecretboxRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecretboxRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SecretboxRecord message from the specified reader or buffer.
             * @function decode
             * @memberof api.SecretboxRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SecretboxRecord} SecretboxRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SecretboxRecord.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SecretboxRecord();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.encryptedData = reader.bytes();
                        break;
                    case 2:
                        message.counter = reader.uint32();
                        break;
                    case 3:
                        message.nonceRandom = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SecretboxRecord message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof api.SecretboxRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.SecretboxRecord} SecretboxRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SecretboxRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SecretboxRecord message.
             * @function verify
             * @memberof api.SecretboxRecord
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SecretboxRecord.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.encryptedData != null && message.hasOwnProperty("encryptedData"))
                    if (!(message.encryptedData && typeof message.encryptedData.length === "number" || $util.isString(message.encryptedData)))
                        return "encryptedData: buffer expected";
                if (message.counter != null && message.hasOwnProperty("counter"))
                    if (!$util.isInteger(message.counter))
                        return "counter: integer expected";
                if (message.nonceRandom != null && message.hasOwnProperty("nonceRandom"))
                    if (!(message.nonceRandom && typeof message.nonceRandom.length === "number" || $util.isString(message.nonceRandom)))
                        return "nonceRandom: buffer expected";
                return null;
            };
    
            /**
             * Creates a SecretboxRecord message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof api.SecretboxRecord
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.fromObject = function fromObject(object) {
                if (object instanceof $root.api.SecretboxRecord)
                    return object;
                var message = new $root.api.SecretboxRecord();
                if (object.encryptedData != null)
                    if (typeof object.encryptedData === "string")
                        $util.base64.decode(object.encryptedData, message.encryptedData = $util.newBuffer($util.base64.length(object.encryptedData)), 0);
                    else if (object.encryptedData.length)
                        message.encryptedData = object.encryptedData;
                if (object.counter != null)
                    message.counter = object.counter >>> 0;
                if (object.nonceRandom != null)
                    if (typeof object.nonceRandom === "string")
                        $util.base64.decode(object.nonceRandom, message.nonceRandom = $util.newBuffer($util.base64.length(object.nonceRandom)), 0);
                    else if (object.nonceRandom.length)
                        message.nonceRandom = object.nonceRandom;
                return message;
            };
    
            /**
             * Creates a plain object from a SecretboxRecord message. Also converts values to other types if specified.
             * @function toObject
             * @memberof api.SecretboxRecord
             * @static
             * @param {api.SecretboxRecord} message SecretboxRecord
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SecretboxRecord.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.encryptedData = options.bytes === String ? "" : [];
                    object.counter = 0;
                    object.nonceRandom = options.bytes === String ? "" : [];
                }
                if (message.encryptedData != null && message.hasOwnProperty("encryptedData"))
                    object.encryptedData = options.bytes === String ? $util.base64.encode(message.encryptedData, 0, message.encryptedData.length) : options.bytes === Array ? Array.prototype.slice.call(message.encryptedData) : message.encryptedData;
                if (message.counter != null && message.hasOwnProperty("counter"))
                    object.counter = message.counter;
                if (message.nonceRandom != null && message.hasOwnProperty("nonceRandom"))
                    object.nonceRandom = options.bytes === String ? $util.base64.encode(message.nonceRandom, 0, message.nonceRandom.length) : options.bytes === Array ? Array.prototype.slice.call(message.nonceRandom) : message.nonceRandom;
                return object;
            };
    
            /**
             * Converts this SecretboxRecord to JSON.
             * @function toJSON
             * @memberof api.SecretboxRecord
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SecretboxRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SecretboxRecord;
        })();
    
        api.SyncRecord = (function() {
    
            /**
             * Properties of a SyncRecord.
             * @memberof api
             * @interface ISyncRecord
             * @property {api.SyncRecord.Action|null} [action] SyncRecord action
             * @property {Uint8Array|null} [deviceId] SyncRecord deviceId
             * @property {Uint8Array|null} [objectId] SyncRecord objectId
             * @property {api.SyncRecord.IBookmark|null} [bookmark] SyncRecord bookmark
             * @property {api.SyncRecord.ISite|null} [historySite] SyncRecord historySite
             * @property {api.SyncRecord.ISiteSetting|null} [siteSetting] SyncRecord siteSetting
             * @property {api.SyncRecord.IDevice|null} [device] SyncRecord device
             */
    
            /**
             * Constructs a new SyncRecord.
             * @memberof api
             * @classdesc Represents a SyncRecord.
             * @implements ISyncRecord
             * @constructor
             * @param {api.ISyncRecord=} [properties] Properties to set
             */
            function SyncRecord(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SyncRecord action.
             * @member {api.SyncRecord.Action} action
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.action = 0;
    
            /**
             * SyncRecord deviceId.
             * @member {Uint8Array} deviceId
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.deviceId = $util.newBuffer([]);
    
            /**
             * SyncRecord objectId.
             * @member {Uint8Array} objectId
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.objectId = $util.newBuffer([]);
    
            /**
             * SyncRecord bookmark.
             * @member {api.SyncRecord.IBookmark|null|undefined} bookmark
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.bookmark = null;
    
            /**
             * SyncRecord historySite.
             * @member {api.SyncRecord.ISite|null|undefined} historySite
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.historySite = null;
    
            /**
             * SyncRecord siteSetting.
             * @member {api.SyncRecord.ISiteSetting|null|undefined} siteSetting
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.siteSetting = null;
    
            /**
             * SyncRecord device.
             * @member {api.SyncRecord.IDevice|null|undefined} device
             * @memberof api.SyncRecord
             * @instance
             */
            SyncRecord.prototype.device = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SyncRecord objectData.
             * @member {"bookmark"|"historySite"|"siteSetting"|"device"|undefined} objectData
             * @memberof api.SyncRecord
             * @instance
             */
            Object.defineProperty(SyncRecord.prototype, "objectData", {
                get: $util.oneOfGetter($oneOfFields = ["bookmark", "historySite", "siteSetting", "device"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            /**
             * Creates a new SyncRecord instance using the specified properties.
             * @function create
             * @memberof api.SyncRecord
             * @static
             * @param {api.ISyncRecord=} [properties] Properties to set
             * @returns {api.SyncRecord} SyncRecord instance
             */
            SyncRecord.create = function create(properties) {
                return new SyncRecord(properties);
            };
    
            /**
             * Encodes the specified SyncRecord message. Does not implicitly {@link api.SyncRecord.verify|verify} messages.
             * @function encode
             * @memberof api.SyncRecord
             * @static
             * @param {api.ISyncRecord} message SyncRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncRecord.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.action != null && message.hasOwnProperty("action"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int32(message.action);
                if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.deviceId);
                if (message.objectId != null && message.hasOwnProperty("objectId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.objectId);
                if (message.bookmark != null && message.hasOwnProperty("bookmark"))
                    $root.api.SyncRecord.Bookmark.encode(message.bookmark, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                if (message.historySite != null && message.hasOwnProperty("historySite"))
                    $root.api.SyncRecord.Site.encode(message.historySite, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                if (message.siteSetting != null && message.hasOwnProperty("siteSetting"))
                    $root.api.SyncRecord.SiteSetting.encode(message.siteSetting, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                if (message.device != null && message.hasOwnProperty("device"))
                    $root.api.SyncRecord.Device.encode(message.device, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                return writer;
            };
    
            /**
             * Encodes the specified SyncRecord message, length delimited. Does not implicitly {@link api.SyncRecord.verify|verify} messages.
             * @function encodeDelimited
             * @memberof api.SyncRecord
             * @static
             * @param {api.ISyncRecord} message SyncRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SyncRecord message from the specified reader or buffer.
             * @function decode
             * @memberof api.SyncRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SyncRecord} SyncRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncRecord.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.action = reader.int32();
                        break;
                    case 2:
                        message.deviceId = reader.bytes();
                        break;
                    case 3:
                        message.objectId = reader.bytes();
                        break;
                    case 4:
                        message.bookmark = $root.api.SyncRecord.Bookmark.decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.historySite = $root.api.SyncRecord.Site.decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.siteSetting = $root.api.SyncRecord.SiteSetting.decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.device = $root.api.SyncRecord.Device.decode(reader, reader.uint32());
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a SyncRecord message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof api.SyncRecord
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.SyncRecord} SyncRecord
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            SyncRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SyncRecord message.
             * @function verify
             * @memberof api.SyncRecord
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            SyncRecord.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                var properties = {};
                if (message.action != null && message.hasOwnProperty("action"))
                    switch (message.action) {
                    default:
                        return "action: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                    if (!(message.deviceId && typeof message.deviceId.length === "number" || $util.isString(message.deviceId)))
                        return "deviceId: buffer expected";
                if (message.objectId != null && message.hasOwnProperty("objectId"))
                    if (!(message.objectId && typeof message.objectId.length === "number" || $util.isString(message.objectId)))
                        return "objectId: buffer expected";
                if (message.bookmark != null && message.hasOwnProperty("bookmark")) {
                    properties.objectData = 1;
                    {
                        var error = $root.api.SyncRecord.Bookmark.verify(message.bookmark);
                        if (error)
                            return "bookmark." + error;
                    }
                }
                if (message.historySite != null && message.hasOwnProperty("historySite")) {
                    if (properties.objectData === 1)
                        return "objectData: multiple values";
                    properties.objectData = 1;
                    {
                        var error = $root.api.SyncRecord.Site.verify(message.historySite);
                        if (error)
                            return "historySite." + error;
                    }
                }
                if (message.siteSetting != null && message.hasOwnProperty("siteSetting")) {
                    if (properties.objectData === 1)
                        return "objectData: multiple values";
                    properties.objectData = 1;
                    {
                        var error = $root.api.SyncRecord.SiteSetting.verify(message.siteSetting);
                        if (error)
                            return "siteSetting." + error;
                    }
                }
                if (message.device != null && message.hasOwnProperty("device")) {
                    if (properties.objectData === 1)
                        return "objectData: multiple values";
                    properties.objectData = 1;
                    {
                        var error = $root.api.SyncRecord.Device.verify(message.device);
                        if (error)
                            return "device." + error;
                    }
                }
                return null;
            };
    
            /**
             * Creates a SyncRecord message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof api.SyncRecord
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.fromObject = function fromObject(object) {
                if (object instanceof $root.api.SyncRecord)
                    return object;
                var message = new $root.api.SyncRecord();
                switch (object.action) {
                case "CREATE":
                case 0:
                    message.action = 0;
                    break;
                case "UPDATE":
                case 1:
                    message.action = 1;
                    break;
                case "DELETE":
                case 2:
                    message.action = 2;
                    break;
                }
                if (object.deviceId != null)
                    if (typeof object.deviceId === "string")
                        $util.base64.decode(object.deviceId, message.deviceId = $util.newBuffer($util.base64.length(object.deviceId)), 0);
                    else if (object.deviceId.length)
                        message.deviceId = object.deviceId;
                if (object.objectId != null)
                    if (typeof object.objectId === "string")
                        $util.base64.decode(object.objectId, message.objectId = $util.newBuffer($util.base64.length(object.objectId)), 0);
                    else if (object.objectId.length)
                        message.objectId = object.objectId;
                if (object.bookmark != null) {
                    if (typeof object.bookmark !== "object")
                        throw TypeError(".api.SyncRecord.bookmark: object expected");
                    message.bookmark = $root.api.SyncRecord.Bookmark.fromObject(object.bookmark);
                }
                if (object.historySite != null) {
                    if (typeof object.historySite !== "object")
                        throw TypeError(".api.SyncRecord.historySite: object expected");
                    message.historySite = $root.api.SyncRecord.Site.fromObject(object.historySite);
                }
                if (object.siteSetting != null) {
                    if (typeof object.siteSetting !== "object")
                        throw TypeError(".api.SyncRecord.siteSetting: object expected");
                    message.siteSetting = $root.api.SyncRecord.SiteSetting.fromObject(object.siteSetting);
                }
                if (object.device != null) {
                    if (typeof object.device !== "object")
                        throw TypeError(".api.SyncRecord.device: object expected");
                    message.device = $root.api.SyncRecord.Device.fromObject(object.device);
                }
                return message;
            };
    
            /**
             * Creates a plain object from a SyncRecord message. Also converts values to other types if specified.
             * @function toObject
             * @memberof api.SyncRecord
             * @static
             * @param {api.SyncRecord} message SyncRecord
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncRecord.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.action = options.enums === String ? "CREATE" : 0;
                    object.deviceId = options.bytes === String ? "" : [];
                    object.objectId = options.bytes === String ? "" : [];
                }
                if (message.action != null && message.hasOwnProperty("action"))
                    object.action = options.enums === String ? $root.api.SyncRecord.Action[message.action] : message.action;
                if (message.deviceId != null && message.hasOwnProperty("deviceId"))
                    object.deviceId = options.bytes === String ? $util.base64.encode(message.deviceId, 0, message.deviceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.deviceId) : message.deviceId;
                if (message.objectId != null && message.hasOwnProperty("objectId"))
                    object.objectId = options.bytes === String ? $util.base64.encode(message.objectId, 0, message.objectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.objectId) : message.objectId;
                if (message.bookmark != null && message.hasOwnProperty("bookmark")) {
                    object.bookmark = $root.api.SyncRecord.Bookmark.toObject(message.bookmark, options);
                    if (options.oneofs)
                        object.objectData = "bookmark";
                }
                if (message.historySite != null && message.hasOwnProperty("historySite")) {
                    object.historySite = $root.api.SyncRecord.Site.toObject(message.historySite, options);
                    if (options.oneofs)
                        object.objectData = "historySite";
                }
                if (message.siteSetting != null && message.hasOwnProperty("siteSetting")) {
                    object.siteSetting = $root.api.SyncRecord.SiteSetting.toObject(message.siteSetting, options);
                    if (options.oneofs)
                        object.objectData = "siteSetting";
                }
                if (message.device != null && message.hasOwnProperty("device")) {
                    object.device = $root.api.SyncRecord.Device.toObject(message.device, options);
                    if (options.oneofs)
                        object.objectData = "device";
                }
                return object;
            };
    
            /**
             * Converts this SyncRecord to JSON.
             * @function toJSON
             * @memberof api.SyncRecord
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            SyncRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Action enum.
             * @name api.SyncRecord.Action
             * @enum {string}
             * @property {number} CREATE=0 CREATE value
             * @property {number} UPDATE=1 UPDATE value
             * @property {number} DELETE=2 DELETE value
             */
            SyncRecord.Action = (function() {
                var valuesById = {}, values = Object.create(valuesById);
                values[valuesById[0] = "CREATE"] = 0;
                values[valuesById[1] = "UPDATE"] = 1;
                values[valuesById[2] = "DELETE"] = 2;
                return values;
            })();
    
            SyncRecord.Site = (function() {
    
                /**
                 * Properties of a Site.
                 * @memberof api.SyncRecord
                 * @interface ISite
                 * @property {string|null} [location] Site location
                 * @property {string|null} [title] Site title
                 * @property {string|null} [customTitle] Site customTitle
                 * @property {number|Long|null} [lastAccessedTime] Site lastAccessedTime
                 * @property {number|Long|null} [creationTime] Site creationTime
                 * @property {string|null} [favicon] Site favicon
                 */
    
                /**
                 * Constructs a new Site.
                 * @memberof api.SyncRecord
                 * @classdesc Represents a Site.
                 * @implements ISite
                 * @constructor
                 * @param {api.SyncRecord.ISite=} [properties] Properties to set
                 */
                function Site(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Site location.
                 * @member {string} location
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.location = "";
    
                /**
                 * Site title.
                 * @member {string} title
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.title = "";
    
                /**
                 * Site customTitle.
                 * @member {string} customTitle
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.customTitle = "";
    
                /**
                 * Site lastAccessedTime.
                 * @member {number|Long} lastAccessedTime
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.lastAccessedTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Site creationTime.
                 * @member {number|Long} creationTime
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.creationTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Site favicon.
                 * @member {string} favicon
                 * @memberof api.SyncRecord.Site
                 * @instance
                 */
                Site.prototype.favicon = "";
    
                /**
                 * Creates a new Site instance using the specified properties.
                 * @function create
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {api.SyncRecord.ISite=} [properties] Properties to set
                 * @returns {api.SyncRecord.Site} Site instance
                 */
                Site.create = function create(properties) {
                    return new Site(properties);
                };
    
                /**
                 * Encodes the specified Site message. Does not implicitly {@link api.SyncRecord.Site.verify|verify} messages.
                 * @function encode
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {api.SyncRecord.ISite} message Site message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Site.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.location != null && message.hasOwnProperty("location"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.location);
                    if (message.title != null && message.hasOwnProperty("title"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                    if (message.customTitle != null && message.hasOwnProperty("customTitle"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.customTitle);
                    if (message.lastAccessedTime != null && message.hasOwnProperty("lastAccessedTime"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.lastAccessedTime);
                    if (message.creationTime != null && message.hasOwnProperty("creationTime"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.creationTime);
                    if (message.favicon != null && message.hasOwnProperty("favicon"))
                        writer.uint32(/* id 6, wireType 2 =*/50).string(message.favicon);
                    return writer;
                };
    
                /**
                 * Encodes the specified Site message, length delimited. Does not implicitly {@link api.SyncRecord.Site.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {api.SyncRecord.ISite} message Site message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Site.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Site message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Site} Site
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Site.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord.Site();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.location = reader.string();
                            break;
                        case 2:
                            message.title = reader.string();
                            break;
                        case 3:
                            message.customTitle = reader.string();
                            break;
                        case 4:
                            message.lastAccessedTime = reader.uint64();
                            break;
                        case 5:
                            message.creationTime = reader.uint64();
                            break;
                        case 6:
                            message.favicon = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Site message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Site} Site
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Site.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Site message.
                 * @function verify
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Site.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.location != null && message.hasOwnProperty("location"))
                        if (!$util.isString(message.location))
                            return "location: string expected";
                    if (message.title != null && message.hasOwnProperty("title"))
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    if (message.customTitle != null && message.hasOwnProperty("customTitle"))
                        if (!$util.isString(message.customTitle))
                            return "customTitle: string expected";
                    if (message.lastAccessedTime != null && message.hasOwnProperty("lastAccessedTime"))
                        if (!$util.isInteger(message.lastAccessedTime) && !(message.lastAccessedTime && $util.isInteger(message.lastAccessedTime.low) && $util.isInteger(message.lastAccessedTime.high)))
                            return "lastAccessedTime: integer|Long expected";
                    if (message.creationTime != null && message.hasOwnProperty("creationTime"))
                        if (!$util.isInteger(message.creationTime) && !(message.creationTime && $util.isInteger(message.creationTime.low) && $util.isInteger(message.creationTime.high)))
                            return "creationTime: integer|Long expected";
                    if (message.favicon != null && message.hasOwnProperty("favicon"))
                        if (!$util.isString(message.favicon))
                            return "favicon: string expected";
                    return null;
                };
    
                /**
                 * Creates a Site message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.SyncRecord.Site)
                        return object;
                    var message = new $root.api.SyncRecord.Site();
                    if (object.location != null)
                        message.location = String(object.location);
                    if (object.title != null)
                        message.title = String(object.title);
                    if (object.customTitle != null)
                        message.customTitle = String(object.customTitle);
                    if (object.lastAccessedTime != null)
                        if ($util.Long)
                            (message.lastAccessedTime = $util.Long.fromValue(object.lastAccessedTime)).unsigned = true;
                        else if (typeof object.lastAccessedTime === "string")
                            message.lastAccessedTime = parseInt(object.lastAccessedTime, 10);
                        else if (typeof object.lastAccessedTime === "number")
                            message.lastAccessedTime = object.lastAccessedTime;
                        else if (typeof object.lastAccessedTime === "object")
                            message.lastAccessedTime = new $util.LongBits(object.lastAccessedTime.low >>> 0, object.lastAccessedTime.high >>> 0).toNumber(true);
                    if (object.creationTime != null)
                        if ($util.Long)
                            (message.creationTime = $util.Long.fromValue(object.creationTime)).unsigned = true;
                        else if (typeof object.creationTime === "string")
                            message.creationTime = parseInt(object.creationTime, 10);
                        else if (typeof object.creationTime === "number")
                            message.creationTime = object.creationTime;
                        else if (typeof object.creationTime === "object")
                            message.creationTime = new $util.LongBits(object.creationTime.low >>> 0, object.creationTime.high >>> 0).toNumber(true);
                    if (object.favicon != null)
                        message.favicon = String(object.favicon);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Site message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.SyncRecord.Site
                 * @static
                 * @param {api.SyncRecord.Site} message Site
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Site.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults) {
                        object.location = "";
                        object.title = "";
                        object.customTitle = "";
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.lastAccessedTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.lastAccessedTime = options.longs === String ? "0" : 0;
                        if ($util.Long) {
                            var long = new $util.Long(0, 0, true);
                            object.creationTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                        } else
                            object.creationTime = options.longs === String ? "0" : 0;
                        object.favicon = "";
                    }
                    if (message.location != null && message.hasOwnProperty("location"))
                        object.location = message.location;
                    if (message.title != null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    if (message.customTitle != null && message.hasOwnProperty("customTitle"))
                        object.customTitle = message.customTitle;
                    if (message.lastAccessedTime != null && message.hasOwnProperty("lastAccessedTime"))
                        if (typeof message.lastAccessedTime === "number")
                            object.lastAccessedTime = options.longs === String ? String(message.lastAccessedTime) : message.lastAccessedTime;
                        else
                            object.lastAccessedTime = options.longs === String ? $util.Long.prototype.toString.call(message.lastAccessedTime) : options.longs === Number ? new $util.LongBits(message.lastAccessedTime.low >>> 0, message.lastAccessedTime.high >>> 0).toNumber(true) : message.lastAccessedTime;
                    if (message.creationTime != null && message.hasOwnProperty("creationTime"))
                        if (typeof message.creationTime === "number")
                            object.creationTime = options.longs === String ? String(message.creationTime) : message.creationTime;
                        else
                            object.creationTime = options.longs === String ? $util.Long.prototype.toString.call(message.creationTime) : options.longs === Number ? new $util.LongBits(message.creationTime.low >>> 0, message.creationTime.high >>> 0).toNumber(true) : message.creationTime;
                    if (message.favicon != null && message.hasOwnProperty("favicon"))
                        object.favicon = message.favicon;
                    return object;
                };
    
                /**
                 * Converts this Site to JSON.
                 * @function toJSON
                 * @memberof api.SyncRecord.Site
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Site.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Site;
            })();
    
            SyncRecord.Bookmark = (function() {
    
                /**
                 * Properties of a Bookmark.
                 * @memberof api.SyncRecord
                 * @interface IBookmark
                 * @property {api.SyncRecord.ISite|null} [site] Bookmark site
                 * @property {boolean|null} [isFolder] Bookmark isFolder
                 * @property {Uint8Array|null} [parentFolderObjectId] Bookmark parentFolderObjectId
                 * @property {Uint8Array|null} [previousObjectId] Bookmark previousObjectId
                 * @property {Uint8Array|null} [nextObjectId] Bookmark nextObjectId
                 * @property {Array.<string>|null} [fields] Bookmark fields
                 * @property {boolean|null} [hideInToolbar] Bookmark hideInToolbar
                 */
    
                /**
                 * Constructs a new Bookmark.
                 * @memberof api.SyncRecord
                 * @classdesc Represents a Bookmark.
                 * @implements IBookmark
                 * @constructor
                 * @param {api.SyncRecord.IBookmark=} [properties] Properties to set
                 */
                function Bookmark(properties) {
                    this.fields = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Bookmark site.
                 * @member {api.SyncRecord.ISite|null|undefined} site
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.site = null;
    
                /**
                 * Bookmark isFolder.
                 * @member {boolean} isFolder
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.isFolder = false;
    
                /**
                 * Bookmark parentFolderObjectId.
                 * @member {Uint8Array} parentFolderObjectId
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.parentFolderObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark previousObjectId.
                 * @member {Uint8Array} previousObjectId
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.previousObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark nextObjectId.
                 * @member {Uint8Array} nextObjectId
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.nextObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark fields.
                 * @member {Array.<string>} fields
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.fields = $util.emptyArray;
    
                /**
                 * Bookmark hideInToolbar.
                 * @member {boolean} hideInToolbar
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 */
                Bookmark.prototype.hideInToolbar = false;
    
                /**
                 * Creates a new Bookmark instance using the specified properties.
                 * @function create
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {api.SyncRecord.IBookmark=} [properties] Properties to set
                 * @returns {api.SyncRecord.Bookmark} Bookmark instance
                 */
                Bookmark.create = function create(properties) {
                    return new Bookmark(properties);
                };
    
                /**
                 * Encodes the specified Bookmark message. Does not implicitly {@link api.SyncRecord.Bookmark.verify|verify} messages.
                 * @function encode
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {api.SyncRecord.IBookmark} message Bookmark message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bookmark.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.site != null && message.hasOwnProperty("site"))
                        $root.api.SyncRecord.Site.encode(message.site, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.isFolder != null && message.hasOwnProperty("isFolder"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isFolder);
                    if (message.parentFolderObjectId != null && message.hasOwnProperty("parentFolderObjectId"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.parentFolderObjectId);
                    if (message.previousObjectId != null && message.hasOwnProperty("previousObjectId"))
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.previousObjectId);
                    if (message.nextObjectId != null && message.hasOwnProperty("nextObjectId"))
                        writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.nextObjectId);
                    if (message.fields != null && message.fields.length)
                        for (var i = 0; i < message.fields.length; ++i)
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.fields[i]);
                    if (message.hideInToolbar != null && message.hasOwnProperty("hideInToolbar"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.hideInToolbar);
                    return writer;
                };
    
                /**
                 * Encodes the specified Bookmark message, length delimited. Does not implicitly {@link api.SyncRecord.Bookmark.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {api.SyncRecord.IBookmark} message Bookmark message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bookmark.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Bookmark message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Bookmark.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord.Bookmark();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.site = $root.api.SyncRecord.Site.decode(reader, reader.uint32());
                            break;
                        case 2:
                            message.isFolder = reader.bool();
                            break;
                        case 3:
                            message.parentFolderObjectId = reader.bytes();
                            break;
                        case 4:
                            message.previousObjectId = reader.bytes();
                            break;
                        case 5:
                            message.nextObjectId = reader.bytes();
                            break;
                        case 6:
                            if (!(message.fields && message.fields.length))
                                message.fields = [];
                            message.fields.push(reader.string());
                            break;
                        case 7:
                            message.hideInToolbar = reader.bool();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Bookmark message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Bookmark.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Bookmark message.
                 * @function verify
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Bookmark.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.site != null && message.hasOwnProperty("site")) {
                        var error = $root.api.SyncRecord.Site.verify(message.site);
                        if (error)
                            return "site." + error;
                    }
                    if (message.isFolder != null && message.hasOwnProperty("isFolder"))
                        if (typeof message.isFolder !== "boolean")
                            return "isFolder: boolean expected";
                    if (message.parentFolderObjectId != null && message.hasOwnProperty("parentFolderObjectId"))
                        if (!(message.parentFolderObjectId && typeof message.parentFolderObjectId.length === "number" || $util.isString(message.parentFolderObjectId)))
                            return "parentFolderObjectId: buffer expected";
                    if (message.previousObjectId != null && message.hasOwnProperty("previousObjectId"))
                        if (!(message.previousObjectId && typeof message.previousObjectId.length === "number" || $util.isString(message.previousObjectId)))
                            return "previousObjectId: buffer expected";
                    if (message.nextObjectId != null && message.hasOwnProperty("nextObjectId"))
                        if (!(message.nextObjectId && typeof message.nextObjectId.length === "number" || $util.isString(message.nextObjectId)))
                            return "nextObjectId: buffer expected";
                    if (message.fields != null && message.hasOwnProperty("fields")) {
                        if (!Array.isArray(message.fields))
                            return "fields: array expected";
                        for (var i = 0; i < message.fields.length; ++i)
                            if (!$util.isString(message.fields[i]))
                                return "fields: string[] expected";
                    }
                    if (message.hideInToolbar != null && message.hasOwnProperty("hideInToolbar"))
                        if (typeof message.hideInToolbar !== "boolean")
                            return "hideInToolbar: boolean expected";
                    return null;
                };
    
                /**
                 * Creates a Bookmark message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.SyncRecord.Bookmark)
                        return object;
                    var message = new $root.api.SyncRecord.Bookmark();
                    if (object.site != null) {
                        if (typeof object.site !== "object")
                            throw TypeError(".api.SyncRecord.Bookmark.site: object expected");
                        message.site = $root.api.SyncRecord.Site.fromObject(object.site);
                    }
                    if (object.isFolder != null)
                        message.isFolder = Boolean(object.isFolder);
                    if (object.parentFolderObjectId != null)
                        if (typeof object.parentFolderObjectId === "string")
                            $util.base64.decode(object.parentFolderObjectId, message.parentFolderObjectId = $util.newBuffer($util.base64.length(object.parentFolderObjectId)), 0);
                        else if (object.parentFolderObjectId.length)
                            message.parentFolderObjectId = object.parentFolderObjectId;
                    if (object.previousObjectId != null)
                        if (typeof object.previousObjectId === "string")
                            $util.base64.decode(object.previousObjectId, message.previousObjectId = $util.newBuffer($util.base64.length(object.previousObjectId)), 0);
                        else if (object.previousObjectId.length)
                            message.previousObjectId = object.previousObjectId;
                    if (object.nextObjectId != null)
                        if (typeof object.nextObjectId === "string")
                            $util.base64.decode(object.nextObjectId, message.nextObjectId = $util.newBuffer($util.base64.length(object.nextObjectId)), 0);
                        else if (object.nextObjectId.length)
                            message.nextObjectId = object.nextObjectId;
                    if (object.fields) {
                        if (!Array.isArray(object.fields))
                            throw TypeError(".api.SyncRecord.Bookmark.fields: array expected");
                        message.fields = [];
                        for (var i = 0; i < object.fields.length; ++i)
                            message.fields[i] = String(object.fields[i]);
                    }
                    if (object.hideInToolbar != null)
                        message.hideInToolbar = Boolean(object.hideInToolbar);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Bookmark message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.SyncRecord.Bookmark
                 * @static
                 * @param {api.SyncRecord.Bookmark} message Bookmark
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Bookmark.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.fields = [];
                    if (options.defaults) {
                        object.site = null;
                        object.isFolder = false;
                        object.parentFolderObjectId = options.bytes === String ? "" : [];
                        object.previousObjectId = options.bytes === String ? "" : [];
                        object.nextObjectId = options.bytes === String ? "" : [];
                        object.hideInToolbar = false;
                    }
                    if (message.site != null && message.hasOwnProperty("site"))
                        object.site = $root.api.SyncRecord.Site.toObject(message.site, options);
                    if (message.isFolder != null && message.hasOwnProperty("isFolder"))
                        object.isFolder = message.isFolder;
                    if (message.parentFolderObjectId != null && message.hasOwnProperty("parentFolderObjectId"))
                        object.parentFolderObjectId = options.bytes === String ? $util.base64.encode(message.parentFolderObjectId, 0, message.parentFolderObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.parentFolderObjectId) : message.parentFolderObjectId;
                    if (message.previousObjectId != null && message.hasOwnProperty("previousObjectId"))
                        object.previousObjectId = options.bytes === String ? $util.base64.encode(message.previousObjectId, 0, message.previousObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.previousObjectId) : message.previousObjectId;
                    if (message.nextObjectId != null && message.hasOwnProperty("nextObjectId"))
                        object.nextObjectId = options.bytes === String ? $util.base64.encode(message.nextObjectId, 0, message.nextObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.nextObjectId) : message.nextObjectId;
                    if (message.fields && message.fields.length) {
                        object.fields = [];
                        for (var j = 0; j < message.fields.length; ++j)
                            object.fields[j] = message.fields[j];
                    }
                    if (message.hideInToolbar != null && message.hasOwnProperty("hideInToolbar"))
                        object.hideInToolbar = message.hideInToolbar;
                    return object;
                };
    
                /**
                 * Converts this Bookmark to JSON.
                 * @function toJSON
                 * @memberof api.SyncRecord.Bookmark
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Bookmark.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Bookmark;
            })();
    
            SyncRecord.SiteSetting = (function() {
    
                /**
                 * Properties of a SiteSetting.
                 * @memberof api.SyncRecord
                 * @interface ISiteSetting
                 * @property {string|null} [hostPattern] SiteSetting hostPattern
                 * @property {number|null} [zoomLevel] SiteSetting zoomLevel
                 * @property {boolean|null} [shieldsUp] SiteSetting shieldsUp
                 * @property {api.SyncRecord.SiteSetting.AdControl|null} [adControl] SiteSetting adControl
                 * @property {api.SyncRecord.SiteSetting.CookieControl|null} [cookieControl] SiteSetting cookieControl
                 * @property {boolean|null} [safeBrowsing] SiteSetting safeBrowsing
                 * @property {boolean|null} [noScript] SiteSetting noScript
                 * @property {boolean|null} [httpsEverywhere] SiteSetting httpsEverywhere
                 * @property {boolean|null} [fingerprintingProtection] SiteSetting fingerprintingProtection
                 * @property {boolean|null} [ledgerPayments] SiteSetting ledgerPayments
                 * @property {boolean|null} [ledgerPaymentsShown] SiteSetting ledgerPaymentsShown
                 * @property {Array.<string>|null} [fields] SiteSetting fields
                 */
    
                /**
                 * Constructs a new SiteSetting.
                 * @memberof api.SyncRecord
                 * @classdesc Represents a SiteSetting.
                 * @implements ISiteSetting
                 * @constructor
                 * @param {api.SyncRecord.ISiteSetting=} [properties] Properties to set
                 */
                function SiteSetting(properties) {
                    this.fields = [];
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * SiteSetting hostPattern.
                 * @member {string} hostPattern
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.hostPattern = "";
    
                /**
                 * SiteSetting zoomLevel.
                 * @member {number} zoomLevel
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.zoomLevel = 0;
    
                /**
                 * SiteSetting shieldsUp.
                 * @member {boolean} shieldsUp
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.shieldsUp = false;
    
                /**
                 * SiteSetting adControl.
                 * @member {api.SyncRecord.SiteSetting.AdControl} adControl
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.adControl = 0;
    
                /**
                 * SiteSetting cookieControl.
                 * @member {api.SyncRecord.SiteSetting.CookieControl} cookieControl
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.cookieControl = 0;
    
                /**
                 * SiteSetting safeBrowsing.
                 * @member {boolean} safeBrowsing
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.safeBrowsing = false;
    
                /**
                 * SiteSetting noScript.
                 * @member {boolean} noScript
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.noScript = false;
    
                /**
                 * SiteSetting httpsEverywhere.
                 * @member {boolean} httpsEverywhere
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.httpsEverywhere = false;
    
                /**
                 * SiteSetting fingerprintingProtection.
                 * @member {boolean} fingerprintingProtection
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.fingerprintingProtection = false;
    
                /**
                 * SiteSetting ledgerPayments.
                 * @member {boolean} ledgerPayments
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.ledgerPayments = false;
    
                /**
                 * SiteSetting ledgerPaymentsShown.
                 * @member {boolean} ledgerPaymentsShown
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.ledgerPaymentsShown = false;
    
                /**
                 * SiteSetting fields.
                 * @member {Array.<string>} fields
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 */
                SiteSetting.prototype.fields = $util.emptyArray;
    
                /**
                 * Creates a new SiteSetting instance using the specified properties.
                 * @function create
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {api.SyncRecord.ISiteSetting=} [properties] Properties to set
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting instance
                 */
                SiteSetting.create = function create(properties) {
                    return new SiteSetting(properties);
                };
    
                /**
                 * Encodes the specified SiteSetting message. Does not implicitly {@link api.SyncRecord.SiteSetting.verify|verify} messages.
                 * @function encode
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {api.SyncRecord.ISiteSetting} message SiteSetting message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SiteSetting.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.hostPattern != null && message.hasOwnProperty("hostPattern"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostPattern);
                    if (message.zoomLevel != null && message.hasOwnProperty("zoomLevel"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.zoomLevel);
                    if (message.shieldsUp != null && message.hasOwnProperty("shieldsUp"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.shieldsUp);
                    if (message.adControl != null && message.hasOwnProperty("adControl"))
                        writer.uint32(/* id 4, wireType 0 =*/32).int32(message.adControl);
                    if (message.cookieControl != null && message.hasOwnProperty("cookieControl"))
                        writer.uint32(/* id 5, wireType 0 =*/40).int32(message.cookieControl);
                    if (message.safeBrowsing != null && message.hasOwnProperty("safeBrowsing"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.safeBrowsing);
                    if (message.noScript != null && message.hasOwnProperty("noScript"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.noScript);
                    if (message.httpsEverywhere != null && message.hasOwnProperty("httpsEverywhere"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.httpsEverywhere);
                    if (message.fingerprintingProtection != null && message.hasOwnProperty("fingerprintingProtection"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.fingerprintingProtection);
                    if (message.ledgerPayments != null && message.hasOwnProperty("ledgerPayments"))
                        writer.uint32(/* id 10, wireType 0 =*/80).bool(message.ledgerPayments);
                    if (message.ledgerPaymentsShown != null && message.hasOwnProperty("ledgerPaymentsShown"))
                        writer.uint32(/* id 11, wireType 0 =*/88).bool(message.ledgerPaymentsShown);
                    if (message.fields != null && message.fields.length)
                        for (var i = 0; i < message.fields.length; ++i)
                            writer.uint32(/* id 12, wireType 2 =*/98).string(message.fields[i]);
                    return writer;
                };
    
                /**
                 * Encodes the specified SiteSetting message, length delimited. Does not implicitly {@link api.SyncRecord.SiteSetting.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {api.SyncRecord.ISiteSetting} message SiteSetting message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SiteSetting.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a SiteSetting message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SiteSetting.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord.SiteSetting();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.hostPattern = reader.string();
                            break;
                        case 2:
                            message.zoomLevel = reader.float();
                            break;
                        case 3:
                            message.shieldsUp = reader.bool();
                            break;
                        case 4:
                            message.adControl = reader.int32();
                            break;
                        case 5:
                            message.cookieControl = reader.int32();
                            break;
                        case 6:
                            message.safeBrowsing = reader.bool();
                            break;
                        case 7:
                            message.noScript = reader.bool();
                            break;
                        case 8:
                            message.httpsEverywhere = reader.bool();
                            break;
                        case 9:
                            message.fingerprintingProtection = reader.bool();
                            break;
                        case 10:
                            message.ledgerPayments = reader.bool();
                            break;
                        case 11:
                            message.ledgerPaymentsShown = reader.bool();
                            break;
                        case 12:
                            if (!(message.fields && message.fields.length))
                                message.fields = [];
                            message.fields.push(reader.string());
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a SiteSetting message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                SiteSetting.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a SiteSetting message.
                 * @function verify
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                SiteSetting.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.hostPattern != null && message.hasOwnProperty("hostPattern"))
                        if (!$util.isString(message.hostPattern))
                            return "hostPattern: string expected";
                    if (message.zoomLevel != null && message.hasOwnProperty("zoomLevel"))
                        if (typeof message.zoomLevel !== "number")
                            return "zoomLevel: number expected";
                    if (message.shieldsUp != null && message.hasOwnProperty("shieldsUp"))
                        if (typeof message.shieldsUp !== "boolean")
                            return "shieldsUp: boolean expected";
                    if (message.adControl != null && message.hasOwnProperty("adControl"))
                        switch (message.adControl) {
                        default:
                            return "adControl: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.cookieControl != null && message.hasOwnProperty("cookieControl"))
                        switch (message.cookieControl) {
                        default:
                            return "cookieControl: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.safeBrowsing != null && message.hasOwnProperty("safeBrowsing"))
                        if (typeof message.safeBrowsing !== "boolean")
                            return "safeBrowsing: boolean expected";
                    if (message.noScript != null && message.hasOwnProperty("noScript"))
                        if (typeof message.noScript !== "boolean")
                            return "noScript: boolean expected";
                    if (message.httpsEverywhere != null && message.hasOwnProperty("httpsEverywhere"))
                        if (typeof message.httpsEverywhere !== "boolean")
                            return "httpsEverywhere: boolean expected";
                    if (message.fingerprintingProtection != null && message.hasOwnProperty("fingerprintingProtection"))
                        if (typeof message.fingerprintingProtection !== "boolean")
                            return "fingerprintingProtection: boolean expected";
                    if (message.ledgerPayments != null && message.hasOwnProperty("ledgerPayments"))
                        if (typeof message.ledgerPayments !== "boolean")
                            return "ledgerPayments: boolean expected";
                    if (message.ledgerPaymentsShown != null && message.hasOwnProperty("ledgerPaymentsShown"))
                        if (typeof message.ledgerPaymentsShown !== "boolean")
                            return "ledgerPaymentsShown: boolean expected";
                    if (message.fields != null && message.hasOwnProperty("fields")) {
                        if (!Array.isArray(message.fields))
                            return "fields: array expected";
                        for (var i = 0; i < message.fields.length; ++i)
                            if (!$util.isString(message.fields[i]))
                                return "fields: string[] expected";
                    }
                    return null;
                };
    
                /**
                 * Creates a SiteSetting message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.SyncRecord.SiteSetting)
                        return object;
                    var message = new $root.api.SyncRecord.SiteSetting();
                    if (object.hostPattern != null)
                        message.hostPattern = String(object.hostPattern);
                    if (object.zoomLevel != null)
                        message.zoomLevel = Number(object.zoomLevel);
                    if (object.shieldsUp != null)
                        message.shieldsUp = Boolean(object.shieldsUp);
                    switch (object.adControl) {
                    case "SHOW_BRAVE_ADS":
                    case 0:
                        message.adControl = 0;
                        break;
                    case "BLOCK_ADS":
                    case 1:
                        message.adControl = 1;
                        break;
                    case "ALLOW_ADS_AND_TRACKING":
                    case 2:
                        message.adControl = 2;
                        break;
                    }
                    switch (object.cookieControl) {
                    case "BLOCK_THIRD_PARTY_COOKIE":
                    case 0:
                        message.cookieControl = 0;
                        break;
                    case "ALLOW_ALL_COOKIES":
                    case 1:
                        message.cookieControl = 1;
                        break;
                    case "BLOCK_ALL_COOKIES":
                    case 2:
                        message.cookieControl = 2;
                        break;
                    }
                    if (object.safeBrowsing != null)
                        message.safeBrowsing = Boolean(object.safeBrowsing);
                    if (object.noScript != null)
                        message.noScript = Boolean(object.noScript);
                    if (object.httpsEverywhere != null)
                        message.httpsEverywhere = Boolean(object.httpsEverywhere);
                    if (object.fingerprintingProtection != null)
                        message.fingerprintingProtection = Boolean(object.fingerprintingProtection);
                    if (object.ledgerPayments != null)
                        message.ledgerPayments = Boolean(object.ledgerPayments);
                    if (object.ledgerPaymentsShown != null)
                        message.ledgerPaymentsShown = Boolean(object.ledgerPaymentsShown);
                    if (object.fields) {
                        if (!Array.isArray(object.fields))
                            throw TypeError(".api.SyncRecord.SiteSetting.fields: array expected");
                        message.fields = [];
                        for (var i = 0; i < object.fields.length; ++i)
                            message.fields[i] = String(object.fields[i]);
                    }
                    return message;
                };
    
                /**
                 * Creates a plain object from a SiteSetting message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.SyncRecord.SiteSetting
                 * @static
                 * @param {api.SyncRecord.SiteSetting} message SiteSetting
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SiteSetting.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.arrays || options.defaults)
                        object.fields = [];
                    if (options.defaults) {
                        object.hostPattern = "";
                        object.zoomLevel = 0;
                        object.shieldsUp = false;
                        object.adControl = options.enums === String ? "SHOW_BRAVE_ADS" : 0;
                        object.cookieControl = options.enums === String ? "BLOCK_THIRD_PARTY_COOKIE" : 0;
                        object.safeBrowsing = false;
                        object.noScript = false;
                        object.httpsEverywhere = false;
                        object.fingerprintingProtection = false;
                        object.ledgerPayments = false;
                        object.ledgerPaymentsShown = false;
                    }
                    if (message.hostPattern != null && message.hasOwnProperty("hostPattern"))
                        object.hostPattern = message.hostPattern;
                    if (message.zoomLevel != null && message.hasOwnProperty("zoomLevel"))
                        object.zoomLevel = options.json && !isFinite(message.zoomLevel) ? String(message.zoomLevel) : message.zoomLevel;
                    if (message.shieldsUp != null && message.hasOwnProperty("shieldsUp"))
                        object.shieldsUp = message.shieldsUp;
                    if (message.adControl != null && message.hasOwnProperty("adControl"))
                        object.adControl = options.enums === String ? $root.api.SyncRecord.SiteSetting.AdControl[message.adControl] : message.adControl;
                    if (message.cookieControl != null && message.hasOwnProperty("cookieControl"))
                        object.cookieControl = options.enums === String ? $root.api.SyncRecord.SiteSetting.CookieControl[message.cookieControl] : message.cookieControl;
                    if (message.safeBrowsing != null && message.hasOwnProperty("safeBrowsing"))
                        object.safeBrowsing = message.safeBrowsing;
                    if (message.noScript != null && message.hasOwnProperty("noScript"))
                        object.noScript = message.noScript;
                    if (message.httpsEverywhere != null && message.hasOwnProperty("httpsEverywhere"))
                        object.httpsEverywhere = message.httpsEverywhere;
                    if (message.fingerprintingProtection != null && message.hasOwnProperty("fingerprintingProtection"))
                        object.fingerprintingProtection = message.fingerprintingProtection;
                    if (message.ledgerPayments != null && message.hasOwnProperty("ledgerPayments"))
                        object.ledgerPayments = message.ledgerPayments;
                    if (message.ledgerPaymentsShown != null && message.hasOwnProperty("ledgerPaymentsShown"))
                        object.ledgerPaymentsShown = message.ledgerPaymentsShown;
                    if (message.fields && message.fields.length) {
                        object.fields = [];
                        for (var j = 0; j < message.fields.length; ++j)
                            object.fields[j] = message.fields[j];
                    }
                    return object;
                };
    
                /**
                 * Converts this SiteSetting to JSON.
                 * @function toJSON
                 * @memberof api.SyncRecord.SiteSetting
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                SiteSetting.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * AdControl enum.
                 * @name api.SyncRecord.SiteSetting.AdControl
                 * @enum {string}
                 * @property {number} SHOW_BRAVE_ADS=0 SHOW_BRAVE_ADS value
                 * @property {number} BLOCK_ADS=1 BLOCK_ADS value
                 * @property {number} ALLOW_ADS_AND_TRACKING=2 ALLOW_ADS_AND_TRACKING value
                 */
                SiteSetting.AdControl = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "SHOW_BRAVE_ADS"] = 0;
                    values[valuesById[1] = "BLOCK_ADS"] = 1;
                    values[valuesById[2] = "ALLOW_ADS_AND_TRACKING"] = 2;
                    return values;
                })();
    
                /**
                 * CookieControl enum.
                 * @name api.SyncRecord.SiteSetting.CookieControl
                 * @enum {string}
                 * @property {number} BLOCK_THIRD_PARTY_COOKIE=0 BLOCK_THIRD_PARTY_COOKIE value
                 * @property {number} ALLOW_ALL_COOKIES=1 ALLOW_ALL_COOKIES value
                 * @property {number} BLOCK_ALL_COOKIES=2 BLOCK_ALL_COOKIES value
                 */
                SiteSetting.CookieControl = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "BLOCK_THIRD_PARTY_COOKIE"] = 0;
                    values[valuesById[1] = "ALLOW_ALL_COOKIES"] = 1;
                    values[valuesById[2] = "BLOCK_ALL_COOKIES"] = 2;
                    return values;
                })();
    
                return SiteSetting;
            })();
    
            SyncRecord.Device = (function() {
    
                /**
                 * Properties of a Device.
                 * @memberof api.SyncRecord
                 * @interface IDevice
                 * @property {string|null} [name] Device name
                 */
    
                /**
                 * Constructs a new Device.
                 * @memberof api.SyncRecord
                 * @classdesc Represents a Device.
                 * @implements IDevice
                 * @constructor
                 * @param {api.SyncRecord.IDevice=} [properties] Properties to set
                 */
                function Device(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            if (properties[keys[i]] != null)
                                this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Device name.
                 * @member {string} name
                 * @memberof api.SyncRecord.Device
                 * @instance
                 */
                Device.prototype.name = "";
    
                /**
                 * Creates a new Device instance using the specified properties.
                 * @function create
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {api.SyncRecord.IDevice=} [properties] Properties to set
                 * @returns {api.SyncRecord.Device} Device instance
                 */
                Device.create = function create(properties) {
                    return new Device(properties);
                };
    
                /**
                 * Encodes the specified Device message. Does not implicitly {@link api.SyncRecord.Device.verify|verify} messages.
                 * @function encode
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {api.SyncRecord.IDevice} message Device message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Device.encode = function encode(message, writer) {
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name != null && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    return writer;
                };
    
                /**
                 * Encodes the specified Device message, length delimited. Does not implicitly {@link api.SyncRecord.Device.verify|verify} messages.
                 * @function encodeDelimited
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {api.SyncRecord.IDevice} message Device message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Device.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Device message from the specified reader or buffer.
                 * @function decode
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Device} Device
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Device.decode = function decode(reader, length) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord.Device();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.name = reader.string();
                            break;
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Device message from the specified reader or buffer, length delimited.
                 * @function decodeDelimited
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Device} Device
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                Device.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = new $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Device message.
                 * @function verify
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {Object.<string,*>} message Plain object to verify
                 * @returns {string|null} `null` if valid, otherwise the reason why it is not
                 */
                Device.verify = function verify(message) {
                    if (typeof message !== "object" || message === null)
                        return "object expected";
                    if (message.name != null && message.hasOwnProperty("name"))
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    return null;
                };
    
                /**
                 * Creates a Device message from a plain object. Also converts values to their respective internal types.
                 * @function fromObject
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.fromObject = function fromObject(object) {
                    if (object instanceof $root.api.SyncRecord.Device)
                        return object;
                    var message = new $root.api.SyncRecord.Device();
                    if (object.name != null)
                        message.name = String(object.name);
                    return message;
                };
    
                /**
                 * Creates a plain object from a Device message. Also converts values to other types if specified.
                 * @function toObject
                 * @memberof api.SyncRecord.Device
                 * @static
                 * @param {api.SyncRecord.Device} message Device
                 * @param {$protobuf.IConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Device.toObject = function toObject(message, options) {
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.name = "";
                    if (message.name != null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    return object;
                };
    
                /**
                 * Converts this Device to JSON.
                 * @function toJSON
                 * @memberof api.SyncRecord.Device
                 * @instance
                 * @returns {Object.<string,*>} JSON object
                 */
                Device.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Device;
            })();
    
            return SyncRecord;
        })();
    
        return api;
    })();

    return $root;
});
