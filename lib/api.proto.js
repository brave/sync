/*eslint-disable block-scoped-var, no-redeclare, no-control-regex*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobuf"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/runtime"));

})(this, function($protobuf) {
    "use strict";

    // Lazily resolved type references
    var $lazyTypes = [];
    
    // Exported root namespace
    var $root = {};
    
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
                if (properties) {
                    var keys = Object.keys(properties);
                    for (var i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
                }
            }
    
            /** @alias api.Credentials.prototype */
            var $prototype = Credentials.prototype;
    
            /**
             * Credentials aws.
             * @type {api.Credentials.Aws}
             */
            $prototype.aws = null;
    
            /**
             * Credentials s3Post.
             * @type {api.Credentials.S3Post}
             */
            $prototype.s3Post = null;
    
            /**
             * Credentials bucket.
             * @type {string}
             */
            $prototype.bucket = "";
    
            /**
             * Credentials region.
             * @type {string}
             */
            $prototype.region = "";
    
            // Referenced types
            var $types = ["api.Credentials.Aws", "api.Credentials.S3Post", null, null]; $lazyTypes.push($types);
    
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
             * @function
             * @param {api.Credentials|Object} message Credentials message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Credentials.encode = (function(Writer, types) { return function encode(message, writer) {
                if (!writer) {
                    writer = Writer.create();
                }
                if (message.aws !== undefined && message.aws !== null) {
                    types[0].encode(message.aws, writer.uint32(10).fork()).ldelim();
                }
                if (message.s3Post !== undefined && message.s3Post !== null) {
                    types[1].encode(message.s3Post, writer.uint32(18).fork()).ldelim();
                }
                if (message.bucket !== undefined && message.bucket !== "") {
                    writer.uint32(26).string(message.bucket);
                }
                if (message.region !== undefined && message.region !== "") {
                    writer.uint32(34).string(message.region);
                }
                return writer;
            };})($protobuf.Writer, $types);
    
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
             * @function
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.Credentials} Credentials
             */
            Credentials.decode = (function(Reader, types) { return function decode(reader, len) {
                if (!(reader instanceof Reader)) {
                    reader = Reader.create(reader);
                }
                var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.Credentials();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.aws = types[0].decode(reader, reader.uint32());
                        break;
    
                    case 2:
                        message.s3Post = types[1].decode(reader, reader.uint32());
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
            };})($protobuf.Reader, $types);
    
            /**
             * Decodes a Credentials message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @returns {api.Credentials} Credentials
             */
            Credentials.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                return this.decode(readerOrBuffer, readerOrBuffer.uint32());
            };
    
            /**
             * Verifies a Credentials message.
             * @function
             * @param {api.Credentials|Object} message Credentials message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            Credentials.verify = (function(util, types) { return function verify(message) {
                if (message.aws !== undefined && message.aws !== null) {
                    var err;
                    if (err = types[0].verify(message.aws)) {
                        return err;
                    }
                }
                if (message.s3Post !== undefined && message.s3Post !== null) {
                    var err;
                    if (err = types[1].verify(message.s3Post)) {
                        return err;
                    }
                }
                if (message.bucket !== undefined) {
                    if (!util.isString(message.bucket)) {
                        return "api.Credentials.bucket: string expected";
                    }
                }
                if (message.region !== undefined) {
                    if (!util.isString(message.region)) {
                        return "api.Credentials.region: string expected";
                    }
                }
                return null;
            };})($protobuf.util, $types);
    
            /**
             * Converts a Credentials message.
             * @function
             * @param {api.Credentials|Object} source Credentials message or plain object to convert
             * @param {*} impl Converter implementation to use
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.Credentials|Object} Converted message
             */
            Credentials.convert = (function(types) { return function convert(src, impl, options) {
                if (!options) {
                    options = {};
                }
                var dst = impl.create(src, this, options);
                if (dst) {
                    if (options.defaults || src.aws !== undefined && src.aws !== null) {
                        dst.aws = types[0].convert(src.aws, impl, options);
                    }
                    if (options.defaults || src.s3Post !== undefined && src.s3Post !== null) {
                        dst.s3Post = types[1].convert(src.s3Post, impl, options);
                    }
                    if (dst.bucket === undefined && options.defaults) {
                        dst.bucket = "";
                    }
                    if (dst.region === undefined && options.defaults) {
                        dst.region = "";
                    }
                }
                return dst;
            };})($types);
    
            /**
             * Creates a Credentials message from JSON.
             * @param {Object.<string,*>} source Source object
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.Credentials} Credentials
             */
            Credentials.from = function from(source, options) {
                return this.convert(source, $protobuf.converters.message, options);
            };
    
            /**
             * Converts this Credentials message to JSON.
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {Object.<string,*>} JSON object
             */
            $prototype.asJSON = function asJSON(options) {
                return this.constructor.convert(this, $protobuf.converters.json, options);
            };
    
            Credentials.Aws = (function() {
    
                /**
                 * Constructs a new Aws.
                 * @exports api.Credentials.Aws
                 * @constructor
                 * @param {Object} [properties] Properties to set
                 */
                function Aws(properties) {
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.Credentials.Aws.prototype */
                var $prototype = Aws.prototype;
    
                /**
                 * Aws accessKeyId.
                 * @type {string}
                 */
                $prototype.accessKeyId = "";
    
                /**
                 * Aws secretAccessKey.
                 * @type {string}
                 */
                $prototype.secretAccessKey = "";
    
                /**
                 * Aws sessionToken.
                 * @type {string}
                 */
                $prototype.sessionToken = "";
    
                /**
                 * Aws expiration.
                 * @type {string}
                 */
                $prototype.expiration = "";
    
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
                 * @function
                 * @param {api.Credentials.Aws|Object} message Aws message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Aws.encode = (function(Writer) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.accessKeyId !== undefined && message.accessKeyId !== "") {
                        writer.uint32(10).string(message.accessKeyId);
                    }
                    if (message.secretAccessKey !== undefined && message.secretAccessKey !== "") {
                        writer.uint32(18).string(message.secretAccessKey);
                    }
                    if (message.sessionToken !== undefined && message.sessionToken !== "") {
                        writer.uint32(26).string(message.sessionToken);
                    }
                    if (message.expiration !== undefined && message.expiration !== "") {
                        writer.uint32(34).string(message.expiration);
                    }
                    return writer;
                };})($protobuf.Writer);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.decode = (function(Reader) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.Credentials.Aws();
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
                };})($protobuf.Reader);
    
                /**
                 * Decodes an Aws message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies an Aws message.
                 * @function
                 * @param {api.Credentials.Aws|Object} message Aws message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Aws.verify = (function(util) { return function verify(message) {
                    if (message.accessKeyId !== undefined) {
                        if (!util.isString(message.accessKeyId)) {
                            return "api.Credentials.Aws.accessKeyId: string expected";
                        }
                    }
                    if (message.secretAccessKey !== undefined) {
                        if (!util.isString(message.secretAccessKey)) {
                            return "api.Credentials.Aws.secretAccessKey: string expected";
                        }
                    }
                    if (message.sessionToken !== undefined) {
                        if (!util.isString(message.sessionToken)) {
                            return "api.Credentials.Aws.sessionToken: string expected";
                        }
                    }
                    if (message.expiration !== undefined) {
                        if (!util.isString(message.expiration)) {
                            return "api.Credentials.Aws.expiration: string expected";
                        }
                    }
                    return null;
                };})($protobuf.util);
    
                /**
                 * Converts an Aws message.
                 * @function
                 * @param {api.Credentials.Aws|Object} source Aws message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.Credentials.Aws|Object} Converted message
                 */
                Aws.convert = (function() { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (dst.accessKeyId === undefined && options.defaults) {
                            dst.accessKeyId = "";
                        }
                        if (dst.secretAccessKey === undefined && options.defaults) {
                            dst.secretAccessKey = "";
                        }
                        if (dst.sessionToken === undefined && options.defaults) {
                            dst.sessionToken = "";
                        }
                        if (dst.expiration === undefined && options.defaults) {
                            dst.expiration = "";
                        }
                    }
                    return dst;
                };})();
    
                /**
                 * Creates an Aws message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.Credentials.Aws} Aws
                 */
                Aws.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this Aws message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
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
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.Credentials.S3Post.prototype */
                var $prototype = S3Post.prototype;
    
                /**
                 * S3Post AWSAccessKeyId.
                 * @type {string}
                 */
                $prototype.AWSAccessKeyId = "";
    
                /**
                 * S3Post policy.
                 * @type {string}
                 */
                $prototype.policy = "";
    
                /**
                 * S3Post signature.
                 * @type {string}
                 */
                $prototype.signature = "";
    
                /**
                 * S3Post acl.
                 * @type {string}
                 */
                $prototype.acl = "";
    
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
                 * @function
                 * @param {api.Credentials.S3Post|Object} message S3Post message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                S3Post.encode = (function(Writer) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.AWSAccessKeyId !== undefined && message.AWSAccessKeyId !== "") {
                        writer.uint32(10).string(message.AWSAccessKeyId);
                    }
                    if (message.policy !== undefined && message.policy !== "") {
                        writer.uint32(18).string(message.policy);
                    }
                    if (message.signature !== undefined && message.signature !== "") {
                        writer.uint32(26).string(message.signature);
                    }
                    if (message.acl !== undefined && message.acl !== "") {
                        writer.uint32(34).string(message.acl);
                    }
                    return writer;
                };})($protobuf.Writer);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.decode = (function(Reader) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.Credentials.S3Post();
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
                };})($protobuf.Reader);
    
                /**
                 * Decodes a S3Post message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies a S3Post message.
                 * @function
                 * @param {api.Credentials.S3Post|Object} message S3Post message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                S3Post.verify = (function(util) { return function verify(message) {
                    if (message.AWSAccessKeyId !== undefined) {
                        if (!util.isString(message.AWSAccessKeyId)) {
                            return "api.Credentials.S3Post.AWSAccessKeyId: string expected";
                        }
                    }
                    if (message.policy !== undefined) {
                        if (!util.isString(message.policy)) {
                            return "api.Credentials.S3Post.policy: string expected";
                        }
                    }
                    if (message.signature !== undefined) {
                        if (!util.isString(message.signature)) {
                            return "api.Credentials.S3Post.signature: string expected";
                        }
                    }
                    if (message.acl !== undefined) {
                        if (!util.isString(message.acl)) {
                            return "api.Credentials.S3Post.acl: string expected";
                        }
                    }
                    return null;
                };})($protobuf.util);
    
                /**
                 * Converts a S3Post message.
                 * @function
                 * @param {api.Credentials.S3Post|Object} source S3Post message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.Credentials.S3Post|Object} Converted message
                 */
                S3Post.convert = (function() { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (dst.AWSAccessKeyId === undefined && options.defaults) {
                            dst.AWSAccessKeyId = "";
                        }
                        if (dst.policy === undefined && options.defaults) {
                            dst.policy = "";
                        }
                        if (dst.signature === undefined && options.defaults) {
                            dst.signature = "";
                        }
                        if (dst.acl === undefined && options.defaults) {
                            dst.acl = "";
                        }
                    }
                    return dst;
                };})();
    
                /**
                 * Creates a S3Post message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.Credentials.S3Post} S3Post
                 */
                S3Post.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this S3Post message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
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
                if (properties) {
                    var keys = Object.keys(properties);
                    for (var i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
                }
            }
    
            /** @alias api.SecretboxRecord.prototype */
            var $prototype = SecretboxRecord.prototype;
    
            /**
             * SecretboxRecord encryptedData.
             * @type {Uint8Array}
             */
            $prototype.encryptedData = $protobuf.util.newBuffer([]);
    
            /**
             * SecretboxRecord counter.
             * @type {number}
             */
            $prototype.counter = 0;
    
            /**
             * SecretboxRecord nonceRandom.
             * @type {Uint8Array}
             */
            $prototype.nonceRandom = $protobuf.util.newBuffer([]);
    
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
             * @function
             * @param {api.SecretboxRecord|Object} message SecretboxRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SecretboxRecord.encode = (function(Writer) { return function encode(message, writer) {
                if (!writer) {
                    writer = Writer.create();
                }
                if (message.encryptedData && message.encryptedData.length) {
                    writer.uint32(10).bytes(message.encryptedData);
                }
                if (message.counter !== undefined && message.counter !== 0) {
                    writer.uint32(16).uint32(message.counter);
                }
                if (message.nonceRandom && message.nonceRandom.length) {
                    writer.uint32(26).bytes(message.nonceRandom);
                }
                return writer;
            };})($protobuf.Writer);
    
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
             * @function
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.decode = (function(Reader) { return function decode(reader, len) {
                if (!(reader instanceof Reader)) {
                    reader = Reader.create(reader);
                }
                var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SecretboxRecord();
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
            };})($protobuf.Reader);
    
            /**
             * Decodes a SecretboxRecord message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                return this.decode(readerOrBuffer, readerOrBuffer.uint32());
            };
    
            /**
             * Verifies a SecretboxRecord message.
             * @function
             * @param {api.SecretboxRecord|Object} message SecretboxRecord message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            SecretboxRecord.verify = (function(util) { return function verify(message) {
                if (message.encryptedData !== undefined) {
                    if (!(message.encryptedData && typeof message.encryptedData.length === "number" || util.isString(message.encryptedData))) {
                        return "api.SecretboxRecord.encryptedData: buffer expected";
                    }
                }
                if (message.counter !== undefined) {
                    if (!util.isInteger(message.counter)) {
                        return "api.SecretboxRecord.counter: integer expected";
                    }
                }
                if (message.nonceRandom !== undefined) {
                    if (!(message.nonceRandom && typeof message.nonceRandom.length === "number" || util.isString(message.nonceRandom))) {
                        return "api.SecretboxRecord.nonceRandom: buffer expected";
                    }
                }
                return null;
            };})($protobuf.util);
    
            /**
             * Converts a SecretboxRecord message.
             * @function
             * @param {api.SecretboxRecord|Object} source SecretboxRecord message or plain object to convert
             * @param {*} impl Converter implementation to use
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.SecretboxRecord|Object} Converted message
             */
            SecretboxRecord.convert = (function() { return function convert(src, impl, options) {
                if (!options) {
                    options = {};
                }
                var dst = impl.create(src, this, options);
                if (dst) {
                    if (options.defaults || src.encryptedData !== undefined && src.encryptedData !== []) {
                        dst.encryptedData = impl.bytes(src.encryptedData, [], options);
                    }
                    if (dst.counter === undefined && options.defaults) {
                        dst.counter = 0;
                    }
                    if (options.defaults || src.nonceRandom !== undefined && src.nonceRandom !== []) {
                        dst.nonceRandom = impl.bytes(src.nonceRandom, [], options);
                    }
                }
                return dst;
            };})();
    
            /**
             * Creates a SecretboxRecord message from JSON.
             * @param {Object.<string,*>} source Source object
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.SecretboxRecord} SecretboxRecord
             */
            SecretboxRecord.from = function from(source, options) {
                return this.convert(source, $protobuf.converters.message, options);
            };
    
            /**
             * Converts this SecretboxRecord message to JSON.
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {Object.<string,*>} JSON object
             */
            $prototype.asJSON = function asJSON(options) {
                return this.constructor.convert(this, $protobuf.converters.json, options);
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
                if (properties) {
                    var keys = Object.keys(properties);
                    for (var i = 0; i < keys.length; ++i)
                        this[keys[i]] = properties[keys[i]];
                }
            }
    
            /** @alias api.SyncRecord.prototype */
            var $prototype = SyncRecord.prototype;
    
            /**
             * SyncRecord action.
             * @type {number}
             */
            $prototype.action = 0;
    
            /**
             * SyncRecord deviceId.
             * @type {Uint8Array}
             */
            $prototype.deviceId = $protobuf.util.newBuffer([]);
    
            /**
             * SyncRecord objectId.
             * @type {Uint8Array}
             */
            $prototype.objectId = $protobuf.util.newBuffer([]);
    
            /**
             * SyncRecord bookmark.
             * @type {api.SyncRecord.Bookmark}
             */
            $prototype.bookmark = null;
    
            /**
             * SyncRecord historySite.
             * @type {api.SyncRecord.Site}
             */
            $prototype.historySite = null;
    
            /**
             * SyncRecord siteSetting.
             * @type {api.SyncRecord.SiteSetting}
             */
            $prototype.siteSetting = null;
    
            /**
             * SyncRecord device.
             * @type {api.SyncRecord.Device}
             */
            $prototype.device = null;
    
            /**
             * SyncRecord objectData.
             * @name api.SyncRecord#objectData
             * @type {string|undefined}
             */
            Object.defineProperty($prototype, "objectData", {
                get: function() {
                    if (this["bookmark"] !== undefined)
                        return "bookmark";
                    if (this["historySite"] !== undefined)
                        return "historySite";
                    if (this["siteSetting"] !== undefined)
                        return "siteSetting";
                    if (this["device"] !== undefined)
                        return "device";
                    return undefined;
                },
                set: function(value) {
                    if (value !== "bookmark")
                        delete this["bookmark"];
                    if (value !== "historySite")
                        delete this["historySite"];
                    if (value !== "siteSetting")
                        delete this["siteSetting"];
                    if (value !== "device")
                        delete this["device"];
                }
            });
    
            // Referenced types
            var $types = ["api.SyncRecord.Action", null, null, "api.SyncRecord.Bookmark", "api.SyncRecord.Site", "api.SyncRecord.SiteSetting", "api.SyncRecord.Device"]; $lazyTypes.push($types);
    
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
             * @function
             * @param {api.SyncRecord|Object} message SyncRecord message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            SyncRecord.encode = (function(Writer, types) { return function encode(message, writer) {
                if (!writer) {
                    writer = Writer.create();
                }
                if (message.action !== undefined && message.action !== 0) {
                    writer.uint32(8).uint32(message.action);
                }
                if (message.deviceId && message.deviceId.length) {
                    writer.uint32(18).bytes(message.deviceId);
                }
                if (message.objectId && message.objectId.length) {
                    writer.uint32(26).bytes(message.objectId);
                }
                switch (message.objectData) {
                case "bookmark":
                    types[3].encode(message.bookmark, writer.uint32(34).fork()).ldelim();
                    break;
    
                case "historySite":
                    types[4].encode(message.historySite, writer.uint32(42).fork()).ldelim();
                    break;
    
                case "siteSetting":
                    types[5].encode(message.siteSetting, writer.uint32(50).fork()).ldelim();
                    break;
    
                case "device":
                    types[6].encode(message.device, writer.uint32(58).fork()).ldelim();
                    break;
                }
                return writer;
            };})($protobuf.Writer, $types);
    
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
             * @function
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.decode = (function(Reader, types) { return function decode(reader, len) {
                if (!(reader instanceof Reader)) {
                    reader = Reader.create(reader);
                }
                var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SyncRecord();
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
                        message.bookmark = types[3].decode(reader, reader.uint32());
                        break;
    
                    case 5:
                        message.historySite = types[4].decode(reader, reader.uint32());
                        break;
    
                    case 6:
                        message.siteSetting = types[5].decode(reader, reader.uint32());
                        break;
    
                    case 7:
                        message.device = types[6].decode(reader, reader.uint32());
                        break;
    
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };})($protobuf.Reader, $types);
    
            /**
             * Decodes a SyncRecord message from the specified reader or buffer, length delimited.
             * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                return this.decode(readerOrBuffer, readerOrBuffer.uint32());
            };
    
            /**
             * Verifies a SyncRecord message.
             * @function
             * @param {api.SyncRecord|Object} message SyncRecord message or plain object to verify
             * @returns {?string} `null` if valid, otherwise the reason why it is not
             */
            SyncRecord.verify = (function(util, types) { return function verify(message) {
                if (message.action !== undefined) {
                    switch (message.action) {
                    default:
                        return "api.SyncRecord.action: enum value expected";
    
                    case 0:
                    case 1:
                    case 2:
                        break;
                    }
                }
                if (message.deviceId !== undefined) {
                    if (!(message.deviceId && typeof message.deviceId.length === "number" || util.isString(message.deviceId))) {
                        return "api.SyncRecord.deviceId: buffer expected";
                    }
                }
                if (message.objectId !== undefined) {
                    if (!(message.objectId && typeof message.objectId.length === "number" || util.isString(message.objectId))) {
                        return "api.SyncRecord.objectId: buffer expected";
                    }
                }
                if (message.bookmark !== undefined && message.bookmark !== null) {
                    var err;
                    if (err = types[3].verify(message.bookmark)) {
                        return err;
                    }
                }
                if (message.historySite !== undefined && message.historySite !== null) {
                    var err;
                    if (err = types[4].verify(message.historySite)) {
                        return err;
                    }
                }
                if (message.siteSetting !== undefined && message.siteSetting !== null) {
                    var err;
                    if (err = types[5].verify(message.siteSetting)) {
                        return err;
                    }
                }
                if (message.device !== undefined && message.device !== null) {
                    var err;
                    if (err = types[6].verify(message.device)) {
                        return err;
                    }
                }
                return null;
            };})($protobuf.util, $types);
    
            /**
             * Converts a SyncRecord message.
             * @function
             * @param {api.SyncRecord|Object} source SyncRecord message or plain object to convert
             * @param {*} impl Converter implementation to use
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.SyncRecord|Object} Converted message
             */
            SyncRecord.convert = (function(types) { return function convert(src, impl, options) {
                if (!options) {
                    options = {};
                }
                var dst = impl.create(src, this, options);
                if (dst) {
                    if (options.defaults || src.action !== undefined && src.action !== 0) {
                        dst.action = impl.enums(src.action, 0, types[0], options);
                    }
                    if (options.defaults || src.deviceId !== undefined && src.deviceId !== []) {
                        dst.deviceId = impl.bytes(src.deviceId, [], options);
                    }
                    if (options.defaults || src.objectId !== undefined && src.objectId !== []) {
                        dst.objectId = impl.bytes(src.objectId, [], options);
                    }
                    if (options.defaults || src.bookmark !== undefined && src.bookmark !== null) {
                        dst.bookmark = types[3].convert(src.bookmark, impl, options);
                    }
                    if (options.defaults || src.historySite !== undefined && src.historySite !== null) {
                        dst.historySite = types[4].convert(src.historySite, impl, options);
                    }
                    if (options.defaults || src.siteSetting !== undefined && src.siteSetting !== null) {
                        dst.siteSetting = types[5].convert(src.siteSetting, impl, options);
                    }
                    if (options.defaults || src.device !== undefined && src.device !== null) {
                        dst.device = types[6].convert(src.device, impl, options);
                    }
                }
                return dst;
            };})($types);
    
            /**
             * Creates a SyncRecord message from JSON.
             * @param {Object.<string,*>} source Source object
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {api.SyncRecord} SyncRecord
             */
            SyncRecord.from = function from(source, options) {
                return this.convert(source, $protobuf.converters.message, options);
            };
    
            /**
             * Converts this SyncRecord message to JSON.
             * @param {Object.<string,*>} [options] Conversion options
             * @returns {Object.<string,*>} JSON object
             */
            $prototype.asJSON = function asJSON(options) {
                return this.constructor.convert(this, $protobuf.converters.json, options);
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
                var valuesById = {},
                    values = Object.create(valuesById);
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
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.SyncRecord.Site.prototype */
                var $prototype = Site.prototype;
    
                /**
                 * Site location.
                 * @type {string}
                 */
                $prototype.location = "";
    
                /**
                 * Site title.
                 * @type {string}
                 */
                $prototype.title = "";
    
                /**
                 * Site customTitle.
                 * @type {string}
                 */
                $prototype.customTitle = "";
    
                /**
                 * Site lastAccessedTime.
                 * @type {number|$protobuf.Long}
                 */
                $prototype.lastAccessedTime = $protobuf.util.Long ? $protobuf.util.Long.fromBits(0,0,true) : 0;
    
                /**
                 * Site creationTime.
                 * @type {number|$protobuf.Long}
                 */
                $prototype.creationTime = $protobuf.util.Long ? $protobuf.util.Long.fromBits(0,0,true) : 0;
    
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
                 * @function
                 * @param {api.SyncRecord.Site|Object} message Site message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Site.encode = (function(Writer, util) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.location !== undefined && message.location !== "") {
                        writer.uint32(10).string(message.location);
                    }
                    if (message.title !== undefined && message.title !== "") {
                        writer.uint32(18).string(message.title);
                    }
                    if (message.customTitle !== undefined && message.customTitle !== "") {
                        writer.uint32(26).string(message.customTitle);
                    }
                    if (message.lastAccessedTime !== undefined && message.lastAccessedTime !== null && util.longNe(message.lastAccessedTime, 0, 0)) {
                        writer.uint32(32).uint64(message.lastAccessedTime);
                    }
                    if (message.creationTime !== undefined && message.creationTime !== null && util.longNe(message.creationTime, 0, 0)) {
                        writer.uint32(40).uint64(message.creationTime);
                    }
                    return writer;
                };})($protobuf.Writer, $protobuf.util);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.decode = (function(Reader) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SyncRecord.Site();
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
                };})($protobuf.Reader);
    
                /**
                 * Decodes a Site message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies a Site message.
                 * @function
                 * @param {api.SyncRecord.Site|Object} message Site message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Site.verify = (function(util) { return function verify(message) {
                    if (message.location !== undefined) {
                        if (!util.isString(message.location)) {
                            return "api.SyncRecord.Site.location: string expected";
                        }
                    }
                    if (message.title !== undefined) {
                        if (!util.isString(message.title)) {
                            return "api.SyncRecord.Site.title: string expected";
                        }
                    }
                    if (message.customTitle !== undefined) {
                        if (!util.isString(message.customTitle)) {
                            return "api.SyncRecord.Site.customTitle: string expected";
                        }
                    }
                    if (message.lastAccessedTime !== undefined) {
                        if (!util.isInteger(message.lastAccessedTime) && !(message.lastAccessedTime && util.isInteger(message.lastAccessedTime.low) && util.isInteger(message.lastAccessedTime.high))) {
                            return "api.SyncRecord.Site.lastAccessedTime: integer|Long expected";
                        }
                    }
                    if (message.creationTime !== undefined) {
                        if (!util.isInteger(message.creationTime) && !(message.creationTime && util.isInteger(message.creationTime.low) && util.isInteger(message.creationTime.high))) {
                            return "api.SyncRecord.Site.creationTime: integer|Long expected";
                        }
                    }
                    return null;
                };})($protobuf.util);
    
                /**
                 * Converts a Site message.
                 * @function
                 * @param {api.SyncRecord.Site|Object} source Site message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Site|Object} Converted message
                 */
                Site.convert = (function(util) { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (dst.location === undefined && options.defaults) {
                            dst.location = "";
                        }
                        if (dst.title === undefined && options.defaults) {
                            dst.title = "";
                        }
                        if (dst.customTitle === undefined && options.defaults) {
                            dst.customTitle = "";
                        }
                        if (options.defaults || src.lastAccessedTime !== undefined && src.lastAccessedTime !== null && util.longNe(src.lastAccessedTime, 0, 0)) {
                            dst.lastAccessedTime = impl.longs(src.lastAccessedTime, 0, 0, true, options);
                        }
                        if (options.defaults || src.creationTime !== undefined && src.creationTime !== null && util.longNe(src.creationTime, 0, 0)) {
                            dst.creationTime = impl.longs(src.creationTime, 0, 0, true, options);
                        }
                    }
                    return dst;
                };})($protobuf.util);
    
                /**
                 * Creates a Site message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Site} Site
                 */
                Site.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this Site message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
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
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.SyncRecord.Bookmark.prototype */
                var $prototype = Bookmark.prototype;
    
                /**
                 * Bookmark site.
                 * @type {api.SyncRecord.Site}
                 */
                $prototype.site = null;
    
                /**
                 * Bookmark isFolder.
                 * @type {boolean}
                 */
                $prototype.isFolder = false;
    
                /**
                 * Bookmark folderId.
                 * @type {number}
                 */
                $prototype.folderId = 0;
    
                /**
                 * Bookmark parentFolderId.
                 * @type {number}
                 */
                $prototype.parentFolderId = 0;
    
                // Referenced types
                var $types = ["api.SyncRecord.Site", null, null, null]; $lazyTypes.push($types);
    
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
                 * @function
                 * @param {api.SyncRecord.Bookmark|Object} message Bookmark message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Bookmark.encode = (function(Writer, types) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.site !== undefined && message.site !== null) {
                        types[0].encode(message.site, writer.uint32(10).fork()).ldelim();
                    }
                    if (message.isFolder !== undefined && message.isFolder !== false) {
                        writer.uint32(16).bool(message.isFolder);
                    }
                    if (message.folderId !== undefined && message.folderId !== 0) {
                        writer.uint32(24).uint32(message.folderId);
                    }
                    if (message.parentFolderId !== undefined && message.parentFolderId !== 0) {
                        writer.uint32(32).uint32(message.parentFolderId);
                    }
                    return writer;
                };})($protobuf.Writer, $types);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.decode = (function(Reader, types) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SyncRecord.Bookmark();
                    while (reader.pos < end) {
                        var tag = reader.uint32();
                        switch (tag >>> 3) {
                        case 1:
                            message.site = types[0].decode(reader, reader.uint32());
                            break;
    
                        case 2:
                            message.isFolder = reader.bool();
                            break;
    
                        case 3:
                            message.folderId = reader.uint32();
                            break;
    
                        case 4:
                            message.parentFolderId = reader.uint32();
                            break;
    
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };})($protobuf.Reader, $types);
    
                /**
                 * Decodes a Bookmark message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies a Bookmark message.
                 * @function
                 * @param {api.SyncRecord.Bookmark|Object} message Bookmark message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Bookmark.verify = (function(util, types) { return function verify(message) {
                    if (message.site !== undefined && message.site !== null) {
                        var err;
                        if (err = types[0].verify(message.site)) {
                            return err;
                        }
                    }
                    if (message.isFolder !== undefined) {
                        if (typeof message.isFolder !== "boolean") {
                            return "api.SyncRecord.Bookmark.isFolder: boolean expected";
                        }
                    }
                    if (message.folderId !== undefined) {
                        if (!util.isInteger(message.folderId)) {
                            return "api.SyncRecord.Bookmark.folderId: integer expected";
                        }
                    }
                    if (message.parentFolderId !== undefined) {
                        if (!util.isInteger(message.parentFolderId)) {
                            return "api.SyncRecord.Bookmark.parentFolderId: integer expected";
                        }
                    }
                    return null;
                };})($protobuf.util, $types);
    
                /**
                 * Converts a Bookmark message.
                 * @function
                 * @param {api.SyncRecord.Bookmark|Object} source Bookmark message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Bookmark|Object} Converted message
                 */
                Bookmark.convert = (function(types) { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (options.defaults || src.site !== undefined && src.site !== null) {
                            dst.site = types[0].convert(src.site, impl, options);
                        }
                        if (dst.isFolder === undefined && options.defaults) {
                            dst.isFolder = false;
                        }
                        if (dst.folderId === undefined && options.defaults) {
                            dst.folderId = 0;
                        }
                        if (dst.parentFolderId === undefined && options.defaults) {
                            dst.parentFolderId = 0;
                        }
                    }
                    return dst;
                };})($types);
    
                /**
                 * Creates a Bookmark message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Bookmark} Bookmark
                 */
                Bookmark.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this Bookmark message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
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
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.SyncRecord.SiteSetting.prototype */
                var $prototype = SiteSetting.prototype;
    
                /**
                 * SiteSetting hostPattern.
                 * @type {string}
                 */
                $prototype.hostPattern = "";
    
                /**
                 * SiteSetting zoomLevel.
                 * @type {number}
                 */
                $prototype.zoomLevel = 0;
    
                /**
                 * SiteSetting shieldsUp.
                 * @type {boolean}
                 */
                $prototype.shieldsUp = false;
    
                /**
                 * SiteSetting adControl.
                 * @type {number}
                 */
                $prototype.adControl = 0;
    
                /**
                 * SiteSetting cookieControl.
                 * @type {number}
                 */
                $prototype.cookieControl = 0;
    
                /**
                 * SiteSetting safeBrowsing.
                 * @type {boolean}
                 */
                $prototype.safeBrowsing = false;
    
                /**
                 * SiteSetting noScript.
                 * @type {boolean}
                 */
                $prototype.noScript = false;
    
                /**
                 * SiteSetting httpsEverywhere.
                 * @type {boolean}
                 */
                $prototype.httpsEverywhere = false;
    
                /**
                 * SiteSetting fingerprintingProtection.
                 * @type {boolean}
                 */
                $prototype.fingerprintingProtection = false;
    
                /**
                 * SiteSetting ledgerPayments.
                 * @type {boolean}
                 */
                $prototype.ledgerPayments = false;
    
                /**
                 * SiteSetting ledgerPaymentsShown.
                 * @type {boolean}
                 */
                $prototype.ledgerPaymentsShown = false;
    
                // Referenced types
                var $types = [null, null, null, "api.SyncRecord.SiteSetting.AdControl", "api.SyncRecord.SiteSetting.CookieControl", null, null, null, null, null, null]; $lazyTypes.push($types);
    
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
                 * @function
                 * @param {api.SyncRecord.SiteSetting|Object} message SiteSetting message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                SiteSetting.encode = (function(Writer) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.hostPattern !== undefined && message.hostPattern !== "") {
                        writer.uint32(10).string(message.hostPattern);
                    }
                    if (message.zoomLevel !== undefined && message.zoomLevel !== 0) {
                        writer.uint32(21).float(message.zoomLevel);
                    }
                    if (message.shieldsUp !== undefined && message.shieldsUp !== false) {
                        writer.uint32(24).bool(message.shieldsUp);
                    }
                    if (message.adControl !== undefined && message.adControl !== 0) {
                        writer.uint32(32).uint32(message.adControl);
                    }
                    if (message.cookieControl !== undefined && message.cookieControl !== 0) {
                        writer.uint32(40).uint32(message.cookieControl);
                    }
                    if (message.safeBrowsing !== undefined && message.safeBrowsing !== false) {
                        writer.uint32(48).bool(message.safeBrowsing);
                    }
                    if (message.noScript !== undefined && message.noScript !== false) {
                        writer.uint32(56).bool(message.noScript);
                    }
                    if (message.httpsEverywhere !== undefined && message.httpsEverywhere !== false) {
                        writer.uint32(64).bool(message.httpsEverywhere);
                    }
                    if (message.fingerprintingProtection !== undefined && message.fingerprintingProtection !== false) {
                        writer.uint32(72).bool(message.fingerprintingProtection);
                    }
                    if (message.ledgerPayments !== undefined && message.ledgerPayments !== false) {
                        writer.uint32(80).bool(message.ledgerPayments);
                    }
                    if (message.ledgerPaymentsShown !== undefined && message.ledgerPaymentsShown !== false) {
                        writer.uint32(88).bool(message.ledgerPaymentsShown);
                    }
                    return writer;
                };})($protobuf.Writer);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.decode = (function(Reader) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SyncRecord.SiteSetting();
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
    
                        default:
                            reader.skipType(tag & 7);
                            break;
                        }
                    }
                    return message;
                };})($protobuf.Reader);
    
                /**
                 * Decodes a SiteSetting message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies a SiteSetting message.
                 * @function
                 * @param {api.SyncRecord.SiteSetting|Object} message SiteSetting message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                SiteSetting.verify = (function(util) { return function verify(message) {
                    if (message.hostPattern !== undefined) {
                        if (!util.isString(message.hostPattern)) {
                            return "api.SyncRecord.SiteSetting.hostPattern: string expected";
                        }
                    }
                    if (message.zoomLevel !== undefined) {
                        if (typeof message.zoomLevel !== "number") {
                            return "api.SyncRecord.SiteSetting.zoomLevel: number expected";
                        }
                    }
                    if (message.shieldsUp !== undefined) {
                        if (typeof message.shieldsUp !== "boolean") {
                            return "api.SyncRecord.SiteSetting.shieldsUp: boolean expected";
                        }
                    }
                    if (message.adControl !== undefined) {
                        switch (message.adControl) {
                        default:
                            return "api.SyncRecord.SiteSetting.adControl: enum value expected";
    
                        case 0:
                        case 1:
                        case 2:
                            break;
                        }
                    }
                    if (message.cookieControl !== undefined) {
                        switch (message.cookieControl) {
                        default:
                            return "api.SyncRecord.SiteSetting.cookieControl: enum value expected";
    
                        case 0:
                        case 1:
                            break;
                        }
                    }
                    if (message.safeBrowsing !== undefined) {
                        if (typeof message.safeBrowsing !== "boolean") {
                            return "api.SyncRecord.SiteSetting.safeBrowsing: boolean expected";
                        }
                    }
                    if (message.noScript !== undefined) {
                        if (typeof message.noScript !== "boolean") {
                            return "api.SyncRecord.SiteSetting.noScript: boolean expected";
                        }
                    }
                    if (message.httpsEverywhere !== undefined) {
                        if (typeof message.httpsEverywhere !== "boolean") {
                            return "api.SyncRecord.SiteSetting.httpsEverywhere: boolean expected";
                        }
                    }
                    if (message.fingerprintingProtection !== undefined) {
                        if (typeof message.fingerprintingProtection !== "boolean") {
                            return "api.SyncRecord.SiteSetting.fingerprintingProtection: boolean expected";
                        }
                    }
                    if (message.ledgerPayments !== undefined) {
                        if (typeof message.ledgerPayments !== "boolean") {
                            return "api.SyncRecord.SiteSetting.ledgerPayments: boolean expected";
                        }
                    }
                    if (message.ledgerPaymentsShown !== undefined) {
                        if (typeof message.ledgerPaymentsShown !== "boolean") {
                            return "api.SyncRecord.SiteSetting.ledgerPaymentsShown: boolean expected";
                        }
                    }
                    return null;
                };})($protobuf.util);
    
                /**
                 * Converts a SiteSetting message.
                 * @function
                 * @param {api.SyncRecord.SiteSetting|Object} source SiteSetting message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.SiteSetting|Object} Converted message
                 */
                SiteSetting.convert = (function(types) { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (dst.hostPattern === undefined && options.defaults) {
                            dst.hostPattern = "";
                        }
                        if (dst.zoomLevel === undefined && options.defaults) {
                            dst.zoomLevel = 0;
                        }
                        if (dst.shieldsUp === undefined && options.defaults) {
                            dst.shieldsUp = false;
                        }
                        if (options.defaults || src.adControl !== undefined && src.adControl !== 0) {
                            dst.adControl = impl.enums(src.adControl, 0, types[3], options);
                        }
                        if (options.defaults || src.cookieControl !== undefined && src.cookieControl !== 0) {
                            dst.cookieControl = impl.enums(src.cookieControl, 0, types[4].values, options);
                        }
                        if (dst.safeBrowsing === undefined && options.defaults) {
                            dst.safeBrowsing = false;
                        }
                        if (dst.noScript === undefined && options.defaults) {
                            dst.noScript = false;
                        }
                        if (dst.httpsEverywhere === undefined && options.defaults) {
                            dst.httpsEverywhere = false;
                        }
                        if (dst.fingerprintingProtection === undefined && options.defaults) {
                            dst.fingerprintingProtection = false;
                        }
                        if (dst.ledgerPayments === undefined && options.defaults) {
                            dst.ledgerPayments = false;
                        }
                        if (dst.ledgerPaymentsShown === undefined && options.defaults) {
                            dst.ledgerPaymentsShown = false;
                        }
                    }
                    return dst;
                };})($types);
    
                /**
                 * Creates a SiteSetting message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.SiteSetting} SiteSetting
                 */
                SiteSetting.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this SiteSetting message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
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
                    var valuesById = {},
                        values = Object.create(valuesById);
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
                    var valuesById = {},
                        values = Object.create(valuesById);
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
                    if (properties) {
                        var keys = Object.keys(properties);
                        for (var i = 0; i < keys.length; ++i)
                            this[keys[i]] = properties[keys[i]];
                    }
                }
    
                /** @alias api.SyncRecord.Device.prototype */
                var $prototype = Device.prototype;
    
                /**
                 * Device name.
                 * @type {string}
                 */
                $prototype.name = "";
    
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
                 * @function
                 * @param {api.SyncRecord.Device|Object} message Device message or plain object to encode
                 * @param {$protobuf.Writer} [writer] Writer to encode to
                 * @returns {$protobuf.Writer} Writer
                 */
                Device.encode = (function(Writer) { return function encode(message, writer) {
                    if (!writer) {
                        writer = Writer.create();
                    }
                    if (message.name !== undefined && message.name !== "") {
                        writer.uint32(10).string(message.name);
                    }
                    return writer;
                };})($protobuf.Writer);
    
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
                 * @function
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @param {number} [length] Message length if known beforehand
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.decode = (function(Reader) { return function decode(reader, len) {
                    if (!(reader instanceof Reader)) {
                        reader = Reader.create(reader);
                    }
                    var end = len === undefined ? reader.len : reader.pos + len, message = new $root.api.SyncRecord.Device();
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
                };})($protobuf.Reader);
    
                /**
                 * Decodes a Device message from the specified reader or buffer, length delimited.
                 * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.decodeDelimited = function decodeDelimited(readerOrBuffer) {
                    readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
                    return this.decode(readerOrBuffer, readerOrBuffer.uint32());
                };
    
                /**
                 * Verifies a Device message.
                 * @function
                 * @param {api.SyncRecord.Device|Object} message Device message or plain object to verify
                 * @returns {?string} `null` if valid, otherwise the reason why it is not
                 */
                Device.verify = (function(util) { return function verify(message) {
                    if (message.name !== undefined) {
                        if (!util.isString(message.name)) {
                            return "api.SyncRecord.Device.name: string expected";
                        }
                    }
                    return null;
                };})($protobuf.util);
    
                /**
                 * Converts a Device message.
                 * @function
                 * @param {api.SyncRecord.Device|Object} source Device message or plain object to convert
                 * @param {*} impl Converter implementation to use
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Device|Object} Converted message
                 */
                Device.convert = (function() { return function convert(src, impl, options) {
                    if (!options) {
                        options = {};
                    }
                    var dst = impl.create(src, this, options);
                    if (dst) {
                        if (dst.name === undefined && options.defaults) {
                            dst.name = "";
                        }
                    }
                    return dst;
                };})();
    
                /**
                 * Creates a Device message from JSON.
                 * @param {Object.<string,*>} source Source object
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {api.SyncRecord.Device} Device
                 */
                Device.from = function from(source, options) {
                    return this.convert(source, $protobuf.converters.message, options);
                };
    
                /**
                 * Converts this Device message to JSON.
                 * @param {Object.<string,*>} [options] Conversion options
                 * @returns {Object.<string,*>} JSON object
                 */
                $prototype.asJSON = function asJSON(options) {
                    return this.constructor.convert(this, $protobuf.converters.json, options);
                };
    
                return Device;
            })();
    
            return SyncRecord;
        })();
    
        return api;
    })();
    
    // Resolve lazy types
    $lazyTypes.forEach(function(types) {
        types.forEach(function(path, i) {
            if (!path)
                return;
            path = path.split(".");
            var ptr = $root;
            while (path.length)
                ptr = ptr[path.shift()];
            types[i] = ptr;
        });
    });

    $protobuf.roots["default"] = $root;

    return $root;
});
