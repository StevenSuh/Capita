/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
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
    
    $root.shared = (function() {
    
        /**
         * Namespace shared.
         * @exports shared
         * @namespace
         */
        var shared = {};
    
        shared.HelloRequest = (function() {
    
            /**
             * Properties of a HelloRequest.
             * @memberof shared
             * @interface IHelloRequest
             * @property {string|null} [name] HelloRequest name
             */
    
            /**
             * Constructs a new HelloRequest.
             * @memberof shared
             * @classdesc Represents a HelloRequest.
             * @implements IHelloRequest
             * @constructor
             * @param {shared.IHelloRequest=} [properties] Properties to set
             */
            function HelloRequest(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * HelloRequest name.
             * @member {string} name
             * @memberof shared.HelloRequest
             * @instance
             */
            HelloRequest.prototype.name = "";
    
            /**
             * Creates a new HelloRequest instance using the specified properties.
             * @function create
             * @memberof shared.HelloRequest
             * @static
             * @param {shared.IHelloRequest=} [properties] Properties to set
             * @returns {shared.HelloRequest} HelloRequest instance
             */
            HelloRequest.create = function create(properties) {
                return new HelloRequest(properties);
            };
    
            /**
             * Encodes the specified HelloRequest message. Does not implicitly {@link shared.HelloRequest.verify|verify} messages.
             * @function encode
             * @memberof shared.HelloRequest
             * @static
             * @param {shared.IHelloRequest} message HelloRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.name != null && message.hasOwnProperty("name"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.name);
                return writer;
            };
    
            /**
             * Encodes the specified HelloRequest message, length delimited. Does not implicitly {@link shared.HelloRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof shared.HelloRequest
             * @static
             * @param {shared.IHelloRequest} message HelloRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a HelloRequest message from the specified reader or buffer.
             * @function decode
             * @memberof shared.HelloRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {shared.HelloRequest} HelloRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.shared.HelloRequest();
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
             * Decodes a HelloRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof shared.HelloRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {shared.HelloRequest} HelloRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a HelloRequest message.
             * @function verify
             * @memberof shared.HelloRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HelloRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.name != null && message.hasOwnProperty("name"))
                    if (!$util.isString(message.name))
                        return "name: string expected";
                return null;
            };
    
            /**
             * Creates a HelloRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof shared.HelloRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {shared.HelloRequest} HelloRequest
             */
            HelloRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.shared.HelloRequest)
                    return object;
                var message = new $root.shared.HelloRequest();
                if (object.name != null)
                    message.name = String(object.name);
                return message;
            };
    
            /**
             * Creates a plain object from a HelloRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof shared.HelloRequest
             * @static
             * @param {shared.HelloRequest} message HelloRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HelloRequest.toObject = function toObject(message, options) {
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
             * Converts this HelloRequest to JSON.
             * @function toJSON
             * @memberof shared.HelloRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HelloRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return HelloRequest;
        })();
    
        shared.HelloResponse = (function() {
    
            /**
             * Properties of a HelloResponse.
             * @memberof shared
             * @interface IHelloResponse
             * @property {string|null} [message] HelloResponse message
             */
    
            /**
             * Constructs a new HelloResponse.
             * @memberof shared
             * @classdesc Represents a HelloResponse.
             * @implements IHelloResponse
             * @constructor
             * @param {shared.IHelloResponse=} [properties] Properties to set
             */
            function HelloResponse(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }
    
            /**
             * HelloResponse message.
             * @member {string} message
             * @memberof shared.HelloResponse
             * @instance
             */
            HelloResponse.prototype.message = "";
    
            /**
             * Creates a new HelloResponse instance using the specified properties.
             * @function create
             * @memberof shared.HelloResponse
             * @static
             * @param {shared.IHelloResponse=} [properties] Properties to set
             * @returns {shared.HelloResponse} HelloResponse instance
             */
            HelloResponse.create = function create(properties) {
                return new HelloResponse(properties);
            };
    
            /**
             * Encodes the specified HelloResponse message. Does not implicitly {@link shared.HelloResponse.verify|verify} messages.
             * @function encode
             * @memberof shared.HelloResponse
             * @static
             * @param {shared.IHelloResponse} message HelloResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloResponse.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.message != null && message.hasOwnProperty("message"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.message);
                return writer;
            };
    
            /**
             * Encodes the specified HelloResponse message, length delimited. Does not implicitly {@link shared.HelloResponse.verify|verify} messages.
             * @function encodeDelimited
             * @memberof shared.HelloResponse
             * @static
             * @param {shared.IHelloResponse} message HelloResponse message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            HelloResponse.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };
    
            /**
             * Decodes a HelloResponse message from the specified reader or buffer.
             * @function decode
             * @memberof shared.HelloResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {shared.HelloResponse} HelloResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloResponse.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.shared.HelloResponse();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.message = reader.string();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };
    
            /**
             * Decodes a HelloResponse message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof shared.HelloResponse
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {shared.HelloResponse} HelloResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            HelloResponse.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };
    
            /**
             * Verifies a HelloResponse message.
             * @function verify
             * @memberof shared.HelloResponse
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            HelloResponse.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.message != null && message.hasOwnProperty("message"))
                    if (!$util.isString(message.message))
                        return "message: string expected";
                return null;
            };
    
            /**
             * Creates a HelloResponse message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof shared.HelloResponse
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {shared.HelloResponse} HelloResponse
             */
            HelloResponse.fromObject = function fromObject(object) {
                if (object instanceof $root.shared.HelloResponse)
                    return object;
                var message = new $root.shared.HelloResponse();
                if (object.message != null)
                    message.message = String(object.message);
                return message;
            };
    
            /**
             * Creates a plain object from a HelloResponse message. Also converts values to other types if specified.
             * @function toObject
             * @memberof shared.HelloResponse
             * @static
             * @param {shared.HelloResponse} message HelloResponse
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            HelloResponse.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults)
                    object.message = "";
                if (message.message != null && message.hasOwnProperty("message"))
                    object.message = message.message;
                return object;
            };
    
            /**
             * Converts this HelloResponse to JSON.
             * @function toJSON
             * @memberof shared.HelloResponse
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            HelloResponse.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };
    
            return HelloResponse;
        })();
    
        shared.Greeter = (function() {
    
            /**
             * Constructs a new Greeter service.
             * @memberof shared
             * @classdesc Represents a Greeter
             * @extends $protobuf.rpc.Service
             * @constructor
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             */
            function Greeter(rpcImpl, requestDelimited, responseDelimited) {
                $protobuf.rpc.Service.call(this, rpcImpl, requestDelimited, responseDelimited);
            }
    
            (Greeter.prototype = Object.create($protobuf.rpc.Service.prototype)).constructor = Greeter;
    
            /**
             * Creates new Greeter service using the specified rpc implementation.
             * @function create
             * @memberof shared.Greeter
             * @static
             * @param {$protobuf.RPCImpl} rpcImpl RPC implementation
             * @param {boolean} [requestDelimited=false] Whether requests are length-delimited
             * @param {boolean} [responseDelimited=false] Whether responses are length-delimited
             * @returns {Greeter} RPC service. Useful where requests and/or responses are streamed.
             */
            Greeter.create = function create(rpcImpl, requestDelimited, responseDelimited) {
                return new this(rpcImpl, requestDelimited, responseDelimited);
            };
    
            /**
             * Callback as used by {@link shared.Greeter#sayHello}.
             * @memberof shared.Greeter
             * @typedef SayHelloCallback
             * @type {function}
             * @param {Error|null} error Error, if any
             * @param {shared.HelloResponse} [response] HelloResponse
             */
    
            /**
             * Calls SayHello.
             * @function sayHello
             * @memberof shared.Greeter
             * @instance
             * @param {shared.IHelloRequest} request HelloRequest message or plain object
             * @param {shared.Greeter.SayHelloCallback} callback Node-style callback called with the error, if any, and HelloResponse
             * @returns {undefined}
             * @variation 1
             */
            Object.defineProperty(Greeter.prototype.sayHello = function sayHello(request, callback) {
                return this.rpcCall(sayHello, $root.shared.HelloRequest, $root.shared.HelloResponse, request, callback);
            }, "name", { value: "SayHello" });
    
            /**
             * Calls SayHello.
             * @function sayHello
             * @memberof shared.Greeter
             * @instance
             * @param {shared.IHelloRequest} request HelloRequest message or plain object
             * @returns {Promise<shared.HelloResponse>} Promise
             * @variation 2
             */
    
            return Greeter;
        })();
    
        return shared;
    })();

    return $root;
});
