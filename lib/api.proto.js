/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobuf"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    // Common aliases
    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    // Lazily resolved type references
    var $lazyTypes = [];
    
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
             * Constructs a new Credentials.
             * @exports api.Credentials
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function Credentials(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * Credentials aws.
             * @type {api.Credentials.Aws}
             */
            Credentials.prototype.aws = null;
    
            /**
             * Credentials s3Post.
             * @type {api.Credentials.S3Post}
             */
            Credentials.prototype.s3Post = null;
    
            /**
             * Credentials bucket.
             * @type {string}
             */
            Credentials.prototype.bucket = "";
    
            /**
             * Credentials region.
             * @type {string}
             */
            Credentials.prototype.region = "";
    
            // Lazily resolved type references
            var $types = {
                0: "api.Credentials.Aws",
                1: "api.Credentials.S3Post"
            }; $lazyTypes.push($types);
    
            /**
             * Creates a new Credentials instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {api.Credentials} Credentials instance
             */
            Credentials.create = function create(properties) {
                return new Credentials(properties);
            };
    
            /**
             * Encodes the specified Credentials message.
             * @param {api.Credentials|Object} message Credentials message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Credentials.encode = function encode(message, writer) {    
                if (!writer)
                    writer = $Writer.create();
                if (message.aws && message.hasOwnProperty("aws"))
                    $types[0].encode(message.aws, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                if (message.s3Post && message.hasOwnProperty("s3Post"))
                    $types[1].encode(message.s3Post, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
                if (message.bucket !== undefined && message.hasOwnProperty("bucket"))
                    writer.uint32(/* id 3, wireType 2 =*/26).string(message.bucket);
                if (message.region !== undefined && message.hasOwnProperty("region"))
                    writer.uint32(/* id 4, wireType 2 =*/34).string(message.region);
                return writer;
            };
    
            /**
             * Encodes the specified Credentials message, length delimited.
             * @param {api.Credentials|Object} message Credentials message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Credentials.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a Credentials message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.Credentials} Credentials
             */
            Credentials.decode = function decode(reader, length) {    
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.Credentials();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.aws = $types[0].decode(reader, reader.uint32());
                        break;
                    case 2:
                        message.s3Post = $types[1].decode(reader, reader.uint32());
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
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.Credentials} Credentials
             */
            Credentials.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a Credentials message.
             * @param {api.Credentials|Object} message Credentials message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Credentials.verify = function verify(message) {    
                if (message.aws !== undefined && message.aws !== null) {
                    var error = $types[0].verify(message.aws);
                    if (error)
                        return "aws." + error;
                }
                if (message.s3Post !== undefined && message.s3Post !== null) {
                    var error = $types[1].verify(message.s3Post);
                    if (error)
                        return "s3Post." + error;
                }
                if (message.bucket !== undefined)
                    if (!$util.isString(message.bucket))
                        return "bucket: string expected";
                if (message.region !== undefined)
                    if (!$util.isString(message.region))
                        return "region: string expected";
                return null;
            };
    
            /**
             * Creates a Credentials message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {api.Credentials} Credentials
             */
            Credentials.fromObject = function fromObject(object) {    
                if (object instanceof $root.api.Credentials)
                    return object;
                var message = new $root.api.Credentials();
                if (object.aws !== undefined && object.aws !== null) {
                    if (typeof object.aws !== "object")
                        throw TypeError(".api.Credentials.aws: object expected");
                    message.aws = $types[0].fromObject(object.aws);
                }
                if (object.s3Post !== undefined && object.s3Post !== null) {
                    if (typeof object.s3Post !== "object")
                        throw TypeError(".api.Credentials.s3Post: object expected");
                    message.s3Post = $types[1].fromObject(object.s3Post);
                }
                if (object.bucket !== undefined && object.bucket !== null)
                    message.bucket = String(object.bucket);
                if (object.region !== undefined && object.region !== null)
                    message.region = String(object.region);
                return message;
            };
    
            /**
             * Creates a Credentials message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link api.Credentials.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {api.Credentials} Credentials
             */
            Credentials.from = Credentials.fromObject;
    
            /**
             * Creates a plain object from a Credentials message. Also converts values to other types if specified.
             * @param {api.Credentials} message Credentials
             * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                if (message.aws !== undefined && message.aws !== null && message.hasOwnProperty("aws"))
                    object.aws = $types[0].toObject(message.aws, options);
                if (message.s3Post !== undefined && message.s3Post !== null && message.hasOwnProperty("s3Post"))
                    object.s3Post = $types[1].toObject(message.s3Post, options);
                if (message.bucket !== undefined && message.bucket !== null && message.hasOwnProperty("bucket"))
                    object.bucket = message.bucket;
                if (message.region !== undefined && message.region !== null && message.hasOwnProperty("region"))
                    object.region = message.region;
                return object;
            };
    
            /**
             * Creates a plain object from this Credentials message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Credentials.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };
    
            /**
             * Converts this Credentials to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            Credentials.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            Credentials.Aws = (function() {
    
                /**
                 * Constructs a new Aws.
                 * @exports api.Credentials.Aws
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Aws(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Aws accessKeyId.
                 * @type {string}
                 */
                Aws.prototype.accessKeyId = "";
    
                /**
                 * Aws secretAccessKey.
                 * @type {string}
                 */
                Aws.prototype.secretAccessKey = "";
    
                /**
                 * Aws sessionToken.
                 * @type {string}
                 */
                Aws.prototype.sessionToken = "";
    
                /**
                 * Aws expiration.
                 * @type {string}
                 */
                Aws.prototype.expiration = "";
    
                /**
                 * Creates a new Aws instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.Credentials.Aws} Aws instance
                 */
                Aws.create = function create(properties) {
                    return new Aws(properties);
                };
    
                /**
                 * Encodes the specified Aws message.
                 * @param {api.Credentials.Aws|Object} message Aws message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Aws.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.accessKeyId !== undefined && message.hasOwnProperty("accessKeyId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.accessKeyId);
                    if (message.secretAccessKey !== undefined && message.hasOwnProperty("secretAccessKey"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.secretAccessKey);
                    if (message.sessionToken !== undefined && message.hasOwnProperty("sessionToken"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.sessionToken);
                    if (message.expiration !== undefined && message.hasOwnProperty("expiration"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.expiration);
                    return writer;
                };
    
                /**
                 * Encodes the specified Aws message, length delimited.
                 * @param {api.Credentials.Aws|Object} message Aws message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Aws.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes an Aws message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.Aws} Aws
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies an Aws message.
                 * @param {api.Credentials.Aws|Object} message Aws message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Aws.verify = function verify(message) {    
                    if (message.accessKeyId !== undefined)
                        if (!$util.isString(message.accessKeyId))
                            return "accessKeyId: string expected";
                    if (message.secretAccessKey !== undefined)
                        if (!$util.isString(message.secretAccessKey))
                            return "secretAccessKey: string expected";
                    if (message.sessionToken !== undefined)
                        if (!$util.isString(message.sessionToken))
                            return "sessionToken: string expected";
                    if (message.expiration !== undefined)
                        if (!$util.isString(message.expiration))
                            return "expiration: string expected";
                    return null;
                };
    
                /**
                 * Creates an Aws message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.Credentials.Aws)
                        return object;
                    var message = new $root.api.Credentials.Aws();
                    if (object.accessKeyId !== undefined && object.accessKeyId !== null)
                        message.accessKeyId = String(object.accessKeyId);
                    if (object.secretAccessKey !== undefined && object.secretAccessKey !== null)
                        message.secretAccessKey = String(object.secretAccessKey);
                    if (object.sessionToken !== undefined && object.sessionToken !== null)
                        message.sessionToken = String(object.sessionToken);
                    if (object.expiration !== undefined && object.expiration !== null)
                        message.expiration = String(object.expiration);
                    return message;
                };
    
                /**
                 * Creates an Aws message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.Credentials.Aws.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.from = Aws.fromObject;
    
                /**
                 * Creates a plain object from an Aws message. Also converts values to other types if specified.
                 * @param {api.Credentials.Aws} message Aws
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    if (message.accessKeyId !== undefined && message.accessKeyId !== null && message.hasOwnProperty("accessKeyId"))
                        object.accessKeyId = message.accessKeyId;
                    if (message.secretAccessKey !== undefined && message.secretAccessKey !== null && message.hasOwnProperty("secretAccessKey"))
                        object.secretAccessKey = message.secretAccessKey;
                    if (message.sessionToken !== undefined && message.sessionToken !== null && message.hasOwnProperty("sessionToken"))
                        object.sessionToken = message.sessionToken;
                    if (message.expiration !== undefined && message.expiration !== null && message.hasOwnProperty("expiration"))
                        object.expiration = message.expiration;
                    return object;
                };
    
                /**
                 * Creates a plain object from this Aws message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Aws.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this Aws to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Aws.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Aws;
            })();
    
            Credentials.S3Post = (function() {
    
                /**
                 * Constructs a new S3Post.
                 * @exports api.Credentials.S3Post
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function S3Post(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * S3Post AWSAccessKeyId.
                 * @type {string}
                 */
                S3Post.prototype.AWSAccessKeyId = "";
    
                /**
                 * S3Post policy.
                 * @type {string}
                 */
                S3Post.prototype.policy = "";
    
                /**
                 * S3Post signature.
                 * @type {string}
                 */
                S3Post.prototype.signature = "";
    
                /**
                 * S3Post acl.
                 * @type {string}
                 */
                S3Post.prototype.acl = "";
    
                /**
                 * Creates a new S3Post instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.Credentials.S3Post} S3Post instance
                 */
                S3Post.create = function create(properties) {
                    return new S3Post(properties);
                };
    
                /**
                 * Encodes the specified S3Post message.
                 * @param {api.Credentials.S3Post|Object} message S3Post message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                S3Post.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.AWSAccessKeyId !== undefined && message.hasOwnProperty("AWSAccessKeyId"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.AWSAccessKeyId);
                    if (message.policy !== undefined && message.hasOwnProperty("policy"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.policy);
                    if (message.signature !== undefined && message.hasOwnProperty("signature"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.signature);
                    if (message.acl !== undefined && message.hasOwnProperty("acl"))
                        writer.uint32(/* id 4, wireType 2 =*/34).string(message.acl);
                    return writer;
                };
    
                /**
                 * Encodes the specified S3Post message, length delimited.
                 * @param {api.Credentials.S3Post|Object} message S3Post message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                S3Post.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a S3Post message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.S3Post} S3Post
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a S3Post message.
                 * @param {api.Credentials.S3Post|Object} message S3Post message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                S3Post.verify = function verify(message) {    
                    if (message.AWSAccessKeyId !== undefined)
                        if (!$util.isString(message.AWSAccessKeyId))
                            return "AWSAccessKeyId: string expected";
                    if (message.policy !== undefined)
                        if (!$util.isString(message.policy))
                            return "policy: string expected";
                    if (message.signature !== undefined)
                        if (!$util.isString(message.signature))
                            return "signature: string expected";
                    if (message.acl !== undefined)
                        if (!$util.isString(message.acl))
                            return "acl: string expected";
                    return null;
                };
    
                /**
                 * Creates a S3Post message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.Credentials.S3Post)
                        return object;
                    var message = new $root.api.Credentials.S3Post();
                    if (object.AWSAccessKeyId !== undefined && object.AWSAccessKeyId !== null)
                        message.AWSAccessKeyId = String(object.AWSAccessKeyId);
                    if (object.policy !== undefined && object.policy !== null)
                        message.policy = String(object.policy);
                    if (object.signature !== undefined && object.signature !== null)
                        message.signature = String(object.signature);
                    if (object.acl !== undefined && object.acl !== null)
                        message.acl = String(object.acl);
                    return message;
                };
    
                /**
                 * Creates a S3Post message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.Credentials.S3Post.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.from = S3Post.fromObject;
    
                /**
                 * Creates a plain object from a S3Post message. Also converts values to other types if specified.
                 * @param {api.Credentials.S3Post} message S3Post
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    if (message.AWSAccessKeyId !== undefined && message.AWSAccessKeyId !== null && message.hasOwnProperty("AWSAccessKeyId"))
                        object.AWSAccessKeyId = message.AWSAccessKeyId;
                    if (message.policy !== undefined && message.policy !== null && message.hasOwnProperty("policy"))
                        object.policy = message.policy;
                    if (message.signature !== undefined && message.signature !== null && message.hasOwnProperty("signature"))
                        object.signature = message.signature;
                    if (message.acl !== undefined && message.acl !== null && message.hasOwnProperty("acl"))
                        object.acl = message.acl;
                    return object;
                };
    
                /**
                 * Creates a plain object from this S3Post message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                S3Post.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this S3Post to JSON.
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
             * Constructs a new SecretboxRecord.
             * @exports api.SecretboxRecord
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function SecretboxRecord(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SecretboxRecord encryptedData.
             * @type {Uint8Array}
             */
            SecretboxRecord.prototype.encryptedData = $util.newBuffer([]);
    
            /**
             * SecretboxRecord counter.
             * @type {number}
             */
            SecretboxRecord.prototype.counter = 0;
    
            /**
             * SecretboxRecord nonceRandom.
             * @type {Uint8Array}
             */
            SecretboxRecord.prototype.nonceRandom = $util.newBuffer([]);
    
            /**
             * Creates a new SecretboxRecord instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {api.SecretboxRecord} SecretboxRecord instance
             */
            SecretboxRecord.create = function create(properties) {
                return new SecretboxRecord(properties);
            };
    
            /**
             * Encodes the specified SecretboxRecord message.
             * @param {api.SecretboxRecord|Object} message SecretboxRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecretboxRecord.encode = function encode(message, writer) {    
                if (!writer)
                    writer = $Writer.create();
                if (message.encryptedData && message.hasOwnProperty("encryptedData"))
                    writer.uint32(/* id 1, wireType 2 =*/10).bytes(message.encryptedData);
                if (message.counter !== undefined && message.hasOwnProperty("counter"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.counter);
                if (message.nonceRandom && message.hasOwnProperty("nonceRandom"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.nonceRandom);
                return writer;
            };
    
            /**
             * Encodes the specified SecretboxRecord message, length delimited.
             * @param {api.SecretboxRecord|Object} message SecretboxRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecretboxRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SecretboxRecord message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SecretboxRecord} SecretboxRecord
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
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SecretboxRecord message.
             * @param {api.SecretboxRecord|Object} message SecretboxRecord message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            SecretboxRecord.verify = function verify(message) {    
                if (message.encryptedData !== undefined)
                    if (!(message.encryptedData && typeof message.encryptedData.length === "number" || $util.isString(message.encryptedData)))
                        return "encryptedData: buffer expected";
                if (message.counter !== undefined)
                    if (!$util.isInteger(message.counter))
                        return "counter: integer expected";
                if (message.nonceRandom !== undefined)
                    if (!(message.nonceRandom && typeof message.nonceRandom.length === "number" || $util.isString(message.nonceRandom)))
                        return "nonceRandom: buffer expected";
                return null;
            };
    
            /**
             * Creates a SecretboxRecord message from a plain object. Also converts values to their respective internal types.
             * @param {Object.<string,*>} object Plain object
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.fromObject = function fromObject(object) {    
                if (object instanceof $root.api.SecretboxRecord)
                    return object;
                var message = new $root.api.SecretboxRecord();
                if (object.encryptedData !== undefined && object.encryptedData !== null)
                    if (typeof object.encryptedData === "string")
                        $util.base64.decode(object.encryptedData, message.encryptedData = $util.newBuffer($util.base64.length(object.encryptedData)), 0);
                    else if (object.encryptedData.length)
                        message.encryptedData = object.encryptedData;
                if (object.counter !== undefined && object.counter !== null)
                    message.counter = object.counter >>> 0;
                if (object.nonceRandom !== undefined && object.nonceRandom !== null)
                    if (typeof object.nonceRandom === "string")
                        $util.base64.decode(object.nonceRandom, message.nonceRandom = $util.newBuffer($util.base64.length(object.nonceRandom)), 0);
                    else if (object.nonceRandom.length)
                        message.nonceRandom = object.nonceRandom;
                return message;
            };
    
            /**
             * Creates a SecretboxRecord message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link api.SecretboxRecord.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.from = SecretboxRecord.fromObject;
    
            /**
             * Creates a plain object from a SecretboxRecord message. Also converts values to other types if specified.
             * @param {api.SecretboxRecord} message SecretboxRecord
             * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                if (message.encryptedData !== undefined && message.encryptedData !== null && message.hasOwnProperty("encryptedData"))
                    object.encryptedData = options.bytes === String ? $util.base64.encode(message.encryptedData, 0, message.encryptedData.length) : options.bytes === Array ? Array.prototype.slice.call(message.encryptedData) : message.encryptedData;
                if (message.counter !== undefined && message.counter !== null && message.hasOwnProperty("counter"))
                    object.counter = message.counter;
                if (message.nonceRandom !== undefined && message.nonceRandom !== null && message.hasOwnProperty("nonceRandom"))
                    object.nonceRandom = options.bytes === String ? $util.base64.encode(message.nonceRandom, 0, message.nonceRandom.length) : options.bytes === Array ? Array.prototype.slice.call(message.nonceRandom) : message.nonceRandom;
                return object;
            };
    
            /**
             * Creates a plain object from this SecretboxRecord message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SecretboxRecord.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };
    
            /**
             * Converts this SecretboxRecord to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            SecretboxRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return SecretboxRecord;
        })();
    
        api.SyncRecord = (function() {
    
            /**
             * Constructs a new SyncRecord.
             * @exports api.SyncRecord
             * @constructor
             * @param {Object} [properties] Properties to set
             */
            function SyncRecord(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * SyncRecord action.
             * @type {number}
             */
            SyncRecord.prototype.action = 0;
    
            /**
             * SyncRecord deviceId.
             * @type {Uint8Array}
             */
            SyncRecord.prototype.deviceId = $util.newBuffer([]);
    
            /**
             * SyncRecord objectId.
             * @type {Uint8Array}
             */
            SyncRecord.prototype.objectId = $util.newBuffer([]);
    
            /**
             * SyncRecord bookmark.
             * @type {api.SyncRecord.Bookmark}
             */
            SyncRecord.prototype.bookmark = null;
    
            /**
             * SyncRecord historySite.
             * @type {api.SyncRecord.Site}
             */
            SyncRecord.prototype.historySite = null;
    
            /**
             * SyncRecord siteSetting.
             * @type {api.SyncRecord.SiteSetting}
             */
            SyncRecord.prototype.siteSetting = null;
    
            /**
             * SyncRecord device.
             * @type {api.SyncRecord.Device}
             */
            SyncRecord.prototype.device = null;
    
            // OneOf field names bound to virtual getters and setters
            var $oneOfFields;
    
            /**
             * SyncRecord objectData.
             * @name api.SyncRecord#objectData
             * @type {string|undefined}
             */
            Object.defineProperty(SyncRecord.prototype, "objectData", {
                get: $util.oneOfGetter($oneOfFields = ["bookmark", "historySite", "siteSetting", "device"]),
                set: $util.oneOfSetter($oneOfFields)
            });
    
            // Lazily resolved type references
            var $types = {
                0: "api.SyncRecord.Action",
                3: "api.SyncRecord.Bookmark",
                4: "api.SyncRecord.Site",
                5: "api.SyncRecord.SiteSetting",
                6: "api.SyncRecord.Device"
            }; $lazyTypes.push($types);
    
            /**
             * Creates a new SyncRecord instance using the specified properties.
             * @param {Object} [properties] Properties to set
             * @returns {api.SyncRecord} SyncRecord instance
             */
            SyncRecord.create = function create(properties) {
                return new SyncRecord(properties);
            };
    
            /**
             * Encodes the specified SyncRecord message.
             * @param {api.SyncRecord|Object} message SyncRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncRecord.encode = function encode(message, writer) {    
                if (!writer)
                    writer = $Writer.create();
                if (message.action !== undefined && message.hasOwnProperty("action"))
                    writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.action);
                if (message.deviceId && message.hasOwnProperty("deviceId"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.deviceId);
                if (message.objectId && message.hasOwnProperty("objectId"))
                    writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.objectId);
                switch (message.objectData) {
                case "bookmark":
                    $types[3].encode(message.bookmark, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
                    break;
                case "historySite":
                    $types[4].encode(message.historySite, writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
                    break;
                case "siteSetting":
                    $types[5].encode(message.siteSetting, writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
                    break;
                case "device":
                    $types[6].encode(message.device, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
                    break;
                }
                return writer;
            };
    
            /**
             * Encodes the specified SyncRecord message, length delimited.
             * @param {api.SyncRecord|Object} message SyncRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncRecord.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a SyncRecord message from the specified reader or buffer.
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.decode = function decode(reader, length) {    
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.action = reader.uint32();
                        break;
                    case 2:
                        message.deviceId = reader.bytes();
                        break;
                    case 3:
                        message.objectId = reader.bytes();
                        break;
                    case 4:
                        message.bookmark = $types[3].decode(reader, reader.uint32());
                        break;
                    case 5:
                        message.historySite = $types[4].decode(reader, reader.uint32());
                        break;
                    case 6:
                        message.siteSetting = $types[5].decode(reader, reader.uint32());
                        break;
                    case 7:
                        message.device = $types[6].decode(reader, reader.uint32());
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
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a SyncRecord message.
             * @param {api.SyncRecord|Object} message SyncRecord message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            SyncRecord.verify = function verify(message) {    
                if (message.action !== undefined)
                    switch (message.action) {
                    default:
                        return "action: enum value expected";
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                if (message.deviceId !== undefined)
                    if (!(message.deviceId && typeof message.deviceId.length === "number" || $util.isString(message.deviceId)))
                        return "deviceId: buffer expected";
                if (message.objectId !== undefined)
                    if (!(message.objectId && typeof message.objectId.length === "number" || $util.isString(message.objectId)))
                        return "objectId: buffer expected";
                if (message.bookmark !== undefined && message.bookmark !== null) {
                    var error = $types[3].verify(message.bookmark);
                    if (error)
                        return "bookmark." + error;
                }
                if (message.historySite !== undefined && message.historySite !== null) {
                    var error = $types[4].verify(message.historySite);
                    if (error)
                        return "historySite." + error;
                }
                if (message.siteSetting !== undefined && message.siteSetting !== null) {
                    var error = $types[5].verify(message.siteSetting);
                    if (error)
                        return "siteSetting." + error;
                }
                if (message.device !== undefined && message.device !== null) {
                    var error = $types[6].verify(message.device);
                    if (error)
                        return "device." + error;
                }
                return null;
            };
    
            /**
             * Creates a SyncRecord message from a plain object. Also converts values to their respective internal types.
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
                if (object.deviceId !== undefined && object.deviceId !== null)
                    if (typeof object.deviceId === "string")
                        $util.base64.decode(object.deviceId, message.deviceId = $util.newBuffer($util.base64.length(object.deviceId)), 0);
                    else if (object.deviceId.length)
                        message.deviceId = object.deviceId;
                if (object.objectId !== undefined && object.objectId !== null)
                    if (typeof object.objectId === "string")
                        $util.base64.decode(object.objectId, message.objectId = $util.newBuffer($util.base64.length(object.objectId)), 0);
                    else if (object.objectId.length)
                        message.objectId = object.objectId;
                if (object.bookmark !== undefined && object.bookmark !== null) {
                    if (typeof object.bookmark !== "object")
                        throw TypeError(".api.SyncRecord.bookmark: object expected");
                    message.bookmark = $types[3].fromObject(object.bookmark);
                }
                if (object.historySite !== undefined && object.historySite !== null) {
                    if (typeof object.historySite !== "object")
                        throw TypeError(".api.SyncRecord.historySite: object expected");
                    message.historySite = $types[4].fromObject(object.historySite);
                }
                if (object.siteSetting !== undefined && object.siteSetting !== null) {
                    if (typeof object.siteSetting !== "object")
                        throw TypeError(".api.SyncRecord.siteSetting: object expected");
                    message.siteSetting = $types[5].fromObject(object.siteSetting);
                }
                if (object.device !== undefined && object.device !== null) {
                    if (typeof object.device !== "object")
                        throw TypeError(".api.SyncRecord.device: object expected");
                    message.device = $types[6].fromObject(object.device);
                }
                return message;
            };
    
            /**
             * Creates a SyncRecord message from a plain object. Also converts values to their respective internal types.
             * This is an alias of {@link api.SyncRecord.fromObject}.
             * @function
             * @param {Object.<string,*>} object Plain object
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.from = SyncRecord.fromObject;
    
            /**
             * Creates a plain object from a SyncRecord message. Also converts values to other types if specified.
             * @param {api.SyncRecord} message SyncRecord
             * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    object.bookmark = null;
                    object.historySite = null;
                    object.siteSetting = null;
                    object.device = null;
                }
                if (message.action !== undefined && message.action !== null && message.hasOwnProperty("action"))
                    object.action = options.enums === String ? $types[0][message.action] : message.action;
                if (message.deviceId !== undefined && message.deviceId !== null && message.hasOwnProperty("deviceId"))
                    object.deviceId = options.bytes === String ? $util.base64.encode(message.deviceId, 0, message.deviceId.length) : options.bytes === Array ? Array.prototype.slice.call(message.deviceId) : message.deviceId;
                if (message.objectId !== undefined && message.objectId !== null && message.hasOwnProperty("objectId"))
                    object.objectId = options.bytes === String ? $util.base64.encode(message.objectId, 0, message.objectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.objectId) : message.objectId;
                if (message.bookmark !== undefined && message.bookmark !== null && message.hasOwnProperty("bookmark"))
                    object.bookmark = $types[3].toObject(message.bookmark, options);
                if (message.historySite !== undefined && message.historySite !== null && message.hasOwnProperty("historySite"))
                    object.historySite = $types[4].toObject(message.historySite, options);
                if (message.siteSetting !== undefined && message.siteSetting !== null && message.hasOwnProperty("siteSetting"))
                    object.siteSetting = $types[5].toObject(message.siteSetting, options);
                if (message.device !== undefined && message.device !== null && message.hasOwnProperty("device"))
                    object.device = $types[6].toObject(message.device, options);
                return object;
            };
    
            /**
             * Creates a plain object from this SyncRecord message. Also converts values to other types if specified.
             * @param {$protobuf.ConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            SyncRecord.prototype.toObject = function toObject(options) {
                return this.constructor.toObject(this, options);
            };
    
            /**
             * Converts this SyncRecord to JSON.
             * @returns {Object.<string,*>} JSON object
             */
            SyncRecord.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            /**
             * Action enum.
             * @name Action
             * @memberof api.SyncRecord
             * @enum {number}
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
                 * Constructs a new Site.
                 * @exports api.SyncRecord.Site
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Site(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Site location.
                 * @type {string}
                 */
                Site.prototype.location = "";
    
                /**
                 * Site title.
                 * @type {string}
                 */
                Site.prototype.title = "";
    
                /**
                 * Site customTitle.
                 * @type {string}
                 */
                Site.prototype.customTitle = "";
    
                /**
                 * Site lastAccessedTime.
                 * @type {number|$protobuf.Long}
                 */
                Site.prototype.lastAccessedTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Site creationTime.
                 * @type {number|$protobuf.Long}
                 */
                Site.prototype.creationTime = $util.Long ? $util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Creates a new Site instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.SyncRecord.Site} Site instance
                 */
                Site.create = function create(properties) {
                    return new Site(properties);
                };
    
                /**
                 * Encodes the specified Site message.
                 * @param {api.SyncRecord.Site|Object} message Site message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Site.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.location !== undefined && message.hasOwnProperty("location"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.location);
                    if (message.title !== undefined && message.hasOwnProperty("title"))
                        writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
                    if (message.customTitle !== undefined && message.hasOwnProperty("customTitle"))
                        writer.uint32(/* id 3, wireType 2 =*/26).string(message.customTitle);
                    if (message.lastAccessedTime !== undefined && message.lastAccessedTime !== null && message.hasOwnProperty("lastAccessedTime"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint64(message.lastAccessedTime);
                    if (message.creationTime !== undefined && message.creationTime !== null && message.hasOwnProperty("creationTime"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint64(message.creationTime);
                    return writer;
                };
    
                /**
                 * Encodes the specified Site message, length delimited.
                 * @param {api.SyncRecord.Site|Object} message Site message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Site.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Site message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Site} Site
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
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Site message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Site message.
                 * @param {api.SyncRecord.Site|Object} message Site message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Site.verify = function verify(message) {    
                    if (message.location !== undefined)
                        if (!$util.isString(message.location))
                            return "location: string expected";
                    if (message.title !== undefined)
                        if (!$util.isString(message.title))
                            return "title: string expected";
                    if (message.customTitle !== undefined)
                        if (!$util.isString(message.customTitle))
                            return "customTitle: string expected";
                    if (message.lastAccessedTime !== undefined)
                        if (!$util.isInteger(message.lastAccessedTime) && !(message.lastAccessedTime && $util.isInteger(message.lastAccessedTime.low) && $util.isInteger(message.lastAccessedTime.high)))
                            return "lastAccessedTime: integer|Long expected";
                    if (message.creationTime !== undefined)
                        if (!$util.isInteger(message.creationTime) && !(message.creationTime && $util.isInteger(message.creationTime.low) && $util.isInteger(message.creationTime.high)))
                            return "creationTime: integer|Long expected";
                    return null;
                };
    
                /**
                 * Creates a Site message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.SyncRecord.Site)
                        return object;
                    var message = new $root.api.SyncRecord.Site();
                    if (object.location !== undefined && object.location !== null)
                        message.location = String(object.location);
                    if (object.title !== undefined && object.title !== null)
                        message.title = String(object.title);
                    if (object.customTitle !== undefined && object.customTitle !== null)
                        message.customTitle = String(object.customTitle);
                    if (object.lastAccessedTime !== undefined && object.lastAccessedTime !== null)
                        if ($util.Long)
                            (message.lastAccessedTime = $util.Long.fromValue(object.lastAccessedTime)).unsigned = true;
                        else if (typeof object.lastAccessedTime === "string")
                            message.lastAccessedTime = parseInt(object.lastAccessedTime, 10);
                        else if (typeof object.lastAccessedTime === "number")
                            message.lastAccessedTime = object.lastAccessedTime;
                        else if (typeof object.lastAccessedTime === "object")
                            message.lastAccessedTime = new $util.LongBits(object.lastAccessedTime.low, object.lastAccessedTime.high).toNumber(true);
                    if (object.creationTime !== undefined && object.creationTime !== null)
                        if ($util.Long)
                            (message.creationTime = $util.Long.fromValue(object.creationTime)).unsigned = true;
                        else if (typeof object.creationTime === "string")
                            message.creationTime = parseInt(object.creationTime, 10);
                        else if (typeof object.creationTime === "number")
                            message.creationTime = object.creationTime;
                        else if (typeof object.creationTime === "object")
                            message.creationTime = new $util.LongBits(object.creationTime.low, object.creationTime.high).toNumber(true);
                    return message;
                };
    
                /**
                 * Creates a Site message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.SyncRecord.Site.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.from = Site.fromObject;
    
                /**
                 * Creates a plain object from a Site message. Also converts values to other types if specified.
                 * @param {api.SyncRecord.Site} message Site
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    }
                    if (message.location !== undefined && message.location !== null && message.hasOwnProperty("location"))
                        object.location = message.location;
                    if (message.title !== undefined && message.title !== null && message.hasOwnProperty("title"))
                        object.title = message.title;
                    if (message.customTitle !== undefined && message.customTitle !== null && message.hasOwnProperty("customTitle"))
                        object.customTitle = message.customTitle;
                    if (message.lastAccessedTime !== undefined && message.lastAccessedTime !== null && message.hasOwnProperty("lastAccessedTime"))
                        if (typeof message.lastAccessedTime === "number")
                            object.lastAccessedTime = options.longs === String ? String(message.lastAccessedTime) : message.lastAccessedTime;
                        else
                            object.lastAccessedTime = options.longs === String ? $util.Long.prototype.toString.call(message.lastAccessedTime) : options.longs === Number ? new $util.LongBits(message.lastAccessedTime.low, message.lastAccessedTime.high).toNumber(true) : message.lastAccessedTime;
                    if (message.creationTime !== undefined && message.creationTime !== null && message.hasOwnProperty("creationTime"))
                        if (typeof message.creationTime === "number")
                            object.creationTime = options.longs === String ? String(message.creationTime) : message.creationTime;
                        else
                            object.creationTime = options.longs === String ? $util.Long.prototype.toString.call(message.creationTime) : options.longs === Number ? new $util.LongBits(message.creationTime.low, message.creationTime.high).toNumber(true) : message.creationTime;
                    return object;
                };
    
                /**
                 * Creates a plain object from this Site message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Site.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this Site to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Site.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Site;
            })();
    
            SyncRecord.Bookmark = (function() {
    
                /**
                 * Constructs a new Bookmark.
                 * @exports api.SyncRecord.Bookmark
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Bookmark(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Bookmark site.
                 * @type {api.SyncRecord.Site}
                 */
                Bookmark.prototype.site = null;
    
                /**
                 * Bookmark isFolder.
                 * @type {boolean}
                 */
                Bookmark.prototype.isFolder = false;
    
                /**
                 * Bookmark parentFolderObjectId.
                 * @type {Uint8Array}
                 */
                Bookmark.prototype.parentFolderObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark previousObjectId.
                 * @type {Uint8Array}
                 */
                Bookmark.prototype.previousObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark nextObjectId.
                 * @type {Uint8Array}
                 */
                Bookmark.prototype.nextObjectId = $util.newBuffer([]);
    
                /**
                 * Bookmark fields.
                 * @type {Array.<string>}
                 */
                Bookmark.prototype.fields = $util.emptyArray;
    
                // Lazily resolved type references
                var $types = {
                    0: "api.SyncRecord.Site"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new Bookmark instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.SyncRecord.Bookmark} Bookmark instance
                 */
                Bookmark.create = function create(properties) {
                    return new Bookmark(properties);
                };
    
                /**
                 * Encodes the specified Bookmark message.
                 * @param {api.SyncRecord.Bookmark|Object} message Bookmark message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bookmark.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.site && message.hasOwnProperty("site"))
                        $types[0].encode(message.site, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                    if (message.isFolder !== undefined && message.hasOwnProperty("isFolder"))
                        writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isFolder);
                    if (message.parentFolderObjectId && message.hasOwnProperty("parentFolderObjectId"))
                        writer.uint32(/* id 3, wireType 2 =*/26).bytes(message.parentFolderObjectId);
                    if (message.previousObjectId && message.hasOwnProperty("previousObjectId"))
                        writer.uint32(/* id 4, wireType 2 =*/34).bytes(message.previousObjectId);
                    if (message.nextObjectId && message.hasOwnProperty("nextObjectId"))
                        writer.uint32(/* id 5, wireType 2 =*/42).bytes(message.nextObjectId);
                    if (message.fields !== undefined && message.hasOwnProperty("fields"))
                        for (var i = 0; i < message.fields.length; ++i)
                            writer.uint32(/* id 6, wireType 2 =*/50).string(message.fields[i]);
                    return writer;
                };
    
                /**
                 * Encodes the specified Bookmark message, length delimited.
                 * @param {api.SyncRecord.Bookmark|Object} message Bookmark message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bookmark.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Bookmark message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.decode = function decode(reader, length) {    
                    if (!(reader instanceof $Reader))
                        reader = $Reader.create(reader);
                    var end = length === undefined ? reader.len : reader.pos + length, message = new $root.api.SyncRecord.Bookmark();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.site = $types[0].decode(reader, reader.uint32());
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
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };
    
                /**
                 * Decodes a Bookmark message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Bookmark message.
                 * @param {api.SyncRecord.Bookmark|Object} message Bookmark message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Bookmark.verify = function verify(message) {    
                    if (message.site !== undefined && message.site !== null) {
                        var error = $types[0].verify(message.site);
                        if (error)
                            return "site." + error;
                    }
                    if (message.isFolder !== undefined)
                        if (typeof message.isFolder !== "boolean")
                            return "isFolder: boolean expected";
                    if (message.parentFolderObjectId !== undefined)
                        if (!(message.parentFolderObjectId && typeof message.parentFolderObjectId.length === "number" || $util.isString(message.parentFolderObjectId)))
                            return "parentFolderObjectId: buffer expected";
                    if (message.previousObjectId !== undefined)
                        if (!(message.previousObjectId && typeof message.previousObjectId.length === "number" || $util.isString(message.previousObjectId)))
                            return "previousObjectId: buffer expected";
                    if (message.nextObjectId !== undefined)
                        if (!(message.nextObjectId && typeof message.nextObjectId.length === "number" || $util.isString(message.nextObjectId)))
                            return "nextObjectId: buffer expected";
                    if (message.fields !== undefined) {
                        if (!Array.isArray(message.fields))
                            return "fields: array expected";
                        for (var i = 0; i < message.fields.length; ++i)
                            if (!$util.isString(message.fields[i]))
                                return "fields: string[] expected";
                    }
                    return null;
                };
    
                /**
                 * Creates a Bookmark message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.SyncRecord.Bookmark)
                        return object;
                    var message = new $root.api.SyncRecord.Bookmark();
                    if (object.site !== undefined && object.site !== null) {
                        if (typeof object.site !== "object")
                            throw TypeError(".api.SyncRecord.Bookmark.site: object expected");
                        message.site = $types[0].fromObject(object.site);
                    }
                    if (object.isFolder !== undefined && object.isFolder !== null)
                        message.isFolder = Boolean(object.isFolder);
                    if (object.parentFolderObjectId !== undefined && object.parentFolderObjectId !== null)
                        if (typeof object.parentFolderObjectId === "string")
                            $util.base64.decode(object.parentFolderObjectId, message.parentFolderObjectId = $util.newBuffer($util.base64.length(object.parentFolderObjectId)), 0);
                        else if (object.parentFolderObjectId.length)
                            message.parentFolderObjectId = object.parentFolderObjectId;
                    if (object.previousObjectId !== undefined && object.previousObjectId !== null)
                        if (typeof object.previousObjectId === "string")
                            $util.base64.decode(object.previousObjectId, message.previousObjectId = $util.newBuffer($util.base64.length(object.previousObjectId)), 0);
                        else if (object.previousObjectId.length)
                            message.previousObjectId = object.previousObjectId;
                    if (object.nextObjectId !== undefined && object.nextObjectId !== null)
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
                    return message;
                };
    
                /**
                 * Creates a Bookmark message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.SyncRecord.Bookmark.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.from = Bookmark.fromObject;
    
                /**
                 * Creates a plain object from a Bookmark message. Also converts values to other types if specified.
                 * @param {api.SyncRecord.Bookmark} message Bookmark
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    }
                    if (message.site !== undefined && message.site !== null && message.hasOwnProperty("site"))
                        object.site = $types[0].toObject(message.site, options);
                    if (message.isFolder !== undefined && message.isFolder !== null && message.hasOwnProperty("isFolder"))
                        object.isFolder = message.isFolder;
                    if (message.parentFolderObjectId !== undefined && message.parentFolderObjectId !== null && message.hasOwnProperty("parentFolderObjectId"))
                        object.parentFolderObjectId = options.bytes === String ? $util.base64.encode(message.parentFolderObjectId, 0, message.parentFolderObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.parentFolderObjectId) : message.parentFolderObjectId;
                    if (message.previousObjectId !== undefined && message.previousObjectId !== null && message.hasOwnProperty("previousObjectId"))
                        object.previousObjectId = options.bytes === String ? $util.base64.encode(message.previousObjectId, 0, message.previousObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.previousObjectId) : message.previousObjectId;
                    if (message.nextObjectId !== undefined && message.nextObjectId !== null && message.hasOwnProperty("nextObjectId"))
                        object.nextObjectId = options.bytes === String ? $util.base64.encode(message.nextObjectId, 0, message.nextObjectId.length) : options.bytes === Array ? Array.prototype.slice.call(message.nextObjectId) : message.nextObjectId;
                    if (message.fields !== undefined && message.fields !== null && message.hasOwnProperty("fields")) {
                        object.fields = [];
                        for (var j = 0; j < message.fields.length; ++j)
                            object.fields[j] = message.fields[j];
                    }
                    return object;
                };
    
                /**
                 * Creates a plain object from this Bookmark message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Bookmark.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this Bookmark to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                Bookmark.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                return Bookmark;
            })();
    
            SyncRecord.SiteSetting = (function() {
    
                /**
                 * Constructs a new SiteSetting.
                 * @exports api.SyncRecord.SiteSetting
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function SiteSetting(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * SiteSetting hostPattern.
                 * @type {string}
                 */
                SiteSetting.prototype.hostPattern = "";
    
                /**
                 * SiteSetting zoomLevel.
                 * @type {number}
                 */
                SiteSetting.prototype.zoomLevel = 0;
    
                /**
                 * SiteSetting shieldsUp.
                 * @type {boolean}
                 */
                SiteSetting.prototype.shieldsUp = false;
    
                /**
                 * SiteSetting adControl.
                 * @type {number}
                 */
                SiteSetting.prototype.adControl = 0;
    
                /**
                 * SiteSetting cookieControl.
                 * @type {number}
                 */
                SiteSetting.prototype.cookieControl = 0;
    
                /**
                 * SiteSetting safeBrowsing.
                 * @type {boolean}
                 */
                SiteSetting.prototype.safeBrowsing = false;
    
                /**
                 * SiteSetting noScript.
                 * @type {boolean}
                 */
                SiteSetting.prototype.noScript = false;
    
                /**
                 * SiteSetting httpsEverywhere.
                 * @type {boolean}
                 */
                SiteSetting.prototype.httpsEverywhere = false;
    
                /**
                 * SiteSetting fingerprintingProtection.
                 * @type {boolean}
                 */
                SiteSetting.prototype.fingerprintingProtection = false;
    
                /**
                 * SiteSetting ledgerPayments.
                 * @type {boolean}
                 */
                SiteSetting.prototype.ledgerPayments = false;
    
                /**
                 * SiteSetting ledgerPaymentsShown.
                 * @type {boolean}
                 */
                SiteSetting.prototype.ledgerPaymentsShown = false;
    
                /**
                 * SiteSetting fields.
                 * @type {Array.<string>}
                 */
                SiteSetting.prototype.fields = $util.emptyArray;
    
                // Lazily resolved type references
                var $types = {
                    3: "api.SyncRecord.SiteSetting.AdControl",
                    4: "api.SyncRecord.SiteSetting.CookieControl"
                }; $lazyTypes.push($types);
    
                /**
                 * Creates a new SiteSetting instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting instance
                 */
                SiteSetting.create = function create(properties) {
                    return new SiteSetting(properties);
                };
    
                /**
                 * Encodes the specified SiteSetting message.
                 * @param {api.SyncRecord.SiteSetting|Object} message SiteSetting message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SiteSetting.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.hostPattern !== undefined && message.hasOwnProperty("hostPattern"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.hostPattern);
                    if (message.zoomLevel !== undefined && message.hasOwnProperty("zoomLevel"))
                        writer.uint32(/* id 2, wireType 5 =*/21).float(message.zoomLevel);
                    if (message.shieldsUp !== undefined && message.hasOwnProperty("shieldsUp"))
                        writer.uint32(/* id 3, wireType 0 =*/24).bool(message.shieldsUp);
                    if (message.adControl !== undefined && message.hasOwnProperty("adControl"))
                        writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.adControl);
                    if (message.cookieControl !== undefined && message.hasOwnProperty("cookieControl"))
                        writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.cookieControl);
                    if (message.safeBrowsing !== undefined && message.hasOwnProperty("safeBrowsing"))
                        writer.uint32(/* id 6, wireType 0 =*/48).bool(message.safeBrowsing);
                    if (message.noScript !== undefined && message.hasOwnProperty("noScript"))
                        writer.uint32(/* id 7, wireType 0 =*/56).bool(message.noScript);
                    if (message.httpsEverywhere !== undefined && message.hasOwnProperty("httpsEverywhere"))
                        writer.uint32(/* id 8, wireType 0 =*/64).bool(message.httpsEverywhere);
                    if (message.fingerprintingProtection !== undefined && message.hasOwnProperty("fingerprintingProtection"))
                        writer.uint32(/* id 9, wireType 0 =*/72).bool(message.fingerprintingProtection);
                    if (message.ledgerPayments !== undefined && message.hasOwnProperty("ledgerPayments"))
                        writer.uint32(/* id 10, wireType 0 =*/80).bool(message.ledgerPayments);
                    if (message.ledgerPaymentsShown !== undefined && message.hasOwnProperty("ledgerPaymentsShown"))
                        writer.uint32(/* id 11, wireType 0 =*/88).bool(message.ledgerPaymentsShown);
                    if (message.fields !== undefined && message.hasOwnProperty("fields"))
                        for (var i = 0; i < message.fields.length; ++i)
                            writer.uint32(/* id 12, wireType 2 =*/98).string(message.fields[i]);
                    return writer;
                };
    
                /**
                 * Encodes the specified SiteSetting message, length delimited.
                 * @param {api.SyncRecord.SiteSetting|Object} message SiteSetting message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SiteSetting.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a SiteSetting message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
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
                            message.adControl = reader.uint32();
                            break;
                        case 5:
                            message.cookieControl = reader.uint32();
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a SiteSetting message.
                 * @param {api.SyncRecord.SiteSetting|Object} message SiteSetting message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                SiteSetting.verify = function verify(message) {    
                    if (message.hostPattern !== undefined)
                        if (!$util.isString(message.hostPattern))
                            return "hostPattern: string expected";
                    if (message.zoomLevel !== undefined)
                        if (typeof message.zoomLevel !== "number")
                            return "zoomLevel: number expected";
                    if (message.shieldsUp !== undefined)
                        if (typeof message.shieldsUp !== "boolean")
                            return "shieldsUp: boolean expected";
                    if (message.adControl !== undefined)
                        switch (message.adControl) {
                        default:
                            return "adControl: enum value expected";
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    if (message.cookieControl !== undefined)
                        switch (message.cookieControl) {
                        default:
                            return "cookieControl: enum value expected";
                        case 0:
                        case 1:
                            break;
                        }
                    if (message.safeBrowsing !== undefined)
                        if (typeof message.safeBrowsing !== "boolean")
                            return "safeBrowsing: boolean expected";
                    if (message.noScript !== undefined)
                        if (typeof message.noScript !== "boolean")
                            return "noScript: boolean expected";
                    if (message.httpsEverywhere !== undefined)
                        if (typeof message.httpsEverywhere !== "boolean")
                            return "httpsEverywhere: boolean expected";
                    if (message.fingerprintingProtection !== undefined)
                        if (typeof message.fingerprintingProtection !== "boolean")
                            return "fingerprintingProtection: boolean expected";
                    if (message.ledgerPayments !== undefined)
                        if (typeof message.ledgerPayments !== "boolean")
                            return "ledgerPayments: boolean expected";
                    if (message.ledgerPaymentsShown !== undefined)
                        if (typeof message.ledgerPaymentsShown !== "boolean")
                            return "ledgerPaymentsShown: boolean expected";
                    if (message.fields !== undefined) {
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
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.SyncRecord.SiteSetting)
                        return object;
                    var message = new $root.api.SyncRecord.SiteSetting();
                    if (object.hostPattern !== undefined && object.hostPattern !== null)
                        message.hostPattern = String(object.hostPattern);
                    if (object.zoomLevel !== undefined && object.zoomLevel !== null)
                        message.zoomLevel = Number(object.zoomLevel);
                    if (object.shieldsUp !== undefined && object.shieldsUp !== null)
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
                    }
                    if (object.safeBrowsing !== undefined && object.safeBrowsing !== null)
                        message.safeBrowsing = Boolean(object.safeBrowsing);
                    if (object.noScript !== undefined && object.noScript !== null)
                        message.noScript = Boolean(object.noScript);
                    if (object.httpsEverywhere !== undefined && object.httpsEverywhere !== null)
                        message.httpsEverywhere = Boolean(object.httpsEverywhere);
                    if (object.fingerprintingProtection !== undefined && object.fingerprintingProtection !== null)
                        message.fingerprintingProtection = Boolean(object.fingerprintingProtection);
                    if (object.ledgerPayments !== undefined && object.ledgerPayments !== null)
                        message.ledgerPayments = Boolean(object.ledgerPayments);
                    if (object.ledgerPaymentsShown !== undefined && object.ledgerPaymentsShown !== null)
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
                 * Creates a SiteSetting message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.SyncRecord.SiteSetting.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.from = SiteSetting.fromObject;
    
                /**
                 * Creates a plain object from a SiteSetting message. Also converts values to other types if specified.
                 * @param {api.SyncRecord.SiteSetting} message SiteSetting
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
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
                    if (message.hostPattern !== undefined && message.hostPattern !== null && message.hasOwnProperty("hostPattern"))
                        object.hostPattern = message.hostPattern;
                    if (message.zoomLevel !== undefined && message.zoomLevel !== null && message.hasOwnProperty("zoomLevel"))
                        object.zoomLevel = message.zoomLevel;
                    if (message.shieldsUp !== undefined && message.shieldsUp !== null && message.hasOwnProperty("shieldsUp"))
                        object.shieldsUp = message.shieldsUp;
                    if (message.adControl !== undefined && message.adControl !== null && message.hasOwnProperty("adControl"))
                        object.adControl = options.enums === String ? $types[3][message.adControl] : message.adControl;
                    if (message.cookieControl !== undefined && message.cookieControl !== null && message.hasOwnProperty("cookieControl"))
                        object.cookieControl = options.enums === String ? $types[4][message.cookieControl] : message.cookieControl;
                    if (message.safeBrowsing !== undefined && message.safeBrowsing !== null && message.hasOwnProperty("safeBrowsing"))
                        object.safeBrowsing = message.safeBrowsing;
                    if (message.noScript !== undefined && message.noScript !== null && message.hasOwnProperty("noScript"))
                        object.noScript = message.noScript;
                    if (message.httpsEverywhere !== undefined && message.httpsEverywhere !== null && message.hasOwnProperty("httpsEverywhere"))
                        object.httpsEverywhere = message.httpsEverywhere;
                    if (message.fingerprintingProtection !== undefined && message.fingerprintingProtection !== null && message.hasOwnProperty("fingerprintingProtection"))
                        object.fingerprintingProtection = message.fingerprintingProtection;
                    if (message.ledgerPayments !== undefined && message.ledgerPayments !== null && message.hasOwnProperty("ledgerPayments"))
                        object.ledgerPayments = message.ledgerPayments;
                    if (message.ledgerPaymentsShown !== undefined && message.ledgerPaymentsShown !== null && message.hasOwnProperty("ledgerPaymentsShown"))
                        object.ledgerPaymentsShown = message.ledgerPaymentsShown;
                    if (message.fields !== undefined && message.fields !== null && message.hasOwnProperty("fields")) {
                        object.fields = [];
                        for (var j = 0; j < message.fields.length; ++j)
                            object.fields[j] = message.fields[j];
                    }
                    return object;
                };
    
                /**
                 * Creates a plain object from this SiteSetting message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                SiteSetting.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this SiteSetting to JSON.
                 * @returns {Object.<string,*>} JSON object
                 */
                SiteSetting.prototype.toJSON = function toJSON() {
                    return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
                };
    
                /**
                 * AdControl enum.
                 * @name AdControl
                 * @memberof api.SyncRecord.SiteSetting
                 * @enum {number}
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
                 * @name CookieControl
                 * @memberof api.SyncRecord.SiteSetting
                 * @enum {number}
                 * @property {number} BLOCK_THIRD_PARTY_COOKIE=0 BLOCK_THIRD_PARTY_COOKIE value
                 * @property {number} ALLOW_ALL_COOKIES=1 ALLOW_ALL_COOKIES value
                 */
                SiteSetting.CookieControl = (function() {
                    var valuesById = {}, values = Object.create(valuesById);
                    values[valuesById[0] = "BLOCK_THIRD_PARTY_COOKIE"] = 0;
                    values[valuesById[1] = "ALLOW_ALL_COOKIES"] = 1;
                    return values;
                })();
    
                return SiteSetting;
            })();
    
            SyncRecord.Device = (function() {
    
                /**
                 * Constructs a new Device.
                 * @exports api.SyncRecord.Device
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Device(properties) {
                    if (properties)
                        for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                }
    
                /**
                 * Device name.
                 * @type {string}
                 */
                Device.prototype.name = "";
    
                /**
                 * Creates a new Device instance using the specified properties.
                 * @param {Object} [properties] Properties to set
                 * @returns {api.SyncRecord.Device} Device instance
                 */
                Device.create = function create(properties) {
                    return new Device(properties);
                };
    
                /**
                 * Encodes the specified Device message.
                 * @param {api.SyncRecord.Device|Object} message Device message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Device.encode = function encode(message, writer) {    
                    if (!writer)
                        writer = $Writer.create();
                    if (message.name !== undefined && message.hasOwnProperty("name"))
                        writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                    return writer;
                };
    
                /**
                 * Encodes the specified Device message, length delimited.
                 * @param {api.SyncRecord.Device|Object} message Device message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Device.encodeDelimited = function encodeDelimited(message, writer) {
                    return this.encode(message, writer).ldelim();
                };
    
                /**
                 * Decodes a Device message from the specified reader or buffer.
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Device} Device
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
                 * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.decodeDelimited = function decodeDelimited(reader) {
                    if (!(reader instanceof $Reader))
                        reader = $Reader(reader);
                    return this.decode(reader, reader.uint32());
                };
    
                /**
                 * Verifies a Device message.
                 * @param {api.SyncRecord.Device|Object} message Device message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Device.verify = function verify(message) {    
                    if (message.name !== undefined)
                        if (!$util.isString(message.name))
                            return "name: string expected";
                    return null;
                };
    
                /**
                 * Creates a Device message from a plain object. Also converts values to their respective internal types.
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.fromObject = function fromObject(object) {    
                    if (object instanceof $root.api.SyncRecord.Device)
                        return object;
                    var message = new $root.api.SyncRecord.Device();
                    if (object.name !== undefined && object.name !== null)
                        message.name = String(object.name);
                    return message;
                };
    
                /**
                 * Creates a Device message from a plain object. Also converts values to their respective internal types.
                 * This is an alias of {@link api.SyncRecord.Device.fromObject}.
                 * @function
                 * @param {Object.<string,*>} object Plain object
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.from = Device.fromObject;
    
                /**
                 * Creates a plain object from a Device message. Also converts values to other types if specified.
                 * @param {api.SyncRecord.Device} message Device
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Device.toObject = function toObject(message, options) {    
                    if (!options)
                        options = {};
                    var object = {};
                    if (options.defaults)
                        object.name = "";
                    if (message.name !== undefined && message.name !== null && message.hasOwnProperty("name"))
                        object.name = message.name;
                    return object;
                };
    
                /**
                 * Creates a plain object from this Device message. Also converts values to other types if specified.
                 * @param {$protobuf.ConversionOptions} [options] Conversion options
                 * @returns {Object.<string,*>} Plain object
                 */
                Device.prototype.toObject = function toObject(options) {
                    return this.constructor.toObject(this, options);
                };
    
                /**
                 * Converts this Device to JSON.
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
    
    // Resolve lazy type references to actual types
    $util.lazyResolve($root, $lazyTypes);

    return $root;
});
