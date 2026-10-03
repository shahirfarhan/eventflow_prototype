
import {Buffer} from "node:buffer";
globalThis.Buffer = Buffer;

import {AsyncLocalStorage} from "node:async_hooks";
globalThis.AsyncLocalStorage = AsyncLocalStorage;


const defaultDefineProperty = Object.defineProperty;
Object.defineProperty = function(o, p, a) {
  if(p=== '__import_unsupported' && Boolean(globalThis.__import_unsupported)) {
    return;
  }
  return defaultDefineProperty(o, p, a);
};

  
  
  globalThis.openNextDebug = false;globalThis.openNextVersion = "4.1.7";globalThis.nextVersion = "16.3.8";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@opennextjs/aws/dist/utils/error.js
function isOpenNextError(e) {
  try {
    return "__openNextInternal" in e;
  } catch {
    return false;
  }
}
var init_error = __esm({
  "node_modules/@opennextjs/aws/dist/utils/error.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/adapters/logger.js
function debug(...args) {
  if (globalThis.openNextDebug) {
    console.log(...args);
  }
}
function warn(...args) {
  console.warn(...args);
}
function error(...args) {
  if (args.some((arg) => isDownplayedErrorLog(arg))) {
    return debug(...args);
  }
  if (args.some((arg) => isOpenNextError(arg))) {
    const error2 = args.find((arg) => isOpenNextError(arg));
    if (error2.logLevel < getOpenNextErrorLogLevel()) {
      return;
    }
    if (error2.logLevel === 0) {
      return console.log(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    if (error2.logLevel === 1) {
      return warn(...args.map((arg) => isOpenNextError(arg) ? `${arg.name}: ${arg.message}` : arg));
    }
    return console.error(...args);
  }
  console.error(...args);
}
function getOpenNextErrorLogLevel() {
  const strLevel = process.env.OPEN_NEXT_ERROR_LOG_LEVEL ?? "1";
  switch (strLevel.toLowerCase()) {
    case "debug":
    case "0":
      return 0;
    case "error":
    case "2":
      return 2;
    default:
      return 1;
  }
}
var DOWNPLAYED_ERROR_LOGS, isDownplayedErrorLog;
var init_logger = __esm({
  "node_modules/@opennextjs/aws/dist/adapters/logger.js"() {
    init_error();
    DOWNPLAYED_ERROR_LOGS = [
      {
        clientName: "S3Client",
        commandName: "GetObjectCommand",
        errorName: "NoSuchKey"
      }
    ];
    isDownplayedErrorLog = (errorLog) => DOWNPLAYED_ERROR_LOGS.some((downplayedInput) => downplayedInput.clientName === errorLog?.clientName && downplayedInput.commandName === errorLog?.commandName && (downplayedInput.errorName === errorLog?.error?.name || downplayedInput.errorName === errorLog?.error?.Code));
  }
});

// node_modules/cookie/dist/index.js
var require_dist = __commonJS({
  "node_modules/cookie/dist/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.parseCookie = parseCookie;
    exports.parse = parseCookie;
    exports.stringifyCookie = stringifyCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    exports.parseSetCookie = parseSetCookie;
    exports.stringifySetCookie = stringifySetCookie;
    exports.serialize = stringifySetCookie;
    var cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
    var cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
    var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
    var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
    var maxAgeRegExp = /^-?\d+$/;
    var __toString = Object.prototype.toString;
    var NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
    function parseCookie(str, options) {
      const obj = new NullObject();
      const len = str.length;
      if (len < 2)
        return obj;
      const dec = options?.decode || decode;
      let index = 0;
      do {
        const eqIdx = eqIndex(str, index, len);
        if (eqIdx === -1)
          break;
        const endIdx = endIndex(str, index, len);
        if (eqIdx > endIdx) {
          index = str.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        const key = valueSlice(str, index, eqIdx);
        if (obj[key] === void 0) {
          obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
        }
        index = endIdx + 1;
      } while (index < len);
      return obj;
    }
    function stringifyCookie(cookie, options) {
      const enc = options?.encode || encodeURIComponent;
      const cookieStrings = [];
      for (const name of Object.keys(cookie)) {
        const val = cookie[name];
        if (val === void 0)
          continue;
        if (!cookieNameRegExp.test(name)) {
          throw new TypeError(`cookie name is invalid: ${name}`);
        }
        const value = enc(val);
        if (!cookieValueRegExp.test(value)) {
          throw new TypeError(`cookie val is invalid: ${val}`);
        }
        cookieStrings.push(`${name}=${value}`);
      }
      return cookieStrings.join("; ");
    }
    function stringifySetCookie(_name, _val, _opts) {
      const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
      const options = typeof _val === "object" ? _val : _opts;
      const enc = options?.encode || encodeURIComponent;
      if (!cookieNameRegExp.test(cookie.name)) {
        throw new TypeError(`argument name is invalid: ${cookie.name}`);
      }
      const value = cookie.value ? enc(cookie.value) : "";
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`argument val is invalid: ${cookie.value}`);
      }
      let str = cookie.name + "=" + value;
      if (cookie.maxAge !== void 0) {
        if (!Number.isInteger(cookie.maxAge)) {
          throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
        }
        str += "; Max-Age=" + cookie.maxAge;
      }
      if (cookie.domain) {
        if (!domainValueRegExp.test(cookie.domain)) {
          throw new TypeError(`option domain is invalid: ${cookie.domain}`);
        }
        str += "; Domain=" + cookie.domain;
      }
      if (cookie.path) {
        if (!pathValueRegExp.test(cookie.path)) {
          throw new TypeError(`option path is invalid: ${cookie.path}`);
        }
        str += "; Path=" + cookie.path;
      }
      if (cookie.expires) {
        if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
          throw new TypeError(`option expires is invalid: ${cookie.expires}`);
        }
        str += "; Expires=" + cookie.expires.toUTCString();
      }
      if (cookie.httpOnly) {
        str += "; HttpOnly";
      }
      if (cookie.secure) {
        str += "; Secure";
      }
      if (cookie.partitioned) {
        str += "; Partitioned";
      }
      if (cookie.priority) {
        const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
        switch (priority) {
          case "low":
            str += "; Priority=Low";
            break;
          case "medium":
            str += "; Priority=Medium";
            break;
          case "high":
            str += "; Priority=High";
            break;
          default:
            throw new TypeError(`option priority is invalid: ${cookie.priority}`);
        }
      }
      if (cookie.sameSite) {
        const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
        switch (sameSite) {
          case true:
          case "strict":
            str += "; SameSite=Strict";
            break;
          case "lax":
            str += "; SameSite=Lax";
            break;
          case "none":
            str += "; SameSite=None";
            break;
          default:
            throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
        }
      }
      return str;
    }
    function parseSetCookie(str, options) {
      const dec = options?.decode || decode;
      const len = str.length;
      const endIdx = endIndex(str, 0, len);
      const eqIdx = eqIndex(str, 0, endIdx);
      const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
        name: valueSlice(str, 0, eqIdx),
        value: dec(valueSlice(str, eqIdx + 1, endIdx))
      };
      let index = endIdx + 1;
      while (index < len) {
        const endIdx2 = endIndex(str, index, len);
        const eqIdx2 = eqIndex(str, index, endIdx2);
        const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
        const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
        switch (attr.toLowerCase()) {
          case "httponly":
            setCookie.httpOnly = true;
            break;
          case "secure":
            setCookie.secure = true;
            break;
          case "partitioned":
            setCookie.partitioned = true;
            break;
          case "domain":
            setCookie.domain = val;
            break;
          case "path":
            setCookie.path = val;
            break;
          case "max-age":
            if (val && maxAgeRegExp.test(val))
              setCookie.maxAge = Number(val);
            break;
          case "expires":
            if (!val)
              break;
            const date = new Date(val);
            if (Number.isFinite(date.valueOf()))
              setCookie.expires = date;
            break;
          case "priority":
            if (!val)
              break;
            const priority = val.toLowerCase();
            if (priority === "low" || priority === "medium" || priority === "high") {
              setCookie.priority = priority;
            }
            break;
          case "samesite":
            if (!val)
              break;
            const sameSite = val.toLowerCase();
            if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
              setCookie.sameSite = sameSite;
            }
            break;
        }
        index = endIdx2 + 1;
      }
      return setCookie;
    }
    function endIndex(str, min, len) {
      const index = str.indexOf(";", min);
      return index === -1 ? len : index;
    }
    function eqIndex(str, min, max) {
      const index = str.indexOf("=", min);
      return index < max ? index : -1;
    }
    function valueSlice(str, min, max) {
      let start = min;
      let end = max;
      do {
        const code = str.charCodeAt(start);
        if (code !== 32 && code !== 9)
          break;
      } while (++start < end);
      while (end > start) {
        const code = str.charCodeAt(end - 1);
        if (code !== 32 && code !== 9)
          break;
        end--;
      }
      return str.slice(start, end);
    }
    function decode(str) {
      if (str.indexOf("%") === -1)
        return str;
      try {
        return decodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]";
    }
  }
});

// node_modules/@opennextjs/aws/dist/http/util.js
function parseSetCookieHeader(cookies) {
  if (!cookies) {
    return [];
  }
  if (typeof cookies === "string") {
    return cookies.split(/(?<!Expires=\w+),/i).map((c) => c.trim());
  }
  return cookies;
}
function getQueryFromIterator(it) {
  const query = {};
  for (const [key, value] of it) {
    if (key in query) {
      if (Array.isArray(query[key])) {
        query[key].push(value);
      } else {
        query[key] = [query[key], value];
      }
    } else {
      query[key] = value;
    }
  }
  return query;
}
var init_util = __esm({
  "node_modules/@opennextjs/aws/dist/http/util.js"() {
    init_logger();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/utils.js
function getQueryFromSearchParams(searchParams) {
  return getQueryFromIterator(searchParams.entries());
}
var init_utils = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/utils.js"() {
    init_util();
  }
});

// node_modules/@opennextjs/aws/dist/overrides/converters/edge.js
var edge_exports = {};
__export(edge_exports, {
  default: () => edge_default
});
import { Buffer as Buffer2 } from "node:buffer";
var import_cookie, NULL_BODY_STATUSES, converter, edge_default;
var init_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/converters/edge.js"() {
    import_cookie = __toESM(require_dist(), 1);
    init_util();
    init_utils();
    NULL_BODY_STATUSES = /* @__PURE__ */ new Set([101, 103, 204, 205, 304]);
    converter = {
      convertFrom: async (event) => {
        const url = new URL(event.url);
        const searchParams = url.searchParams;
        const query = getQueryFromSearchParams(searchParams);
        const headers = {};
        event.headers.forEach((value, key) => {
          headers[key] = value;
        });
        const rawPath = url.pathname;
        const method = event.method;
        const shouldHaveBody = method !== "GET" && method !== "HEAD";
        const body = shouldHaveBody ? Buffer2.from(await event.arrayBuffer()) : void 0;
        const cookieHeader = event.headers.get("cookie");
        const cookies = cookieHeader ? import_cookie.default.parse(cookieHeader) : {};
        return {
          type: "core",
          method,
          rawPath,
          url: event.url,
          body,
          headers,
          remoteAddress: event.headers.get("x-forwarded-for") ?? "::1",
          query,
          cookies
        };
      },
      convertTo: async (result) => {
        if ("internalEvent" in result) {
          const request = new Request(result.internalEvent.url, {
            body: result.internalEvent.body,
            method: result.internalEvent.method,
            headers: {
              ...result.internalEvent.headers,
              "x-forwarded-host": result.internalEvent.headers.host
            }
          });
          if (globalThis.__dangerous_ON_edge_converter_returns_request === true) {
            return request;
          }
          const cfCache = (result.isISR || result.internalEvent.rawPath.startsWith("/_next/image")) && process.env.DISABLE_CACHE !== "true" ? { cacheEverything: true } : {};
          return fetch(request, {
            // This is a hack to make sure that the response is cached by Cloudflare
            // See https://developers.cloudflare.com/workers/examples/cache-using-fetch/#caching-html-resources
            // @ts-expect-error - This is a Cloudflare specific option
            cf: cfCache
          });
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(result.headers)) {
          if (key === "set-cookie" && typeof value === "string") {
            const cookies = parseSetCookieHeader(value);
            for (const cookie of cookies) {
              headers.append(key, cookie);
            }
            continue;
          }
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else {
            headers.set(key, value);
          }
        }
        const body = NULL_BODY_STATUSES.has(result.statusCode) ? null : result.body;
        return new Response(body, {
          status: result.statusCode,
          headers
        });
      },
      name: "edge"
    };
    edge_default = converter;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js
var cloudflare_edge_exports = {};
__export(cloudflare_edge_exports, {
  default: () => cloudflare_edge_default
});
var cfPropNameMapping, handler, cloudflare_edge_default;
var init_cloudflare_edge = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/wrappers/cloudflare-edge.js"() {
    cfPropNameMapping = {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: [encodeURIComponent, "x-open-next-city"],
      country: "x-open-next-country",
      regionCode: "x-open-next-region",
      latitude: "x-open-next-latitude",
      longitude: "x-open-next-longitude"
    };
    handler = async (handler3, converter2) => async (request, env, ctx) => {
      globalThis.process = process;
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
      const internalEvent = await converter2.convertFrom(request);
      const cfProperties = request.cf;
      for (const [propName, mapping] of Object.entries(cfPropNameMapping)) {
        const propValue = cfProperties?.[propName];
        if (propValue != null) {
          const [encode, headerName] = Array.isArray(mapping) ? mapping : [null, mapping];
          internalEvent.headers[headerName] = encode ? encode(propValue) : propValue;
        }
      }
      const response = await handler3(internalEvent, {
        waitUntil: ctx.waitUntil.bind(ctx)
      });
      const result = await converter2.convertTo(response);
      return result;
    };
    cloudflare_edge_default = {
      wrapper: handler,
      name: "cloudflare-edge",
      supportStreaming: true,
      edgeRuntime: true
    };
  }
});

// node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js
var pattern_env_exports = {};
__export(pattern_env_exports, {
  default: () => pattern_env_default
});
function initializeOnce() {
  if (initialized)
    return;
  cachedOrigins = JSON.parse(process.env.OPEN_NEXT_ORIGIN ?? "{}");
  const functions = globalThis.openNextConfig.functions ?? {};
  for (const key in functions) {
    if (key !== "default") {
      const value = functions[key];
      const regexes = [];
      for (const pattern of value.patterns) {
        const regexPattern = `/${pattern.replace(/\*\*/g, "(.*)").replace(/\*/g, "([^/]*)").replace(/\//g, "\\/").replace(/\?/g, ".")}`;
        regexes.push(new RegExp(regexPattern));
      }
      cachedPatterns.push({
        key,
        patterns: value.patterns,
        regexes
      });
    }
  }
  initialized = true;
}
var cachedOrigins, cachedPatterns, initialized, envLoader, pattern_env_default;
var init_pattern_env = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/originResolver/pattern-env.js"() {
    init_logger();
    cachedPatterns = [];
    initialized = false;
    envLoader = {
      name: "env",
      resolve: async (_path) => {
        try {
          initializeOnce();
          for (const { key, patterns, regexes } of cachedPatterns) {
            for (const regex of regexes) {
              if (regex.test(_path)) {
                debug("Using origin", key, patterns);
                return cachedOrigins[key];
              }
            }
          }
          if (_path.startsWith("/_next/image") && cachedOrigins.imageOptimizer) {
            debug("Using origin", "imageOptimizer", _path);
            return cachedOrigins.imageOptimizer;
          }
          if (cachedOrigins.default) {
            debug("Using default origin", cachedOrigins.default, _path);
            return cachedOrigins.default;
          }
          return false;
        } catch (e) {
          error("Error while resolving origin", e);
          return false;
        }
      }
    };
    pattern_env_default = envLoader;
  }
});

// node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js
var dummy_exports = {};
__export(dummy_exports, {
  default: () => dummy_default
});
var resolver, dummy_default;
var init_dummy = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/assetResolver/dummy.js"() {
    resolver = {
      name: "dummy"
    };
    dummy_default = resolver;
  }
});

// node_modules/@opennextjs/aws/dist/utils/stream.js
import { ReadableStream as ReadableStream2 } from "node:stream/web";
function toReadableStream(value, isBase64) {
  return new ReadableStream2({
    pull(controller) {
      controller.enqueue(Buffer.from(value, isBase64 ? "base64" : "utf8"));
      controller.close();
    }
  }, { highWaterMark: 0 });
}
function emptyReadableStream() {
  if (process.env.OPEN_NEXT_FORCE_NON_EMPTY_RESPONSE === "true") {
    return new ReadableStream2({
      pull(controller) {
        maybeSomethingBuffer ??= Buffer.from("SOMETHING");
        controller.enqueue(maybeSomethingBuffer);
        controller.close();
      }
    }, { highWaterMark: 0 });
  }
  return new ReadableStream2({
    start(controller) {
      controller.close();
    }
  });
}
var maybeSomethingBuffer;
var init_stream = __esm({
  "node_modules/@opennextjs/aws/dist/utils/stream.js"() {
  }
});

// node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js
var fetch_exports = {};
__export(fetch_exports, {
  default: () => fetch_default
});
var fetchProxy, fetch_default;
var init_fetch = __esm({
  "node_modules/@opennextjs/aws/dist/overrides/proxyExternalRequest/fetch.js"() {
    init_stream();
    fetchProxy = {
      name: "fetch-proxy",
      // @ts-ignore
      proxy: async (internalEvent) => {
        const { url, headers: eventHeaders, method, body } = internalEvent;
        const headers = Object.fromEntries(Object.entries(eventHeaders).filter(([key]) => key.toLowerCase() !== "cf-connecting-ip"));
        const response = await fetch(url, {
          method,
          headers,
          body
        });
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
          const cur = responseHeaders[key];
          if (cur === void 0) {
            responseHeaders[key] = value;
          } else if (Array.isArray(cur)) {
            cur.push(value);
          } else {
            responseHeaders[key] = [cur, value];
          }
        });
        return {
          type: "core",
          headers: responseHeaders,
          statusCode: response.status,
          isBase64Encoded: true,
          body: response.body ?? emptyReadableStream()
        };
      }
    };
    fetch_default = fetchProxy;
  }
});

// .next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js
var require_node_modules_next_dist_esm_build_templates_edge_wrapper_0_kjzx3 = __commonJS({
  ".next/server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", 35825, (e, t, l) => {
      self._ENTRIES ||= {};
      let n = Promise.resolve().then(() => e.i(58217));
      n.catch(() => {
      }), self._ENTRIES.middleware_middleware = new Proxy(n, { get(e2, t2) {
        if ("then" === t2) return (t3, l3) => e2.then(t3, l3);
        let l2 = (...l3) => e2.then((e3) => (0, e3[t2])(...l3));
        return l2.then = (l3, n2) => e2.then((e3) => e3[t2]).then(l3, n2), l2;
      } });
    }]);
  }
});

// node-built-in-modules:node:buffer
var node_buffer_exports = {};
import * as node_buffer_star from "node:buffer";
var init_node_buffer = __esm({
  "node-built-in-modules:node:buffer"() {
    __reExport(node_buffer_exports, node_buffer_star);
  }
});

// node-built-in-modules:node:async_hooks
var node_async_hooks_exports = {};
import * as node_async_hooks_star from "node:async_hooks";
var init_node_async_hooks = __esm({
  "node-built-in-modules:node:async_hooks"() {
    __reExport(node_async_hooks_exports, node_async_hooks_star);
  }
});

// .next/server/edge/chunks/[root-of-the-server]__1xk24c3._.js
var require_root_of_the_server_1xk24c3 = __commonJS({
  ".next/server/edge/chunks/[root-of-the-server]__1xk24c3._.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__1xk24c3._.js", 74398, (e, t, r) => {
    }, 28042, (e, t, r) => {
      "use strict";
      var n = Object.defineProperty, i = Object.getOwnPropertyDescriptor, a = Object.getOwnPropertyNames, o = Object.prototype.hasOwnProperty, s = {}, l = { RequestCookies: () => g, ResponseCookies: () => m, parseCookie: () => d, parseSetCookie: () => p, stringifyCookie: () => u };
      for (var c in l) n(s, c, { get: l[c], enumerable: true });
      function u(e2) {
        var t2;
        let r2 = ["path" in e2 && e2.path && `Path=${e2.path}`, "expires" in e2 && (e2.expires || 0 === e2.expires) && `Expires=${("number" == typeof e2.expires ? new Date(e2.expires) : e2.expires).toUTCString()}`, "maxAge" in e2 && "number" == typeof e2.maxAge && `Max-Age=${e2.maxAge}`, "domain" in e2 && e2.domain && `Domain=${e2.domain}`, "secure" in e2 && e2.secure && "Secure", "httpOnly" in e2 && e2.httpOnly && "HttpOnly", "sameSite" in e2 && e2.sameSite && `SameSite=${e2.sameSite}`, "partitioned" in e2 && e2.partitioned && "Partitioned", "priority" in e2 && e2.priority && `Priority=${e2.priority}`].filter(Boolean), n2 = `${e2.name}=${encodeURIComponent(null != (t2 = e2.value) ? t2 : "")}`;
        return 0 === r2.length ? n2 : `${n2}; ${r2.join("; ")}`;
      }
      function d(e2) {
        let t2 = /* @__PURE__ */ new Map();
        for (let r2 of e2.split(/; */)) {
          if (!r2) continue;
          let e3 = r2.indexOf("=");
          if (-1 === e3) {
            t2.set(r2, "true");
            continue;
          }
          let [n2, i2] = [r2.slice(0, e3), r2.slice(e3 + 1)];
          try {
            t2.set(n2, decodeURIComponent(null != i2 ? i2 : "true"));
          } catch {
          }
        }
        return t2;
      }
      function p(e2) {
        if (!e2) return;
        let [[t2, r2], ...n2] = d(e2), { domain: i2, expires: a2, httponly: o2, maxage: s2, path: l2, samesite: c2, secure: u2, partitioned: p2, priority: g2 } = Object.fromEntries(n2.map(([e3, t3]) => [e3.toLowerCase().replace(/-/g, ""), t3]));
        {
          var m2, y, b = { name: t2, value: decodeURIComponent(r2), domain: i2, ...a2 && { expires: new Date(a2) }, ...o2 && { httpOnly: true }, ..."string" == typeof s2 && { maxAge: Number(s2) }, path: l2, ...c2 && { sameSite: h.includes(m2 = (m2 = c2).toLowerCase()) ? m2 : void 0 }, ...u2 && { secure: true }, ...g2 && { priority: f.includes(y = (y = g2).toLowerCase()) ? y : void 0 }, ...p2 && { partitioned: true } };
          let e3 = {};
          for (let t3 in b) b[t3] && (e3[t3] = b[t3]);
          return e3;
        }
      }
      t.exports = ((e2, t2, r2) => {
        if (t2 && "object" == typeof t2 || "function" == typeof t2) for (let s2 of a(t2)) o.call(e2, s2) || void 0 === s2 || n(e2, s2, { get: () => t2[s2], enumerable: !(r2 = i(t2, s2)) || r2.enumerable });
        return e2;
      })(n({}, "__esModule", { value: true }), s);
      var h = ["strict", "lax", "none"], f = ["low", "medium", "high"], g = class {
        constructor(e2) {
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const t2 = e2.get("cookie");
          if (t2) for (const [e3, r2] of d(t2)) this._parsed.set(e3, { name: e3, value: r2 });
        }
        [Symbol.iterator]() {
          return this._parsed[Symbol.iterator]();
        }
        get size() {
          return this._parsed.size;
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed);
          if (!e2.length) return r2.map(([e3, t3]) => t3);
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter(([e3]) => e3 === n2).map(([e3, t3]) => t3);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2] = 1 === e2.length ? [e2[0].name, e2[0].value] : e2, n2 = this._parsed;
          return n2.set(t2, { name: t2, value: r2 }), this._headers.set("cookie", Array.from(n2).map(([e3, t3]) => u(t3)).join("; ")), this;
        }
        delete(e2) {
          let t2 = this._parsed, r2 = Array.isArray(e2) ? e2.map((e3) => t2.delete(e3)) : t2.delete(e2);
          return this._headers.set("cookie", Array.from(t2).map(([e3, t3]) => u(t3)).join("; ")), r2;
        }
        clear() {
          return this.delete(Array.from(this._parsed.keys())), this;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `RequestCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map((e2) => `${e2.name}=${encodeURIComponent(e2.value)}`).join("; ");
        }
      }, m = class {
        constructor(e2) {
          var t2, r2, n2;
          this._parsed = /* @__PURE__ */ new Map(), this._headers = e2;
          const i2 = null != (n2 = null != (r2 = null == (t2 = e2.getSetCookie) ? void 0 : t2.call(e2)) ? r2 : e2.get("set-cookie")) ? n2 : [];
          for (const e3 of Array.isArray(i2) ? i2 : function(e4) {
            if (!e4) return [];
            var t3, r3, n3, i3, a2, o2 = [], s2 = 0;
            function l2() {
              for (; s2 < e4.length && /\s/.test(e4.charAt(s2)); ) s2 += 1;
              return s2 < e4.length;
            }
            for (; s2 < e4.length; ) {
              for (t3 = s2, a2 = false; l2(); ) if ("," === (r3 = e4.charAt(s2))) {
                for (n3 = s2, s2 += 1, l2(), i3 = s2; s2 < e4.length && "=" !== (r3 = e4.charAt(s2)) && ";" !== r3 && "," !== r3; ) s2 += 1;
                s2 < e4.length && "=" === e4.charAt(s2) ? (a2 = true, s2 = i3, o2.push(e4.substring(t3, n3)), t3 = s2) : s2 = n3 + 1;
              } else s2 += 1;
              (!a2 || s2 >= e4.length) && o2.push(e4.substring(t3, e4.length));
            }
            return o2;
          }(i2)) {
            const t3 = p(e3);
            t3 && this._parsed.set(t3.name, t3);
          }
        }
        get(...e2) {
          let t2 = "string" == typeof e2[0] ? e2[0] : e2[0].name;
          return this._parsed.get(t2);
        }
        getAll(...e2) {
          var t2;
          let r2 = Array.from(this._parsed.values());
          if (!e2.length) return r2;
          let n2 = "string" == typeof e2[0] ? e2[0] : null == (t2 = e2[0]) ? void 0 : t2.name;
          return r2.filter((e3) => e3.name === n2);
        }
        has(e2) {
          return this._parsed.has(e2);
        }
        set(...e2) {
          let [t2, r2, n2] = 1 === e2.length ? [e2[0].name, e2[0].value, e2[0]] : e2, i2 = this._parsed;
          return i2.set(t2, function(e3 = { name: "", value: "" }) {
            return "number" == typeof e3.expires && (e3.expires = new Date(e3.expires)), e3.maxAge && (e3.expires = new Date(Date.now() + 1e3 * e3.maxAge)), (null === e3.path || void 0 === e3.path) && (e3.path = "/"), e3;
          }({ name: t2, value: r2, ...n2 })), function(e3, t3) {
            for (let [, r3] of (t3.delete("set-cookie"), e3)) {
              let e4 = u(r3);
              t3.append("set-cookie", e4);
            }
          }(i2, this._headers), this;
        }
        delete(...e2) {
          let [t2, r2] = "string" == typeof e2[0] ? [e2[0]] : [e2[0].name, e2[0]];
          return this.set({ ...r2, name: t2, value: "", expires: /* @__PURE__ */ new Date(0) });
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return `ResponseCookies ${JSON.stringify(Object.fromEntries(this._parsed))}`;
        }
        toString() {
          return [...this._parsed.values()].map(u).join("; ");
        }
      };
    }, 59110, (e, t, r) => {
      (() => {
        "use strict";
        let r2, n, i, a, o;
        var s, l, c, u, d, p, h, f, g, m, y, b, v, w, _, E, x = { 912: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ContextAPI = void 0;
          let n2 = r3(108), i2 = r3(221), a2 = r3(44), o2 = "context", s2 = new n2.NoopContextManager();
          t2.ContextAPI = class e3 {
            static getInstance() {
              return this._instance || (this._instance = new e3()), this._instance;
            }
            setGlobalContextManager(e4) {
              return (0, i2.registerGlobal)(o2, e4, a2.DiagAPI.instance());
            }
            active() {
              return this._getContextManager().active();
            }
            with(e4, t3, r4, ...n3) {
              return this._getContextManager().with(e4, t3, r4, ...n3);
            }
            bind(e4, t3) {
              return this._getContextManager().bind(e4, t3);
            }
            _getContextManager() {
              return (0, i2.getGlobal)(o2) || s2;
            }
            disable() {
              this._getContextManager().disable(), (0, i2.unregisterGlobal)(o2, a2.DiagAPI.instance());
            }
          };
        }, 44: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagAPI = void 0;
          let n2 = r3(757), i2 = r3(412), a2 = r3(711), o2 = r3(221);
          t2.DiagAPI = class e3 {
            constructor() {
              function e4(e5) {
                return function(...t4) {
                  let r4 = (0, o2.getGlobal)("diag");
                  if (r4) return r4[e5](...t4);
                };
              }
              const t3 = this;
              t3.setLogger = (e5, r4 = { logLevel: a2.DiagLogLevel.INFO }) => {
                var n3, s2, l2;
                if (e5 === t3) {
                  let e6 = Error("Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation");
                  return t3.error(null != (n3 = e6.stack) ? n3 : e6.message), false;
                }
                "number" == typeof r4 && (r4 = { logLevel: r4 });
                let c2 = (0, o2.getGlobal)("diag"), u2 = (0, i2.createLogLevelDiagLogger)(null != (s2 = r4.logLevel) ? s2 : a2.DiagLogLevel.INFO, e5);
                if (c2 && !r4.suppressOverrideMessage) {
                  let e6 = null != (l2 = Error().stack) ? l2 : "<failed to generate stacktrace>";
                  c2.warn(`Current logger will be overwritten from ${e6}`), u2.warn(`Current logger will overwrite one already registered from ${e6}`);
                }
                return (0, o2.registerGlobal)("diag", u2, t3, true);
              }, t3.disable = () => {
                (0, o2.unregisterGlobal)("diag", t3);
              }, t3.createComponentLogger = (e5) => new n2.DiagComponentLogger(e5), t3.verbose = e4("verbose"), t3.debug = e4("debug"), t3.info = e4("info"), t3.warn = e4("warn"), t3.error = e4("error");
            }
            static instance() {
              return this._instance || (this._instance = new e3()), this._instance;
            }
          };
        }, 262: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.MetricsAPI = void 0;
          let n2 = r3(586), i2 = r3(221), a2 = r3(44), o2 = "metrics";
          t2.MetricsAPI = class e3 {
            static getInstance() {
              return this._instance || (this._instance = new e3()), this._instance;
            }
            setGlobalMeterProvider(e4) {
              return (0, i2.registerGlobal)(o2, e4, a2.DiagAPI.instance());
            }
            getMeterProvider() {
              return (0, i2.getGlobal)(o2) || n2.NOOP_METER_PROVIDER;
            }
            getMeter(e4, t3, r4) {
              return this.getMeterProvider().getMeter(e4, t3, r4);
            }
            disable() {
              (0, i2.unregisterGlobal)(o2, a2.DiagAPI.instance());
            }
          };
        }, 25: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.PropagationAPI = void 0;
          let n2 = r3(221), i2 = r3(19), a2 = r3(92), o2 = r3(398), s2 = r3(504), l2 = r3(44), c2 = "propagation", u2 = new i2.NoopTextMapPropagator();
          t2.PropagationAPI = class e3 {
            constructor() {
              this.createBaggage = s2.createBaggage, this.getBaggage = o2.getBaggage, this.getActiveBaggage = o2.getActiveBaggage, this.setBaggage = o2.setBaggage, this.deleteBaggage = o2.deleteBaggage;
            }
            static getInstance() {
              return this._instance || (this._instance = new e3()), this._instance;
            }
            setGlobalPropagator(e4) {
              return (0, n2.registerGlobal)(c2, e4, l2.DiagAPI.instance());
            }
            inject(e4, t3, r4 = a2.defaultTextMapSetter) {
              return this._getGlobalPropagator().inject(e4, t3, r4);
            }
            extract(e4, t3, r4 = a2.defaultTextMapGetter) {
              return this._getGlobalPropagator().extract(e4, t3, r4);
            }
            fields() {
              return this._getGlobalPropagator().fields();
            }
            disable() {
              (0, n2.unregisterGlobal)(c2, l2.DiagAPI.instance());
            }
            _getGlobalPropagator() {
              return (0, n2.getGlobal)(c2) || u2;
            }
          };
        }, 397: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceAPI = void 0;
          let n2 = r3(221), i2 = r3(498), a2 = r3(477), o2 = r3(793), s2 = r3(44), l2 = "trace";
          t2.TraceAPI = class e3 {
            constructor() {
              this._proxyTracerProvider = new i2.ProxyTracerProvider(), this.wrapSpanContext = a2.wrapSpanContext, this.isSpanContextValid = a2.isSpanContextValid, this.deleteSpan = o2.deleteSpan, this.getSpan = o2.getSpan, this.getActiveSpan = o2.getActiveSpan, this.getSpanContext = o2.getSpanContext, this.setSpan = o2.setSpan, this.setSpanContext = o2.setSpanContext;
            }
            static getInstance() {
              return this._instance || (this._instance = new e3()), this._instance;
            }
            setGlobalTracerProvider(e4) {
              let t3 = (0, n2.registerGlobal)(l2, this._proxyTracerProvider, s2.DiagAPI.instance());
              return t3 && this._proxyTracerProvider.setDelegate(e4), t3;
            }
            getTracerProvider() {
              return (0, n2.getGlobal)(l2) || this._proxyTracerProvider;
            }
            getTracer(e4, t3) {
              return this.getTracerProvider().getTracer(e4, t3);
            }
            disable() {
              (0, n2.unregisterGlobal)(l2, s2.DiagAPI.instance()), this._proxyTracerProvider = new i2.ProxyTracerProvider();
            }
          };
        }, 398: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.deleteBaggage = t2.setBaggage = t2.getActiveBaggage = t2.getBaggage = void 0;
          let n2 = r3(912), i2 = (0, r3(23).createContextKey)("OpenTelemetry Baggage Key");
          function a2(e3) {
            return e3.getValue(i2) || void 0;
          }
          t2.getBaggage = a2, t2.getActiveBaggage = function() {
            return a2(n2.ContextAPI.getInstance().active());
          }, t2.setBaggage = function(e3, t3) {
            return e3.setValue(i2, t3);
          }, t2.deleteBaggage = function(e3) {
            return e3.deleteValue(i2);
          };
        }, 152: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.BaggageImpl = void 0, t2.BaggageImpl = class e3 {
            constructor(e4) {
              this._entries = e4 ? new Map(e4) : /* @__PURE__ */ new Map();
            }
            getEntry(e4) {
              let t3 = this._entries.get(e4);
              if (t3) return Object.assign({}, t3);
            }
            getAllEntries() {
              return Array.from(this._entries.entries()).map(([e4, t3]) => [e4, t3]);
            }
            setEntry(t3, r3) {
              let n2 = new e3(this._entries);
              return n2._entries.set(t3, r3), n2;
            }
            removeEntry(t3) {
              let r3 = new e3(this._entries);
              return r3._entries.delete(t3), r3;
            }
            removeEntries(...t3) {
              let r3 = new e3(this._entries);
              for (let e4 of t3) r3._entries.delete(e4);
              return r3;
            }
            clear() {
              return new e3();
            }
          };
        }, 647: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataSymbol = void 0, t2.baggageEntryMetadataSymbol = Symbol("BaggageEntryMetadata");
        }, 504: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.baggageEntryMetadataFromString = t2.createBaggage = void 0;
          let n2 = r3(44), i2 = r3(152), a2 = r3(647), o2 = n2.DiagAPI.instance();
          t2.createBaggage = function(e3 = {}) {
            return new i2.BaggageImpl(new Map(Object.entries(e3)));
          }, t2.baggageEntryMetadataFromString = function(e3) {
            return "string" != typeof e3 && (o2.error(`Cannot create baggage metadata from unknown type: ${typeof e3}`), e3 = ""), { __TYPE__: a2.baggageEntryMetadataSymbol, toString: () => e3 };
          };
        }, 778: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.context = void 0, t2.context = r3(912).ContextAPI.getInstance();
        }, 108: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopContextManager = void 0;
          let n2 = r3(23);
          t2.NoopContextManager = class {
            active() {
              return n2.ROOT_CONTEXT;
            }
            with(e3, t3, r4, ...n3) {
              return t3.call(r4, ...n3);
            }
            bind(e3, t3) {
              return t3;
            }
            enable() {
              return this;
            }
            disable() {
              return this;
            }
          };
        }, 23: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ROOT_CONTEXT = t2.createContextKey = void 0, t2.createContextKey = function(e3) {
            return Symbol.for(e3);
          }, t2.ROOT_CONTEXT = new class e3 {
            constructor(t3) {
              const r3 = this;
              r3._currentContext = t3 ? new Map(t3) : /* @__PURE__ */ new Map(), r3.getValue = (e4) => r3._currentContext.get(e4), r3.setValue = (t4, n2) => {
                let i2 = new e3(r3._currentContext);
                return i2._currentContext.set(t4, n2), i2;
              }, r3.deleteValue = (t4) => {
                let n2 = new e3(r3._currentContext);
                return n2._currentContext.delete(t4), n2;
              };
            }
          }();
        }, 304: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.diag = void 0, t2.diag = r3(44).DiagAPI.instance();
        }, 757: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagComponentLogger = void 0;
          let n2 = r3(221);
          function i2(e3, t3, r4) {
            let i3 = (0, n2.getGlobal)("diag");
            if (i3) return r4.unshift(t3), i3[e3](...r4);
          }
          t2.DiagComponentLogger = class {
            constructor(e3) {
              this._namespace = e3.namespace || "DiagComponentLogger";
            }
            debug(...e3) {
              return i2("debug", this._namespace, e3);
            }
            error(...e3) {
              return i2("error", this._namespace, e3);
            }
            info(...e3) {
              return i2("info", this._namespace, e3);
            }
            warn(...e3) {
              return i2("warn", this._namespace, e3);
            }
            verbose(...e3) {
              return i2("verbose", this._namespace, e3);
            }
          };
        }, 83: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagConsoleLogger = void 0;
          let r3 = [{ n: "error", c: "error" }, { n: "warn", c: "warn" }, { n: "info", c: "info" }, { n: "debug", c: "debug" }, { n: "verbose", c: "trace" }];
          t2.DiagConsoleLogger = class {
            constructor() {
              for (let e3 = 0; e3 < r3.length; e3++) this[r3[e3].n] = /* @__PURE__ */ function(e4) {
                return function(...t3) {
                  if (console) {
                    let r4 = console[e4];
                    if ("function" != typeof r4 && (r4 = console.log), "function" == typeof r4) return r4.apply(console, t3);
                  }
                };
              }(r3[e3].c);
            }
          };
        }, 412: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createLogLevelDiagLogger = void 0;
          let n2 = r3(711);
          t2.createLogLevelDiagLogger = function(e3, t3) {
            function r4(r5, n3) {
              let i2 = t3[r5];
              return "function" == typeof i2 && e3 >= n3 ? i2.bind(t3) : function() {
              };
            }
            return e3 < n2.DiagLogLevel.NONE ? e3 = n2.DiagLogLevel.NONE : e3 > n2.DiagLogLevel.ALL && (e3 = n2.DiagLogLevel.ALL), t3 = t3 || {}, { error: r4("error", n2.DiagLogLevel.ERROR), warn: r4("warn", n2.DiagLogLevel.WARN), info: r4("info", n2.DiagLogLevel.INFO), debug: r4("debug", n2.DiagLogLevel.DEBUG), verbose: r4("verbose", n2.DiagLogLevel.VERBOSE) };
          };
        }, 711: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.DiagLogLevel = void 0, (r3 = t2.DiagLogLevel || (t2.DiagLogLevel = {}))[r3.NONE = 0] = "NONE", r3[r3.ERROR = 30] = "ERROR", r3[r3.WARN = 50] = "WARN", r3[r3.INFO = 60] = "INFO", r3[r3.DEBUG = 70] = "DEBUG", r3[r3.VERBOSE = 80] = "VERBOSE", r3[r3.ALL = 9999] = "ALL";
        }, 221: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.unregisterGlobal = t2.getGlobal = t2.registerGlobal = void 0;
          let n2 = r3(678), i2 = r3(652), a2 = r3(662), o2 = i2.VERSION.split(".")[0], s2 = Symbol.for(`opentelemetry.js.api.${o2}`), l2 = n2._globalThis;
          t2.registerGlobal = function(e3, t3, r4, n3 = false) {
            var a3;
            let o3 = l2[s2] = null != (a3 = l2[s2]) ? a3 : { version: i2.VERSION };
            if (!n3 && o3[e3]) {
              let t4 = Error(`@opentelemetry/api: Attempted duplicate registration of API: ${e3}`);
              return r4.error(t4.stack || t4.message), false;
            }
            if (o3.version !== i2.VERSION) {
              let t4 = Error(`@opentelemetry/api: Registration of version v${o3.version} for ${e3} does not match previously registered API v${i2.VERSION}`);
              return r4.error(t4.stack || t4.message), false;
            }
            return o3[e3] = t3, r4.debug(`@opentelemetry/api: Registered a global for ${e3} v${i2.VERSION}.`), true;
          }, t2.getGlobal = function(e3) {
            var t3, r4;
            let n3 = null == (t3 = l2[s2]) ? void 0 : t3.version;
            if (n3 && (0, a2.isCompatible)(n3)) return null == (r4 = l2[s2]) ? void 0 : r4[e3];
          }, t2.unregisterGlobal = function(e3, t3) {
            t3.debug(`@opentelemetry/api: Unregistering a global for ${e3} v${i2.VERSION}.`);
            let r4 = l2[s2];
            r4 && delete r4[e3];
          };
        }, 662: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.isCompatible = t2._makeCompatibilityCheck = void 0;
          let n2 = r3(652), i2 = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
          function a2(e3) {
            let t3 = /* @__PURE__ */ new Set([e3]), r4 = /* @__PURE__ */ new Set(), n3 = e3.match(i2);
            if (!n3) return () => false;
            let a3 = { major: +n3[1], minor: +n3[2], patch: +n3[3], prerelease: n3[4] };
            if (null != a3.prerelease) return function(t4) {
              return t4 === e3;
            };
            function o2(e4) {
              return r4.add(e4), false;
            }
            return function(e4) {
              if (t3.has(e4)) return true;
              if (r4.has(e4)) return false;
              let n4 = e4.match(i2);
              if (!n4) return o2(e4);
              let s2 = { major: +n4[1], minor: +n4[2], patch: +n4[3], prerelease: n4[4] };
              if (null != s2.prerelease || a3.major !== s2.major) return o2(e4);
              if (0 === a3.major) return a3.minor === s2.minor && a3.patch <= s2.patch ? (t3.add(e4), true) : o2(e4);
              return a3.minor <= s2.minor ? (t3.add(e4), true) : o2(e4);
            };
          }
          t2._makeCompatibilityCheck = a2, t2.isCompatible = a2(n2.VERSION);
        }, 120: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.metrics = void 0, t2.metrics = r3(262).MetricsAPI.getInstance();
        }, 532: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ValueType = void 0, (r3 = t2.ValueType || (t2.ValueType = {}))[r3.INT = 0] = "INT", r3[r3.DOUBLE = 1] = "DOUBLE";
        }, 440: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createNoopMeter = t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = t2.NOOP_OBSERVABLE_GAUGE_METRIC = t2.NOOP_OBSERVABLE_COUNTER_METRIC = t2.NOOP_UP_DOWN_COUNTER_METRIC = t2.NOOP_HISTOGRAM_METRIC = t2.NOOP_COUNTER_METRIC = t2.NOOP_METER = t2.NoopObservableUpDownCounterMetric = t2.NoopObservableGaugeMetric = t2.NoopObservableCounterMetric = t2.NoopObservableMetric = t2.NoopHistogramMetric = t2.NoopUpDownCounterMetric = t2.NoopCounterMetric = t2.NoopMetric = t2.NoopMeter = void 0;
          class r3 {
            createHistogram(e3, r4) {
              return t2.NOOP_HISTOGRAM_METRIC;
            }
            createCounter(e3, r4) {
              return t2.NOOP_COUNTER_METRIC;
            }
            createUpDownCounter(e3, r4) {
              return t2.NOOP_UP_DOWN_COUNTER_METRIC;
            }
            createObservableGauge(e3, r4) {
              return t2.NOOP_OBSERVABLE_GAUGE_METRIC;
            }
            createObservableCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_COUNTER_METRIC;
            }
            createObservableUpDownCounter(e3, r4) {
              return t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
            }
            addBatchObservableCallback(e3, t3) {
            }
            removeBatchObservableCallback(e3) {
            }
          }
          t2.NoopMeter = r3;
          class n2 {
          }
          t2.NoopMetric = n2;
          class i2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopCounterMetric = i2;
          class a2 extends n2 {
            add(e3, t3) {
            }
          }
          t2.NoopUpDownCounterMetric = a2;
          class o2 extends n2 {
            record(e3, t3) {
            }
          }
          t2.NoopHistogramMetric = o2;
          class s2 {
            addCallback(e3) {
            }
            removeCallback(e3) {
            }
          }
          t2.NoopObservableMetric = s2;
          class l2 extends s2 {
          }
          t2.NoopObservableCounterMetric = l2;
          class c2 extends s2 {
          }
          t2.NoopObservableGaugeMetric = c2;
          class u2 extends s2 {
          }
          t2.NoopObservableUpDownCounterMetric = u2, t2.NOOP_METER = new r3(), t2.NOOP_COUNTER_METRIC = new i2(), t2.NOOP_HISTOGRAM_METRIC = new o2(), t2.NOOP_UP_DOWN_COUNTER_METRIC = new a2(), t2.NOOP_OBSERVABLE_COUNTER_METRIC = new l2(), t2.NOOP_OBSERVABLE_GAUGE_METRIC = new c2(), t2.NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new u2(), t2.createNoopMeter = function() {
            return t2.NOOP_METER;
          };
        }, 586: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NOOP_METER_PROVIDER = t2.NoopMeterProvider = void 0;
          let n2 = r3(440);
          class i2 {
            getMeter(e3, t3, r4) {
              return n2.NOOP_METER;
            }
          }
          t2.NoopMeterProvider = i2, t2.NOOP_METER_PROVIDER = new i2();
        }, 678: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(59), t2);
        }, 460: (t2, r3) => {
          Object.defineProperty(r3, "__esModule", { value: true }), r3._globalThis = void 0, r3._globalThis = "object" == typeof globalThis ? globalThis : e.g;
        }, 59: function(e2, t2, r3) {
          var n2 = this && this.__createBinding || (Object.create ? function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), Object.defineProperty(e3, n3, { enumerable: true, get: function() {
              return t3[r4];
            } });
          } : function(e3, t3, r4, n3) {
            void 0 === n3 && (n3 = r4), e3[n3] = t3[r4];
          }), i2 = this && this.__exportStar || function(e3, t3) {
            for (var r4 in e3) "default" === r4 || Object.prototype.hasOwnProperty.call(t3, r4) || n2(t3, e3, r4);
          };
          Object.defineProperty(t2, "__esModule", { value: true }), i2(r3(460), t2);
        }, 27: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.propagation = void 0, t2.propagation = r3(25).PropagationAPI.getInstance();
        }, 19: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTextMapPropagator = void 0, t2.NoopTextMapPropagator = class {
            inject(e3, t3) {
            }
            extract(e3, t3) {
              return e3;
            }
            fields() {
              return [];
            }
          };
        }, 92: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.defaultTextMapSetter = t2.defaultTextMapGetter = void 0, t2.defaultTextMapGetter = { get(e3, t3) {
            if (null != e3) return e3[t3];
          }, keys: (e3) => null == e3 ? [] : Object.keys(e3) }, t2.defaultTextMapSetter = { set(e3, t3, r3) {
            null != e3 && (e3[t3] = r3);
          } };
        }, 816: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.trace = void 0, t2.trace = r3(397).TraceAPI.getInstance();
        }, 374: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NonRecordingSpan = void 0;
          let n2 = r3(546);
          t2.NonRecordingSpan = class {
            constructor(e3 = n2.INVALID_SPAN_CONTEXT) {
              this._spanContext = e3;
            }
            spanContext() {
              return this._spanContext;
            }
            setAttribute(e3, t3) {
              return this;
            }
            setAttributes(e3) {
              return this;
            }
            addEvent(e3, t3) {
              return this;
            }
            setStatus(e3) {
              return this;
            }
            updateName(e3) {
              return this;
            }
            end(e3) {
            }
            isRecording() {
              return false;
            }
            recordException(e3, t3) {
            }
          };
        }, 637: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracer = void 0;
          let n2 = r3(912), i2 = r3(793), a2 = r3(374), o2 = r3(477), s2 = n2.ContextAPI.getInstance();
          t2.NoopTracer = class {
            startSpan(e3, t3, r4 = s2.active()) {
              var n3;
              if (null == t3 ? void 0 : t3.root) return new a2.NonRecordingSpan();
              let l2 = r4 && (0, i2.getSpanContext)(r4);
              return "object" == typeof (n3 = l2) && "string" == typeof n3.spanId && "string" == typeof n3.traceId && "number" == typeof n3.traceFlags && (0, o2.isSpanContextValid)(l2) ? new a2.NonRecordingSpan(l2) : new a2.NonRecordingSpan();
            }
            startActiveSpan(e3, t3, r4, n3) {
              let a3, o3, l2;
              if (arguments.length < 2) return;
              2 == arguments.length ? l2 = t3 : 3 == arguments.length ? (a3 = t3, l2 = r4) : (a3 = t3, o3 = r4, l2 = n3);
              let c2 = null != o3 ? o3 : s2.active(), u2 = this.startSpan(e3, a3, c2), d2 = (0, i2.setSpan)(c2, u2);
              return s2.with(d2, l2, void 0, u2);
            }
          };
        }, 76: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.NoopTracerProvider = void 0;
          let n2 = r3(637);
          t2.NoopTracerProvider = class {
            getTracer(e3, t3, r4) {
              return new n2.NoopTracer();
            }
          };
        }, 779: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracer = void 0;
          let n2 = new (r3(637)).NoopTracer();
          t2.ProxyTracer = class {
            constructor(e3, t3, r4, n3) {
              this._provider = e3, this.name = t3, this.version = r4, this.options = n3;
            }
            startSpan(e3, t3, r4) {
              return this._getTracer().startSpan(e3, t3, r4);
            }
            startActiveSpan(e3, t3, r4, n3) {
              let i2 = this._getTracer();
              return Reflect.apply(i2.startActiveSpan, i2, arguments);
            }
            _getTracer() {
              if (this._delegate) return this._delegate;
              let e3 = this._provider.getDelegateTracer(this.name, this.version, this.options);
              return e3 ? (this._delegate = e3, this._delegate) : n2;
            }
          };
        }, 498: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.ProxyTracerProvider = void 0;
          let n2 = r3(779), i2 = new (r3(76)).NoopTracerProvider();
          t2.ProxyTracerProvider = class {
            getTracer(e3, t3, r4) {
              var i3;
              return null != (i3 = this.getDelegateTracer(e3, t3, r4)) ? i3 : new n2.ProxyTracer(this, e3, t3, r4);
            }
            getDelegate() {
              var e3;
              return null != (e3 = this._delegate) ? e3 : i2;
            }
            setDelegate(e3) {
              this._delegate = e3;
            }
            getDelegateTracer(e3, t3, r4) {
              var n3;
              return null == (n3 = this._delegate) ? void 0 : n3.getTracer(e3, t3, r4);
            }
          };
        }, 312: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SamplingDecision = void 0, (r3 = t2.SamplingDecision || (t2.SamplingDecision = {}))[r3.NOT_RECORD = 0] = "NOT_RECORD", r3[r3.RECORD = 1] = "RECORD", r3[r3.RECORD_AND_SAMPLED = 2] = "RECORD_AND_SAMPLED";
        }, 793: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.getSpanContext = t2.setSpanContext = t2.deleteSpan = t2.setSpan = t2.getActiveSpan = t2.getSpan = void 0;
          let n2 = r3(23), i2 = r3(374), a2 = r3(912), o2 = (0, n2.createContextKey)("OpenTelemetry Context Key SPAN");
          function s2(e3) {
            return e3.getValue(o2) || void 0;
          }
          function l2(e3, t3) {
            return e3.setValue(o2, t3);
          }
          t2.getSpan = s2, t2.getActiveSpan = function() {
            return s2(a2.ContextAPI.getInstance().active());
          }, t2.setSpan = l2, t2.deleteSpan = function(e3) {
            return e3.deleteValue(o2);
          }, t2.setSpanContext = function(e3, t3) {
            return l2(e3, new i2.NonRecordingSpan(t3));
          }, t2.getSpanContext = function(e3) {
            var t3;
            return null == (t3 = s2(e3)) ? void 0 : t3.spanContext();
          };
        }, 285: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceStateImpl = void 0;
          let n2 = r3(240);
          t2.TraceStateImpl = class e3 {
            constructor(e4) {
              this._internalState = /* @__PURE__ */ new Map(), e4 && this._parse(e4);
            }
            set(e4, t3) {
              let r4 = this._clone();
              return r4._internalState.has(e4) && r4._internalState.delete(e4), r4._internalState.set(e4, t3), r4;
            }
            unset(e4) {
              let t3 = this._clone();
              return t3._internalState.delete(e4), t3;
            }
            get(e4) {
              return this._internalState.get(e4);
            }
            serialize() {
              return this._keys().reduce((e4, t3) => (e4.push(t3 + "=" + this.get(t3)), e4), []).join(",");
            }
            _parse(e4) {
              !(e4.length > 512) && (this._internalState = e4.split(",").reverse().reduce((e5, t3) => {
                let r4 = t3.trim(), i2 = r4.indexOf("=");
                if (-1 !== i2) {
                  let a2 = r4.slice(0, i2), o2 = r4.slice(i2 + 1, t3.length);
                  (0, n2.validateKey)(a2) && (0, n2.validateValue)(o2) && e5.set(a2, o2);
                }
                return e5;
              }, /* @__PURE__ */ new Map()), this._internalState.size > 32 && (this._internalState = new Map(Array.from(this._internalState.entries()).reverse().slice(0, 32))));
            }
            _keys() {
              return Array.from(this._internalState.keys()).reverse();
            }
            _clone() {
              let t3 = new e3();
              return t3._internalState = new Map(this._internalState), t3;
            }
          };
        }, 240: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.validateValue = t2.validateKey = void 0;
          let r3 = "[_0-9a-z-*/]", n2 = `[a-z]${r3}{0,255}`, i2 = `[a-z0-9]${r3}{0,240}@[a-z]${r3}{0,13}`, a2 = RegExp(`^(?:${n2}|${i2})$`), o2 = /^[ -~]{0,255}[!-~]$/, s2 = /,|=/;
          t2.validateKey = function(e3) {
            return a2.test(e3);
          }, t2.validateValue = function(e3) {
            return o2.test(e3) && !s2.test(e3);
          };
        }, 87: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.createTraceState = void 0;
          let n2 = r3(285);
          t2.createTraceState = function(e3) {
            return new n2.TraceStateImpl(e3);
          };
        }, 546: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.INVALID_SPAN_CONTEXT = t2.INVALID_TRACEID = t2.INVALID_SPANID = void 0;
          let n2 = r3(731);
          t2.INVALID_SPANID = "0000000000000000", t2.INVALID_TRACEID = "00000000000000000000000000000000", t2.INVALID_SPAN_CONTEXT = { traceId: t2.INVALID_TRACEID, spanId: t2.INVALID_SPANID, traceFlags: n2.TraceFlags.NONE };
        }, 613: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanKind = void 0, (r3 = t2.SpanKind || (t2.SpanKind = {}))[r3.INTERNAL = 0] = "INTERNAL", r3[r3.SERVER = 1] = "SERVER", r3[r3.CLIENT = 2] = "CLIENT", r3[r3.PRODUCER = 3] = "PRODUCER", r3[r3.CONSUMER = 4] = "CONSUMER";
        }, 477: (e2, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.wrapSpanContext = t2.isSpanContextValid = t2.isValidSpanId = t2.isValidTraceId = void 0;
          let n2 = r3(546), i2 = r3(374), a2 = /^([0-9a-f]{32})$/i, o2 = /^[0-9a-f]{16}$/i;
          function s2(e3) {
            return a2.test(e3) && e3 !== n2.INVALID_TRACEID;
          }
          function l2(e3) {
            return o2.test(e3) && e3 !== n2.INVALID_SPANID;
          }
          t2.isValidTraceId = s2, t2.isValidSpanId = l2, t2.isSpanContextValid = function(e3) {
            return s2(e3.traceId) && l2(e3.spanId);
          }, t2.wrapSpanContext = function(e3) {
            return new i2.NonRecordingSpan(e3);
          };
        }, 854: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.SpanStatusCode = void 0, (r3 = t2.SpanStatusCode || (t2.SpanStatusCode = {}))[r3.UNSET = 0] = "UNSET", r3[r3.OK = 1] = "OK", r3[r3.ERROR = 2] = "ERROR";
        }, 731: (e2, t2) => {
          var r3;
          Object.defineProperty(t2, "__esModule", { value: true }), t2.TraceFlags = void 0, (r3 = t2.TraceFlags || (t2.TraceFlags = {}))[r3.NONE = 0] = "NONE", r3[r3.SAMPLED = 1] = "SAMPLED";
        }, 652: (e2, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.VERSION = void 0, t2.VERSION = "1.6.0";
        } }, S = {};
        function k(e2) {
          var t2 = S[e2];
          if (void 0 !== t2) return t2.exports;
          var r3 = S[e2] = { exports: {} }, n2 = true;
          try {
            x[e2].call(r3.exports, r3, r3.exports, k), n2 = false;
          } finally {
            n2 && delete S[e2];
          }
          return r3.exports;
        }
        k.ab = "/ROOT/node_modules/next/dist/compiled/@opentelemetry/api/";
        var T = {};
        Object.defineProperty(T, "__esModule", { value: true }), T.trace = T.propagation = T.metrics = T.diag = T.context = T.INVALID_SPAN_CONTEXT = T.INVALID_TRACEID = T.INVALID_SPANID = T.isValidSpanId = T.isValidTraceId = T.isSpanContextValid = T.createTraceState = T.TraceFlags = T.SpanStatusCode = T.SpanKind = T.SamplingDecision = T.ProxyTracerProvider = T.ProxyTracer = T.defaultTextMapSetter = T.defaultTextMapGetter = T.ValueType = T.createNoopMeter = T.DiagLogLevel = T.DiagConsoleLogger = T.ROOT_CONTEXT = T.createContextKey = T.baggageEntryMetadataFromString = void 0, s = k(504), Object.defineProperty(T, "baggageEntryMetadataFromString", { enumerable: true, get: function() {
          return s.baggageEntryMetadataFromString;
        } }), l = k(23), Object.defineProperty(T, "createContextKey", { enumerable: true, get: function() {
          return l.createContextKey;
        } }), Object.defineProperty(T, "ROOT_CONTEXT", { enumerable: true, get: function() {
          return l.ROOT_CONTEXT;
        } }), c = k(83), Object.defineProperty(T, "DiagConsoleLogger", { enumerable: true, get: function() {
          return c.DiagConsoleLogger;
        } }), u = k(711), Object.defineProperty(T, "DiagLogLevel", { enumerable: true, get: function() {
          return u.DiagLogLevel;
        } }), d = k(440), Object.defineProperty(T, "createNoopMeter", { enumerable: true, get: function() {
          return d.createNoopMeter;
        } }), p = k(532), Object.defineProperty(T, "ValueType", { enumerable: true, get: function() {
          return p.ValueType;
        } }), h = k(92), Object.defineProperty(T, "defaultTextMapGetter", { enumerable: true, get: function() {
          return h.defaultTextMapGetter;
        } }), Object.defineProperty(T, "defaultTextMapSetter", { enumerable: true, get: function() {
          return h.defaultTextMapSetter;
        } }), f = k(779), Object.defineProperty(T, "ProxyTracer", { enumerable: true, get: function() {
          return f.ProxyTracer;
        } }), g = k(498), Object.defineProperty(T, "ProxyTracerProvider", { enumerable: true, get: function() {
          return g.ProxyTracerProvider;
        } }), m = k(312), Object.defineProperty(T, "SamplingDecision", { enumerable: true, get: function() {
          return m.SamplingDecision;
        } }), y = k(613), Object.defineProperty(T, "SpanKind", { enumerable: true, get: function() {
          return y.SpanKind;
        } }), b = k(854), Object.defineProperty(T, "SpanStatusCode", { enumerable: true, get: function() {
          return b.SpanStatusCode;
        } }), v = k(731), Object.defineProperty(T, "TraceFlags", { enumerable: true, get: function() {
          return v.TraceFlags;
        } }), w = k(87), Object.defineProperty(T, "createTraceState", { enumerable: true, get: function() {
          return w.createTraceState;
        } }), _ = k(477), Object.defineProperty(T, "isSpanContextValid", { enumerable: true, get: function() {
          return _.isSpanContextValid;
        } }), Object.defineProperty(T, "isValidTraceId", { enumerable: true, get: function() {
          return _.isValidTraceId;
        } }), Object.defineProperty(T, "isValidSpanId", { enumerable: true, get: function() {
          return _.isValidSpanId;
        } }), E = k(546), Object.defineProperty(T, "INVALID_SPANID", { enumerable: true, get: function() {
          return E.INVALID_SPANID;
        } }), Object.defineProperty(T, "INVALID_TRACEID", { enumerable: true, get: function() {
          return E.INVALID_TRACEID;
        } }), Object.defineProperty(T, "INVALID_SPAN_CONTEXT", { enumerable: true, get: function() {
          return E.INVALID_SPAN_CONTEXT;
        } }), r2 = k(778), Object.defineProperty(T, "context", { enumerable: true, get: function() {
          return r2.context;
        } }), n = k(304), Object.defineProperty(T, "diag", { enumerable: true, get: function() {
          return n.diag;
        } }), i = k(120), Object.defineProperty(T, "metrics", { enumerable: true, get: function() {
          return i.metrics;
        } }), a = k(27), Object.defineProperty(T, "propagation", { enumerable: true, get: function() {
          return a.propagation;
        } }), o = k(816), Object.defineProperty(T, "trace", { enumerable: true, get: function() {
          return o.trace;
        } }), T.default = { context: r2.context, diag: n.diag, metrics: i.metrics, propagation: a.propagation, trace: o.trace }, t.exports = T;
      })();
    }, 71498, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/cookie/");
        var e2, r2, n, i, a = {};
        a.parse = function(t2, r3) {
          if ("string" != typeof t2) throw TypeError("argument str must be a string");
          for (var i2 = {}, a2 = t2.split(n), o = (r3 || {}).decode || e2, s = 0; s < a2.length; s++) {
            var l = a2[s], c = l.indexOf("=");
            if (!(c < 0)) {
              var u = l.substr(0, c).trim(), d = l.substr(++c, l.length).trim();
              '"' == d[0] && (d = d.slice(1, -1)), void 0 == i2[u] && (i2[u] = function(e3, t3) {
                try {
                  return t3(e3);
                } catch (t4) {
                  return e3;
                }
              }(d, o));
            }
          }
          return i2;
        }, a.serialize = function(e3, t2, n2) {
          var a2 = n2 || {}, o = a2.encode || r2;
          if ("function" != typeof o) throw TypeError("option encode is invalid");
          if (!i.test(e3)) throw TypeError("argument name is invalid");
          var s = o(t2);
          if (s && !i.test(s)) throw TypeError("argument val is invalid");
          var l = e3 + "=" + s;
          if (null != a2.maxAge) {
            var c = a2.maxAge - 0;
            if (isNaN(c) || !isFinite(c)) throw TypeError("option maxAge is invalid");
            l += "; Max-Age=" + Math.floor(c);
          }
          if (a2.domain) {
            if (!i.test(a2.domain)) throw TypeError("option domain is invalid");
            l += "; Domain=" + a2.domain;
          }
          if (a2.path) {
            if (!i.test(a2.path)) throw TypeError("option path is invalid");
            l += "; Path=" + a2.path;
          }
          if (a2.expires) {
            if ("function" != typeof a2.expires.toUTCString) throw TypeError("option expires is invalid");
            l += "; Expires=" + a2.expires.toUTCString();
          }
          if (a2.httpOnly && (l += "; HttpOnly"), a2.secure && (l += "; Secure"), a2.sameSite) switch ("string" == typeof a2.sameSite ? a2.sameSite.toLowerCase() : a2.sameSite) {
            case true:
            case "strict":
              l += "; SameSite=Strict";
              break;
            case "lax":
              l += "; SameSite=Lax";
              break;
            case "none":
              l += "; SameSite=None";
              break;
            default:
              throw TypeError("option sameSite is invalid");
          }
          return l;
        }, e2 = decodeURIComponent, r2 = encodeURIComponent, n = /; */, i = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/, t.exports = a;
      })();
    }, 99734, (e, t, r) => {
      (() => {
        "use strict";
        let e2, r2, n, i, a;
        var o = { 234: (e3) => {
          var t2 = Object.prototype.hasOwnProperty, r3 = "~";
          function n2() {
          }
          function i2(e4, t3, r4) {
            this.fn = e4, this.context = t3, this.once = r4 || false;
          }
          function a2(e4, t3, n3, a3, o3) {
            if ("function" != typeof n3) throw TypeError("The listener must be a function");
            var s3 = new i2(n3, a3 || e4, o3), l2 = r3 ? r3 + t3 : t3;
            return e4._events[l2] ? e4._events[l2].fn ? e4._events[l2] = [e4._events[l2], s3] : e4._events[l2].push(s3) : (e4._events[l2] = s3, e4._eventsCount++), e4;
          }
          function o2(e4, t3) {
            0 == --e4._eventsCount ? e4._events = new n2() : delete e4._events[t3];
          }
          function s2() {
            this._events = new n2(), this._eventsCount = 0;
          }
          Object.create && (n2.prototype = /* @__PURE__ */ Object.create(null), new n2().__proto__ || (r3 = false)), s2.prototype.eventNames = function() {
            var e4, n3, i3 = [];
            if (0 === this._eventsCount) return i3;
            for (n3 in e4 = this._events) t2.call(e4, n3) && i3.push(r3 ? n3.slice(1) : n3);
            return Object.getOwnPropertySymbols ? i3.concat(Object.getOwnPropertySymbols(e4)) : i3;
          }, s2.prototype.listeners = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            if (!n3) return [];
            if (n3.fn) return [n3.fn];
            for (var i3 = 0, a3 = n3.length, o3 = Array(a3); i3 < a3; i3++) o3[i3] = n3[i3].fn;
            return o3;
          }, s2.prototype.listenerCount = function(e4) {
            var t3 = r3 ? r3 + e4 : e4, n3 = this._events[t3];
            return n3 ? n3.fn ? 1 : n3.length : 0;
          }, s2.prototype.emit = function(e4, t3, n3, i3, a3, o3) {
            var s3 = r3 ? r3 + e4 : e4;
            if (!this._events[s3]) return false;
            var l2, c2, u = this._events[s3], d = arguments.length;
            if (u.fn) {
              switch (u.once && this.removeListener(e4, u.fn, void 0, true), d) {
                case 1:
                  return u.fn.call(u.context), true;
                case 2:
                  return u.fn.call(u.context, t3), true;
                case 3:
                  return u.fn.call(u.context, t3, n3), true;
                case 4:
                  return u.fn.call(u.context, t3, n3, i3), true;
                case 5:
                  return u.fn.call(u.context, t3, n3, i3, a3), true;
                case 6:
                  return u.fn.call(u.context, t3, n3, i3, a3, o3), true;
              }
              for (c2 = 1, l2 = Array(d - 1); c2 < d; c2++) l2[c2 - 1] = arguments[c2];
              u.fn.apply(u.context, l2);
            } else {
              var p, h = u.length;
              for (c2 = 0; c2 < h; c2++) switch (u[c2].once && this.removeListener(e4, u[c2].fn, void 0, true), d) {
                case 1:
                  u[c2].fn.call(u[c2].context);
                  break;
                case 2:
                  u[c2].fn.call(u[c2].context, t3);
                  break;
                case 3:
                  u[c2].fn.call(u[c2].context, t3, n3);
                  break;
                case 4:
                  u[c2].fn.call(u[c2].context, t3, n3, i3);
                  break;
                default:
                  if (!l2) for (p = 1, l2 = Array(d - 1); p < d; p++) l2[p - 1] = arguments[p];
                  u[c2].fn.apply(u[c2].context, l2);
              }
            }
            return true;
          }, s2.prototype.on = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, false);
          }, s2.prototype.once = function(e4, t3, r4) {
            return a2(this, e4, t3, r4, true);
          }, s2.prototype.removeListener = function(e4, t3, n3, i3) {
            var a3 = r3 ? r3 + e4 : e4;
            if (!this._events[a3]) return this;
            if (!t3) return o2(this, a3), this;
            var s3 = this._events[a3];
            if (s3.fn) s3.fn !== t3 || i3 && !s3.once || n3 && s3.context !== n3 || o2(this, a3);
            else {
              for (var l2 = 0, c2 = [], u = s3.length; l2 < u; l2++) (s3[l2].fn !== t3 || i3 && !s3[l2].once || n3 && s3[l2].context !== n3) && c2.push(s3[l2]);
              c2.length ? this._events[a3] = 1 === c2.length ? c2[0] : c2 : o2(this, a3);
            }
            return this;
          }, s2.prototype.removeAllListeners = function(e4) {
            var t3;
            return e4 ? (t3 = r3 ? r3 + e4 : e4, this._events[t3] && o2(this, t3)) : (this._events = new n2(), this._eventsCount = 0), this;
          }, s2.prototype.off = s2.prototype.removeListener, s2.prototype.addListener = s2.prototype.on, s2.prefixed = r3, s2.EventEmitter = s2, e3.exports = s2;
        }, 274: (e3) => {
          e3.exports = (e4, t2) => (t2 = t2 || (() => {
          }), e4.then((e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => e5), (e5) => new Promise((e6) => {
            e6(t2());
          }).then(() => {
            throw e5;
          })));
        }, 294: (e3, t2) => {
          Object.defineProperty(t2, "__esModule", { value: true }), t2.default = function(e4, t3, r3) {
            let n2 = 0, i2 = e4.length;
            for (; i2 > 0; ) {
              let a2 = i2 / 2 | 0, o2 = n2 + a2;
              0 >= r3(e4[o2], t3) ? (n2 = ++o2, i2 -= a2 + 1) : i2 = a2;
            }
            return n2;
          };
        }, 838: (e3, t2, r3) => {
          Object.defineProperty(t2, "__esModule", { value: true });
          let n2 = r3(294);
          t2.default = class {
            constructor() {
              this._queue = [];
            }
            enqueue(e4, t3) {
              let r4 = { priority: (t3 = Object.assign({ priority: 0 }, t3)).priority, run: e4 };
              if (this.size && this._queue[this.size - 1].priority >= t3.priority) return void this._queue.push(r4);
              let i2 = n2.default(this._queue, r4, (e5, t4) => t4.priority - e5.priority);
              this._queue.splice(i2, 0, r4);
            }
            dequeue() {
              let e4 = this._queue.shift();
              return null == e4 ? void 0 : e4.run;
            }
            filter(e4) {
              return this._queue.filter((t3) => t3.priority === e4.priority).map((e5) => e5.run);
            }
            get size() {
              return this._queue.length;
            }
          };
        }, 138: (e3, t2, r3) => {
          let n2 = r3(274);
          class i2 extends Error {
            constructor(e4) {
              super(e4), this.name = "TimeoutError";
            }
          }
          let a2 = (e4, t3, r4) => new Promise((a3, o2) => {
            if ("number" != typeof t3 || t3 < 0) throw TypeError("Expected `milliseconds` to be a positive number");
            if (t3 === 1 / 0) return void a3(e4);
            let s2 = setTimeout(() => {
              if ("function" == typeof r4) {
                try {
                  a3(r4());
                } catch (e5) {
                  o2(e5);
                }
                return;
              }
              let n3 = "string" == typeof r4 ? r4 : `Promise timed out after ${t3} milliseconds`, s3 = r4 instanceof Error ? r4 : new i2(n3);
              "function" == typeof e4.cancel && e4.cancel(), o2(s3);
            }, t3);
            n2(e4.then(a3, o2), () => {
              clearTimeout(s2);
            });
          });
          e3.exports = a2, e3.exports.default = a2, e3.exports.TimeoutError = i2;
        } }, s = {};
        function l(e3) {
          var t2 = s[e3];
          if (void 0 !== t2) return t2.exports;
          var r3 = s[e3] = { exports: {} }, n2 = true;
          try {
            o[e3](r3, r3.exports, l), n2 = false;
          } finally {
            n2 && delete s[e3];
          }
          return r3.exports;
        }
        l.ab = "/ROOT/node_modules/next/dist/compiled/p-queue/";
        var c = {};
        Object.defineProperty(c, "__esModule", { value: true }), e2 = l(234), r2 = l(138), n = l(838), i = () => {
        }, a = new r2.TimeoutError(), c.default = class extends e2 {
          constructor(e3) {
            var t2, r3, a2, o2;
            if (super(), this._intervalCount = 0, this._intervalEnd = 0, this._pendingCount = 0, this._resolveEmpty = i, this._resolveIdle = i, !("number" == typeof (e3 = Object.assign({ carryoverConcurrencyCount: false, intervalCap: 1 / 0, interval: 0, concurrency: 1 / 0, autoStart: true, queueClass: n.default }, e3)).intervalCap && e3.intervalCap >= 1)) throw TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${null != (r3 = null == (t2 = e3.intervalCap) ? void 0 : t2.toString()) ? r3 : ""}\` (${typeof e3.intervalCap})`);
            if (void 0 === e3.interval || !(Number.isFinite(e3.interval) && e3.interval >= 0)) throw TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${null != (o2 = null == (a2 = e3.interval) ? void 0 : a2.toString()) ? o2 : ""}\` (${typeof e3.interval})`);
            this._carryoverConcurrencyCount = e3.carryoverConcurrencyCount, this._isIntervalIgnored = e3.intervalCap === 1 / 0 || 0 === e3.interval, this._intervalCap = e3.intervalCap, this._interval = e3.interval, this._queue = new e3.queueClass(), this._queueClass = e3.queueClass, this.concurrency = e3.concurrency, this._timeout = e3.timeout, this._throwOnTimeout = true === e3.throwOnTimeout, this._isPaused = false === e3.autoStart;
          }
          get _doesIntervalAllowAnother() {
            return this._isIntervalIgnored || this._intervalCount < this._intervalCap;
          }
          get _doesConcurrentAllowAnother() {
            return this._pendingCount < this._concurrency;
          }
          _next() {
            this._pendingCount--, this._tryToStartAnother(), this.emit("next");
          }
          _resolvePromises() {
            this._resolveEmpty(), this._resolveEmpty = i, 0 === this._pendingCount && (this._resolveIdle(), this._resolveIdle = i, this.emit("idle"));
          }
          _onResumeInterval() {
            this._onInterval(), this._initializeIntervalIfNeeded(), this._timeoutId = void 0;
          }
          _isIntervalPaused() {
            let e3 = Date.now();
            if (void 0 === this._intervalId) {
              let t2 = this._intervalEnd - e3;
              if (!(t2 < 0)) return void 0 === this._timeoutId && (this._timeoutId = setTimeout(() => {
                this._onResumeInterval();
              }, t2)), true;
              this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0;
            }
            return false;
          }
          _tryToStartAnother() {
            if (0 === this._queue.size) return this._intervalId && clearInterval(this._intervalId), this._intervalId = void 0, this._resolvePromises(), false;
            if (!this._isPaused) {
              let e3 = !this._isIntervalPaused();
              if (this._doesIntervalAllowAnother && this._doesConcurrentAllowAnother) {
                let t2 = this._queue.dequeue();
                return !!t2 && (this.emit("active"), t2(), e3 && this._initializeIntervalIfNeeded(), true);
              }
            }
            return false;
          }
          _initializeIntervalIfNeeded() {
            this._isIntervalIgnored || void 0 !== this._intervalId || (this._intervalId = setInterval(() => {
              this._onInterval();
            }, this._interval), this._intervalEnd = Date.now() + this._interval);
          }
          _onInterval() {
            0 === this._intervalCount && 0 === this._pendingCount && this._intervalId && (clearInterval(this._intervalId), this._intervalId = void 0), this._intervalCount = this._carryoverConcurrencyCount ? this._pendingCount : 0, this._processQueue();
          }
          _processQueue() {
            for (; this._tryToStartAnother(); ) ;
          }
          get concurrency() {
            return this._concurrency;
          }
          set concurrency(e3) {
            if (!("number" == typeof e3 && e3 >= 1)) throw TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${e3}\` (${typeof e3})`);
            this._concurrency = e3, this._processQueue();
          }
          async add(e3, t2 = {}) {
            return new Promise((n2, i2) => {
              let o2 = async () => {
                this._pendingCount++, this._intervalCount++;
                try {
                  let o3 = void 0 === this._timeout && void 0 === t2.timeout ? e3() : r2.default(Promise.resolve(e3()), void 0 === t2.timeout ? this._timeout : t2.timeout, () => {
                    (void 0 === t2.throwOnTimeout ? this._throwOnTimeout : t2.throwOnTimeout) && i2(a);
                  });
                  n2(await o3);
                } catch (e4) {
                  i2(e4);
                }
                this._next();
              };
              this._queue.enqueue(o2, t2), this._tryToStartAnother(), this.emit("add");
            });
          }
          async addAll(e3, t2) {
            return Promise.all(e3.map(async (e4) => this.add(e4, t2)));
          }
          start() {
            return this._isPaused && (this._isPaused = false, this._processQueue()), this;
          }
          pause() {
            this._isPaused = true;
          }
          clear() {
            this._queue = new this._queueClass();
          }
          async onEmpty() {
            if (0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveEmpty;
              this._resolveEmpty = () => {
                t2(), e3();
              };
            });
          }
          async onIdle() {
            if (0 !== this._pendingCount || 0 !== this._queue.size) return new Promise((e3) => {
              let t2 = this._resolveIdle;
              this._resolveIdle = () => {
                t2(), e3();
              };
            });
          }
          get size() {
            return this._queue.size;
          }
          sizeBy(e3) {
            return this._queue.filter(e3).length;
          }
          get pending() {
            return this._pendingCount;
          }
          get isPaused() {
            return this._isPaused;
          }
          get timeout() {
            return this._timeout;
          }
          set timeout(e3) {
            this._timeout = e3;
          }
        }, t.exports = c;
      })();
    }, 51615, (e, t, r) => {
      t.exports = e.x("node:buffer", () => (init_node_buffer(), __toCommonJS(node_buffer_exports)));
    }, 78500, (e, t, r) => {
      t.exports = e.x("node:async_hooks", () => (init_node_async_hooks(), __toCommonJS(node_async_hooks_exports)));
    }, 25085, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { getTestReqInfo: function() {
        return l;
      }, withRequest: function() {
        return s;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = new (e.r(78500)).AsyncLocalStorage();
      function o(e2, t2) {
        let r2 = t2.header(e2, "next-test-proxy-port");
        if (!r2) return;
        let n2 = t2.url(e2);
        return { url: n2, proxyPort: Number(r2), testData: t2.header(e2, "next-test-data") || "" };
      }
      function s(e2, t2, r2) {
        let n2 = o(e2, t2);
        return n2 ? a.run(n2, r2) : r2();
      }
      function l(e2, t2) {
        let r2 = a.getStore();
        return r2 || (e2 && t2 ? o(e2, t2) : void 0);
      }
    }, 28325, (e, t, r) => {
      "use strict";
      var n = e.i(51615);
      Object.defineProperty(r, "__esModule", { value: true });
      var i = { handleFetch: function() {
        return u;
      }, interceptFetch: function() {
        return d;
      }, reader: function() {
        return s;
      } };
      for (var a in i) Object.defineProperty(r, a, { enumerable: true, get: i[a] });
      let o = e.r(25085), s = { url: (e2) => e2.url, header: (e2, t2) => e2.headers.get(t2) };
      async function l(e2, t2) {
        let { url: r2, method: i2, headers: a2, body: o2, cache: s2, credentials: l2, integrity: c2, mode: u2, redirect: d2, referrer: p, referrerPolicy: h } = t2;
        return { testData: e2, api: "fetch", request: { url: r2, method: i2, headers: [...Array.from(a2), ["next-test-stack", function() {
          let e3 = (Error().stack ?? "").split("\n");
          for (let t3 = 1; t3 < e3.length; t3++) if (e3[t3].length > 0) {
            e3 = e3.slice(t3);
            break;
          }
          return (e3 = (e3 = (e3 = e3.filter((e4) => !e4.includes("/next/dist/"))).slice(0, 5)).map((e4) => e4.replace("webpack-internal:///(rsc)/", "").trim())).join("    ");
        }()]], body: o2 ? n.Buffer.from(await t2.arrayBuffer()).toString("base64") : null, cache: s2, credentials: l2, integrity: c2, mode: u2, redirect: d2, referrer: p, referrerPolicy: h } };
      }
      function c(e2, t2) {
        return t2.headers.set("next-test-internal", "1"), e2(t2);
      }
      async function u(e2, t2) {
        let r2 = (0, o.getTestReqInfo)(t2, s);
        if (!r2) return c(e2, t2);
        let { testData: i2, proxyPort: a2 } = r2, u2 = await l(i2, t2), d2 = await e2(`http://localhost:${a2}`, { method: "POST", body: JSON.stringify(u2), headers: { "next-test-internal": "1" }, next: { internal: true } });
        if (!d2.ok) throw Object.defineProperty(Error(`Proxy request failed: ${d2.status}`), "__NEXT_ERROR_CODE", { value: "E146", enumerable: false, configurable: true });
        let p = await d2.json(), { api: h } = p;
        switch (h) {
          case "continue":
            return c(e2, t2);
          case "abort":
          case "unhandled":
            throw Object.defineProperty(Error(`Proxy request aborted [${t2.method} ${t2.url}]`), "__NEXT_ERROR_CODE", { value: "E145", enumerable: false, configurable: true });
          case "fetch":
            return function(e3) {
              let { status: t3, headers: r3, body: i3 } = e3.response;
              return new Response(i3 ? n.Buffer.from(i3, "base64") : null, { status: t3, headers: new Headers(r3) });
            }(p);
          default:
            return h;
        }
      }
      function d(t2) {
        return e.g.fetch = function(e2, r2) {
          var n2;
          return (null == r2 || null == (n2 = r2.next) ? void 0 : n2.internal) ? t2(e2, r2) : u(t2, new Request(e2, r2));
        }, () => {
          e.g.fetch = t2;
        };
      }
    }, 94165, (e, t, r) => {
      "use strict";
      Object.defineProperty(r, "__esModule", { value: true });
      var n = { interceptTestApis: function() {
        return s;
      }, wrapRequestHandler: function() {
        return l;
      } };
      for (var i in n) Object.defineProperty(r, i, { enumerable: true, get: n[i] });
      let a = e.r(25085), o = e.r(28325);
      function s() {
        return (0, o.interceptFetch)(e.g.fetch);
      }
      function l(e2) {
        return (t2, r2) => (0, a.withRequest)(t2, o.reader, () => e2(t2, r2));
      }
    }, 63398, (e, t, r) => {
      var n = { 226: (e2, t2, r2) => {
        "use strict";
        var n2 = r2(302), i2 = r2(551);
        function a2() {
          this.pending = null, this.pendingTotal = 0, this.blockSize = this.constructor.blockSize, this.outSize = this.constructor.outSize, this.hmacStrength = this.constructor.hmacStrength, this.padLength = this.constructor.padLength / 8, this.endian = "big", this._delta8 = this.blockSize / 8, this._delta32 = this.blockSize / 32;
        }
        t2.BlockHash = a2, a2.prototype.update = function(e3, t3) {
          if (e3 = n2.toArray(e3, t3), this.pending ? this.pending = this.pending.concat(e3) : this.pending = e3, this.pendingTotal += e3.length, this.pending.length >= this._delta8) {
            var r3 = (e3 = this.pending).length % this._delta8;
            this.pending = e3.slice(e3.length - r3, e3.length), 0 === this.pending.length && (this.pending = null), e3 = n2.join32(e3, 0, e3.length - r3, this.endian);
            for (var i3 = 0; i3 < e3.length; i3 += this._delta32) this._update(e3, i3, i3 + this._delta32);
          }
          return this;
        }, a2.prototype.digest = function(e3) {
          return this.update(this._pad()), i2(null === this.pending), this._digest(e3);
        }, a2.prototype._pad = function() {
          var e3 = this.pendingTotal, t3 = this._delta8, r3 = t3 - (e3 + this.padLength) % t3, n3 = Array(r3 + this.padLength);
          n3[0] = 128;
          for (var i3 = 1; i3 < r3; i3++) n3[i3] = 0;
          if (e3 <<= 3, "big" === this.endian) {
            for (var a3 = 8; a3 < this.padLength; a3++) n3[i3++] = 0;
            n3[i3++] = 0, n3[i3++] = 0, n3[i3++] = 0, n3[i3++] = 0, n3[i3++] = e3 >>> 24 & 255, n3[i3++] = e3 >>> 16 & 255, n3[i3++] = e3 >>> 8 & 255, n3[i3++] = 255 & e3;
          } else for (n3[i3++] = 255 & e3, n3[i3++] = e3 >>> 8 & 255, n3[i3++] = e3 >>> 16 & 255, n3[i3++] = e3 >>> 24 & 255, n3[i3++] = 0, n3[i3++] = 0, n3[i3++] = 0, n3[i3++] = 0, a3 = 8; a3 < this.padLength; a3++) n3[i3++] = 0;
          return n3;
        };
      }, 563: (e2, t2, r2) => {
        "use strict";
        var n2 = r2(302), i2 = r2(226), a2 = r2(101), o = r2(551), s = n2.sum32, l = n2.sum32_4, c = n2.sum32_5, u = a2.ch32, d = a2.maj32, p = a2.s0_256, h = a2.s1_256, f = a2.g0_256, g = a2.g1_256, m = i2.BlockHash, y = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];
        function b() {
          if (!(this instanceof b)) return new b();
          m.call(this), this.h = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], this.k = y, this.W = Array(64);
        }
        n2.inherits(b, m), e2.exports = b, b.blockSize = 512, b.outSize = 256, b.hmacStrength = 192, b.padLength = 64, b.prototype._update = function(e3, t3) {
          for (var r3 = this.W, n3 = 0; n3 < 16; n3++) r3[n3] = e3[t3 + n3];
          for (; n3 < r3.length; n3++) r3[n3] = l(g(r3[n3 - 2]), r3[n3 - 7], f(r3[n3 - 15]), r3[n3 - 16]);
          var i3 = this.h[0], a3 = this.h[1], m2 = this.h[2], y2 = this.h[3], b2 = this.h[4], v = this.h[5], w = this.h[6], _ = this.h[7];
          for (o(this.k.length === r3.length), n3 = 0; n3 < r3.length; n3++) {
            var E = c(_, h(b2), u(b2, v, w), this.k[n3], r3[n3]), x = s(p(i3), d(i3, a3, m2));
            _ = w, w = v, v = b2, b2 = s(y2, E), y2 = m2, m2 = a3, a3 = i3, i3 = s(E, x);
          }
          this.h[0] = s(this.h[0], i3), this.h[1] = s(this.h[1], a3), this.h[2] = s(this.h[2], m2), this.h[3] = s(this.h[3], y2), this.h[4] = s(this.h[4], b2), this.h[5] = s(this.h[5], v), this.h[6] = s(this.h[6], w), this.h[7] = s(this.h[7], _);
        }, b.prototype._digest = function(e3) {
          return "hex" === e3 ? n2.toHex32(this.h, "big") : n2.split32(this.h, "big");
        };
      }, 101: (e2, t2, r2) => {
        "use strict";
        var n2 = r2(302).rotr32;
        function i2(e3, t3, r3) {
          return e3 & t3 ^ e3 & r3 ^ t3 & r3;
        }
        t2.ft_1 = function(e3, t3, r3, n3) {
          var a2;
          return 0 === e3 ? (a2 = t3) & r3 ^ ~a2 & n3 : 1 === e3 || 3 === e3 ? t3 ^ r3 ^ n3 : 2 === e3 ? i2(t3, r3, n3) : void 0;
        }, t2.ch32 = function(e3, t3, r3) {
          return e3 & t3 ^ ~e3 & r3;
        }, t2.maj32 = i2, t2.p32 = function(e3, t3, r3) {
          return e3 ^ t3 ^ r3;
        }, t2.s0_256 = function(e3) {
          return n2(e3, 2) ^ n2(e3, 13) ^ n2(e3, 22);
        }, t2.s1_256 = function(e3) {
          return n2(e3, 6) ^ n2(e3, 11) ^ n2(e3, 25);
        }, t2.g0_256 = function(e3) {
          return n2(e3, 7) ^ n2(e3, 18) ^ e3 >>> 3;
        }, t2.g1_256 = function(e3) {
          return n2(e3, 17) ^ n2(e3, 19) ^ e3 >>> 10;
        };
      }, 302: (e2, t2, r2) => {
        "use strict";
        var n2 = r2(551);
        function i2(e3) {
          return (e3 >>> 24 | e3 >>> 8 & 65280 | e3 << 8 & 16711680 | (255 & e3) << 24) >>> 0;
        }
        function a2(e3) {
          return 1 === e3.length ? "0" + e3 : e3;
        }
        function o(e3) {
          if (7 === e3.length) return "0" + e3;
          if (6 === e3.length) return "00" + e3;
          if (5 === e3.length) return "000" + e3;
          if (4 === e3.length) return "0000" + e3;
          if (3 === e3.length) return "00000" + e3;
          else if (2 === e3.length) return "000000" + e3;
          else if (1 === e3.length) return "0000000" + e3;
          else return e3;
        }
        t2.inherits = r2(638), t2.toArray = function(e3, t3) {
          if (Array.isArray(e3)) return e3.slice();
          if (!e3) return [];
          var r3 = [];
          if ("string" == typeof e3) if (t3) {
            if ("hex" === t3) for ((e3 = e3.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 && (e3 = "0" + e3), i3 = 0; i3 < e3.length; i3 += 2) r3.push(parseInt(e3[i3] + e3[i3 + 1], 16));
          } else for (var n3 = 0, i3 = 0; i3 < e3.length; i3++) {
            var a3, o2, s = e3.charCodeAt(i3);
            s < 128 ? r3[n3++] = s : (s < 2048 ? r3[n3++] = s >> 6 | 192 : ((a3 = e3, o2 = i3, (64512 & a3.charCodeAt(o2)) != 55296 || o2 < 0 || o2 + 1 >= a3.length ? 1 : (64512 & a3.charCodeAt(o2 + 1)) != 56320) ? r3[n3++] = s >> 12 | 224 : (s = 65536 + ((1023 & s) << 10) + (1023 & e3.charCodeAt(++i3)), r3[n3++] = s >> 18 | 240, r3[n3++] = s >> 12 & 63 | 128), r3[n3++] = s >> 6 & 63 | 128), r3[n3++] = 63 & s | 128);
          }
          else for (i3 = 0; i3 < e3.length; i3++) r3[i3] = 0 | e3[i3];
          return r3;
        }, t2.toHex = function(e3) {
          for (var t3 = "", r3 = 0; r3 < e3.length; r3++) t3 += a2(e3[r3].toString(16));
          return t3;
        }, t2.htonl = i2, t2.toHex32 = function(e3, t3) {
          for (var r3 = "", n3 = 0; n3 < e3.length; n3++) {
            var a3 = e3[n3];
            "little" === t3 && (a3 = i2(a3)), r3 += o(a3.toString(16));
          }
          return r3;
        }, t2.zero2 = a2, t2.zero8 = o, t2.join32 = function(e3, t3, r3, i3) {
          var a3, o2 = r3 - t3;
          n2(o2 % 4 == 0);
          for (var s = Array(o2 / 4), l = 0, c = t3; l < s.length; l++, c += 4) a3 = "big" === i3 ? e3[c] << 24 | e3[c + 1] << 16 | e3[c + 2] << 8 | e3[c + 3] : e3[c + 3] << 24 | e3[c + 2] << 16 | e3[c + 1] << 8 | e3[c], s[l] = a3 >>> 0;
          return s;
        }, t2.split32 = function(e3, t3) {
          for (var r3 = Array(4 * e3.length), n3 = 0, i3 = 0; n3 < e3.length; n3++, i3 += 4) {
            var a3 = e3[n3];
            "big" === t3 ? (r3[i3] = a3 >>> 24, r3[i3 + 1] = a3 >>> 16 & 255, r3[i3 + 2] = a3 >>> 8 & 255, r3[i3 + 3] = 255 & a3) : (r3[i3 + 3] = a3 >>> 24, r3[i3 + 2] = a3 >>> 16 & 255, r3[i3 + 1] = a3 >>> 8 & 255, r3[i3] = 255 & a3);
          }
          return r3;
        }, t2.rotr32 = function(e3, t3) {
          return e3 >>> t3 | e3 << 32 - t3;
        }, t2.rotl32 = function(e3, t3) {
          return e3 << t3 | e3 >>> 32 - t3;
        }, t2.sum32 = function(e3, t3) {
          return e3 + t3 >>> 0;
        }, t2.sum32_3 = function(e3, t3, r3) {
          return e3 + t3 + r3 >>> 0;
        }, t2.sum32_4 = function(e3, t3, r3, n3) {
          return e3 + t3 + r3 + n3 >>> 0;
        }, t2.sum32_5 = function(e3, t3, r3, n3, i3) {
          return e3 + t3 + r3 + n3 + i3 >>> 0;
        }, t2.sum64 = function(e3, t3, r3, n3) {
          var i3 = e3[t3], a3 = n3 + e3[t3 + 1] >>> 0;
          e3[t3] = +(a3 < n3) + r3 + i3 >>> 0, e3[t3 + 1] = a3;
        }, t2.sum64_hi = function(e3, t3, r3, n3) {
          return +(t3 + n3 >>> 0 < t3) + e3 + r3 >>> 0;
        }, t2.sum64_lo = function(e3, t3, r3, n3) {
          return t3 + n3 >>> 0;
        }, t2.sum64_4_hi = function(e3, t3, r3, n3, i3, a3, o2, s) {
          var l, c = t3;
          return e3 + r3 + i3 + o2 + (l = 0 + +((c = c + n3 >>> 0) < t3) + +((c = c + a3 >>> 0) < a3) + +((c = c + s >>> 0) < s)) >>> 0;
        }, t2.sum64_4_lo = function(e3, t3, r3, n3, i3, a3, o2, s) {
          return t3 + n3 + a3 + s >>> 0;
        }, t2.sum64_5_hi = function(e3, t3, r3, n3, i3, a3, o2, s, l, c) {
          var u, d = t3;
          return e3 + r3 + i3 + o2 + l + (u = 0 + +((d = d + n3 >>> 0) < t3) + +((d = d + a3 >>> 0) < a3) + +((d = d + s >>> 0) < s) + +((d = d + c >>> 0) < c)) >>> 0;
        }, t2.sum64_5_lo = function(e3, t3, r3, n3, i3, a3, o2, s, l, c) {
          return t3 + n3 + a3 + s + c >>> 0;
        }, t2.rotr64_hi = function(e3, t3, r3) {
          return (t3 << 32 - r3 | e3 >>> r3) >>> 0;
        }, t2.rotr64_lo = function(e3, t3, r3) {
          return (e3 << 32 - r3 | t3 >>> r3) >>> 0;
        }, t2.shr64_hi = function(e3, t3, r3) {
          return e3 >>> r3;
        }, t2.shr64_lo = function(e3, t3, r3) {
          return (e3 << 32 - r3 | t3 >>> r3) >>> 0;
        };
      }, 638: (e2) => {
        "function" == typeof Object.create ? e2.exports = function(e3, t2) {
          t2 && (e3.super_ = t2, e3.prototype = Object.create(t2.prototype, { constructor: { value: e3, enumerable: false, writable: true, configurable: true } }));
        } : e2.exports = function(e3, t2) {
          if (t2) {
            e3.super_ = t2;
            var r2 = function() {
            };
            r2.prototype = t2.prototype, e3.prototype = new r2(), e3.prototype.constructor = e3;
          }
        };
      }, 551: (e2) => {
        function t2(e3, t3) {
          if (!e3) throw Error(t3 || "Assertion failed");
        }
        e2.exports = t2, t2.equal = function(e3, t3, r2) {
          if (e3 != t3) throw Error(r2 || "Assertion failed: " + e3 + " != " + t3);
        };
      } }, i = {};
      function a(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, o = true;
        try {
          n[e2](r2, r2.exports, a), o = false;
        } finally {
          o && delete i[e2];
        }
        return r2.exports;
      }
      a.ab = "/ROOT/node_modules/next/dist/compiled/hash.js/sha256/", t.exports = a(563);
    }, 54846, (e, t, r) => {
      !function() {
        "use strict";
        var e2 = { 431: function(e3) {
          function t2(e4) {
            if ("string" != typeof e4) throw TypeError("Path must be a string. Received " + JSON.stringify(e4));
          }
          function r3(e4, t3) {
            for (var r4, n3 = "", i = 0, a = -1, o = 0, s = 0; s <= e4.length; ++s) {
              if (s < e4.length) r4 = e4.charCodeAt(s);
              else if (47 === r4) break;
              else r4 = 47;
              if (47 === r4) {
                if (a === s - 1 || 1 === o) ;
                else if (a !== s - 1 && 2 === o) {
                  if (n3.length < 2 || 2 !== i || 46 !== n3.charCodeAt(n3.length - 1) || 46 !== n3.charCodeAt(n3.length - 2)) {
                    if (n3.length > 2) {
                      var l = n3.lastIndexOf("/");
                      if (l !== n3.length - 1) {
                        -1 === l ? (n3 = "", i = 0) : i = (n3 = n3.slice(0, l)).length - 1 - n3.lastIndexOf("/"), a = s, o = 0;
                        continue;
                      }
                    } else if (2 === n3.length || 1 === n3.length) {
                      n3 = "", i = 0, a = s, o = 0;
                      continue;
                    }
                  }
                  t3 && (n3.length > 0 ? n3 += "/.." : n3 = "..", i = 2);
                } else n3.length > 0 ? n3 += "/" + e4.slice(a + 1, s) : n3 = e4.slice(a + 1, s), i = s - a - 1;
                a = s, o = 0;
              } else 46 === r4 && -1 !== o ? ++o : o = -1;
            }
            return n3;
          }
          var n2 = { resolve: function() {
            for (var e4, n3, i = "", a = false, o = arguments.length - 1; o >= -1 && !a; o--) o >= 0 ? n3 = arguments[o] : (void 0 === e4 && (e4 = ""), n3 = e4), t2(n3), 0 !== n3.length && (i = n3 + "/" + i, a = 47 === n3.charCodeAt(0));
            if (i = r3(i, !a), a) if (i.length > 0) return "/" + i;
            else return "/";
            return i.length > 0 ? i : ".";
          }, normalize: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            var n3 = 47 === e4.charCodeAt(0), i = 47 === e4.charCodeAt(e4.length - 1);
            return (0 !== (e4 = r3(e4, !n3)).length || n3 || (e4 = "."), e4.length > 0 && i && (e4 += "/"), n3) ? "/" + e4 : e4;
          }, isAbsolute: function(e4) {
            return t2(e4), e4.length > 0 && 47 === e4.charCodeAt(0);
          }, join: function() {
            if (0 == arguments.length) return ".";
            for (var e4, r4 = 0; r4 < arguments.length; ++r4) {
              var i = arguments[r4];
              t2(i), i.length > 0 && (void 0 === e4 ? e4 = i : e4 += "/" + i);
            }
            return void 0 === e4 ? "." : n2.normalize(e4);
          }, relative: function(e4, r4) {
            if (t2(e4), t2(r4), e4 === r4 || (e4 = n2.resolve(e4)) === (r4 = n2.resolve(r4))) return "";
            for (var i = 1; i < e4.length && 47 === e4.charCodeAt(i); ++i) ;
            for (var a = e4.length, o = a - i, s = 1; s < r4.length && 47 === r4.charCodeAt(s); ++s) ;
            for (var l = r4.length - s, c = o < l ? o : l, u = -1, d = 0; d <= c; ++d) {
              if (d === c) {
                if (l > c) {
                  if (47 === r4.charCodeAt(s + d)) return r4.slice(s + d + 1);
                  else if (0 === d) return r4.slice(s + d);
                } else o > c && (47 === e4.charCodeAt(i + d) ? u = d : 0 === d && (u = 0));
                break;
              }
              var p = e4.charCodeAt(i + d);
              if (p !== r4.charCodeAt(s + d)) break;
              47 === p && (u = d);
            }
            var h = "";
            for (d = i + u + 1; d <= a; ++d) (d === a || 47 === e4.charCodeAt(d)) && (0 === h.length ? h += ".." : h += "/..");
            return h.length > 0 ? h + r4.slice(s + u) : (s += u, 47 === r4.charCodeAt(s) && ++s, r4.slice(s));
          }, _makeLong: function(e4) {
            return e4;
          }, dirname: function(e4) {
            if (t2(e4), 0 === e4.length) return ".";
            for (var r4 = e4.charCodeAt(0), n3 = 47 === r4, i = -1, a = true, o = e4.length - 1; o >= 1; --o) if (47 === (r4 = e4.charCodeAt(o))) {
              if (!a) {
                i = o;
                break;
              }
            } else a = false;
            return -1 === i ? n3 ? "/" : "." : n3 && 1 === i ? "//" : e4.slice(0, i);
          }, basename: function(e4, r4) {
            if (void 0 !== r4 && "string" != typeof r4) throw TypeError('"ext" argument must be a string');
            t2(e4);
            var n3, i = 0, a = -1, o = true;
            if (void 0 !== r4 && r4.length > 0 && r4.length <= e4.length) {
              if (r4.length === e4.length && r4 === e4) return "";
              var s = r4.length - 1, l = -1;
              for (n3 = e4.length - 1; n3 >= 0; --n3) {
                var c = e4.charCodeAt(n3);
                if (47 === c) {
                  if (!o) {
                    i = n3 + 1;
                    break;
                  }
                } else -1 === l && (o = false, l = n3 + 1), s >= 0 && (c === r4.charCodeAt(s) ? -1 == --s && (a = n3) : (s = -1, a = l));
              }
              return i === a ? a = l : -1 === a && (a = e4.length), e4.slice(i, a);
            }
            for (n3 = e4.length - 1; n3 >= 0; --n3) if (47 === e4.charCodeAt(n3)) {
              if (!o) {
                i = n3 + 1;
                break;
              }
            } else -1 === a && (o = false, a = n3 + 1);
            return -1 === a ? "" : e4.slice(i, a);
          }, extname: function(e4) {
            t2(e4);
            for (var r4 = -1, n3 = 0, i = -1, a = true, o = 0, s = e4.length - 1; s >= 0; --s) {
              var l = e4.charCodeAt(s);
              if (47 === l) {
                if (!a) {
                  n3 = s + 1;
                  break;
                }
                continue;
              }
              -1 === i && (a = false, i = s + 1), 46 === l ? -1 === r4 ? r4 = s : 1 !== o && (o = 1) : -1 !== r4 && (o = -1);
            }
            return -1 === r4 || -1 === i || 0 === o || 1 === o && r4 === i - 1 && r4 === n3 + 1 ? "" : e4.slice(r4, i);
          }, format: function(e4) {
            var t3, r4;
            if (null === e4 || "object" != typeof e4) throw TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e4);
            return t3 = e4.dir || e4.root, r4 = e4.base || (e4.name || "") + (e4.ext || ""), t3 ? t3 === e4.root ? t3 + r4 : t3 + "/" + r4 : r4;
          }, parse: function(e4) {
            t2(e4);
            var r4, n3 = { root: "", dir: "", base: "", ext: "", name: "" };
            if (0 === e4.length) return n3;
            var i = e4.charCodeAt(0), a = 47 === i;
            a ? (n3.root = "/", r4 = 1) : r4 = 0;
            for (var o = -1, s = 0, l = -1, c = true, u = e4.length - 1, d = 0; u >= r4; --u) {
              if (47 === (i = e4.charCodeAt(u))) {
                if (!c) {
                  s = u + 1;
                  break;
                }
                continue;
              }
              -1 === l && (c = false, l = u + 1), 46 === i ? -1 === o ? o = u : 1 !== d && (d = 1) : -1 !== o && (d = -1);
            }
            return -1 === o || -1 === l || 0 === d || 1 === d && o === l - 1 && o === s + 1 ? -1 !== l && (0 === s && a ? n3.base = n3.name = e4.slice(1, l) : n3.base = n3.name = e4.slice(s, l)) : (0 === s && a ? (n3.name = e4.slice(1, o), n3.base = e4.slice(1, l)) : (n3.name = e4.slice(s, o), n3.base = e4.slice(s, l)), n3.ext = e4.slice(o, l)), s > 0 ? n3.dir = e4.slice(0, s - 1) : a && (n3.dir = "/"), n3;
          }, sep: "/", delimiter: ":", win32: null, posix: null };
          n2.posix = n2, e3.exports = n2;
        } }, r2 = {};
        function n(t2) {
          var i = r2[t2];
          if (void 0 !== i) return i.exports;
          var a = r2[t2] = { exports: {} }, o = true;
          try {
            e2[t2](a, a.exports, n), o = false;
          } finally {
            o && delete r2[t2];
          }
          return a.exports;
        }
        n.ab = "/ROOT/node_modules/next/dist/compiled/path-browserify/", t.exports = n(431);
      }();
    }, 68886, (e, t, r) => {
      t.exports = e.r(54846);
    }, 67914, (e, t, r) => {
      (() => {
        "use strict";
        "u" > typeof __nccwpck_require__ && (__nccwpck_require__.ab = "/ROOT/node_modules/next/dist/compiled/path-to-regexp/");
        var e2 = {};
        (() => {
          function t2(e3, t3) {
            void 0 === t3 && (t3 = {});
            for (var r3 = function(e4) {
              for (var t4 = [], r4 = 0; r4 < e4.length; ) {
                var n3 = e4[r4];
                if ("*" === n3 || "+" === n3 || "?" === n3) {
                  t4.push({ type: "MODIFIER", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("\\" === n3) {
                  t4.push({ type: "ESCAPED_CHAR", index: r4++, value: e4[r4++] });
                  continue;
                }
                if ("{" === n3) {
                  t4.push({ type: "OPEN", index: r4, value: e4[r4++] });
                  continue;
                }
                if ("}" === n3) {
                  t4.push({ type: "CLOSE", index: r4, value: e4[r4++] });
                  continue;
                }
                if (":" === n3) {
                  for (var i2 = "", a3 = r4 + 1; a3 < e4.length; ) {
                    var o3 = e4.charCodeAt(a3);
                    if (o3 >= 48 && o3 <= 57 || o3 >= 65 && o3 <= 90 || o3 >= 97 && o3 <= 122 || 95 === o3) {
                      i2 += e4[a3++];
                      continue;
                    }
                    break;
                  }
                  if (!i2) throw TypeError("Missing parameter name at ".concat(r4));
                  t4.push({ type: "NAME", index: r4, value: i2 }), r4 = a3;
                  continue;
                }
                if ("(" === n3) {
                  var s3 = 1, l2 = "", a3 = r4 + 1;
                  if ("?" === e4[a3]) throw TypeError('Pattern cannot start with "?" at '.concat(a3));
                  for (; a3 < e4.length; ) {
                    if ("\\" === e4[a3]) {
                      l2 += e4[a3++] + e4[a3++];
                      continue;
                    }
                    if (")" === e4[a3]) {
                      if (0 == --s3) {
                        a3++;
                        break;
                      }
                    } else if ("(" === e4[a3] && (s3++, "?" !== e4[a3 + 1])) throw TypeError("Capturing groups are not allowed at ".concat(a3));
                    l2 += e4[a3++];
                  }
                  if (s3) throw TypeError("Unbalanced pattern at ".concat(r4));
                  if (!l2) throw TypeError("Missing pattern at ".concat(r4));
                  t4.push({ type: "PATTERN", index: r4, value: l2 }), r4 = a3;
                  continue;
                }
                t4.push({ type: "CHAR", index: r4, value: e4[r4++] });
              }
              return t4.push({ type: "END", index: r4, value: "" }), t4;
            }(e3), n2 = t3.prefixes, a2 = void 0 === n2 ? "./" : n2, o2 = t3.delimiter, s2 = void 0 === o2 ? "/#?" : o2, l = [], c = 0, u = 0, d = "", p = function(e4) {
              if (u < r3.length && r3[u].type === e4) return r3[u++].value;
            }, h = function(e4) {
              var t4 = p(e4);
              if (void 0 !== t4) return t4;
              var n3 = r3[u], i2 = n3.type, a3 = n3.index;
              throw TypeError("Unexpected ".concat(i2, " at ").concat(a3, ", expected ").concat(e4));
            }, f = function() {
              for (var e4, t4 = ""; e4 = p("CHAR") || p("ESCAPED_CHAR"); ) t4 += e4;
              return t4;
            }, g = function(e4) {
              for (var t4 = 0; t4 < s2.length; t4++) {
                var r4 = s2[t4];
                if (e4.indexOf(r4) > -1) return true;
              }
              return false;
            }, m = function(e4) {
              var t4 = l[l.length - 1], r4 = e4 || (t4 && "string" == typeof t4 ? t4 : "");
              if (t4 && !r4) throw TypeError('Must have text between two parameters, missing text after "'.concat(t4.name, '"'));
              return !r4 || g(r4) ? "[^".concat(i(s2), "]+?") : "(?:(?!".concat(i(r4), ")[^").concat(i(s2), "])+?");
            }; u < r3.length; ) {
              var y = p("CHAR"), b = p("NAME"), v = p("PATTERN");
              if (b || v) {
                var w = y || "";
                -1 === a2.indexOf(w) && (d += w, w = ""), d && (l.push(d), d = ""), l.push({ name: b || c++, prefix: w, suffix: "", pattern: v || m(w), modifier: p("MODIFIER") || "" });
                continue;
              }
              var _ = y || p("ESCAPED_CHAR");
              if (_) {
                d += _;
                continue;
              }
              if (d && (l.push(d), d = ""), p("OPEN")) {
                var w = f(), E = p("NAME") || "", x = p("PATTERN") || "", S = f();
                h("CLOSE"), l.push({ name: E || (x ? c++ : ""), pattern: E && !x ? m(w) : x, prefix: w, suffix: S, modifier: p("MODIFIER") || "" });
                continue;
              }
              h("END");
            }
            return l;
          }
          function r2(e3, t3) {
            void 0 === t3 && (t3 = {});
            var r3 = a(t3), n2 = t3.encode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2, o2 = t3.validate, s2 = void 0 === o2 || o2, l = e3.map(function(e4) {
              if ("object" == typeof e4) return new RegExp("^(?:".concat(e4.pattern, ")$"), r3);
            });
            return function(t4) {
              for (var r4 = "", n3 = 0; n3 < e3.length; n3++) {
                var a2 = e3[n3];
                if ("string" == typeof a2) {
                  r4 += a2;
                  continue;
                }
                var o3 = t4 ? t4[a2.name] : void 0, c = "?" === a2.modifier || "*" === a2.modifier, u = "*" === a2.modifier || "+" === a2.modifier;
                if (Array.isArray(o3)) {
                  if (!u) throw TypeError('Expected "'.concat(a2.name, '" to not repeat, but got an array'));
                  if (0 === o3.length) {
                    if (c) continue;
                    throw TypeError('Expected "'.concat(a2.name, '" to not be empty'));
                  }
                  for (var d = 0; d < o3.length; d++) {
                    var p = i2(o3[d], a2);
                    if (s2 && !l[n3].test(p)) throw TypeError('Expected all "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(p, '"'));
                    r4 += a2.prefix + p + a2.suffix;
                  }
                  continue;
                }
                if ("string" == typeof o3 || "number" == typeof o3) {
                  var p = i2(String(o3), a2);
                  if (s2 && !l[n3].test(p)) throw TypeError('Expected "'.concat(a2.name, '" to match "').concat(a2.pattern, '", but got "').concat(p, '"'));
                  r4 += a2.prefix + p + a2.suffix;
                  continue;
                }
                if (!c) {
                  var h = u ? "an array" : "a string";
                  throw TypeError('Expected "'.concat(a2.name, '" to be ').concat(h));
                }
              }
              return r4;
            };
          }
          function n(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            var n2 = r3.decode, i2 = void 0 === n2 ? function(e4) {
              return e4;
            } : n2;
            return function(r4) {
              var n3 = e3.exec(r4);
              if (!n3) return false;
              for (var a2 = n3[0], o2 = n3.index, s2 = /* @__PURE__ */ Object.create(null), l = 1; l < n3.length; l++) !function(e4) {
                if (void 0 !== n3[e4]) {
                  var r5 = t3[e4 - 1];
                  "*" === r5.modifier || "+" === r5.modifier ? s2[r5.name] = n3[e4].split(r5.prefix + r5.suffix).map(function(e5) {
                    return i2(e5, r5);
                  }) : s2[r5.name] = i2(n3[e4], r5);
                }
              }(l);
              return { path: a2, index: o2, params: s2 };
            };
          }
          function i(e3) {
            return e3.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
          }
          function a(e3) {
            return e3 && e3.sensitive ? "" : "i";
          }
          function o(e3, t3, r3) {
            void 0 === r3 && (r3 = {});
            for (var n2 = r3.strict, o2 = void 0 !== n2 && n2, s2 = r3.start, l = r3.end, c = r3.encode, u = void 0 === c ? function(e4) {
              return e4;
            } : c, d = r3.delimiter, p = r3.endsWith, h = "[".concat(i(void 0 === p ? "" : p), "]|$"), f = "[".concat(i(void 0 === d ? "/#?" : d), "]"), g = void 0 === s2 || s2 ? "^" : "", m = 0; m < e3.length; m++) {
              var y = e3[m];
              if ("string" == typeof y) g += i(u(y));
              else {
                var b = i(u(y.prefix)), v = i(u(y.suffix));
                if (y.pattern) if (t3 && t3.push(y), b || v) if ("+" === y.modifier || "*" === y.modifier) {
                  var w = "*" === y.modifier ? "?" : "";
                  g += "(?:".concat(b, "((?:").concat(y.pattern, ")(?:").concat(v).concat(b, "(?:").concat(y.pattern, "))*)").concat(v, ")").concat(w);
                } else g += "(?:".concat(b, "(").concat(y.pattern, ")").concat(v, ")").concat(y.modifier);
                else {
                  if ("+" === y.modifier || "*" === y.modifier) throw TypeError('Can not repeat "'.concat(y.name, '" without a prefix and suffix'));
                  g += "(".concat(y.pattern, ")").concat(y.modifier);
                }
                else g += "(?:".concat(b).concat(v, ")").concat(y.modifier);
              }
            }
            if (void 0 === l || l) o2 || (g += "".concat(f, "?")), g += r3.endsWith ? "(?=".concat(h, ")") : "$";
            else {
              var _ = e3[e3.length - 1], E = "string" == typeof _ ? f.indexOf(_[_.length - 1]) > -1 : void 0 === _;
              o2 || (g += "(?:".concat(f, "(?=").concat(h, "))?")), E || (g += "(?=".concat(f, "|").concat(h, ")"));
            }
            return new RegExp(g, a(r3));
          }
          function s(e3, r3, n2) {
            if (e3 instanceof RegExp) {
              var i2;
              if (!r3) return e3;
              for (var l = /\((?:\?<(.*?)>)?(?!\?)/g, c = 0, u = l.exec(e3.source); u; ) r3.push({ name: u[1] || c++, prefix: "", suffix: "", modifier: "", pattern: "" }), u = l.exec(e3.source);
              return e3;
            }
            return Array.isArray(e3) ? (i2 = e3.map(function(e4) {
              return s(e4, r3, n2).source;
            }), new RegExp("(?:".concat(i2.join("|"), ")"), a(n2))) : o(t2(e3, n2), r3, n2);
          }
          Object.defineProperty(e2, "__esModule", { value: true }), e2.pathToRegexp = e2.tokensToRegexp = e2.regexpToFunction = e2.match = e2.tokensToFunction = e2.compile = e2.parse = void 0, e2.parse = t2, e2.compile = function(e3, n2) {
            return r2(t2(e3, n2), n2);
          }, e2.tokensToFunction = r2, e2.match = function(e3, t3) {
            var r3 = [];
            return n(s(e3, r3, t3), r3, t3);
          }, e2.regexpToFunction = n, e2.tokensToRegexp = o, e2.pathToRegexp = s;
        })(), t.exports = e2;
      })();
    }, 64445, (e, t, r) => {
      var n = { 943: function(t2, r2) {
        !function(n2) {
          "use strict";
          var i2 = "function", a2 = "undefined", o = "object", s = "string", l = "major", c = "model", u = "name", d = "type", p = "vendor", h = "version", f = "architecture", g = "console", m = "mobile", y = "tablet", b = "smarttv", v = "wearable", w = "embedded", _ = "Amazon", E = "Apple", x = "ASUS", S = "BlackBerry", k = "Browser", T = "Chrome", R = "Firefox", P = "Google", C = "Huawei", A = "Microsoft", O = "Motorola", I = "Opera", N = "Samsung", U = "Sharp", j = "Sony", $ = "Xiaomi", D = "Zebra", L = "Facebook", M = "Chromium OS", H = "Mac OS", W = function(e2, t3) {
            var r3 = {};
            for (var n3 in e2) t3[n3] && t3[n3].length % 2 == 0 ? r3[n3] = t3[n3].concat(e2[n3]) : r3[n3] = e2[n3];
            return r3;
          }, B = function(e2) {
            for (var t3 = {}, r3 = 0; r3 < e2.length; r3++) t3[e2[r3].toUpperCase()] = e2[r3];
            return t3;
          }, q = function(e2, t3) {
            return typeof e2 === s && -1 !== z(t3).indexOf(z(e2));
          }, z = function(e2) {
            return e2.toLowerCase();
          }, F = function(e2, t3) {
            if (typeof e2 === s) return e2 = e2.replace(/^\s\s*/, ""), typeof t3 === a2 ? e2 : e2.substring(0, 350);
          }, K = function(e2, t3) {
            for (var r3, n3, a3, s2, l2, c2, u2 = 0; u2 < t3.length && !l2; ) {
              var d2 = t3[u2], p2 = t3[u2 + 1];
              for (r3 = n3 = 0; r3 < d2.length && !l2 && d2[r3]; ) if (l2 = d2[r3++].exec(e2)) for (a3 = 0; a3 < p2.length; a3++) c2 = l2[++n3], typeof (s2 = p2[a3]) === o && s2.length > 0 ? 2 === s2.length ? typeof s2[1] == i2 ? this[s2[0]] = s2[1].call(this, c2) : this[s2[0]] = s2[1] : 3 === s2.length ? typeof s2[1] !== i2 || s2[1].exec && s2[1].test ? this[s2[0]] = c2 ? c2.replace(s2[1], s2[2]) : void 0 : this[s2[0]] = c2 ? s2[1].call(this, c2, s2[2]) : void 0 : 4 === s2.length && (this[s2[0]] = c2 ? s2[3].call(this, c2.replace(s2[1], s2[2])) : void 0) : this[s2] = c2 || void 0;
              u2 += 2;
            }
          }, V = function(e2, t3) {
            for (var r3 in t3) if (typeof t3[r3] === o && t3[r3].length > 0) {
              for (var n3 = 0; n3 < t3[r3].length; n3++) if (q(t3[r3][n3], e2)) return "?" === r3 ? void 0 : r3;
            } else if (q(t3[r3], e2)) return "?" === r3 ? void 0 : r3;
            return e2;
          }, J = { ME: "4.90", "NT 3.11": "NT3.51", "NT 4.0": "NT4.0", 2e3: "NT 5.0", XP: ["NT 5.1", "NT 5.2"], Vista: "NT 6.0", 7: "NT 6.1", 8: "NT 6.2", 8.1: "NT 6.3", 10: ["NT 6.4", "NT 10.0"], RT: "ARM" }, G = { browser: [[/\b(?:crmo|crios)\/([\w\.]+)/i], [h, [u, "Chrome"]], [/edg(?:e|ios|a)?\/([\w\.]+)/i], [h, [u, "Edge"]], [/(opera mini)\/([-\w\.]+)/i, /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i, /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i], [u, h], [/opios[\/ ]+([\w\.]+)/i], [h, [u, I + " Mini"]], [/\bopr\/([\w\.]+)/i], [h, [u, I]], [/(kindle)\/([\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i, /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i, /(ba?idubrowser)[\/ ]?([\w\.]+)/i, /(?:ms|\()(ie) ([\w\.]+)/i, /(flock|rockmelt|midori|epiphany|silk|skyfire|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale(?!.+naver)|qqbrowserlite|qq|duckduckgo)\/([-\w\.]+)/i, /(heytap|ovi)browser\/([\d\.]+)/i, /(weibo)__([\d\.]+)/i], [u, h], [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i], [h, [u, "UC" + k]], [/microm.+\bqbcore\/([\w\.]+)/i, /\bqbcore\/([\w\.]+).+microm/i], [h, [u, "WeChat(Win) Desktop"]], [/micromessenger\/([\w\.]+)/i], [h, [u, "WeChat"]], [/konqueror\/([\w\.]+)/i], [h, [u, "Konqueror"]], [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i], [h, [u, "IE"]], [/ya(?:search)?browser\/([\w\.]+)/i], [h, [u, "Yandex"]], [/(avast|avg)\/([\w\.]+)/i], [[u, /(.+)/, "$1 Secure " + k], h], [/\bfocus\/([\w\.]+)/i], [h, [u, R + " Focus"]], [/\bopt\/([\w\.]+)/i], [h, [u, I + " Touch"]], [/coc_coc\w+\/([\w\.]+)/i], [h, [u, "Coc Coc"]], [/dolfin\/([\w\.]+)/i], [h, [u, "Dolphin"]], [/coast\/([\w\.]+)/i], [h, [u, I + " Coast"]], [/miuibrowser\/([\w\.]+)/i], [h, [u, "MIUI " + k]], [/fxios\/([-\w\.]+)/i], [h, [u, R]], [/\bqihu|(qi?ho?o?|360)browser/i], [[u, "360 " + k]], [/(oculus|samsung|sailfish|huawei)browser\/([\w\.]+)/i], [[u, /(.+)/, "$1 " + k], h], [/(comodo_dragon)\/([\w\.]+)/i], [[u, /_/g, " "], h], [/(electron)\/([\w\.]+) safari/i, /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i, /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i], [u, h], [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i, /\[(linkedin)app\]/i], [u], [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i], [[u, L], h], [/(kakao(?:talk|story))[\/ ]([\w\.]+)/i, /(naver)\(.*?(\d+\.[\w\.]+).*\)/i, /safari (line)\/([\w\.]+)/i, /\b(line)\/([\w\.]+)\/iab/i, /(chromium|instagram)[\/ ]([-\w\.]+)/i], [u, h], [/\bgsa\/([\w\.]+) .*safari\//i], [h, [u, "GSA"]], [/musical_ly(?:.+app_?version\/|_)([\w\.]+)/i], [h, [u, "TikTok"]], [/headlesschrome(?:\/([\w\.]+)| )/i], [h, [u, T + " Headless"]], [/ wv\).+(chrome)\/([\w\.]+)/i], [[u, T + " WebView"], h], [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i], [h, [u, "Android " + k]], [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i], [u, h], [/version\/([\w\.\,]+) .*mobile\/\w+ (safari)/i], [h, [u, "Mobile Safari"]], [/version\/([\w(\.|\,)]+) .*(mobile ?safari|safari)/i], [h, u], [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i], [u, [h, V, { "1.0": "/8", 1.2: "/1", 1.3: "/3", "2.0": "/412", "2.0.2": "/416", "2.0.3": "/417", "2.0.4": "/419", "?": "/" }]], [/(webkit|khtml)\/([\w\.]+)/i], [u, h], [/(navigator|netscape\d?)\/([-\w\.]+)/i], [[u, "Netscape"], h], [/mobile vr; rv:([\w\.]+)\).+firefox/i], [h, [u, R + " Reality"]], [/ekiohf.+(flow)\/([\w\.]+)/i, /(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i, /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i, /(firefox)\/([\w\.]+)/i, /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i, /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i, /(links) \(([\w\.]+)/i, /panasonic;(viera)/i], [u, h], [/(cobalt)\/([\w\.]+)/i], [u, [h, /master.|lts./, ""]]], cpu: [[/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i], [[f, "amd64"]], [/(ia32(?=;))/i], [[f, z]], [/((?:i[346]|x)86)[;\)]/i], [[f, "ia32"]], [/\b(aarch64|arm(v?8e?l?|_?64))\b/i], [[f, "arm64"]], [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i], [[f, "armhf"]], [/windows (ce|mobile); ppc;/i], [[f, "arm"]], [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i], [[f, /ower/, "", z]], [/(sun4\w)[;\)]/i], [[f, "sparc"]], [/((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i], [[f, z]]], device: [[/\b(sch-i[89]0\d|shw-m380s|sm-[ptx]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i], [c, [p, N], [d, y]], [/\b((?:s[cgp]h|gt|sm)-\w+|sc[g-]?[\d]+a?|galaxy nexus)/i, /samsung[- ]([-\w]+)/i, /sec-(sgh\w+)/i], [c, [p, N], [d, m]], [/(?:\/|\()(ip(?:hone|od)[\w, ]*)(?:\/|;)/i], [c, [p, E], [d, m]], [/\((ipad);[-\w\),; ]+apple/i, /applecoremedia\/[\w\.]+ \((ipad)/i, /\b(ipad)\d\d?,\d\d?[;\]].+ios/i], [c, [p, E], [d, y]], [/(macintosh);/i], [c, [p, E]], [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i], [c, [p, U], [d, m]], [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i], [c, [p, C], [d, y]], [/(?:huawei|honor)([-\w ]+)[;\)]/i, /\b(nexus 6p|\w{2,4}e?-[atu]?[ln][\dx][012359c][adn]?)\b(?!.+d\/s)/i], [c, [p, C], [d, m]], [/\b(poco[\w ]+)(?: bui|\))/i, /\b; (\w+) build\/hm\1/i, /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i, /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i, /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max|cc)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i], [[c, /_/g, " "], [p, $], [d, m]], [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i], [[c, /_/g, " "], [p, $], [d, y]], [/; (\w+) bui.+ oppo/i, /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i], [c, [p, "OPPO"], [d, m]], [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i], [c, [p, "Vivo"], [d, m]], [/\b(rmx[12]\d{3})(?: bui|;|\))/i], [c, [p, "Realme"], [d, m]], [/\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i, /\bmot(?:orola)?[- ](\w*)/i, /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i], [c, [p, O], [d, m]], [/\b(mz60\d|xoom[2 ]{0,2}) build\//i], [c, [p, O], [d, y]], [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i], [c, [p, "LG"], [d, y]], [/(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i, /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i, /\blg-?([\d\w]+) bui/i], [c, [p, "LG"], [d, m]], [/(ideatab[-\w ]+)/i, /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i], [c, [p, "Lenovo"], [d, y]], [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i], [[c, /_/g, " "], [p, "Nokia"], [d, m]], [/(pixel c)\b/i], [c, [p, P], [d, y]], [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i], [c, [p, P], [d, m]], [/droid.+ (a?\d[0-2]{2}so|[c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i], [c, [p, j], [d, m]], [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i], [[c, "Xperia Tablet"], [p, j], [d, y]], [/ (kb2005|in20[12]5|be20[12][59])\b/i, /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i], [c, [p, "OnePlus"], [d, m]], [/(alexa)webm/i, /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i, /(kf[a-z]+)( bui|\)).+silk\//i], [c, [p, _], [d, y]], [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i], [[c, /(.+)/g, "Fire Phone $1"], [p, _], [d, m]], [/(playbook);[-\w\),; ]+(rim)/i], [c, p, [d, y]], [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i], [c, [p, S], [d, m]], [/(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i], [c, [p, x], [d, y]], [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i], [c, [p, x], [d, m]], [/(nexus 9)/i], [c, [p, "HTC"], [d, y]], [/(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i, /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i, /(alcatel|geeksphone|nexian|panasonic(?!(?:;|\.))|sony(?!-bra))[-_ ]?([-\w]*)/i], [p, [c, /_/g, " "], [d, m]], [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i], [c, [p, "Acer"], [d, y]], [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i], [c, [p, "Meizu"], [d, m]], [/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i, /(hp) ([\w ]+\w)/i, /(asus)-?(\w+)/i, /(microsoft); (lumia[\w ]+)/i, /(lenovo)[-_ ]?([-\w]+)/i, /(jolla)/i, /(oppo) ?([\w ]+) bui/i], [p, c, [d, m]], [/(kobo)\s(ereader|touch)/i, /(archos) (gamepad2?)/i, /(hp).+(touchpad(?!.+tablet)|tablet)/i, /(kindle)\/([\w\.]+)/i, /(nook)[\w ]+build\/(\w+)/i, /(dell) (strea[kpr\d ]*[\dko])/i, /(le[- ]+pan)[- ]+(\w{1,9}) bui/i, /(trinity)[- ]*(t\d{3}) bui/i, /(gigaset)[- ]+(q\w{1,9}) bui/i, /(vodafone) ([\w ]+)(?:\)| bui)/i], [p, c, [d, y]], [/(surface duo)/i], [c, [p, A], [d, y]], [/droid [\d\.]+; (fp\du?)(?: b|\))/i], [c, [p, "Fairphone"], [d, m]], [/(u304aa)/i], [c, [p, "AT&T"], [d, m]], [/\bsie-(\w*)/i], [c, [p, "Siemens"], [d, m]], [/\b(rct\w+) b/i], [c, [p, "RCA"], [d, y]], [/\b(venue[\d ]{2,7}) b/i], [c, [p, "Dell"], [d, y]], [/\b(q(?:mv|ta)\w+) b/i], [c, [p, "Verizon"], [d, y]], [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i], [c, [p, "Barnes & Noble"], [d, y]], [/\b(tm\d{3}\w+) b/i], [c, [p, "NuVision"], [d, y]], [/\b(k88) b/i], [c, [p, "ZTE"], [d, y]], [/\b(nx\d{3}j) b/i], [c, [p, "ZTE"], [d, m]], [/\b(gen\d{3}) b.+49h/i], [c, [p, "Swiss"], [d, m]], [/\b(zur\d{3}) b/i], [c, [p, "Swiss"], [d, y]], [/\b((zeki)?tb.*\b) b/i], [c, [p, "Zeki"], [d, y]], [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i], [[p, "Dragon Touch"], c, [d, y]], [/\b(ns-?\w{0,9}) b/i], [c, [p, "Insignia"], [d, y]], [/\b((nxa|next)-?\w{0,9}) b/i], [c, [p, "NextBook"], [d, y]], [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i], [[p, "Voice"], c, [d, m]], [/\b(lvtel\-)?(v1[12]) b/i], [[p, "LvTel"], c, [d, m]], [/\b(ph-1) /i], [c, [p, "Essential"], [d, m]], [/\b(v(100md|700na|7011|917g).*\b) b/i], [c, [p, "Envizen"], [d, y]], [/\b(trio[-\w\. ]+) b/i], [c, [p, "MachSpeed"], [d, y]], [/\btu_(1491) b/i], [c, [p, "Rotor"], [d, y]], [/(shield[\w ]+) b/i], [c, [p, "Nvidia"], [d, y]], [/(sprint) (\w+)/i], [p, c, [d, m]], [/(kin\.[onetw]{3})/i], [[c, /\./g, " "], [p, A], [d, m]], [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i], [c, [p, D], [d, y]], [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i], [c, [p, D], [d, m]], [/smart-tv.+(samsung)/i], [p, [d, b]], [/hbbtv.+maple;(\d+)/i], [[c, /^/, "SmartTV"], [p, N], [d, b]], [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i], [[p, "LG"], [d, b]], [/(apple) ?tv/i], [p, [c, E + " TV"], [d, b]], [/crkey/i], [[c, T + "cast"], [p, P], [d, b]], [/droid.+aft(\w)( bui|\))/i], [c, [p, _], [d, b]], [/\(dtv[\);].+(aquos)/i, /(aquos-tv[\w ]+)\)/i], [c, [p, U], [d, b]], [/(bravia[\w ]+)( bui|\))/i], [c, [p, j], [d, b]], [/(mitv-\w{5}) bui/i], [c, [p, $], [d, b]], [/Hbbtv.*(technisat) (.*);/i], [p, c, [d, b]], [/\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i, /hbbtv\/\d+\.\d+\.\d+ +\([\w\+ ]*; *([\w\d][^;]*);([^;]*)/i], [[p, F], [c, F], [d, b]], [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i], [[d, b]], [/(ouya)/i, /(nintendo) ([wids3utch]+)/i], [p, c, [d, g]], [/droid.+; (shield) bui/i], [c, [p, "Nvidia"], [d, g]], [/(playstation [345portablevi]+)/i], [c, [p, j], [d, g]], [/\b(xbox(?: one)?(?!; xbox))[\); ]/i], [c, [p, A], [d, g]], [/((pebble))app/i], [p, c, [d, v]], [/(watch)(?: ?os[,\/]|\d,\d\/)[\d\.]+/i], [c, [p, E], [d, v]], [/droid.+; (glass) \d/i], [c, [p, P], [d, v]], [/droid.+; (wt63?0{2,3})\)/i], [c, [p, D], [d, v]], [/(quest( 2| pro)?)/i], [c, [p, L], [d, v]], [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i], [p, [d, w]], [/(aeobc)\b/i], [c, [p, _], [d, w]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i], [c, [d, m]], [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i], [c, [d, y]], [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i], [[d, y]], [/(phone|mobile(?:[;\/]| [ \w\/\.]*safari)|pda(?=.+windows ce))/i], [[d, m]], [/(android[-\w\. ]{0,9});.+buil/i], [c, [p, "Generic"]]], engine: [[/windows.+ edge\/([\w\.]+)/i], [h, [u, "EdgeHTML"]], [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i], [h, [u, "Blink"]], [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i, /ekioh(flow)\/([\w\.]+)/i, /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i, /(icab)[\/ ]([23]\.[\d\.]+)/i, /\b(libweb)/i], [u, h], [/rv\:([\w\.]{1,9})\b.+(gecko)/i], [h, u]], os: [[/microsoft (windows) (vista|xp)/i], [u, h], [/(windows) nt 6\.2; (arm)/i, /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i, /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i], [u, [h, V, J]], [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i], [[u, "Windows"], [h, V, J]], [/ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i, /ios;fbsv\/([\d\.]+)/i, /cfnetwork\/.+darwin/i], [[h, /_/g, "."], [u, "iOS"]], [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i], [[u, H], [h, /_/g, "."]], [/droid ([\w\.]+)\b.+(android[- ]x86|harmonyos)/i], [h, u], [/(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i, /(blackberry)\w*\/([\w\.]*)/i, /(tizen|kaios)[\/ ]([\w\.]+)/i, /\((series40);/i], [u, h], [/\(bb(10);/i], [h, [u, S]], [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i], [h, [u, "Symbian"]], [/mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i], [h, [u, R + " OS"]], [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i], [h, [u, "webOS"]], [/watch(?: ?os[,\/]|\d,\d\/)([\d\.]+)/i], [h, [u, "watchOS"]], [/crkey\/([\d\.]+)/i], [h, [u, T + "cast"]], [/(cros) [\w]+(?:\)| ([\w\.]+)\b)/i], [[u, M], h], [/panasonic;(viera)/i, /(netrange)mmh/i, /(nettv)\/(\d+\.[\w\.]+)/i, /(nintendo|playstation) ([wids345portablevuch]+)/i, /(xbox); +xbox ([^\);]+)/i, /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i, /(mint)[\/\(\) ]?(\w*)/i, /(mageia|vectorlinux)[; ]/i, /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i, /(hurd|linux) ?([\w\.]*)/i, /(gnu) ?([\w\.]*)/i, /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i, /(haiku) (\w+)/i], [u, h], [/(sunos) ?([\w\.\d]*)/i], [[u, "Solaris"], h], [/((?:open)?solaris)[-\/ ]?([\w\.]*)/i, /(aix) ((\d)(?=\.|\)| )[\w\.])*/i, /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux|serenityos)/i, /(unix) ?([\w\.]*)/i], [u, h]] }, X = function(e2, t3) {
            if (typeof e2 === o && (t3 = e2, e2 = void 0), !(this instanceof X)) return new X(e2, t3).getResult();
            var r3 = typeof n2 !== a2 && n2.navigator ? n2.navigator : void 0, g2 = e2 || (r3 && r3.userAgent ? r3.userAgent : ""), b2 = r3 && r3.userAgentData ? r3.userAgentData : void 0, v2 = t3 ? W(G, t3) : G, w2 = r3 && r3.userAgent == g2;
            return this.getBrowser = function() {
              var e3, t4 = {};
              return t4[u] = void 0, t4[h] = void 0, K.call(t4, g2, v2.browser), t4[l] = typeof (e3 = t4[h]) === s ? e3.replace(/[^\d\.]/g, "").split(".")[0] : void 0, w2 && r3 && r3.brave && typeof r3.brave.isBrave == i2 && (t4[u] = "Brave"), t4;
            }, this.getCPU = function() {
              var e3 = {};
              return e3[f] = void 0, K.call(e3, g2, v2.cpu), e3;
            }, this.getDevice = function() {
              var e3 = {};
              return e3[p] = void 0, e3[c] = void 0, e3[d] = void 0, K.call(e3, g2, v2.device), w2 && !e3[d] && b2 && b2.mobile && (e3[d] = m), w2 && "Macintosh" == e3[c] && r3 && typeof r3.standalone !== a2 && r3.maxTouchPoints && r3.maxTouchPoints > 2 && (e3[c] = "iPad", e3[d] = y), e3;
            }, this.getEngine = function() {
              var e3 = {};
              return e3[u] = void 0, e3[h] = void 0, K.call(e3, g2, v2.engine), e3;
            }, this.getOS = function() {
              var e3 = {};
              return e3[u] = void 0, e3[h] = void 0, K.call(e3, g2, v2.os), w2 && !e3[u] && b2 && "Unknown" != b2.platform && (e3[u] = b2.platform.replace(/chrome os/i, M).replace(/macos/i, H)), e3;
            }, this.getResult = function() {
              return { ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS(), device: this.getDevice(), cpu: this.getCPU() };
            }, this.getUA = function() {
              return g2;
            }, this.setUA = function(e3) {
              return g2 = typeof e3 === s && e3.length > 350 ? F(e3, 350) : e3, this;
            }, this.setUA(g2), this;
          };
          if (X.VERSION = "1.0.35", X.BROWSER = B([u, h, l]), X.CPU = B([f]), X.DEVICE = B([c, p, d, g, m, b, y, v, w]), X.ENGINE = X.OS = B([u, h]), typeof r2 !== a2) t2.exports && (r2 = t2.exports = X), r2.UAParser = X;
          else if (typeof define === i2 && define.amd) e.r, void 0 !== X && e.v(X);
          else typeof n2 !== a2 && (n2.UAParser = X);
          var Y = typeof n2 !== a2 && (n2.jQuery || n2.Zepto);
          if (Y && !Y.ua) {
            var Z = new X();
            Y.ua = Z.getResult(), Y.ua.get = function() {
              return Z.getUA();
            }, Y.ua.set = function(e2) {
              Z.setUA(e2);
              var t3 = Z.getResult();
              for (var r3 in t3) Y.ua[r3] = t3[r3];
            };
          }
        }(this);
      } }, i = {};
      function a(e2) {
        var t2 = i[e2];
        if (void 0 !== t2) return t2.exports;
        var r2 = i[e2] = { exports: {} }, o = true;
        try {
          n[e2].call(r2.exports, r2, r2.exports, a), o = false;
        } finally {
          o && delete i[e2];
        }
        return r2.exports;
      }
      a.ab = "/ROOT/node_modules/next/dist/compiled/ua-parser-js/", t.exports = a(943);
    }, 8946, (e, t, r) => {
      "use strict";
      var n = { H: null, A: null };
      function i(e2) {
        var t2 = "https://react.dev/errors/" + e2;
        if (1 < arguments.length) {
          t2 += "?args[]=" + encodeURIComponent(arguments[1]);
          for (var r2 = 2; r2 < arguments.length; r2++) t2 += "&args[]=" + encodeURIComponent(arguments[r2]);
        }
        return "Minified React error #" + e2 + "; visit " + t2 + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
      }
      var a = Array.isArray;
      function o() {
      }
      var s = Symbol.for("react.transitional.element"), l = Symbol.for("react.portal"), c = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), d = Symbol.for("react.profiler"), p = Symbol.for("react.forward_ref"), h = Symbol.for("react.suspense"), f = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), m = Symbol.for("react.activity"), y = Symbol.for("react.view_transition"), b = Symbol.iterator, v = Object.prototype.hasOwnProperty, w = Object.assign;
      function _(e2, t2, r2) {
        var n2 = r2.ref;
        return { $$typeof: s, type: e2, key: t2, ref: void 0 !== n2 ? n2 : null, props: r2 };
      }
      function E(e2) {
        return "object" == typeof e2 && null !== e2 && e2.$$typeof === s;
      }
      var x = /\/+/g;
      function S(e2, t2) {
        var r2, n2;
        return "object" == typeof e2 && null !== e2 && null != e2.key ? (r2 = "" + e2.key, n2 = { "=": "=0", ":": "=2" }, "$" + r2.replace(/[=:]/g, function(e3) {
          return n2[e3];
        })) : t2.toString(36);
      }
      function k(e2, t2, r2) {
        if (null == e2) return e2;
        var n2 = [], c2 = 0;
        return !function e3(t3, r3, n3, c3, u2) {
          var d2, p2, h2, f2 = typeof t3;
          ("undefined" === f2 || "boolean" === f2) && (t3 = null);
          var m2 = false;
          if (null === t3) m2 = true;
          else switch (f2) {
            case "bigint":
            case "string":
            case "number":
              m2 = true;
              break;
            case "object":
              switch (t3.$$typeof) {
                case s:
                case l:
                  m2 = true;
                  break;
                case g:
                  return e3((m2 = t3._init)(t3._payload), r3, n3, c3, u2);
              }
          }
          if (m2) return u2 = u2(t3), m2 = "" === c3 ? "." + S(t3, 0) : c3, a(u2) ? (n3 = "", null != m2 && (n3 = m2.replace(x, "$&/") + "/"), e3(u2, r3, n3, "", function(e4) {
            return e4;
          })) : null != u2 && (E(u2) && (d2 = u2, p2 = n3 + (null == u2.key || t3 && t3.key === u2.key ? "" : ("" + u2.key).replace(x, "$&/") + "/") + m2, u2 = _(d2.type, p2, d2.props)), r3.push(u2)), 1;
          m2 = 0;
          var y2 = "" === c3 ? "." : c3 + ":";
          if (a(t3)) for (var v2 = 0; v2 < t3.length; v2++) f2 = y2 + S(c3 = t3[v2], v2), m2 += e3(c3, r3, n3, f2, u2);
          else if ("function" == typeof (v2 = null === (h2 = t3) || "object" != typeof h2 ? null : "function" == typeof (h2 = b && h2[b] || h2["@@iterator"]) ? h2 : null)) for (t3 = v2.call(t3), v2 = 0; !(c3 = t3.next()).done; ) f2 = y2 + S(c3 = c3.value, v2++), m2 += e3(c3, r3, n3, f2, u2);
          else if ("object" === f2) {
            if ("function" == typeof t3.then) return e3(function(e4) {
              switch (e4.status) {
                case "fulfilled":
                  return e4.value;
                case "rejected":
                  throw e4.reason;
                default:
                  switch ("string" == typeof e4.status ? e4.then(o, o) : (e4.status = "pending", e4.then(function(t4) {
                    "pending" === e4.status && (e4.status = "fulfilled", e4.value = t4);
                  }, function(t4) {
                    "pending" === e4.status && (e4.status = "rejected", e4.reason = t4);
                  })), e4.status) {
                    case "fulfilled":
                      return e4.value;
                    case "rejected":
                      throw e4.reason;
                  }
              }
              throw e4;
            }(t3), r3, n3, c3, u2);
            throw Error(i(31, "[object Object]" === (r3 = String(t3)) ? "object with keys {" + Object.keys(t3).join(", ") + "}" : r3));
          }
          return m2;
        }(e2, n2, "", "", function(e3) {
          return t2.call(r2, e3, c2++);
        }), n2;
      }
      function T(e2) {
        if (-1 === e2._status) {
          var t2 = (0, e2._result)();
          t2.then(function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 1, e2._result = r2, void 0 === t2.status && (t2.status = "fulfilled", t2.value = r2));
          }, function(r2) {
            (0 === e2._status || -1 === e2._status) && (e2._status = 2, e2._result = r2, void 0 === t2.status && (t2.status = "rejected", t2.reason = r2));
          }), -1 === e2._status && (e2._status = 0, e2._result = t2);
        }
        if (1 === e2._status) return e2._result.default;
        throw e2._result;
      }
      function R() {
        return /* @__PURE__ */ new WeakMap();
      }
      function P() {
        return { s: 0, v: void 0, o: null, p: null };
      }
      r.Activity = m, r.Children = { map: k, forEach: function(e2, t2, r2) {
        k(e2, function() {
          t2.apply(this, arguments);
        }, r2);
      }, count: function(e2) {
        var t2 = 0;
        return k(e2, function() {
          t2++;
        }), t2;
      }, toArray: function(e2) {
        return k(e2, function(e3) {
          return e3;
        }) || [];
      }, only: function(e2) {
        if (!E(e2)) throw Error(i(143));
        return e2;
      } }, r.Fragment = c, r.Profiler = d, r.StrictMode = u, r.Suspense = h, r.ViewTransition = y, r.__SERVER_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = n, r.cache = function(e2) {
        return function() {
          var t2 = n.A;
          if (!t2) return e2.apply(null, arguments);
          var r2 = t2.getCacheForType(R);
          void 0 === (t2 = r2.get(e2)) && (t2 = P(), r2.set(e2, t2)), r2 = 0;
          for (var i2 = arguments.length; r2 < i2; r2++) {
            var a2 = arguments[r2];
            if ("function" == typeof a2 || "object" == typeof a2 && null !== a2) {
              var o2 = t2.o;
              null === o2 && (t2.o = o2 = /* @__PURE__ */ new WeakMap()), void 0 === (t2 = o2.get(a2)) && (t2 = P(), o2.set(a2, t2));
            } else null === (o2 = t2.p) && (t2.p = o2 = /* @__PURE__ */ new Map()), void 0 === (t2 = o2.get(a2)) && (t2 = P(), o2.set(a2, t2));
          }
          if (1 === t2.s) return t2.v;
          if (2 === t2.s) throw t2.v;
          try {
            var s2 = e2.apply(null, arguments);
            return (r2 = t2).s = 1, r2.v = s2;
          } catch (e3) {
            throw (s2 = t2).s = 2, s2.v = e3, e3;
          }
        };
      }, r.cacheSignal = function() {
        var e2 = n.A;
        return e2 ? e2.cacheSignal() : null;
      }, r.captureOwnerStack = function() {
        return null;
      }, r.cloneElement = function(e2, t2, r2) {
        if (null == e2) throw Error(i(267, e2));
        var n2 = w({}, e2.props), a2 = e2.key;
        if (null != t2) for (o2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) v.call(t2, o2) && "key" !== o2 && "__self" !== o2 && "__source" !== o2 && ("ref" !== o2 || void 0 !== t2.ref) && (n2[o2] = t2[o2]);
        var o2 = arguments.length - 2;
        if (1 === o2) n2.children = r2;
        else if (1 < o2) {
          for (var s2 = Array(o2), l2 = 0; l2 < o2; l2++) s2[l2] = arguments[l2 + 2];
          n2.children = s2;
        }
        return _(e2.type, a2, n2);
      }, r.createElement = function(e2, t2, r2) {
        var n2, i2 = {}, a2 = null;
        if (null != t2) for (n2 in void 0 !== t2.key && (a2 = "" + t2.key), t2) v.call(t2, n2) && "key" !== n2 && "__self" !== n2 && "__source" !== n2 && (i2[n2] = t2[n2]);
        var o2 = arguments.length - 2;
        if (1 === o2) i2.children = r2;
        else if (1 < o2) {
          for (var s2 = Array(o2), l2 = 0; l2 < o2; l2++) s2[l2] = arguments[l2 + 2];
          i2.children = s2;
        }
        if (e2 && e2.defaultProps) for (n2 in o2 = e2.defaultProps) void 0 === i2[n2] && (i2[n2] = o2[n2]);
        return _(e2, a2, i2);
      }, r.createRef = function() {
        return { current: null };
      }, r.forwardRef = function(e2) {
        return { $$typeof: p, render: e2 };
      }, r.isValidElement = E, r.lazy = function(e2) {
        return { $$typeof: g, _payload: { _status: -1, _result: e2 }, _init: T };
      }, r.memo = function(e2, t2) {
        return { $$typeof: f, type: e2, compare: void 0 === t2 ? null : t2 };
      }, r.use = function(e2) {
        return n.H.use(e2);
      }, r.useCallback = function(e2, t2) {
        return n.H.useCallback(e2, t2);
      }, r.useDebugValue = function() {
      }, r.useId = function() {
        return n.H.useId();
      }, r.useMemo = function(e2, t2) {
        return n.H.useMemo(e2, t2);
      }, r.version = "19.3.0-canary-cbb046ab-20260731";
    }, 40049, (e, t, r) => {
      "use strict";
      t.exports = e.r(8946);
    }, 58217, (e) => {
      "use strict";
      let t, r, n, i, a, o, s, l;
      async function c() {
        return "_ENTRIES" in globalThis && _ENTRIES.middleware_instrumentation && await _ENTRIES.middleware_instrumentation;
      }
      e.i(74398);
      let u = null;
      async function d() {
        if ("phase-production-build" === process.env.NEXT_PHASE) return;
        u || (u = c());
        let e10 = await u;
        if (null == e10 ? void 0 : e10.register) try {
          await e10.register();
        } catch (e11) {
          throw e11.message = `An error occurred while loading instrumentation hook: ${e11.message}`, e11;
        }
      }
      async function p(...e10) {
        let t10 = await c();
        try {
          var r10;
          await (null == t10 || null == (r10 = t10.onRequestError) ? void 0 : r10.call(t10, ...e10));
        } catch (e11) {
          console.error("Error in instrumentation.onRequestError:", e11);
        }
      }
      let h = null;
      function f() {
        return h || (h = d()), h;
      }
      function g(e10) {
        return `The edge runtime does not support Node.js '${e10}' module.
Learn More: https://nextjs.org/docs/messages/node-module-in-edge-runtime`;
      }
      process !== e.g.process && (process.env = e.g.process.env, e.g.process = process);
      try {
        Object.defineProperty(globalThis, "__import_unsupported", { value: function(e10) {
          let t10 = new Proxy(function() {
          }, { get(t11, r10) {
            if ("then" === r10) return {};
            throw Object.defineProperty(Error(g(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, construct() {
            throw Object.defineProperty(Error(g(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          }, apply(r10, n10, i10) {
            if ("function" == typeof i10[0]) return i10[0](t10);
            throw Object.defineProperty(Error(g(e10)), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          } });
          return new Proxy({}, { get: () => t10 });
        }, enumerable: false, configurable: false });
      } catch {
      }
      f();
      class m extends Error {
        constructor({ page: e10 }) {
          super(`The middleware "${e10}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return NextResponse.redirect('/new-location')
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1177", enumerable: false, configurable: true });
        }
      }
      class y extends Error {
        constructor() {
          super("The request.page has been deprecated in favour of `URLPattern`.\n  Read more: https://nextjs.org/docs/messages/middleware-request-page\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1178", enumerable: false, configurable: true });
        }
      }
      class b extends Error {
        constructor() {
          super("The request.ua has been removed in favour of `userAgent` function.\n  Read more: https://nextjs.org/docs/messages/middleware-parse-user-agent\n  "), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1172", enumerable: false, configurable: true });
        }
      }
      let v = "x-prerender-revalidate", w = "x-prerender-revalidate-if-generated", _ = ".segments", E = ".segment.rsc", x = ".rsc", S = ".json", k = ".meta", T = "x-next-cache-tags", R = "x-next-revalidated-tags", P = "_N_T_", C = { shared: "shared", reactServerComponents: "rsc", serverSideRendering: "ssr", actionBrowser: "action-browser", apiNode: "api-node", apiEdge: "api-edge", middleware: "middleware", instrument: "instrument", edgeAsset: "edge-asset", appPagesBrowser: "app-pages-browser", pagesDirBrowser: "pages-dir-browser", pagesDirEdge: "pages-dir-edge", pagesDirNode: "pages-dir-node" };
      function A(e10) {
        var t10, r10, n10, i10, a10, o10 = [], s10 = 0;
        function l10() {
          for (; s10 < e10.length && /\s/.test(e10.charAt(s10)); ) s10 += 1;
          return s10 < e10.length;
        }
        for (; s10 < e10.length; ) {
          for (t10 = s10, a10 = false; l10(); ) if ("," === (r10 = e10.charAt(s10))) {
            for (n10 = s10, s10 += 1, l10(), i10 = s10; s10 < e10.length && "=" !== (r10 = e10.charAt(s10)) && ";" !== r10 && "," !== r10; ) s10 += 1;
            s10 < e10.length && "=" === e10.charAt(s10) ? (a10 = true, s10 = i10, o10.push(e10.substring(t10, n10)), t10 = s10) : s10 = n10 + 1;
          } else s10 += 1;
          (!a10 || s10 >= e10.length) && o10.push(e10.substring(t10, e10.length));
        }
        return o10;
      }
      function O(e10) {
        let t10 = {}, r10 = [];
        if (e10) for (let [n10, i10] of e10.entries()) "set-cookie" === n10.toLowerCase() ? (r10.push(...A(i10)), t10[n10] = 1 === r10.length ? r10[0] : r10) : t10[n10] = i10;
        return t10;
      }
      function I(e10) {
        try {
          return String(new URL(String(e10)));
        } catch (t10) {
          throw Object.defineProperty(Error(`URL is malformed "${String(e10)}". Please use only absolute URLs - https://nextjs.org/docs/messages/middleware-relative-urls`, { cause: t10 }), "__NEXT_ERROR_CODE", { value: "E61", enumerable: false, configurable: true });
        }
      }
      ({ ...C, GROUP: { builtinReact: [C.reactServerComponents, C.actionBrowser], serverOnly: [C.reactServerComponents, C.actionBrowser, C.instrument, C.middleware], neutralTarget: [C.apiNode, C.apiEdge], clientOnly: [C.serverSideRendering, C.appPagesBrowser], bundled: [C.reactServerComponents, C.actionBrowser, C.serverSideRendering, C.appPagesBrowser, C.shared, C.instrument, C.middleware], appPages: [C.reactServerComponents, C.serverSideRendering, C.appPagesBrowser, C.actionBrowser] } });
      let N = Symbol("response"), U = Symbol("passThrough"), j = Symbol("waitUntil");
      class $ {
        constructor(e10, t10) {
          this[U] = false, this[j] = t10 ? { kind: "external", function: t10 } : { kind: "internal", promises: [] };
        }
        respondWith(e10) {
          this[N] || (this[N] = Promise.resolve(e10));
        }
        passThroughOnException() {
          this[U] = true;
        }
        waitUntil(e10) {
          if ("external" === this[j].kind) return (0, this[j].function)(e10);
          this[j].promises.push(e10);
        }
      }
      class D extends $ {
        constructor(e10) {
          var t10;
          super(e10.request, null == (t10 = e10.context) ? void 0 : t10.waitUntil), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new m({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new m({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      function L(e10) {
        return 47 === e10.charCodeAt(e10.length - 1) && e10.length > 1 ? e10.slice(0, -1) : e10;
      }
      function M(e10) {
        let t10 = e10.indexOf("#"), r10 = e10.indexOf("?"), n10 = r10 > -1 && (t10 < 0 || r10 < t10);
        return n10 || t10 > -1 ? { pathname: e10.substring(0, n10 ? r10 : t10), query: n10 ? e10.substring(r10, t10 > -1 ? t10 : void 0) : "", hash: t10 > -1 ? e10.slice(t10) : "" } : { pathname: e10, query: "", hash: "" };
      }
      function H(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = M(e10);
        return `${t10}${r10}${n10}${i10}`;
      }
      function W(e10, t10) {
        if (!e10.startsWith("/") || !t10) return e10;
        let { pathname: r10, query: n10, hash: i10 } = M(e10);
        return `${r10}${t10}${n10}${i10}`;
      }
      function B(e10, t10) {
        if ("string" != typeof e10) return false;
        let { pathname: r10 } = M(e10);
        return r10 === t10 || r10.startsWith(t10 + "/");
      }
      let q = /* @__PURE__ */ new WeakMap();
      function z(e10, t10) {
        let r10;
        if (!t10) return { pathname: e10 };
        let n10 = q.get(t10);
        n10 || (n10 = t10.map((e11) => e11.toLowerCase()), q.set(t10, n10));
        let i10 = e10.split("/", 2);
        if (!i10[1]) return { pathname: e10 };
        let a10 = i10[1].toLowerCase(), o10 = n10.indexOf(a10);
        return o10 < 0 ? { pathname: e10 } : (r10 = t10[o10], { pathname: e10 = e10.slice(r10.length + 1) || "/", detectedLocale: r10 });
      }
      let F = /^(?:127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1\]|localhost)$/;
      function K(e10, t10) {
        let r10 = new URL(String(e10), t10 && String(t10));
        return F.test(r10.hostname) && (r10.hostname = "localhost"), r10;
      }
      let V = Symbol("NextURLInternal");
      class J {
        constructor(e10, t10, r10) {
          let n10, i10;
          "object" == typeof t10 && "pathname" in t10 || "string" == typeof t10 ? (n10 = t10, i10 = r10 || {}) : i10 = r10 || t10 || {}, this[V] = { url: K(e10, n10 ?? i10.base), options: i10, basePath: "" }, this.analyze();
        }
        analyze() {
          var e10, t10, r10, n10, i10;
          let a10 = function(e11, t11) {
            let { basePath: r11, i18n: n11, trailingSlash: i11 } = t11.nextConfig ?? {}, a11 = { pathname: e11, trailingSlash: "/" !== e11 ? e11.endsWith("/") : i11 };
            r11 && B(a11.pathname, r11) && (a11.pathname = function(e12, t12) {
              if (!B(e12, t12)) return e12;
              let r12 = e12.slice(t12.length);
              return r12.startsWith("/") ? r12 : `/${r12}`;
            }(a11.pathname, r11), a11.basePath = r11);
            let o11 = a11.pathname;
            if (a11.pathname.startsWith("/_next/data/") && a11.pathname.endsWith(".json")) {
              let e12 = a11.pathname.replace(/^\/_next\/data\//, "").replace(/\.json$/, "").split("/");
              a11.buildId = e12[0], o11 = "index" !== e12[1] ? `/${e12.slice(1).join("/")}` : "/", true === t11.parseData && (a11.pathname = o11);
            }
            if (n11) {
              let e12 = t11.i18nProvider ? t11.i18nProvider.analyze(a11.pathname) : z(a11.pathname, n11.locales);
              a11.locale = e12.detectedLocale, a11.pathname = e12.pathname ?? a11.pathname, !e12.detectedLocale && a11.buildId && (e12 = t11.i18nProvider ? t11.i18nProvider.analyze(o11) : z(o11, n11.locales)).detectedLocale && (a11.locale = e12.detectedLocale);
            }
            return a11;
          }(this[V].url.pathname, { nextConfig: this[V].options.nextConfig, parseData: true, i18nProvider: this[V].options.i18nProvider }), o10 = function(e11, t11) {
            let r11;
            if (t11?.host && !Array.isArray(t11.host)) r11 = t11.host.toString().split(":", 1)[0];
            else {
              if (!e11.hostname) return;
              r11 = e11.hostname;
            }
            return r11.toLowerCase();
          }(this[V].url, this[V].options.headers);
          this[V].domainLocale = this[V].options.i18nProvider ? this[V].options.i18nProvider.detectDomainLocale(o10) : function(e11, t11, r11) {
            if (e11) {
              for (let n11 of (r11 && (r11 = r11.toLowerCase()), e11)) if (t11 === n11.domain?.split(":", 1)[0].toLowerCase() || r11 === n11.defaultLocale.toLowerCase() || n11.locales?.some((e12) => e12.toLowerCase() === r11)) return n11;
            }
          }(null == (t10 = this[V].options.nextConfig) || null == (e10 = t10.i18n) ? void 0 : e10.domains, o10);
          let s10 = (null == (r10 = this[V].domainLocale) ? void 0 : r10.defaultLocale) || (null == (i10 = this[V].options.nextConfig) || null == (n10 = i10.i18n) ? void 0 : n10.defaultLocale);
          this[V].url.pathname = a10.pathname, this[V].defaultLocale = s10, this[V].basePath = a10.basePath ?? "", this[V].buildId = a10.buildId, this[V].locale = a10.locale ?? s10, this[V].trailingSlash = a10.trailingSlash;
        }
        formatPathname() {
          var e10;
          let t10;
          return t10 = function(e11, t11, r10, n10) {
            if (!t11 || t11 === r10) return e11;
            let i10 = e11.toLowerCase();
            return !n10 && (B(i10, "/api") || B(i10, `/${t11.toLowerCase()}`)) ? e11 : H(e11, `/${t11}`);
          }((e10 = { basePath: this[V].basePath, buildId: this[V].buildId, defaultLocale: this[V].options.forceLocale ? void 0 : this[V].defaultLocale, locale: this[V].locale, pathname: this[V].url.pathname, trailingSlash: this[V].trailingSlash }).pathname, e10.locale, e10.buildId ? void 0 : e10.defaultLocale, e10.ignorePrefix), (e10.buildId || !e10.trailingSlash) && (t10 = L(t10)), e10.buildId && (t10 = W(H(t10, `/_next/data/${e10.buildId}`), "/" === e10.pathname ? "index.json" : ".json")), t10 = H(t10, e10.basePath), !e10.buildId && e10.trailingSlash ? t10.endsWith("/") ? t10 : W(t10, "/") : L(t10);
        }
        formatSearch() {
          return this[V].url.search;
        }
        get buildId() {
          return this[V].buildId;
        }
        set buildId(e10) {
          this[V].buildId = e10;
        }
        get locale() {
          return this[V].locale ?? "";
        }
        set locale(e10) {
          var t10, r10;
          if (!this[V].locale || !(null == (r10 = this[V].options.nextConfig) || null == (t10 = r10.i18n) ? void 0 : t10.locales.includes(e10))) throw Object.defineProperty(TypeError(`The NextURL configuration includes no locale "${e10}"`), "__NEXT_ERROR_CODE", { value: "E597", enumerable: false, configurable: true });
          this[V].locale = e10;
        }
        get defaultLocale() {
          return this[V].defaultLocale;
        }
        get domainLocale() {
          return this[V].domainLocale;
        }
        get searchParams() {
          return this[V].url.searchParams;
        }
        get host() {
          return this[V].url.host;
        }
        set host(e10) {
          this[V].url.host = e10;
        }
        get hostname() {
          return this[V].url.hostname;
        }
        set hostname(e10) {
          this[V].url.hostname = e10;
        }
        get port() {
          return this[V].url.port;
        }
        set port(e10) {
          this[V].url.port = e10;
        }
        get protocol() {
          return this[V].url.protocol;
        }
        set protocol(e10) {
          this[V].url.protocol = e10;
        }
        get href() {
          let e10 = this.formatPathname(), t10 = this.formatSearch();
          return `${this.protocol}//${this.host}${e10}${t10}${this.hash}`;
        }
        set href(e10) {
          this[V].url = K(e10), this.analyze();
        }
        get origin() {
          return this[V].url.origin;
        }
        get pathname() {
          return this[V].url.pathname;
        }
        set pathname(e10) {
          this[V].url.pathname = e10;
        }
        get hash() {
          return this[V].url.hash;
        }
        set hash(e10) {
          this[V].url.hash = e10;
        }
        get search() {
          return this[V].url.search;
        }
        set search(e10) {
          this[V].url.search = e10;
        }
        get password() {
          return this[V].url.password;
        }
        set password(e10) {
          this[V].url.password = e10;
        }
        get username() {
          return this[V].url.username;
        }
        set username(e10) {
          this[V].url.username = e10;
        }
        get basePath() {
          return this[V].basePath;
        }
        set basePath(e10) {
          this[V].basePath = e10.startsWith("/") ? e10 : `/${e10}`;
        }
        toString() {
          return this.href;
        }
        toJSON() {
          return this.href;
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { href: this.href, origin: this.origin, protocol: this.protocol, username: this.username, password: this.password, host: this.host, hostname: this.hostname, port: this.port, pathname: this.pathname, search: this.search, searchParams: this.searchParams, hash: this.hash };
        }
        clone() {
          return new J(String(this), this[V].options);
        }
      }
      var G, X, Y, Z = e.i(28042);
      let Q = Symbol("internal request");
      class ee extends Request {
        constructor(e10, t10 = {}) {
          const r10 = "string" != typeof e10 && "url" in e10 ? e10.url : String(e10);
          I(r10), e10 instanceof Request ? super(e10, t10) : super(r10, t10);
          const n10 = new J(r10, { headers: O(this.headers), nextConfig: t10.nextConfig });
          this[Q] = { cookies: new Z.RequestCookies(this.headers), nextUrl: n10, url: n10.toString() };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, nextUrl: this.nextUrl, url: this.url, bodyUsed: this.bodyUsed, cache: this.cache, credentials: this.credentials, destination: this.destination, headers: Object.fromEntries(this.headers), integrity: this.integrity, keepalive: this.keepalive, method: this.method, mode: this.mode, redirect: this.redirect, referrer: this.referrer, referrerPolicy: this.referrerPolicy, signal: this.signal };
        }
        get cookies() {
          return this[Q].cookies;
        }
        get nextUrl() {
          return this[Q].nextUrl;
        }
        get page() {
          throw new y();
        }
        get ua() {
          throw new b();
        }
        get url() {
          return this[Q].url;
        }
      }
      class et {
        static get(e10, t10, r10) {
          let n10 = Reflect.get(e10, t10, r10);
          return "function" == typeof n10 ? n10.bind(e10) : n10;
        }
        static set(e10, t10, r10, n10) {
          return Reflect.set(e10, t10, r10, n10);
        }
        static has(e10, t10) {
          return Reflect.has(e10, t10);
        }
        static deleteProperty(e10, t10) {
          return Reflect.deleteProperty(e10, t10);
        }
      }
      let er = Symbol("internal response"), en = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
      function ei(e10, t10) {
        var r10;
        if (null == e10 || null == (r10 = e10.request) ? void 0 : r10.headers) {
          if (!(e10.request.headers instanceof Headers)) throw Object.defineProperty(Error("request.headers must be an instance of Headers"), "__NEXT_ERROR_CODE", { value: "E119", enumerable: false, configurable: true });
          let r11 = [];
          for (let [n10, i10] of e10.request.headers) t10.set("x-middleware-request-" + n10, i10), r11.push(n10);
          t10.set("x-middleware-override-headers", r11.join(","));
        }
      }
      class ea extends Response {
        constructor(e10, t10 = {}) {
          super(e10, t10);
          const r10 = this.headers, n10 = new Proxy(new Z.ResponseCookies(r10), { get(e11, n11, i10) {
            switch (n11) {
              case "delete":
              case "set":
                return (...i11) => {
                  let a10 = Reflect.apply(e11[n11], e11, i11), o10 = new Headers(r10);
                  return a10 instanceof Z.ResponseCookies && r10.set("x-middleware-set-cookie", a10.getAll().map((e12) => (0, Z.stringifyCookie)(e12)).join(",")), ei(t10, o10), a10;
                };
              default:
                return et.get(e11, n11, i10);
            }
          } });
          this[er] = { cookies: n10, url: t10.url ? new J(t10.url, { headers: O(r10), nextConfig: t10.nextConfig }) : void 0 };
        }
        [Symbol.for("edge-runtime.inspect.custom")]() {
          return { cookies: this.cookies, url: this.url, body: this.body, bodyUsed: this.bodyUsed, headers: Object.fromEntries(this.headers), ok: this.ok, redirected: this.redirected, status: this.status, statusText: this.statusText, type: this.type };
        }
        get cookies() {
          return this[er].cookies;
        }
        static json(e10, t10) {
          let r10 = Response.json(e10, t10);
          return new ea(r10.body, r10);
        }
        static redirect(e10, t10) {
          let r10 = "number" == typeof t10 ? t10 : (null == t10 ? void 0 : t10.status) ?? 307;
          if (!en.has(r10)) throw Object.defineProperty(RangeError('Failed to execute "redirect" on "response": Invalid status code'), "__NEXT_ERROR_CODE", { value: "E529", enumerable: false, configurable: true });
          let n10 = "object" == typeof t10 ? t10 : {}, i10 = new Headers(null == n10 ? void 0 : n10.headers);
          return i10.set("Location", I(e10)), new ea(null, { ...n10, headers: i10, status: r10 });
        }
        static rewrite(e10, t10) {
          let r10 = new Headers(null == t10 ? void 0 : t10.headers);
          return r10.set("x-middleware-rewrite", I(e10)), ei(t10, r10), new ea(null, { ...t10, headers: r10 });
        }
        static next(e10) {
          let t10 = new Headers(null == e10 ? void 0 : e10.headers);
          return t10.set("x-middleware-next", "1"), ei(e10, t10), new ea(null, { ...e10, headers: t10 });
        }
      }
      function eo(e10, t10) {
        let r10 = "string" == typeof t10 ? new URL(t10) : t10, n10 = new URL(e10, t10), i10 = n10.origin === r10.origin;
        return { url: i10 ? n10.toString().slice(r10.origin.length) : n10.toString(), isRelative: i10 };
      }
      let es = "next-router-prefetch", el = ["rsc", "next-router-state-tree", es, "next-hmr-refresh", "next-router-segment-prefetch"], ec = "_rsc";
      function eu(e10) {
        return e10.startsWith("/") ? e10 : `/${e10}`;
      }
      function ed(e10) {
        return eu(e10.split("/").reduce((e11, t10, r10, n10) => t10 ? "(" === t10[0] && t10.endsWith(")") || "@" === t10[0] || ("page" === t10 || "route" === t10) && r10 === n10.length - 1 ? e11 : `${e11}/${t10}` : e11, ""));
      }
      class ep extends Error {
        constructor() {
          super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1176", enumerable: false, configurable: true });
        }
        static callable() {
          throw new ep();
        }
      }
      class eh extends Headers {
        constructor(e10) {
          super(), this.headers = new Proxy(e10, { get(t10, r10, n10) {
            if ("symbol" == typeof r10) return et.get(t10, r10, n10);
            let i10 = r10.toLowerCase(), a10 = Object.keys(e10).find((e11) => e11.toLowerCase() === i10);
            if (void 0 !== a10) return et.get(t10, a10, n10);
          }, set(t10, r10, n10, i10) {
            if ("symbol" == typeof r10) return et.set(t10, r10, n10, i10);
            let a10 = r10.toLowerCase(), o10 = Object.keys(e10).find((e11) => e11.toLowerCase() === a10);
            return et.set(t10, o10 ?? r10, n10, i10);
          }, has(t10, r10) {
            if ("symbol" == typeof r10) return et.has(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 !== i10 && et.has(t10, i10);
          }, deleteProperty(t10, r10) {
            if ("symbol" == typeof r10) return et.deleteProperty(t10, r10);
            let n10 = r10.toLowerCase(), i10 = Object.keys(e10).find((e11) => e11.toLowerCase() === n10);
            return void 0 === i10 || et.deleteProperty(t10, i10);
          } });
        }
        static seal(e10, t10) {
          let r10, n10 = t10 && t10.size > 0 ? (e11) => t10.has(e11.toLowerCase()) : null, i10 = new Proxy(e10, { get(e11, t11, n11) {
            switch (t11) {
              case "append":
              case "delete":
              case "set":
                return ep.callable;
              case Symbol.iterator:
                return r10[Symbol.iterator];
              case "get":
              case "has":
              case "getSetCookie":
              case "keys":
              case "values":
              case "entries":
              case "forEach":
                return r10[t11];
              default:
                return et.get(e11, t11, n11);
            }
          } });
          return r10 = n10 ? /* @__PURE__ */ function(e11, t11, r11) {
            function* n11() {
              for (let t12 of e11.entries()) r11(t12[0]) || (yield t12);
            }
            return { entries: n11, [Symbol.iterator]: n11, get: (t12) => r11(t12) ? null : e11.get(t12), has: (t12) => !r11(t12) && e11.has(t12), getSetCookie: () => r11("set-cookie") ? [] : e11.getSetCookie(), *keys() {
              for (let t12 of e11.keys()) r11(t12) || (yield t12);
            }, *values() {
              for (let [, e12] of n11()) yield e12;
            }, forEach(e12, r12) {
              for (let [i11, a10] of n11()) e12.call(r12, a10, i11, t11);
            } };
          }(e10, i10, n10) : { get: e10.get.bind(e10), has: e10.has.bind(e10), getSetCookie: e10.getSetCookie.bind(e10), keys: e10.keys.bind(e10), values: e10.values.bind(e10), entries: e10.entries.bind(e10), [Symbol.iterator]: e10[Symbol.iterator].bind(e10), forEach(t11, r11) {
            for (let [n11, a10] of e10.entries()) t11.call(r11, a10, n11, i10);
          } }, i10;
        }
        static fresh(e10) {
          return new Proxy(e10, { get: (e11, t10, r10) => et.get(e11, t10, r10) });
        }
        merge(e10) {
          return Array.isArray(e10) ? e10.join(", ") : e10;
        }
        static from(e10) {
          return e10 instanceof Headers ? e10 : new eh(e10);
        }
        append(e10, t10) {
          let r10 = this.headers[e10];
          "string" == typeof r10 ? this.headers[e10] = [r10, t10] : Array.isArray(r10) ? r10.push(t10) : this.headers[e10] = t10;
        }
        delete(e10) {
          delete this.headers[e10];
        }
        get(e10) {
          let t10 = this.headers[e10];
          return void 0 !== t10 ? this.merge(t10) : null;
        }
        has(e10) {
          return void 0 !== this.headers[e10];
        }
        set(e10, t10) {
          this.headers[e10] = t10;
        }
        forEach(e10, t10) {
          for (let [r10, n10] of this.entries()) e10.call(t10, n10, r10, this);
        }
        *entries() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase(), r10 = this.get(t10);
            yield [t10, r10];
          }
        }
        *keys() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = e10.toLowerCase();
            yield t10;
          }
        }
        *values() {
          for (let e10 of Object.keys(this.headers)) {
            let t10 = this.get(e10);
            yield t10;
          }
        }
        [Symbol.iterator]() {
          return this.entries();
        }
      }
      let ef = Object.defineProperty(Error("Invariant: AsyncLocalStorage accessed in runtime where it is not available"), "__NEXT_ERROR_CODE", { value: "E504", enumerable: false, configurable: true });
      class eg {
        disable() {
          throw ef;
        }
        getStore() {
        }
        run() {
          throw ef;
        }
        exit() {
          throw ef;
        }
        enterWith() {
          throw ef;
        }
        static bind(e10) {
          return e10;
        }
      }
      let em = "u" > typeof globalThis && globalThis.AsyncLocalStorage;
      function ey() {
        return em ? new em() : new eg();
      }
      let eb = ey();
      class ev extends Error {
        constructor() {
          super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options"), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1180", enumerable: false, configurable: true });
        }
        static callable() {
          throw new ev();
        }
      }
      class ew {
        static seal(e10) {
          return new Proxy(e10, { get(e11, t10, r10) {
            switch (t10) {
              case "clear":
              case "delete":
              case "set":
                return ev.callable;
              default:
                return et.get(e11, t10, r10);
            }
          } });
        }
        static fresh(e10) {
          return new Proxy(e10, { get: (e11, t10, r10) => et.get(e11, t10, r10) });
        }
      }
      let e_ = Symbol.for("next.mutated.cookies");
      class eE {
        static wrap(e10, t10) {
          let r10 = new Z.ResponseCookies(new Headers());
          for (let t11 of e10.getAll()) r10.set(t11);
          let n10 = [], i10 = /* @__PURE__ */ new Set(), a10 = () => {
            let e11 = eb.getStore();
            if (e11 && (e11.pathWasRevalidated = 1), n10 = r10.getAll().filter((e12) => i10.has(e12.name)), t10) {
              let e12 = [];
              for (let t11 of n10) {
                let r11 = new Z.ResponseCookies(new Headers());
                r11.set(t11), e12.push(r11.toString());
              }
              t10(e12);
            }
          }, o10 = new Proxy(r10, { get(e11, t11, r11) {
            switch (t11) {
              case e_:
                return n10;
              case "delete":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.delete(...t12), o10;
                  } finally {
                    a10();
                  }
                };
              case "set":
                return function(...t12) {
                  i10.add("string" == typeof t12[0] ? t12[0] : t12[0].name);
                  try {
                    return e11.set(...t12), o10;
                  } finally {
                    a10();
                  }
                };
              default:
                return et.get(e11, t11, r11);
            }
          } });
          return o10;
        }
      }
      function ex(e10) {
        return "action" === e10.phase;
      }
      function eS(e10, t10) {
        if (!ex(e10)) throw new ev();
      }
      var ek = ((aO = ek || {}).handleRequest = "BaseServer.handleRequest", aO.run = "BaseServer.run", aO.pipe = "BaseServer.pipe", aO.getStaticHTML = "BaseServer.getStaticHTML", aO.render = "BaseServer.render", aO.renderToResponseWithComponents = "BaseServer.renderToResponseWithComponents", aO.renderToResponse = "BaseServer.renderToResponse", aO.renderToHTML = "BaseServer.renderToHTML", aO.renderError = "BaseServer.renderError", aO.renderErrorToResponse = "BaseServer.renderErrorToResponse", aO.renderErrorToHTML = "BaseServer.renderErrorToHTML", aO.render404 = "BaseServer.render404", aO), eT = ((aI = eT || {}).loadDefaultErrorComponents = "LoadComponents.loadDefaultErrorComponents", aI.loadComponents = "LoadComponents.loadComponents", aI), eR = ((aN = eR || {}).getRequestHandler = "NextServer.getRequestHandler", aN.getRequestHandlerWithMetadata = "NextServer.getRequestHandlerWithMetadata", aN.getServer = "NextServer.getServer", aN.getServerRequestHandler = "NextServer.getServerRequestHandler", aN.createServer = "createServer.createServer", aN), eP = ((aU = eP || {}).compression = "NextNodeServer.compression", aU.getBuildId = "NextNodeServer.getBuildId", aU.createComponentTree = "NextNodeServer.createComponentTree", aU.clientComponentLoading = "NextNodeServer.clientComponentLoading", aU.getLayoutOrPageModule = "NextNodeServer.getLayoutOrPageModule", aU.generateStaticRoutes = "NextNodeServer.generateStaticRoutes", aU.generateFsStaticRoutes = "NextNodeServer.generateFsStaticRoutes", aU.generatePublicRoutes = "NextNodeServer.generatePublicRoutes", aU.generateImageRoutes = "NextNodeServer.generateImageRoutes.route", aU.sendRenderResult = "NextNodeServer.sendRenderResult", aU.proxyRequest = "NextNodeServer.proxyRequest", aU.runApi = "NextNodeServer.runApi", aU.render = "NextNodeServer.render", aU.renderHTML = "NextNodeServer.renderHTML", aU.imageOptimizer = "NextNodeServer.imageOptimizer", aU.getPagePath = "NextNodeServer.getPagePath", aU.getRoutesManifest = "NextNodeServer.getRoutesManifest", aU.findPageComponents = "NextNodeServer.findPageComponents", aU.getFontManifest = "NextNodeServer.getFontManifest", aU.getServerComponentManifest = "NextNodeServer.getServerComponentManifest", aU.getRequestHandler = "NextNodeServer.getRequestHandler", aU.renderToHTML = "NextNodeServer.renderToHTML", aU.renderError = "NextNodeServer.renderError", aU.renderErrorToHTML = "NextNodeServer.renderErrorToHTML", aU.render404 = "NextNodeServer.render404", aU.startResponse = "NextNodeServer.startResponse", aU.route = "route", aU.onProxyReq = "onProxyReq", aU.apiResolver = "apiResolver", aU.internalFetch = "internalFetch", aU), eC = ((aj = eC || {}).startServer = "startServer.startServer", aj), eA = ((a$ = eA || {}).getServerSideProps = "Render.getServerSideProps", a$.getStaticProps = "Render.getStaticProps", a$.renderToString = "Render.renderToString", a$.renderDocument = "Render.renderDocument", a$.createBodyResult = "Render.createBodyResult", a$), eO = ((aD = eO || {}).renderToString = "AppRender.renderToString", aD.renderToReadableStream = "AppRender.renderToReadableStream", aD.getBodyResult = "AppRender.getBodyResult", aD.fetch = "AppRender.fetch", aD.waitShellReady = "AppRender.waitShellReady", aD.renderToNodeFizzStream = "AppRender.renderToNodeFizzStream", aD.instantInsights = "AppRender.instantInsights", aD.instantInsightsPrepareValidation = "AppRender.instantInsights.prepareValidation", aD.instantInsightsRunValidation = "AppRender.instantInsights.runValidation", aD), eI = ((aL = eI || {}).executeRoute = "Router.executeRoute", aL), eN = ((aM = eN || {}).runHandler = "Node.runHandler", aM), eU = ((aH = eU || {}).runHandler = "AppRouteRouteHandlers.runHandler", aH), ej = ((aW = ej || {}).generateMetadata = "ResolveMetadata.generateMetadata", aW.generateViewport = "ResolveMetadata.generateViewport", aW), e$ = ((aB = e$ || {}).execute = "Middleware.execute", aB);
      let eD = /* @__PURE__ */ new Set(["Middleware.execute", "BaseServer.handleRequest", "Render.getServerSideProps", "Render.getStaticProps", "AppRender.fetch", "AppRender.getBodyResult", "Render.renderDocument", "Node.runHandler", "AppRouteRouteHandlers.runHandler", "ResolveMetadata.generateMetadata", "ResolveMetadata.generateViewport", "NextNodeServer.createComponentTree", "NextNodeServer.findPageComponents", "NextNodeServer.getLayoutOrPageModule", "NextNodeServer.startResponse", "NextNodeServer.clientComponentLoading"]), eL = /* @__PURE__ */ new Set(["NextNodeServer.findPageComponents", "NextNodeServer.createComponentTree", "NextNodeServer.clientComponentLoading"]);
      function eM(e10) {
        return null !== e10 && "object" == typeof e10 && "then" in e10 && "function" == typeof e10.then;
      }
      let eH = process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      function eW() {
      }
      Symbol.for("@next/local-span-recorder");
      let { context: eB, propagation: eq, trace: ez, SpanStatusCode: eF, SpanKind: eK, ROOT_CONTEXT: eV } = t = e.r(59110);
      class eJ extends Error {
        constructor(e10, t10) {
          super(), this.bubble = e10, this.result = t10;
        }
      }
      let eG = (e10, t10) => {
        "object" == typeof t10 && null !== t10 && t10 instanceof eJ && t10.bubble ? e10.setAttribute("next.bubble", true) : (t10 && (e10.recordException(t10), e10.setAttribute("error.type", t10.name)), e10.setStatus({ code: eF.ERROR, message: null == t10 ? void 0 : t10.message })), e10.end();
      }, eX = /* @__PURE__ */ new Map(), eY = t.createContextKey("next.rootSpanId"), eZ = 0, eQ = { set(e10, t10, r10) {
        e10.push({ key: t10, value: r10 });
      } }, e0 = (s = new class e {
        getTracerInstance() {
          return ez.getTracer("next.js", "0.0.1");
        }
        isOpenTelemetryEnabled() {
          var e10, t10;
          let r10 = ez.getSpan(eB.active());
          if (null == r10 ? void 0 : r10.isRecording()) return true;
          let n10 = ez.getTracerProvider();
          return !("getDelegate" in n10) || (null == n10.getDelegate || null == (t10 = n10.getDelegate.call(n10)) || null == (e10 = t10.constructor) ? void 0 : e10.name) !== "NoopTracerProvider";
        }
        getContext() {
          return eB;
        }
        getTracePropagationData() {
          let e10 = eB.active(), t10 = [];
          return eq.inject(e10, t10, eQ), t10;
        }
        getActiveScopeSpan() {
          let e10 = eW(), t10 = null == e10 ? void 0 : e10.getActiveLocalSpan();
          return t10 && (null == e10 ? void 0 : e10.isOpenTelemetryIsolatedSpan(t10)) ? t10 : ez.getSpan(eB.active());
        }
        runWithDetachedContext(e10) {
          return eH || this.isOpenTelemetryEnabled() ? eB.with(eV, e10) : e10();
        }
        withPropagatedContext(e10, t10, r10, n10 = false) {
          let i10 = eB.active();
          if (!eH && !this.isOpenTelemetryEnabled() && !ez.getSpanContext(i10)) return t10();
          if (n10) {
            let n11 = eq.extract(eV, e10, r10);
            if (ez.getSpanContext(n11)) return eB.with(n11, t10);
            let a11 = eq.extract(i10, e10, r10);
            return eB.with(a11, t10);
          }
          if (ez.getSpanContext(i10)) return t10();
          let a10 = eq.extract(i10, e10, r10);
          return eB.with(a10, t10);
        }
        trace(...e10) {
          let [t10, r10, n10] = e10, i10 = !!eH || this.isOpenTelemetryEnabled(), a10 = eW(), o10 = (null == a10 ? void 0 : a10.isLocalSpanRecordingEnabled()) ?? false;
          if (!i10 && !o10) return "function" == typeof r10 ? r10() : n10();
          let { fn: s10, options: l10 } = "function" == typeof r10 ? { fn: r10, options: {} } : { fn: n10, options: { ...r10 } }, c2 = l10.spanName ?? t10, u2 = l10.parentSpan ?? this.getActiveScopeSpan(), d2 = u2 && (null == a10 ? void 0 : a10.isOpenTelemetryIsolatedSpan(u2)) ? u2 : void 0, p2 = !d2 && (eD.has(t10) || "1" === process.env.NEXT_OTEL_VERBOSE);
          if (!(p2 || (null == a10 ? void 0 : a10.isRequestInsightsEnabled())) || l10.hideSpan) return s10();
          let h2 = d2 ? eB.active() : this.getSpanContext(u2);
          h2 || (h2 = (null == eB ? void 0 : eB.active()) ?? eV);
          let f2 = h2.getValue(eY), g2 = "number" != typeof f2 || !eX.has(f2), m2 = eZ++;
          return l10.attributes = { "next.span_category": "nextjs", "next.span_name": c2, "next.span_type": t10, ...l10.attributes }, eB.with(h2.setValue(eY, m2), () => this.runWithActiveSpan(c2, l10, h2, i10 && p2, o10, d2, (e11) => {
            let r11;
            eH && t10 && eL.has(t10) && (r11 = "performance" in globalThis && "measure" in performance ? globalThis.performance.now() : void 0);
            let n11 = false, i11 = () => {
              !n11 && (n11 = true, eX.delete(m2), r11 && performance.measure(`${eH}:next-${(t10.split(".").pop() || "").replace(/[A-Z]/g, (e12) => "-" + e12.toLowerCase())}`, { start: r11, end: performance.now() }));
            };
            if (g2 && eX.set(m2, new Map(Object.entries(l10.attributes ?? {}))), s10.length > 1) try {
              return s10(e11, (t11) => {
                t11 ? eG(e11, t11) : e11.end();
              });
            } catch (t11) {
              throw eG(e11, t11), t11;
            } finally {
              i11();
            }
            try {
              let t11 = s10(e11);
              if (eM(t11)) return t11.then((t12) => (e11.end(), t12)).catch((t12) => {
                throw eG(e11, t12), t12;
              }).finally(i11);
              return e11.end(), i11(), t11;
            } catch (t11) {
              throw eG(e11, t11), i11(), t11;
            }
          }));
        }
        runWithActiveSpan(e10, t10, r10, n10, i10, a10, o10) {
          if (n10) return this.getTracerInstance().startActiveSpan(e10, t10, (n11) => o10(i10 ? this.createLocalRecordingSpan(e10, t10, r10, n11, a10) : n11));
          let s10 = this.createLocalRecordingSpan(e10, t10, r10, void 0, a10), l10 = eW();
          return l10.withLocalSpan(s10, () => l10.isOpenTelemetryIsolatedSpan(s10) ? o10(s10) : eB.with(ez.setSpan(eB.active(), s10), o10, void 0, s10));
        }
        createLocalRecordingSpan(e10, t10, r10, n10, i10) {
          let a10 = (null == i10 ? void 0 : i10.spanContext()) ?? ez.getSpanContext(r10), o10 = null == n10 ? void 0 : n10.spanContext();
          return eW().createLocalSpan({ name: e10, attributes: t10.attributes, links: t10.links, startTime: t10.startTime, delegateSpan: n10, traceId: (null == o10 ? void 0 : o10.traceId) ?? (null == a10 ? void 0 : a10.traceId), spanId: null == o10 ? void 0 : o10.spanId, parentSpanId: null == a10 ? void 0 : a10.spanId, isolateOpenTelemetry: void 0 !== i10 });
        }
        wrap(...e10) {
          let t10 = this, [r10, n10, i10] = 3 === e10.length ? e10 : [e10[0], {}, e10[1]];
          return eD.has(r10) || "1" === process.env.NEXT_OTEL_VERBOSE ? function() {
            let e11 = n10;
            "function" == typeof e11 && "function" == typeof i10 && (e11 = e11.apply(this, arguments));
            let a10 = arguments.length - 1, o10 = arguments[a10];
            if ("function" != typeof o10) return t10.trace(r10, e11, () => i10.apply(this, arguments));
            {
              let n11 = t10.getContext().bind(eB.active(), o10);
              return t10.trace(r10, e11, (e12, t11) => (arguments[a10] = function(e13) {
                return null == t11 || t11(e13), n11.apply(this, arguments);
              }, i10.apply(this, arguments)));
            }
          } : i10;
        }
        startSpan(...e10) {
          let [t10, r10] = e10, n10 = r10 ? { ...r10, attributes: { "next.span_category": "nextjs", ...r10.attributes } } : { attributes: { "next.span_category": "nextjs" } }, i10 = eW(), a10 = n10.parentSpan ?? this.getActiveScopeSpan(), o10 = a10 && (null == i10 ? void 0 : i10.isOpenTelemetryIsolatedSpan(a10)) ? a10 : void 0, s10 = (o10 ? void 0 : this.getSpanContext(a10)) ?? eB.active();
          if (!(null == i10 ? void 0 : i10.isLocalSpanRecordingEnabled())) return this.getTracerInstance().startSpan(t10, n10, s10);
          let l10 = !o10 && this.isOpenTelemetryEnabled() ? this.getTracerInstance().startSpan(t10, n10, s10) : void 0;
          return this.createLocalRecordingSpan(t10, n10, s10, l10, o10);
        }
        getSpanContext(e10) {
          return e10 ? ez.setSpan(eB.active(), e10) : void 0;
        }
        getRootSpanAttributes() {
          let e10 = eB.active().getValue(eY);
          return eX.get(e10);
        }
        setRootSpanAttribute(e10, t10) {
          let r10 = eB.active().getValue(eY), n10 = eX.get(r10);
          n10 && !n10.has(e10) && n10.set(e10, t10);
        }
        withSpan(e10, t10) {
          let r10 = eW();
          return (null == r10 ? void 0 : r10.isLocalRecordingSpan(e10)) ? r10.withLocalSpan(e10, () => r10.isOpenTelemetryIsolatedSpan(e10) ? t10() : eB.with(ez.setSpan(eB.active(), e10), t10)) : eB.with(ez.setSpan(eB.active(), e10), t10);
        }
      }(), () => s), e1 = "__prerender_bypass";
      Symbol("__next_preview_data"), Symbol(e1);
      class e2 {
        constructor(e10, t10, r10, n10) {
          var i10;
          const a10 = e10 && function(e11, t11) {
            if ("function" == typeof e11.get) {
              let r11 = eh.from(e11);
              return { isOnDemandRevalidate: r11.get(v) === t11.previewModeId, revalidateOnlyGenerated: r11.has(w) };
            }
            return { isOnDemandRevalidate: e11[v] === t11.previewModeId, revalidateOnlyGenerated: e11.hasOwnProperty(w) };
          }(t10, e10).isOnDemandRevalidate, o10 = null == (i10 = r10.get(e1)) ? void 0 : i10.value;
          this._isEnabled = !!(!a10 && o10 && e10 && o10 === e10.previewModeId), this._previewModeId = null == e10 ? void 0 : e10.previewModeId, this._mutableCookies = n10;
        }
        get isEnabled() {
          return this._isEnabled;
        }
        enable() {
          if (!this._previewModeId) throw Object.defineProperty(Error("Invariant: previewProps missing previewModeId this should never happen"), "__NEXT_ERROR_CODE", { value: "E93", enumerable: false, configurable: true });
          this._mutableCookies.set({ name: e1, value: this._previewModeId, httpOnly: true, sameSite: "none", secure: true, path: "/" }), this._isEnabled = true;
        }
        disable() {
          this._mutableCookies.set({ name: e1, value: "", httpOnly: true, sameSite: "none", secure: true, path: "/", expires: /* @__PURE__ */ new Date(0) }), this._isEnabled = false;
        }
      }
      let e3 = new Set([...el, "x-nextjs-request-id", "x-nextjs-html-request-id"].map((e10) => e10.toLowerCase()));
      function e4(e10, t10) {
        if ("x-middleware-set-cookie" in e10 && "string" == typeof e10["x-middleware-set-cookie"]) {
          let r10 = e10["x-middleware-set-cookie"], n10 = new Headers();
          for (let e11 of A(r10)) n10.append("set-cookie", e11);
          for (let e11 of new Z.ResponseCookies(n10).getAll()) t10.set(e11);
        }
      }
      let e5 = ey();
      function e6(e10) {
        throw Object.defineProperty(Error(`\`${e10}\` was called outside a request scope. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E251", enumerable: false, configurable: true });
      }
      function e8(e10) {
        switch (e10.type) {
          case "request":
          case "prerender":
          case "prerender-runtime":
          case "prerender-client":
          case "validation-client":
          case "prerender-ppr":
            return e10.resumeDataCache;
          case "cache":
          case "private-cache":
          case "unstable-cache":
          case "prerender-legacy":
          case "generate-static-params":
            return null;
          default:
            return e10;
        }
      }
      var e9 = e.i(99734);
      class e7 extends Error {
        constructor(e10, t10) {
          super(`Invariant: ${e10.endsWith(".") ? e10 : e10 + "."} This is a bug in Next.js.`, t10), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E1179", enumerable: false, configurable: true }), this.name = "InvariantError";
        }
      }
      var te = e.i(51615);
      process.env.NEXT_PRIVATE_DEBUG_CACHE, Symbol.for("@next/cache-handlers");
      let tt = Symbol.for("@next/cache-handlers-map"), tr = Symbol.for("@next/cache-handlers-set");
      Symbol.for("@next/cache-handlers-private"), Symbol.for("@next/cache-handlers-built-in"), Symbol.for("@next/cache-handlers-dev-fronts"), Symbol.for("@next/cache-handlers-dev-tiered"), Symbol.for("@next/cache-handlers-memory-disabled");
      let tn = globalThis;
      function ti() {
        let e10 = tn[tt];
        if (e10) return e10.entries();
      }
      async function ta(e10, t10) {
        if (!e10) return t10();
        let r10 = to(e10);
        try {
          return await t10();
        } finally {
          var n10, i10, a10, o10;
          let t11, s10, l10, c2, u2 = (n10 = r10, i10 = to(e10), t11 = new Set(n10.pendingRevalidatedTags.map((e11) => {
            let t12 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return `${e11.tag}:${t12}`;
          })), s10 = new Set(n10.pendingRevalidateWrites), { pendingRevalidatedTags: i10.pendingRevalidatedTags.filter((e11) => {
            let r11 = "object" == typeof e11.profile ? JSON.stringify(e11.profile) : e11.profile || "";
            return !t11.has(`${e11.tag}:${r11}`);
          }), pendingRevalidates: Object.fromEntries(Object.entries(i10.pendingRevalidates).filter(([e11]) => !(e11 in n10.pendingRevalidates))), pendingRevalidateWrites: i10.pendingRevalidateWrites.filter((e11) => !s10.has(e11)) });
          await (a10 = e10, l10 = [], (c2 = (null == (o10 = u2) ? void 0 : o10.pendingRevalidatedTags) ?? a10.pendingRevalidatedTags ?? []).length > 0 && l10.push(ts(c2, a10.incrementalCache, a10)), l10.push(...Object.values((null == o10 ? void 0 : o10.pendingRevalidates) ?? a10.pendingRevalidates ?? {})), l10.push(...(null == o10 ? void 0 : o10.pendingRevalidateWrites) ?? a10.pendingRevalidateWrites ?? []), 0 !== l10.length && Promise.all(l10).then(() => void 0));
        }
      }
      function to(e10) {
        return { pendingRevalidatedTags: e10.pendingRevalidatedTags ? [...e10.pendingRevalidatedTags] : [], pendingRevalidates: { ...e10.pendingRevalidates }, pendingRevalidateWrites: e10.pendingRevalidateWrites ? [...e10.pendingRevalidateWrites] : [] };
      }
      async function ts(e10, t10, r10) {
        if (0 === e10.length) return;
        let n10 = function() {
          let e11 = tn[tr];
          if (e11) return e11.values();
        }(), i10 = [], a10 = /* @__PURE__ */ new Map();
        for (let t11 of e10) {
          let e11, r11 = t11.profile;
          for (let [t12] of a10) if ("string" == typeof t12 && "string" == typeof r11 && t12 === r11 || "object" == typeof t12 && "object" == typeof r11 && JSON.stringify(t12) === JSON.stringify(r11) || t12 === r11) {
            e11 = t12;
            break;
          }
          let n11 = e11 || r11;
          a10.has(n11) || a10.set(n11, []), a10.get(n11).push(t11.tag);
        }
        for (let [e11, o10] of a10) {
          let a11;
          if (e11) {
            let t11;
            if ("object" == typeof e11) t11 = e11;
            else if ("string" == typeof e11 && !(t11 = null == r10 ? void 0 : r10.cacheLifeProfiles[e11])) throw Object.defineProperty(Error(`Invalid profile provided "${e11}" must be configured under cacheLife in next.config or be "max"`), "__NEXT_ERROR_CODE", { value: "E873", enumerable: false, configurable: true });
            t11 && (a11 = { expire: t11.expire });
          }
          for (let t11 of n10 || []) e11 ? i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10, a11)) : i10.push(null == t11.updateTags ? void 0 : t11.updateTags.call(t11, o10));
          t10 && i10.push(t10.revalidateTag(o10, a11));
        }
        await Promise.all(i10);
      }
      let tl = ey();
      class tc {
        constructor({ waitUntil: e10, onClose: t10, onTaskError: r10 }) {
          this.isRequestClosed = false, this.initialOnCloseError = null, this.workUnitStores = /* @__PURE__ */ new Set(), this.waitUntil = e10, this.onClose = t10, this.onTaskError = r10, this.callbackQueue = new e9.default(), this.callbackQueue.pause();
          try {
            t10(() => {
              for (let e11 of (this.isRequestClosed = true, this.workUnitStores)) e11.phase = "after";
            });
          } catch (e11) {
            this.initialOnCloseError = { error: e11 };
          }
        }
        after(e10, t10) {
          if (this.initialOnCloseError) throw Object.defineProperty(new e7("An onClose call failed, which means after() can't work correctly.", { cause: this.initialOnCloseError.error }), "__NEXT_ERROR_CODE", { value: "E1376", enumerable: false, configurable: true });
          if (this.workUnitStores.add(t10), eM(e10)) this.addThenable(e10);
          else if ("function" == typeof e10) this.addCallback(e10, t10);
          else throw Object.defineProperty(Error("`after()`: Argument must be a promise or a function"), "__NEXT_ERROR_CODE", { value: "E50", enumerable: false, configurable: true });
        }
        addThenable(e10) {
          this.waitUntil || tu(), this.waitUntil(new Promise((t10) => {
            e10.then(() => {
              t10();
            }, (e11) => {
              t10(), this.reportTaskError("promise", e11);
            });
          }));
        }
        addCallback(e10, t10) {
          var r10;
          this.waitUntil || tu();
          let n10 = tl.getStore(), i10 = n10 ? n10.rootTaskSpawnPhase : t10.phase;
          this.runCallbacksOnClosePromise || (this.runCallbacksOnClosePromise = this.runCallbacksOnClose(), this.waitUntil(this.runCallbacksOnClosePromise));
          let a10 = (r10 = async () => {
            try {
              await tl.run({ rootTaskSpawnPhase: i10 }, () => e10());
            } catch (e11) {
              this.reportTaskError("function", e11);
            }
          }, em ? em.bind(r10) : eg.bind(r10));
          this.callbackQueue.add(a10);
        }
        async runCallbacksOnClose() {
          return this.isRequestClosed ? await new Promise((e10) => {
            setTimeout(e10, 0);
          }) : await new Promise((e10) => this.onClose(e10)), this.runCallbacks();
        }
        async runCallbacks() {
          if (0 === this.callbackQueue.size) return;
          let e10 = eb.getStore();
          if (!e10) throw Object.defineProperty(new e7("Missing workStore in AfterContext.runCallbacks"), "__NEXT_ERROR_CODE", { value: "E547", enumerable: false, configurable: true });
          return ta(e10, () => (this.callbackQueue.start(), this.callbackQueue.onIdle()));
        }
        reportTaskError(e10, t10) {
          if (console.error("promise" === e10 ? "A promise passed to `after()` rejected:" : "An error occurred in a function passed to `after()`:", t10), this.onTaskError) try {
            null == this.onTaskError || this.onTaskError.call(this, t10);
          } catch (e11) {
            console.error(Object.defineProperty(new e7("`onTaskError` threw while handling an error thrown from an `after` task", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E569", enumerable: false, configurable: true }));
          }
        }
      }
      function tu() {
        throw Object.defineProperty(Error("`after()` will not work correctly, because `waitUntil` is not available in the current environment."), "__NEXT_ERROR_CODE", { value: "E91", enumerable: false, configurable: true });
      }
      function td(e10) {
        let t10, r10 = { then: (n10, i10) => (t10 || (t10 = Promise.resolve(e10())), t10.then((e11) => {
          r10.value = e11;
        }).catch(() => {
        }), t10.then(n10, i10)) };
        return r10;
      }
      class tp {
        onClose(e10) {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot subscribe to a closed CloseController"), "__NEXT_ERROR_CODE", { value: "E365", enumerable: false, configurable: true });
          this.target.addEventListener("close", e10), this.listeners++;
        }
        dispatchClose() {
          if (this.isClosed) throw Object.defineProperty(Error("Cannot close a CloseController multiple times"), "__NEXT_ERROR_CODE", { value: "E229", enumerable: false, configurable: true });
          this.listeners > 0 && this.target.dispatchEvent(new Event("close")), this.isClosed = true;
        }
        constructor() {
          this.target = new EventTarget(), this.listeners = 0, this.isClosed = false;
        }
      }
      function th() {
        return { previewModeId: process.env.__NEXT_PREVIEW_MODE_ID || "", previewModeSigningKey: process.env.__NEXT_PREVIEW_MODE_SIGNING_KEY || "", previewModeEncryptionKey: process.env.__NEXT_PREVIEW_MODE_ENCRYPTION_KEY || "" };
      }
      let tf = Symbol.for("@next/request-context"), tg = /[^\t\x20-\x7e]/, tm = /[^\t\x20-\x7e]+/g;
      function ty(e10) {
        return tg.test(e10) ? e10.replace(tm, (e11) => encodeURIComponent(e11)) : e10;
      }
      async function tb(e10, t10, r10) {
        let n10 = /* @__PURE__ */ new Set();
        for (let t11 of ((e11) => {
          let t12 = ["/layout"];
          if (e11.startsWith("/")) {
            let r11 = e11.indexOf("/", 1);
            for (; ; ) {
              -1 === r11 && (r11 = e11.length);
              let n11 = e11.slice(0, r11);
              if (n11 && (n11.endsWith("/page") || n11.endsWith("/route") || (n11 = `${n11}${!n11.endsWith("/") ? "/" : ""}layout`), t12.push(n11)), r11 === e11.length) break;
              r11 = e11.indexOf("/", r11 + 1);
            }
          }
          return t12;
        })(e10)) t11 = ty(`${P}${t11}`), n10.add(t11);
        if (t10 && (!r10 || 0 === r10.size)) {
          let e11 = ty(`${P}${t10}`);
          n10.add(e11);
        }
        n10.has(`${P}/`) && n10.add(`${P}/index`), n10.has(`${P}/index`) && n10.add(`${P}/`);
        let i10 = Array.from(n10);
        return { tags: i10, expirationsByCacheKind: function(e11) {
          let t11 = /* @__PURE__ */ new Map(), r11 = ti();
          if (r11) for (let [n11, i11] of r11) "getExpiration" in i11 && t11.set(n11, td(async () => i11.getExpiration(e11)));
          return t11;
        }(i10) };
      }
      let tv = Symbol.for("NextInternalRequestMeta"), tw = { get default() {
        throw Object.defineProperty(new e7("Proxy does not support `use cache`, so reading its `default` cacheLife profile is unexpected."), "__NEXT_ERROR_CODE", { value: "E1406", enumerable: false, configurable: true });
      } };
      class t_ extends ee {
        constructor(e10) {
          super(e10.input, e10.init), this.sourcePage = e10.page;
        }
        get request() {
          throw Object.defineProperty(new m({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        respondWith() {
          throw Object.defineProperty(new m({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
        waitUntil() {
          throw Object.defineProperty(new m({ page: this.sourcePage }), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
        }
      }
      let tE = { keys: (e10) => Array.from(e10.keys()), get: (e10, t10) => e10.get(t10) ?? void 0 }, tx = (e10, t10) => e0().withPropagatedContext(e10.headers, t10, tE), tS = false;
      async function tk(t10) {
        var r10, n10, i10, a10, o10;
        let s10, l10, c2, u2, d2;
        !function() {
          if (!tS && (tS = true, "true" === process.env.NEXT_PRIVATE_TEST_PROXY)) {
            let { interceptTestApis: t11, wrapRequestHandler: r11 } = e.r(94165);
            t11(), tx = r11(tx);
          }
        }(), await f();
        let p2 = void 0 !== globalThis.__BUILD_MANIFEST;
        t10.request.url = t10.request.url.replace(/\.rsc($|\?)/, "$1");
        let h2 = t10.bypassNextUrl ? new URL(t10.request.url) : new J(t10.request.url, { headers: t10.request.headers, nextConfig: t10.request.nextConfig });
        for (let e10 of [...h2.searchParams.keys()]) {
          let t11 = h2.searchParams.getAll(e10), r11 = function(e11) {
            for (let t12 of ["nxtP", "nxtI"]) if (e11 !== t12 && e11.startsWith(t12)) return e11.substring(t12.length);
            return null;
          }(e10);
          if (r11) {
            for (let e11 of (h2.searchParams.delete(r11), t11)) h2.searchParams.append(r11, e11);
            h2.searchParams.delete(e10);
          }
        }
        let g2 = process.env.__NEXT_BUILD_ID || "";
        "buildId" in h2 && (g2 = h2.buildId || "", h2.buildId = "");
        let m2 = function(e10) {
          let t11 = new Headers();
          for (let [r11, n11] of Object.entries(e10)) for (let e11 of Array.isArray(n11) ? n11 : [n11]) void 0 !== e11 && ("number" == typeof e11 && (e11 = e11.toString()), t11.append(r11, e11));
          return t11;
        }(t10.request.headers), y2 = m2.has("x-nextjs-data"), b2 = "1" === m2.get("rsc");
        y2 && "/index" === h2.pathname && (h2.pathname = "/");
        let v2 = /* @__PURE__ */ new Map();
        if (!p2) for (let e10 of el) {
          let t11 = m2.get(e10);
          null !== t11 && (v2.set(e10, t11), m2.delete(e10));
        }
        let w2 = h2.searchParams.get(ec), _2 = new t_({ page: t10.page, input: ((u2 = (c2 = "string" == typeof h2) ? new URL(h2) : h2).searchParams.delete(ec), c2 ? u2.toString() : u2).toString(), init: { body: t10.request.body, headers: m2, method: t10.request.method, nextConfig: t10.request.nextConfig, signal: t10.request.signal } });
        t10.request.requestMeta && (o10 = t10.request.requestMeta, _2[tv] = o10), y2 && Object.defineProperty(_2, "__isData", { enumerable: false, value: true }), !globalThis.__incrementalCacheShared && t10.IncrementalCache && (globalThis.__incrementalCache = new t10.IncrementalCache({ CurCacheHandler: t10.incrementalCacheHandler, minimalMode: true, fetchCacheKeyPrefix: "", dev: false, requestHeaders: t10.request.headers, getPrerenderManifest: () => ({ version: -1, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: th() }) }));
        let E2 = t10.request.waitUntil ?? (null == (r10 = null == (d2 = globalThis[tf]) ? void 0 : d2.get()) ? void 0 : r10.waitUntil), x2 = new D({ request: _2, page: t10.page, context: E2 ? { waitUntil: E2 } : void 0 });
        if ((s10 = await tx(_2, () => {
          if ("/middleware" === t10.page || "/src/middleware" === t10.page || "/proxy" === t10.page || "/src/proxy" === t10.page) {
            let e10 = x2.waitUntil.bind(x2), r11 = new tp();
            return e0().trace(e$.execute, { spanName: `middleware ${_2.method}`, attributes: { "http.target": _2.nextUrl.pathname, "http.method": _2.method } }, async () => {
              try {
                var n11, i11, a11, o11, s11;
                let c3 = th(), u3 = await tb("/", _2.nextUrl.pathname, null), d3 = (a11 = _2.nextUrl, o11 = (e11) => {
                  l10 = e11;
                }, s11 = void 0, function(e11) {
                  let { phase: t11, headers: r12, onUpdateCookies: n12, url: i12, rootParams: a12, implicitTags: o12, resumeDataCache: s12, previewProps: l11, isHmrRefresh: c4, serverComponentsHmrCache: u4, hmrRefreshHash: d4, fallbackParams: p4 } = e11, h3 = {};
                  return { type: "request", phase: t11, implicitTags: o12, url: { pathname: i12.pathname, search: i12.search ?? "" }, rootParams: a12, get headers() {
                    return h3.headers || (h3.headers = eh.seal(eh.from(r12), e3)), h3.headers;
                  }, get cookies() {
                    if (!h3.cookies) {
                      let e12 = new Z.RequestCookies(eh.from(r12));
                      e4(r12, e12), h3.cookies = ew.seal(e12);
                    }
                    return h3.cookies;
                  }, set cookies(value) {
                    h3.cookies = value;
                  }, get mutableCookies() {
                    if (!h3.mutableCookies) {
                      let e12, t12 = (e12 = new Z.RequestCookies(eh.from(r12)), eE.wrap(e12, n12));
                      e4(r12, t12), h3.mutableCookies = t12;
                    }
                    return h3.mutableCookies;
                  }, get userspaceMutableCookies() {
                    if (!h3.userspaceMutableCookies) {
                      var f2;
                      let e12;
                      f2 = this, h3.userspaceMutableCookies = e12 = new Proxy(f2.mutableCookies, { get(t12, r13, n13) {
                        switch (r13) {
                          case "delete":
                            return function(...r14) {
                              return eS(f2, "cookies().delete"), t12.delete(...r14), e12;
                            };
                          case "set":
                            return function(...r14) {
                              return eS(f2, "cookies().set"), t12.set(...r14), e12;
                            };
                          default:
                            return et.get(t12, r13, n13);
                        }
                      } });
                    }
                    return h3.userspaceMutableCookies;
                  }, get draftMode() {
                    return h3.draftMode || (h3.draftMode = new e2(l11, r12, this.cookies, this.mutableCookies)), h3.draftMode;
                  }, resumeDataCache: s12 ?? null, isHmrRefresh: c4, serverComponentsHmrCache: u4 || globalThis.__serverComponentsHmrCache, hmrRefreshHash: d4, fallbackParams: p4 };
                }({ phase: "action", headers: _2.headers, onUpdateCookies: o11, url: a11, rootParams: {}, implicitTags: u3, resumeDataCache: null, previewProps: c3, isHmrRefresh: false, serverComponentsHmrCache: void 0, hmrRefreshHash: s11, fallbackParams: null })), p3 = function({ page: e11, renderOpts: t11, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, previouslyRevalidatedTags: a12, nonce: o12 }) {
                  let s12 = !t11.supportsDynamicResponse && !t11.isDraftMode && !t11.isPossibleServerAction, l11 = s12 && (!!process.env.NEXT_DEBUG_BUILD || "1" === process.env.NEXT_SSG_FETCH_METRICS), c4 = { isStaticGeneration: s12, page: e11, route: ed(e11), incrementalCache: t11.incrementalCache || globalThis.__incrementalCache, cacheLifeProfiles: t11.cacheLifeProfiles, useCacheTimeout: t11.experimental.useCacheTimeout, staticPageGenerationTimeout: t11.staticPageGenerationTimeout, isBuildTimePrerendering: t11.isBuildTimePrerendering, fetchCache: t11.fetchCache, isOnDemandRevalidate: t11.isOnDemandRevalidate, requestId: void 0, htmlRequestId: void 0, isDraftMode: t11.isDraftMode, isPrefetchRequest: r12, buildId: n12, deploymentId: i12, reactLoadableManifest: (null == t11 ? void 0 : t11.reactLoadableManifest) || {}, assetPrefix: (null == t11 ? void 0 : t11.assetPrefix) || "", nonce: o12, afterContext: function(e12) {
                    let { waitUntil: t12, onClose: r13, onAfterTaskError: n13 } = e12;
                    return new tc({ waitUntil: t12, onClose: r13, onTaskError: n13 });
                  }(t11), cacheComponentsEnabled: t11.cacheComponents, validationLevel: t11.validationLevel, previouslyRevalidatedTags: a12, requestStartTime: performance.timeOrigin + performance.now(), refreshTagsByCacheKind: function() {
                    let e12 = /* @__PURE__ */ new Map(), t12 = ti();
                    if (t12) for (let [r13, n13] of t12) "refreshTags" in n13 && e12.set(r13, td(async () => n13.refreshTags()));
                    return e12;
                  }(), runInCleanSnapshot: em ? em.snapshot() : function(e12, ...t12) {
                    return e12(...t12);
                  }, shouldTrackFetchMetrics: l11, reactServerErrorsByDigest: /* @__PURE__ */ new Map() };
                  return t11.store = c4, c4;
                }({ page: "/", renderOpts: { cacheLifeProfiles: tw, staticPageGenerationTimeout: 0, cacheComponents: false, validationLevel: "warning", experimental: { isRoutePPREnabled: false, authInterrupts: !!(null == (i11 = t10.request.nextConfig) || null == (n11 = i11.experimental) ? void 0 : n11.authInterrupts), useCacheTimeout: 0 }, supportsDynamicResponse: true, waitUntil: e10, onClose: r11.onClose.bind(r11), onAfterTaskError: void 0 }, isPrefetchRequest: "1" === _2.headers.get(es), buildId: g2 ?? "", deploymentId: false, previouslyRevalidatedTags: [] });
                return await eb.run(p3, () => e5.run(d3, t10.handler, _2, x2));
              } finally {
                setTimeout(() => {
                  r11.dispatchClose();
                }, 0);
              }
            });
          }
          return t10.handler(_2, x2);
        })) && !(s10 instanceof Response)) throw Object.defineProperty(TypeError("Expected an instance of Response to be returned"), "__NEXT_ERROR_CODE", { value: "E567", enumerable: false, configurable: true });
        s10 && l10 && s10.headers.set("set-cookie", l10);
        let S2 = null == s10 ? void 0 : s10.headers.get("x-middleware-rewrite");
        if (s10 && S2 && (b2 || !p2)) {
          let e10 = new J(S2, { forceLocale: true, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          p2 || e10.host !== _2.nextUrl.host || (e10.buildId = g2 || e10.buildId, s10.headers.set("x-middleware-rewrite", String(e10)));
          let { url: r11, isRelative: o11 } = eo(e10.toString(), h2.toString());
          !p2 && y2 && s10.headers.set("x-nextjs-rewrite", r11);
          let l11 = !o11 && (null == (a10 = t10.request.nextConfig) || null == (i10 = a10.experimental) || null == (n10 = i10.clientParamParsingOrigins) ? void 0 : n10.some((t11) => new RegExp(t11).test(e10.origin)));
          b2 && (o11 || l11) && (h2.pathname !== e10.pathname && s10.headers.set("x-nextjs-rewritten-path", e10.pathname), h2.search !== e10.search && s10.headers.set("x-nextjs-rewritten-query", e10.search.slice(1)));
        }
        if (s10 && S2 && b2 && w2) {
          let e10 = new URL(S2);
          e10.searchParams.has(ec) || (e10.searchParams.set(ec, w2), s10.headers.set("x-middleware-rewrite", e10.toString()));
        }
        let k2 = null == s10 ? void 0 : s10.headers.get("Location");
        if (s10 && k2 && !p2) {
          let e10 = new J(k2, { forceLocale: false, headers: t10.request.headers, nextConfig: t10.request.nextConfig });
          s10 = new Response(s10.body, s10), e10.host === h2.host && (e10.buildId = g2 || e10.buildId, s10.headers.set("Location", eo(e10, h2).url)), y2 && (s10.headers.delete("Location"), s10.headers.set("x-nextjs-redirect", eo(e10.toString(), h2.toString()).url));
        }
        let T2 = s10 || ea.next(), R2 = T2.headers.get("x-middleware-override-headers"), P2 = [];
        if (R2) {
          for (let [e10, t11] of v2) T2.headers.set(`x-middleware-request-${e10}`, t11), P2.push(e10);
          P2.length > 0 && T2.headers.set("x-middleware-override-headers", R2 + "," + P2.join(","));
        }
        return { response: T2, waitUntil: ("internal" === x2[j].kind ? Promise.all(x2[j].promises).then(() => {
        }) : void 0) ?? Promise.resolve(), fetchMetrics: _2.fetchMetrics };
      }
      let tT = ["(..)(..)", "(.)", "(..)", "(...)"], tR = /\/[^/]*\[[^/]+\][^/]*(?=\/|$)/, tP = /\/\[[^/]+\](?=\/|$)/;
      class tC {
        constructor(e10 = []) {
          this.normalizers = e10;
        }
        push(e10) {
          this.normalizers.push(e10);
        }
        normalize(e10) {
          return this.normalizers.reduce((e11, t10) => t10.normalize(e11), e10);
        }
      }
      class tA {
        normalize(e10) {
          return e10.replace(/%5F/g, "_");
        }
      }
      var tO = ((aq = {}).PAGES = "PAGES", aq.PAGES_API = "PAGES_API", aq.APP_PAGE = "APP_PAGE", aq.APP_ROUTE = "APP_ROUTE", aq.IMAGE = "IMAGE", aq);
      let tI = "route-cache", tN = new class extends tC {
        constructor() {
          super([/* @__PURE__ */ function(e10) {
            return { normalize: e10 };
          }(ed), new tA()]);
        }
        normalize(e10) {
          return super.normalize(e10);
        }
      }();
      function tU(e10, t10, r10, n10) {
        if (!r10) return false;
        let i10 = null === r10.dataRoute ? tO.APP_ROUTE : r10.dataRoute.endsWith(".json") ? tO.PAGES : r10.dataRoute.endsWith(".rsc") ? tO.APP_PAGE : void 0;
        return i10 === t10.kind && (("srcRoute" in r10 ? r10.srcRoute : r10.fallbackSourceRoute) ?? (i10 === tO.PAGES ? z(e10, n10).pathname : e10)) === (i10 === tO.PAGES ? t10.sourceRoute : tN.normalize(t10.sourceRoute));
      }
      function tj(t10, r10) {
        let n10;
        if (!r10) throw new e7("Response cache requires a source route");
        let { sourceRoute: i10 } = r10;
        return n10 = e.r(63398)().update(new TextEncoder().encode(i10)).digest("hex"), `/${tI}/${r10.kind}/${n10}/$${/^\/index(\/|$)/.test(t10) && !function(e10, t11 = true) {
          return (void 0 !== e10.split("/").find((e11) => tT.find((t12) => e11.startsWith(t12))) && (e10 = function(e11) {
            let t12, r11, n11;
            for (let i11 of e11.split("/")) if (r11 = tT.find((e12) => i11.startsWith(e12))) {
              [t12, n11] = e11.split(r11, 2);
              break;
            }
            if (!t12 || !r11 || !n11) throw Object.defineProperty(Error(`Invalid interception route: ${e11}. Must be in the format /<intercepting route>/(..|...|..)(..)/<intercepted route>`), "__NEXT_ERROR_CODE", { value: "E269", enumerable: false, configurable: true });
            switch (t12 = ed(t12), r11) {
              case "(.)":
                n11 = "/" === t12 ? `/${n11}` : t12 + "/" + n11;
                break;
              case "(..)":
                if ("/" === t12) throw Object.defineProperty(Error(`Invalid interception route: ${e11}. Cannot use (..) marker at the root level, use (.) instead.`), "__NEXT_ERROR_CODE", { value: "E207", enumerable: false, configurable: true });
                n11 = t12.split("/").slice(0, -1).concat(n11).join("/");
                break;
              case "(...)":
                n11 = "/" + n11;
                break;
              case "(..)(..)":
                let i11 = t12.split("/");
                if (i11.length <= 2) throw Object.defineProperty(Error(`Invalid interception route: ${e11}. Cannot use (..)(..) marker at the root level or one level up.`), "__NEXT_ERROR_CODE", { value: "E486", enumerable: false, configurable: true });
                n11 = i11.slice(0, -2).concat(n11).join("/");
                break;
              default:
                throw Object.defineProperty(Error("Invariant: unexpected marker"), "__NEXT_ERROR_CODE", { value: "E112", enumerable: false, configurable: true });
            }
            return { interceptingRoute: t12, interceptedRoute: n11 };
          }(e10).interceptedRoute), t11) ? tP.test(e10) : tR.test(e10);
        }(t10) ? `/index${t10}` : "/" === t10 ? "/index" : eu(t10)}`;
      }
      var t$ = ((az = {}).APP_PAGE = "APP_PAGE", az.APP_ROUTE = "APP_ROUTE", az.PAGES = "PAGES", az.FETCH = "FETCH", az.REDIRECT = "REDIRECT", az.IMAGE = "IMAGE", az), tD = ((aF = {}).APP_PAGE = "APP_PAGE", aF.APP_ROUTE = "APP_ROUTE", aF.PAGES = "PAGES", aF.FETCH = "FETCH", aF.IMAGE = "IMAGE", aF);
      class tL {
        constructor() {
          let e10, t10;
          this.promise = new Promise((r10, n10) => {
            e10 = r10, t10 = n10;
          }), this.resolve = e10, this.reject = t10;
        }
      }
      class tM {
        constructor(e10, t10, r10) {
          this.prev = null, this.next = null, this.key = e10, this.data = t10, this.size = r10;
        }
      }
      class tH {
        constructor() {
          this.prev = null, this.next = null;
        }
      }
      class tW {
        constructor(e10, t10, r10) {
          this.cache = /* @__PURE__ */ new Map(), this.totalSize = 0, this.maxSize = e10, this.calculateSize = t10, this.onEvict = r10, this.head = new tH(), this.tail = new tH(), this.head.next = this.tail, this.tail.prev = this.head;
        }
        addToHead(e10) {
          e10.prev = this.head, e10.next = this.head.next, this.head.next.prev = e10, this.head.next = e10;
        }
        removeNode(e10) {
          e10.prev.next = e10.next, e10.next.prev = e10.prev;
        }
        moveToHead(e10) {
          this.removeNode(e10), this.addToHead(e10);
        }
        removeTail() {
          let e10 = this.tail.prev;
          return this.removeNode(e10), e10;
        }
        set(e10, t10) {
          let r10 = (null == this.calculateSize ? void 0 : this.calculateSize.call(this, t10, e10)) ?? 1;
          if (r10 <= 0) throw Object.defineProperty(Error(`LRUCache: calculateSize returned ${r10}, but size must be > 0. Items with size 0 would never be evicted, causing unbounded cache growth.`), "__NEXT_ERROR_CODE", { value: "E1045", enumerable: false, configurable: true });
          if (r10 > this.maxSize) return console.warn("Single item size exceeds maxSize"), false;
          let n10 = this.cache.get(e10);
          if (n10) n10.data = t10, this.totalSize = this.totalSize - n10.size + r10, n10.size = r10, this.moveToHead(n10);
          else {
            let n11 = new tM(e10, t10, r10);
            this.cache.set(e10, n11), this.addToHead(n11), this.totalSize += r10;
          }
          for (; this.totalSize > this.maxSize && this.cache.size > 0; ) {
            let e11 = this.removeTail();
            this.cache.delete(e11.key), this.totalSize -= e11.size, null == this.onEvict || this.onEvict.call(this, e11.key, e11.data);
          }
          return true;
        }
        has(e10) {
          return this.cache.has(e10);
        }
        get(e10) {
          let t10 = this.cache.get(e10);
          if (t10) return this.moveToHead(t10), t10.data;
        }
        *[Symbol.iterator]() {
          let e10 = this.head.next;
          for (; e10 && e10 !== this.tail; ) {
            let t10 = e10;
            yield [t10.key, t10.data], e10 = e10.next;
          }
        }
        remove(e10) {
          let t10 = this.cache.get(e10);
          t10 && (this.removeNode(t10), this.cache.delete(e10), this.totalSize -= t10.size);
        }
        get size() {
          return this.cache.size;
        }
        get currentSize() {
          return this.totalSize;
        }
      }
      let { env: tB, stdout: tq } = (null == (aK = globalThis) ? void 0 : aK.process) ?? {}, tz = tB && !tB.NO_COLOR && (tB.FORCE_COLOR || (null == tq ? void 0 : tq.isTTY) && !tB.CI && "dumb" !== tB.TERM), tF = (e10, t10, r10, n10) => {
        let i10 = e10.substring(0, n10) + r10, a10 = e10.substring(n10 + t10.length), o10 = a10.indexOf(t10);
        return ~o10 ? i10 + tF(a10, t10, r10, o10) : i10 + a10;
      }, tK = (e10, t10, r10 = e10) => tz ? (n10) => {
        let i10 = "" + n10, a10 = i10.indexOf(t10, e10.length);
        return ~a10 ? e10 + tF(i10, t10, r10, a10) + t10 : e10 + i10 + t10;
      } : String, tV = tK("\x1B[1m", "\x1B[22m", "\x1B[22m\x1B[1m");
      tK("\x1B[2m", "\x1B[22m", "\x1B[22m\x1B[2m"), tK("\x1B[3m", "\x1B[23m"), tK("\x1B[4m", "\x1B[24m"), tK("\x1B[7m", "\x1B[27m"), tK("\x1B[8m", "\x1B[28m"), tK("\x1B[9m", "\x1B[29m"), tK("\x1B[30m", "\x1B[39m");
      let tJ = tK("\x1B[31m", "\x1B[39m"), tG = tK("\x1B[32m", "\x1B[39m"), tX = tK("\x1B[33m", "\x1B[39m");
      tK("\x1B[34m", "\x1B[39m");
      let tY = tK("\x1B[35m", "\x1B[39m");
      tK("\x1B[38;2;173;127;168m", "\x1B[39m"), tK("\x1B[36m", "\x1B[39m");
      let tZ = tK("\x1B[37m", "\x1B[39m");
      function tQ() {
      }
      tK("\x1B[90m", "\x1B[39m"), tK("\x1B[40m", "\x1B[49m"), tK("\x1B[41m", "\x1B[49m"), tK("\x1B[42m", "\x1B[49m"), tK("\x1B[43m", "\x1B[49m"), tK("\x1B[44m", "\x1B[49m"), tK("\x1B[45m", "\x1B[49m"), tK("\x1B[46m", "\x1B[49m"), tK("\x1B[47m", "\x1B[49m"), tZ(tV("\u25CB")), tJ(tV("\u2A2F")), tX(tV("\u26A0")), tZ(tV(" ")), tG(tV("\u2713")), tY(tV("\xBB")), new tW(1e4, (e10) => e10.length), new tW(1e4, (e10) => e10.length), new TextEncoder();
      let t0 = new TextEncoder();
      function t1(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(t0.encode(e10)), t10.close();
        } });
      }
      function t2(e10) {
        return new ReadableStream({ start(t10) {
          t10.enqueue(e10), t10.close();
        } });
      }
      async function t3(e10, t10) {
        let r10 = new TextDecoder("utf-8", { fatal: true }), n10 = "";
        for await (let i10 of e10) {
          if (null == t10 ? void 0 : t10.aborted) return n10;
          n10 += r10.decode(i10, { stream: true });
        }
        return n10 + r10.decode();
      }
      let t4 = "ResponseAborted";
      class t5 extends Error {
        constructor(...e10) {
          super(...e10), this.name = t4;
        }
      }
      let t6 = 0, t8 = 0, t9 = 0;
      function t7(e10 = {}) {
        let t10 = 0 === t6 ? void 0 : { clientComponentLoadStart: t6, clientComponentLoadTimes: t8, clientComponentLoadCount: t9 };
        return e10.reset && (t6 = 0, t8 = 0, t9 = 0), t10;
      }
      function re(e10) {
        return (null == e10 ? void 0 : e10.name) === "AbortError" || (null == e10 ? void 0 : e10.name) === t4;
      }
      let rt = "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX;
      async function rr(e10, t10, r10) {
        try {
          let n10, { errored: i10, destroyed: a10 } = t10;
          if (i10 || a10) return;
          let o10 = (n10 = new AbortController(), t10.once("close", () => {
            t10.writableFinished || n10.abort(new t5());
          }), n10), s10 = function(e11, t11) {
            let r11 = false, n11 = new tL();
            function i11() {
              n11.resolve();
            }
            e11.on("drain", i11), e11.once("close", () => {
              e11.off("drain", i11), n11.resolve();
            });
            let a11 = new tL();
            return e11.once("finish", () => {
              a11.resolve();
            }), new WritableStream({ write: async (t12) => {
              if (!r11) {
                if (r11 = true, rt) {
                  let e12 = t7();
                  e12 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e12.clientComponentLoadStart, end: e12.clientComponentLoadStart + e12.clientComponentLoadTimes });
                }
                e11.flushHeaders(), e0().trace(eP.startResponse, { spanName: "start response" }, () => void 0);
              }
              try {
                let r12 = e11.write(t12);
                "flush" in e11 && "function" == typeof e11.flush && e11.flush(), r12 || (await n11.promise, n11 = new tL());
              } catch (t13) {
                throw e11.end(), Object.defineProperty(Error("failed to write chunk to response", { cause: t13 }), "__NEXT_ERROR_CODE", { value: "E321", enumerable: false, configurable: true });
              }
            }, abort: (t12) => {
              e11.writableFinished || e11.destroy(t12);
            }, close: async () => {
              if (t11 && await t11, !e11.writableFinished) return e11.end(), a11.promise;
            } });
          }(t10, r10);
          await e10.pipeTo(s10, { signal: o10.signal });
        } catch (e11) {
          if (re(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      async function rn(e10, t10, r10) {
        try {
          let { errored: n10, destroyed: i10 } = t10;
          if (n10 || i10) return;
          let a10 = false, o10 = new tL();
          t10.once("close", () => {
            e10.destroy(), o10.resolve();
          }), e10.on("data", (r11) => {
            if (!a10) {
              if (a10 = true, "performance" in globalThis && process.env.NEXT_OTEL_PERFORMANCE_PREFIX) {
                let e11 = t7();
                e11 && performance.measure(`${process.env.NEXT_OTEL_PERFORMANCE_PREFIX}:next-client-component-loading`, { start: e11.clientComponentLoadStart, end: e11.clientComponentLoadStart + e11.clientComponentLoadTimes });
              }
              t10.flushHeaders(), e0().trace(eP.startResponse, { spanName: "start response" }, () => void 0);
            }
            let n11 = t10.write(r11);
            "flush" in t10 && "function" == typeof t10.flush && t10.flush(), n11 || (e10.pause(), t10.once("drain", () => {
              e10.resume();
            }));
          }), e10.on("end", async () => {
            r10 && await r10, t10.writableFinished || t10.end(), o10.resolve();
          }), e10.on("error", (e11) => {
            re(e11) || t10.destroy(e11), o10.resolve();
          }), await o10.promise;
        } catch (e11) {
          if (re(e11)) return;
          throw Object.defineProperty(Error("failed to pipe response", { cause: e11 }), "__NEXT_ERROR_CODE", { value: "E180", enumerable: false, configurable: true });
        }
      }
      function ri(e10) {
        return null !== e10 && "object" == typeof e10 && "function" == typeof e10.pipe && "function" == typeof e10.on && !(e10 instanceof ReadableStream);
      }
      class ra {
        static #e = this.EMPTY = new ra(null, { metadata: {}, contentType: null });
        static fromStatic(e10, t10) {
          return new ra(e10, { metadata: {}, contentType: t10 });
        }
        constructor(e10, { contentType: t10, waitUntil: r10, metadata: n10 }) {
          this.response = e10, this.contentType = t10, this.metadata = n10, this.waitUntil = r10;
        }
        assignMetadata(e10) {
          Object.assign(this.metadata, e10);
        }
        get isNull() {
          return null === this.response;
        }
        get isDynamic() {
          return "string" != typeof this.response;
        }
        toUnchunkedString(e10 = false) {
          if (null === this.response) return "";
          if ("string" != typeof this.response) {
            if (!e10) throw Object.defineProperty(new e7("dynamic responses cannot be unchunked. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E732", enumerable: false, configurable: true });
            return t3(this.readable);
          }
          return this.response;
        }
        get readable() {
          if (null === this.response) return new ReadableStream({ start(e10) {
            e10.close();
          } });
          if ("string" == typeof this.response) return t1(this.response);
          if (te.Buffer.isBuffer(this.response)) return t2(this.response);
          if (Array.isArray(this.response)) return function(...e10) {
            if (0 === e10.length) return new ReadableStream({ start(e11) {
              e11.close();
            } });
            if (1 === e10.length) return e10[0];
            let { readable: t10, writable: r10 } = new TransformStream(), n10 = e10[0].pipeTo(r10, { preventClose: true }), i10 = 1;
            for (; i10 < e10.length - 1; i10++) {
              let t11 = e10[i10];
              n10 = n10.then(() => t11.pipeTo(r10, { preventClose: true }));
            }
            let a10 = e10[i10];
            return (n10 = n10.then(() => a10.pipeTo(r10))).catch(tQ), t10;
          }(...this.response);
          if (ri(this.response)) throw Object.defineProperty(new e7("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
          return this.response;
        }
        coerce() {
          if (null === this.response) return [];
          if ("string" == typeof this.response) return [t1(this.response)];
          if (Array.isArray(this.response)) return this.response;
          if (te.Buffer.isBuffer(this.response)) return [t2(this.response)];
          if (!ri(this.response)) return [this.response];
          throw Object.defineProperty(new e7("Node.js Readable cannot be converted to a web stream in the edge runtime"), "__NEXT_ERROR_CODE", { value: "E1150", enumerable: false, configurable: true });
        }
        pipeThrough(e10) {
          this.response = this.readable.pipeThrough(e10);
        }
        unshift(e10) {
          this.response = this.coerce(), this.response.unshift(e10);
        }
        push(e10) {
          this.response = this.coerce(), this.response.push(e10);
        }
        async pipeTo(e10) {
          try {
            await this.readable.pipeTo(e10, { preventClose: true }), this.waitUntil && await this.waitUntil, await e10.close();
          } catch (t10) {
            if (re(t10)) return void await e10.abort(t10);
            throw t10;
          }
        }
        async pipeToNodeResponse(e10) {
          null !== this.response && "string" != typeof this.response && !te.Buffer.isBuffer(this.response) && !Array.isArray(this.response) && ri(this.response) ? await rn(this.response, e10, this.waitUntil) : await rr(this.readable, e10, this.waitUntil);
        }
      }
      function ro(e10, t10) {
        if (!e10) return t10;
        let r10 = parseInt(e10, 10);
        return Number.isFinite(r10) && r10 > 0 ? r10 : t10;
      }
      ro(process.env.NEXT_PRIVATE_RESPONSE_CACHE_TTL, 1e4), ro(process.env.NEXT_PRIVATE_RESPONSE_CACHE_MAX_SIZE, 150);
      var rs = e.i(68886);
      let rl = /* @__PURE__ */ new Map(), rc = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = rl.get(r10), n10 = null == e11 ? void 0 : e11.expired;
          if ("number" == typeof n10 && n10 <= performance.timeOrigin + performance.now() && n10 > t10) return true;
        }
        return false;
      }, ru = (e10, t10) => {
        for (let r10 of e10) {
          let e11 = rl.get(r10), n10 = (null == e11 ? void 0 : e11.stale) ?? 0;
          if ("number" == typeof n10 && n10 > t10) return true;
        }
        return false;
      };
      class rd {
        constructor(e10) {
          this.fs = e10, this.tasks = [];
        }
        findOrCreateTask(e10) {
          for (let t11 of this.tasks) if (t11[0] === e10) return t11;
          let t10 = this.fs.mkdir(e10);
          t10.catch(() => {
          });
          let r10 = [e10, t10, []];
          return this.tasks.push(r10), r10;
        }
        append(e10, t10) {
          let r10 = this.findOrCreateTask(rs.default.dirname(e10)), n10 = r10[1].then(() => this.fs.writeFile(e10, t10));
          n10.catch(() => {
          }), r10[2].push(n10);
        }
        wait() {
          return Promise.all(this.tasks.flatMap((e10) => e10[2]));
        }
      }
      function rp(e10) {
        return (null == e10 ? void 0 : e10.length) || 0;
      }
      class rh {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        static #t = this.seedReads = /* @__PURE__ */ new Map();
        constructor(e10) {
          this.fs = e10.fs, this.flushToDisk = e10.flushToDisk, this.serverDistDir = e10.serverDistDir, this.revalidatedTags = e10.revalidatedTags, e10.maxMemoryCacheSize ? rh.memoryCache ? rh.debug && console.log("FileSystemCache: memory store already initialized") : (rh.debug && console.log("FileSystemCache: using memory store for fetch cache"), rh.memoryCache = function(e11) {
            return r || (r = new tW(e11, function({ value: e12 }, t10) {
              var r10, n10;
              let i10;
              if (e12) if (e12.kind === t$.REDIRECT) i10 = JSON.stringify(e12.props).length;
              else if (e12.kind === t$.IMAGE) throw Object.defineProperty(Error("invariant image should not be incremental-cache"), "__NEXT_ERROR_CODE", { value: "E501", enumerable: false, configurable: true });
              else i10 = e12.kind === t$.FETCH ? JSON.stringify(e12.data || "").length : e12.kind === t$.APP_ROUTE ? e12.body.length : e12.kind === t$.APP_PAGE ? Math.max(1, e12.html.length + rp(e12.rscData) + ((null == (r10 = e12.postponed) ? void 0 : r10.length) || 0) + function(e13) {
                if (!e13) return 0;
                let t11 = 0;
                for (let [r11, n11] of e13) t11 += r11.length + rp(n11);
                return t11;
              }(e12.segmentData)) : e12.html.length + ((null == (n10 = JSON.stringify(e12.pageData)) ? void 0 : n10.length) || 0);
              else i10 = 25;
              return t10.length + i10;
            })), r;
          }(e10.maxMemoryCacheSize)) : rh.debug && console.log("FileSystemCache: not using memory store for fetch cache");
        }
        resetRequestCache() {
        }
        getSeedReadState(e10) {
          return rh.seedReads.get(`${this.serverDistDir}:${e10}`);
        }
        beginSeedRead(e10) {
          let t10 = `${this.serverDistDir}:${e10}`, r10 = rh.seedReads.get(t10);
          return r10 || (r10 = { readers: 0, version: 0 }, rh.seedReads.set(t10, r10)), r10.readers++, { stateKey: t10, state: r10, version: r10.version };
        }
        finishSeedRead(e10, t10) {
          t10.readers--, 0 !== t10.readers || t10.promotion || rh.seedReads.delete(e10);
        }
        async revalidateTag(e10, t10) {
          if (e10 = "string" == typeof e10 ? [e10] : e10, rh.debug && console.log("FileSystemCache: revalidateTag", e10, t10), 0 === e10.length) return;
          let r10 = Date.now();
          for (let n10 of e10) {
            let e11 = rl.get(n10) || {};
            if (t10) {
              let i10 = { ...e11 };
              i10.stale = r10, void 0 !== t10.expire && (i10.expired = r10 + 1e3 * t10.expire), rl.set(n10, i10);
            } else rl.set(n10, { ...e11, expired: r10 });
          }
        }
        async get(...e10) {
          var t10, r10, n10, i10, a10, o10, s10, l10, c2, u2;
          let d2, [p2, h2] = e10, { kind: f2 } = h2, g2 = null == (t10 = rh.memoryCache) ? void 0 : t10.get(p2), m2 = null == (r10 = this.getSeedReadState(p2)) ? void 0 : r10.promotion;
          !g2 && m2 && (await m2, g2 = null == (s10 = rh.memoryCache) ? void 0 : s10.get(p2)), rh.debug && (f2 === tD.FETCH ? console.log("FileSystemCache: get", p2, h2.tags, f2, !!g2) : console.log("FileSystemCache: get", p2, f2, !!g2));
          let y2 = f2 === tD.PAGES || f2 === tD.APP_PAGE || f2 === tD.APP_ROUTE;
          if (!g2 && y2 && p2.startsWith(`/${tI}/`), (null == g2 || null == (n10 = g2.value) ? void 0 : n10.kind) === t$.APP_PAGE || (null == g2 || null == (i10 = g2.value) ? void 0 : i10.kind) === t$.APP_ROUTE || (null == g2 || null == (a10 = g2.value) ? void 0 : a10.kind) === t$.PAGES) {
            let e11 = null == (l10 = g2.value.headers) ? void 0 : l10[T];
            if ("string" == typeof e11) {
              let t11 = e11.split(",");
              if (t11.length > 0 && rc(t11, g2.lastModified)) return rh.debug && console.log("FileSystemCache: expired tags", t11), d2 && this.finishSeedRead(d2.stateKey, d2.state), null;
            }
          } else if ((null == g2 || null == (o10 = g2.value) ? void 0 : o10.kind) === t$.FETCH) {
            let e11 = h2.kind === tD.FETCH ? [...h2.tags || [], ...h2.softTags || []] : [];
            if (e11.some((e12) => this.revalidatedTags.includes(e12))) return rh.debug && console.log("FileSystemCache: was revalidated", e11), null;
            if (rc(e11, g2.lastModified)) return rh.debug && console.log("FileSystemCache: expired tags", e11), null;
          }
          if (d2 && g2) {
            let { stateKey: e11, state: t11, version: r11 } = d2;
            try {
              t11.version === r11 && (await this.promoteSeed(p2, p2, g2, h2, e11, t11, r11), t11.version !== r11 || (null == (c2 = rh.memoryCache) ? void 0 : c2.get(p2)) || null == (u2 = rh.memoryCache) || u2.set(p2, g2));
            } finally {
              this.finishSeedRead(e11, t11);
            }
          }
          return g2 ?? null;
        }
        async promoteSeed(e10, t10, r10, n10, i10, a10, o10) {
          let s10 = this.fs.writeFileAtomic;
          if (!this.flushToDisk || !s10 || !r10.value) return;
          if (a10.promotion) return void await a10.promotion;
          let l10 = (async () => {
            let i11 = r10.value;
            if (!i11 || a10.version !== o10 || i11.kind !== t$.PAGES && i11.kind !== t$.APP_PAGE && i11.kind !== t$.APP_ROUTE) return;
            let l11 = n10.kind, c2 = this.getFilePath(i11.kind === t$.APP_ROUTE ? `${e10}.body` : `${e10}.html`, l11);
            if (this.fs.existsSync(c2)) return;
            let u2 = this.getFilePath(i11.kind === t$.APP_ROUTE ? `${t10}.body` : `${t10}.html`, l11), d2 = u2.replace(i11.kind === t$.APP_ROUTE ? /\.body$/ : /\.html$/, k), p2 = JSON.parse(await this.fs.readFile(d2, "utf8"));
            p2.routeCacheLastModified = r10.lastModified;
            let h2 = [];
            i11.kind !== t$.PAGES || n10.isFallback ? i11.kind === t$.APP_PAGE && (n10.isFallback || n10.isRoutePPREnabled && null != p2.postponed || h2.push({ path: this.getFilePath(`${e10}${x}`, l11), data: await this.fs.readFile(this.getFilePath(`${t10}${x}`, l11)) }), h2.push(...await Promise.all((p2.segmentPaths ?? []).map(async (r11) => ({ path: this.getFilePath(e10 + _ + r11 + E, l11), data: await this.fs.readFile(this.getFilePath(t10 + _ + r11 + E, l11)) }))))) : h2.push({ path: this.getFilePath(`${e10}${S}`, l11), data: await this.fs.readFile(this.getFilePath(`${t10}${S}`, l11)) });
            let f2 = new rd(this.fs);
            for (let e11 of h2) f2.append(e11.path, e11.data);
            if (await f2.wait(), a10.version !== o10) return;
            let g2 = c2.replace(i11.kind === t$.APP_ROUTE ? /\.body$/ : /\.html$/, k);
            await this.fs.mkdir(rs.default.dirname(g2)), await this.fs.writeFile(g2, JSON.stringify(p2)), a10.version !== o10 || this.fs.existsSync(c2) || await s10.call(this.fs, c2, await this.fs.readFile(u2));
          })();
          a10.promotion = l10.catch((e11) => {
            rh.debug && console.log("FileSystemCache: failed to promote build seed", e11);
          });
          try {
            await a10.promotion;
          } finally {
            a10.promotion && (a10.promotion = void 0), 0 === a10.readers && rh.seedReads.delete(i10);
          }
        }
        async set(e10, t10, r10) {
          var n10;
          let i10 = this.getSeedReadState(e10);
          if (i10 && i10.version++, null == (n10 = rh.memoryCache) || n10.set(e10, { value: t10, lastModified: Date.now() }), rh.debug && console.log("FileSystemCache: set", e10), !this.flushToDisk || !t10) return;
          await (null == i10 ? void 0 : i10.promotion);
          let a10 = new rd(this.fs);
          if (t10.kind === t$.APP_ROUTE) {
            let r11 = this.getFilePath(`${e10}.body`, tD.APP_ROUTE);
            a10.append(r11, t10.body);
            let n11 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
            a10.append(r11.replace(/\.body$/, k), JSON.stringify(n11, null, 2));
          } else if (t10.kind === t$.PAGES || t10.kind === t$.APP_PAGE) {
            let n11 = t10.kind === t$.APP_PAGE, i11 = this.getFilePath(`${e10}.html`, n11 ? tD.APP_PAGE : tD.PAGES);
            if (a10.append(i11, t10.html), r10.fetchCache || r10.isFallback || r10.isRoutePPREnabled || a10.append(this.getFilePath(`${e10}${n11 ? x : S}`, n11 ? tD.APP_PAGE : tD.PAGES), n11 ? t10.rscData : JSON.stringify(t10.pageData)), (null == t10 ? void 0 : t10.kind) === t$.APP_PAGE) {
              let e11;
              if (t10.segmentData) {
                e11 = [];
                let r12 = i11.replace(/\.html$/, _);
                for (let [n12, i12] of t10.segmentData) {
                  e11.push(n12);
                  let t11 = r12 + n12 + E;
                  a10.append(t11, i12);
                }
              }
              let r11 = { headers: t10.headers, status: t10.status, postponed: t10.postponed, segmentPaths: e11, prefetchHints: void 0 };
              a10.append(i11.replace(/\.html$/, k), JSON.stringify(r11));
            } else {
              let e11 = { headers: t10.headers, status: t10.status, postponed: void 0, segmentPaths: void 0, prefetchHints: void 0 };
              a10.append(i11.replace(/\.html$/, k), JSON.stringify(e11));
            }
          } else if (t10.kind === t$.FETCH) {
            let n11 = this.getFilePath(e10, tD.FETCH);
            a10.append(n11, JSON.stringify({ ...t10, tags: r10.fetchCache ? r10.tags : [] }));
          }
          await a10.wait();
        }
        getFilePath(e10, t10) {
          let r10;
          switch (t10) {
            case tD.FETCH:
              r10 = rs.default.join(this.serverDistDir, "..", "cache", "fetch-cache");
              break;
            case tD.PAGES:
              r10 = rs.default.join(this.serverDistDir, "pages");
              break;
            case tD.IMAGE:
            case tD.APP_PAGE:
            case tD.APP_ROUTE:
              r10 = rs.default.join(this.serverDistDir, "app");
              break;
            default:
              throw Object.defineProperty(Error(`Unexpected file path kind: ${t10}`), "__NEXT_ERROR_CODE", { value: "E479", enumerable: false, configurable: true });
          }
          (t10 === tD.PAGES || t10 === tD.APP_PAGE || t10 === tD.APP_ROUTE) && e10.startsWith(`/${tI}/`) && (r10 = rs.default.join(this.serverDistDir, "."));
          let n10 = rs.default.join(r10, e10);
          if (!(n10.startsWith(r10 + rs.default.sep) || n10 === r10)) throw Object.defineProperty(Error(`Invalid file path: ${n10}`), "__NEXT_ERROR_CODE", { value: "E1468", enumerable: false, configurable: true });
          return n10;
        }
      }
      class rf {
        static #e = this.cacheControls = /* @__PURE__ */ new Map();
        constructor(e10, t10) {
          this.prerenderManifest = e10, this.locales = t10;
        }
        get(e10, t10) {
          let r10 = rf.cacheControls.get(tj(e10, t10));
          if (r10) return r10;
          let n10 = this.prerenderManifest.routes[e10];
          if (n10 && tU(e10, t10, n10, this.locales)) {
            let { initialRevalidateSeconds: e11, initialExpireSeconds: t11 } = n10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
          let i10 = t10.kind === tO.PAGES ? z(e10, this.locales).pathname : e10, a10 = this.prerenderManifest.dynamicRoutes[i10];
          if (a10 && tU(e10, t10, a10, this.locales)) {
            let { fallbackRevalidate: e11, fallbackExpire: t11 } = a10;
            if (void 0 !== e11) return { revalidate: e11, expire: t11 };
          }
        }
        set(e10, t10) {
          rf.cacheControls.set(e10, t10);
        }
        clear() {
          rf.cacheControls.clear();
        }
      }
      function rg(e10) {
        let t10 = "buffer" in e10 ? new Uint8Array(e10.buffer, e10.byteOffset, e10.byteLength) : new Uint8Array(e10), r10 = "";
        for (let e11 of t10) r10 += e11.toString(16).padStart(2, "0");
        return r10;
      }
      async function rm(e10) {
        {
          let t10 = new TextEncoder().encode(e10);
          return rg(await crypto.subtle.digest("SHA-256", t10));
        }
      }
      e.i(67914);
      class ry {
        static #e = this.debug = !!process.env.NEXT_PRIVATE_DEBUG_CACHE;
        constructor({ fs: e10, dev: t10, flushToDisk: r10, minimalMode: n10, serverDistDir: i10, requestHeaders: a10, maxMemoryCacheSize: o10, getPrerenderManifest: s10, fetchCacheKeyPrefix: l10, CurCacheHandler: c2, allowedRevalidateHeaderKeys: u2, locales: d2 }) {
          var p2, h2, f2, g2;
          this.locks = /* @__PURE__ */ new Map(), this.hasCustomCacheHandler = !!c2;
          const m2 = Symbol.for("@next/cache-handlers"), y2 = globalThis;
          if (c2) ry.debug && console.log("IncrementalCache: using custom cache handler", c2.name);
          else {
            const t11 = y2[m2];
            (null == t11 ? void 0 : t11.FetchCache) ? (c2 = t11.FetchCache, ry.debug && console.log("IncrementalCache: using global FetchCache cache handler")) : e10 && i10 && (ry.debug && console.log("IncrementalCache: using filesystem cache handler"), c2 = rh);
          }
          process.env.__NEXT_TEST_MAX_ISR_CACHE && (o10 = parseInt(process.env.__NEXT_TEST_MAX_ISR_CACHE, 10)), this.dev = t10, this.disableForTestmode = "true" === process.env.NEXT_PRIVATE_TEST_PROXY, this.minimalMode = n10, this.requestHeaders = a10, this.allowedRevalidateHeaderKeys = u2, this.prerenderManifest = s10(), this.locales = d2, this.cacheControls = new rf(this.prerenderManifest, d2), this.fetchCacheKeyPrefix = l10;
          let b2 = [];
          a10[v] === (null == (h2 = this.prerenderManifest) || null == (p2 = h2.preview) ? void 0 : p2.previewModeId) && (this.isOnDemandRevalidate = true), n10 && (b2 = this.revalidatedTags = function(e11, t11) {
            return "string" == typeof e11[R] && e11["x-next-revalidate-tag-token"] === t11 ? e11[R].split(",") : [];
          }(a10, null == (g2 = this.prerenderManifest) || null == (f2 = g2.preview) ? void 0 : f2.previewModeId)), c2 && (this.cacheHandler = new c2({ dev: t10, fs: e10, flushToDisk: r10, serverDistDir: i10, revalidatedTags: b2, maxMemoryCacheSize: o10, _requestHeaders: a10, fetchCacheKeyPrefix: l10 }));
        }
        calculateRevalidate(e10, t10, r10, n10) {
          if (r10) return Math.floor(performance.timeOrigin + performance.now() - 1e3);
          let i10 = e10 ? e10.revalidate : !n10 && 1;
          return "number" == typeof i10 ? 1e3 * i10 + t10 : i10;
        }
        resetRequestCache() {
          var e10, t10;
          null == (t10 = this.cacheHandler) || null == (e10 = t10.resetRequestCache) || e10.call(t10);
        }
        async lock(e10) {
          for (; ; ) {
            let t11 = this.locks.get(e10);
            if (ry.debug && console.log("IncrementalCache: lock get", e10, !!t11), !t11) break;
            await t11;
          }
          let { resolve: t10, promise: r10 } = new tL();
          return ry.debug && console.log("IncrementalCache: successfully locked", e10), this.locks.set(e10, r10), () => {
            t10(), this.locks.delete(e10);
          };
        }
        async revalidateTag(e10, t10) {
          var r10;
          return null == (r10 = this.cacheHandler) ? void 0 : r10.revalidateTag(e10, t10);
        }
        async generateSimpleCacheKey(e10) {
          return rm(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10]));
        }
        async generateCacheKey(e10, t10 = {}) {
          let r10 = [], n10 = new TextEncoder(), i10 = null, a10 = t10.body;
          if (a10) if ("object" == typeof a10 && "byteLength" in a10) r10.push(`bytes:${rg(a10)}`), t10._ogBody = a10;
          else if ("function" == typeof a10.getReader) {
            let e11 = [];
            try {
              await a10.pipeTo(new WritableStream({ write(t11) {
                e11.push("string" == typeof t11 ? n10.encode(t11) : t11);
              } }));
              let i11 = e11.reduce((e12, t11) => e12 + t11.length, 0), o11 = new Uint8Array(i11), s10 = 0;
              for (let t11 of e11) o11.set(t11, s10), s10 += t11.length;
              r10.push(`bytes:${rg(o11)}`), t10._ogBody = o11;
            } catch (e12) {
              console.error("Problem reading body", e12);
            }
          } else if ("function" == typeof a10.keys) for (let [e11, n11] of (i10 = "[object FormData]" === String(a10) ? "multipart/form-data; boundary=" : "application/x-www-form-urlencoded;charset=UTF-8", t10._ogBody = a10, a10.entries())) r10.push(`key:${e11}`), "string" == typeof n11 ? r10.push(`str:${n11}`) : r10.push("file", n11.name, n11.type, `bytes:${rg(await n11.arrayBuffer())}`);
          else if ("function" == typeof a10.arrayBuffer) {
            let e11 = await a10.arrayBuffer();
            r10.push("blob", a10.type, `bytes:${rg(e11)}`), t10._ogBody = new Blob([e11], { type: a10.type }), i10 = a10.type;
          } else if ("string" == typeof a10) r10.push(`str:${a10}`), t10._ogBody = a10, i10 = "text/plain;charset=UTF-8";
          else throw Object.defineProperty(Error(`Unsupported body type: ${typeof a10}`), "__NEXT_ERROR_CODE", { value: "E1443", enumerable: false, configurable: true });
          let o10 = "function" == typeof (t10.headers || {}).keys ? Object.fromEntries(t10.headers) : Object.assign({}, t10.headers);
          return "traceparent" in o10 && delete o10.traceparent, "tracestate" in o10 && delete o10.tracestate, rm(JSON.stringify(["v4", this.fetchCacheKeyPrefix || "", e10, t10.method, i10, o10, t10.mode, t10.redirect, t10.credentials, t10.referrer, t10.referrerPolicy, t10.integrity, t10.cache, r10]));
        }
        async get(e10, t10) {
          var r10, n10, i10, a10, o10, s10, l10;
          let c2, u2;
          if (t10.kind === tD.IMAGE) throw new e7("Images must use the image optimizer cache");
          if (t10.kind === tD.FETCH) {
            let r11 = e5.getStore(), n11 = r11 ? e8(r11) : null;
            if (n11) {
              let r12 = n11.fetch.get(e10);
              if ((null == r12 ? void 0 : r12.kind) === t$.FETCH) {
                let n12 = eb.getStore();
                if (![...t10.tags || [], ...t10.softTags || []].some((e11) => {
                  var t11, r13;
                  return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == n12 || null == (r13 = n12.pendingRevalidatedTags) ? void 0 : r13.some((t12) => t12.tag === e11));
                })) return ry.debug && console.log("IncrementalCache: rdc:hit", e10), { isStale: false, value: r12 };
                ry.debug && console.log("IncrementalCache: rdc:revalidated-tag", e10);
              } else ry.debug && console.log("IncrementalCache: rdc:miss", e10);
            } else ry.debug && console.log("IncrementalCache: rdc:no-resume-data");
          }
          if (this.disableForTestmode || this.dev && (t10.kind !== tD.FETCH || "no-cache" === this.requestHeaders["cache-control"])) return null;
          let d2 = e10, p2 = t10;
          if (t10.kind !== tD.FETCH) {
            let { route: r11, ...n11 } = t10;
            d2 = tj(e10, r11), p2 = n11;
          }
          let h2 = await (null == (r10 = this.cacheHandler) ? void 0 : r10.get(d2, p2));
          if (t10.kind === tD.FETCH) {
            if (!h2) return null;
            if ((null == (i10 = h2.value) ? void 0 : i10.kind) !== t$.FETCH) throw Object.defineProperty(new e7(`Expected cached value for cache key ${JSON.stringify(e10)} to be a "FETCH" kind, got ${JSON.stringify(null == (a10 = h2.value) ? void 0 : a10.kind)} instead.`), "__NEXT_ERROR_CODE", { value: "E653", enumerable: false, configurable: true });
            let r11 = eb.getStore(), n11 = [...t10.tags || [], ...t10.softTags || []];
            if (n11.some((e11) => {
              var t11, n12;
              return (null == (t11 = this.revalidatedTags) ? void 0 : t11.includes(e11)) || (null == r11 || null == (n12 = r11.pendingRevalidatedTags) ? void 0 : n12.some((t12) => t12.tag === e11));
            })) return ry.debug && console.log("IncrementalCache: expired tag", e10), null;
            let o11 = e5.getStore();
            if (o11) {
              let t11 = e8(o11);
              (null == t11 ? void 0 : t11.mutable) && (ry.debug && console.log("IncrementalCache: rdc:set", e10), t11.fetch.set(e10, h2.value));
            }
            let s11 = t10.revalidate || h2.value.revalidate, l11 = (performance.timeOrigin + performance.now() - (h2.lastModified || 0)) / 1e3 > s11, c3 = h2.value.data;
            return rc(n11, h2.lastModified) ? null : (ru(n11, h2.lastModified) && (l11 = true), { isStale: l11, value: { kind: t$.FETCH, data: c3, revalidate: s11 } });
          }
          if ((null == h2 || null == (n10 = h2.value) ? void 0 : n10.kind) === t$.FETCH) throw Object.defineProperty(new e7(`Expected cached value for cache key ${JSON.stringify(e10)} not to be a ${JSON.stringify(t10.kind)} kind, got "FETCH" instead.`), "__NEXT_ERROR_CODE", { value: "E652", enumerable: false, configurable: true });
          let f2 = null, { isFallback: g2 } = t10, m2 = this.cacheControls.get(e10, t10.route);
          if ((null == h2 ? void 0 : h2.lastModified) === -1) c2 = -1, u2 = -31536e6;
          else {
            let e11 = performance.timeOrigin + performance.now(), r11 = (null == h2 ? void 0 : h2.lastModified) || e11;
            u2 = this.calculateRevalidate(m2, r11, this.dev ?? false, t10.isFallback);
            let n11 = "number" == typeof (null == m2 ? void 0 : m2.expire) ? 1e3 * m2.expire + r11 : void 0;
            if (void 0 !== n11 && n11 < e11) c2 = -1;
            else if (void 0 === (c2 = false !== u2 && u2 < e11 || void 0) && ((null == h2 || null == (o10 = h2.value) ? void 0 : o10.kind) === t$.APP_PAGE || (null == h2 || null == (s10 = h2.value) ? void 0 : s10.kind) === t$.APP_ROUTE)) {
              let e12 = null == (l10 = h2.value.headers) ? void 0 : l10[T];
              if ("string" == typeof e12) {
                let t11 = e12.split(",");
                t11.length > 0 && (rc(t11, r11) ? c2 = -1 : ru(t11, r11) && (c2 = true));
              }
            }
          }
          return h2 && (f2 = { isStale: c2, cacheControl: m2, revalidateAfter: u2, value: h2.value, isFallback: g2 }), !h2 && this.prerenderManifest.notFoundRoutes.includes(e10) && tU(e10, t10.route, this.prerenderManifest.routes[e10], this.locales) && (f2 = { isStale: c2, value: null, cacheControl: m2, revalidateAfter: u2, isFallback: g2 }, this.set(e10, f2.value, { ...t10, cacheControl: m2 })), f2;
        }
        async set(e10, t10, r10) {
          if ("kind" in r10 && r10.kind === tD.IMAGE) throw new e7("Images must use the image optimizer cache");
          if ((null == t10 ? void 0 : t10.kind) === t$.FETCH) {
            let r11 = e5.getStore(), n11 = r11 ? e8(r11) : null;
            (null == n11 ? void 0 : n11.mutable) && (ry.debug && console.log("IncrementalCache: rdc:set", e10), n11.fetch.set(e10, t10));
          }
          if (this.disableForTestmode || this.dev && !r10.fetchCache) return;
          let n10 = e10, i10 = r10;
          if (!r10.fetchCache) {
            let { route: t11, ...a11 } = r10;
            if (!t11) throw new e7("Response cache requires a source route");
            n10 = tj(e10, t11), i10 = a11;
          }
          let a10 = JSON.stringify(t10).length;
          if (r10.fetchCache && a10 > 2097152 && !this.hasCustomCacheHandler && !r10.isImplicitBuildTimeCache) {
            let t11 = `Failed to set Next.js data cache for ${r10.fetchUrl || e10}, items over 2MB can not be cached (${a10} bytes)`;
            if (this.dev) throw Object.defineProperty(Error(t11), "__NEXT_ERROR_CODE", { value: "E1003", enumerable: false, configurable: true });
            console.warn(t11);
            return;
          }
          try {
            var o10;
            !r10.fetchCache && r10.cacheControl && this.cacheControls.set(n10, r10.cacheControl), await (null == (o10 = this.cacheHandler) ? void 0 : o10.set(n10, t10, i10));
          } catch (t11) {
            console.warn("Failed to update prerender cache for", e10, t11);
          }
        }
      }
      var rb = function(e10, t10, r10, n10, i10) {
        if ("m" === n10) throw TypeError("Private method is not writable");
        if ("a" === n10 && !i10) throw TypeError("Private accessor was defined without a setter");
        if ("function" == typeof t10 ? e10 !== t10 || !i10 : !t10.has(e10)) throw TypeError("Cannot write private member to an object whose class did not declare it");
        return "a" === n10 ? i10.call(e10, r10) : i10 ? i10.value = r10 : t10.set(e10, r10), r10;
      }, rv = function(e10, t10, r10, n10) {
        if ("a" === r10 && !n10) throw TypeError("Private accessor was defined without a getter");
        if ("function" == typeof t10 ? e10 !== t10 || !n10 : !t10.has(e10)) throw TypeError("Cannot read private member from an object whose class did not declare it");
        return "m" === r10 ? n10 : "a" === r10 ? n10.call(e10) : n10 ? n10.value : t10.get(e10);
      };
      function rw(e10) {
        let t10 = e10 ? "__Secure-" : "";
        return { sessionToken: { name: `${t10}authjs.session-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, callbackUrl: { name: `${t10}authjs.callback-url`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, csrfToken: { name: `${e10 ? "__Host-" : ""}authjs.csrf-token`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, pkceCodeVerifier: { name: `${t10}authjs.pkce.code_verifier`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } }, state: { name: `${t10}authjs.state`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } }, nonce: { name: `${t10}authjs.nonce`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10 } }, webauthnChallenge: { name: `${t10}authjs.challenge`, options: { httpOnly: true, sameSite: "lax", path: "/", secure: e10, maxAge: 900 } } };
      }
      class r_ {
        constructor(e10, t10, r10) {
          if (aV.add(this), aJ.set(this, {}), aG.set(this, void 0), aX.set(this, void 0), rb(this, aX, r10, "f"), rb(this, aG, e10, "f"), !t10) return;
          const { name: n10 } = e10;
          for (const [e11, r11] of Object.entries(t10)) e11.startsWith(n10) && r11 && (rv(this, aJ, "f")[e11] = r11);
        }
        get value() {
          return Object.keys(rv(this, aJ, "f")).sort((e10, t10) => parseInt(e10.split(".").pop() || "0") - parseInt(t10.split(".").pop() || "0")).map((e10) => rv(this, aJ, "f")[e10]).join("");
        }
        chunk(e10, t10) {
          let r10 = rv(this, aV, "m", aZ).call(this);
          for (let n10 of rv(this, aV, "m", aY).call(this, { name: rv(this, aG, "f").name, value: e10, options: { ...rv(this, aG, "f").options, ...t10 } })) r10[n10.name] = n10;
          return Object.values(r10);
        }
        clean() {
          return Object.values(rv(this, aV, "m", aZ).call(this));
        }
      }
      aJ = /* @__PURE__ */ new WeakMap(), aG = /* @__PURE__ */ new WeakMap(), aX = /* @__PURE__ */ new WeakMap(), aV = /* @__PURE__ */ new WeakSet(), aY = function(e10) {
        let t10 = Math.ceil(e10.value.length / 3936);
        if (1 === t10) return rv(this, aJ, "f")[e10.name] = e10.value, [e10];
        let r10 = [];
        for (let n10 = 0; n10 < t10; n10++) {
          let t11 = `${e10.name}.${n10}`, i10 = e10.value.substr(3936 * n10, 3936);
          r10.push({ ...e10, name: t11, value: i10 }), rv(this, aJ, "f")[t11] = i10;
        }
        return rv(this, aX, "f").debug("CHUNKING_SESSION_COOKIE", { message: "Session cookie exceeds allowed 4096 bytes.", emptyCookieSize: 160, valueSize: e10.value.length, chunks: r10.map((e11) => e11.value.length + 160) }), r10;
      }, aZ = function() {
        let e10 = {};
        for (let t10 in rv(this, aJ, "f")) delete rv(this, aJ, "f")?.[t10], e10[t10] = { name: t10, value: "", options: { ...rv(this, aG, "f").options, maxAge: 0 } };
        return e10;
      };
      class rE extends Error {
        constructor(e10, t10) {
          e10 instanceof Error ? super(void 0, { cause: { err: e10, ...e10.cause, ...t10 } }) : "string" == typeof e10 ? (t10 instanceof Error && (t10 = { err: t10, ...t10.cause }), super(e10, t10)) : super(void 0, e10), this.name = this.constructor.name, this.type = this.constructor.type ?? "AuthError", this.kind = this.constructor.kind ?? "error", Error.captureStackTrace?.(this, this.constructor);
          const r10 = `https://errors.authjs.dev#${this.type.toLowerCase()}`;
          this.message += `${this.message ? ". " : ""}Read more at ${r10}`;
        }
      }
      class rx extends rE {
      }
      rx.kind = "signIn";
      class rS extends rE {
      }
      rS.type = "AdapterError";
      class rk extends rE {
      }
      rk.type = "AccessDenied";
      class rT extends rE {
      }
      rT.type = "CallbackRouteError";
      class rR extends rE {
      }
      rR.type = "ErrorPageLoop";
      class rP extends rE {
      }
      rP.type = "EventError";
      class rC extends rE {
      }
      rC.type = "InvalidCallbackUrl";
      class rA extends rx {
        constructor() {
          super(...arguments), this.code = "credentials";
        }
      }
      rA.type = "CredentialsSignin";
      class rO extends rE {
      }
      rO.type = "InvalidEndpoints";
      class rI extends rE {
      }
      rI.type = "InvalidCheck";
      class rN extends rE {
      }
      rN.type = "JWTSessionError";
      class rU extends rE {
      }
      rU.type = "MissingAdapter";
      class rj extends rE {
      }
      rj.type = "MissingAdapterMethods";
      class r$ extends rE {
      }
      r$.type = "MissingAuthorize";
      class rD extends rE {
      }
      rD.type = "MissingSecret";
      class rL extends rx {
      }
      rL.type = "OAuthAccountNotLinked";
      class rM extends rx {
      }
      rM.type = "OAuthCallbackError";
      class rH extends rE {
      }
      rH.type = "OAuthProfileParseError";
      class rW extends rE {
      }
      rW.type = "SessionTokenError";
      class rB extends rE {
      }
      rB.type = "SignOutError";
      class rq extends rE {
      }
      rq.type = "UnknownAction";
      class rz extends rE {
      }
      rz.type = "UnsupportedStrategy";
      class rF extends rE {
      }
      rF.type = "InvalidProvider";
      class rK extends rE {
      }
      rK.type = "UntrustedHost";
      class rV extends rE {
      }
      rV.type = "Verification";
      class rJ extends rx {
      }
      rJ.type = "MissingCSRF";
      let rG = /* @__PURE__ */ new Set(["CredentialsSignin", "OAuthAccountNotLinked", "OAuthCallbackError", "AccessDenied", "Verification", "MissingCSRF", "AccountNotLinked", "WebAuthnVerificationError"]);
      class rX extends rE {
      }
      rX.type = "DuplicateConditionalUI";
      class rY extends rE {
      }
      rY.type = "MissingWebAuthnAutocomplete";
      class rZ extends rE {
      }
      rZ.type = "WebAuthnVerificationError";
      class rQ extends rx {
      }
      rQ.type = "AccountNotLinked";
      class r0 extends rE {
      }
      r0.type = "ExperimentalFeatureNotEnabled";
      let r1 = false;
      function r2(e10, t10) {
        try {
          return /^https?:/.test(new URL(e10, e10.startsWith("/") ? t10 : void 0).protocol);
        } catch {
          return false;
        }
      }
      let r3 = false, r4 = false, r5 = false, r6 = ["createVerificationToken", "useVerificationToken", "getUserByEmail"], r8 = ["createUser", "getUser", "getUserByEmail", "getUserByAccount", "updateUser", "linkAccount", "createSession", "getSessionAndUser", "updateSession", "deleteSession"], r9 = ["createUser", "getUser", "linkAccount", "getAccount", "getAuthenticator", "createAuthenticator", "listAuthenticatorsByUserId", "updateAuthenticatorCounter"], r7 = async (e10, t10, r10, n10, i10) => {
        let { crypto: { subtle: a10 } } = (() => {
          if ("u" > typeof globalThis) return globalThis;
          if ("u" > typeof self) return self;
          throw Error("unable to locate global object");
        })();
        return new Uint8Array(await a10.deriveBits({ name: "HKDF", hash: `SHA-${e10.substr(3)}`, salt: r10, info: n10 }, await a10.importKey("raw", t10, "HKDF", false, ["deriveBits"]), i10 << 3));
      };
      function ne(e10, t10) {
        if ("string" == typeof e10) return new TextEncoder().encode(e10);
        if (!(e10 instanceof Uint8Array)) throw TypeError(`"${t10}"" must be an instance of Uint8Array or a string`);
        return e10;
      }
      async function nt(e10, t10, r10, n10, i10) {
        return r7(function(e11) {
          switch (e11) {
            case "sha256":
            case "sha384":
            case "sha512":
            case "sha1":
              return e11;
            default:
              throw TypeError('unsupported "digest" value');
          }
        }(e10), function(e11) {
          let t11 = ne(e11, "ikm");
          if (!t11.byteLength) throw TypeError('"ikm" must be at least one byte in length');
          return t11;
        }(t10), ne(r10, "salt"), function(e11) {
          let t11 = ne(e11, "info");
          if (t11.byteLength > 1024) throw TypeError('"info" must not contain more than 1024 bytes');
          return t11;
        }(n10), function(e11, t11) {
          if ("number" != typeof e11 || !Number.isInteger(e11) || e11 < 1) throw TypeError('"keylen" must be a positive integer');
          if (e11 > 255 * (parseInt(t11.substr(3), 10) >> 3 || 20)) throw TypeError('"keylen" too large');
          return e11;
        }(i10, e10));
      }
      let nr = new TextEncoder(), nn = new TextDecoder(), ni = new TextDecoder("utf-8", { fatal: true });
      function na(...e10) {
        let t10 = new Uint8Array(e10.reduce((e11, { length: t11 }) => e11 + t11, 0)), r10 = 0;
        for (let n10 of e10) t10.set(n10, r10), r10 += n10.length;
        return t10;
      }
      function no(e10, t10, r10) {
        if (t10 < 0 || t10 >= 4294967296) throw RangeError(`value must be >= 0 and <= ${4294967296 - 1}. Received ${t10}`);
        e10.set([t10 >>> 24, t10 >>> 16, t10 >>> 8, 255 & t10], r10);
      }
      function ns(e10) {
        let t10 = Math.floor(e10 / 4294967296), r10 = new Uint8Array(8);
        return no(r10, t10, 0), no(r10, e10 % 4294967296, 4), r10;
      }
      function nl(e10) {
        let t10 = new Uint8Array(4);
        return no(t10, e10), t10;
      }
      function nc(e10) {
        let t10 = new Uint8Array(e10.length);
        for (let r10 = 0; r10 < e10.length; r10++) {
          let n10 = e10.charCodeAt(r10);
          if (n10 > 127) throw TypeError("non-ASCII string encountered in encode()");
          t10[r10] = n10;
        }
        return t10;
      }
      let nu = "The input to be decoded is not correctly encoded.";
      function nd(e10) {
        if (Uint8Array.fromBase64) try {
          return Uint8Array.fromBase64("string" == typeof e10 ? e10 : nn.decode(e10), { alphabet: "base64url" });
        } catch (e11) {
          throw TypeError(nu, { cause: e11 });
        }
        let t10 = e10;
        if (t10 instanceof Uint8Array && (t10 = nn.decode(t10)), t10.includes("+") || t10.includes("/")) throw TypeError(nu);
        t10 = t10.replace(/-/g, "+").replace(/_/g, "/");
        try {
          var r10 = t10;
          if (Uint8Array.fromBase64) return Uint8Array.fromBase64(r10);
          let e11 = atob(r10), n10 = new Uint8Array(e11.length);
          for (let t11 = 0; t11 < e11.length; t11++) n10[t11] = e11.charCodeAt(t11);
          return n10;
        } catch {
          throw TypeError(nu);
        }
      }
      function np(e10) {
        let t10 = e10;
        return ("string" == typeof t10 && (t10 = nr.encode(t10)), Uint8Array.prototype.toBase64) ? t10.toBase64({ alphabet: "base64url", omitPadding: true }) : function(e11) {
          if (Uint8Array.prototype.toBase64) return e11.toBase64();
          let t11 = [];
          for (let r10 = 0; r10 < e11.length; r10 += 32768) t11.push(String.fromCharCode.apply(null, e11.subarray(r10, r10 + 32768)));
          return btoa(t11.join(""));
        }(t10).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }
      function nh(e10) {
        if ("object" != typeof e10 || null === e10 || "[object Object]" !== Object.prototype.toString.call(e10)) return false;
        let t10 = Object.getPrototypeOf(e10);
        if (null === t10) return true;
        let r10 = t10;
        for (; null !== Object.getPrototypeOf(r10); ) r10 = Object.getPrototypeOf(r10);
        return t10 === r10;
      }
      function nf(...e10) {
        let t10 = /* @__PURE__ */ new Set();
        for (let r10 of e10) if (r10) for (let e11 of Object.keys(r10)) {
          if (t10.has(e11)) return false;
          t10.add(e11);
        }
        return true;
      }
      e.s(["decode", 0, nd, "encode", 0, np], 22423);
      let ng = (e10) => nh(e10) && "string" == typeof e10.kty, nm = Symbol();
      function ny(e10, t10) {
        if (e10) throw TypeError(`${t10} can only be called once`);
      }
      function nb(e10, t10, r10) {
        try {
          return nd(e10);
        } catch {
          throw new r10(`Failed to base64url decode the ${t10}`);
        }
      }
      async function nv(e10, t10) {
        let r10 = `SHA-${e10.slice(-3)}`;
        return new Uint8Array(await crypto.subtle.digest(r10, t10));
      }
      class nw extends Error {
        static code = "ERR_JOSE_GENERIC";
        code = "ERR_JOSE_GENERIC";
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class n_ extends nw {
        static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r10 = "unspecified", n10 = "unspecified") {
          super(e10, { cause: { claim: r10, reason: n10, payload: t10 } }), this.claim = r10, this.reason = n10, this.payload = t10;
        }
      }
      class nE extends nw {
        static code = "ERR_JWT_EXPIRED";
        code = "ERR_JWT_EXPIRED";
        claim;
        reason;
        payload;
        constructor(e10, t10, r10 = "unspecified", n10 = "unspecified") {
          super(e10, { cause: { claim: r10, reason: n10, payload: t10 } }), this.claim = r10, this.reason = n10, this.payload = t10;
        }
      }
      class nx extends nw {
        static code = "ERR_JOSE_ALG_NOT_ALLOWED";
        code = "ERR_JOSE_ALG_NOT_ALLOWED";
      }
      class nS extends nw {
        static code = "ERR_JOSE_NOT_SUPPORTED";
        code = "ERR_JOSE_NOT_SUPPORTED";
      }
      class nk extends nw {
        static code = "ERR_JWE_DECRYPTION_FAILED";
        code = "ERR_JWE_DECRYPTION_FAILED";
        constructor(e10 = "decryption operation failed", t10) {
          super(e10, t10);
        }
      }
      class nT extends nw {
        static code = "ERR_JWE_INVALID";
        code = "ERR_JWE_INVALID";
      }
      class nR extends nw {
        static code = "ERR_JWT_INVALID";
        code = "ERR_JWT_INVALID";
      }
      class nP extends nw {
        static code = "ERR_JWK_INVALID";
        code = "ERR_JWK_INVALID";
      }
      let nC = (e10, t10 = "algorithm.name") => TypeError(`CryptoKey does not support this operation, its ${t10} must be ${e10}`);
      function nA(e10, t10) {
        if (t10 && !e10.usages.includes(t10)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${t10}.`);
      }
      function nO(e10, t10, r10) {
        let n10 = e10.algorithm;
        if (n10.name !== t10.name) throw nC(t10.name);
        if (t10.hash && n10.hash?.name !== t10.hash) throw nC(t10.hash, "algorithm.hash");
        if (t10.namedCurve && n10.namedCurve !== t10.namedCurve) throw nC(t10.namedCurve, "algorithm.namedCurve");
        if (void 0 !== t10.length && n10.length !== t10.length) throw nC(t10.length, "algorithm.length");
        nA(e10, r10);
      }
      function nI(e10, t10, ...r10) {
        if (r10.length > 2) {
          let t11 = r10.pop();
          e10 += `one of type ${r10.join(", ")}, or ${t11}.`;
        } else 2 === r10.length ? e10 += `one of type ${r10[0]} or ${r10[1]}.` : e10 += `of type ${r10[0]}.`;
        return null == t10 ? e10 += ` Received ${t10}` : "function" == typeof t10 && t10.name ? e10 += ` Received function ${t10.name}` : "object" == typeof t10 && null != t10 && t10.constructor?.name && (e10 += ` Received an instance of ${t10.constructor.name}`), e10;
      }
      let nN = (e10, ...t10) => nI("Key must be ", e10, ...t10), nU = (e10, t10, ...r10) => nI(`Key for the ${e10} algorithm must be `, t10, ...r10);
      function nj(e10) {
        if (!n$(e10)) throw Error("CryptoKey instance expected");
      }
      let n$ = (e10) => {
        if (e10?.[Symbol.toStringTag] === "CryptoKey") return true;
        try {
          return e10 instanceof CryptoKey;
        } catch {
          return false;
        }
      }, nD = (e10) => e10?.[Symbol.toStringTag] === "KeyObject", nL = (e10) => n$(e10) || nD(e10), nM = (e10) => crypto.getRandomValues(new Uint8Array(e10.cekBits >> 3));
      function nH(e10, t10) {
        let r10 = e10.byteLength << 3;
        if (r10 !== t10) throw new nT(`Invalid Content Encryption Key length. Expected ${t10} bits, got ${r10} bits`);
      }
      function nW(e10, t10) {
        if (t10.length << 3 !== e10.ivBits) throw new nT("Invalid Initialization Vector length");
      }
      async function nB(e10, t10, r10) {
        if (!(t10 instanceof Uint8Array)) throw TypeError(nN(t10, "Uint8Array"));
        let n10 = e10.cekBits >> 1;
        return [await crypto.subtle.importKey("raw", t10.subarray(n10 >> 3), "AES-CBC", false, [r10]), await crypto.subtle.importKey("raw", t10.subarray(0, n10 >> 3), { hash: `SHA-${n10 << 1}`, name: "HMAC" }, false, ["sign"]), n10];
      }
      async function nq(e10, t10, r10) {
        return new Uint8Array((await crypto.subtle.sign("HMAC", e10, t10)).slice(0, r10 >> 3));
      }
      async function nz(e10, t10, r10, n10, i10) {
        let [a10, o10, s10] = await nB(e10, r10, "encrypt"), l10 = new Uint8Array(await crypto.subtle.encrypt({ iv: n10, name: "AES-CBC" }, a10, t10)), c2 = na(i10, n10, l10, ns(8 * i10.length));
        return { ciphertext: l10, tag: await nq(o10, c2, s10), iv: n10 };
      }
      async function nF(e10, t10) {
        let r10 = { name: "HMAC", hash: "SHA-256" }, n10 = await crypto.subtle.generateKey(r10, false, ["sign", "verify"]), i10 = await crypto.subtle.sign(r10, n10, e10);
        return crypto.subtle.verify(r10, n10, i10, t10);
      }
      async function nK(e10, t10, r10, n10, i10, a10) {
        let o10, s10, [l10, c2, u2] = await nB(e10, t10, "decrypt"), d2 = na(a10, n10, r10, ns(8 * a10.length)), p2 = await nq(c2, d2, u2);
        try {
          o10 = await nF(i10, p2);
        } catch {
        }
        if (!o10) throw new nk();
        try {
          s10 = new Uint8Array(await crypto.subtle.decrypt({ iv: n10, name: "AES-CBC" }, l10, r10));
        } catch {
        }
        if (!s10) throw new nk();
        return s10;
      }
      async function nV(e10, t10, r10, n10, i10) {
        let a10 = r10 instanceof Uint8Array ? await crypto.subtle.importKey("raw", r10, "AES-GCM", false, ["encrypt"]) : (nO(r10, e10.subtle, "encrypt"), r10), o10 = new Uint8Array(await crypto.subtle.encrypt({ additionalData: i10, iv: n10, name: "AES-GCM", tagLength: 128 }, a10, t10)), s10 = o10.slice(-16);
        return { ciphertext: o10.slice(0, -16), tag: s10, iv: n10 };
      }
      async function nJ(e10, t10, r10, n10, i10, a10) {
        let o10 = t10 instanceof Uint8Array ? await crypto.subtle.importKey("raw", t10, "AES-GCM", false, ["decrypt"]) : (nO(t10, e10.subtle, "decrypt"), t10);
        try {
          return new Uint8Array(await crypto.subtle.decrypt({ additionalData: a10, iv: n10, name: "AES-GCM", tagLength: 128 }, o10, na(r10, i10)));
        } catch {
          throw new nk();
        }
      }
      async function nG(e10, t10, r10, n10, i10) {
        if (!n$(r10) && !(r10 instanceof Uint8Array)) throw TypeError(nN(r10, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
        if (n10) nW(e10, n10);
        else n10 = crypto.getRandomValues(new Uint8Array(e10.ivBits >> 3));
        return r10 instanceof Uint8Array && nH(r10, e10.cekBits), e10.cbc ? nz(e10, t10, r10, n10, i10) : nV(e10, t10, r10, n10, i10);
      }
      async function nX(e10, t10, r10, n10, i10, a10) {
        if (!n$(t10) && !(t10 instanceof Uint8Array)) throw TypeError(nN(t10, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
        if (!n10) throw new nT("JWE Initialization Vector missing");
        if (!i10) throw new nT("JWE Authentication Tag missing");
        return nW(e10, n10), t10 instanceof Uint8Array && nH(t10, e10.cekBits), e10.cbc ? nK(e10, t10, r10, n10, i10, a10) : nJ(e10, t10, r10, n10, i10, a10);
      }
      async function nY(e10, t10) {
        if ("RSA" === t10.kty && "oth" in t10 && void 0 !== t10.oth) throw new nS('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
        if (!e10.kty.includes(t10.kty)) throw new nS('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
        let r10 = e10.resolve?.({ kty: t10.kty, crv: t10.crv }) ?? e10.subtle, n10 = !!(t10.d || t10.priv), i10 = { ...t10 };
        return "AKP" !== i10.kty && delete i10.alg, delete i10.use, crypto.subtle.importKey("jwk", i10, r10, t10.ext ?? !n10, t10.key_ops ?? e10.usages[+!!n10]);
      }
      let nZ = (e10) => e10[Symbol.toStringTag], nQ = { __proto__: null, prime256v1: "P-256", secp384r1: "P-384", secp521r1: "P-521" };
      function n0(e10, t10, r10) {
        let i10 = (n ||= /* @__PURE__ */ new WeakMap()).get(e10);
        return r10 && (i10 ? i10[t10] = r10 : n.set(e10, { [t10]: r10 })), r10 ?? i10?.[t10];
      }
      let n1 = async (e10, t10, r10) => n0(e10, r10.alg) ?? n0(e10, r10.alg, await nY(r10, { ...t10, alg: r10.alg }));
      async function n2(e10, t10, r10) {
        let n10 = function(e11, t11, r11) {
          let { alg: n11, secret: i10 } = e11, a10 = "decrypt" === r11 || "sign" === r11;
          if (i10 && t11 instanceof Uint8Array) return [0, t11];
          if (ng(t11)) {
            if (i10 ? "oct" !== t11.kty || "string" != typeof t11.k : !(a10 ? "oct" !== t11.kty && ("AKP" === t11.kty && "string" == typeof t11.priv || "string" == typeof t11.d) : "oct" !== t11.kty && void 0 === t11.d && void 0 === t11.priv)) throw TypeError(i10 ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${a10 ? "private" : "public"} JWK`);
            return ((e12, t12, r12) => {
              let { alg: n12 } = e12;
              if (void 0 !== t12.use) {
                let e13 = "sign" === r12 || "verify" === r12 ? "sig" : "enc";
                if (t12.use !== e13) throw TypeError(`Invalid key for this operation, its "use" must be "${e13}" when present`);
              }
              if (void 0 !== t12.alg && t12.alg !== n12) throw TypeError(`Invalid key for this operation, its "alg" must be "${n12}" when present`);
              if (Array.isArray(t12.key_ops)) {
                let n13 = "encrypt" === r12 || "decrypt" === r12 ? e12.ops?.[+("encrypt" !== r12)] : r12;
                if (n13 && !t12.key_ops.includes(n13)) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${n13}" when present`);
              }
            })(e11, t11, r11), [3, t11];
          }
          if (!nL(t11)) throw TypeError(i10 ? nU(n11, t11, "CryptoKey", "KeyObject", "JSON Web Key", "Uint8Array") : nU(n11, t11, "CryptoKey", "KeyObject", "JSON Web Key"));
          if (i10) {
            if ("secret" !== t11.type) throw TypeError(`${nZ(t11)} instances for symmetric algorithms must be of type "secret"`);
          } else {
            if ("secret" === t11.type) throw TypeError(`${nZ(t11)} instances for asymmetric algorithms must not be of type "secret"`);
            let e12 = a10 ? "private" : "public";
            if (("public" === t11.type || "private" === t11.type) && t11.type !== e12) {
              let n12 = "sign" === r11 ? "signing" : "verify" === r11 ? "verifying" : `${r11.slice(0, -1)}tion`;
              throw TypeError(`${nZ(t11)} instances for asymmetric algorithm ${n12} must be of type "${e12}"`);
            }
          }
          return n$(t11) ? [1, t11] : [2, t11];
        }(e10, t10, r10);
        switch (n10[0]) {
          case 0:
          case 1:
            return n10[1];
          case 3: {
            let t11 = n10[1];
            if (t11.k) return nd(t11.k);
            if (!Object.isFrozen(t11)) {
              let { key_ops: e11 } = t11;
              Array.isArray(e11) && Object.freeze(e11), Object.freeze(t11);
            }
            return n1(t11, t11, e10);
          }
          case 2: {
            let t11 = n10[1];
            if ("secret" === t11.type) return t11.export();
            if ("toCryptoKey" in t11 && "function" == typeof t11.toCryptoKey) return ((e11, t12) => {
              let r11 = n0(e11, t12.alg);
              if (r11) return r11;
              let n11 = "public" === e11.type, i10 = t12.usages[+!n11], { asymmetricKeyType: a10 } = e11, o10 = nQ[e11.asymmetricKeyDetails?.namedCurve], s10 = t12.resolve?.({ crv: o10, asymmetricKeyType: a10 }) ?? t12.subtle;
              return n0(e11, t12.alg, e11.toCryptoKey(s10, n11, i10));
            })(t11, e10);
            return n1(t11, t11.export({ format: "jwk" }), e10);
          }
        }
      }
      function n3(e10) {
        let t10 = { __proto__: null };
        for (let r10 in e10) t10[r10] = { ...e10[r10], alg: r10 };
        return t10;
      }
      let n4 = [["encrypt", "wrapKey"], ["decrypt", "unwrapKey"]], n5 = [[], ["deriveBits"]], n6 = [[], []];
      function n8(e10) {
        return { kty: ["RSA"], subtle: { name: "RSA-OAEP", hash: `SHA-${e10}` }, usages: n4, ops: ["wrapKey", "unwrapKey"] };
      }
      function n9() {
        return { kty: ["EC", "OKP"], subtle: { name: "ECDH" }, resolve: ({ kty: e10, crv: t10, asymmetricKeyType: r10 }) => {
          if ("X25519" === t10 || "x25519" === r10) return { name: "X25519" };
          if ("OKP" === e10) throw new nS('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
          return { name: "ECDH", namedCurve: t10 };
        }, usages: n5, ops: [void 0, "deriveBits"] };
      }
      function n7(e10, t10 = false) {
        return { kty: ["oct"], secret: true, subtle: { name: t10 ? "AES-GCM" : "AES-KW", length: e10 }, usages: n6, ops: t10 ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"] };
      }
      function ie() {
        return { kty: ["oct"], secret: true, subtle: { name: "PBKDF2" }, usages: n6, ops: ["deriveBits", "deriveBits"] };
      }
      let it = n3({ dir: { kty: ["oct"], secret: true, subtle: { name: "AES-GCM" }, usages: n6, ops: ["encrypt", "decrypt"] }, "RSA-OAEP": n8(1), "RSA-OAEP-256": n8(256), "RSA-OAEP-384": n8(384), "RSA-OAEP-512": n8(512), "ECDH-ES": n9(), "ECDH-ES+A128KW": n9(), "ECDH-ES+A192KW": n9(), "ECDH-ES+A256KW": n9(), A128KW: n7(128), A192KW: n7(192), A256KW: n7(256), A128GCMKW: n7(128, true), A192GCMKW: n7(192, true), A256GCMKW: n7(256, true), "PBES2-HS256+A128KW": ie(), "PBES2-HS384+A192KW": ie(), "PBES2-HS512+A256KW": ie() }), ir = ["encrypt", "decrypt"];
      function ii(e10, t10 = false) {
        return { kty: ["oct"], secret: true, subtle: { name: t10 ? "AES-CBC" : "AES-GCM", length: e10 }, usages: n6, ops: ir, cekBits: e10, ivBits: t10 ? 128 : 96, cbc: t10 };
      }
      let ia = n3({ A128GCM: ii(128), A192GCM: ii(192), A256GCM: ii(256), "A128CBC-HS256": ii(256, true), "A192CBC-HS384": ii(384, true), "A256CBC-HS512": ii(512, true) });
      function io(e10) {
        let t10 = it[e10];
        if (!t10) throw new nS('Invalid or unsupported "alg" (JWE Algorithm) header value');
        return t10;
      }
      function is(e10) {
        let t10 = ia[e10];
        if (!t10) throw new nS(`Unsupported JWE Algorithm: ${e10}`);
        return t10;
      }
      function il(e10, t10) {
        if ("ECDH" !== e10.algorithm.name && "X25519" !== e10.algorithm.name) throw TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
        nA(e10, t10);
      }
      async function ic(e10, t10, r10) {
        let n10 = io(t10).subtle, i10 = e10 instanceof Uint8Array ? await crypto.subtle.importKey("raw", e10, "AES-KW", true, [r10]) : e10;
        return nO(i10, n10, r10), i10;
      }
      async function iu(e10, t10, r10) {
        let n10 = await ic(t10, e10, "wrapKey"), i10 = await crypto.subtle.importKey("raw", r10, { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
        return new Uint8Array(await crypto.subtle.wrapKey("raw", i10, n10, "AES-KW"));
      }
      async function id(e10, t10, r10) {
        let n10 = await ic(t10, e10, "unwrapKey"), i10 = await crypto.subtle.unwrapKey("raw", r10, n10, "AES-KW", { hash: "SHA-256", name: "HMAC" }, true, ["sign"]);
        return new Uint8Array(await crypto.subtle.exportKey("raw", i10));
      }
      function ip(e10, t10, r10) {
        nO(t10, io(e10).subtle, r10), function(e11, t11) {
          let { modulusLength: r11 } = t11.algorithm;
          if ("number" != typeof r11 || r11 < 2048) throw TypeError(`${e11} requires key modulusLength to be 2048 bits or larger`);
        }(e10, t10);
      }
      async function ih(e10, t10, r10, n10) {
        if (!(e10 instanceof Uint8Array) || e10.length < 8) throw new nT("PBES2 Salt Input must be 8 or more octets");
        if (!Number.isSafeInteger(r10) || 1 !== Math.sign(r10)) throw new nT("PBES2 Count Input must be a positive integer");
        let i10 = na(nc(t10), Uint8Array.of(0), e10), a10 = parseInt(t10.slice(13, 16), 10), o10 = { hash: `SHA-${t10.slice(8, 11)}`, iterations: r10, name: "PBKDF2", salt: i10 }, s10 = await (n10 instanceof Uint8Array ? crypto.subtle.importKey("raw", n10, "PBKDF2", false, ["deriveBits"]) : (nO(n10, io(t10).subtle, "deriveBits"), n10));
        return new Uint8Array(await crypto.subtle.deriveBits(o10, s10, a10));
      }
      function ig(e10) {
        return na(nl(e10.length), e10);
      }
      async function im(e10, t10, r10) {
        let n10 = t10 >> 3, i10 = Math.ceil(n10 / 32), a10 = new Uint8Array(32 * i10);
        for (let t11 = 1; t11 <= i10; t11++) {
          let n11 = await nv("sha256", na(nl(t11), e10, r10));
          a10.set(n11, (t11 - 1) * 32);
        }
        return a10.slice(0, n10);
      }
      async function iy(e10, t10, r10, n10, i10 = new Uint8Array(), a10 = new Uint8Array()) {
        il(e10), il(t10, "deriveBits");
        let o10 = na(ig(nc(r10)), ig(i10), ig(a10), nl(n10));
        return im(new Uint8Array(await crypto.subtle.deriveBits({ name: e10.algorithm.name, public: e10 }, t10, "X25519" === e10.algorithm.name ? 256 : Math.ceil(parseInt(e10.algorithm.namedCurve.slice(-3), 10) / 8) << 3)), n10, o10);
      }
      function ib(e10) {
        nj(e10);
        let t10 = e10.algorithm.namedCurve;
        if ("P-256" !== t10 && "P-384" !== t10 && "P-521" !== t10 && "X25519" !== e10.algorithm.name) throw new nS("ECDH with the provided key is not allowed or not supported by your javascript runtime");
      }
      function iv(e10) {
        if (void 0 === e10) throw new nT("JWE Encrypted Key missing");
      }
      function iw(e10) {
        if (void 0 !== e10) throw new nT("Encountered unexpected JWE Encrypted Key");
      }
      async function i_(e10, t10, r10, n10, i10, a10) {
        let o10 = io(e10);
        if ("dir" === e10) return iw(n10), r10;
        switch (o10.subtle.name) {
          case "ECDH": {
            let a11, s10;
            if ("ECDH-ES" === e10 && iw(n10), !nh(i10.epk)) throw new nT('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
            ib(r10);
            let l10 = await nY(o10, i10.epk);
            if (void 0 !== i10.apu) {
              if ("string" != typeof i10.apu) throw new nT('JOSE Header "apu" (Agreement PartyUInfo) invalid');
              a11 = nb(i10.apu, "apu", nT);
            }
            if (void 0 !== i10.apv) {
              if ("string" != typeof i10.apv) throw new nT('JOSE Header "apv" (Agreement PartyVInfo) invalid');
              s10 = nb(i10.apv, "apv", nT);
            }
            let c2 = await iy(l10, r10, "ECDH-ES" === e10 ? t10.alg : e10, "ECDH-ES" === e10 ? t10.cekBits : parseInt(e10.slice(-5, -2), 10), a11, s10);
            if ("ECDH-ES" === e10) return c2;
            return iv(n10), id(e10.slice(-6), c2, n10);
          }
          case "RSA-OAEP":
            return iv(n10), nj(r10), ip(e10, r10, "decrypt"), new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", r10, n10));
          case "PBKDF2": {
            if (iv(n10), "number" != typeof i10.p2c) throw new nT('JOSE Header "p2c" (PBES2 Count) missing or invalid');
            let t11 = a10?.maxPBES2Count || 1e4;
            if (i10.p2c > t11) throw new nT('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
            if ("string" != typeof i10.p2s) throw new nT('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
            let o11 = nb(i10.p2s, "p2s", nT), s10 = await ih(o11, e10, i10.p2c, r10);
            return id(e10.slice(-6), s10, n10);
          }
          case "AES-KW":
            return iv(n10), id(e10, r10, n10);
          case "AES-GCM": {
            let t11, a11;
            if (iv(n10), "string" != typeof i10.iv) throw new nT('JOSE Header "iv" (Initialization Vector) missing or invalid');
            if ("string" != typeof i10.tag) throw new nT('JOSE Header "tag" (Authentication Tag) missing or invalid');
            return t11 = nb(i10.iv, "iv", nT), a11 = nb(i10.tag, "tag", nT), nX(is(e10.slice(0, -2)), r10, n10, t11, a11, new Uint8Array());
          }
        }
      }
      async function iE(e10, t10, r10, n10, i10 = {}) {
        let a10, o10, s10, l10 = io(e10);
        if ("dir" === e10) return [r10, void 0, void 0];
        switch (l10.subtle.name) {
          case "ECDH": {
            let c2;
            ib(r10);
            let { apu: u2, apv: d2 } = i10;
            c2 = i10.epk ? await n2(l10, i10.epk, "decrypt") : (await crypto.subtle.generateKey(r10.algorithm, true, ["deriveBits"])).privateKey;
            let p2 = crypto.subtle, h2 = c2;
            if (!h2.extractable) {
              if ("function" != typeof p2.getPublicKey) throw TypeError('CryptoKey for "epk" must be extractable');
              h2 = await p2.getPublicKey(c2, []);
            }
            let { x: f2, y: g2, crv: m2, kty: y2 } = await p2.exportKey("jwk", h2), b2 = await iy(r10, c2, "ECDH-ES" === e10 ? t10.alg : e10, "ECDH-ES" === e10 ? t10.cekBits : parseInt(e10.slice(-5, -2), 10), u2, d2);
            if (o10 = { epk: { x: f2, crv: m2, kty: y2 } }, "EC" === y2 && (o10.epk.y = g2), u2 && (o10.apu = np(u2)), d2 && (o10.apv = np(d2)), "ECDH-ES" === e10) {
              s10 = b2;
              break;
            }
            s10 = n10 || nM(t10);
            let v2 = e10.slice(-6);
            a10 = await iu(v2, b2, s10);
            break;
          }
          case "RSA-OAEP":
            s10 = n10 || nM(t10), nj(r10), ip(e10, r10, "encrypt"), a10 = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", r10, s10));
            break;
          case "PBKDF2": {
            s10 = n10 || nM(t10);
            let { p2c: l11 = 2048, p2s: c2 = crypto.getRandomValues(new Uint8Array(16)) } = i10, u2 = await ih(c2, e10, l11, r10);
            a10 = await iu(e10.slice(-6), u2, s10), o10 = { p2c: l11, p2s: np(c2) };
            break;
          }
          case "AES-KW":
            s10 = n10 || nM(t10), a10 = await iu(e10, r10, s10);
            break;
          case "AES-GCM": {
            s10 = n10 || nM(t10);
            let { iv: l11 } = i10, c2 = await nG(is(e10.slice(0, -2)), s10, r10, l11, new Uint8Array());
            a10 = c2.ciphertext, o10 = { iv: np(c2.iv), tag: np(c2.tag) };
          }
        }
        return [s10, a10, o10];
      }
      let ix = { __proto__: null };
      function iS(e10, t10) {
        if (void 0 !== t10 && (!Array.isArray(t10) || t10.some((e11) => "string" != typeof e11))) throw TypeError(`"${e10}" option must be an array of strings`);
        if (t10) return new Set(t10);
      }
      function ik(e10, t10, r10, n10, i10) {
        if (void 0 !== i10.crit && n10?.crit === void 0) throw new e10('"crit" (Critical) Header Parameter MUST be integrity protected');
        if (!n10 || void 0 === n10.crit) return [];
        if (!Array.isArray(n10.crit) || 0 === n10.crit.length || n10.crit.some((e11) => "string" != typeof e11 || 0 === e11.length)) throw new e10('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
        let a10 = void 0 === r10 ? t10 : { __proto__: null, ...r10, ...t10 };
        for (let t11 of n10.crit) {
          if (!(t11 in a10)) throw new nS(`Extension Header Parameter "${t11}" is not recognized`);
          if (!Object.hasOwn(i10, t11) || void 0 === i10[t11]) throw new e10(`Extension Header Parameter "${t11}" is missing`);
          if (a10[t11] && (!Object.hasOwn(n10, t11) || void 0 === n10[t11])) throw new e10(`Extension Header Parameter "${t11}" MUST be integrity protected`);
        }
        return n10.crit;
      }
      function iT(e10) {
        if (void 0 === globalThis[e10]) throw new nS(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${e10} API.`);
      }
      async function iR(e10) {
        iT("CompressionStream");
        let t10 = new CompressionStream("deflate-raw"), r10 = t10.writable.getWriter();
        r10.write(e10).catch(() => {
        }), r10.close().catch(() => {
        });
        let n10 = [], i10 = t10.readable.getReader();
        for (; ; ) {
          let { value: e11, done: t11 } = await i10.read();
          if (t11) break;
          n10.push(e11);
        }
        return na(...n10);
      }
      async function iP(e10, t10) {
        iT("DecompressionStream");
        let r10 = new DecompressionStream("deflate-raw"), n10 = r10.writable.getWriter();
        n10.write(e10).catch(() => {
        }), n10.close().catch(() => {
        });
        let i10 = [], a10 = 0, o10 = r10.readable.getReader();
        for (; ; ) {
          let { value: e11, done: r11 } = await o10.read();
          if (r11) break;
          if (i10.push(e11), a10 += e11.byteLength, t10 !== 1 / 0 && a10 > t10) throw new nT("Decompressed plaintext exceeded the configured limit");
        }
        return na(...i10);
      }
      async function iC(e10, t10, r10) {
        let n10, i10, a10, o10, [s10, l10, , c2] = t10, [u2, d2, p2, h2, f2, g2, m2, y2, , b2] = e10, v2 = d2, w2 = p2;
        if (g2 && ("dir" === l10 || "ECDH-ES" === l10)) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${l10}`);
        let _2 = io(l10), E2 = await n2("dir" === l10 ? c2 : _2, r10, "encrypt"), [x2, S2, k2] = await iE(l10, c2, E2, g2, y2);
        k2 && (b2 ? w2 = w2 ? { ...w2, ...k2 } : k2 : v2 = v2 ? { ...v2, ...k2 } : k2), v2 ? i10 = nc(n10 = np(JSON.stringify(v2))) : (n10 = "", i10 = new Uint8Array()), f2?.byteLength ? (o10 = np(f2), a10 = na(i10, nc("."), nc(o10))) : a10 = i10;
        let T2 = u2;
        "DEF" === s10.zip && (T2 = await iR(T2).catch((e11) => {
          throw new nT("Failed to compress plaintext", { cause: e11 });
        }));
        let { ciphertext: R2, tag: P2, iv: C2 } = await nG(c2, T2, x2, m2, a10), A2 = { ciphertext: np(R2) };
        return C2 && (A2.iv = np(C2)), P2 && (A2.tag = np(P2)), S2 && (A2.encrypted_key = np(S2)), o10 && (A2.aad = o10), v2 && (A2.protected = n10), h2 && (A2.unprotected = h2), w2 && (A2.header = w2), A2;
      }
      async function iA(e10, t10) {
        return iC(e10, function(e11) {
          let [, t11, r10, n10, , , , , i10] = e11;
          if (!nf(t11, r10, n10)) throw new nT("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
          let a10 = { ...t11, ...r10, ...n10 };
          if (ik(nT, ix, i10, t11, a10), void 0 !== a10.zip && "DEF" !== a10.zip) throw new nS('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
          if (void 0 !== a10.zip && !t11?.zip) throw new nT('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
          let { alg: o10, enc: s10 } = a10;
          if ("string" != typeof o10 || !o10) throw new nT('JWE "alg" (Algorithm) Header Parameter missing or invalid');
          if ("string" != typeof s10 || !s10) throw new nT('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
          return [a10, o10, s10, is(s10)];
        }(e10), t10);
      }
      class iO {
        #r;
        #n;
        #i;
        #a;
        #o;
        #s;
        #l;
        #c;
        constructor(e10) {
          if (!(e10 instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
          this.#r = e10;
        }
        setKeyManagementParameters(e10) {
          return ny(this.#c, "setKeyManagementParameters"), this.#c = e10, this;
        }
        setProtectedHeader(e10) {
          return ny(this.#n, "setProtectedHeader"), this.#n = e10, this;
        }
        setSharedUnprotectedHeader(e10) {
          return ny(this.#i, "setSharedUnprotectedHeader"), this.#i = e10, this;
        }
        setUnprotectedHeader(e10) {
          return ny(this.#a, "setUnprotectedHeader"), this.#a = e10, this;
        }
        setAdditionalAuthenticatedData(e10) {
          return this.#o = e10, this;
        }
        setContentEncryptionKey(e10) {
          return ny(this.#s, "setContentEncryptionKey"), this.#s = e10, this;
        }
        setInitializationVector(e10) {
          return ny(this.#l, "setInitializationVector"), this.#l = e10, this;
        }
        async encrypt(e10, t10) {
          if (!this.#n && !this.#a && !this.#i) throw new nT("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
          return !function(e11, t11) {
            let { crit: r10 } = t11 ?? {};
            if (Array.isArray(r10) && new Set(r10).size !== r10.length) throw new e11('"crit" (Critical) Header Parameter MUST NOT contain duplicate values');
          }(nT, this.#n), iA([this.#r, this.#n, this.#a, this.#i, this.#o, this.#s, this.#l, this.#c, t10?.crit, !!t10 && nm in t10], e10);
        }
      }
      class iI {
        #u;
        constructor(e10) {
          this.#u = new iO(e10);
        }
        setContentEncryptionKey(e10) {
          return this.#u.setContentEncryptionKey(e10), this;
        }
        setInitializationVector(e10) {
          return this.#u.setInitializationVector(e10), this;
        }
        setProtectedHeader(e10) {
          return this.#u.setProtectedHeader(e10), this;
        }
        setKeyManagementParameters(e10) {
          return this.#u.setKeyManagementParameters(e10), this;
        }
        async encrypt(e10, t10) {
          let r10 = await this.#u.encrypt(e10, t10);
          return [r10.protected, r10.encrypted_key, r10.iv, r10.ciphertext, r10.tag].join(".");
        }
      }
      let iN = (e10) => Math.floor(e10.getTime() / 1e3), iU = { s: 1, m: 60, h: 3600, d: 86400, w: 604800, y: 31557600 }, ij = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i, i$ = "check_failed";
      function iD(e10) {
        let t10 = ij.exec(e10);
        if (!t10 || t10[4] && t10[1]) throw TypeError("Invalid time period format");
        let r10 = Math.round(parseFloat(t10[2]) * iU[t10[3][0].toLowerCase()]);
        return "-" === t10[1] || "ago" === t10[4] ? -r10 : r10;
      }
      function iL(e10, t10) {
        if (!Number.isFinite(t10)) throw TypeError(`Invalid ${e10} input`);
        return t10;
      }
      function iM(e10, t10) {
        return "number" == typeof e10 ? iL(t10, e10) : e10 instanceof Date ? iL(t10, iN(e10)) : iN(/* @__PURE__ */ new Date()) + iD(e10);
      }
      let iH = (e10) => e10.includes("/") ? e10.toLowerCase() : `application/${e10.toLowerCase()}`;
      function iW(e10, t10, r10 = false) {
        let n10 = e10[t10];
        if (void 0 !== n10 || r10) {
          if ("number" != typeof n10) throw new n_(`"${t10}" claim must be a number`, e10, t10, "invalid");
          return n10;
        }
      }
      function iB(e10, t10) {
        throw new n_(`unexpected "${t10}" claim value`, e10, t10, i$);
      }
      class iq {
        #d;
        constructor(e10) {
          if (!nh(e10)) throw TypeError("JWT Claims Set MUST be an object");
          this.#d = structuredClone(e10);
        }
        data() {
          return nr.encode(JSON.stringify(this.#d));
        }
        get iss() {
          return this.#d.iss;
        }
        set iss(e10) {
          this.#d.iss = e10;
        }
        get sub() {
          return this.#d.sub;
        }
        set sub(e10) {
          this.#d.sub = e10;
        }
        get aud() {
          return this.#d.aud;
        }
        set aud(e10) {
          this.#d.aud = e10;
        }
        set jti(e10) {
          this.#d.jti = e10;
        }
        set nbf(e10) {
          this.#d.nbf = iM(e10, "setNotBefore");
        }
        set exp(e10) {
          this.#d.exp = iM(e10, "setExpirationTime");
        }
        set iat(e10) {
          void 0 === e10 ? this.#d.iat = iN(/* @__PURE__ */ new Date()) : "string" == typeof e10 ? this.#d.iat = iL("setIssuedAt", iN(/* @__PURE__ */ new Date()) + iD(e10)) : this.#d.iat = iM(e10, "setIssuedAt");
        }
      }
      class iz {
        #s;
        #l;
        #c;
        #n;
        #p;
        #h;
        #f;
        #g;
        constructor(e10 = {}) {
          this.#g = new iq(e10);
        }
        setIssuer(e10) {
          return this.#g.iss = e10, this;
        }
        setSubject(e10) {
          return this.#g.sub = e10, this;
        }
        setAudience(e10) {
          return this.#g.aud = e10, this;
        }
        setJti(e10) {
          return this.#g.jti = e10, this;
        }
        setNotBefore(e10) {
          return this.#g.nbf = e10, this;
        }
        setExpirationTime(e10) {
          return this.#g.exp = e10, this;
        }
        setIssuedAt(e10) {
          return this.#g.iat = e10, this;
        }
        setProtectedHeader(e10) {
          return ny(this.#n, "setProtectedHeader"), this.#n = e10, this;
        }
        setKeyManagementParameters(e10) {
          return ny(this.#c, "setKeyManagementParameters"), this.#c = e10, this;
        }
        setContentEncryptionKey(e10) {
          return ny(this.#s, "setContentEncryptionKey"), this.#s = e10, this;
        }
        setInitializationVector(e10) {
          return ny(this.#l, "setInitializationVector"), this.#l = e10, this;
        }
        replicateIssuerAsHeader() {
          return this.#p = true, this;
        }
        replicateSubjectAsHeader() {
          return this.#h = true, this;
        }
        replicateAudienceAsHeader() {
          return this.#f = true, this;
        }
        async encrypt(e10, t10) {
          let r10 = new iI(this.#g.data());
          return this.#n && (this.#p || this.#h || this.#f) && (this.#n = { ...this.#n, iss: this.#p ? this.#g.iss : void 0, sub: this.#h ? this.#g.sub : void 0, aud: this.#f ? this.#g.aud : void 0 }), r10.setProtectedHeader(this.#n), this.#l && r10.setInitializationVector(this.#l), this.#s && r10.setContentEncryptionKey(this.#s), this.#c && r10.setKeyManagementParameters(this.#c), r10.encrypt(e10, t10);
        }
      }
      var iF = e.i(22423), iF = iF;
      async function iK(e10) {
        if (nD(e10)) if ("secret" !== e10.type) return e10.export({ format: "jwk" });
        else e10 = e10.export();
        if (e10 instanceof Uint8Array) return { kty: "oct", k: np(e10) };
        if (!n$(e10)) throw TypeError(nN(e10, "CryptoKey", "KeyObject", "Uint8Array"));
        if (!e10.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
        let { ext: t10, key_ops: r10, alg: n10, use: i10, ...a10 } = Object.fromEntries(Object.entries(await crypto.subtle.exportKey("jwk", e10)).filter(([, e11]) => void 0 !== e11));
        return "AKP" === a10.kty && (a10.alg = n10), a10;
      }
      let iV = (e10, t10) => {
        if ("string" != typeof e10 || !e10) throw new nP(`${t10} missing or invalid`);
      };
      async function iJ(e10, t10) {
        let r10, n10;
        if (ng(e10)) r10 = e10;
        else if (nL(e10)) r10 = await iK(e10);
        else throw TypeError(nN(e10, "CryptoKey", "KeyObject", "JSON Web Key"));
        if ("sha256" !== (t10 ??= "sha256") && "sha384" !== t10 && "sha512" !== t10) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
        switch (r10.kty) {
          case "AKP":
            iV(r10.alg, '"alg" (Algorithm) Parameter'), iV(r10.pub, '"pub" (Public key) Parameter'), n10 = { alg: r10.alg, kty: r10.kty, pub: r10.pub };
            break;
          case "EC":
            iV(r10.crv, '"crv" (Curve) Parameter'), iV(r10.x, '"x" (X Coordinate) Parameter'), iV(r10.y, '"y" (Y Coordinate) Parameter'), n10 = { crv: r10.crv, kty: r10.kty, x: r10.x, y: r10.y };
            break;
          case "OKP":
            iV(r10.crv, '"crv" (Subtype of Key Pair) Parameter'), iV(r10.x, '"x" (Public Key) Parameter'), n10 = { crv: r10.crv, kty: r10.kty, x: r10.x };
            break;
          case "RSA":
            iV(r10.e, '"e" (Exponent) Parameter'), iV(r10.n, '"n" (Modulus) Parameter'), n10 = { e: r10.e, kty: r10.kty, n: r10.n };
            break;
          case "oct":
            iV(r10.k, '"k" (Key Value) Parameter'), n10 = { k: r10.k, kty: r10.kty };
            break;
          default:
            throw new nS('"kty" (Key Type) Parameter missing or unsupported');
        }
        let i10 = nc(JSON.stringify(n10));
        return np(await nv(t10, i10));
      }
      async function iG(e10, t10, r10, n10) {
        let i10, a10, o10, [s10, l10, c2] = r10, [u2, d2, p2, h2, f2] = t10, { encrypted_key: g2, header: m2, unprotected: y2 } = e10;
        if (void 0 !== m2 || void 0 !== y2) {
          if (!nf(u2, m2, y2)) throw new nT("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
          i10 = { ...u2, ...m2, ...y2 };
        } else i10 = u2 ?? {};
        if (ik(nT, ix, c2?.crit, u2, i10), void 0 !== i10.zip && "DEF" !== i10.zip) throw new nS('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
        if (void 0 !== i10.zip && !u2?.zip) throw new nT('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.');
        let { alg: b2, enc: v2 } = i10;
        if ("string" != typeof b2 || !b2) throw new nT("missing JWE Algorithm (alg) in JWE Header");
        if ("string" != typeof v2 || !v2) throw new nT("missing JWE Encryption Algorithm (enc) in JWE Header");
        if (s10 && !s10.has(b2) || !s10 && b2.startsWith("PBES2")) throw new nx('"alg" (Algorithm) Header Parameter value not allowed');
        if (l10 && !l10.has(v2)) throw new nx('"enc" (Encryption Algorithm) Header Parameter value not allowed');
        let w2 = is(v2);
        void 0 !== g2 && (a10 = nb(g2, "encrypted_key", nT));
        let _2 = false;
        "function" == typeof n10 && (n10 = await n10(u2, e10), _2 = true);
        let E2 = io(b2), x2 = await n2("dir" === b2 ? w2 : E2, n10, "decrypt");
        try {
          o10 = await i_(b2, w2, x2, a10, i10, c2);
        } catch (e11) {
          if (e11 instanceof TypeError || e11 instanceof nT || e11 instanceof nS) throw e11;
          o10 = nM(w2);
        }
        let S2 = await nX(w2, o10, d2, p2, h2, f2);
        if ("DEF" === i10.zip) {
          let e11 = c2?.maxDecompressedLength ?? 25e4;
          if (0 === e11) throw new nS('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
          if (e11 !== 1 / 0 && (!Number.isSafeInteger(e11) || e11 < 1)) throw TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
          S2 = await iP(S2, e11).catch((e12) => {
            if (e12 instanceof nT) throw e12;
            throw new nT("Failed to decompress plaintext", { cause: e12 });
          });
        }
        return [S2, u2, x2, _2];
      }
      async function iX(e10, t10, r10) {
        return iG(e10, function(e11) {
          let t11, { protected: r11, ciphertext: n10, iv: i10, tag: a10, aad: o10 } = e11;
          r11 && (t11 = function(e12, t12, r12) {
            let n11;
            try {
              n11 = JSON.parse(ni.decode(nd(e12)));
            } catch {
              throw new t12(r12);
            }
            if (!nh(n11)) throw new t12(r12);
            return n11;
          }(r11, nT, "JWE Protected Header is invalid"));
          let s10 = void 0 !== r11 ? nc(r11) : new Uint8Array();
          return [t11, nb(n10, "ciphertext", nT), void 0 !== i10 ? nb(i10, "iv", nT) : void 0, void 0 !== a10 ? nb(a10, "tag", nT) : void 0, void 0 !== o10 ? na(s10, nc("."), function(e12, t12) {
            try {
              return nc(e12);
            } catch {
              throw new t12("The aad is not a valid base64url string");
            }
          }(o10, nT)) : s10];
        }(e10), t10, r10);
      }
      async function iY(e10, t10, r10) {
        if (e10 instanceof Uint8Array && (e10 = nn.decode(e10)), "string" != typeof e10) throw new nT("Compact JWE must be a string or Uint8Array");
        let { 0: n10, 1: i10, 2: a10, 3: o10, 4: s10, length: l10 } = e10.split(".");
        if (5 !== l10) throw new nT("Invalid Compact JWE");
        return iX({ ciphertext: o10, iv: a10 || void 0, protected: n10, tag: s10 || void 0, encrypted_key: i10 || void 0 }, t10, r10);
      }
      async function iZ(e10, t10, r10) {
        let n10 = await iY(e10, [r10 && iS("keyManagementAlgorithms", r10.keyManagementAlgorithms), r10 && iS("contentEncryptionAlgorithms", r10.contentEncryptionAlgorithms), r10], t10), i10 = n10[1], a10 = function(e11, t11, r11 = {}) {
          var n11, i11;
          let a11;
          try {
            a11 = JSON.parse(ni.decode(t11));
          } catch {
          }
          if (!nh(a11)) throw new nR("JWT Claims Set must be a top-level JSON object");
          let { typ: o11 } = r11;
          if (o11 && ("string" != typeof e11.typ || iH(e11.typ) !== iH(o11))) throw new n_('unexpected "typ" JWT header value', a11, "typ", i$);
          let { requiredClaims: s10 = [], issuer: l10, subject: c2, audience: u2, maxTokenAge: d2 } = r11, p2 = [...s10];
          for (let e12 of (void 0 !== d2 && p2.push("iat"), void 0 !== u2 && p2.push("aud"), void 0 !== c2 && p2.push("sub"), void 0 !== l10 && p2.push("iss"), new Set(p2.reverse()))) if (!Object.hasOwn(a11, e12)) throw new n_(`missing required "${e12}" claim`, a11, e12, "missing");
          void 0 === l10 || (Array.isArray(l10) ? l10 : [l10]).includes(a11.iss) || iB(a11, "iss"), void 0 !== c2 && a11.sub !== c2 && iB(a11, "sub"), void 0 === u2 || (n11 = a11.aud, i11 = "string" == typeof u2 ? [u2] : u2, "string" == typeof n11 ? i11.includes(n11) : !!Array.isArray(n11) && i11.some((e12) => n11.includes(e12))) || iB(a11, "aud");
          let { clockTolerance: h2 } = r11, f2 = 0;
          if ("string" == typeof h2) f2 = iD(h2);
          else if (void 0 !== h2) {
            if ("number" != typeof h2) throw TypeError("Invalid clockTolerance option type");
            f2 = h2;
          }
          iL("clockTolerance option", f2);
          let { currentDate: g2 } = r11, m2 = iL("currentDate option", iN(g2 || /* @__PURE__ */ new Date())), y2 = iW(a11, "iat", void 0 !== d2), b2 = iW(a11, "nbf");
          if (void 0 !== b2 && b2 > m2 + f2) throw new n_('"nbf" claim timestamp check failed', a11, "nbf", i$);
          let v2 = iW(a11, "exp");
          if (void 0 !== v2 && v2 <= m2 - f2) throw new nE('"exp" claim timestamp check failed', a11, "exp", i$);
          if (void 0 !== d2) {
            let e12 = m2 - y2;
            if (e12 - f2 > ("number" == typeof d2 ? d2 : iD(d2))) throw new nE('"iat" claim timestamp check failed (too far in the past)', a11, "iat", i$);
            if (e12 < 0 - f2) throw new n_('"iat" claim timestamp check failed (it should be in the past)', a11, "iat", i$);
          }
          return a11;
        }(i10, n10[0], r10);
        if (void 0 !== i10.iss && i10.iss !== a10.iss) throw new n_('replicated "iss" claim header parameter mismatch', a10, "iss", "mismatch");
        if (void 0 !== i10.sub && i10.sub !== a10.sub) throw new n_('replicated "sub" claim header parameter mismatch', a10, "sub", "mismatch");
        if (void 0 !== i10.aud && JSON.stringify(i10.aud) !== JSON.stringify(a10.aud)) throw new n_('replicated "aud" claim header parameter mismatch', a10, "aud", "mismatch");
        let o10 = { payload: a10, protectedHeader: i10 };
        return "function" == typeof t10 ? { ...o10, key: n10[2] } : o10;
      }
      let iQ = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/, i0 = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/, i1 = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i, i2 = /^[\u0020-\u003A\u003D-\u007E]*$/, i3 = Object.prototype.toString, i4 = ((l = function() {
      }).prototype = /* @__PURE__ */ Object.create(null), l);
      function i5(e10, t10, r10) {
        do {
          let r11 = e10.charCodeAt(t10);
          if (32 !== r11 && 9 !== r11) return t10;
        } while (++t10 < r10);
        return r10;
      }
      function i6(e10, t10, r10) {
        for (; t10 > r10; ) {
          let r11 = e10.charCodeAt(--t10);
          if (32 !== r11 && 9 !== r11) return t10 + 1;
        }
        return r10;
      }
      function i8(e10) {
        if (-1 === e10.indexOf("%")) return e10;
        try {
          return decodeURIComponent(e10);
        } catch (t10) {
          return e10;
        }
      }
      e.s(["parse", 0, function(e10, t10) {
        let r10 = new i4(), n10 = e10.length;
        if (n10 < 2) return r10;
        let i10 = t10?.decode || i8, a10 = 0;
        do {
          let t11 = e10.indexOf("=", a10);
          if (-1 === t11) break;
          let o10 = e10.indexOf(";", a10), s10 = -1 === o10 ? n10 : o10;
          if (t11 > s10) {
            a10 = e10.lastIndexOf(";", t11 - 1) + 1;
            continue;
          }
          let l10 = i5(e10, a10, t11), c2 = i6(e10, t11, l10), u2 = e10.slice(l10, c2);
          if (void 0 === r10[u2]) {
            let n11 = i5(e10, t11 + 1, s10), a11 = i6(e10, s10, n11), o11 = i10(e10.slice(n11, a11));
            r10[u2] = o11;
          }
          a10 = s10 + 1;
        } while (a10 < n10);
        return r10;
      }, "serialize", 0, function(e10, t10, r10) {
        let n10 = r10?.encode || encodeURIComponent;
        if (!iQ.test(e10)) throw TypeError(`argument name is invalid: ${e10}`);
        let i10 = n10(t10);
        if (!i0.test(i10)) throw TypeError(`argument val is invalid: ${t10}`);
        let a10 = e10 + "=" + i10;
        if (!r10) return a10;
        if (void 0 !== r10.maxAge) {
          if (!Number.isInteger(r10.maxAge)) throw TypeError(`option maxAge is invalid: ${r10.maxAge}`);
          a10 += "; Max-Age=" + r10.maxAge;
        }
        if (r10.domain) {
          if (!i1.test(r10.domain)) throw TypeError(`option domain is invalid: ${r10.domain}`);
          a10 += "; Domain=" + r10.domain;
        }
        if (r10.path) {
          if (!i2.test(r10.path)) throw TypeError(`option path is invalid: ${r10.path}`);
          a10 += "; Path=" + r10.path;
        }
        if (r10.expires) {
          var o10;
          if (o10 = r10.expires, "[object Date]" !== i3.call(o10) || !Number.isFinite(r10.expires.valueOf())) throw TypeError(`option expires is invalid: ${r10.expires}`);
          a10 += "; Expires=" + r10.expires.toUTCString();
        }
        if (r10.httpOnly && (a10 += "; HttpOnly"), r10.secure && (a10 += "; Secure"), r10.partitioned && (a10 += "; Partitioned"), r10.priority) switch ("string" == typeof r10.priority ? r10.priority.toLowerCase() : void 0) {
          case "low":
            a10 += "; Priority=Low";
            break;
          case "medium":
            a10 += "; Priority=Medium";
            break;
          case "high":
            a10 += "; Priority=High";
            break;
          default:
            throw TypeError(`option priority is invalid: ${r10.priority}`);
        }
        if (r10.sameSite) switch ("string" == typeof r10.sameSite ? r10.sameSite.toLowerCase() : r10.sameSite) {
          case true:
          case "strict":
            a10 += "; SameSite=Strict";
            break;
          case "lax":
            a10 += "; SameSite=Lax";
            break;
          case "none":
            a10 += "; SameSite=None";
            break;
          default:
            throw TypeError(`option sameSite is invalid: ${r10.sameSite}`);
        }
        return a10;
      }], 52411);
      var i9 = e.i(52411);
      let { parse: i7 } = i9, ae = "A256CBC-HS512";
      async function at(e10) {
        let { token: t10 = {}, secret: r10, maxAge: n10 = 2592e3, salt: i10 } = e10, a10 = Array.isArray(r10) ? r10 : [r10], o10 = await an(ae, a10[0], i10), s10 = await iJ({ kty: "oct", k: iF.encode(o10) }, `sha${o10.byteLength << 3}`);
        return await new iz(t10).setProtectedHeader({ alg: "dir", enc: ae, kid: s10 }).setIssuedAt().setExpirationTime((Date.now() / 1e3 | 0) + n10).setJti(crypto.randomUUID()).encrypt(o10);
      }
      async function ar(e10) {
        let { token: t10, secret: r10, salt: n10 } = e10, i10 = Array.isArray(r10) ? r10 : [r10];
        if (!t10) return null;
        let { payload: a10 } = await iZ(t10, async ({ kid: e11, enc: t11 }) => {
          for (let r11 of i10) {
            let i11 = await an(t11, r11, n10);
            if (void 0 === e11 || e11 === await iJ({ kty: "oct", k: iF.encode(i11) }, `sha${i11.byteLength << 3}`)) return i11;
          }
          throw Error("no matching decryption secret");
        }, { clockTolerance: 15, keyManagementAlgorithms: ["dir"], contentEncryptionAlgorithms: [ae, "A256GCM"] });
        return a10;
      }
      async function an(e10, t10, r10) {
        let n10;
        switch (e10) {
          case "A256CBC-HS512":
            n10 = 64;
            break;
          case "A256GCM":
            n10 = 32;
            break;
          default:
            throw Error("Unsupported JWT Content Encryption Algorithm");
        }
        return await nt("sha256", t10, r10, `Auth.js Generated Encryption Key (${r10})`, n10);
      }
      async function ai({ options: e10, paramValue: t10, cookieValue: r10 }) {
        let { url: n10, callbacks: i10 } = e10, a10 = n10.origin;
        return t10 ? a10 = await i10.redirect({ url: t10, baseUrl: n10.origin }) : r10 && (a10 = await i10.redirect({ url: r10, baseUrl: n10.origin })), { callbackUrl: a10, callbackUrlCookie: a10 !== r10 ? a10 : void 0 };
      }
      let aa = "\x1B[31m", ao = "\x1B[0m", as = { error(e10) {
        let t10 = e10 instanceof rE ? e10.type : e10.name;
        if (console.error(`${aa}[auth][error]${ao} ${t10}: ${e10.message}`), e10.cause && "object" == typeof e10.cause && "err" in e10.cause && e10.cause.err instanceof Error) {
          let { err: t11, ...r10 } = e10.cause;
          console.error(`${aa}[auth][cause]${ao}:`, t11.stack), r10 && console.error(`${aa}[auth][details]${ao}:`, JSON.stringify(r10, null, 2));
        } else e10.stack && console.error(e10.stack.replace(/.*/, "").substring(1));
      }, warn(e10) {
        console.warn(`\x1B[33m[auth][warn][${e10}]${ao}`, "Read more: https://warnings.authjs.dev");
      }, debug(e10, t10) {
        console.log(`\x1B[90m[auth][debug]:${ao} ${e10}`, JSON.stringify(t10, null, 2));
      } };
      function al(e10) {
        let t10 = { ...as };
        return e10.debug || (t10.debug = () => {
        }), e10.logger?.error && (t10.error = e10.logger.error), e10.logger?.warn && (t10.warn = e10.logger.warn), e10.logger?.debug && (t10.debug = e10.logger.debug), e10.logger ?? (e10.logger = t10), t10;
      }
      let ac = ["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error", "webauthn-options"], { parse: au, serialize: ad } = i9;
      async function ap(e10) {
        if (!("body" in e10) || !e10.body || "POST" !== e10.method) return;
        let t10 = e10.headers.get("content-type");
        return t10?.includes("application/json") ? await e10.json() : t10?.includes("application/x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(await e10.text())) : void 0;
      }
      async function ah(e10, t10) {
        try {
          if ("GET" !== e10.method && "POST" !== e10.method) throw new rq("Only GET and POST requests are supported");
          t10.basePath ?? (t10.basePath = "/auth");
          let r10 = new URL(e10.url), { action: n10, providerId: i10 } = function(e11, t11) {
            let r11 = e11.match(RegExp(`^${t11}(.+)`));
            if (null === r11) throw new rq(`Cannot parse action at ${e11}`);
            let n11 = r11.at(-1).replace(/^\//, "").split("/").filter(Boolean);
            if (1 !== n11.length && 2 !== n11.length) throw new rq(`Cannot parse action at ${e11}`);
            let [i11, a10] = n11;
            if (!ac.includes(i11) || a10 && !["signin", "callback", "webauthn-options"].includes(i11)) throw new rq(`Cannot parse action at ${e11}`);
            return { action: i11, providerId: "undefined" == a10 ? void 0 : a10 };
          }(r10.pathname, t10.basePath);
          return { url: r10, action: n10, providerId: i10, method: e10.method, headers: Object.fromEntries(e10.headers), body: e10.body ? await ap(e10) : void 0, cookies: au(e10.headers.get("cookie") ?? "") ?? {}, error: r10.searchParams.get("error") ?? void 0, query: Object.fromEntries(r10.searchParams) };
        } catch (n10) {
          let r10 = al(t10);
          r10.error(n10), r10.debug("request", e10);
        }
      }
      function af(e10) {
        let t10 = new Headers(e10.headers);
        e10.cookies?.forEach((e11) => {
          let { name: r11, value: n11, options: i10 } = e11, a10 = ad(r11, n11, i10);
          t10.has("Set-Cookie") ? t10.append("Set-Cookie", a10) : t10.set("Set-Cookie", a10);
        });
        let r10 = e10.body;
        "application/json" === t10.get("content-type") ? r10 = JSON.stringify(e10.body) : "application/x-www-form-urlencoded" === t10.get("content-type") && (r10 = new URLSearchParams(e10.body).toString());
        let n10 = new Response(r10, { headers: t10, status: e10.redirect ? 302 : e10.status ?? 200 });
        return e10.redirect && n10.headers.set("Location", e10.redirect), n10;
      }
      async function ag(e10) {
        let t10 = new TextEncoder().encode(e10);
        return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", t10))).map((e11) => e11.toString(16).padStart(2, "0")).join("").toString();
      }
      function am(e10) {
        return Array.from(crypto.getRandomValues(new Uint8Array(e10))).reduce((e11, t10) => e11 + ("0" + t10.toString(16)).slice(-2), "");
      }
      async function ay({ options: e10, cookieValue: t10, isPost: r10, bodyValue: n10 }) {
        if (t10) {
          let [i11, a11] = t10.split("|");
          if (a11 === await ag(`${i11}${e10.secret}`)) return { csrfTokenVerified: r10 && i11 === n10, csrfToken: i11 };
        }
        let i10 = am(32), a10 = await ag(`${i10}${e10.secret}`);
        return { cookie: `${i10}|${a10}`, csrfToken: i10 };
      }
      function ab(e10, t10) {
        if (!t10) throw new rJ(`CSRF token was missing during an action ${e10}`);
      }
      function av(e10) {
        return null !== e10 && "object" == typeof e10;
      }
      function aw(e10, ...t10) {
        if (!t10.length) return e10;
        let r10 = t10.shift();
        if (av(e10) && av(r10)) for (let t11 in r10) av(r10[t11]) ? (av(e10[t11]) || (e10[t11] = Array.isArray(r10[t11]) ? [] : {}), aw(e10[t11], r10[t11])) : void 0 !== r10[t11] && (e10[t11] = r10[t11]);
        return aw(e10, ...t10);
      }
      let a_ = Symbol("skip-csrf-check"), aE = Symbol("return-type-raw"), ax = Symbol("custom-fetch"), aS = Symbol("conform-internal"), ak = (e10) => aR({ id: e10.sub ?? e10.id ?? crypto.randomUUID(), name: e10.name ?? e10.nickname ?? e10.preferred_username, email: e10.email, image: e10.picture }), aT = (e10) => aR({ access_token: e10.access_token, id_token: e10.id_token, refresh_token: e10.refresh_token, expires_at: e10.expires_at, scope: e10.scope, token_type: e10.token_type, session_state: e10.session_state });
      function aR(e10) {
        let t10 = {};
        for (let [r10, n10] of Object.entries(e10)) void 0 !== n10 && (t10[r10] = n10);
        return t10;
      }
      function aP(e10, t10) {
        if (!e10 && t10) return;
        if ("string" == typeof e10) return { url: new URL(e10) };
        let r10 = new URL(e10?.url ?? "https://authjs.dev");
        if (e10?.params != null) for (let [t11, n10] of Object.entries(e10.params)) "claims" === t11 && (n10 = JSON.stringify(n10)), r10.searchParams.set(t11, String(n10));
        return { url: r10, request: e10?.request, conform: e10?.conform, ...e10?.clientPrivateKey ? { clientPrivateKey: e10?.clientPrivateKey } : null };
      }
      let aC = { signIn: () => true, redirect: ({ url: e10, baseUrl: t10 }) => e10.startsWith("/") ? `${t10}${e10}` : new URL(e10).origin === t10 ? e10 : t10, session: ({ session: e10 }) => ({ user: { name: e10.user?.name, email: e10.user?.email, image: e10.user?.image }, expires: e10.expires?.toISOString?.() ?? e10.expires }), jwt: ({ token: e10 }) => e10 };
      async function aA({ authOptions: e10, providerId: t10, action: r10, url: n10, cookies: i10, callbackUrl: a10, csrfToken: o10, csrfDisabled: s10, isPost: l10 }) {
        var c2, u2;
        let d2 = al(e10), { providers: p2, provider: h2 } = function(e11) {
          let { providerId: t11, config: r11 } = e11, n11 = new URL(r11.basePath ?? "/auth", e11.url.origin), i11 = r11.providers.map((e12) => {
            let t12 = "function" == typeof e12 ? e12() : e12, { options: i12, ...a12 } = t12, o11 = i12?.id ?? a12.id, s11 = aw(a12, i12, { signinUrl: `${n11}/signin/${o11}`, callbackUrl: `${n11}/callback/${o11}` });
            if ("oauth" === t12.type || "oidc" === t12.type) {
              var l11;
              let e13, t13, n12, a13;
              s11.redirectProxyUrl ?? (s11.redirectProxyUrl = i12?.redirectProxyUrl ?? r11.redirectProxyUrl);
              let o12 = ((l11 = s11).issuer && (l11.wellKnown ?? (l11.wellKnown = `${l11.issuer}/.well-known/openid-configuration`)), (e13 = aP(l11.authorization, l11.issuer)) && !e13.url?.searchParams.has("scope") && e13.url.searchParams.set("scope", "openid profile email"), t13 = aP(l11.token, l11.issuer), n12 = aP(l11.userinfo, l11.issuer), a13 = l11.checks ?? ["pkce"], l11.redirectProxyUrl && (a13.includes("state") || a13.push("state"), l11.redirectProxyUrl = `${l11.redirectProxyUrl}/callback/${l11.id}`), { ...l11, authorization: e13, token: t13, checks: a13, userinfo: n12, profile: l11.profile ?? ak, account: l11.account ?? aT });
              return o12.authorization?.url.searchParams.get("response_mode") === "form_post" && delete o12.redirectProxyUrl, o12[ax] ?? (o12[ax] = i12?.[ax]), o12;
            }
            return s11;
          }), a11 = i11.find(({ id: e12 }) => e12 === t11);
          if (t11 && !a11) {
            let e12 = i11.map((e13) => e13.id).join(", ");
            throw Error(`Provider with id "${t11}" not found. Available providers: [${e12}].`);
          }
          return { providers: i11, provider: a11 };
        }({ url: n10, providerId: t10, config: e10 }), f2 = false;
        if ((h2?.type === "oauth" || h2?.type === "oidc") && h2.redirectProxyUrl) try {
          f2 = new URL(h2.redirectProxyUrl).origin === n10.origin;
        } catch {
          throw TypeError(`redirectProxyUrl must be a valid URL. Received: ${h2.redirectProxyUrl}`);
        }
        let g2 = { debug: false, pages: {}, theme: { colorScheme: "auto", logo: "", brandColor: "", buttonText: "" }, ...e10, url: n10, action: r10, provider: h2, cookies: aw(rw(e10.useSecureCookies ?? "https:" === n10.protocol), e10.cookies), providers: p2, session: { strategy: e10.adapter ? "database" : "jwt", maxAge: 2592e3, updateAge: 86400, generateSessionToken: () => crypto.randomUUID(), ...e10.session }, jwt: { secret: e10.secret, maxAge: e10.session?.maxAge ?? 2592e3, encode: at, decode: ar, ...e10.jwt }, events: (c2 = e10.events ?? {}, u2 = d2, Object.keys(c2).reduce((e11, t11) => (e11[t11] = async (...e12) => {
          try {
            let r11 = c2[t11];
            return await r11(...e12);
          } catch (e13) {
            u2.error(new rP(e13));
          }
        }, e11), {})), adapter: function(e11, t11) {
          if (e11) return Object.keys(e11).reduce((r11, n11) => (r11[n11] = async (...r12) => {
            try {
              t11.debug(`adapter_${n11}`, { args: r12 });
              let i11 = e11[n11];
              return await i11(...r12);
            } catch (r13) {
              let e12 = new rS(r13);
              throw t11.error(e12), e12;
            }
          }, r11), {});
        }(e10.adapter, d2), callbacks: { ...aC, ...e10.callbacks }, logger: d2, callbackUrl: n10.origin, isOnRedirectProxy: f2, experimental: { ...e10.experimental } }, m2 = [];
        if (s10) g2.csrfTokenVerified = true;
        else {
          let { csrfToken: e11, cookie: t11, csrfTokenVerified: r11 } = await ay({ options: g2, cookieValue: i10?.[g2.cookies.csrfToken.name], isPost: l10, bodyValue: o10 });
          g2.csrfToken = e11, g2.csrfTokenVerified = r11, t11 && m2.push({ name: g2.cookies.csrfToken.name, value: t11, options: g2.cookies.csrfToken.options });
        }
        let { callbackUrl: y2, callbackUrlCookie: b2 } = await ai({ options: g2, cookieValue: i10?.[g2.cookies.callbackUrl.name], paramValue: a10 });
        return g2.callbackUrl = y2, b2 && m2.push({ name: g2.cookies.callbackUrl.name, value: b2, options: g2.cookies.callbackUrl.options }), { options: g2, cookies: m2 };
      }
      var aO, aI, aN, aU, aj, a$, aD, aL, aM, aH, aW, aB, aq, az, aF, aK, aV, aJ, aG, aX, aY, aZ, aQ, a0, a1, a2, a3, a4, a5, a6, a8, a9, a7 = {}, oe = [], ot = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, or = Array.isArray;
      function on(e10, t10) {
        for (var r10 in t10) e10[r10] = t10[r10];
        return e10;
      }
      function oi(e10) {
        e10 && e10.parentNode && e10.parentNode.removeChild(e10);
      }
      function oa(e10, t10, r10, n10, i10) {
        var a10 = { type: e10, props: t10, key: r10, ref: n10, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: null == i10 ? ++a1 : i10, __i: -1, __u: 0 };
        return null == i10 && null != a0.vnode && a0.vnode(a10), a10;
      }
      function oo(e10) {
        return e10.children;
      }
      function os(e10, t10) {
        this.props = e10, this.context = t10;
      }
      function ol(e10, t10) {
        if (null == t10) return e10.__ ? ol(e10.__, e10.__i + 1) : null;
        for (var r10; t10 < e10.__k.length; t10++) if (null != (r10 = e10.__k[t10]) && null != r10.__e) return r10.__e;
        return "function" == typeof e10.type ? ol(e10) : null;
      }
      function oc(e10) {
        (!e10.__d && (e10.__d = true) && a2.push(e10) && !ou.__r++ || a3 !== a0.debounceRendering) && ((a3 = a0.debounceRendering) || a4)(ou);
      }
      function ou() {
        var e10, t10, r10, n10, i10, a10, o10, s10;
        for (a2.sort(a5); e10 = a2.shift(); ) e10.__d && (t10 = a2.length, n10 = void 0, a10 = (i10 = (r10 = e10).__v).__e, o10 = [], s10 = [], r10.__P && ((n10 = on({}, i10)).__v = i10.__v + 1, a0.vnode && a0.vnode(n10), og(r10.__P, n10, i10, r10.__n, r10.__P.namespaceURI, 32 & i10.__u ? [a10] : null, o10, null == a10 ? ol(i10) : a10, !!(32 & i10.__u), s10), n10.__v = i10.__v, n10.__.__k[n10.__i] = n10, function(e11, t11, r11) {
          t11.__d = void 0;
          for (var n11 = 0; n11 < r11.length; n11++) om(r11[n11], r11[++n11], r11[++n11]);
          a0.__c && a0.__c(t11, e11), e11.some(function(t12) {
            try {
              e11 = t12.__h, t12.__h = [], e11.some(function(e12) {
                e12.call(t12);
              });
            } catch (e12) {
              a0.__e(e12, t12.__v);
            }
          });
        }(o10, n10, s10), n10.__e != a10 && function e11(t11) {
          var r11, n11;
          if (null != (t11 = t11.__) && null != t11.__c) {
            for (t11.__e = t11.__c.base = null, r11 = 0; r11 < t11.__k.length; r11++) if (null != (n11 = t11.__k[r11]) && null != n11.__e) {
              t11.__e = t11.__c.base = n11.__e;
              break;
            }
            return e11(t11);
          }
        }(n10)), a2.length > t10 && a2.sort(a5));
        ou.__r = 0;
      }
      function od(e10, t10, r10, n10, i10, a10, o10, s10, l10, c2, u2) {
        var d2, p2, h2, f2, g2, m2 = n10 && n10.__k || oe, y2 = t10.length;
        for (r10.__d = l10, function(e11, t11, r11) {
          var n11, i11, a11, o11, s11, l11 = t11.length, c3 = r11.length, u3 = c3, d3 = 0;
          for (e11.__k = [], n11 = 0; n11 < l11; n11++) null != (i11 = t11[n11]) && "boolean" != typeof i11 && "function" != typeof i11 ? (o11 = n11 + d3, (i11 = e11.__k[n11] = "string" == typeof i11 || "number" == typeof i11 || "bigint" == typeof i11 || i11.constructor == String ? oa(null, i11, null, null, null) : or(i11) ? oa(oo, { children: i11 }, null, null, null) : void 0 === i11.constructor && i11.__b > 0 ? oa(i11.type, i11.props, i11.key, i11.ref ? i11.ref : null, i11.__v) : i11).__ = e11, i11.__b = e11.__b + 1, a11 = null, -1 !== (s11 = i11.__i = function(e12, t12, r12, n12) {
            var i12 = e12.key, a12 = e12.type, o12 = r12 - 1, s12 = r12 + 1, l12 = t12[r12];
            if (null === l12 || l12 && i12 == l12.key && a12 === l12.type && 0 == (131072 & l12.__u)) return r12;
            if (n12 > +(null != l12 && 0 == (131072 & l12.__u))) for (; o12 >= 0 || s12 < t12.length; ) {
              if (o12 >= 0) {
                if ((l12 = t12[o12]) && 0 == (131072 & l12.__u) && i12 == l12.key && a12 === l12.type) return o12;
                o12--;
              }
              if (s12 < t12.length) {
                if ((l12 = t12[s12]) && 0 == (131072 & l12.__u) && i12 == l12.key && a12 === l12.type) return s12;
                s12++;
              }
            }
            return -1;
          }(i11, r11, o11, u3)) && (u3--, (a11 = r11[s11]) && (a11.__u |= 131072)), null == a11 || null === a11.__v ? (-1 == s11 && d3--, "function" != typeof i11.type && (i11.__u |= 65536)) : s11 !== o11 && (s11 == o11 - 1 ? d3-- : s11 == o11 + 1 ? d3++ : (s11 > o11 ? d3-- : d3++, i11.__u |= 65536))) : i11 = e11.__k[n11] = null;
          if (u3) for (n11 = 0; n11 < c3; n11++) null != (a11 = r11[n11]) && 0 == (131072 & a11.__u) && (a11.__e == e11.__d && (e11.__d = ol(a11)), function e12(t12, r12, n12) {
            var i12, a12;
            if (a0.unmount && a0.unmount(t12), (i12 = t12.ref) && (i12.current && i12.current !== t12.__e || om(i12, null, r12)), null != (i12 = t12.__c)) {
              if (i12.componentWillUnmount) try {
                i12.componentWillUnmount();
              } catch (e13) {
                a0.__e(e13, r12);
              }
              i12.base = i12.__P = null;
            }
            if (i12 = t12.__k) for (a12 = 0; a12 < i12.length; a12++) i12[a12] && e12(i12[a12], r12, n12 || "function" != typeof t12.type);
            n12 || oi(t12.__e), t12.__c = t12.__ = t12.__e = t12.__d = void 0;
          }(a11, a11));
        }(r10, t10, m2), l10 = r10.__d, d2 = 0; d2 < y2; d2++) null != (h2 = r10.__k[d2]) && (p2 = -1 === h2.__i ? a7 : m2[h2.__i] || a7, h2.__i = d2, og(e10, h2, p2, i10, a10, o10, s10, l10, c2, u2), f2 = h2.__e, h2.ref && p2.ref != h2.ref && (p2.ref && om(p2.ref, null, h2), u2.push(h2.ref, h2.__c || f2, h2)), null == g2 && null != f2 && (g2 = f2), 65536 & h2.__u || p2.__k === h2.__k ? l10 = function e11(t11, r11, n11) {
          var i11, a11;
          if ("function" == typeof t11.type) {
            for (i11 = t11.__k, a11 = 0; i11 && a11 < i11.length; a11++) i11[a11] && (i11[a11].__ = t11, r11 = e11(i11[a11], r11, n11));
            return r11;
          }
          t11.__e != r11 && (r11 && t11.type && !n11.contains(r11) && (r11 = ol(t11)), n11.insertBefore(t11.__e, r11 || null), r11 = t11.__e);
          do
            r11 = r11 && r11.nextSibling;
          while (null != r11 && 8 === r11.nodeType);
          return r11;
        }(h2, l10, e10) : "function" == typeof h2.type && void 0 !== h2.__d ? l10 = h2.__d : f2 && (l10 = f2.nextSibling), h2.__d = void 0, h2.__u &= -196609);
        r10.__d = l10, r10.__e = g2;
      }
      function op(e10, t10, r10) {
        "-" === t10[0] ? e10.setProperty(t10, null == r10 ? "" : r10) : e10[t10] = null == r10 ? "" : "number" != typeof r10 || ot.test(t10) ? r10 : r10 + "px";
      }
      function oh(e10, t10, r10, n10, i10) {
        var a10;
        e: if ("style" === t10) if ("string" == typeof r10) e10.style.cssText = r10;
        else {
          if ("string" == typeof n10 && (e10.style.cssText = n10 = ""), n10) for (t10 in n10) r10 && t10 in r10 || op(e10.style, t10, "");
          if (r10) for (t10 in r10) n10 && r10[t10] === n10[t10] || op(e10.style, t10, r10[t10]);
        }
        else if ("o" === t10[0] && "n" === t10[1]) a10 = t10 !== (t10 = t10.replace(/(PointerCapture)$|Capture$/i, "$1")), t10 = t10.toLowerCase() in e10 || "onFocusOut" === t10 || "onFocusIn" === t10 ? t10.toLowerCase().slice(2) : t10.slice(2), e10.l || (e10.l = {}), e10.l[t10 + a10] = r10, r10 ? n10 ? r10.u = n10.u : (r10.u = a6, e10.addEventListener(t10, a10 ? a9 : a8, a10)) : e10.removeEventListener(t10, a10 ? a9 : a8, a10);
        else {
          if ("http://www.w3.org/2000/svg" == i10) t10 = t10.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
          else if ("width" != t10 && "height" != t10 && "href" != t10 && "list" != t10 && "form" != t10 && "tabIndex" != t10 && "download" != t10 && "rowSpan" != t10 && "colSpan" != t10 && "role" != t10 && "popover" != t10 && t10 in e10) try {
            e10[t10] = null == r10 ? "" : r10;
            break e;
          } catch (e11) {
          }
          "function" == typeof r10 || (null == r10 || false === r10 && "-" !== t10[4] ? e10.removeAttribute(t10) : e10.setAttribute(t10, "popover" == t10 && 1 == r10 ? "" : r10));
        }
      }
      function of(e10) {
        return function(t10) {
          if (this.l) {
            var r10 = this.l[t10.type + e10];
            if (null == t10.t) t10.t = a6++;
            else if (t10.t < r10.u) return;
            return r10(a0.event ? a0.event(t10) : t10);
          }
        };
      }
      function og(e10, t10, r10, n10, i10, a10, o10, s10, l10, c2) {
        var u2, d2, p2, h2, f2, g2, m2, y2, b2, v2, w2, _2, E2, x2, S2, k2, T2 = t10.type;
        if (void 0 !== t10.constructor) return null;
        128 & r10.__u && (l10 = !!(32 & r10.__u), a10 = [s10 = t10.__e = r10.__e]), (u2 = a0.__b) && u2(t10);
        e: if ("function" == typeof T2) try {
          if (y2 = t10.props, b2 = "prototype" in T2 && T2.prototype.render, v2 = (u2 = T2.contextType) && n10[u2.__c], w2 = u2 ? v2 ? v2.props.value : u2.__ : n10, r10.__c ? m2 = (d2 = t10.__c = r10.__c).__ = d2.__E : (b2 ? t10.__c = d2 = new T2(y2, w2) : (t10.__c = d2 = new os(y2, w2), d2.constructor = T2, d2.render = oy), v2 && v2.sub(d2), d2.props = y2, d2.state || (d2.state = {}), d2.context = w2, d2.__n = n10, p2 = d2.__d = true, d2.__h = [], d2._sb = []), b2 && null == d2.__s && (d2.__s = d2.state), b2 && null != T2.getDerivedStateFromProps && (d2.__s == d2.state && (d2.__s = on({}, d2.__s)), on(d2.__s, T2.getDerivedStateFromProps(y2, d2.__s))), h2 = d2.props, f2 = d2.state, d2.__v = t10, p2) b2 && null == T2.getDerivedStateFromProps && null != d2.componentWillMount && d2.componentWillMount(), b2 && null != d2.componentDidMount && d2.__h.push(d2.componentDidMount);
          else {
            if (b2 && null == T2.getDerivedStateFromProps && y2 !== h2 && null != d2.componentWillReceiveProps && d2.componentWillReceiveProps(y2, w2), !d2.__e && (null != d2.shouldComponentUpdate && false === d2.shouldComponentUpdate(y2, d2.__s, w2) || t10.__v === r10.__v)) {
              for (t10.__v !== r10.__v && (d2.props = y2, d2.state = d2.__s, d2.__d = false), t10.__e = r10.__e, t10.__k = r10.__k, t10.__k.some(function(e11) {
                e11 && (e11.__ = t10);
              }), _2 = 0; _2 < d2._sb.length; _2++) d2.__h.push(d2._sb[_2]);
              d2._sb = [], d2.__h.length && o10.push(d2);
              break e;
            }
            null != d2.componentWillUpdate && d2.componentWillUpdate(y2, d2.__s, w2), b2 && null != d2.componentDidUpdate && d2.__h.push(function() {
              d2.componentDidUpdate(h2, f2, g2);
            });
          }
          if (d2.context = w2, d2.props = y2, d2.__P = e10, d2.__e = false, E2 = a0.__r, x2 = 0, b2) {
            for (d2.state = d2.__s, d2.__d = false, E2 && E2(t10), u2 = d2.render(d2.props, d2.state, d2.context), S2 = 0; S2 < d2._sb.length; S2++) d2.__h.push(d2._sb[S2]);
            d2._sb = [];
          } else do
            d2.__d = false, E2 && E2(t10), u2 = d2.render(d2.props, d2.state, d2.context), d2.state = d2.__s;
          while (d2.__d && ++x2 < 25);
          d2.state = d2.__s, null != d2.getChildContext && (n10 = on(on({}, n10), d2.getChildContext())), b2 && !p2 && null != d2.getSnapshotBeforeUpdate && (g2 = d2.getSnapshotBeforeUpdate(h2, f2)), od(e10, or(k2 = null != u2 && u2.type === oo && null == u2.key ? u2.props.children : u2) ? k2 : [k2], t10, r10, n10, i10, a10, o10, s10, l10, c2), d2.base = t10.__e, t10.__u &= -161, d2.__h.length && o10.push(d2), m2 && (d2.__E = d2.__ = null);
        } catch (e11) {
          if (t10.__v = null, l10 || null != a10) {
            for (t10.__u |= l10 ? 160 : 128; s10 && 8 === s10.nodeType && s10.nextSibling; ) s10 = s10.nextSibling;
            a10[a10.indexOf(s10)] = null, t10.__e = s10;
          } else t10.__e = r10.__e, t10.__k = r10.__k;
          a0.__e(e11, t10, r10);
        }
        else null == a10 && t10.__v === r10.__v ? (t10.__k = r10.__k, t10.__e = r10.__e) : t10.__e = function(e11, t11, r11, n11, i11, a11, o11, s11, l11) {
          var c3, u3, d3, p3, h3, f3, g3, m3 = r11.props, y3 = t11.props, b3 = t11.type;
          if ("svg" === b3 ? i11 = "http://www.w3.org/2000/svg" : "math" === b3 ? i11 = "http://www.w3.org/1998/Math/MathML" : i11 || (i11 = "http://www.w3.org/1999/xhtml"), null != a11) {
            for (c3 = 0; c3 < a11.length; c3++) if ((h3 = a11[c3]) && "setAttribute" in h3 == !!b3 && (b3 ? h3.localName === b3 : 3 === h3.nodeType)) {
              e11 = h3, a11[c3] = null;
              break;
            }
          }
          if (null == e11) {
            if (null === b3) return document.createTextNode(y3);
            e11 = document.createElementNS(i11, b3, y3.is && y3), s11 && (a0.__m && a0.__m(t11, a11), s11 = false), a11 = null;
          }
          if (null === b3) m3 === y3 || s11 && e11.data === y3 || (e11.data = y3);
          else {
            if (a11 = a11 && aQ.call(e11.childNodes), m3 = r11.props || a7, !s11 && null != a11) for (m3 = {}, c3 = 0; c3 < e11.attributes.length; c3++) m3[(h3 = e11.attributes[c3]).name] = h3.value;
            for (c3 in m3) if (h3 = m3[c3], "children" == c3) ;
            else if ("dangerouslySetInnerHTML" == c3) d3 = h3;
            else if (!(c3 in y3)) {
              if ("value" == c3 && "defaultValue" in y3 || "checked" == c3 && "defaultChecked" in y3) continue;
              oh(e11, c3, null, h3, i11);
            }
            for (c3 in y3) h3 = y3[c3], "children" == c3 ? p3 = h3 : "dangerouslySetInnerHTML" == c3 ? u3 = h3 : "value" == c3 ? f3 = h3 : "checked" == c3 ? g3 = h3 : s11 && "function" != typeof h3 || m3[c3] === h3 || oh(e11, c3, h3, m3[c3], i11);
            if (u3) s11 || d3 && (u3.__html === d3.__html || u3.__html === e11.innerHTML) || (e11.innerHTML = u3.__html), t11.__k = [];
            else if (d3 && (e11.innerHTML = ""), od(e11, or(p3) ? p3 : [p3], t11, r11, n11, "foreignObject" === b3 ? "http://www.w3.org/1999/xhtml" : i11, a11, o11, a11 ? a11[0] : r11.__k && ol(r11, 0), s11, l11), null != a11) for (c3 = a11.length; c3--; ) oi(a11[c3]);
            s11 || (c3 = "value", "progress" === b3 && null == f3 ? e11.removeAttribute("value") : void 0 === f3 || f3 === e11[c3] && ("progress" !== b3 || f3) && ("option" !== b3 || f3 === m3[c3]) || oh(e11, c3, f3, m3[c3], i11), c3 = "checked", void 0 !== g3 && g3 !== e11[c3] && oh(e11, c3, g3, m3[c3], i11));
          }
          return e11;
        }(r10.__e, t10, r10, n10, i10, a10, o10, l10, c2);
        (u2 = a0.diffed) && u2(t10);
      }
      function om(e10, t10, r10) {
        try {
          if ("function" == typeof e10) {
            var n10 = "function" == typeof e10.__u;
            n10 && e10.__u(), n10 && null == t10 || (e10.__u = e10(t10));
          } else e10.current = t10;
        } catch (e11) {
          a0.__e(e11, r10);
        }
      }
      function oy(e10, t10, r10) {
        return this.constructor(e10, r10);
      }
      aQ = oe.slice, a0 = { __e: function(e10, t10, r10, n10) {
        for (var i10, a10, o10; t10 = t10.__; ) if ((i10 = t10.__c) && !i10.__) try {
          if ((a10 = i10.constructor) && null != a10.getDerivedStateFromError && (i10.setState(a10.getDerivedStateFromError(e10)), o10 = i10.__d), null != i10.componentDidCatch && (i10.componentDidCatch(e10, n10 || {}), o10 = i10.__d), o10) return i10.__E = i10;
        } catch (t11) {
          e10 = t11;
        }
        throw e10;
      } }, a1 = 0, os.prototype.setState = function(e10, t10) {
        var r10;
        r10 = null != this.__s && this.__s !== this.state ? this.__s : this.__s = on({}, this.state), "function" == typeof e10 && (e10 = e10(on({}, r10), this.props)), e10 && on(r10, e10), null != e10 && this.__v && (t10 && this._sb.push(t10), oc(this));
      }, os.prototype.forceUpdate = function(e10) {
        this.__v && (this.__e = true, e10 && this.__h.push(e10), oc(this));
      }, os.prototype.render = oo, a2 = [], a4 = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, a5 = function(e10, t10) {
        return e10.__v.__b - t10.__v.__b;
      }, ou.__r = 0, a6 = 0, a8 = of(false), a9 = of(true);
      var ob = /[\s\n\\/='"\0<>]/, ov = /^(xlink|xmlns|xml)([A-Z])/, ow = /^accessK|^auto[A-Z]|^cell|^ch|^col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z]/, o_ = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/, oE = /* @__PURE__ */ new Set(["draggable", "spellcheck"]), ox = /["&<]/;
      function oS(e10) {
        if (0 === e10.length || false === ox.test(e10)) return e10;
        for (var t10 = 0, r10 = 0, n10 = "", i10 = ""; r10 < e10.length; r10++) {
          switch (e10.charCodeAt(r10)) {
            case 34:
              i10 = "&quot;";
              break;
            case 38:
              i10 = "&amp;";
              break;
            case 60:
              i10 = "&lt;";
              break;
            default:
              continue;
          }
          r10 !== t10 && (n10 += e10.slice(t10, r10)), n10 += i10, t10 = r10 + 1;
        }
        return r10 !== t10 && (n10 += e10.slice(t10, r10)), n10;
      }
      var ok = {}, oT = /* @__PURE__ */ new Set(["animation-iteration-count", "border-image-outset", "border-image-slice", "border-image-width", "box-flex", "box-flex-group", "box-ordinal-group", "column-count", "fill-opacity", "flex", "flex-grow", "flex-negative", "flex-order", "flex-positive", "flex-shrink", "flood-opacity", "font-weight", "grid-column", "grid-row", "line-clamp", "line-height", "opacity", "order", "orphans", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "widows", "z-index", "zoom"]), oR = /[A-Z]/g;
      function oP() {
        this.__d = true;
      }
      function oC(e10, t10, r10) {
        if (!e10.s) {
          if (r10 instanceof oU) {
            if (!r10.s) return void (r10.o = oC.bind(null, e10, t10));
            1 & t10 && (t10 = r10.s), r10 = r10.v;
          }
          if (r10 && r10.then) return void r10.then(oC.bind(null, e10, t10), oC.bind(null, e10, 2));
          e10.s = t10, e10.v = r10;
          let n10 = e10.o;
          n10 && n10(e10);
        }
      }
      var oA, oO, oI, oN, oU = function() {
        function e10() {
        }
        return e10.prototype.then = function(t10, r10) {
          var n10 = new e10(), i10 = this.s;
          if (i10) {
            var a10 = 1 & i10 ? t10 : r10;
            if (a10) {
              try {
                oC(n10, 1, a10(this.v));
              } catch (e11) {
                oC(n10, 2, e11);
              }
              return n10;
            }
            return this;
          }
          return this.o = function(e11) {
            try {
              var i11 = e11.v;
              1 & e11.s ? oC(n10, 1, t10 ? t10(i11) : i11) : r10 ? oC(n10, 1, r10(i11)) : oC(n10, 2, i11);
            } catch (e12) {
              oC(n10, 2, e12);
            }
          }, n10;
        }, e10;
      }(), oj = {}, o$ = [], oD = Array.isArray, oL = Object.assign;
      function oM(e10, t10) {
        var r10, n10 = e10.type, i10 = true;
        return e10.__c ? (i10 = false, (r10 = e10.__c).state = r10.__s) : r10 = new n10(e10.props, t10), e10.__c = r10, r10.__v = e10, r10.props = e10.props, r10.context = t10, r10.__d = true, null == r10.state && (r10.state = oj), null == r10.__s && (r10.__s = r10.state), n10.getDerivedStateFromProps ? r10.state = oL({}, r10.state, n10.getDerivedStateFromProps(r10.props, r10.state)) : i10 && r10.componentWillMount ? (r10.componentWillMount(), r10.state = r10.__s !== r10.state ? r10.__s : r10.state) : !i10 && r10.componentWillUpdate && r10.componentWillUpdate(), oI && oI(e10), r10.render(r10.props, r10.state, t10);
      }
      var oH = /* @__PURE__ */ new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]), oW = 0;
      function oB(e10, t10, r10, n10, i10, a10) {
        t10 || (t10 = {});
        var o10, s10, l10 = t10;
        "ref" in t10 && (o10 = t10.ref, delete t10.ref);
        var c2 = { type: e10, props: l10, key: r10, ref: o10, __k: null, __: null, __b: 0, __e: null, __d: void 0, __c: null, constructor: void 0, __v: --oW, __i: -1, __u: 0, __source: i10, __self: a10 };
        if ("function" == typeof e10 && (o10 = e10.defaultProps)) for (s10 in o10) void 0 === l10[s10] && (l10[s10] = o10[s10]);
        return a0.vnode && a0.vnode(c2), c2;
      }
      async function oq(e10, t10) {
        let r10 = window.SimpleWebAuthnBrowser;
        async function n10(r11) {
          let n11 = new URL(`${e10}/webauthn-options/${t10}`);
          r11 && n11.searchParams.append("action", r11), a10().forEach((e11) => {
            n11.searchParams.append(e11.name, e11.value);
          });
          let i11 = await fetch(n11);
          return i11.ok ? i11.json() : void console.error("Failed to fetch options", i11);
        }
        function i10() {
          let e11 = `#${t10}-form`, r11 = document.querySelector(e11);
          if (!r11) throw Error(`Form '${e11}' not found`);
          return r11;
        }
        function a10() {
          return Array.from(i10().querySelectorAll("input[data-form-field]"));
        }
        async function o10(e11, t11) {
          let r11 = i10();
          if (e11) {
            let t12 = document.createElement("input");
            t12.type = "hidden", t12.name = "action", t12.value = e11, r11.appendChild(t12);
          }
          if (t11) {
            let e12 = document.createElement("input");
            e12.type = "hidden", e12.name = "data", e12.value = JSON.stringify(t11), r11.appendChild(e12);
          }
          return r11.submit();
        }
        async function s10(e11, t11) {
          let n11 = await r10.startAuthentication(e11, t11);
          return await o10("authenticate", n11);
        }
        async function l10(e11) {
          a10().forEach((e12) => {
            if (e12.required && !e12.value) throw Error(`Missing required field: ${e12.name}`);
          });
          let t11 = await r10.startRegistration(e11);
          return await o10("register", t11);
        }
        async function c2() {
          if (!r10.browserSupportsWebAuthnAutofill()) return;
          let e11 = await n10("authenticate");
          if (!e11) return void console.error("Failed to fetch option for autofill authentication");
          try {
            await s10(e11.options, true);
          } catch (e12) {
            console.error(e12);
          }
        }
        (async function() {
          let e11 = i10();
          if (!r10.browserSupportsWebAuthn()) {
            e11.style.display = "none";
            return;
          }
          e11 && e11.addEventListener("submit", async (e12) => {
            e12.preventDefault();
            let t11 = await n10(void 0);
            if (!t11) return void console.error("Failed to fetch options for form submission");
            if ("authenticate" === t11.action) try {
              await s10(t11.options, false);
            } catch (e13) {
              console.error(e13);
            }
            else if ("register" === t11.action) try {
              await l10(t11.options);
            } catch (e13) {
              console.error(e13);
            }
          });
        })(), c2();
      }
      let oz = { default: "Unable to sign in.", Signin: "Try signing in with a different account.", OAuthSignin: "Try signing in with a different account.", OAuthCallbackError: "Try signing in with a different account.", OAuthCreateAccount: "Try signing in with a different account.", EmailCreateAccount: "Try signing in with a different account.", Callback: "Try signing in with a different account.", OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.", EmailSignin: "The e-mail could not be sent.", CredentialsSignin: "Sign in failed. Check the details you provided are correct.", SessionRequired: "Please sign in to access this page." }, oF = `:root {
  --border-width: 1px;
  --border-radius: 0.5rem;
  --color-error: #c94b4b;
  --color-info: #157efb;
  --color-info-hover: #0f6ddb;
  --color-info-text: #fff;
}

.__next-auth-theme-auto,
.__next-auth-theme-light {
  --color-background: #ececec;
  --color-background-hover: rgba(236, 236, 236, 0.8);
  --color-background-card: #fff;
  --color-text: #000;
  --color-primary: #444;
  --color-control-border: #bbb;
  --color-button-active-background: #f9f9f9;
  --color-button-active-border: #aaa;
  --color-separator: #ccc;
  --provider-bg: #fff;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #fff
  );
}

.__next-auth-theme-dark {
  --color-background: #161b22;
  --color-background-hover: rgba(22, 27, 34, 0.8);
  --color-background-card: #0d1117;
  --color-text: #fff;
  --color-primary: #ccc;
  --color-control-border: #555;
  --color-button-active-background: #060606;
  --color-button-active-border: #666;
  --color-separator: #444;
  --provider-bg: #161b22;
  --provider-bg-hover: color-mix(
    in srgb,
    var(--provider-brand-color) 30%,
    #000
  );
}

.__next-auth-theme-dark img[src$="42-school.svg"],
  .__next-auth-theme-dark img[src$="apple.svg"],
  .__next-auth-theme-dark img[src$="boxyhq-saml.svg"],
  .__next-auth-theme-dark img[src$="eveonline.svg"],
  .__next-auth-theme-dark img[src$="github.svg"],
  .__next-auth-theme-dark img[src$="mailchimp.svg"],
  .__next-auth-theme-dark img[src$="medium.svg"],
  .__next-auth-theme-dark img[src$="okta.svg"],
  .__next-auth-theme-dark img[src$="patreon.svg"],
  .__next-auth-theme-dark img[src$="ping-id.svg"],
  .__next-auth-theme-dark img[src$="roblox.svg"],
  .__next-auth-theme-dark img[src$="threads.svg"],
  .__next-auth-theme-dark img[src$="wikimedia.svg"] {
    filter: invert(1);
  }

.__next-auth-theme-dark #submitButton {
    background-color: var(--provider-bg, var(--color-info));
  }

@media (prefers-color-scheme: dark) {
  .__next-auth-theme-auto {
    --color-background: #161b22;
    --color-background-hover: rgba(22, 27, 34, 0.8);
    --color-background-card: #0d1117;
    --color-text: #fff;
    --color-primary: #ccc;
    --color-control-border: #555;
    --color-button-active-background: #060606;
    --color-button-active-border: #666;
    --color-separator: #444;
    --provider-bg: #161b22;
    --provider-bg-hover: color-mix(
      in srgb,
      var(--provider-brand-color) 30%,
      #000
    );
  }
    .__next-auth-theme-auto img[src$="42-school.svg"],
    .__next-auth-theme-auto img[src$="apple.svg"],
    .__next-auth-theme-auto img[src$="boxyhq-saml.svg"],
    .__next-auth-theme-auto img[src$="eveonline.svg"],
    .__next-auth-theme-auto img[src$="github.svg"],
    .__next-auth-theme-auto img[src$="mailchimp.svg"],
    .__next-auth-theme-auto img[src$="medium.svg"],
    .__next-auth-theme-auto img[src$="okta.svg"],
    .__next-auth-theme-auto img[src$="patreon.svg"],
    .__next-auth-theme-auto img[src$="ping-id.svg"],
    .__next-auth-theme-auto img[src$="roblox.svg"],
    .__next-auth-theme-auto img[src$="threads.svg"],
    .__next-auth-theme-auto img[src$="wikimedia.svg"] {
      filter: invert(1);
    }
    .__next-auth-theme-auto #submitButton {
      background-color: var(--provider-bg, var(--color-info));
    }
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-background);
  margin: 0;
  padding: 0;
  font-family:
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    "Noto Sans",
    sans-serif,
    "Apple Color Emoji",
    "Segoe UI Emoji",
    "Segoe UI Symbol",
    "Noto Color Emoji";
}

h1 {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  font-weight: 400;
  color: var(--color-text);
}

p {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  color: var(--color-text);
}

form {
  margin: 0;
  padding: 0;
}

label {
  font-weight: 500;
  text-align: left;
  margin-bottom: 0.25rem;
  display: block;
  color: var(--color-text);
}

input[type] {
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  border: var(--border-width) solid var(--color-control-border);
  background: var(--color-background-card);
  font-size: 1rem;
  border-radius: var(--border-radius);
  color: var(--color-text);
}

p {
  font-size: 1.1rem;
  line-height: 2rem;
}

a.button {
  text-decoration: none;
  line-height: 1rem;
}

a.button:link,
  a.button:visited {
    background-color: var(--color-background);
    color: var(--color-primary);
  }

button,
a.button {
  padding: 0.75rem 1rem;
  color: var(--provider-color, var(--color-primary));
  background-color: var(--provider-bg, var(--color-background));
  border: 1px solid #00000031;
  font-size: 0.9rem;
  height: 50px;
  border-radius: var(--border-radius);
  transition: background-color 250ms ease-in-out;
  font-weight: 300;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:is(button,a.button):hover {
    background-color: var(--provider-bg-hover, var(--color-background-hover));
    cursor: pointer;
  }

:is(button,a.button):active {
    cursor: pointer;
  }

:is(button,a.button) span {
    color: var(--provider-bg);
  }

#submitButton {
  color: var(--button-text-color, var(--color-info-text));
  background-color: var(--brand-color, var(--color-info));
  width: 100%;
}

#submitButton:hover {
    background-color: var(
      --button-hover-bg,
      var(--color-info-hover)
    ) !important;
  }

a.site {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 1rem;
  line-height: 2rem;
}

a.site:hover {
    text-decoration: underline;
  }

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page > div {
    text-align: center;
  }

.error a.button {
    padding-left: 2rem;
    padding-right: 2rem;
    margin-top: 0.5rem;
  }

.error .message {
    margin-bottom: 1.5rem;
  }

.signin input[type="text"] {
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

.signin hr {
    display: block;
    border: 0;
    border-top: 1px solid var(--color-separator);
    margin: 2rem auto 1rem auto;
    overflow: visible;
  }

.signin hr::before {
      content: "or";
      background: var(--color-background-card);
      color: #888;
      padding: 0 0.4rem;
      position: relative;
      top: -0.7rem;
    }

.signin .error {
    background: #f5f5f5;
    font-weight: 500;
    border-radius: 0.3rem;
    background: var(--color-error);
  }

.signin .error p {
      text-align: left;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      line-height: 1.2rem;
      color: var(--color-info-text);
    }

.signin > div,
  .signin form {
    display: block;
  }

.signin > div input[type], .signin form input[type] {
      margin-bottom: 0.5rem;
    }

.signin > div button, .signin form button {
      width: 100%;
    }

.signin .provider + .provider {
    margin-top: 1rem;
  }

.logo {
  display: inline-block;
  max-width: 150px;
  margin: 1.25rem 0;
  max-height: 70px;
}

.card {
  background-color: var(--color-background-card);
  border-radius: 1rem;
  padding: 1.25rem 2rem;
}

.card .header {
    color: var(--color-primary);
  }

.card input[type]::-moz-placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type]::placeholder {
    color: color-mix(
      in srgb,
      var(--color-text) 20%,
      var(--color-button-active-background)
    );
  }

.card input[type] {
    background: color-mix(in srgb, var(--color-background-card) 95%, black);
  }

.section-header {
  color: var(--color-text);
}

@media screen and (min-width: 450px) {
  .card {
    margin: 2rem 0;
    width: 368px;
  }
}

@media screen and (max-width: 450px) {
  .card {
    margin: 1rem 0;
    width: 343px;
  }
}
`;
      function oK({ html: e10, title: t10, status: r10, cookies: n10, theme: i10, headTags: a10 }) {
        return { cookies: n10, status: r10, headers: { "Content-Type": "text/html" }, body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${oF}</style><title>${t10}</title>${a10 ?? ""}</head><body class="__next-auth-theme-${i10?.colorScheme ?? "auto"}"><div class="page">${function(e11) {
          var t11 = a0.__s;
          a0.__s = true, oA = a0.__b, oO = a0.diffed, oI = a0.__r, oN = a0.unmount;
          var r11 = function(e12, t12, r12) {
            var n12, i11, a11, o10 = {};
            for (a11 in t12) "key" == a11 ? n12 = t12[a11] : "ref" == a11 ? i11 = t12[a11] : o10[a11] = t12[a11];
            if (arguments.length > 2 && (o10.children = arguments.length > 3 ? aQ.call(arguments, 2) : r12), "function" == typeof e12 && null != e12.defaultProps) for (a11 in e12.defaultProps) void 0 === o10[a11] && (o10[a11] = e12.defaultProps[a11]);
            return oa(e12, o10, n12, i11, null);
          }(oo, null);
          r11.__k = [e11];
          try {
            var n11 = function e12(t12, r12, n12, i11, a11, o10, s10) {
              if (null == t12 || true === t12 || false === t12 || "" === t12) return "";
              var l10 = typeof t12;
              if ("object" != l10) return "function" == l10 ? "" : "string" == l10 ? oS(t12) : t12 + "";
              if (oD(t12)) {
                var c2, u2 = "";
                a11.__k = t12;
                for (var d2 = 0; d2 < t12.length; d2++) {
                  var p2 = t12[d2];
                  if (null != p2 && "boolean" != typeof p2) {
                    var h2, f2 = e12(p2, r12, n12, i11, a11, o10, s10);
                    "string" == typeof f2 ? u2 += f2 : (c2 || (c2 = []), u2 && c2.push(u2), u2 = "", oD(f2) ? (h2 = c2).push.apply(h2, f2) : c2.push(f2));
                  }
                }
                return c2 ? (u2 && c2.push(u2), c2) : u2;
              }
              if (void 0 !== t12.constructor) return "";
              t12.__ = a11, oA && oA(t12);
              var g2 = t12.type, m2 = t12.props;
              if ("function" == typeof g2) {
                var y2, b2, v2, w2 = r12;
                if (g2 === oo) {
                  if ("tpl" in m2) {
                    for (var _2 = "", E2 = 0; E2 < m2.tpl.length; E2++) if (_2 += m2.tpl[E2], m2.exprs && E2 < m2.exprs.length) {
                      var x2 = m2.exprs[E2];
                      if (null == x2) continue;
                      "object" == typeof x2 && (void 0 === x2.constructor || oD(x2)) ? _2 += e12(x2, r12, n12, i11, t12, o10, s10) : _2 += x2;
                    }
                    return _2;
                  }
                  if ("UNSTABLE_comment" in m2) return "<!--" + oS(m2.UNSTABLE_comment) + "-->";
                  b2 = m2.children;
                } else {
                  if (null != (y2 = g2.contextType)) {
                    var S2 = r12[y2.__c];
                    w2 = S2 ? S2.props.value : y2.__;
                  }
                  var k2 = g2.prototype && "function" == typeof g2.prototype.render;
                  if (k2) b2 = oM(t12, w2), v2 = t12.__c;
                  else {
                    t12.__c = v2 = { __v: t12, context: w2, props: t12.props, setState: oP, forceUpdate: oP, __d: true, __h: [] };
                    for (var T2 = 0; v2.__d && T2++ < 25; ) v2.__d = false, oI && oI(t12), b2 = g2.call(v2, m2, w2);
                    v2.__d = true;
                  }
                  if (null != v2.getChildContext && (r12 = oL({}, r12, v2.getChildContext())), k2 && a0.errorBoundaries && (g2.getDerivedStateFromError || v2.componentDidCatch)) {
                    b2 = null != b2 && b2.type === oo && null == b2.key && null == b2.props.tpl ? b2.props.children : b2;
                    try {
                      return e12(b2, r12, n12, i11, t12, o10, s10);
                    } catch (a12) {
                      return g2.getDerivedStateFromError && (v2.__s = g2.getDerivedStateFromError(a12)), v2.componentDidCatch && v2.componentDidCatch(a12, oj), v2.__d ? (b2 = oM(t12, r12), null != (v2 = t12.__c).getChildContext && (r12 = oL({}, r12, v2.getChildContext())), e12(b2 = null != b2 && b2.type === oo && null == b2.key && null == b2.props.tpl ? b2.props.children : b2, r12, n12, i11, t12, o10, s10)) : "";
                    } finally {
                      oO && oO(t12), t12.__ = null, oN && oN(t12);
                    }
                  }
                }
                b2 = null != b2 && b2.type === oo && null == b2.key && null == b2.props.tpl ? b2.props.children : b2;
                try {
                  var R2 = e12(b2, r12, n12, i11, t12, o10, s10);
                  return oO && oO(t12), t12.__ = null, a0.unmount && a0.unmount(t12), R2;
                } catch (a12) {
                  if (!o10 && s10 && s10.onError) {
                    var P2 = s10.onError(a12, t12, function(a13) {
                      return e12(a13, r12, n12, i11, t12, o10, s10);
                    });
                    if (void 0 !== P2) return P2;
                    var C2 = a0.__e;
                    return C2 && C2(a12, t12), "";
                  }
                  if (!o10 || !a12 || "function" != typeof a12.then) throw a12;
                  return a12.then(function a13() {
                    try {
                      return e12(b2, r12, n12, i11, t12, o10, s10);
                    } catch (l11) {
                      if (!l11 || "function" != typeof l11.then) throw l11;
                      return l11.then(function() {
                        return e12(b2, r12, n12, i11, t12, o10, s10);
                      }, a13);
                    }
                  });
                }
              }
              var A2, O2 = "<" + g2, I2 = "";
              for (var N2 in m2) {
                var U2 = m2[N2];
                if ("function" != typeof U2 || "class" === N2 || "className" === N2) {
                  switch (N2) {
                    case "children":
                      A2 = U2;
                      continue;
                    case "key":
                    case "ref":
                    case "__self":
                    case "__source":
                      continue;
                    case "htmlFor":
                      if ("for" in m2) continue;
                      N2 = "for";
                      break;
                    case "className":
                      if ("class" in m2) continue;
                      N2 = "class";
                      break;
                    case "defaultChecked":
                      N2 = "checked";
                      break;
                    case "defaultSelected":
                      N2 = "selected";
                      break;
                    case "defaultValue":
                    case "value":
                      switch (N2 = "value", g2) {
                        case "textarea":
                          A2 = U2;
                          continue;
                        case "select":
                          i11 = U2;
                          continue;
                        case "option":
                          i11 != U2 || "selected" in m2 || (O2 += " selected");
                      }
                      break;
                    case "dangerouslySetInnerHTML":
                      I2 = U2 && U2.__html;
                      continue;
                    case "style":
                      "object" == typeof U2 && (U2 = function(e13) {
                        var t13 = "";
                        for (var r13 in e13) {
                          var n13 = e13[r13];
                          if (null != n13 && "" !== n13) {
                            var i12 = "-" == r13[0] ? r13 : ok[r13] || (ok[r13] = r13.replace(oR, "-$&").toLowerCase()), a12 = ";";
                            "number" != typeof n13 || i12.startsWith("--") || oT.has(i12) || (a12 = "px;"), t13 = t13 + i12 + ":" + n13 + a12;
                          }
                        }
                        return t13 || void 0;
                      }(U2));
                      break;
                    case "acceptCharset":
                      N2 = "accept-charset";
                      break;
                    case "httpEquiv":
                      N2 = "http-equiv";
                      break;
                    default:
                      if (ov.test(N2)) N2 = N2.replace(ov, "$1:$2").toLowerCase();
                      else {
                        if (ob.test(N2)) continue;
                        ("-" === N2[4] || oE.has(N2)) && null != U2 ? U2 += "" : n12 ? o_.test(N2) && (N2 = "panose1" === N2 ? "panose-1" : N2.replace(/([A-Z])/g, "-$1").toLowerCase()) : ow.test(N2) && (N2 = N2.toLowerCase());
                      }
                  }
                  null != U2 && false !== U2 && (O2 = true === U2 || "" === U2 ? O2 + " " + N2 : O2 + " " + N2 + '="' + ("string" == typeof U2 ? oS(U2) : U2 + "") + '"');
                }
              }
              if (ob.test(g2)) throw Error(g2 + " is not a valid HTML tag name in " + O2 + ">");
              if (I2 || ("string" == typeof A2 ? I2 = oS(A2) : null != A2 && false !== A2 && true !== A2 && (I2 = e12(A2, r12, "svg" === g2 || "foreignObject" !== g2 && n12, i11, t12, o10, s10))), oO && oO(t12), t12.__ = null, oN && oN(t12), !I2 && oH.has(g2)) return O2 + "/>";
              var j2 = "</" + g2 + ">", $2 = O2 + ">";
              return oD(I2) ? [$2].concat(I2, [j2]) : "string" != typeof I2 ? [$2, I2, j2] : $2 + I2 + j2;
            }(e11, oj, false, void 0, r11, false, void 0);
            return oD(n11) ? n11.join("") : n11;
          } catch (e12) {
            if (e12.then) throw Error('Use "renderToStringAsync" for suspenseful rendering.');
            throw e12;
          } finally {
            a0.__c && a0.__c(e11, o$), a0.__s = t11, o$.length = 0;
          }
        }(e10)}</div></body></html>` };
      }
      function oV(e10) {
        let { url: t10, theme: r10, query: n10, cookies: i10, pages: a10, providers: o10 } = e10;
        return { csrf: (e11, t11, r11) => e11 ? (t11.logger.warn("csrf-disabled"), r11.push({ name: t11.cookies.csrfToken.name, value: "", options: { ...t11.cookies.csrfToken.options, maxAge: 0 } }), { status: 404, cookies: r11 }) : { headers: { "Content-Type": "application/json", "Cache-Control": "private, no-cache, no-store", Expires: "0", Pragma: "no-cache" }, body: { csrfToken: t11.csrfToken }, cookies: r11 }, providers: (e11) => ({ headers: { "Content-Type": "application/json" }, body: e11.reduce((e12, { id: t11, name: r11, type: n11, signinUrl: i11, callbackUrl: a11 }) => (e12[t11] = { id: t11, name: r11, type: n11, signinUrl: i11, callbackUrl: a11 }, e12), {}) }), signin(t11, s10) {
          if (t11) throw new rq("Unsupported action");
          if (a10?.signIn) {
            let t12 = `${a10.signIn}${a10.signIn.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: e10.callbackUrl ?? "/" })}`;
            return s10 && (t12 = `${t12}&${new URLSearchParams({ error: s10 })}`), { redirect: t12, cookies: i10 };
          }
          let l10 = o10?.find((e11) => "webauthn" === e11.type && e11.enableConditionalUI && !!e11.simpleWebAuthnBrowserVersion), c2 = "";
          if (l10) {
            let { simpleWebAuthnBrowserVersion: e11 } = l10;
            c2 = `<script src="https://unpkg.com/@simplewebauthn/browser@${e11}/dist/bundle/index.umd.min.js" crossorigin="anonymous"></script>`;
          }
          return oK({ cookies: i10, theme: r10, html: function(e11) {
            let { csrfToken: t12, providers: r11 = [], callbackUrl: n11, theme: i11, email: a11, error: o11 } = e11;
            "u" > typeof document && i11?.brandColor && document.documentElement.style.setProperty("--brand-color", i11.brandColor), "u" > typeof document && i11?.buttonText && document.documentElement.style.setProperty("--button-text-color", i11.buttonText);
            let s11 = o11 && (oz[o11] ?? oz.default), l11 = r11.find((e12) => "webauthn" === e12.type && e12.enableConditionalUI)?.id;
            return oB("div", { className: "signin", children: [i11?.brandColor && oB("style", { dangerouslySetInnerHTML: { __html: `:root {--brand-color: ${i11.brandColor}}` } }), i11?.buttonText && oB("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${i11.buttonText}
        }
      ` } }), oB("div", { className: "card", children: [s11 && oB("div", { className: "error", children: oB("p", { children: s11 }) }), i11?.logo && oB("img", { src: i11.logo, alt: "Logo", className: "logo" }), r11.map((e12, i12) => {
              let o12, s12, l12;
              ("oauth" === e12.type || "oidc" === e12.type) && ({ bg: o12 = "#fff", brandColor: s12, logo: l12 = `https://authjs.dev/img/providers/${e12.id}.svg` } = e12.style ?? {});
              let c3 = s12 ?? o12 ?? "#fff";
              return oB("div", { className: "provider", children: ["oauth" === e12.type || "oidc" === e12.type ? oB("form", { action: e12.signinUrl, method: "POST", children: [oB("input", { type: "hidden", name: "csrfToken", value: t12 }), n11 && oB("input", { type: "hidden", name: "callbackUrl", value: n11 }), oB("button", { type: "submit", className: "button", style: { "--provider-brand-color": c3 }, tabIndex: 0, children: [oB("span", { style: { filter: "invert(1) grayscale(1) brightness(1.3) contrast(9000)", "mix-blend-mode": "luminosity", opacity: 0.95 }, children: ["Sign in with ", e12.name] }), l12 && oB("img", { loading: "lazy", height: 24, src: l12 })] })] }) : null, ("email" === e12.type || "credentials" === e12.type || "webauthn" === e12.type) && i12 > 0 && "email" !== r11[i12 - 1].type && "credentials" !== r11[i12 - 1].type && "webauthn" !== r11[i12 - 1].type && oB("hr", {}), "email" === e12.type && oB("form", { action: e12.signinUrl, method: "POST", children: [oB("input", { type: "hidden", name: "csrfToken", value: t12 }), oB("label", { className: "section-header", htmlFor: `input-email-for-${e12.id}-provider`, children: "Email" }), oB("input", { id: `input-email-for-${e12.id}-provider`, autoFocus: true, type: "email", name: "email", value: a11, placeholder: "email@example.com", required: true }), oB("button", { id: "submitButton", type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), "credentials" === e12.type && oB("form", { action: e12.callbackUrl, method: "POST", children: [oB("input", { type: "hidden", name: "csrfToken", value: t12 }), Object.keys(e12.credentials).map((t13) => oB("div", { children: [oB("label", { className: "section-header", htmlFor: `input-${t13}-for-${e12.id}-provider`, children: e12.credentials[t13].label ?? t13 }), oB("input", { name: t13, id: `input-${t13}-for-${e12.id}-provider`, type: e12.credentials[t13].type ?? "text", placeholder: e12.credentials[t13].placeholder ?? "", ...e12.credentials[t13] })] }, `input-group-${e12.id}`)), oB("button", { id: "submitButton", type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), "webauthn" === e12.type && oB("form", { action: e12.callbackUrl, method: "POST", id: `${e12.id}-form`, children: [oB("input", { type: "hidden", name: "csrfToken", value: t12 }), Object.keys(e12.formFields).map((t13) => oB("div", { children: [oB("label", { className: "section-header", htmlFor: `input-${t13}-for-${e12.id}-provider`, children: e12.formFields[t13].label ?? t13 }), oB("input", { name: t13, "data-form-field": true, id: `input-${t13}-for-${e12.id}-provider`, type: e12.formFields[t13].type ?? "text", placeholder: e12.formFields[t13].placeholder ?? "", ...e12.formFields[t13] })] }, `input-group-${e12.id}`)), oB("button", { id: `submitButton-${e12.id}`, type: "submit", tabIndex: 0, children: ["Sign in with ", e12.name] })] }), ("email" === e12.type || "credentials" === e12.type || "webauthn" === e12.type) && i12 + 1 < r11.length && oB("hr", {})] }, e12.id);
            })] }), l11 && oB(oo, { children: oB("script", { dangerouslySetInnerHTML: { __html: `
const currentURL = window.location.href;
const authURL = currentURL.substring(0, currentURL.lastIndexOf('/'));
(${oq})(authURL, "${l11}");
` } }) })] });
          }({ csrfToken: e10.csrfToken, providers: e10.providers?.filter((e11) => ["email", "oauth", "oidc"].includes(e11.type) || "credentials" === e11.type && e11.credentials || "webauthn" === e11.type && e11.formFields || false), callbackUrl: e10.callbackUrl, theme: e10.theme, error: s10, ...n10 }), title: "Sign In", headTags: c2 });
        }, signout: () => a10?.signOut ? { redirect: a10.signOut, cookies: i10 } : oK({ cookies: i10, theme: r10, html: function(e11) {
          let { url: t11, csrfToken: r11, theme: n11 } = e11;
          return oB("div", { className: "signout", children: [n11?.brandColor && oB("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${n11.brandColor}
        }
      ` } }), n11?.buttonText && oB("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --button-text-color: ${n11.buttonText}
        }
      ` } }), oB("div", { className: "card", children: [n11?.logo && oB("img", { src: n11.logo, alt: "Logo", className: "logo" }), oB("h1", { children: "Signout" }), oB("p", { children: "Are you sure you want to sign out?" }), oB("form", { action: t11?.toString(), method: "POST", children: [oB("input", { type: "hidden", name: "csrfToken", value: r11 }), oB("button", { id: "submitButton", type: "submit", children: "Sign out" })] })] })] });
        }({ csrfToken: e10.csrfToken, url: t10, theme: r10 }), title: "Sign Out" }), verifyRequest: (e11) => a10?.verifyRequest ? { redirect: `${a10.verifyRequest}${t10?.search ?? ""}`, cookies: i10 } : oK({ cookies: i10, theme: r10, html: function(e12) {
          let { url: t11, theme: r11 } = e12;
          return oB("div", { className: "verify-request", children: [r11.brandColor && oB("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${r11.brandColor}
        }
      ` } }), oB("div", { className: "card", children: [r11.logo && oB("img", { src: r11.logo, alt: "Logo", className: "logo" }), oB("h1", { children: "Check your email" }), oB("p", { children: "A sign in link has been sent to your email address." }), oB("p", { children: oB("a", { className: "site", href: t11.origin, children: t11.host }) })] })] });
        }({ url: t10, theme: r10, ...e11 }), title: "Verify Request" }), error: (e11) => a10?.error ? { redirect: `${a10.error}${a10.error.includes("?") ? "&" : "?"}error=${e11}`, cookies: i10 } : oK({ cookies: i10, theme: r10, ...function(e12) {
          let { url: t11, error: r11 = "default", theme: n11 } = e12, i11 = `${t11}/signin`, a11 = { default: { status: 200, heading: "Error", message: oB("p", { children: oB("a", { className: "site", href: t11?.origin, children: t11?.host }) }) }, Configuration: { status: 500, heading: "Server error", message: oB("div", { children: [oB("p", { children: "There is a problem with the server configuration." }), oB("p", { children: "Check the server logs for more information." })] }) }, AccessDenied: { status: 403, heading: "Access Denied", message: oB("div", { children: [oB("p", { children: "You do not have permission to sign in." }), oB("p", { children: oB("a", { className: "button", href: i11, children: "Sign in" }) })] }) }, Verification: { status: 403, heading: "Unable to sign in", message: oB("div", { children: [oB("p", { children: "The sign in link is no longer valid." }), oB("p", { children: "It may have been used already or it may have expired." })] }), signin: oB("a", { className: "button", href: i11, children: "Sign in" }) } }, { status: o11, heading: s10, message: l10, signin: c2 } = a11[r11] ?? a11.default;
          return { status: o11, html: oB("div", { className: "error", children: [n11?.brandColor && oB("style", { dangerouslySetInnerHTML: { __html: `
        :root {
          --brand-color: ${n11?.brandColor}
        }
      ` } }), oB("div", { className: "card", children: [n11?.logo && oB("img", { src: n11?.logo, alt: "Logo", className: "logo" }), oB("h1", { children: s10 }), oB("div", { className: "message", children: l10 }), c2] })] }) };
        }({ url: t10, theme: r10, error: e11 }), title: "Error" }) };
      }
      function oJ(e10, t10 = Date.now()) {
        return new Date(t10 + 1e3 * e10);
      }
      async function oG(e10, t10, r10, n10) {
        if (!r10?.providerAccountId || !r10.type) throw Error("Missing or invalid provider account");
        if (!["email", "oauth", "oidc", "webauthn"].includes(r10.type)) throw Error("Provider not supported");
        let { adapter: i10, jwt: a10, events: o10, session: { strategy: s10, generateSessionToken: l10 } } = n10;
        if (!i10) return { user: t10, account: r10 };
        let c2 = r10, { createUser: u2, updateUser: d2, getUser: p2, getUserByAccount: h2, getUserByEmail: f2, linkAccount: g2, createSession: m2, getSessionAndUser: y2, deleteSession: b2 } = i10, v2 = null, w2 = null, _2 = false, E2 = "jwt" === s10;
        if (e10) if (E2) try {
          let t11 = n10.cookies.sessionToken.name;
          (v2 = await a10.decode({ ...a10, token: e10, salt: t11 })) && "sub" in v2 && v2.sub && (w2 = await p2(v2.sub));
        } catch {
        }
        else {
          let t11 = await y2(e10);
          t11 && (v2 = t11.session, w2 = t11.user);
        }
        if ("email" === c2.type) {
          let r11 = await f2(t10.email);
          return r11 ? (w2?.id !== r11.id && !E2 && e10 && await b2(e10), w2 = await d2({ id: r11.id, emailVerified: /* @__PURE__ */ new Date() }), await o10.updateUser?.({ user: w2 })) : (w2 = await u2({ ...t10, emailVerified: /* @__PURE__ */ new Date() }), await o10.createUser?.({ user: w2 }), _2 = true), { session: v2 = E2 ? {} : await m2({ sessionToken: l10(), userId: w2.id, expires: oJ(n10.session.maxAge) }), user: w2, isNewUser: _2 };
        }
        if ("webauthn" === c2.type) {
          let e11 = await h2({ providerAccountId: c2.providerAccountId, provider: c2.provider });
          if (e11) {
            if (w2) {
              if (e11.id === w2.id) {
                let e12 = { ...c2, userId: w2.id };
                return { session: v2, user: w2, isNewUser: _2, account: e12 };
              }
              throw new rQ("The account is already associated with another user", { provider: c2.provider });
            }
            v2 = E2 ? {} : await m2({ sessionToken: l10(), userId: e11.id, expires: oJ(n10.session.maxAge) });
            let t11 = { ...c2, userId: e11.id };
            return { session: v2, user: e11, isNewUser: _2, account: t11 };
          }
          {
            if (w2) {
              await g2({ ...c2, userId: w2.id }), await o10.linkAccount?.({ user: w2, account: c2, profile: t10 });
              let e13 = { ...c2, userId: w2.id };
              return { session: v2, user: w2, isNewUser: _2, account: e13 };
            }
            if (t10.email ? await f2(t10.email) : null) throw new rQ("Another account already exists with the same e-mail address", { provider: c2.provider });
            w2 = await u2({ ...t10 }), await o10.createUser?.({ user: w2 }), await g2({ ...c2, userId: w2.id }), await o10.linkAccount?.({ user: w2, account: c2, profile: t10 }), v2 = E2 ? {} : await m2({ sessionToken: l10(), userId: w2.id, expires: oJ(n10.session.maxAge) });
            let e12 = { ...c2, userId: w2.id };
            return { session: v2, user: w2, isNewUser: true, account: e12 };
          }
        }
        let x2 = await h2({ providerAccountId: c2.providerAccountId, provider: c2.provider });
        if (x2) {
          if (w2) {
            if (x2.id === w2.id) return { session: v2, user: w2, isNewUser: _2 };
            throw new rL("The account is already associated with another user", { provider: c2.provider });
          }
          return { session: v2 = E2 ? {} : await m2({ sessionToken: l10(), userId: x2.id, expires: oJ(n10.session.maxAge) }), user: x2, isNewUser: _2 };
        }
        {
          let { provider: e11 } = n10, { type: r11, provider: i11, providerAccountId: a11, userId: s11, ...d3 } = c2;
          if (c2 = Object.assign(e11.account(d3) ?? {}, { providerAccountId: a11, provider: i11, type: r11, userId: s11 }), w2) return await g2({ ...c2, userId: w2.id }), await o10.linkAccount?.({ user: w2, account: c2, profile: t10 }), { session: v2, user: w2, isNewUser: _2 };
          let p3 = t10.email ? await f2(t10.email) : null;
          if (p3) {
            let e12 = n10.provider;
            if (e12?.allowDangerousEmailAccountLinking) w2 = p3, _2 = false;
            else throw new rL("Another account already exists with the same e-mail address", { provider: c2.provider });
          } else w2 = await u2({ ...t10, emailVerified: null }), _2 = true;
          return await o10.createUser?.({ user: w2 }), await g2({ ...c2, userId: w2.id }), await o10.linkAccount?.({ user: w2, account: c2, profile: t10 }), { session: v2 = E2 ? {} : await m2({ sessionToken: l10(), userId: w2.id, expires: oJ(n10.session.maxAge) }), user: w2, isNewUser: _2 };
        }
      }
      function oX(e10, t10) {
        if (null == e10) return false;
        try {
          return e10 instanceof t10 || Object.getPrototypeOf(e10)[Symbol.toStringTag] === t10.prototype[Symbol.toStringTag];
        } catch {
          return false;
        }
      }
      ("u" < typeof navigator || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (i = "oauth4webapi/v3.8.6");
      let oY = "ERR_INVALID_ARG_VALUE", oZ = "ERR_INVALID_ARG_TYPE";
      function oQ(e10, t10, r10) {
        let n10 = TypeError(e10, { cause: r10 });
        return Object.assign(n10, { code: t10 }), n10;
      }
      let o0 = Symbol(), o1 = Symbol(), o2 = Symbol(), o3 = Symbol(), o4 = Symbol(), o5 = Symbol();
      Symbol();
      let o6 = new TextEncoder(), o8 = new TextDecoder();
      function o9(e10) {
        return "string" == typeof e10 ? o6.encode(e10) : o8.decode(e10);
      }
      function o7(e10) {
        return "string" == typeof e10 ? o(e10) : a(e10);
      }
      a = Uint8Array.prototype.toBase64 ? (e10) => (e10 instanceof ArrayBuffer && (e10 = new Uint8Array(e10)), e10.toBase64({ alphabet: "base64url", omitPadding: true })) : (e10) => {
        e10 instanceof ArrayBuffer && (e10 = new Uint8Array(e10));
        let t10 = [];
        for (let r10 = 0; r10 < e10.byteLength; r10 += 32768) t10.push(String.fromCharCode.apply(null, e10.subarray(r10, r10 + 32768)));
        return btoa(t10.join("")).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
      }, o = Uint8Array.fromBase64 ? (e10) => {
        try {
          return Uint8Array.fromBase64(e10, { alphabet: "base64url" });
        } catch (e11) {
          throw oQ("The input to be decoded is not correctly encoded.", oY, e11);
        }
      } : (e10) => {
        try {
          let t10 = atob(e10.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "")), r10 = new Uint8Array(t10.length);
          for (let e11 = 0; e11 < t10.length; e11++) r10[e11] = t10.charCodeAt(e11);
          return r10;
        } catch (e11) {
          throw oQ("The input to be decoded is not correctly encoded.", oY, e11);
        }
      };
      class se extends Error {
        code;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = lt, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class st extends Error {
        code;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, t10?.code && (this.code = t10?.code), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      function sr(e10, t10, r10) {
        return new st(e10, { code: t10, cause: r10 });
      }
      function sn(e10) {
        return !(null === e10 || "object" != typeof e10 || Array.isArray(e10));
      }
      function si(e10) {
        oX(e10, Headers) && (e10 = Object.fromEntries(e10.entries()));
        let t10 = new Headers(e10 ?? {});
        if (i && !t10.has("user-agent") && t10.set("user-agent", i), t10.has("authorization")) throw oQ('"options.headers" must not include the "authorization" header name', oY);
        return t10;
      }
      function sa(e10, t10) {
        if (void 0 !== t10) {
          if ("function" == typeof t10 && (t10 = t10(e10.href)), !(t10 instanceof AbortSignal)) throw oQ('"options.signal" must return or be an instance of AbortSignal', oZ);
          return t10;
        }
      }
      function so(e10) {
        return e10.includes("//") ? e10.replace("//", "/") : e10;
      }
      async function ss(e10, t10, r10, n10) {
        if (!(e10 instanceof URL)) throw oQ(`"${t10}" must be an instance of URL`, oZ);
        sx(e10, n10?.[o0] !== true);
        let i10 = r10(new URL(e10.href)), a10 = si(n10?.headers);
        return a10.set("accept", "application/json"), (n10?.[o3] || fetch)(i10.href, { body: void 0, headers: Object.fromEntries(a10.entries()), method: "GET", redirect: "manual", signal: sa(i10, n10?.signal) });
      }
      async function sl(e10, t10) {
        return ss(e10, "issuerIdentifier", (e11) => {
          switch (t10?.algorithm) {
            case void 0:
            case "oidc":
              e11.pathname = so(`${e11.pathname}/.well-known/openid-configuration`);
              break;
            case "oauth2":
              !function(e12, t11, r10 = false) {
                "/" === e12.pathname ? e12.pathname = t11 : e12.pathname = so(`${t11}/${r10 ? e12.pathname : e12.pathname.replace(/(\/)$/, "")}`);
              }(e11, ".well-known/oauth-authorization-server");
              break;
            default:
              throw oQ('"options.algorithm" must be "oidc" (default), or "oauth2"', oY);
          }
          return e11;
        }, t10);
      }
      function sc(e10, t10, r10, n10, i10) {
        try {
          if ("number" != typeof e10 || !Number.isFinite(e10)) throw oQ(`${r10} must be a number`, oZ, i10);
          if (e10 > 0) return;
          if (t10) {
            if (0 !== e10) throw oQ(`${r10} must be a non-negative number`, oY, i10);
            return;
          }
          throw oQ(`${r10} must be a positive number`, oY, i10);
        } catch (e11) {
          if (n10) throw sr(e11.message, n10, i10);
          throw e11;
        }
      }
      function su(e10, t10, r10, n10) {
        try {
          if ("string" != typeof e10) throw oQ(`${t10} must be a string`, oZ, n10);
          if (0 === e10.length) throw oQ(`${t10} must not be empty`, oY, n10);
        } catch (e11) {
          if (r10) throw sr(e11.message, r10, n10);
          throw e11;
        }
      }
      async function sd(e10, t10) {
        if (!(e10 instanceof URL) && e10 !== lx) throw oQ('"expectedIssuerIdentifier" must be an instance of URL', oZ);
        if (!oX(t10, Response)) throw oQ('"response" must be an instance of Response', oZ);
        if (200 !== t10.status) throw sr('"response" is not a conform Authorization Server Metadata response (unexpected HTTP status code)', ls, t10);
        lg(t10);
        let r10 = await lE(t10);
        if (su(r10.issuer, '"response" body "issuer" property', la, { body: r10 }), e10 !== lx && new URL(r10.issuer).href !== e10.href) throw sr('"response" body "issuer" property does not match the expected value', lp, { expected: e10.href, body: r10, attribute: "issuer" });
        return r10;
      }
      function sp(e10) {
        var t10 = e10, r10 = "application/json";
        if (sH(t10) !== r10) throw function(e11, ...t11) {
          let r11 = '"response" content-type must be ';
          if (t11.length > 2) {
            let e12 = t11.pop();
            r11 += `${t11.join(", ")}, or ${e12}`;
          } else 2 === t11.length ? r11 += `${t11[0]} or ${t11[1]}` : r11 += t11[0];
          return sr(r11, lo, e11);
        }(t10, r10);
      }
      function sh() {
        return o7(crypto.getRandomValues(new Uint8Array(32)));
      }
      async function sf(e10) {
        return su(e10, "codeVerifier"), o7(await crypto.subtle.digest("SHA-256", o9(e10)));
      }
      function sg(e10) {
        let t10 = e10?.[o1];
        return "number" == typeof t10 && Number.isFinite(t10) ? t10 : 0;
      }
      function sm(e10) {
        let t10 = e10?.[o2];
        return "number" == typeof t10 && Number.isFinite(t10) && -1 !== Math.sign(t10) ? t10 : 30;
      }
      function sy() {
        return Math.floor(Date.now() / 1e3);
      }
      function sb(e10) {
        if ("object" != typeof e10 || null === e10) throw oQ('"as" must be an object', oZ);
        su(e10.issuer, '"as.issuer"');
      }
      function sv(e10) {
        if ("object" != typeof e10 || null === e10) throw oQ('"client" must be an object', oZ);
        su(e10.client_id, '"client.client_id"');
      }
      function sw(e10, t10) {
        let r10 = sy() + sg(t10);
        return { jti: sh(), aud: e10.issuer, exp: r10 + 60, iat: r10, nbf: r10, iss: t10.client_id, sub: t10.client_id };
      }
      async function s_(e10, t10, r10) {
        if (!r10.usages.includes("sign")) throw oQ('CryptoKey instances used for signing assertions must include "sign" in their "usages"', oY);
        let n10 = `${o7(o9(JSON.stringify(e10)))}.${o7(o9(JSON.stringify(t10)))}`, i10 = o7(await crypto.subtle.sign(function(e11) {
          switch (e11.algorithm.name) {
            case "ECDSA":
              return { name: e11.algorithm.name, hash: function(e12) {
                let { algorithm: t11 } = e12;
                switch (t11.namedCurve) {
                  case "P-256":
                    return "SHA-256";
                  case "P-384":
                    return "SHA-384";
                  case "P-521":
                    return "SHA-512";
                  default:
                    throw new se("unsupported ECDSA namedCurve", { cause: e12 });
                }
              }(e11) };
            case "RSA-PSS":
              switch (lm(e11), e11.algorithm.hash.name) {
                case "SHA-256":
                case "SHA-384":
                case "SHA-512":
                  return { name: e11.algorithm.name, saltLength: parseInt(e11.algorithm.hash.name.slice(-3), 10) >> 3 };
                default:
                  throw new se("unsupported RSA-PSS hash name", { cause: e11 });
              }
            case "RSASSA-PKCS1-v1_5":
              return lm(e11), e11.algorithm.name;
            case "ML-DSA-44":
            case "ML-DSA-65":
            case "ML-DSA-87":
            case "Ed25519":
              return e11.algorithm.name;
          }
          throw new se("unsupported CryptoKey algorithm name", { cause: e11 });
        }(r10), r10, o9(n10)));
        return `${n10}.${i10}`;
      }
      let sE = URL.parse ? (e10, t10) => URL.parse(e10, t10) : (e10, t10) => {
        try {
          return new URL(e10, t10);
        } catch {
          return null;
        }
      };
      function sx(e10, t10) {
        if (t10 && "https:" !== e10.protocol) throw sr("only requests to HTTPS are allowed", ll, e10);
        if ("https:" !== e10.protocol && "http:" !== e10.protocol) throw sr("only HTTP and HTTPS requests are allowed", lc, e10);
      }
      function sS(e10, t10, r10, n10) {
        let i10;
        if ("string" != typeof e10 || !(i10 = sE(e10))) throw sr(`authorization server metadata does not contain a valid ${r10 ? `"as.mtls_endpoint_aliases.${t10}"` : `"as.${t10}"`}`, void 0 === e10 ? lh : lf, { attribute: r10 ? `mtls_endpoint_aliases.${t10}` : t10 });
        return sx(i10, n10), i10;
      }
      function sk(e10, t10, r10, n10) {
        return r10 && e10.mtls_endpoint_aliases && t10 in e10.mtls_endpoint_aliases ? sS(e10.mtls_endpoint_aliases[t10], t10, r10, n10) : sS(e10[t10], t10, r10, n10);
      }
      class sT extends Error {
        cause;
        code;
        error;
        status;
        error_description;
        response;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = le, this.cause = t10.cause, this.error = t10.cause.error, this.status = t10.response.status, this.error_description = t10.cause.error_description, Object.defineProperty(this, "response", { enumerable: false, value: t10.response }), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class sR extends Error {
        cause;
        code;
        error;
        error_description;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = lr, this.cause = t10.cause, this.error = t10.cause.get("error"), this.error_description = t10.cause.get("error_description") ?? void 0, Error.captureStackTrace?.(this, this.constructor);
        }
      }
      class sP extends Error {
        cause;
        code;
        response;
        status;
        constructor(e10, t10) {
          super(e10, t10), this.name = this.constructor.name, this.code = s7, this.cause = t10.cause, this.status = t10.response.status, this.response = t10.response, Object.defineProperty(this, "response", { enumerable: false }), Error.captureStackTrace?.(this, this.constructor);
        }
      }
      let sC = "[a-zA-Z0-9!#$%&\\'\\*\\+\\-\\.\\^_`\\|~]+", sA = RegExp("^[,\\s]*(" + sC + ")"), sO = RegExp("^[,\\s]*(" + sC + ')\\s*=\\s*"((?:[^"\\\\]|\\\\[\\s\\S])*)"[,\\s]*(.*)'), sI = RegExp("^[,\\s]*" + ("(" + sC + ")\\s*=\\s*(") + sC + ")[,\\s]*(.*)"), sN = RegExp("^([a-zA-Z0-9\\-\\._\\~\\+\\/]+={0,2})(?:$|[,\\s])(.*)");
      async function sU(e10) {
        if (e10.status > 399 && e10.status < 500) {
          lg(e10), sp(e10);
          try {
            let t10 = await e10.clone().json();
            if (sn(t10) && "string" == typeof t10.error && t10.error.length) return t10;
          } catch {
          }
        }
      }
      async function sj(e10, t10, r10) {
        if (e10.status !== t10) {
          let t11;
          if (sJ(e10), t11 = await sU(e10)) throw await e10.body?.cancel(), new sT("server responded with an error in the response body", { cause: t11, response: e10 });
          throw sr(`"response" is not a conform ${r10} response (unexpected HTTP status code)`, ls, e10);
        }
      }
      function s$(e10) {
        if (!sQ.has(e10)) throw oQ('"options.DPoP" is not a valid DPoPHandle', oY);
      }
      async function sD(e10, t10, r10, n10, i10, a10) {
        if (su(e10, '"accessToken"'), !(r10 instanceof URL)) throw oQ('"url" must be an instance of URL', oZ);
        sx(r10, a10?.[o0] !== true), n10 = si(n10), a10?.DPoP && (s$(a10.DPoP), await a10.DPoP.addProof(r10, n10, t10.toUpperCase(), e10)), n10.set("authorization", `${n10.has("dpop") ? "DPoP" : "Bearer"} ${e10}`);
        let o10 = await (a10?.[o3] || fetch)(r10.href, { duplex: oX(i10, ReadableStream) ? "half" : void 0, body: i10, headers: Object.fromEntries(n10.entries()), method: t10, redirect: "manual", signal: sa(r10, a10?.signal) });
        return a10?.DPoP?.cacheNonce(o10, r10), o10;
      }
      async function sL(e10, t10, r10, n10) {
        sb(e10), sv(t10);
        let i10 = sk(e10, "userinfo_endpoint", t10.use_mtls_endpoint_aliases, n10?.[o0] !== true), a10 = si(n10?.headers);
        return t10.userinfo_signed_response_alg ? a10.set("accept", "application/jwt") : (a10.set("accept", "application/json"), a10.append("accept", "application/jwt")), sD(r10, "GET", i10, a10, null, { ...n10, [o1]: sg(t10) });
      }
      let sM = Symbol();
      function sH(e10) {
        return e10.headers.get("content-type")?.split(";")[0];
      }
      async function sW(e10, t10, r10, n10, i10) {
        let a10;
        if (sb(e10), sv(t10), !oX(n10, Response)) throw oQ('"response" must be an instance of Response', oZ);
        if (sJ(n10), 200 !== n10.status) throw sr('"response" is not a conform UserInfo Endpoint response (unexpected HTTP status code)', ls, n10);
        if (lg(n10), "application/jwt" === sH(n10)) {
          let { claims: r11, jwt: o10 } = await ly(await n10.text(), lb.bind(void 0, t10.userinfo_signed_response_alg, e10.userinfo_signing_alg_values_supported, void 0), sg(t10), sm(t10), i10?.[o5]).then(sG.bind(void 0, t10.client_id)).then(sY.bind(void 0, e10));
          sF.set(n10, o10), a10 = r11;
        } else {
          if (t10.userinfo_signed_response_alg) throw sr("JWT UserInfo Response expected", ln, n10);
          a10 = await lE(n10);
        }
        if (su(a10.sub, '"response" body "sub" property', la, { body: a10 }), r10 === sM) ;
        else if (su(r10, '"expectedSubject"'), a10.sub !== r10) throw sr('unexpected "response" body "sub" property value', lp, { expected: r10, body: a10, attribute: "sub" });
        return a10;
      }
      async function sB(e10, t10, r10, n10, i10, a10, o10) {
        return await r10(e10, t10, i10, a10), a10.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8"), (o10?.[o3] || fetch)(n10.href, { body: i10, headers: Object.fromEntries(a10.entries()), method: "POST", redirect: "manual", signal: sa(n10, o10?.signal) });
      }
      async function sq(e10, t10, r10, n10, i10, a10) {
        let o10 = sk(e10, "token_endpoint", t10.use_mtls_endpoint_aliases, a10?.[o0] !== true);
        i10.set("grant_type", n10);
        let s10 = si(a10?.headers);
        s10.set("accept", "application/json"), a10?.DPoP !== void 0 && (s$(a10.DPoP), await a10.DPoP.addProof(o10, s10, "POST"));
        let l10 = await sB(e10, t10, r10, o10, i10, s10, a10);
        return a10?.DPoP?.cacheNonce(l10, o10), l10;
      }
      let sz = /* @__PURE__ */ new WeakMap(), sF = /* @__PURE__ */ new WeakMap();
      function sK(e10) {
        if (!e10.id_token) return;
        let t10 = sz.get(e10);
        if (!t10) throw oQ('"ref" was already garbage collected or did not resolve from the proper sources', oY);
        return t10;
      }
      async function sV(e10, t10, r10, n10, i10, a10) {
        if (sb(e10), sv(t10), !oX(r10, Response)) throw oQ('"response" must be an instance of Response', oZ);
        await sj(r10, 200, "Token Endpoint"), lg(r10);
        let o10 = await lE(r10);
        if (su(o10.access_token, '"response" body "access_token" property', la, { body: o10 }), su(o10.token_type, '"response" body "token_type" property', la, { body: o10 }), o10.token_type = o10.token_type.toLowerCase(), void 0 !== o10.expires_in) {
          let e11 = "number" != typeof o10.expires_in ? parseFloat(o10.expires_in) : o10.expires_in;
          sc(e11, true, '"response" body "expires_in" property', la, { body: o10 }), o10.expires_in = e11;
        }
        if (void 0 !== o10.refresh_token && su(o10.refresh_token, '"response" body "refresh_token" property', la, { body: o10 }), void 0 !== o10.scope && "string" != typeof o10.scope) throw sr('"response" body "scope" property must be a string', la, { body: o10 });
        if (void 0 !== o10.id_token) {
          su(o10.id_token, '"response" body "id_token" property', la, { body: o10 });
          let a11 = ["aud", "exp", "iat", "iss", "sub"];
          true === t10.require_auth_time && a11.push("auth_time"), void 0 !== t10.default_max_age && (sc(t10.default_max_age, true, '"client.default_max_age"'), a11.push("auth_time")), n10?.length && a11.push(...n10);
          let { claims: s10, jwt: l10 } = await ly(o10.id_token, lb.bind(void 0, t10.id_token_signed_response_alg, e10.id_token_signing_alg_values_supported, "RS256"), sg(t10), sm(t10), i10).then(s3.bind(void 0, a11)).then(sZ.bind(void 0, e10)).then(sX.bind(void 0, t10.client_id));
          if (Array.isArray(s10.aud) && 1 !== s10.aud.length) {
            if (void 0 === s10.azp) throw sr('ID Token "aud" (audience) claim includes additional untrusted audiences', ld, { claims: s10, claim: "aud" });
            if (s10.azp !== t10.client_id) throw sr('unexpected ID Token "azp" (authorized party) claim value', ld, { expected: t10.client_id, claims: s10, claim: "azp" });
          }
          void 0 !== s10.auth_time && sc(s10.auth_time, true, 'ID Token "auth_time" (authentication time)', la, { claims: s10 }), sF.set(r10, l10), sz.set(o10, s10);
        }
        if (a10?.[o10.token_type] !== void 0) a10[o10.token_type](r10, o10);
        else if ("dpop" !== o10.token_type && "bearer" !== o10.token_type) throw new se("unsupported `token_type` value", { cause: { body: o10 } });
        return o10;
      }
      function sJ(e10) {
        let t10;
        if (t10 = function(e11) {
          if (!oX(e11, Response)) throw oQ('"response" must be an instance of Response', oZ);
          let t11 = e11.headers.get("www-authenticate");
          if (null === t11) return;
          let r10 = [], n10 = t11;
          for (; n10; ) {
            let e12, t12 = n10.match(sA), i10 = t12?.["1"].toLowerCase();
            if (!i10) return;
            let a10 = n10.substring(t12[0].length);
            if (a10 && !a10.match(/^[\s,]/)) return;
            let o10 = a10.match(/^\s+(.*)$/), s10 = !!o10;
            n10 = o10 ? o10[1] : void 0;
            let l10 = {};
            if (s10) for (; n10; ) {
              let r11, i11;
              if (t12 = n10.match(sO)) {
                if ([, r11, i11, n10] = t12, i11.includes("\\")) try {
                  i11 = JSON.parse(`"${i11}"`);
                } catch {
                }
                l10[r11.toLowerCase()] = i11;
                continue;
              }
              if (t12 = n10.match(sI)) {
                [, r11, i11, n10] = t12, l10[r11.toLowerCase()] = i11;
                continue;
              }
              if (t12 = n10.match(sN)) {
                if (Object.keys(l10).length) break;
                [, e12, n10] = t12;
                break;
              }
              return;
            }
            else n10 = a10 || void 0;
            let c2 = { scheme: i10, parameters: l10 };
            e12 && (c2.token68 = e12), r10.push(c2);
          }
          if (r10.length) return r10;
        }(e10)) throw new sP("server responded with a challenge in the WWW-Authenticate HTTP Header", { cause: t10, response: e10 });
      }
      function sG(e10, t10) {
        return void 0 !== t10.claims.aud ? sX(e10, t10) : t10;
      }
      function sX(e10, t10) {
        if (Array.isArray(t10.claims.aud)) {
          if (!t10.claims.aud.includes(e10)) throw sr('unexpected JWT "aud" (audience) claim value', ld, { expected: e10, claims: t10.claims, claim: "aud" });
        } else if (t10.claims.aud !== e10) throw sr('unexpected JWT "aud" (audience) claim value', ld, { expected: e10, claims: t10.claims, claim: "aud" });
        return t10;
      }
      function sY(e10, t10) {
        return void 0 !== t10.claims.iss ? sZ(e10, t10) : t10;
      }
      function sZ(e10, t10) {
        let r10 = e10[lS]?.(t10) ?? e10.issuer;
        if (t10.claims.iss !== r10) throw sr('unexpected JWT "iss" (issuer) claim value', ld, { expected: r10, claims: t10.claims, claim: "iss" });
        return t10;
      }
      let sQ = /* @__PURE__ */ new WeakSet(), s0 = Symbol();
      async function s1(e10, t10, r10, n10, i10, a10, o10) {
        if (sb(e10), sv(t10), !sQ.has(n10)) throw oQ('"callbackParameters" must be an instance of URLSearchParams obtained from "validateAuthResponse()", or "validateJwtAuthResponse()', oY);
        su(i10, '"redirectUri"');
        let s10 = lv(n10, "code");
        if (!s10) throw sr('no authorization code in "callbackParameters"', la);
        let l10 = new URLSearchParams(o10?.additionalParameters);
        return l10.set("redirect_uri", i10), l10.set("code", s10), a10 !== s0 && (su(a10, '"codeVerifier"'), l10.set("code_verifier", a10)), sq(e10, t10, r10, "authorization_code", l10, o10);
      }
      let s2 = { aud: "audience", c_hash: "code hash", client_id: "client id", exp: "expiration time", iat: "issued at", iss: "issuer", jti: "jwt id", nonce: "nonce", s_hash: "state hash", sub: "subject", ath: "access token hash", htm: "http method", htu: "http uri", cnf: "confirmation", auth_time: "authentication time" };
      function s3(e10, t10) {
        for (let r10 of e10) if (void 0 === t10.claims[r10]) throw sr(`JWT "${r10}" (${s2[r10]}) claim missing`, la, { claims: t10.claims });
        return t10;
      }
      let s4 = Symbol(), s5 = Symbol();
      async function s6(e10, t10, r10, n10) {
        return "string" == typeof n10?.expectedNonce || "number" == typeof n10?.maxAge || n10?.requireIdToken ? s8(e10, t10, r10, n10.expectedNonce, n10.maxAge, n10[o5], n10.recognizedTokenTypes) : s9(e10, t10, r10, n10?.[o5], n10?.recognizedTokenTypes);
      }
      async function s8(e10, t10, r10, n10, i10, a10, o10) {
        let s10 = [];
        switch (n10) {
          case void 0:
            n10 = s4;
            break;
          case s4:
            break;
          default:
            su(n10, '"expectedNonce" argument'), s10.push("nonce");
        }
        switch (i10 ??= t10.default_max_age) {
          case void 0:
            i10 = s5;
            break;
          case s5:
            break;
          default:
            sc(i10, true, '"maxAge" argument'), s10.push("auth_time");
        }
        let l10 = await sV(e10, t10, r10, s10, a10, o10);
        su(l10.id_token, '"response" body "id_token" property', la, { body: l10 });
        let c2 = sK(l10);
        if (i10 !== s5) {
          let e11 = sy() + sg(t10), r11 = sm(t10);
          if (c2.auth_time + i10 < e11 - r11) throw sr("too much time has elapsed since the last End-User authentication", lu, { claims: c2, now: e11, tolerance: r11, claim: "auth_time" });
        }
        if (n10 === s4) {
          if (void 0 !== c2.nonce) throw sr('unexpected ID Token "nonce" claim value', ld, { expected: void 0, claims: c2, claim: "nonce" });
        } else if (c2.nonce !== n10) throw sr('unexpected ID Token "nonce" claim value', ld, { expected: n10, claims: c2, claim: "nonce" });
        return l10;
      }
      async function s9(e10, t10, r10, n10, i10) {
        let a10 = await sV(e10, t10, r10, void 0, n10, i10), o10 = sK(a10);
        if (o10) {
          if (void 0 !== t10.default_max_age) {
            sc(t10.default_max_age, true, '"client.default_max_age"');
            let e11 = sy() + sg(t10), r11 = sm(t10);
            if (o10.auth_time + t10.default_max_age < e11 - r11) throw sr("too much time has elapsed since the last End-User authentication", lu, { claims: o10, now: e11, tolerance: r11, claim: "auth_time" });
          }
          if (void 0 !== o10.nonce) throw sr('unexpected ID Token "nonce" claim value', ld, { expected: void 0, claims: o10, claim: "nonce" });
        }
        return a10;
      }
      let s7 = "OAUTH_WWW_AUTHENTICATE_CHALLENGE", le = "OAUTH_RESPONSE_BODY_ERROR", lt = "OAUTH_UNSUPPORTED_OPERATION", lr = "OAUTH_AUTHORIZATION_RESPONSE_ERROR", ln = "OAUTH_JWT_USERINFO_EXPECTED", li = "OAUTH_PARSE_ERROR", la = "OAUTH_INVALID_RESPONSE", lo = "OAUTH_RESPONSE_IS_NOT_JSON", ls = "OAUTH_RESPONSE_IS_NOT_CONFORM", ll = "OAUTH_HTTP_REQUEST_FORBIDDEN", lc = "OAUTH_REQUEST_PROTOCOL_FORBIDDEN", lu = "OAUTH_JWT_TIMESTAMP_CHECK_FAILED", ld = "OAUTH_JWT_CLAIM_COMPARISON_FAILED", lp = "OAUTH_JSON_ATTRIBUTE_COMPARISON_FAILED", lh = "OAUTH_MISSING_SERVER_METADATA", lf = "OAUTH_INVALID_SERVER_METADATA";
      function lg(e10) {
        if (e10.bodyUsed) throw oQ('"response" body has been used already', oY);
      }
      function lm(e10) {
        let { algorithm: t10 } = e10;
        if ("number" != typeof t10.modulusLength || t10.modulusLength < 2048) throw new se(`unsupported ${t10.name} modulusLength`, { cause: e10 });
      }
      async function ly(e10, t10, r10, n10, i10) {
        let a10, o10, { 0: s10, 1: l10, length: c2 } = e10.split(".");
        if (5 === c2) if (void 0 !== i10) e10 = await i10(e10), { 0: s10, 1: l10, length: c2 } = e10.split(".");
        else throw new se("JWE decryption is not configured", { cause: e10 });
        if (3 !== c2) throw sr("Invalid JWT", la, e10);
        try {
          a10 = JSON.parse(o9(o7(s10)));
        } catch (e11) {
          throw sr("failed to parse JWT Header body as base64url encoded JSON", li, e11);
        }
        if (!sn(a10)) throw sr("JWT Header must be a top level object", la, e10);
        if (t10(a10), void 0 !== a10.crit) throw new se('no JWT "crit" header parameter extensions are supported', { cause: { header: a10 } });
        try {
          o10 = JSON.parse(o9(o7(l10)));
        } catch (e11) {
          throw sr("failed to parse JWT Payload body as base64url encoded JSON", li, e11);
        }
        if (!sn(o10)) throw sr("JWT Payload must be a top level object", la, e10);
        let u2 = sy() + r10;
        if (void 0 !== o10.exp) {
          if ("number" != typeof o10.exp) throw sr('unexpected JWT "exp" (expiration time) claim type', la, { claims: o10 });
          if (o10.exp <= u2 - n10) throw sr('unexpected JWT "exp" (expiration time) claim value, expiration is past current timestamp', lu, { claims: o10, now: u2, tolerance: n10, claim: "exp" });
        }
        if (void 0 !== o10.iat && "number" != typeof o10.iat) throw sr('unexpected JWT "iat" (issued at) claim type', la, { claims: o10 });
        if (void 0 !== o10.iss && "string" != typeof o10.iss) throw sr('unexpected JWT "iss" (issuer) claim type', la, { claims: o10 });
        if (void 0 !== o10.nbf) {
          if ("number" != typeof o10.nbf) throw sr('unexpected JWT "nbf" (not before) claim type', la, { claims: o10 });
          if (o10.nbf > u2 + n10) throw sr('unexpected JWT "nbf" (not before) claim value', lu, { claims: o10, now: u2, tolerance: n10, claim: "nbf" });
        }
        if (void 0 !== o10.aud && "string" != typeof o10.aud && !Array.isArray(o10.aud)) throw sr('unexpected JWT "aud" (audience) claim type', la, { claims: o10 });
        return { header: a10, claims: o10, jwt: e10 };
      }
      function lb(e10, t10, r10, n10) {
        if (void 0 !== e10) {
          if ("string" == typeof e10 ? n10.alg !== e10 : !e10.includes(n10.alg)) throw sr('unexpected JWT "alg" header parameter', la, { header: n10, expected: e10, reason: "client configuration" });
          return;
        }
        if (Array.isArray(t10)) {
          if (!t10.includes(n10.alg)) throw sr('unexpected JWT "alg" header parameter', la, { header: n10, expected: t10, reason: "authorization server metadata" });
          return;
        }
        if (void 0 !== r10) {
          if ("string" == typeof r10 ? n10.alg !== r10 : "function" == typeof r10 ? !r10(n10.alg) : !r10.includes(n10.alg)) throw sr('unexpected JWT "alg" header parameter', la, { header: n10, expected: r10, reason: "default value" });
          return;
        }
        throw sr('missing client or server configuration to verify used JWT "alg" header parameter', void 0, { client: e10, issuer: t10, fallback: r10 });
      }
      function lv(e10, t10) {
        let { 0: r10, length: n10 } = e10.getAll(t10);
        if (n10 > 1) throw sr(`"${t10}" parameter must be provided only once`, la);
        return r10;
      }
      let lw = Symbol(), l_ = Symbol();
      async function lE(e10, t10 = sp) {
        let r10;
        try {
          r10 = await e10.json();
        } catch (r11) {
          throw t10(e10), sr('failed to parse "response" body as JSON', li, r11);
        }
        if (!sn(r10)) throw sr('"response" body must be a top level object', la, { body: r10 });
        return r10;
      }
      let lx = Symbol(), lS = Symbol();
      async function lk(e10, t10, r10) {
        let { cookies: n10, logger: i10 } = r10, a10 = n10[e10], o10 = /* @__PURE__ */ new Date();
        o10.setTime(o10.getTime() + 9e5), i10.debug(`CREATE_${e10.toUpperCase()}`, { name: a10.name, payload: t10, COOKIE_TTL: 900, expires: o10 });
        let s10 = await at({ ...r10.jwt, maxAge: 900, token: { value: t10, provider: r10.provider.id }, salt: a10.name }), l10 = { ...a10.options, expires: o10 };
        return { name: a10.name, value: s10, options: l10 };
      }
      async function lT(e10, t10, r10) {
        try {
          let { logger: n10, cookies: i10, jwt: a10 } = r10;
          if (n10.debug(`PARSE_${e10.toUpperCase()}`, { cookie: t10 }), !t10) throw new rI(`${e10} cookie was missing`);
          let o10 = await ar({ ...a10, token: t10, salt: i10[e10].name });
          if (!o10?.value) throw Error("Invalid cookie");
          if (o10.provider !== r10.provider?.id) throw Error(`${e10} cookie was created for a different provider than the one handling the callback`);
          return o10.value;
        } catch (t11) {
          throw new rI(`${e10} value could not be parsed`, { cause: t11 });
        }
      }
      function lR(e10, t10, r10) {
        let { logger: n10, cookies: i10 } = t10, a10 = i10[e10];
        n10.debug(`CLEAR_${e10.toUpperCase()}`, { cookie: a10 }), r10.push({ name: a10.name, value: "", options: { ...i10[e10].options, maxAge: 0 } });
      }
      function lP(e10, t10) {
        return async function(r10, n10, i10) {
          let { provider: a10, logger: o10 } = i10;
          if (!a10?.checks?.includes(e10)) return;
          let s10 = r10?.[i10.cookies[t10].name];
          o10.debug(`USE_${t10.toUpperCase()}`, { value: s10 });
          let l10 = await lT(t10, s10, i10);
          return lR(t10, i10, n10), l10;
        };
      }
      let lC = { async create(e10) {
        let t10 = sh(), r10 = await sf(t10);
        return { cookie: await lk("pkceCodeVerifier", t10, e10), value: r10 };
      }, use: lP("pkce", "pkceCodeVerifier") }, lA = "encodedState", lO = { async create(e10, t10) {
        let { provider: r10 } = e10;
        if (!r10.checks.includes("state")) {
          if (t10) throw new rI("State data was provided but the provider is not configured to use state");
          return;
        }
        let n10 = { origin: t10, random: sh() }, i10 = await at({ secret: e10.jwt.secret, token: n10, salt: lA, maxAge: 900 });
        return { cookie: await lk("state", i10, e10), value: i10 };
      }, use: lP("state", "state"), async decode(e10, t10) {
        try {
          t10.logger.debug("DECODE_STATE", { state: e10 });
          let r10 = await ar({ secret: t10.jwt.secret, token: e10, salt: lA });
          if (r10) return r10;
          throw Error("Invalid state");
        } catch (e11) {
          throw new rI("State could not be decoded", { cause: e11 });
        }
      } }, lI = { async create(e10) {
        if (!e10.provider.checks.includes("nonce")) return;
        let t10 = sh();
        return { cookie: await lk("nonce", t10, e10), value: t10 };
      }, use: lP("nonce", "nonce") }, lN = "encodedWebauthnChallenge", lU = { create: async (e10, t10, r10) => ({ cookie: await lk("webauthnChallenge", await at({ secret: e10.jwt.secret, token: { challenge: t10, registerData: r10 }, salt: lN, maxAge: 900 }), e10) }), async use(e10, t10, r10) {
        let n10 = t10?.[e10.cookies.webauthnChallenge.name], i10 = await lT("webauthnChallenge", n10, e10), a10 = await ar({ secret: e10.jwt.secret, token: i10, salt: lN });
        if (lR("webauthnChallenge", e10, r10), !a10) throw new rI("WebAuthn challenge was missing");
        return a10;
      } };
      function lj(e10) {
        return encodeURIComponent(e10).replace(/%20/g, "+");
      }
      async function l$(e10, t10, r10) {
        var n10, i10;
        let a10, o10, s10, l10, c2, { logger: u2, provider: d2 } = r10, { token: p2, userinfo: h2 } = d2;
        if (p2?.url && "authjs.dev" !== p2.url.host || h2?.url && "authjs.dev" !== h2.url.host) a10 = { issuer: d2.issuer ?? "https://authjs.dev", token_endpoint: p2?.url.toString(), userinfo_endpoint: h2?.url.toString() };
        else {
          let e11 = new URL(d2.issuer), t11 = await sl(e11, { [o0]: true, [o3]: d2[ax] });
          if (!(a10 = await sd(e11, t11)).token_endpoint) throw TypeError("TODO: Authorization server did not provide a token endpoint.");
          if (!a10.userinfo_endpoint) throw TypeError("TODO: Authorization server did not provide a userinfo endpoint.");
        }
        let f2 = { client_id: d2.clientId, ...d2.client };
        switch (f2.token_endpoint_auth_method) {
          case void 0:
          case "client_secret_basic":
            o10 = (e11, t11, r11, n11) => {
              var i11, a11;
              let o11, s11, l11;
              n11.set("authorization", (i11 = d2.clientId, a11 = d2.clientSecret, o11 = lj(i11), s11 = lj(a11), l11 = btoa(`${o11}:${s11}`), `Basic ${l11}`));
            };
            break;
          case "client_secret_post":
            su(n10 = d2.clientSecret, '"clientSecret"'), o10 = (e11, t11, r11, i11) => {
              r11.set("client_id", t11.client_id), r11.set("client_secret", n10);
            };
            break;
          case "client_secret_jwt":
            su(i10 = d2.clientSecret, '"clientSecret"'), c2 = void 0, o10 = async (e11, t11, r11, n11) => {
              l10 ||= await crypto.subtle.importKey("raw", o9(i10), { hash: "SHA-256", name: "HMAC" }, false, ["sign"]);
              let a11 = { alg: "HS256" }, o11 = sw(e11, t11);
              c2?.(a11, o11);
              let s11 = `${o7(o9(JSON.stringify(a11)))}.${o7(o9(JSON.stringify(o11)))}`, u3 = await crypto.subtle.sign(l10.algorithm, l10, o9(s11));
              r11.set("client_id", t11.client_id), r11.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), r11.set("client_assertion", `${s11}.${o7(new Uint8Array(u3))}`);
            };
            break;
          case "private_key_jwt":
            o10 = function(e11, t11) {
              let { key: r11, kid: n11 } = e11 instanceof CryptoKey ? { key: e11 } : e11?.key instanceof CryptoKey ? (void 0 !== e11.kid && su(e11.kid, '"kid"'), { key: e11.key, kid: e11.kid }) : {};
              var i11 = '"clientPrivateKey.key"';
              if (!(r11 instanceof CryptoKey)) throw oQ(`${i11} must be a CryptoKey`, oZ);
              if ("private" !== r11.type) throw oQ(`${i11} must be a private CryptoKey`, oY);
              return async (e12, i12, a11, o11) => {
                let s11 = { alg: function(e13) {
                  switch (e13.algorithm.name) {
                    case "RSA-PSS":
                      switch (e13.algorithm.hash.name) {
                        case "SHA-256":
                          return "PS256";
                        case "SHA-384":
                          return "PS384";
                        case "SHA-512":
                          return "PS512";
                        default:
                          throw new se("unsupported RsaHashedKeyAlgorithm hash name", { cause: e13 });
                      }
                    case "RSASSA-PKCS1-v1_5":
                      switch (e13.algorithm.hash.name) {
                        case "SHA-256":
                          return "RS256";
                        case "SHA-384":
                          return "RS384";
                        case "SHA-512":
                          return "RS512";
                        default:
                          throw new se("unsupported RsaHashedKeyAlgorithm hash name", { cause: e13 });
                      }
                    case "ECDSA":
                      switch (e13.algorithm.namedCurve) {
                        case "P-256":
                          return "ES256";
                        case "P-384":
                          return "ES384";
                        case "P-521":
                          return "ES512";
                        default:
                          throw new se("unsupported EcKeyAlgorithm namedCurve", { cause: e13 });
                      }
                    case "Ed25519":
                    case "ML-DSA-44":
                    case "ML-DSA-65":
                    case "ML-DSA-87":
                      return e13.algorithm.name;
                    case "EdDSA":
                      return "Ed25519";
                    default:
                      throw new se("unsupported CryptoKey algorithm name", { cause: e13 });
                  }
                }(r11), kid: n11 }, l11 = sw(e12, i12);
                t11?.[o4]?.(s11, l11), a11.set("client_id", i12.client_id), a11.set("client_assertion_type", "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"), a11.set("client_assertion", await s_(s11, l11, r11));
              };
            }(d2.token.clientPrivateKey, { [o4](e11, t11) {
              t11.aud = [a10.issuer, a10.token_endpoint];
            } });
            break;
          case "none":
            o10 = (e11, t11, r11, n11) => {
              r11.set("client_id", t11.client_id);
            };
            break;
          default:
            throw Error("unsupported client authentication method");
        }
        let g2 = [], m2 = await lO.use(t10, g2, r10);
        try {
          s10 = function(e11, t11, r11, n11) {
            var i11;
            if (sb(e11), sv(t11), r11 instanceof URL && (r11 = r11.searchParams), !(r11 instanceof URLSearchParams)) throw oQ('"parameters" must be an instance of URLSearchParams, or URL', oZ);
            if (lv(r11, "response")) throw sr('"parameters" contains a JARM response, use validateJwtAuthResponse() instead of validateAuthResponse()', la, { parameters: r11 });
            let a11 = lv(r11, "iss"), o11 = lv(r11, "state");
            if (!a11 && e11.authorization_response_iss_parameter_supported) throw sr('response parameter "iss" (issuer) missing', la, { parameters: r11 });
            if (a11 && a11 !== e11.issuer) throw sr('unexpected "iss" (issuer) response parameter value', la, { expected: e11.issuer, parameters: r11 });
            switch (n11) {
              case void 0:
              case l_:
                if (void 0 !== o11) throw sr('unexpected "state" response parameter encountered', la, { expected: void 0, parameters: r11 });
                break;
              case lw:
                break;
              default:
                if (su(n11, '"expectedState" argument'), o11 !== n11) throw sr(void 0 === o11 ? 'response parameter "state" missing' : 'unexpected "state" response parameter value', la, { expected: n11, parameters: r11 });
            }
            if (lv(r11, "error")) throw new sR("authorization response from the server is an error", { cause: r11 });
            let s11 = lv(r11, "id_token"), l11 = lv(r11, "token");
            if (void 0 !== s11 || void 0 !== l11) throw new se("implicit and hybrid flows are not supported");
            return i11 = new URLSearchParams(r11), sQ.add(i11), i11;
          }(a10, f2, new URLSearchParams(e10), d2.checks.includes("state") ? m2 : lw);
        } catch (e11) {
          if (e11 instanceof sR) {
            let t11 = { providerId: d2.id, ...Object.fromEntries(e11.cause.entries()) };
            throw u2.debug("OAuthCallbackError", t11), new rM("OAuth Provider returned an error", t11);
          }
          throw e11;
        }
        let y2 = await lC.use(t10, g2, r10), b2 = d2.callbackUrl;
        !r10.isOnRedirectProxy && d2.redirectProxyUrl && (b2 = d2.redirectProxyUrl);
        let v2 = await s1(a10, f2, o10, s10, b2, y2 ?? "decoy", { [o0]: true, [o3]: (...e11) => (d2.checks.includes("pkce") || e11[1].body.delete("code_verifier"), (d2[ax] ?? fetch)(...e11)) });
        d2.token?.conform && (v2 = await d2.token.conform(v2.clone()) ?? v2);
        let w2 = {}, _2 = "oidc" === d2.type;
        if (d2[aS]) switch (d2.id) {
          case "microsoft-entra-id":
          case "azure-ad": {
            let e11 = await v2.clone().json();
            if (e11.error) {
              let t12 = { providerId: d2.id, ...e11 };
              throw new rM(`OAuth Provider returned an error: ${e11.error}`, t12);
            }
            let { tid: t11 } = function(e12) {
              let t12, r11;
              if ("string" != typeof e12) throw new nR("JWTs must use Compact JWS serialization, JWT must be a string");
              let { 1: n11, length: i11 } = e12.split(".");
              if (5 === i11) throw new nR("Only JWTs using Compact JWS serialization can be decoded");
              if (3 !== i11) throw new nR("Invalid JWT");
              if (!n11) throw new nR("JWTs must contain a payload");
              try {
                t12 = nd(n11);
              } catch {
                throw new nR("Failed to base64url decode the payload");
              }
              try {
                r11 = JSON.parse(ni.decode(t12));
              } catch {
                throw new nR("Failed to parse the decoded payload as JSON");
              }
              if (!nh(r11)) throw new nR("Invalid JWT Claims Set");
              return r11;
            }(e11.id_token);
            if ("string" == typeof t11) {
              let e12 = a10.issuer?.match(/microsoftonline\.com\/(\w+)\/v2\.0/)?.[1] ?? "common", r11 = new URL(a10.issuer.replace(e12, t11)), n11 = await sl(r11, { [o3]: d2[ax] });
              a10 = await sd(r11, n11);
            }
          }
        }
        let E2 = await s6(a10, f2, v2, { expectedNonce: await lI.use(t10, g2, r10), requireIdToken: _2 });
        if (_2) {
          let t11 = sK(E2);
          if (w2 = t11, d2[aS] && "apple" === d2.id) try {
            w2.user = JSON.parse(e10?.user);
          } catch {
          }
          if (false === d2.idToken) {
            let e11 = await sL(a10, f2, E2.access_token, { [o3]: d2[ax], [o0]: true });
            w2 = await sW(a10, f2, t11.sub, e11);
          }
        } else if (h2?.request) {
          let e11 = await h2.request({ tokens: E2, provider: d2 });
          e11 instanceof Object && (w2 = e11);
        } else if (h2?.url) {
          let e11 = await sL(a10, f2, E2.access_token, { [o3]: d2[ax], [o0]: true });
          w2 = await e11.json();
        } else throw TypeError("No userinfo endpoint configured");
        return E2.expires_in && (E2.expires_at = Math.floor(Date.now() / 1e3) + Number(E2.expires_in)), { ...await lD(w2, d2, E2, u2), profile: w2, cookies: g2 };
      }
      async function lD(e10, t10, r10, n10) {
        try {
          let n11 = await t10.profile(e10, r10);
          return { user: { ...n11, id: crypto.randomUUID(), email: n11.email?.toLowerCase() }, account: { ...r10, provider: t10.id, type: t10.type, providerAccountId: n11.id ?? crypto.randomUUID() } };
        } catch (r11) {
          n10.debug("getProfile error details", e10), n10.error(new rH(r11, { provider: t10.id }));
        }
      }
      async function lL(e10, t10, r10, n10) {
        let i10 = await lq(e10, t10, r10), { cookie: a10 } = await lU.create(e10, i10.challenge, r10);
        return { status: 200, cookies: [...n10 ?? [], a10], body: { action: "register", options: i10 }, headers: { "Content-Type": "application/json" } };
      }
      async function lM(e10, t10, r10, n10) {
        let i10 = await lB(e10, t10, r10), { cookie: a10 } = await lU.create(e10, i10.challenge);
        return { status: 200, cookies: [...n10 ?? [], a10], body: { action: "authenticate", options: i10 }, headers: { "Content-Type": "application/json" } };
      }
      async function lH(e10, t10, r10) {
        let n10, { adapter: i10, provider: a10 } = e10, o10 = t10.body && "string" == typeof t10.body.data ? JSON.parse(t10.body.data) : void 0;
        if (!o10 || "object" != typeof o10 || !("id" in o10) || "string" != typeof o10.id) throw new rE("Invalid WebAuthn Authentication response");
        let s10 = lK(lF(o10.id)), l10 = await i10.getAuthenticator(s10);
        if (!l10) throw new rE(`WebAuthn authenticator not found in database: ${JSON.stringify({ credentialID: s10 })}`);
        let { challenge: c2 } = await lU.use(e10, t10.cookies, r10);
        try {
          var u2;
          let r11 = a10.getRelayingParty(e10, t10);
          n10 = await a10.simpleWebAuthn.verifyAuthenticationResponse({ ...a10.verifyAuthenticationOptions, expectedChallenge: c2, response: o10, authenticator: { ...u2 = l10, credentialDeviceType: u2.credentialDeviceType, transports: lV(u2.transports), credentialID: lF(u2.credentialID), credentialPublicKey: lF(u2.credentialPublicKey) }, expectedOrigin: r11.origin, expectedRPID: r11.id });
        } catch (e11) {
          throw new rZ(e11);
        }
        let { verified: d2, authenticationInfo: p2 } = n10;
        if (!d2) throw new rZ("WebAuthn authentication response could not be verified");
        try {
          let { newCounter: e11 } = p2;
          await i10.updateAuthenticatorCounter(l10.credentialID, e11);
        } catch (e11) {
          throw new rS(`Failed to update authenticator counter. This may cause future authentication attempts to fail. ${JSON.stringify({ credentialID: s10, oldCounter: l10.counter, newCounter: p2.newCounter })}`, e11);
        }
        let h2 = await i10.getAccount(l10.providerAccountId, a10.id);
        if (!h2) throw new rE(`WebAuthn account not found in database: ${JSON.stringify({ credentialID: s10, providerAccountId: l10.providerAccountId })}`);
        let f2 = await i10.getUser(h2.userId);
        if (!f2) throw new rE(`WebAuthn user not found in database: ${JSON.stringify({ credentialID: s10, providerAccountId: l10.providerAccountId, userID: h2.userId })}`);
        return { account: h2, user: f2 };
      }
      async function lW(e10, t10, r10) {
        var n10;
        let i10, { provider: a10 } = e10, o10 = t10.body && "string" == typeof t10.body.data ? JSON.parse(t10.body.data) : void 0;
        if (!o10 || "object" != typeof o10 || !("id" in o10) || "string" != typeof o10.id) throw new rE("Invalid WebAuthn Registration response");
        let { challenge: s10, registerData: l10 } = await lU.use(e10, t10.cookies, r10);
        if (!l10) throw new rE("Missing user registration data in WebAuthn challenge cookie");
        try {
          let r11 = a10.getRelayingParty(e10, t10);
          i10 = await a10.simpleWebAuthn.verifyRegistrationResponse({ ...a10.verifyRegistrationOptions, expectedChallenge: s10, response: o10, expectedOrigin: r11.origin, expectedRPID: r11.id });
        } catch (e11) {
          throw new rZ(e11);
        }
        if (!i10.verified || !i10.registrationInfo) throw new rZ("WebAuthn registration response could not be verified");
        let c2 = { providerAccountId: lK(i10.registrationInfo.credentialID), provider: e10.provider.id, type: a10.type }, u2 = { providerAccountId: c2.providerAccountId, counter: i10.registrationInfo.counter, credentialID: lK(i10.registrationInfo.credentialID), credentialPublicKey: lK(i10.registrationInfo.credentialPublicKey), credentialBackedUp: i10.registrationInfo.credentialBackedUp, credentialDeviceType: i10.registrationInfo.credentialDeviceType, transports: (n10 = o10.response.transports, n10?.join(",")) };
        return { user: l10, account: c2, authenticator: u2 };
      }
      async function lB(e10, t10, r10) {
        let { provider: n10, adapter: i10 } = e10, a10 = r10 && r10.id ? await i10.listAuthenticatorsByUserId(r10.id) : null, o10 = n10.getRelayingParty(e10, t10);
        return await n10.simpleWebAuthn.generateAuthenticationOptions({ ...n10.authenticationOptions, rpID: o10.id, allowCredentials: a10?.map((e11) => ({ id: lF(e11.credentialID), type: "public-key", transports: lV(e11.transports) })) });
      }
      async function lq(e10, t10, r10) {
        let { provider: n10, adapter: i10 } = e10, a10 = r10.id ? await i10.listAuthenticatorsByUserId(r10.id) : null, o10 = am(32), s10 = n10.getRelayingParty(e10, t10);
        return await n10.simpleWebAuthn.generateRegistrationOptions({ ...n10.registrationOptions, userID: o10, userName: r10.email, userDisplayName: r10.name ?? void 0, rpID: s10.id, rpName: s10.name, excludeCredentials: a10?.map((e11) => ({ id: lF(e11.credentialID), type: "public-key", transports: lV(e11.transports) })) });
      }
      function lz(e10) {
        let { provider: t10, adapter: r10 } = e10;
        if (!r10) throw new rU("An adapter is required for the WebAuthn provider");
        if (!t10 || "webauthn" !== t10.type) throw new rF("Provider must be WebAuthn");
        return { ...e10, provider: t10, adapter: r10 };
      }
      function lF(e10) {
        return new Uint8Array(te.Buffer.from(e10, "base64"));
      }
      function lK(e10) {
        return te.Buffer.from(e10).toString("base64");
      }
      function lV(e10) {
        return e10 ? e10.split(",") : void 0;
      }
      async function lJ(e10, t10, r10, n10) {
        if (!t10.provider) throw new rF("Callback route called without provider");
        let { query: i10, body: a10, method: o10, headers: s10 } = e10, { provider: l10, adapter: c2, url: u2, callbackUrl: d2, pages: p2, jwt: h2, events: f2, callbacks: g2, session: { strategy: m2, maxAge: y2 }, logger: b2 } = t10, v2 = "jwt" === m2;
        try {
          if ("oauth" === l10.type || "oidc" === l10.type) {
            let o11, s11 = l10.authorization?.url.searchParams.get("response_mode") === "form_post" ? a10 : i10;
            if (t10.isOnRedirectProxy && s11?.state) {
              let e11 = await lO.decode(s11.state, t10);
              if (e11?.origin && new URL(e11.origin).origin !== t10.url.origin) {
                let t11 = `${e11.origin}?${new URLSearchParams(s11)}`;
                return b2.debug("Proxy redirecting to", t11), { redirect: t11, cookies: n10 };
              }
            }
            let m3 = await l$(s11, e10.cookies, t10);
            m3.cookies.length && n10.push(...m3.cookies), b2.debug("authorization result", m3);
            let { user: w2, account: _2, profile: E2 } = m3;
            if (!w2 || !_2 || !E2) return { redirect: `${u2}/signin`, cookies: n10 };
            if (c2) {
              let { getUserByAccount: e11 } = c2;
              o11 = await e11({ providerAccountId: _2.providerAccountId, provider: l10.id });
            }
            let x2 = await lG({ user: o11 ?? w2, account: _2, profile: E2 }, t10);
            if (x2) return { redirect: x2, cookies: n10 };
            let { user: S2, session: k2, isNewUser: T2 } = await oG(r10.value, w2, _2, t10);
            if (v2) {
              let e11 = { name: S2.name, email: S2.email, picture: S2.image, sub: S2.id?.toString() }, i11 = await g2.jwt({ token: e11, user: S2, account: _2, profile: E2, isNewUser: T2, trigger: T2 ? "signUp" : "signIn" });
              if (null === i11) n10.push(...r10.clean());
              else {
                let e12 = t10.cookies.sessionToken.name, a11 = await h2.encode({ ...h2, token: i11, salt: e12 }), o12 = /* @__PURE__ */ new Date();
                o12.setTime(o12.getTime() + 1e3 * y2);
                let s12 = r10.chunk(a11, { expires: o12 });
                n10.push(...s12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: k2.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: k2.expires } });
            if (await f2.signIn?.({ user: S2, account: _2, profile: E2, isNewUser: T2 }), T2 && p2.newUser) return { redirect: `${p2.newUser}${p2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d2 })}`, cookies: n10 };
            return { redirect: d2, cookies: n10 };
          }
          if ("email" === l10.type) {
            let e11 = i10?.token, a11 = i10?.email;
            if (!e11) {
              let t11 = TypeError("Missing token. The sign-in URL was manually opened without token or the link was not sent correctly in the email.", { cause: { hasToken: !!e11 } });
              throw t11.name = "Configuration", t11;
            }
            let o11 = l10.secret ?? t10.secret, s11 = await c2.useVerificationToken({ identifier: a11, token: await ag(`${e11}${o11}`) }), u3 = !!s11, m3 = u3 && s11.expires.valueOf() < Date.now();
            if (!u3 || m3 || a11 && s11.identifier !== a11) throw new rV({ hasInvite: u3, expired: m3 });
            let { identifier: b3 } = s11, w2 = await c2.getUserByEmail(b3) ?? { id: crypto.randomUUID(), email: b3, emailVerified: null }, _2 = { providerAccountId: w2.email, userId: w2.id, type: "email", provider: l10.id }, E2 = await lG({ user: w2, account: _2 }, t10);
            if (E2) return { redirect: E2, cookies: n10 };
            let { user: x2, session: S2, isNewUser: k2 } = await oG(r10.value, w2, _2, t10);
            if (v2) {
              let e12 = { name: x2.name, email: x2.email, picture: x2.image, sub: x2.id?.toString() }, i11 = await g2.jwt({ token: e12, user: x2, account: _2, isNewUser: k2, trigger: k2 ? "signUp" : "signIn" });
              if (null === i11) n10.push(...r10.clean());
              else {
                let e13 = t10.cookies.sessionToken.name, a12 = await h2.encode({ ...h2, token: i11, salt: e13 }), o12 = /* @__PURE__ */ new Date();
                o12.setTime(o12.getTime() + 1e3 * y2);
                let s12 = r10.chunk(a12, { expires: o12 });
                n10.push(...s12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: S2.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: S2.expires } });
            if (await f2.signIn?.({ user: x2, account: _2, isNewUser: k2 }), k2 && p2.newUser) return { redirect: `${p2.newUser}${p2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d2 })}`, cookies: n10 };
            return { redirect: d2, cookies: n10 };
          }
          if ("credentials" === l10.type && "POST" === o10) {
            let e11 = a10 ?? {};
            Object.entries(i10 ?? {}).forEach(([e12, t11]) => u2.searchParams.set(e12, t11));
            let c3 = await l10.authorize(e11, new Request(u2, { headers: s10, method: o10, body: JSON.stringify(a10) }));
            if (c3) c3.id = c3.id?.toString() ?? crypto.randomUUID();
            else throw new rA();
            let p3 = { providerAccountId: c3.id, type: "credentials", provider: l10.id }, m3 = await lG({ user: c3, account: p3, credentials: e11 }, t10);
            if (m3) return { redirect: m3, cookies: n10 };
            let b3 = { name: c3.name, email: c3.email, picture: c3.image, sub: c3.id }, v3 = await g2.jwt({ token: b3, user: c3, account: p3, isNewUser: false, trigger: "signIn" });
            if (null === v3) n10.push(...r10.clean());
            else {
              let e12 = t10.cookies.sessionToken.name, i11 = await h2.encode({ ...h2, token: v3, salt: e12 }), a11 = /* @__PURE__ */ new Date();
              a11.setTime(a11.getTime() + 1e3 * y2);
              let o11 = r10.chunk(i11, { expires: a11 });
              n10.push(...o11);
            }
            return await f2.signIn?.({ user: c3, account: p3 }), { redirect: d2, cookies: n10 };
          } else if ("webauthn" === l10.type && "POST" === o10) {
            let i11, a11, o11, s11 = e10.body?.action;
            if ("string" != typeof s11 || "authenticate" !== s11 && "register" !== s11) throw new rE("Invalid action parameter");
            let l11 = lz(t10);
            switch (s11) {
              case "authenticate": {
                let t11 = await lH(l11, e10, n10);
                i11 = t11.user, a11 = t11.account;
                break;
              }
              case "register": {
                let r11 = await lW(t10, e10, n10);
                i11 = r11.user, a11 = r11.account, o11 = r11.authenticator;
              }
            }
            await lG({ user: i11, account: a11 }, t10);
            let { user: c3, isNewUser: u3, session: m3, account: b3 } = await oG(r10.value, i11, a11, t10);
            if (!b3) throw new rE("Error creating or finding account");
            if (o11 && c3.id && await l11.adapter.createAuthenticator({ ...o11, userId: c3.id }), v2) {
              let e11 = { name: c3.name, email: c3.email, picture: c3.image, sub: c3.id?.toString() }, i12 = await g2.jwt({ token: e11, user: c3, account: b3, isNewUser: u3, trigger: u3 ? "signUp" : "signIn" });
              if (null === i12) n10.push(...r10.clean());
              else {
                let e12 = t10.cookies.sessionToken.name, a12 = await h2.encode({ ...h2, token: i12, salt: e12 }), o12 = /* @__PURE__ */ new Date();
                o12.setTime(o12.getTime() + 1e3 * y2);
                let s12 = r10.chunk(a12, { expires: o12 });
                n10.push(...s12);
              }
            } else n10.push({ name: t10.cookies.sessionToken.name, value: m3.sessionToken, options: { ...t10.cookies.sessionToken.options, expires: m3.expires } });
            if (await f2.signIn?.({ user: c3, account: b3, isNewUser: u3 }), u3 && p2.newUser) return { redirect: `${p2.newUser}${p2.newUser.includes("?") ? "&" : "?"}${new URLSearchParams({ callbackUrl: d2 })}`, cookies: n10 };
            return { redirect: d2, cookies: n10 };
          }
          throw new rF(`Callback for provider type (${l10.type}) is not supported`);
        } catch (t11) {
          if (t11 instanceof rE) throw t11;
          let e11 = new rT(t11, { provider: l10.id });
          throw b2.debug("callback route error details", { method: o10, query: i10, body: a10 }), e11;
        }
      }
      async function lG(e10, t10) {
        let r10, { signIn: n10, redirect: i10 } = t10.callbacks;
        try {
          r10 = await n10(e10);
        } catch (e11) {
          if (e11 instanceof rE) throw e11;
          throw new rk(e11);
        }
        if (!r10) throw new rk("AccessDenied");
        if ("string" == typeof r10) return await i10({ url: r10, baseUrl: t10.url.origin });
      }
      async function lX(e10, t10, r10, n10, i10) {
        let { adapter: a10, jwt: o10, events: s10, callbacks: l10, logger: c2, session: { strategy: u2, maxAge: d2 } } = e10, p2 = { body: null, headers: { "Content-Type": "application/json", ...!n10 && { "Cache-Control": "private, no-cache, no-store", Expires: "0", Pragma: "no-cache" } }, cookies: r10 }, h2 = t10.value;
        if (!h2) return p2;
        if ("jwt" === u2) {
          try {
            let r11 = e10.cookies.sessionToken.name, a11 = await o10.decode({ ...o10, token: h2, salt: r11 });
            if (!a11) throw Error("Invalid JWT");
            let c3 = await l10.jwt({ token: a11, ...n10 && { trigger: "update" }, session: i10 }), u3 = oJ(d2);
            if (null !== c3) {
              let e11 = { user: { name: c3.name, email: c3.email, image: c3.picture }, expires: u3.toISOString() }, n11 = await l10.session({ session: e11, token: c3 });
              p2.body = n11;
              let i11 = await o10.encode({ ...o10, token: c3, salt: r11 }), a12 = t10.chunk(i11, { expires: u3 });
              p2.cookies?.push(...a12), await s10.session?.({ session: n11, token: c3 });
            } else p2.cookies?.push(...t10.clean());
          } catch (e11) {
            c2.error(new rN(e11)), p2.cookies?.push(...t10.clean());
          }
          return p2;
        }
        try {
          let { getSessionAndUser: r11, deleteSession: o11, updateSession: c3 } = a10, u3 = await r11(h2);
          if (u3 && u3.session.expires.valueOf() < Date.now() && (await o11(h2), u3 = null), u3) {
            let { user: t11, session: r12 } = u3, a11 = e10.session.updateAge, o12 = r12.expires.valueOf() - 1e3 * d2 + 1e3 * a11, f2 = oJ(d2);
            o12 <= Date.now() && await c3({ sessionToken: h2, expires: f2 });
            let g2 = await l10.session({ session: { ...r12, user: t11 }, user: t11, newSession: i10, ...n10 ? { trigger: "update" } : {} });
            p2.body = g2, p2.cookies?.push({ name: e10.cookies.sessionToken.name, value: h2, options: { ...e10.cookies.sessionToken.options, expires: f2 } }), await s10.session?.({ session: g2 });
          } else h2 && p2.cookies?.push(...t10.clean());
        } catch (e11) {
          c2.error(new rW(e11));
        }
        return p2;
      }
      async function lY(e10, t10) {
        let r10, n10, { logger: i10, provider: a10 } = t10, o10 = a10.authorization?.url;
        if (!o10 || "authjs.dev" === o10.host) {
          let e11 = new URL(a10.issuer), t11 = await sl(e11, { [o3]: a10[ax], [o0]: true }), r11 = await sd(e11, t11).catch((t12) => {
            if (!(t12 instanceof TypeError) || "Invalid URL" !== t12.message) throw t12;
            throw TypeError(`Discovery request responded with an invalid issuer. expected: ${e11}`);
          });
          if (!r11.authorization_endpoint) throw TypeError("Authorization server did not provide an authorization endpoint.");
          o10 = new URL(r11.authorization_endpoint);
        }
        let s10 = o10.searchParams, l10 = a10.callbackUrl;
        !t10.isOnRedirectProxy && a10.redirectProxyUrl && (l10 = a10.redirectProxyUrl, n10 = a10.callbackUrl, i10.debug("using redirect proxy", { redirect_uri: l10, data: n10 }));
        let c2 = Object.assign({ response_type: "code", client_id: a10.clientId, redirect_uri: l10, ...a10.authorization?.params }, Object.fromEntries(a10.authorization?.url.searchParams ?? []), e10);
        for (let e11 in c2) s10.set(e11, c2[e11]);
        let u2 = [];
        a10.authorization?.url.searchParams.get("response_mode") === "form_post" && (t10.cookies.state.options.sameSite = "none", t10.cookies.state.options.secure = true, t10.cookies.nonce.options.sameSite = "none", t10.cookies.nonce.options.secure = true);
        let d2 = await lO.create(t10, n10);
        if (d2 && (s10.set("state", d2.value), u2.push(d2.cookie)), a10.checks?.includes("pkce")) if (r10 && !r10.code_challenge_methods_supported?.includes("S256")) "oidc" === a10.type && (a10.checks = ["nonce"]);
        else {
          let { value: e11, cookie: r11 } = await lC.create(t10);
          s10.set("code_challenge", e11), s10.set("code_challenge_method", "S256"), u2.push(r11);
        }
        let p2 = await lI.create(t10);
        return p2 && (s10.set("nonce", p2.value), u2.push(p2.cookie)), "oidc" !== a10.type || o10.searchParams.has("scope") || o10.searchParams.set("scope", "openid profile email"), i10.debug("authorization url is ready", { url: o10, cookies: u2, provider: a10 }), { redirect: o10.toString(), cookies: u2 };
      }
      async function lZ(e10, t10) {
        let r10, { body: n10 } = e10, { provider: i10, callbacks: a10, adapter: o10 } = t10, s10 = (i10.normalizeIdentifier ?? function(e11) {
          if (!e11) throw Error("Missing email from request body.");
          let t11 = e11.normalize("NFKC").toLowerCase().trim();
          if (t11.includes('"')) throw Error("Invalid email address format.");
          let [r11, n11] = t11.split("@");
          if (!r11 || !n11 || 2 !== t11.split("@").length || !(n11 = n11.split(",")[0])) throw Error("Invalid email address format.");
          return `${r11}@${n11}`;
        })(n10?.email), l10 = { id: crypto.randomUUID(), email: s10, emailVerified: null }, c2 = await o10.getUserByEmail(s10) ?? l10, u2 = { providerAccountId: s10, userId: c2.id, type: "email", provider: i10.id };
        try {
          r10 = await a10.signIn({ user: c2, account: u2, email: { verificationRequest: true } });
        } catch (e11) {
          throw new rk(e11);
        }
        if (!r10) throw new rk("AccessDenied");
        if ("string" == typeof r10) return { redirect: await a10.redirect({ url: r10, baseUrl: t10.url.origin }) };
        let { callbackUrl: d2, theme: p2 } = t10, h2 = await i10.generateVerificationToken?.() ?? am(32), f2 = new Date(Date.now() + (i10.maxAge ?? 86400) * 1e3), g2 = i10.secret ?? t10.secret, m2 = new URL(t10.basePath, t10.url.origin), y2 = i10.sendVerificationRequest({ identifier: s10, token: h2, expires: f2, url: `${m2}/callback/${i10.id}?${new URLSearchParams({ callbackUrl: d2, token: h2, email: s10 })}`, provider: i10, theme: p2, request: new Request(e10.url, { headers: e10.headers, method: e10.method, body: "POST" === e10.method ? JSON.stringify(e10.body ?? {}) : void 0 }) }), b2 = o10.createVerificationToken?.({ identifier: s10, token: await ag(`${h2}${g2}`), expires: f2 });
        return await Promise.all([y2, b2]), { redirect: `${m2}/verify-request?${new URLSearchParams({ provider: i10.id, type: i10.type })}` };
      }
      async function lQ(e10, t10, r10) {
        let n10 = `${r10.url.origin}${r10.basePath}/signin`;
        if (!r10.provider) return { redirect: n10, cookies: t10 };
        switch (r10.provider.type) {
          case "oauth":
          case "oidc": {
            let { redirect: n11, cookies: i10 } = await lY(e10.query, r10);
            return i10 && t10.push(...i10), { redirect: n11, cookies: t10 };
          }
          case "email":
            return { ...await lZ(e10, r10), cookies: t10 };
          default:
            return { redirect: n10, cookies: t10 };
        }
      }
      async function l0(e10, t10, r10) {
        let { jwt: n10, events: i10, callbackUrl: a10, logger: o10, session: s10 } = r10, l10 = t10.value;
        if (!l10) return { redirect: a10, cookies: e10 };
        try {
          if ("jwt" === s10.strategy) {
            let e11 = r10.cookies.sessionToken.name, t11 = await n10.decode({ ...n10, token: l10, salt: e11 });
            await i10.signOut?.({ token: t11 });
          } else {
            let e11 = await r10.adapter?.deleteSession(l10);
            await i10.signOut?.({ session: e11 });
          }
        } catch (e11) {
          o10.error(new rB(e11));
        }
        return e10.push(...t10.clean()), { redirect: a10, cookies: e10 };
      }
      async function l1(e10, t10) {
        let { adapter: r10, jwt: n10, session: { strategy: i10 } } = e10, a10 = t10.value;
        if (!a10) return null;
        if ("jwt" === i10) {
          let t11 = e10.cookies.sessionToken.name, r11 = await n10.decode({ ...n10, token: a10, salt: t11 });
          if (r11 && r11.sub) return { id: r11.sub, name: r11.name, email: r11.email, image: r11.picture };
        } else {
          let e11 = await r10?.getSessionAndUser(a10);
          if (e11) return e11.user;
        }
        return null;
      }
      async function l2(e10, t10, r10, n10) {
        let i10 = lz(t10), { provider: a10 } = i10, { action: o10 } = e10.query ?? {};
        if ("register" !== o10 && "authenticate" !== o10 && void 0 !== o10) return { status: 400, body: { error: "Invalid action" }, cookies: n10, headers: { "Content-Type": "application/json" } };
        let s10 = await l1(t10, r10), l10 = s10 ? { user: s10, exists: true } : await a10.getUserInfo(t10, e10), c2 = l10?.user;
        switch (function(e11, t11, r11) {
          let { user: n11, exists: i11 = false } = r11 ?? {};
          switch (e11) {
            case "authenticate":
              return "authenticate";
            case "register":
              if (n11 && t11 === i11) return "register";
              break;
            case void 0:
              if (!t11) if (!n11) return "authenticate";
              else if (i11) return "authenticate";
              else return "register";
          }
          return null;
        }(o10, !!s10, l10)) {
          case "authenticate":
            return lM(i10, e10, c2, n10);
          case "register":
            if ("string" == typeof c2?.email) return lL(i10, e10, c2, n10);
            break;
          default:
            return { status: 400, body: { error: "Invalid request" }, cookies: n10, headers: { "Content-Type": "application/json" } };
        }
      }
      async function l3(e10, t10) {
        let { action: r10, providerId: n10, error: i10, method: a10 } = e10, o10 = t10.skipCSRFCheck === a_, { options: s10, cookies: l10 } = await aA({ authOptions: t10, action: r10, providerId: n10, url: e10.url, callbackUrl: e10.body?.callbackUrl ?? e10.query?.callbackUrl, csrfToken: e10.body?.csrfToken, cookies: e10.cookies, isPost: "POST" === a10, csrfDisabled: o10 }), c2 = new r_(s10.cookies.sessionToken, e10.cookies, s10.logger);
        if ("GET" === a10) {
          let t11 = oV({ ...s10, query: e10.query, cookies: l10 });
          switch (r10) {
            case "callback":
              return await lJ(e10, s10, c2, l10);
            case "csrf":
              return t11.csrf(o10, s10, l10);
            case "error":
              return t11.error(i10);
            case "providers":
              return t11.providers(s10.providers);
            case "session":
              return await lX(s10, c2, l10);
            case "signin":
              return t11.signin(n10, i10);
            case "signout":
              return t11.signout();
            case "verify-request":
              return t11.verifyRequest();
            case "webauthn-options":
              return await l2(e10, s10, c2, l10);
          }
        } else {
          let { csrfTokenVerified: t11 } = s10;
          switch (r10) {
            case "callback":
              return "credentials" === s10.provider.type && ab(r10, t11), await lJ(e10, s10, c2, l10);
            case "session":
              return ab(r10, t11), await lX(s10, c2, l10, true, e10.body?.data);
            case "signin":
              return ab(r10, t11), await lQ(e10, l10, s10);
            case "signout":
              return ab(r10, t11), await l0(l10, c2, s10);
          }
        }
        throw new rq(`Cannot handle action: ${r10}`);
      }
      function l4(e10, t10, r10, n10, i10) {
        let a10, o10 = i10?.basePath, s10 = n10.AUTH_URL ?? n10.NEXTAUTH_URL;
        if (s10) a10 = new URL(s10), o10 && "/" !== o10 && "/" !== a10.pathname && (a10.pathname !== o10 && al(i10).warn("env-url-basepath-mismatch"), a10.pathname = "/");
        else {
          let e11 = r10.get("x-forwarded-host") ?? r10.get("host"), n11 = r10.get("x-forwarded-proto") ?? t10 ?? "https", i11 = n11.endsWith(":") ? n11 : n11 + ":";
          a10 = new URL(`${i11}//${e11}`);
        }
        let l10 = a10.toString().replace(/\/$/, "");
        if (o10) {
          let t11 = o10?.replace(/(^\/|\/$)/g, "") ?? "";
          return new URL(`${l10}/${t11}/${e10}`);
        }
        return new URL(`${l10}/${e10}`);
      }
      async function l5(e10, t10) {
        let r10 = al(t10), n10 = await ah(e10, t10);
        if (!n10) return Response.json("Bad request.", { status: 400 });
        let i10 = function(e11, t11) {
          let { url: r11 } = e11, n11 = [];
          if (!r1 && t11.debug && n11.push("debug-enabled"), !t11.trustHost) return new rK(`Host must be trusted. URL was: ${e11.url}`);
          if (!t11.secret?.length) return new rD("Please define a `secret`");
          let i11 = e11.query?.callbackUrl;
          if (i11 && !r2(i11, r11.origin)) return new rC(`Invalid callback URL. Received: ${i11}`);
          let { callbackUrl: a11 } = rw(t11.useSecureCookies ?? "https:" === r11.protocol), o11 = e11.cookies?.[t11.cookies?.callbackUrl?.name ?? a11.name];
          if (o11 && !r2(o11, r11.origin)) return new rC(`Invalid callback URL. Received: ${o11}`);
          let s10 = false;
          for (let e12 of t11.providers) {
            let t12 = "function" == typeof e12 ? e12() : e12;
            if (("oauth" === t12.type || "oidc" === t12.type) && !(t12.issuer ?? t12.options?.issuer)) {
              let e13, { authorization: r12, token: n12, userinfo: i12 } = t12;
              if ("string" == typeof r12 || r12?.url ? "string" == typeof n12 || n12?.url ? "string" == typeof i12 || i12?.url || (e13 = "userinfo") : e13 = "token" : e13 = "authorization", e13) return new rO(`Provider "${t12.id}" is missing both \`issuer\` and \`${e13}\` endpoint config. At least one of them is required`);
            }
            if ("credentials" === t12.type) r3 = true;
            else if ("email" === t12.type) r4 = true;
            else if ("webauthn" === t12.type) {
              var l10;
              if (r5 = true, t12.simpleWebAuthnBrowserVersion && (l10 = t12.simpleWebAuthnBrowserVersion, !/^v\d+(?:\.\d+){0,2}$/.test(l10))) return new rE(`Invalid provider config for "${t12.id}": simpleWebAuthnBrowserVersion "${t12.simpleWebAuthnBrowserVersion}" must be a valid semver string.`);
              if (t12.enableConditionalUI) {
                if (s10) return new rX("Multiple webauthn providers have 'enableConditionalUI' set to True. Only one provider can have this option enabled at a time");
                if (s10 = true, !Object.values(t12.formFields).some((e13) => e13.autocomplete && e13.autocomplete.toString().indexOf("webauthn") > -1)) return new rY(`Provider "${t12.id}" has 'enableConditionalUI' set to True, but none of its formFields have 'webauthn' in their autocomplete param`);
              }
            }
          }
          if (r3) {
            let e12 = t11.session?.strategy === "database", r12 = !t11.providers.some((e13) => "credentials" !== ("function" == typeof e13 ? e13() : e13).type);
            if (e12 && r12) return new rz("Signing in with credentials only supported if JWT strategy is enabled");
            if (t11.providers.some((e13) => {
              let t12 = "function" == typeof e13 ? e13() : e13;
              return "credentials" === t12.type && !t12.authorize;
            })) return new r$("Must define an authorize() handler to use credentials authentication provider");
          }
          let { adapter: c2, session: u2 } = t11, d2 = [];
          if (r4 || u2?.strategy === "database" || !u2?.strategy && c2) if (r4) {
            if (!c2) return new rU("Email login requires an adapter");
            d2.push(...r6);
          } else {
            if (!c2) return new rU("Database session requires an adapter");
            d2.push(...r8);
          }
          if (r5) {
            if (!t11.experimental?.enableWebAuthn) return new r0("WebAuthn is an experimental feature. To enable it, set `experimental.enableWebAuthn` to `true` in your config");
            if (n11.push("experimental-webauthn"), !c2) return new rU("WebAuthn requires an adapter");
            d2.push(...r9);
          }
          if (c2) {
            let e12 = d2.filter((e13) => !(e13 in c2));
            if (e12.length) return new rj(`Required adapter methods were missing: ${e12.join(", ")}`);
          }
          return r1 || (r1 = true), n11;
        }(n10, t10);
        if (Array.isArray(i10)) i10.forEach(r10.warn);
        else if (i10) {
          if (r10.error(i10), !(/* @__PURE__ */ new Set(["signin", "signout", "error", "verify-request"])).has(n10.action) || "GET" !== n10.method) return Response.json({ message: "There was a problem with the server configuration. Check the server logs for more information." }, { status: 500 });
          let { pages: e11, theme: a11 } = t10, o11 = e11?.error && n10.url.searchParams.get("callbackUrl")?.startsWith(e11.error);
          if (!e11?.error || o11) return o11 && r10.error(new rR(`The error page ${e11?.error} should not require authentication`)), af(oV({ theme: a11 }).error("Configuration"));
          let s10 = `${n10.url.origin}${e11.error}?error=Configuration`;
          return Response.redirect(s10);
        }
        let a10 = e10.headers?.has("X-Auth-Return-Redirect"), o10 = t10.raw === aE;
        try {
          let e11 = await l3(n10, t10);
          if (o10) return e11;
          let r11 = af(e11), i11 = r11.headers.get("Location");
          if (!a10 || !i11) return r11;
          return Response.json({ url: i11 }, { headers: r11.headers });
        } catch (d2) {
          r10.error(d2);
          let i11 = d2 instanceof rE;
          if (i11 && o10 && !a10) throw d2;
          if ("POST" === e10.method && "session" === n10.action) return Response.json(null, { status: 400 });
          let s10 = new URLSearchParams({ error: d2 instanceof rE && rG.has(d2.type) ? d2.type : "Configuration" });
          d2 instanceof rA && s10.set("code", d2.code);
          let l10 = i11 && d2.kind || "error", c2 = t10.pages?.[l10] ?? `${t10.basePath}/${l10.toLowerCase()}`, u2 = `${n10.url.origin}${c2}?${s10}`;
          if (a10) return Response.json({ url: u2 });
          return Response.redirect(u2);
        }
      }
      e.i(64445);
      var l6 = e.i(40049);
      class l8 extends Error {
        constructor(e10) {
          super(`Dynamic server usage: ${e10}`), this.description = e10, this.digest = "DYNAMIC_SERVER_USAGE";
        }
      }
      var l9 = ((G = {})[G.Before = 1] = "Before", G[G.ShellStatic = 11] = "ShellStatic", G[G.Static = 13] = "Static", G[G.ShellRuntime = 21] = "ShellRuntime", G[G.Runtime = 23] = "Runtime", G[G.Dynamic = 30] = "Dynamic", G[G.Abandoned = 40] = "Abandoned", G);
      class l7 extends Error {
        constructor(e10, t10) {
          super(`During prerendering, ${t10} rejects when the prerender is complete. Typically these errors are handled by React but if you move ${t10} to a different context by using \`setTimeout\`, \`after\`, or similar functions you may observe this error and you should handle it in that context. This occurred at route "${e10}".`), this.route = e10, this.expression = t10, this.digest = "HANGING_PROMISE_REJECTION";
        }
      }
      let ce = /* @__PURE__ */ new WeakMap();
      function ct(e10, t10, r10, n10) {
        return null !== n10 && function(e11) {
          var t11, r11 = e11, n11 = false;
          if ("prerender" === r11.type) {
            null == (t11 = r11.runtimeDataAccessed) || t11.resolve(true);
            let e12 = r11.shouldAttemptStaticPrefetch;
            null === e12 || n11 && r11.isFallbackUpgradeable || (e12.current = false);
          }
        }(n10), function(e11, t11) {
          if (e11.aborted) return Promise.reject(t11);
          {
            let r11 = new Promise((r12, n11) => {
              let i10 = n11.bind(null, t11), a10 = ce.get(e11);
              if (a10) a10.push(i10);
              else {
                let t12 = [i10];
                ce.set(e11, t12), e11.addEventListener("abort", () => {
                  for (let e12 = 0; e12 < t12.length; e12++) t12[e12]();
                }, { once: true });
              }
            });
            return r11.catch(cr), r11;
          }
        }(e10, new l7(t10, r10));
      }
      function cr() {
      }
      let cn = { sessionData: l9.ShellRuntime, staticLinkData: l9.Static, runtimeLinkData: l9.Runtime }, ci = "function" == typeof l6.default.unstable_postpone;
      function ca(e10, t10, r10) {
        let n10 = Object.defineProperty(new l8(`Route ${t10.route} couldn't be rendered statically because it used \`${e10}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`), "__NEXT_ERROR_CODE", { value: "E558", enumerable: false, configurable: true });
        throw r10.revalidate = 0, t10.dynamicUsageDescription = e10, t10.dynamicUsageStack = n10.stack, n10;
      }
      function co(e10) {
        switch (e10.type) {
          case "cache":
          case "unstable-cache":
          case "private-cache":
            return;
        }
      }
      function cs(e10, t10, r10) {
        (function() {
          if (!ci) throw Object.defineProperty(Error("Invariant: React.unstable_postpone is not defined. This suggests the wrong version of React was loaded. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E224", enumerable: false, configurable: true });
        })(), r10 && r10.dynamicAccesses.push({ stack: r10.isDebugDynamicAccesses ? Error().stack : void 0, expression: t10 }), l6.default.unstable_postpone(cl(e10, t10));
      }
      function cl(e10, t10) {
        return `Route ${e10} needs to bail out of prerendering at this point because it used ${t10}. React throws this special object to indicate where. It should not be caught by your own try/catch. Learn more: https://nextjs.org/docs/messages/ppr-caught-error`;
      }
      if (false === ((X = cl("%%%", "^^^")).includes("needs to bail out of prerendering at this point because it used") && X.includes("Learn more: https://nextjs.org/docs/messages/ppr-caught-error"))) throw Object.defineProperty(Error("Invariant: isDynamicPostpone misidentified a postpone reason. This is a bug in Next.js"), "__NEXT_ERROR_CODE", { value: "E296", enumerable: false, configurable: true });
      RegExp("\\n\\s+at Suspense \\(<anonymous>\\)(?:(?!\\n\\s+at (?:body|div|main|section|article|aside|header|footer|nav|form|p|span|h1|h2|h3|h4|h5|h6) \\(<anonymous>\\))[\\s\\S])*?\\n\\s+at __next_root_layout_boundary__ \\([^\\n]*\\)"), RegExp("\\n\\s+at __next_metadata_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_viewport_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_outlet_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_validation_boundary__[\\n\\s]"), RegExp("\\n\\s+at __next_instant_slot_(\\d+)__[\\n\\s]");
      let cc = ey();
      function cu(e10) {
        switch (e10.phase) {
          case "action":
          case "render":
            return true;
          case "after": {
            let e11 = cc.getStore();
            if (e11 && (e11.isAppRoute || e11.isAction)) return true;
            let t10 = tl.getStore();
            if (t10) return "action" === t10.rootTaskSpawnPhase;
            return false;
          }
        }
      }
      function cd(e10) {
        let t10 = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
        if (!t10) return e10;
        let { origin: r10 } = new URL(t10), { href: n10, origin: i10 } = e10.nextUrl;
        return new ee(n10.replace(i10, r10), e10);
      }
      function cp(e10) {
        try {
          e10.secret ?? (e10.secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET);
          let t10 = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
          if (!t10) return;
          let { pathname: r10 } = new URL(t10);
          if ("/" === r10) return;
          e10.basePath || (e10.basePath = r10);
        } catch {
        } finally {
          e10.basePath || (e10.basePath = "/api/auth"), function(e11, t10, r10 = false) {
            try {
              let n10 = e11.AUTH_URL;
              n10 && (t10.basePath ? r10 || al(t10).warn("env-url-basepath-redundant") : t10.basePath = new URL(n10).pathname);
            } catch {
            } finally {
              t10.basePath ?? (t10.basePath = "/auth");
            }
            if (!t10.secret?.length) {
              t10.secret = [];
              let r11 = e11.AUTH_SECRET;
              for (let n10 of (r11 && t10.secret.push(r11), [1, 2, 3])) {
                let r12 = e11[`AUTH_SECRET_${n10}`];
                r12 && t10.secret.unshift(r12);
              }
            }
            t10.redirectProxyUrl ?? (t10.redirectProxyUrl = e11.AUTH_REDIRECT_PROXY_URL), t10.trustHost ?? (t10.trustHost = !!(e11.AUTH_URL ?? e11.AUTH_TRUST_HOST ?? e11.VERCEL ?? e11.CF_PAGES ?? "production" !== e11.NODE_ENV)), t10.providers = t10.providers.map((t11) => {
              let { id: r11 } = "function" == typeof t11 ? t11({}) : t11, n10 = r11.toUpperCase().replace(/-/g, "_"), i10 = e11[`AUTH_${n10}_ID`], a10 = e11[`AUTH_${n10}_SECRET`], o10 = e11[`AUTH_${n10}_ISSUER`], s10 = e11[`AUTH_${n10}_KEY`], l10 = "function" == typeof t11 ? t11({ clientId: i10, clientSecret: a10, issuer: o10, apiKey: s10 }) : t11;
              return "oauth" === l10.type || "oidc" === l10.type ? (l10.clientId ?? (l10.clientId = i10), l10.clientSecret ?? (l10.clientSecret = a10), l10.issuer ?? (l10.issuer = o10)) : "email" === l10.type && (l10.apiKey ?? (l10.apiKey = s10)), l10;
            });
          }(process.env, e10, true);
        }
      }
      class ch extends Error {
        constructor(...e10) {
          super(...e10), this.code = "NEXT_STATIC_GEN_BAILOUT";
        }
      }
      let cf = { current: null }, cg = "function" == typeof l6.cache ? l6.cache : (e10) => e10, cm = console.warn;
      function cy(e10) {
        return function(...t10) {
          cm(e10(...t10));
        };
      }
      function cb() {
        let e10 = "cookies", t10 = eb.getStore(), r10 = e5.getStore();
        if (t10) {
          if (r10 && !cu(r10)) throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside \`after()\` while rendering. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E1381", enumerable: false, configurable: true });
          if (t10.forceStatic) return cw(ew.seal(new Z.RequestCookies(new Headers({}))));
          if (t10.dynamicShouldError) throw Object.defineProperty(new ch(`Route ${t10.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E849", enumerable: false, configurable: true });
          if (r10) switch (r10.type) {
            case "cache":
              let a10 = Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E831", enumerable: false, configurable: true });
              throw Error.captureStackTrace(a10, cb), t10.invalidDynamicUsageError ??= a10, a10;
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E846", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`cookies()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1123", enumerable: false, configurable: true });
            case "prerender":
              var n10 = t10, i10 = r10;
              let o10 = cv.get(i10);
              if (o10) return o10;
              let s10 = ct(i10.renderSignal, n10.route, "`cookies()`", i10);
              return cv.set(i10, s10), s10;
            case "prerender-client":
            case "validation-client":
              let l10 = "`cookies`";
              throw Object.defineProperty(new e7(`${l10} must not be used within a Client Component. Next.js should be preventing ${l10} from being included in Client Components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1037", enumerable: false, configurable: true });
            case "prerender-ppr":
              return cs(t10.route, e10, r10.dynamicTracking);
            case "prerender-legacy":
              return ca(e10, t10, r10);
            case "prerender-runtime": {
              let { stagedRendering: e11 } = r10;
              if (e11) return e11.delayUntilStage(cn.sessionData, "cookies", r10.cookies);
              return cw(r10.cookies);
            }
            case "private-cache":
              return cw(r10.cookies);
            case "request":
              let c2;
              if (co(r10), c2 = ex(r10) ? r10.userspaceMutableCookies : r10.cookies, !r10.asyncApiPromises) return cw(c2);
              if (c2 === r10.mutableCookies) return r10.asyncApiPromises.mutableCookies;
              return r10.asyncApiPromises.cookies;
          }
        }
        e6(e10);
      }
      cg((e10) => {
        try {
          cm(cf.current);
        } finally {
          cf.current = null;
        }
      });
      let cv = /* @__PURE__ */ new WeakMap();
      function cw(e10) {
        let t10 = cv.get(e10);
        if (t10) return t10;
        let r10 = Promise.resolve(e10);
        return cv.set(e10, r10), r10;
      }
      function c_() {
        let e10 = "headers", t10 = eb.getStore(), r10 = e5.getStore();
        if (t10) {
          if (r10 && !cu(r10)) throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside \`after()\` while rendering. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`), "__NEXT_ERROR_CODE", { value: "E1378", enumerable: false, configurable: true });
          if (t10.forceStatic) return cx(eh.seal(new Headers({})));
          if (r10) switch (r10.type) {
            case "cache": {
              let e11 = Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`), "__NEXT_ERROR_CODE", { value: "E833", enumerable: false, configurable: true });
              throw Error.captureStackTrace(e11, c_), t10.invalidDynamicUsageError ??= e11, e11;
            }
            case "unstable-cache":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`), "__NEXT_ERROR_CODE", { value: "E838", enumerable: false, configurable: true });
            case "generate-static-params":
              throw Object.defineProperty(Error(`Route ${t10.route} used \`headers()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`), "__NEXT_ERROR_CODE", { value: "E1134", enumerable: false, configurable: true });
          }
          if (t10.dynamicShouldError) throw Object.defineProperty(new ch(`Route ${t10.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`), "__NEXT_ERROR_CODE", { value: "E828", enumerable: false, configurable: true });
          if (r10) switch (r10.type) {
            case "prerender":
              var n10 = t10, i10 = r10;
              let a10 = cE.get(i10);
              if (a10) return a10;
              let o10 = ct(i10.renderSignal, n10.route, "`headers()`", i10);
              return cE.set(i10, o10), o10;
            case "prerender-client":
            case "validation-client":
              let s10 = "`headers`";
              throw Object.defineProperty(new e7(`${s10} must not be used within a client component. Next.js should be preventing ${s10} from being included in client components statically, but did not in this case.`), "__NEXT_ERROR_CODE", { value: "E1017", enumerable: false, configurable: true });
            case "prerender-ppr":
              return cs(t10.route, e10, r10.dynamicTracking);
            case "prerender-legacy":
              return ca(e10, t10, r10);
            case "prerender-runtime": {
              let { stagedRendering: e11 } = r10;
              if (e11) return e11.delayUntilStage(cn.sessionData, "headers", r10.headers);
              return cx(r10.headers);
            }
            case "private-cache":
              return cx(r10.headers);
            case "request":
              if (co(r10), r10.asyncApiPromises) return r10.asyncApiPromises.headers;
              return cx(r10.headers);
          }
        }
        e6(e10);
      }
      cy(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E830", enumerable: false, configurable: true });
      });
      let cE = /* @__PURE__ */ new WeakMap();
      function cx(e10) {
        let t10 = cE.get(e10);
        if (t10) return t10;
        let r10 = Promise.resolve(e10);
        return cE.set(e10, r10), r10;
      }
      async function cS(e10, t10) {
        return l5(new Request(l4("session", e10.get("x-forwarded-proto"), e10, process.env, t10), { headers: { cookie: e10.get("cookie") ?? "" } }), { ...t10, callbacks: { ...t10.callbacks, async session(...e11) {
          let r10 = await t10.callbacks?.session?.(...e11) ?? { ...e11[0].session, expires: e11[0].session.expires?.toISOString?.() ?? e11[0].session.expires };
          return { user: e11[0].user ?? e11[0].token, ...r10 };
        } } });
      }
      async function ck(e10) {
        return e10.ok ? await e10.json() : null;
      }
      function cT(e10) {
        return "function" == typeof e10;
      }
      function cR(e10, t10) {
        return "function" == typeof e10 ? async (...r10) => {
          if (!r10.length) {
            let r11 = await c_(), n11 = await e10(void 0);
            return t10?.(n11), cS(r11, n11).then(ck);
          }
          if (r10[0] instanceof Request) {
            let n11 = r10[0], i11 = r10[1], a11 = await e10(n11);
            return t10?.(a11), cP([n11, i11], a11);
          }
          if (cT(r10[0])) {
            let n11 = r10[0];
            return async (...r11) => {
              let i11 = await e10(r11[0]);
              return t10?.(i11), cP(r11, i11, n11);
            };
          }
          let n10 = "req" in r10[0] ? r10[0].req : r10[0], i10 = "res" in r10[0] ? r10[0].res : r10[1], a10 = await e10(n10);
          return t10?.(a10), cS(new Headers(n10.headers), a10).then(async (e11) => {
            let t11 = await ck(e11);
            for (let t12 of e11.headers.getSetCookie()) "headers" in i10 ? i10.headers.append("set-cookie", t12) : i10.appendHeader("set-cookie", t12);
            return t11;
          });
        } : (...t11) => {
          if (!t11.length) return Promise.resolve(c_()).then((t12) => cS(t12, e10).then(ck));
          if (t11[0] instanceof Request) return cP([t11[0], t11[1]], e10);
          if (cT(t11[0])) {
            let r11 = t11[0];
            return async (...t12) => cP(t12, e10, r11).then((e11) => e11);
          }
          let r10 = "req" in t11[0] ? t11[0].req : t11[0], n10 = "res" in t11[0] ? t11[0].res : t11[1];
          return cS(new Headers(r10.headers), e10).then(async (e11) => {
            let t12 = await ck(e11);
            for (let t13 of e11.headers.getSetCookie()) "headers" in n10 ? n10.headers.append("set-cookie", t13) : n10.appendHeader("set-cookie", t13);
            return t12;
          });
        };
      }
      async function cP(e10, t10, r10) {
        let n10 = cd(e10[0]), i10 = await cS(n10.headers, t10), a10 = await ck(i10), o10 = true;
        t10.callbacks?.authorized && (o10 = await t10.callbacks.authorized({ request: n10, auth: a10 }));
        let s10 = ea.next?.();
        if (o10 instanceof Response) {
          var l10, c2, u2;
          let e11, r11;
          s10 = o10;
          let i11 = o10.headers.get("Location"), { pathname: a11 } = n10.nextUrl;
          i11 && (l10 = a11, c2 = new URL(i11).pathname, u2 = t10, e11 = c2.replace(`${l10}/`, ""), r11 = Object.values(u2.pages ?? {}), (cC.has(e11) || r11.includes(c2)) && c2 === l10) && (o10 = true);
        } else if (r10) n10.auth = a10, s10 = await r10(n10, e10[1]) ?? ea.next();
        else if (!o10) {
          let e11 = t10.pages?.signIn ?? `${t10.basePath}/signin`;
          if (n10.nextUrl.pathname !== e11) {
            let t11 = n10.nextUrl.clone();
            t11.pathname = e11, t11.searchParams.set("callbackUrl", n10.nextUrl.href), s10 = ea.redirect(t11);
          }
        }
        let d2 = new Response(s10?.body, s10);
        for (let e11 of i10.headers.getSetCookie()) d2.headers.append("set-cookie", e11);
        return d2;
      }
      cy(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E836", enumerable: false, configurable: true });
      }), /* @__PURE__ */ new WeakMap(), cy(function(e10, t10) {
        let r10 = e10 ? `Route "${e10}" ` : "This route ";
        return Object.defineProperty(Error(`${r10}used ${t10}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`), "__NEXT_ERROR_CODE", { value: "E835", enumerable: false, configurable: true });
      });
      let cC = /* @__PURE__ */ new Set(["providers", "session", "csrf", "signin", "signout", "callback", "verify-request", "error"]);
      URLSearchParams;
      var cA = ((Y = {})[Y.SeeOther = 303] = "SeeOther", Y[Y.TemporaryRedirect = 307] = "TemporaryRedirect", Y[Y.PermanentRedirect = 308] = "PermanentRedirect", Y);
      let cO = "NEXT_REDIRECT";
      function cI(e10, t10) {
        throw function(e11, t11, r10 = cA.TemporaryRedirect) {
          let n10 = Object.defineProperty(Error(cO), "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true });
          return n10.digest = `${cO};${t11};${e11};${r10};`, n10;
        }(e10, t10 ??= cc?.getStore()?.isAction ? "push" : "replace", cA.TemporaryRedirect);
      }
      async function cN(e10, t10 = {}, r10, n10) {
        let i10 = new Headers(await c_()), { redirect: a10 = true, redirectTo: o10, ...s10 } = t10 instanceof FormData ? Object.fromEntries(t10) : t10, l10 = o10?.toString() ?? i10.get("Referer") ?? "/", c2 = l4("signin", i10.get("x-forwarded-proto"), i10, process.env, n10);
        if (!e10) return c2.searchParams.append("callbackUrl", l10), a10 && cI(c2.toString()), c2.toString();
        let u2 = `${c2}/${e10}?${new URLSearchParams(r10)}`, d2 = {};
        for (let t11 of n10.providers) {
          let { options: r11, ...n11 } = "function" == typeof t11 ? t11() : t11, i11 = r11?.id ?? n11.id;
          if (i11 === e10) {
            d2 = { id: i11, type: r11?.type ?? n11.type };
            break;
          }
        }
        if (!d2.id) {
          let e11 = `${c2}?${new URLSearchParams({ callbackUrl: l10 })}`;
          return a10 && cI(e11), e11;
        }
        "credentials" === d2.type && (u2 = u2.replace("signin", "callback")), i10.set("Content-Type", "application/x-www-form-urlencoded");
        let p2 = new Request(u2, { method: "POST", headers: i10, body: new URLSearchParams({ ...s10, callbackUrl: l10 }) }), h2 = await l5(p2, { ...n10, raw: aE, skipCSRFCheck: a_ }), f2 = await cb();
        for (let e11 of h2?.cookies ?? []) f2.set(e11.name, e11.value, e11.options);
        let g2 = (h2 instanceof Response ? h2.headers.get("Location") : h2.redirect) ?? u2;
        return a10 ? cI(g2) : g2;
      }
      async function cU(e10, t10) {
        let r10 = new Headers(await c_());
        r10.set("Content-Type", "application/x-www-form-urlencoded");
        let n10 = l4("signout", r10.get("x-forwarded-proto"), r10, process.env, t10), i10 = new URLSearchParams({ callbackUrl: e10?.redirectTo ?? r10.get("Referer") ?? "/" }), a10 = new Request(n10, { method: "POST", headers: r10, body: i10 }), o10 = await l5(a10, { ...t10, raw: aE, skipCSRFCheck: a_ }), s10 = await cb();
        for (let e11 of o10?.cookies ?? []) s10.set(e11.name, e11.value, e11.options);
        return e10?.redirect ?? true ? cI(o10.redirect) : o10;
      }
      async function cj(e10, t10) {
        let r10 = new Headers(await c_());
        r10.set("Content-Type", "application/json");
        let n10 = new Request(l4("session", r10.get("x-forwarded-proto"), r10, process.env, t10), { method: "POST", headers: r10, body: JSON.stringify({ data: e10 }) }), i10 = await l5(n10, { ...t10, raw: aE, skipCSRFCheck: a_ }), a10 = await cb();
        for (let e11 of i10?.cookies ?? []) a10.set(e11.name, e11.value, e11.options);
        return i10.body;
      }
      let c$ = function(e10) {
        if ("function" == typeof e10) {
          let t11 = async (t12) => {
            let r10 = await e10(t12);
            return cp(r10), l5(cd(t12), r10);
          };
          return { handlers: { GET: t11, POST: t11 }, auth: cR(e10, (e11) => cp(e11)), signIn: async (t12, r10, n10) => {
            let i10 = await e10(void 0);
            return cp(i10), cN(t12, r10, n10, i10);
          }, signOut: async (t12) => {
            let r10 = await e10(void 0);
            return cp(r10), cU(t12, r10);
          }, unstable_update: async (t12) => {
            let r10 = await e10(void 0);
            return cp(r10), cj(t12, r10);
          } };
        }
        cp(e10);
        let t10 = (t11) => l5(cd(t11), e10);
        return { handlers: { GET: t10, POST: t10 }, auth: cR(e10), signIn: (t11, r10, n10) => cN(t11, r10, n10, e10), signOut: (t11) => cU(t11, e10), unstable_update: (t11) => cj(t11, e10) };
      }({ pages: { signIn: "/login" }, callbacks: { authorized({ auth: e10, request: { nextUrl: t10 } }) {
        let r10 = !!e10?.user, n10 = ["/dashboard", "/vendors"].some((e11) => t10.pathname.startsWith(e11)), i10 = ["/login", "/register"].some((e11) => t10.pathname.startsWith(e11));
        return n10 && !r10 ? Response.redirect(new URL("/login", t10)) : !i10 || !r10 || Response.redirect(new URL("/", t10));
      }, jwt: ({ token: e10, user: t10 }) => (t10 && (e10.role = t10.role, e10.id = t10.id), e10), session: ({ session: e10, token: t10 }) => (t10 && e10.user && (e10.user.role = t10.role, e10.user.id = t10.id), e10) }, providers: [] }).auth;
      e.s(["config", 0, { matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"] }, "default", 0, c$], 96592);
      let cD = { ...e.i(96592) }, cL = "/middleware", cM = cD.middleware || cD.default;
      if ("function" != typeof cM) throw new class extends Error {
        constructor(e10) {
          super(e10), Object.defineProperty(this, "__NEXT_ERROR_CODE", { value: "E394", enumerable: false, configurable: true }), this.stack = "";
        }
      }(`The Middleware file "${cL}" must export a function named \`middleware\` or a default function.`);
      let cH = async (e10) => tk({ ...e10, IncrementalCache: ry, incrementalCacheHandler: null, page: cL, handler: async (...e11) => {
        try {
          return await cM(...e11);
        } catch (i10) {
          let t10 = e11[0], r10 = new URL(t10.url), n10 = r10.pathname + r10.search;
          throw await p(i10, { path: n10, method: t10.method, headers: Object.fromEntries(t10.headers.entries()) }, { routerKind: "Pages Router", routePath: "/proxy", routeType: "proxy", revalidateReason: void 0 }), i10;
        }
      } });
      async function cW(e10, t10) {
        let r10 = await cH({ request: { url: e10.url, method: e10.method, headers: O(e10.headers), nextConfig: { basePath: "", i18n: "", trailingSlash: false, experimental: { cacheLife: { default: { stale: 300, revalidate: 900, expire: 4294967294 }, seconds: { stale: 30, revalidate: 1, expire: 60 }, minutes: { stale: 300, revalidate: 60, expire: 3600 }, hours: { stale: 300, revalidate: 3600, expire: 86400 }, days: { stale: 300, revalidate: 86400, expire: 604800 }, weeks: { stale: 300, revalidate: 604800, expire: 2592e3 }, max: { stale: 300, revalidate: 2592e3, expire: 31536e3 } }, authInterrupts: false, clientParamParsingOrigins: [] } }, page: { name: cL }, body: "GET" !== e10.method && "HEAD" !== e10.method ? e10.body ?? void 0 : void 0, waitUntil: t10.waitUntil, requestMeta: t10.requestMeta, signal: t10.signal || new AbortController().signal } });
        return null == t10.waitUntil || t10.waitUntil.call(t10, r10.waitUntil), r10.response;
      }
      e.s(["default", 0, cH, "handler", 0, cW], 58217);
    }]);
  }
});

// .next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1b8jwmg.js
var require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_1b8jwmg = __commonJS({
  ".next/server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1b8jwmg.js"() {
    "use strict";
    (globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1b8jwmg.js", { otherChunks: ["chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", "chunks/[root-of-the-server]__1xk24c3._.js"], runtimeModuleIds: [35825] }]), (() => {
      let e;
      if (!Array.isArray(globalThis.TURBOPACK)) return;
      var t, r = ((t = r || {})[t.Runtime = 0] = "Runtime", t[t.Parent = 1] = "Parent", t[t.Update = 2] = "Update", t);
      let n = /* @__PURE__ */ new WeakMap();
      function o(e2, t2) {
        this.m = e2, this.e = t2;
      }
      let l = o.prototype, u = Object.prototype.hasOwnProperty, i = "u" > typeof Symbol && Symbol.toStringTag;
      function a(e2, t2, r2) {
        u.call(e2, t2) || Object.defineProperty(e2, t2, r2);
      }
      function s(e2, t2) {
        let r2 = e2[t2];
        return r2 || (r2 = f(t2), e2[t2] = r2), r2;
      }
      function f(e2) {
        return { exports: {}, error: void 0, id: e2, namespaceObject: void 0 };
      }
      function c(e2, t2, r2) {
        a(e2, "__esModule", { value: true }), i && a(e2, i, { value: "Module" });
        let n2 = 0;
        for (; n2 < t2.length; ) {
          let r3 = t2[n2++], o2 = t2[n2++];
          if ("number" == typeof o2) if (0 === o2) a(e2, r3, { value: t2[n2++], enumerable: true, writable: false });
          else throw Error(`unexpected tag: ${o2}`);
          else "function" == typeof t2[n2] ? a(e2, r3, { get: o2, set: t2[n2++], enumerable: true }) : a(e2, r3, { get: o2, enumerable: true });
        }
        r2 || Object.seal(e2);
      }
      function d(e2, t2) {
        (null != t2 ? s(this.c, t2) : this.m).exports = e2;
      }
      l.s = function(e2, t2, r2) {
        let n2, o2;
        null != t2 ? o2 = (n2 = s(this.c, t2)).exports : (n2 = this.m, o2 = this.e), n2.namespaceObject = o2, c(o2, e2, r2);
      }, l.j = function(e2, t2) {
        let r2, o2;
        null != t2 ? o2 = (r2 = s(this.c, t2)).exports : (r2 = this.m, o2 = this.e);
        let l2 = function(e3, t3) {
          let r3 = n.get(e3);
          if (!r3) {
            n.set(e3, r3 = []);
            let o3 = (e4) => {
              if ("default" !== e4) {
                for (let t4 of r3) if (u.call(t4, e4)) return t4;
              }
            };
            e3.exports = e3.namespaceObject = new Proxy(t3, { get(e4, t4) {
              if (u.call(e4, t4) || "default" === t4 || "__esModule" === t4) return Reflect.get(e4, t4);
              let r4 = o3(t4);
              return r4 && Reflect.get(r4, t4);
            }, set: () => false, defineProperty: () => false, deleteProperty: () => false, has: (e4, t4) => !!Reflect.has(e4, t4) || "default" !== t4 && "__esModule" !== t4 && void 0 !== o3(t4), ownKeys(e4) {
              let t4 = Reflect.ownKeys(e4);
              for (let e5 of r3) for (let r4 of Reflect.ownKeys(e5)) "default" === r4 || t4.includes(r4) || t4.push(r4);
              return t4;
            }, getOwnPropertyDescriptor(e4, t4) {
              let r4 = Reflect.getOwnPropertyDescriptor(e4, t4);
              if (r4 || "default" === t4 || "__esModule" === t4) return r4;
              let n2 = o3(t4);
              if (n2) return { enumerable: true, configurable: true, get: () => Reflect.get(n2, t4) };
            } });
          }
          return r3;
        }(r2, o2);
        "object" == typeof e2 && null !== e2 && l2.push(e2);
      }, l.v = d, l.n = function(e2, t2) {
        let r2;
        (r2 = null != t2 ? s(this.c, t2) : this.m).exports = r2.namespaceObject = e2;
      };
      let p = Object.getPrototypeOf ? (e2) => Object.getPrototypeOf(e2) : (e2) => e2.__proto__, h = [null, p({}), p([]), p(p)];
      function m(e2, t2, r2) {
        let n2 = [], o2 = -1;
        for (let t3 = e2; ("object" == typeof t3 || "function" == typeof t3) && !h.includes(t3); t3 = p(t3)) for (let r3 of Object.getOwnPropertyNames(t3)) n2.push(r3, /* @__PURE__ */ function(e3, t4) {
          return () => e3[t4];
        }(e2, r3)), -1 === o2 && "default" === r3 && (o2 = n2.length - 1);
        return r2 && o2 >= 0 || (o2 >= 0 ? n2.splice(o2, 1, 0, e2) : n2.push("default", 0, e2)), c(t2, n2), t2;
      }
      function y(e2) {
        return "function" == typeof e2 ? function(...t2) {
          return e2.apply(this, t2);
        } : /* @__PURE__ */ Object.create(null);
      }
      function b(e2) {
        let t2 = K(e2, this.m);
        if (t2.namespaceObject) return t2.namespaceObject;
        let r2 = t2.exports;
        return t2.namespaceObject = m(r2, y(r2), r2 && r2.__esModule);
      }
      function g(e2) {
        let t2 = e2.indexOf("#");
        -1 !== t2 && (e2 = e2.substring(0, t2));
        let r2 = e2.indexOf("?");
        return -1 !== r2 && (e2 = e2.substring(0, r2)), e2;
      }
      function _(e2) {
        return "string" == typeof e2 ? e2 : e2.path;
      }
      l.i = b, l.A = function(e2) {
        return this.r(e2)(b.bind(this));
      }, l.t = "function" == typeof __require ? __require : function() {
        throw Error("Unexpected use of runtime require");
      }, l.r = function(e2) {
        return K(e2, this.m).exports;
      }, l.f = function(e2) {
        function t2(t3) {
          if (t3 = g(t3), u.call(e2, t3)) return e2[t3].module();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }
        return t2.keys = () => Object.keys(e2), t2.resolve = (t3) => {
          if (t3 = g(t3), u.call(e2, t3)) return e2[t3].id();
          let r2 = Error(`Cannot find module '${t3}'`);
          throw r2.code = "MODULE_NOT_FOUND", r2;
        }, t2.import = async (e3) => await t2(e3), t2;
      };
      let w = function(e2) {
        let t2 = new URL(e2, "x:/"), r2 = {};
        for (let e3 in t2) r2[e3] = t2[e3];
        for (let t3 in r2.href = e2, r2.pathname = e2.replace(/[?#].*/, ""), r2.origin = r2.protocol = "", r2.toString = r2.toJSON = (...t4) => e2, r2) Object.defineProperty(this, t3, { enumerable: true, configurable: true, value: r2[t3] });
      };
      function O(e2, t2) {
        throw Error(`Invariant: ${t2(e2)}`);
      }
      w.prototype = URL.prototype, l.U = w, l.z = function(e2) {
        throw Error("dynamic usage of require is not supported");
      }, l.g = globalThis;
      let k = o.prototype, P = "string" == typeof TURBOPACK_CHUNK_BASE_PATH ? TURBOPACK_CHUNK_BASE_PATH : "", R = /* @__PURE__ */ new Map();
      l.M = R;
      let C = /* @__PURE__ */ new Map(), j = /* @__PURE__ */ new Map(), U = /* @__PURE__ */ new Map();
      async function v(e2, t2, r2) {
        let n2;
        if ("string" == typeof r2) return function(e3, t3, r3) {
          return $(e3, t3, r3);
        }(e2, t2, E(r2));
        let o2 = r2.included || [], l2 = o2.map((e3) => !!R.has(e3) || C.get(e3));
        if (l2.length > 0 && l2.every((e3) => e3)) return void await Promise.all(l2);
        for (let l3 of (n2 = $(e2, t2, E(r2.path)), o2)) C.has(l3) || C.set(l3, n2);
        await n2;
      }
      k.l = function(e2) {
        return v(r.Parent, this.m.id, e2);
      };
      let x = Promise.resolve(void 0), M = /* @__PURE__ */ new WeakMap();
      function $(t2, n2, o2) {
        let l2 = e.loadChunkCached(t2, o2), u2 = M.get(l2);
        if (void 0 === u2) {
          let e2 = M.set.bind(M, l2, x);
          u2 = l2.then(e2).catch((e3) => {
            let l3;
            switch (t2) {
              case r.Runtime:
                l3 = `as a runtime dependency of chunk ${n2}`;
                break;
              case r.Parent:
                l3 = `from module ${n2}`;
                break;
              case r.Update:
                l3 = "from an HMR update";
                break;
              default:
                O(t2, (e4) => `Unknown source type: ${e4}`);
            }
            let u3 = Error(`Failed to load chunk ${o2} ${l3}${e3 ? `: ${e3}` : ""}`, e3 ? { cause: e3 } : void 0);
            throw u3.name = "ChunkLoadError", u3;
          }), M.set(l2, u2);
        }
        return u2;
      }
      k.L = function(e2) {
        var t2, n2;
        return t2 = r.Parent, n2 = this.m.id, $(t2, n2, e2);
      };
      k.R = function(e2) {
        let t2 = this.r(e2);
        return t2?.default ?? t2;
      }, k.P = function(e2) {
        return `/ROOT/${e2 ?? ""}`;
      }, k.F = function(e2) {
        return e2 ? `file:///ROOT/${e2.split("/").map(encodeURIComponent).join("/")}` : "file:///ROOT/";
      }, k.q = function(e2, t2) {
        d.call(this, `${e2}`, t2);
      };
      let T = /[^A-Za-z0-9\-_.!~*'()/]/;
      function E(e2, t2 = P) {
        let r2 = T.test(e2) ? e2.split("/").map(encodeURIComponent).join("/") : e2;
        return `${t2}${r2}`;
      }
      k.b = P, k.X = "", k.h = E;
      let A = {};
      l.c = A;
      let K = (e2, t2) => {
        let n2 = A[e2];
        if (n2) {
          if (n2.error) throw n2.error;
          return n2;
        }
        return N(e2, r.Parent, t2.id);
      };
      function N(e2, t2, r2) {
        let n2 = R.get(e2);
        if ("function" != typeof n2) throw Error(function(e3, t3, r3) {
          let n3;
          switch (t3) {
            case 0:
              n3 = `as a runtime entry of chunk ${r3}`;
              break;
            case 1:
              n3 = `because it was required from module ${r3}`;
              break;
            case 2:
              n3 = "because of an HMR update";
              break;
            default:
              O(t3, (e4) => `Unknown source type: ${e4}`);
          }
          return `Module ${e3} was instantiated ${n3}, but the module factory is not available.`;
        }(e2, t2, r2));
        let l2 = f(e2), u2 = l2.exports;
        A[e2] = l2;
        let i2 = new o(l2, u2);
        try {
          n2(i2, l2, u2);
        } catch (e3) {
          throw l2.error = e3, e3;
        }
        return l2.namespaceObject && l2.exports !== l2.namespaceObject && m(l2.exports, l2.namespaceObject), l2;
      }
      function S(t2) {
        let r2;
        if (!Array.isArray(t2)) return e.registerChunk(void 0, t2);
        let n2 = function(e2) {
          if ("string" == typeof e2) return e2;
          if (e2) return { src: e2.getAttribute("src") };
          if ("u" > typeof TURBOPACK_NEXT_CHUNK_URLS) return { src: TURBOPACK_NEXT_CHUNK_URLS.pop() };
          throw Error("chunk path empty but not in a worker");
        }(t2[0]);
        return 2 === t2.length ? r2 = t2[1] : (r2 = void 0, !function(e2, t3) {
          let r3 = 1;
          for (; r3 < e2.length; ) {
            let n3, o2 = r3 + 1;
            for (; o2 < e2.length && "function" != typeof e2[o2]; ) o2++;
            if (o2 === e2.length) throw Error("malformed chunk format, expected a factory function");
            let l2 = e2[o2];
            for (let l3 = r3; l3 < o2; l3++) {
              let r4 = e2[l3], o3 = t3.get(r4);
              if (o3) {
                n3 = o3;
                break;
              }
            }
            let u2 = n3 ?? l2, i2 = false;
            for (let n4 = r3; n4 < o2; n4++) {
              let r4 = e2[n4];
              t3.has(r4) || (i2 || (u2 === l2 && Object.defineProperty(l2, "name", { value: "module evaluation" }), i2 = true), t3.set(r4, u2));
            }
            r3 = o2 + 1;
          }
        }(t2, R)), e.registerChunk(n2, r2);
      }
      function B(e2, t2, r2 = false) {
        let n2;
        try {
          n2 = t2();
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return !r2 || n2.__esModule ? n2 : m(n2, y(n2), true);
      }
      l.y = async function(e2) {
        let t2;
        try {
          t2 = await import(e2);
        } catch (t3) {
          throw Error(`Failed to load external module ${e2}: ${t3}`);
        }
        return t2 && t2.__esModule && t2.default && "default" in t2.default ? m(t2.default, y(t2), true) : t2;
      }, B.resolve = (e2, t2) => __require.resolve(e2, t2), l.x = B, e = { registerChunk(e2, t2) {
        if (null == e2) throw Error("inline entry registration is not supported");
        let r2 = function(e3) {
          if ("string" == typeof e3) return e3;
          let t3 = decodeURIComponent(e3.src.replace(/[?#].*$/, ""));
          return t3.startsWith(P) ? t3.slice(P.length) : t3;
        }(e2);
        q.add(r2), function(e3) {
          let t3 = I.get(e3);
          if (null != t3) {
            for (let r3 of t3) r3.requiredChunks.delete(e3), 0 === r3.requiredChunks.size && H(r3.runtimeModuleIds, r3.chunkPath);
            I.delete(e3);
          }
        }(r2), null != t2 && (0 === t2.otherChunks.length ? H(t2.runtimeModuleIds, r2) : function(e3, t3, r3) {
          let n2 = /* @__PURE__ */ new Set(), o2 = { runtimeModuleIds: r3, chunkPath: e3, requiredChunks: n2 };
          for (let e4 of t3) {
            let t4 = _(e4);
            if (q.has(t4)) continue;
            n2.add(t4);
            let r4 = I.get(t4);
            null == r4 && (r4 = /* @__PURE__ */ new Set(), I.set(t4, r4)), r4.add(o2);
          }
          0 === o2.requiredChunks.size && H(o2.runtimeModuleIds, o2.chunkPath);
        }(r2, t2.otherChunks.filter((e3) => function(e4) {
          let t3, r3 = e4.indexOf("?");
          if (-1 !== r3) t3 = r3;
          else {
            let r4 = e4.indexOf("#");
            t3 = -1 !== r4 ? r4 : e4.length;
          }
          return t3 >= 3 && e4.startsWith(".js", t3 - 3);
        }(_(e3))), t2.runtimeModuleIds));
      }, loadChunkCached(e2, t2) {
        throw Error("chunk loading is not supported");
      } };
      let q = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Map();
      function H(e2, t2) {
        for (let n2 of e2) !function(e3, t3) {
          let n3 = A[t3];
          if (n3) {
            if (n3.error) throw n3.error;
            return;
          }
          N(t3, r.Runtime, e3);
        }(t2, n2);
      }
      var L = globalThis.TURBOPACK;
      globalThis.TURBOPACK = { push: S }, L.forEach(S);
    })();
  }
});

// node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js
var edgeFunctionHandler_exports = {};
__export(edgeFunctionHandler_exports, {
  default: () => edgeFunctionHandler
});
async function edgeFunctionHandler(request) {
  const path3 = new URL(request.url).pathname;
  const routes = globalThis._ROUTES;
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(path3);
  } catch {
  }
  const correspondingRoute = routes.find((route) => route.regex.some((r) => {
    const regex = new RegExp(r);
    return regex.test(path3) || decodedPath !== void 0 && regex.test(decodedPath);
  }));
  if (!correspondingRoute) {
    throw new Error(`No route found for ${request.url}`);
  }
  const entry = await self._ENTRIES[`middleware_${correspondingRoute.name}`];
  const result = await entry.default({
    page: correspondingRoute.page,
    request: {
      ...request,
      page: {
        name: correspondingRoute.name
      }
    }
  });
  globalThis.__openNextAls.getStore()?.pendingPromiseRunner.add(result.waitUntil);
  const response = result.response;
  return response;
}
var init_edgeFunctionHandler = __esm({
  "node_modules/@opennextjs/aws/dist/core/edgeFunctionHandler.js"() {
    globalThis._ENTRIES = {};
    globalThis.self = globalThis;
    globalThis._ROUTES = [{ "name": "middleware", "page": "/", "regex": ["^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|.*\\.png$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$"] }];
    require_node_modules_next_dist_esm_build_templates_edge_wrapper_0_kjzx3();
    require_root_of_the_server_1xk24c3();
    require_turbopack_node_modules_next_dist_esm_build_templates_edge_wrapper_1b8jwmg();
  }
});

// node_modules/@opennextjs/aws/dist/utils/cacheHeaders.js
var CACHE_CONTROL_HEADER = "cache-control";
var OPEN_NEXT_CACHE_HEADER = "x-opennext-cache";
var CACHE_TAGS_HEADER = "x-next-cache-tags";
var ISR_HEADER = "x-isr";
var PRERENDER_REVALIDATE_HEADER = "x-prerender-revalidate";
var NO_STORE_CACHE_CONTROL = "private, no-cache, no-store, max-age=0, must-revalidate";
function fixCacheControlForError(headers, statusCode) {
  if (process.env.OPEN_NEXT_DANGEROUSLY_SET_ERROR_HEADERS === "true") {
    return;
  }
  if (statusCode === 404 || statusCode === 500) {
    headers[CACHE_CONTROL_HEADER] = NO_STORE_CACHE_CONTROL;
  }
}

// node_modules/@opennextjs/aws/dist/utils/promise.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/requestCache.js
var RequestCache = class {
  _caches = /* @__PURE__ */ new Map();
  /**
   * Returns the Map registered under `key`.
   * If no Map exists yet for that key, a new empty Map is created, stored, and returned.
   * Repeated calls with the same key always return the **same** Map instance.
   */
  getOrCreate(key) {
    let cache = this._caches.get(key);
    if (!cache) {
      cache = /* @__PURE__ */ new Map();
      this._caches.set(key, cache);
    }
    return cache;
  }
};

// node_modules/@opennextjs/aws/dist/utils/promise.js
var DetachedPromise = class {
  resolve;
  reject;
  promise;
  constructor() {
    let resolve;
    let reject;
    this.promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.resolve = resolve;
    this.reject = reject;
  }
};
var DetachedPromiseRunner = class {
  promises = [];
  withResolvers() {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    return detachedPromise;
  }
  add(promise) {
    const detachedPromise = new DetachedPromise();
    this.promises.push(detachedPromise);
    promise.then(detachedPromise.resolve, detachedPromise.reject);
  }
  async await() {
    debug(`Awaiting ${this.promises.length} detached promises`);
    const results = await Promise.allSettled(this.promises.map((p) => p.promise));
    const rejectedPromises = results.filter((r) => r.status === "rejected");
    rejectedPromises.forEach((r) => {
      error(r.reason);
    });
  }
};
async function awaitAllDetachedPromise() {
  const store = globalThis.__openNextAls.getStore();
  const promisesToAwait = store?.pendingPromiseRunner.await() ?? Promise.resolve();
  if (store?.waitUntil) {
    store.waitUntil(promisesToAwait);
    return;
  }
  await promisesToAwait;
}
function provideNextAfterProvider() {
  const NEXT_REQUEST_CONTEXT_SYMBOL = Symbol.for("@next/request-context");
  const VERCEL_REQUEST_CONTEXT_SYMBOL = Symbol.for("@vercel/request-context");
  const nextAfterContext = {
    get: () => {
      const store = globalThis.__openNextAls.getStore();
      return {
        waitUntil: store?.waitUntil ?? ((promise) => store?.pendingPromiseRunner.add(promise))
      };
    }
  };
  globalThis[NEXT_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  if (process.env.EMULATE_VERCEL_REQUEST_CONTEXT) {
    globalThis[VERCEL_REQUEST_CONTEXT_SYMBOL] = nextAfterContext;
  }
}
function runWithOpenNextRequestContext({ isISRRevalidation, waitUntil, requestId = Math.random().toString(36) }, fn) {
  return globalThis.__openNextAls.run({
    requestId,
    pendingPromiseRunner: new DetachedPromiseRunner(),
    isISRRevalidation,
    waitUntil,
    writtenTags: /* @__PURE__ */ new Set(),
    requestCache: new RequestCache()
  }, async () => {
    provideNextAfterProvider();
    let result;
    try {
      result = await fn();
    } finally {
      await awaitAllDetachedPromise();
    }
    return result;
  });
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/resolve.js
async function resolveConverter(converter2) {
  if (typeof converter2 === "function") {
    return converter2();
  }
  const m_1 = await Promise.resolve().then(() => (init_edge(), edge_exports));
  return m_1.default;
}
async function resolveWrapper(wrapper) {
  if (typeof wrapper === "function") {
    return wrapper();
  }
  const m_1 = await Promise.resolve().then(() => (init_cloudflare_edge(), cloudflare_edge_exports));
  return m_1.default;
}
async function resolveOriginResolver(originResolver) {
  if (typeof originResolver === "function") {
    return originResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_pattern_env(), pattern_env_exports));
  return m_1.default;
}
async function resolveAssetResolver(assetResolver) {
  if (typeof assetResolver === "function") {
    return assetResolver();
  }
  const m_1 = await Promise.resolve().then(() => (init_dummy(), dummy_exports));
  return m_1.default;
}
async function resolveProxyRequest(proxyRequest) {
  if (typeof proxyRequest === "function") {
    return proxyRequest();
  }
  const m_1 = await Promise.resolve().then(() => (init_fetch(), fetch_exports));
  return m_1.default;
}

// node_modules/@opennextjs/aws/dist/core/createGenericHandler.js
async function createGenericHandler(handler3) {
  const config = await import("./open-next.config.mjs").then((m) => m.default);
  globalThis.openNextConfig = config;
  const handlerConfig = config[handler3.type];
  const override = handlerConfig && "override" in handlerConfig ? handlerConfig.override : void 0;
  const converter2 = await resolveConverter(override?.converter);
  const { name, wrapper } = await resolveWrapper(override?.wrapper);
  debug("Using wrapper", name);
  return wrapper(handler3.handler, converter2);
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
import crypto2 from "node:crypto";
import { parse as parseQs, stringify as stringifyQs } from "node:querystring";

// node_modules/@opennextjs/aws/dist/adapters/config/index.js
init_logger();
import path from "node:path";
globalThis.__dirname ??= "";
var NEXT_DIR = path.join(__dirname, ".next");
var OPEN_NEXT_DIR = path.join(__dirname, ".open-next");
debug({ NEXT_DIR, OPEN_NEXT_DIR });
var NextConfig = { "env": {}, "webpack": null, "typescript": { "ignoreBuildErrors": false }, "typedRoutes": false, "distDir": ".next", "cleanDistDir": true, "assetPrefix": "", "cacheMaxMemorySize": 52428800, "configOrigin": "next.config.ts", "useFileSystemPublicRoutes": true, "generateEtags": true, "pageExtensions": ["tsx", "ts", "jsx", "js"], "instrumentationClientInject": [], "poweredByHeader": true, "compress": true, "images": { "deviceSizes": [640, 750, 828, 1080, 1200, 1920, 2048, 3840], "imageSizes": [32, 48, 64, 96, 128, 256, 384], "path": "/_next/image", "loader": "default", "loaderFile": "", "domains": [], "disableStaticImages": false, "minimumCacheTTL": 14400, "formats": ["image/webp"], "maximumRedirects": 3, "maximumResponseBody": 5e7, "dangerouslyAllowLocalIP": false, "dangerouslyAllowSVG": false, "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;", "contentDispositionType": "attachment", "localPatterns": [{ "pathname": "**", "search": "" }], "remotePatterns": [], "qualities": [75], "unoptimized": false, "customCacheHandler": false }, "devIndicators": { "position": "bottom-left" }, "onDemandEntries": { "maxInactiveAge": 6e4, "pagesBufferLength": 5 }, "basePath": "", "sassOptions": {}, "trailingSlash": false, "i18n": null, "productionBrowserSourceMaps": false, "excludeDefaultMomentLocales": true, "reactProductionProfiling": false, "reactStrictMode": null, "reactMaxHeadersLength": 6e3, "httpAgentOptions": { "keepAlive": true }, "logging": { "serverFunctions": true, "browserToTerminal": "warn" }, "compiler": {}, "expireTime": 31536e3, "staticPageGenerationTimeout": 60, "output": "standalone", "modularizeImports": { "@mui/icons-material": { "transform": "@mui/icons-material/{{member}}" }, "lodash": { "transform": "lodash/{{member}}" } }, "outputFileTracingRoot": "/Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow", "enablePrerenderSourceMaps": true, "cacheComponents": false, "cacheLife": { "default": { "stale": 300, "revalidate": 900, "expire": 4294967294 }, "seconds": { "stale": 30, "revalidate": 1, "expire": 60 }, "minutes": { "stale": 300, "revalidate": 60, "expire": 3600 }, "hours": { "stale": 300, "revalidate": 3600, "expire": 86400 }, "days": { "stale": 300, "revalidate": 86400, "expire": 604800 }, "weeks": { "stale": 300, "revalidate": 604800, "expire": 2592e3 }, "max": { "stale": 300, "revalidate": 2592e3, "expire": 31536e3 } }, "cacheHandlers": {}, "experimental": { "appNewScrollHandler": true, "coldCacheBadge": false, "devValidationWorker": true, "useSkewCookie": false, "cssChunking": true, "multiZoneDraftMode": false, "appNavFailHandling": false, "prerenderEarlyExit": true, "serverMinification": true, "linkNoTouchStart": false, "caseSensitiveRoutes": false, "cachedNavigations": false, "dynamicOnHover": false, "useOffline": false, "varyParams": true, "optimisticRouting": true, "instrumentationClientRouterTransitionEvents": false, "prefetchInlining": { "maxSize": 2048, "maxBundleSize": 10240 }, "preloadEntriesOnStart": true, "clientRouterFilter": true, "clientRouterFilterRedirects": false, "fetchCacheKeyPrefix": "", "proxyPrefetch": "flexible", "optimisticClientCache": true, "manualClientBasePath": false, "cpus": 7, "memoryBasedWorkersCount": false, "imgOptConcurrency": null, "imgOptOperationCache": null, "imgOptTimeoutInSeconds": 7, "imgOptMaxInputPixels": 268402689, "imgOptSequentialRead": null, "isrFlushToDisk": true, "workerThreads": false, "optimizeCss": false, "nextScriptWorkers": false, "scrollRestoration": false, "externalDir": false, "devMemoryThresholdRestart": true, "disableOptimizedLoading": false, "gzipSize": true, "craCompat": false, "esmExternals": true, "fullySpecified": false, "swcTraceProfiling": false, "forceSwcTransforms": false, "requestInsights": false, "largePageDataBytes": 128e3, "typedEnv": false, "parallelServerCompiles": false, "parallelServerBuildTraces": false, "ppr": false, "authInterrupts": false, "webpackMemoryOptimizations": false, "optimizeServerReact": true, "strictRouteTypes": false, "useTypeScriptCli": true, "removeUncaughtErrorAndRejectionListeners": false, "validateRSCRequestHeaders": true, "staleTimes": { "dynamic": 0, "static": 300 }, "reactDebugChannel": true, "serverComponentsHmrCache": true, "serverComponentsHmrCancellation": false, "staticGenerationMaxConcurrency": 8, "staticGenerationMinPagesPerWorker": 25, "transitionIndicator": false, "gestureTransition": false, "inlineCss": false, "useCache": false, "globalNotFound": false, "browserDebugInfoInTerminal": "warn", "lockDistDir": true, "proxyClientMaxBodySize": 10485760, "hideLogsAfterAbort": false, "mcpServer": true, "turbopackFileSystemCacheForDev": true, "turbopackFileSystemCacheForBuild": true, "turbopackInferModuleSideEffects": true, "turbopackPluginRuntimeStrategy": "childProcesses", "turbopackMemoryEvictionMode": "auto", "optimizePackageImports": ["lucide-react", "date-fns", "lodash-es", "ramda", "antd", "react-bootstrap", "ahooks", "@ant-design/icons", "@headlessui/react", "@headlessui-float/react", "@heroicons/react/20/solid", "@heroicons/react/24/solid", "@heroicons/react/24/outline", "@visx/visx", "@tremor/react", "rxjs", "@mui/material", "@mui/icons-material", "recharts", "react-use", "effect", "@effect/schema", "@effect/platform", "@effect/platform-node", "@effect/platform-browser", "@effect/platform-bun", "@effect/sql", "@effect/sql-mssql", "@effect/sql-mysql2", "@effect/sql-pg", "@effect/sql-sqlite-node", "@effect/sql-sqlite-bun", "@effect/sql-sqlite-wasm", "@effect/sql-sqlite-react-native", "@effect/rpc", "@effect/rpc-http", "@effect/typeclass", "@effect/experimental", "@effect/opentelemetry", "@material-ui/core", "@material-ui/icons", "@tabler/icons-react", "mui-core", "react-icons/ai", "react-icons/bi", "react-icons/bs", "react-icons/cg", "react-icons/ci", "react-icons/di", "react-icons/fa", "react-icons/fa6", "react-icons/fc", "react-icons/fi", "react-icons/gi", "react-icons/go", "react-icons/gr", "react-icons/hi", "react-icons/hi2", "react-icons/im", "react-icons/io", "react-icons/io5", "react-icons/lia", "react-icons/lib", "react-icons/lu", "react-icons/md", "react-icons/pi", "react-icons/ri", "react-icons/rx", "react-icons/si", "react-icons/sl", "react-icons/tb", "react-icons/tfi", "react-icons/ti", "react-icons/vsc", "react-icons/wi"], "useCacheTimeout": 54, "instantInsights": { "validationLevel": "warning" }, "trustHostHeader": false, "isExperimentalCompile": false }, "htmlLimitedBots": "[\\w-]+-Google|Google-[\\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight", "bundlePagesRouterDependencies": false, "configFileName": "next.config.ts", "reactCompiler": true, "repoRoot": "/Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow", "turbopack": { "root": "/Users/shahirfarhan/Desktop/archive/eventflow/trae_eventflow" }, "distDirRoot": ".next" };
var BuildId = "HaRR_7GW6S9CE6YxZ_SQb";
var RoutesManifest = { "basePath": "", "rewrites": { "beforeFiles": [], "afterFiles": [], "fallback": [] }, "redirects": [{ "source": "/:path+/", "destination": "/:path+", "internal": true, "priority": true, "statusCode": 308, "regex": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$" }], "routes": { "static": [{ "page": "/", "regex": "^/(?:/)?$", "routeKeys": {}, "namedRegex": "^/(?:/)?$" }, { "page": "/_global-error", "regex": "^/_global\\-error(?:/)?$", "routeKeys": {}, "namedRegex": "^/_global\\-error(?:/)?$" }, { "page": "/_not-found", "regex": "^/_not\\-found(?:/)?$", "routeKeys": {}, "namedRegex": "^/_not\\-found(?:/)?$" }, { "page": "/api/admin/stats", "regex": "^/api/admin/stats(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/admin/stats(?:/)?$" }, { "page": "/api/auth/register", "regex": "^/api/auth/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/auth/register(?:/)?$" }, { "page": "/api/bookings", "regex": "^/api/bookings(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/bookings(?:/)?$" }, { "page": "/api/messages", "regex": "^/api/messages(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/messages(?:/)?$" }, { "page": "/api/messages/thread", "regex": "^/api/messages/thread(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/messages/thread(?:/)?$" }, { "page": "/api/notifications", "regex": "^/api/notifications(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/notifications(?:/)?$" }, { "page": "/api/organizer/events", "regex": "^/api/organizer/events(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/organizer/events(?:/)?$" }, { "page": "/api/quotations", "regex": "^/api/quotations(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/quotations(?:/)?$" }, { "page": "/api/upload", "regex": "^/api/upload(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/upload(?:/)?$" }, { "page": "/api/vendor/availability", "regex": "^/api/vendor/availability(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/vendor/availability(?:/)?$" }, { "page": "/api/vendor/packages", "regex": "^/api/vendor/packages(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/vendor/packages(?:/)?$" }, { "page": "/api/vendor/profile", "regex": "^/api/vendor/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/vendor/profile(?:/)?$" }, { "page": "/api/vendor/services", "regex": "^/api/vendor/services(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/vendor/services(?:/)?$" }, { "page": "/api/vendors", "regex": "^/api/vendors(?:/)?$", "routeKeys": {}, "namedRegex": "^/api/vendors(?:/)?$" }, { "page": "/dashboard", "regex": "^/dashboard(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard(?:/)?$" }, { "page": "/dashboard/admin", "regex": "^/dashboard/admin(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/admin(?:/)?$" }, { "page": "/dashboard/bookings", "regex": "^/dashboard/bookings(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/bookings(?:/)?$" }, { "page": "/dashboard/calendar", "regex": "^/dashboard/calendar(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/calendar(?:/)?$" }, { "page": "/dashboard/events", "regex": "^/dashboard/events(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/events(?:/)?$" }, { "page": "/dashboard/events/new", "regex": "^/dashboard/events/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/events/new(?:/)?$" }, { "page": "/dashboard/profile", "regex": "^/dashboard/profile(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/profile(?:/)?$" }, { "page": "/dashboard/services", "regex": "^/dashboard/services(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/services(?:/)?$" }, { "page": "/dashboard/services/new", "regex": "^/dashboard/services/new(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/services/new(?:/)?$" }, { "page": "/dashboard/vendors", "regex": "^/dashboard/vendors(?:/)?$", "routeKeys": {}, "namedRegex": "^/dashboard/vendors(?:/)?$" }, { "page": "/login", "regex": "^/login(?:/)?$", "routeKeys": {}, "namedRegex": "^/login(?:/)?$" }, { "page": "/register", "regex": "^/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/register(?:/)?$" }, { "page": "/vendors", "regex": "^/vendors(?:/)?$", "routeKeys": {}, "namedRegex": "^/vendors(?:/)?$" }, { "page": "/vendors/register", "regex": "^/vendors/register(?:/)?$", "routeKeys": {}, "namedRegex": "^/vendors/register(?:/)?$" }], "dynamic": [{ "page": "/api/auth/[...nextauth]", "regex": "^/api/auth/(.+?)(?:/)?$", "routeKeys": { "nxtPnextauth": "nxtPnextauth" }, "namedRegex": "^/api/auth/(?<nxtPnextauth>.+?)(?:/)?$" }, { "page": "/api/bookings/[bookingId]", "regex": "^/api/bookings/([^/]+?)(?:/)?$", "routeKeys": { "nxtPbookingId": "nxtPbookingId" }, "namedRegex": "^/api/bookings/(?<nxtPbookingId>[^/]+?)(?:/)?$" }, { "page": "/api/bookings/[bookingId]/dispute", "regex": "^/api/bookings/([^/]+?)/dispute(?:/)?$", "routeKeys": { "nxtPbookingId": "nxtPbookingId" }, "namedRegex": "^/api/bookings/(?<nxtPbookingId>[^/]+?)/dispute(?:/)?$" }, { "page": "/api/bookings/[bookingId]/messages", "regex": "^/api/bookings/([^/]+?)/messages(?:/)?$", "routeKeys": { "nxtPbookingId": "nxtPbookingId" }, "namedRegex": "^/api/bookings/(?<nxtPbookingId>[^/]+?)/messages(?:/)?$" }, { "page": "/api/bookings/[bookingId]/provided", "regex": "^/api/bookings/([^/]+?)/provided(?:/)?$", "routeKeys": { "nxtPbookingId": "nxtPbookingId" }, "namedRegex": "^/api/bookings/(?<nxtPbookingId>[^/]+?)/provided(?:/)?$" }, { "page": "/api/notifications/[id]", "regex": "^/api/notifications/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/notifications/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/api/organizer/events/[eventId]", "regex": "^/api/organizer/events/([^/]+?)(?:/)?$", "routeKeys": { "nxtPeventId": "nxtPeventId" }, "namedRegex": "^/api/organizer/events/(?<nxtPeventId>[^/]+?)(?:/)?$" }, { "page": "/api/quotations/[id]/status", "regex": "^/api/quotations/([^/]+?)/status(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/api/quotations/(?<nxtPid>[^/]+?)/status(?:/)?$" }, { "page": "/api/vendor/packages/[packageId]", "regex": "^/api/vendor/packages/([^/]+?)(?:/)?$", "routeKeys": { "nxtPpackageId": "nxtPpackageId" }, "namedRegex": "^/api/vendor/packages/(?<nxtPpackageId>[^/]+?)(?:/)?$" }, { "page": "/api/vendor/packages/[packageId]/images", "regex": "^/api/vendor/packages/([^/]+?)/images(?:/)?$", "routeKeys": { "nxtPpackageId": "nxtPpackageId" }, "namedRegex": "^/api/vendor/packages/(?<nxtPpackageId>[^/]+?)/images(?:/)?$" }, { "page": "/api/vendor/services/[serviceId]", "regex": "^/api/vendor/services/([^/]+?)(?:/)?$", "routeKeys": { "nxtPserviceId": "nxtPserviceId" }, "namedRegex": "^/api/vendor/services/(?<nxtPserviceId>[^/]+?)(?:/)?$" }, { "page": "/api/vendor/services/[serviceId]/images", "regex": "^/api/vendor/services/([^/]+?)/images(?:/)?$", "routeKeys": { "nxtPserviceId": "nxtPserviceId" }, "namedRegex": "^/api/vendor/services/(?<nxtPserviceId>[^/]+?)/images(?:/)?$" }, { "page": "/api/vendors/[vendorId]/availability", "regex": "^/api/vendors/([^/]+?)/availability(?:/)?$", "routeKeys": { "nxtPvendorId": "nxtPvendorId" }, "namedRegex": "^/api/vendors/(?<nxtPvendorId>[^/]+?)/availability(?:/)?$" }, { "page": "/dashboard/events/[eventId]/edit", "regex": "^/dashboard/events/([^/]+?)/edit(?:/)?$", "routeKeys": { "nxtPeventId": "nxtPeventId" }, "namedRegex": "^/dashboard/events/(?<nxtPeventId>[^/]+?)/edit(?:/)?$" }, { "page": "/dashboard/vendors/[id]", "regex": "^/dashboard/vendors/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/dashboard/vendors/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/vendors/[id]", "regex": "^/vendors/([^/]+?)(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/vendors/(?<nxtPid>[^/]+?)(?:/)?$" }, { "page": "/vendors/[id]/book", "regex": "^/vendors/([^/]+?)/book(?:/)?$", "routeKeys": { "nxtPid": "nxtPid" }, "namedRegex": "^/vendors/(?<nxtPid>[^/]+?)/book(?:/)?$" }], "data": { "static": [], "dynamic": [] } }, "locales": [] };
var ConfigHeaders = [];
var PrerenderManifest = { "version": 4, "routes": { "/_global-error": { "routeType": "page", "response": "complete", "compute": "static", "htmlSize": 8745, "experimentalBypassFor": [{ "type": "header", "key": "next-action" }, { "type": "header", "key": "content-type", "value": "multipart/form-data;.*" }], "initialRevalidateSeconds": false, "srcRoute": "/_global-error", "dataRoute": "/_global-error.rsc", "allowHeader": ["host", "x-matched-path", "x-prerender-revalidate", "x-prerender-revalidate-if-generated", "x-next-revalidated-tags", "x-next-revalidate-tag-token"] } }, "dynamicRoutes": {}, "notFoundRoutes": [], "preview": { "previewModeId": "7173317797dac1b41e49030bbe76b4fa", "previewModeSigningKey": "93e20641505189f6d168f742b80abea32c5bb332ae094ad79f19be147f427296", "previewModeEncryptionKey": "5937064297f0cbf054dec39cb925a7bcb4eb593fcba7bb275e2757322310111c" } };
var MiddlewareManifest = { "version": 3, "middleware": { "/": { "files": ["server/edge/chunks/node_modules_next_dist_esm_build_templates_edge-wrapper_0_kjzx3.js", "server/edge/chunks/[root-of-the-server]__1xk24c3._.js", "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1b8jwmg.js"], "name": "middleware", "page": "/", "entrypoint": "server/edge/chunks/turbopack-node_modules_next_dist_esm_build_templates_edge-wrapper_1b8jwmg.js", "matchers": [{ "regexp": "^(?:\\/(_next\\/data\\/[^/]{1,}))?(?:\\/((?!api|_next\\/static|_next\\/image|.*\\.png$).*))(\\.json|\\.rsc|\\.segments\\/.+\\.segment\\.rsc)?[\\/#\\?]?$", "originalSource": "/((?!api|_next/static|_next/image|.*\\.png$).*)" }], "wasm": [], "assets": [], "env": { "__NEXT_BUILD_ID": "HaRR_7GW6S9CE6YxZ_SQb", "NEXT_SERVER_ACTIONS_ENCRYPTION_KEY": "dygEBBQ8e19KenxSfjjVqEEYluMxnPWTBepU4SPdIiU=", "__NEXT_PREVIEW_MODE_ID": "7173317797dac1b41e49030bbe76b4fa", "__NEXT_PREVIEW_MODE_ENCRYPTION_KEY": "5937064297f0cbf054dec39cb925a7bcb4eb593fcba7bb275e2757322310111c", "__NEXT_PREVIEW_MODE_SIGNING_KEY": "93e20641505189f6d168f742b80abea32c5bb332ae094ad79f19be147f427296" } } }, "sortedMiddleware": ["/"], "functions": {} };
var AppPathsManifest = { "/_global-error/page": "app/_global-error/page.js", "/_not-found/page": "app/_not-found/page.js", "/api/admin/stats/route": "app/api/admin/stats/route.js", "/api/auth/[...nextauth]/route": "app/api/auth/[...nextauth]/route.js", "/api/auth/register/route": "app/api/auth/register/route.js", "/api/bookings/[bookingId]/dispute/route": "app/api/bookings/[bookingId]/dispute/route.js", "/api/bookings/[bookingId]/messages/route": "app/api/bookings/[bookingId]/messages/route.js", "/api/bookings/[bookingId]/provided/route": "app/api/bookings/[bookingId]/provided/route.js", "/api/bookings/[bookingId]/route": "app/api/bookings/[bookingId]/route.js", "/api/bookings/route": "app/api/bookings/route.js", "/api/messages/route": "app/api/messages/route.js", "/api/messages/thread/route": "app/api/messages/thread/route.js", "/api/notifications/[id]/route": "app/api/notifications/[id]/route.js", "/api/notifications/route": "app/api/notifications/route.js", "/api/organizer/events/[eventId]/route": "app/api/organizer/events/[eventId]/route.js", "/api/organizer/events/route": "app/api/organizer/events/route.js", "/api/quotations/[id]/status/route": "app/api/quotations/[id]/status/route.js", "/api/quotations/route": "app/api/quotations/route.js", "/api/upload/route": "app/api/upload/route.js", "/api/vendor/availability/route": "app/api/vendor/availability/route.js", "/api/vendor/packages/[packageId]/images/route": "app/api/vendor/packages/[packageId]/images/route.js", "/api/vendor/packages/[packageId]/route": "app/api/vendor/packages/[packageId]/route.js", "/api/vendor/packages/route": "app/api/vendor/packages/route.js", "/api/vendor/profile/route": "app/api/vendor/profile/route.js", "/api/vendor/services/[serviceId]/images/route": "app/api/vendor/services/[serviceId]/images/route.js", "/api/vendor/services/[serviceId]/route": "app/api/vendor/services/[serviceId]/route.js", "/api/vendor/services/route": "app/api/vendor/services/route.js", "/api/vendors/[vendorId]/availability/route": "app/api/vendors/[vendorId]/availability/route.js", "/api/vendors/route": "app/api/vendors/route.js", "/dashboard/admin/page": "app/dashboard/admin/page.js", "/dashboard/bookings/page": "app/dashboard/bookings/page.js", "/dashboard/calendar/page": "app/dashboard/calendar/page.js", "/dashboard/events/[eventId]/edit/page": "app/dashboard/events/[eventId]/edit/page.js", "/dashboard/events/new/page": "app/dashboard/events/new/page.js", "/dashboard/events/page": "app/dashboard/events/page.js", "/dashboard/page": "app/dashboard/page.js", "/dashboard/profile/page": "app/dashboard/profile/page.js", "/dashboard/services/new/page": "app/dashboard/services/new/page.js", "/dashboard/services/page": "app/dashboard/services/page.js", "/dashboard/vendors/[id]/page": "app/dashboard/vendors/[id]/page.js", "/dashboard/vendors/page": "app/dashboard/vendors/page.js", "/login/page": "app/login/page.js", "/page": "app/page.js", "/register/page": "app/register/page.js", "/vendors/[id]/book/page": "app/vendors/[id]/book/page.js", "/vendors/[id]/page": "app/vendors/[id]/page.js", "/vendors/page": "app/vendors/page.js", "/vendors/register/page": "app/vendors/register/page.js" };
var AppPathRoutesManifest = { "/_global-error/page": "/_global-error", "/_not-found/page": "/_not-found", "/api/admin/stats/route": "/api/admin/stats", "/api/auth/[...nextauth]/route": "/api/auth/[...nextauth]", "/api/auth/register/route": "/api/auth/register", "/api/bookings/[bookingId]/dispute/route": "/api/bookings/[bookingId]/dispute", "/api/bookings/[bookingId]/messages/route": "/api/bookings/[bookingId]/messages", "/api/bookings/[bookingId]/provided/route": "/api/bookings/[bookingId]/provided", "/api/bookings/[bookingId]/route": "/api/bookings/[bookingId]", "/api/bookings/route": "/api/bookings", "/api/messages/route": "/api/messages", "/api/messages/thread/route": "/api/messages/thread", "/api/notifications/[id]/route": "/api/notifications/[id]", "/api/notifications/route": "/api/notifications", "/api/organizer/events/[eventId]/route": "/api/organizer/events/[eventId]", "/api/organizer/events/route": "/api/organizer/events", "/api/quotations/[id]/status/route": "/api/quotations/[id]/status", "/api/quotations/route": "/api/quotations", "/api/upload/route": "/api/upload", "/api/vendor/availability/route": "/api/vendor/availability", "/api/vendor/packages/[packageId]/images/route": "/api/vendor/packages/[packageId]/images", "/api/vendor/packages/[packageId]/route": "/api/vendor/packages/[packageId]", "/api/vendor/packages/route": "/api/vendor/packages", "/api/vendor/profile/route": "/api/vendor/profile", "/api/vendor/services/[serviceId]/images/route": "/api/vendor/services/[serviceId]/images", "/api/vendor/services/[serviceId]/route": "/api/vendor/services/[serviceId]", "/api/vendor/services/route": "/api/vendor/services", "/api/vendors/[vendorId]/availability/route": "/api/vendors/[vendorId]/availability", "/api/vendors/route": "/api/vendors", "/dashboard/admin/page": "/dashboard/admin", "/dashboard/bookings/page": "/dashboard/bookings", "/dashboard/calendar/page": "/dashboard/calendar", "/dashboard/events/[eventId]/edit/page": "/dashboard/events/[eventId]/edit", "/dashboard/events/new/page": "/dashboard/events/new", "/dashboard/events/page": "/dashboard/events", "/dashboard/page": "/dashboard", "/dashboard/profile/page": "/dashboard/profile", "/dashboard/services/new/page": "/dashboard/services/new", "/dashboard/services/page": "/dashboard/services", "/dashboard/vendors/[id]/page": "/dashboard/vendors/[id]", "/dashboard/vendors/page": "/dashboard/vendors", "/login/page": "/login", "/page": "/", "/register/page": "/register", "/vendors/[id]/book/page": "/vendors/[id]/book", "/vendors/[id]/page": "/vendors/[id]", "/vendors/page": "/vendors", "/vendors/register/page": "/vendors/register" };
var FunctionsConfigManifest = { "version": 1, "functions": { "/api/upload": { "maxDuration": 30 } } };
var PagesManifest = { "/500": "pages/500.html" };
process.env.NEXT_BUILD_ID = BuildId;
process.env.OPEN_NEXT_BUILD_ID = NextConfig.deploymentId ?? BuildId;
process.env.NEXT_PREVIEW_MODE_ID = PrerenderManifest?.preview?.previewModeId;

// node_modules/@opennextjs/aws/dist/http/openNextResponse.js
init_logger();
import { Transform } from "node:stream";
init_util();

// node_modules/@opennextjs/aws/dist/core/routing/util.js
init_util();
init_logger();
import { ReadableStream as ReadableStream3 } from "node:stream/web";

// node_modules/@opennextjs/aws/dist/utils/binary.js
var commonBinaryMimeTypes = /* @__PURE__ */ new Set([
  "application/octet-stream",
  // Docs
  "application/epub+zip",
  "application/msword",
  "application/pdf",
  "application/rtf",
  "application/vnd.amazon.ebook",
  "application/vnd.ms-excel",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // Fonts
  "font/otf",
  "font/woff",
  "font/woff2",
  // Images
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/vnd.microsoft.icon",
  "image/webp",
  // Audio
  "audio/3gpp",
  "audio/aac",
  "audio/basic",
  "audio/flac",
  "audio/mpeg",
  "audio/ogg",
  "audio/wavaudio/webm",
  "audio/x-aiff",
  "audio/x-midi",
  "audio/x-wav",
  // Video
  "video/3gpp",
  "video/mp2t",
  "video/mpeg",
  "video/ogg",
  "video/quicktime",
  "video/webm",
  "video/x-msvideo",
  // Archives
  "application/java-archive",
  "application/vnd.apple.installer+xml",
  "application/x-7z-compressed",
  "application/x-apple-diskimage",
  "application/x-bzip",
  "application/x-bzip2",
  "application/x-gzip",
  "application/x-java-archive",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-zip",
  "application/zip",
  // Serialized data
  "application/x-protobuf"
]);
function isBinaryContentType(contentType) {
  if (!contentType)
    return false;
  const value = contentType.split(";")[0];
  return commonBinaryMimeTypes.has(value);
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
init_stream();
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/i18n/accept-header.js
function parse(raw, preferences, options) {
  const lowers = /* @__PURE__ */ new Map();
  const header = raw.replace(/[ \t]/g, "");
  if (preferences) {
    let pos = 0;
    for (const preference of preferences) {
      const lower = preference.toLowerCase();
      lowers.set(lower, { orig: preference, pos: pos++ });
      if (options.prefixMatch) {
        const parts2 = lower.split("-");
        while (parts2.pop(), parts2.length > 0) {
          const joined = parts2.join("-");
          if (!lowers.has(joined)) {
            lowers.set(joined, { orig: preference, pos: pos++ });
          }
        }
      }
    }
  }
  const parts = header.split(",");
  const selections = [];
  const map = /* @__PURE__ */ new Set();
  for (let i = 0; i < parts.length; ++i) {
    const part = parts[i];
    if (!part) {
      continue;
    }
    const params = part.split(";");
    if (params.length > 2) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const token = params[0].toLowerCase();
    if (!token) {
      throw new Error(`Invalid ${options.type} header`);
    }
    const selection = { token, pos: i, q: 1 };
    if (preferences && lowers.has(token)) {
      selection.pref = lowers.get(token).pos;
    }
    map.add(selection.token);
    if (params.length === 2) {
      const q = params[1];
      const [key, value] = q.split("=");
      if (!value || key !== "q" && key !== "Q") {
        throw new Error(`Invalid ${options.type} header`);
      }
      const score = Number.parseFloat(value);
      if (score === 0) {
        continue;
      }
      if (Number.isFinite(score) && score <= 1 && score >= 1e-3) {
        selection.q = score;
      }
    }
    selections.push(selection);
  }
  selections.sort((a, b) => {
    if (b.q !== a.q) {
      return b.q - a.q;
    }
    if (b.pref !== a.pref) {
      if (a.pref === void 0) {
        return 1;
      }
      if (b.pref === void 0) {
        return -1;
      }
      return a.pref - b.pref;
    }
    return a.pos - b.pos;
  });
  const values = selections.map((selection) => selection.token);
  if (!preferences || !preferences.length) {
    return values;
  }
  const preferred = [];
  for (const selection of values) {
    if (selection === "*") {
      for (const [preference, value] of lowers) {
        if (!map.has(preference)) {
          preferred.push(value.orig);
        }
      }
    } else {
      const lower = selection.toLowerCase();
      if (lowers.has(lower)) {
        preferred.push(lowers.get(lower).orig);
      }
    }
  }
  return preferred;
}
function acceptLanguage(header = "", preferences) {
  return parse(header, preferences, {
    type: "accept-language",
    prefixMatch: true
  })[0] || void 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/i18n/index.js
function isLocalizedPath(path3) {
  return NextConfig.i18n?.locales.includes(path3.split("/")[1].toLowerCase()) ?? false;
}
function getLocaleFromCookie(cookies) {
  const i18n = NextConfig.i18n;
  const nextLocale = cookies.NEXT_LOCALE?.toLowerCase();
  return nextLocale ? i18n?.locales.find((locale) => nextLocale === locale.toLowerCase()) : void 0;
}
function detectDomainLocale({ hostname, detectedLocale }) {
  const i18n = NextConfig.i18n;
  const domains = i18n?.domains;
  if (!domains) {
    return;
  }
  const lowercasedLocale = detectedLocale?.toLowerCase();
  for (const domain of domains) {
    const domainHostname = domain.domain.split(":", 1)[0].toLowerCase();
    if (hostname === domainHostname || lowercasedLocale === domain.defaultLocale.toLowerCase() || domain.locales?.some((locale) => lowercasedLocale === locale.toLowerCase())) {
      return domain;
    }
  }
}
function detectLocale(internalEvent, i18n) {
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  if (i18n.localeDetection === false) {
    return domainLocale?.defaultLocale ?? i18n.defaultLocale;
  }
  const cookiesLocale = getLocaleFromCookie(internalEvent.cookies);
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  debug({
    cookiesLocale,
    preferredLocale,
    defaultLocale: i18n.defaultLocale,
    domainLocale
  });
  return domainLocale?.defaultLocale ?? cookiesLocale ?? preferredLocale ?? i18n.defaultLocale;
}
function localizePath(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n) {
    return internalEvent.rawPath;
  }
  if (isLocalizedPath(internalEvent.rawPath)) {
    return internalEvent.rawPath;
  }
  const detectedLocale = detectLocale(internalEvent, i18n);
  return `/${detectedLocale}${internalEvent.rawPath}`;
}
function handleLocaleRedirect(internalEvent) {
  const i18n = NextConfig.i18n;
  if (!i18n || i18n.localeDetection === false || internalEvent.rawPath !== "/") {
    return false;
  }
  const preferredLocale = acceptLanguage(internalEvent.headers["accept-language"], i18n?.locales);
  const detectedLocale = detectLocale(internalEvent, i18n);
  const domainLocale = detectDomainLocale({
    hostname: internalEvent.headers.host
  });
  const preferredDomain = detectDomainLocale({
    detectedLocale: preferredLocale
  });
  if (domainLocale && preferredDomain) {
    const isPDomain = preferredDomain.domain === domainLocale.domain;
    const isPLocale = preferredDomain.defaultLocale === preferredLocale;
    if (!isPDomain || !isPLocale) {
      const scheme = `http${preferredDomain.http ? "" : "s"}`;
      const rlocale = isPLocale ? "" : preferredLocale;
      return {
        type: "core",
        statusCode: 307,
        headers: {
          Location: `${scheme}://${preferredDomain.domain}/${rlocale}`
        },
        body: emptyReadableStream(),
        isBase64Encoded: false
      };
    }
  }
  const defaultLocale = domainLocale?.defaultLocale ?? i18n.defaultLocale;
  if (detectedLocale.toLowerCase() !== defaultLocale.toLowerCase()) {
    const nextUrl = constructNextUrl(internalEvent.url, `/${detectedLocale}${NextConfig.trailingSlash ? "/" : ""}`);
    const queryString = convertToQueryString(internalEvent.query);
    return {
      type: "core",
      statusCode: 307,
      headers: {
        Location: `${nextUrl}${queryString}`
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}

// node_modules/@opennextjs/aws/dist/core/routing/queue.js
function generateShardId(rawPath, maxConcurrency, prefix) {
  let a = cyrb128(rawPath);
  let t = a += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  const randomFloat = ((t ^ t >>> 14) >>> 0) / 4294967296;
  const randomInt = Math.floor(randomFloat * maxConcurrency);
  return `${prefix}-${randomInt}`;
}
function generateMessageGroupId(rawPath) {
  const maxConcurrency = Number.parseInt(process.env.MAX_REVALIDATE_CONCURRENCY ?? "10");
  return generateShardId(rawPath, maxConcurrency, "revalidate");
}
function cyrb128(str) {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ h1 >>> 18, 597399067);
  h2 = Math.imul(h4 ^ h2 >>> 22, 2869860233);
  h3 = Math.imul(h1 ^ h3 >>> 17, 951274213);
  h4 = Math.imul(h2 ^ h4 >>> 19, 2716044179);
  h1 ^= h2 ^ h3 ^ h4, h2 ^= h1, h3 ^= h1, h4 ^= h1;
  return h1 >>> 0;
}

// node_modules/@opennextjs/aws/dist/core/routing/util.js
function isExternal(url, host) {
  if (!url)
    return false;
  const pattern = /^https?:\/\//;
  if (!pattern.test(url))
    return false;
  if (host) {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.host !== host;
    } catch {
      return !url.includes(host);
    }
  }
  return true;
}
function convertFromQueryString(query) {
  if (query === "")
    return {};
  const queryParts = query.split("&");
  return getQueryFromIterator(queryParts.map((p) => {
    const [key, value] = p.split("=");
    return [key, value];
  }));
}
function getUrlParts(url, isExternal2) {
  if (!isExternal2) {
    const regex2 = /\/([^?]*)\??(.*)/;
    const match3 = url.match(regex2);
    return {
      hostname: "",
      pathname: url.startsWith("/") ? `/${match3?.[1] ?? ""}` : "",
      protocol: "",
      queryString: match3?.[2] ?? ""
    };
  }
  const regex = /^(https?:)\/\/?([^\/\s?]+)(\/[^?]*)?(\?.*)?/;
  const match2 = url.match(regex);
  if (!match2) {
    throw new Error(`Invalid external URL: ${url}`);
  }
  return {
    protocol: match2[1] ?? "https:",
    hostname: match2[2],
    pathname: match2[3] ?? "",
    queryString: match2[4]?.slice(1) ?? ""
  };
}
function constructNextUrl(baseUrl, path3) {
  const nextBasePath = NextConfig.basePath ?? "";
  const url = new URL(`${nextBasePath}${path3}`, baseUrl);
  return url.href;
}
function convertToQueryString(query) {
  const queryStrings = [];
  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => queryStrings.push(`${key}=${entry}`));
    } else {
      queryStrings.push(`${key}=${value}`);
    }
  });
  return queryStrings.length > 0 ? `?${queryStrings.join("&")}` : "";
}
function getMiddlewareMatch(middlewareManifest2, functionsManifest) {
  if (functionsManifest?.functions?.["/_middleware"]) {
    return functionsManifest.functions["/_middleware"].matchers?.map(({ regexp }) => new RegExp(regexp)) ?? [/.*/];
  }
  const rootMiddleware = middlewareManifest2.middleware["/"];
  if (!rootMiddleware?.matchers)
    return [];
  return rootMiddleware.matchers.map(({ regexp }) => new RegExp(regexp));
}
function escapeRegex(str, { isPath } = {}) {
  const result = str.replaceAll("(.)", "_\xB51_").replaceAll("(..)", "_\xB52_").replaceAll("(...)", "_\xB53_");
  return isPath ? result : result.replaceAll("+", "_\xB54_");
}
function unescapeRegex(str) {
  return str.replaceAll("_\xB51_", "(.)").replaceAll("_\xB52_", "(..)").replaceAll("_\xB53_", "(...)").replaceAll("_\xB54_", "+");
}
function convertBodyToReadableStream(method, body) {
  if (method === "GET" || method === "HEAD")
    return void 0;
  if (!body)
    return void 0;
  return new ReadableStream3({
    start(controller) {
      controller.enqueue(body);
      controller.close();
    }
  });
}
function normalizeLocationHeader(location, baseUrl, encodeQuery = false) {
  if (!URL.canParse(location)) {
    return location;
  }
  const locationURL = new URL(location);
  const origin = new URL(baseUrl).origin;
  let search = locationURL.search;
  if (encodeQuery && search) {
    search = `?${stringifyQs(parseQs(search.slice(1)))}`;
  }
  const href = `${locationURL.origin}${locationURL.pathname}${search}${locationURL.hash}`;
  if (locationURL.origin === origin) {
    return href.slice(origin.length);
  }
  return href;
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
import { createHash as createHash2 } from "node:crypto";
init_stream();

// node_modules/@opennextjs/aws/dist/utils/cache.js
init_logger();

// node_modules/@opennextjs/aws/dist/utils/semver.js
function compareSemver(v1, operator, v2) {
  let versionDiff = 0;
  if (v1 === "latest") {
    versionDiff = 1;
  } else {
    if (/^[^\d]/.test(v1)) {
      v1 = v1.substring(1);
    }
    if (/^[^\d]/.test(v2)) {
      v2 = v2.substring(1);
    }
    const [major1, minor1 = 0, patch1 = 0] = v1.split(".").map(Number);
    const [major2, minor2 = 0, patch2 = 0] = v2.split(".").map(Number);
    if (Number.isNaN(major1) || Number.isNaN(major2)) {
      throw new Error("The major version is required.");
    }
    if (major1 !== major2) {
      versionDiff = major1 - major2;
    } else if (minor1 !== minor2) {
      versionDiff = minor1 - minor2;
    } else if (patch1 !== patch2) {
      versionDiff = patch1 - patch2;
    }
  }
  switch (operator) {
    case "=":
      return versionDiff === 0;
    case ">=":
      return versionDiff >= 0;
    case "<=":
      return versionDiff <= 0;
    case ">":
      return versionDiff > 0;
    case "<":
      return versionDiff < 0;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

// node_modules/@opennextjs/aws/dist/utils/cache.js
async function isStale(key, tags, lastModified) {
  if (!compareSemver(globalThis.nextVersion, ">=", "16.0.0")) {
    return false;
  }
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.isStale?.(tags, lastModified) ?? false;
  }
  return await globalThis.tagCache.isStale?.(key, lastModified) ?? false;
}
async function hasBeenRevalidated(key, tags, cacheEntry) {
  if (globalThis.openNextConfig.dangerous?.disableTagCache) {
    return false;
  }
  const value = cacheEntry.value;
  if (!value) {
    return true;
  }
  if ("type" in cacheEntry && cacheEntry.type === "page") {
    return false;
  }
  const lastModified = cacheEntry.lastModified ?? Date.now();
  if (globalThis.tagCache.mode === "nextMode") {
    return tags.length === 0 ? false : await globalThis.tagCache.hasBeenRevalidated(tags, lastModified);
  }
  const _lastModified = await globalThis.tagCache.getLastModified(key, lastModified);
  return _lastModified === -1;
}
function getTagsFromValue(value) {
  if (!value) {
    return [];
  }
  try {
    const cacheTags = value.meta?.headers?.[CACHE_TAGS_HEADER]?.split(",") ?? [];
    delete value.meta?.headers?.[CACHE_TAGS_HEADER];
    return cacheTags;
  } catch (e) {
    return [];
  }
}

// node_modules/@opennextjs/aws/dist/utils/routeCacheKey.js
import { createHash } from "node:crypto";
var ROUTE_CACHE_DIRECTORY = "route-cache";
var DYNAMIC_ROUTE_REGEX = /\/\[[^/]+?\](?=\/|$)/;
function useRouteCacheKeys(nextVersion) {
  return compareSemver(nextVersion, ">=", "15.5.27") && compareSemver(nextVersion, "<", "16.0.0") || compareSemver(nextVersion, ">=", "16.3.8");
}
function normalizePagePath(page) {
  if (/^\/index(\/|$)/.test(page) && !DYNAMIC_ROUTE_REGEX.test(page)) {
    return `/index${page}`;
  }
  if (page === "/") {
    return "/index";
  }
  return page.startsWith("/") ? page : `/${page}`;
}
function normalizeAppPath(entry) {
  const pathname = entry.split("/").reduce((acc, segment, index, segments) => {
    if (!segment)
      return acc;
    if (segment.startsWith("(") && segment.endsWith(")"))
      return acc;
    if (segment.startsWith("@"))
      return acc;
    if ((segment === "page" || segment === "route") && index === segments.length - 1) {
      return acc;
    }
    return `${acc}/${segment}`;
  }, "");
  return pathname === "" ? "/" : pathname;
}
function compareAppPaths(a, b) {
  const aHasSlot = a.includes("/@");
  const bHasSlot = b.includes("/@");
  if (aHasSlot && !bHasSlot)
    return -1;
  if (!aHasSlot && bHasSlot)
    return 1;
  return a.localeCompare(b);
}
function selectAppPageEntry(route, appPaths) {
  let entry;
  for (const appPath of appPaths) {
    if (normalizeAppPath(appPath).replace(/%5F/g, "_") !== route)
      continue;
    if (entry === void 0 || compareAppPaths(entry, appPath) < 0) {
      entry = appPath;
    }
  }
  return entry;
}
function getRouteCacheOwner(sourceRoute, { appPaths, pagesManifest }) {
  const appEntry = selectAppPageEntry(sourceRoute, appPaths);
  if (appEntry) {
    return {
      kind: appEntry.endsWith("/route") ? "APP_ROUTE" : "APP_PAGE",
      sourceRoute: appEntry
    };
  }
  if (Object.hasOwn(pagesManifest, sourceRoute)) {
    return { kind: "PAGES", sourceRoute };
  }
  return void 0;
}
function normalizeLocalePath(pathname, locales) {
  const segment = pathname.split("/", 2)[1]?.toLowerCase();
  const locale = locales?.find((l) => l.toLowerCase() === segment);
  if (!locale) {
    return pathname;
  }
  return pathname.slice(locale.length + 1) || "/";
}
function getDynamicRouteCachePathname(pathname, locales) {
  if (normalizeLocalePath(pathname, locales) !== "/index") {
    return pathname;
  }
  return pathname.slice(0, -"/index".length) || "/";
}
function getPrerenderRouteCacheKey(pathname, manifests) {
  const { routes, dynamicRoutes } = manifests.prerenderManifest;
  const prerender = Object.hasOwn(routes, pathname) ? routes[pathname] : void 0;
  const fallback = !prerender && Object.hasOwn(dynamicRoutes, pathname) ? dynamicRoutes[pathname] : void 0;
  if (!prerender && !fallback) {
    return void 0;
  }
  const sourceRoute = prerender ? prerender.srcRoute : fallback?.fallbackSourceRoute ?? pathname;
  let owner;
  if (sourceRoute) {
    owner = getRouteCacheOwner(sourceRoute, manifests);
  } else {
    owner = getRouteCacheOwner(pathname, manifests);
    if (!owner && manifests.locales?.length) {
      const pagesOwner = getRouteCacheOwner(normalizeLocalePath(pathname, manifests.locales), manifests);
      owner = pagesOwner?.kind === "PAGES" ? pagesOwner : void 0;
    }
  }
  return owner ? getRouteCacheKey(pathname, owner) : void 0;
}
function getRouteCacheKey(pathname, owner) {
  const source = createHash("sha256").update(owner.sourceRoute).digest("hex");
  return `/${ROUTE_CACHE_DIRECTORY}/${owner.kind}/${source}/$${normalizePagePath(pathname)}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
init_logger();

// node_modules/@opennextjs/aws/dist/core/routing/routeMatcher.js
var optionalLocalePrefixRegex = `^/(?:${RoutesManifest.locales.map((locale) => `${locale}/?`).join("|")})?`;
var optionalBasepathPrefixRegex = RoutesManifest.basePath ? `^${RoutesManifest.basePath}/?` : "^/";
var optionalPrefix = optionalLocalePrefixRegex.replace("^/", optionalBasepathPrefixRegex);
function routeMatcher(routeDefinitions) {
  const regexp = routeDefinitions.map((route) => ({
    page: route.page,
    regexp: new RegExp(route.regex.replace("^/", optionalPrefix))
  }));
  const appPathsSet = /* @__PURE__ */ new Set();
  const routePathsSet = /* @__PURE__ */ new Set();
  for (const [k, v] of Object.entries(AppPathRoutesManifest)) {
    if (k.endsWith("page")) {
      appPathsSet.add(v);
    } else if (k.endsWith("route")) {
      routePathsSet.add(v);
    }
  }
  return function matchRoute(path3) {
    const foundRoutes = regexp.filter((route) => route.regexp.test(path3));
    return foundRoutes.map((foundRoute) => {
      let routeType = "page";
      if (appPathsSet.has(foundRoute.page)) {
        routeType = "app";
      } else if (routePathsSet.has(foundRoute.page)) {
        routeType = "route";
      }
      return {
        route: foundRoute.page,
        type: routeType
      };
    });
  };
}
var staticRouteMatcher = routeMatcher([
  ...RoutesManifest.routes.static,
  ...getStaticAPIRoutes()
]);
var dynamicRouteMatcher = routeMatcher(RoutesManifest.routes.dynamic);
function getStaticAPIRoutes() {
  const createRouteDefinition = (route) => ({
    page: route,
    regex: `^${route}(?:/)?$`
  });
  const dynamicRoutePages = new Set(RoutesManifest.routes.dynamic.map(({ page }) => page));
  const pagesStaticAPIRoutes = Object.keys(PagesManifest).filter((route) => route.startsWith("/api/") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  const appPathsStaticAPIRoutes = Object.values(AppPathRoutesManifest).filter((route) => (route.startsWith("/api/") || route === "/api") && !dynamicRoutePages.has(route)).map(createRouteDefinition);
  return [...pagesStaticAPIRoutes, ...appPathsStaticAPIRoutes];
}

// node_modules/@opennextjs/aws/dist/core/routing/cacheInterceptor.js
var CACHE_ONE_YEAR = 60 * 60 * 24 * 365;
var CACHE_ONE_MONTH = 60 * 60 * 24 * 30;
var VARY_HEADER = "RSC, Next-Router-State-Tree, Next-Router-Prefetch, Next-Router-Segment-Prefetch, Next-Url";
var NEXT_SEGMENT_PREFETCH_HEADER = "next-router-segment-prefetch";
var NEXT_PRERENDER_HEADER = "x-nextjs-prerender";
var NEXT_POSTPONED_HEADER = "x-nextjs-postponed";
async function computeCacheControl(path3, body, host, revalidate, lastModified, isStaleFromTagCache = false, revalidationPath = path3, revalidationKey = path3) {
  let finalRevalidate = CACHE_ONE_YEAR;
  const existingRoute = Object.entries(PrerenderManifest?.routes ?? {}).find((p) => p[0] === path3)?.[1];
  if (revalidate === void 0 && existingRoute) {
    finalRevalidate = existingRoute.initialRevalidateSeconds === false ? CACHE_ONE_YEAR : existingRoute.initialRevalidateSeconds;
  } else if (revalidate !== void 0) {
    finalRevalidate = revalidate === false ? CACHE_ONE_YEAR : revalidate;
  }
  const age = Math.round((Date.now() - (lastModified ?? 0)) / 1e3);
  const hash = (str) => createHash2("md5").update(str).digest("hex");
  const etag = `"${hash(body)}"`;
  if (revalidate === 0) {
    return {
      [CACHE_CONTROL_HEADER]: NO_STORE_CACHE_CONTROL,
      [OPEN_NEXT_CACHE_HEADER]: "ERROR",
      etag
    };
  }
  const isSSG = finalRevalidate === CACHE_ONE_YEAR;
  const remainingTtl = Math.max(finalRevalidate - age, 1);
  const isStaleFromTime = !isSSG && remainingTtl === 1;
  const isStale2 = isStaleFromTime || isStaleFromTagCache;
  if (!isSSG || isStaleFromTagCache) {
    const sMaxAge = isStaleFromTagCache ? 1 : remainingTtl;
    debug("sMaxAge", {
      finalRevalidate,
      age,
      lastModified,
      revalidate,
      isStaleFromTagCache
    });
    if (isStale2) {
      let url = NextConfig.trailingSlash && revalidationPath !== "/" ? `${revalidationPath}/` : revalidationPath;
      if (NextConfig.basePath) {
        url = `${NextConfig.basePath}${url}`;
      }
      await globalThis.queue.send({
        MessageBody: {
          host,
          url,
          eTag: etag,
          lastModified: lastModified ?? Date.now()
        },
        MessageDeduplicationId: hash(`${revalidationKey}-${lastModified}-${etag}`),
        MessageGroupId: generateMessageGroupId(revalidationKey)
      });
    }
    return {
      [CACHE_CONTROL_HEADER]: `s-maxage=${sMaxAge}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
      [OPEN_NEXT_CACHE_HEADER]: isStale2 ? "STALE" : "HIT",
      etag
    };
  }
  return {
    [CACHE_CONTROL_HEADER]: `s-maxage=${CACHE_ONE_YEAR}, stale-while-revalidate=${CACHE_ONE_MONTH}`,
    [OPEN_NEXT_CACHE_HEADER]: "HIT",
    etag
  };
}
function getBodyForAppRouter(event, cachedValue) {
  if (cachedValue.type !== "app") {
    throw new Error("getBodyForAppRouter called with non-app cache value");
  }
  const segmentHeader = event.headers[NEXT_SEGMENT_PREFETCH_HEADER];
  if (typeof segmentHeader === "string" && cachedValue.segmentData) {
    if (Object.hasOwn(cachedValue.segmentData, segmentHeader)) {
      return {
        body: cachedValue.segmentData[segmentHeader],
        additionalHeaders: {
          [NEXT_PRERENDER_HEADER]: "1",
          [NEXT_POSTPONED_HEADER]: "2"
        }
      };
    }
    return void 0;
  }
  if (cachedValue.rsc === void 0) {
    return void 0;
  }
  return { body: cachedValue.rsc, additionalHeaders: {} };
}
async function generateResult(event, localizedPath, cachedValue, lastModified, isStaleFromTagCache = false, cacheKey = localizedPath, revalidationPath = localizedPath) {
  debug("Returning result from experimental cache");
  let body;
  let type = "application/octet-stream";
  let isDataRequest = false;
  let additionalHeaders = {};
  if (cachedValue.type === "app") {
    isDataRequest = event.headers.rsc === "1";
    if (isDataRequest) {
      const appRouterResult = getBodyForAppRouter(event, cachedValue);
      body = appRouterResult?.body;
      additionalHeaders = appRouterResult?.additionalHeaders ?? {};
    } else {
      body = cachedValue.html;
    }
    type = isDataRequest ? "text/x-component" : "text/html; charset=utf-8";
  } else if (cachedValue.type === "page") {
    isDataRequest = Boolean(event.query.__nextDataReq);
    body = isDataRequest ? JSON.stringify(cachedValue.json) : cachedValue.html;
    type = isDataRequest ? "application/json" : "text/html; charset=utf-8";
  } else {
    throw new Error("generateResult called with unsupported cache value type, only 'app' and 'page' are supported");
  }
  if (body === void 0) {
    debug("Missing body in the cache entry, falling back to the server");
    return void 0;
  }
  const cacheControl = await computeCacheControl(localizedPath, body, event.headers.host, cachedValue.revalidate, lastModified, isStaleFromTagCache, revalidationPath, cacheKey);
  const statusCode = computeStatusCode(event.rewriteStatusCode, cachedValue.meta?.status);
  const headers = {
    ...cacheControl,
    "content-type": type,
    ...cachedValue.meta?.headers,
    vary: VARY_HEADER,
    ...additionalHeaders
  };
  fixCacheControlForError(headers, statusCode);
  return {
    type: "core",
    statusCode,
    body: toReadableStream(body, false),
    isBase64Encoded: false,
    headers
  };
}
function computeStatusCode(rewriteStatusCode, cachedStatusCode) {
  if (cachedStatusCode !== void 0 && cachedStatusCode !== 200) {
    return cachedStatusCode;
  }
  return rewriteStatusCode ?? cachedStatusCode ?? 200;
}
function escapePathDelimiters(segment, escapeEncoded) {
  return segment.replace(new RegExp(`([/#?]${escapeEncoded ? "|%(2f|23|3f|5c)" : ""})`, "gi"), (char) => encodeURIComponent(char));
}
function decodePathParams(pathname) {
  return pathname.split("/").map((segment) => escapePathDelimiters(decodeURIComponent(segment), true)).join("/");
}
var routeCacheManifests;
function getRouteCacheManifests() {
  routeCacheManifests ??= {
    prerenderManifest: {
      routes: PrerenderManifest?.routes ?? {},
      dynamicRoutes: PrerenderManifest?.dynamicRoutes ?? {}
    },
    appPaths: Object.keys(AppPathsManifest ?? {}),
    pagesManifest: PagesManifest ?? {},
    locales: NextConfig.i18n?.locales
  };
  return routeCacheManifests;
}
function getCacheKey(event, localizedPath, resolvedRoutes) {
  if (!useRouteCacheKeys(globalThis.nextVersion)) {
    const isISR = Object.keys(PrerenderManifest?.routes ?? {}).includes(localizedPath) || Object.values(PrerenderManifest?.dynamicRoutes ?? {}).some((dr) => new RegExp(dr.routeRegex).test(localizedPath));
    if (!isISR)
      return void 0;
    return localizedPath === "/" ? "/index" : localizedPath;
  }
  const manifests = getRouteCacheManifests();
  if (Object.hasOwn(manifests.prerenderManifest.routes, localizedPath)) {
    const manifestKey = getPrerenderRouteCacheKey(localizedPath, manifests);
    const selectedRoute = resolvedRoutes?.[0];
    if (resolvedRoutes && !selectedRoute)
      return void 0;
    if (!selectedRoute)
      return manifestKey;
    const selectedOwner = getRouteCacheOwner(selectedRoute.route, manifests);
    if (!selectedOwner)
      return void 0;
    const selectedKey = getRouteCacheKey(localizedPath, selectedOwner);
    return selectedKey === manifestKey ? manifestKey : void 0;
  }
  const dynamicRoute = resolvedRoutes ? resolvedRoutes[0] : dynamicRouteMatcher(event.rawPath)[0];
  const dynamicPrerender = dynamicRoute ? manifests.prerenderManifest.dynamicRoutes[dynamicRoute.route] : void 0;
  if (!dynamicRoute || !dynamicPrerender || dynamicPrerender.fallback !== null) {
    return void 0;
  }
  const owner = getRouteCacheOwner(dynamicRoute.route, manifests);
  return owner ? getRouteCacheKey(getDynamicRouteCachePathname(localizedPath, manifests.locales), owner) : void 0;
}
async function cacheInterceptor(event, resolvedRoutes) {
  if (Boolean(event.headers["next-action"]) || Boolean(event.headers[PRERENDER_REVALIDATE_HEADER]))
    return event;
  if (event.method !== "GET" && event.method !== "HEAD")
    return event;
  const cookies = event.headers.cookie || "";
  const hasPreviewData = cookies.includes("__prerender_bypass") || cookies.includes("__next_preview_data");
  if (hasPreviewData) {
    debug("Preview mode detected, passing through to handler");
    return event;
  }
  const basePath = NextConfig.basePath;
  const pathWithoutBasePath = !basePath ? event.rawPath : event.rawPath === basePath ? "/" : event.rawPath.startsWith(`${basePath}/`) ? event.rawPath.slice(basePath.length) : event.rawPath;
  let localizedPath = localizePath({ ...event, rawPath: pathWithoutBasePath });
  localizedPath = localizedPath.replace(/\/$/, "");
  const revalidationPath = localizedPath || "/";
  try {
    localizedPath = decodePathParams(localizedPath) || "/";
  } catch {
    return event;
  }
  debug("Checking cache for", localizedPath, PrerenderManifest);
  const cacheKey = getCacheKey(event, localizedPath, resolvedRoutes);
  debug("cacheKey", cacheKey);
  if (cacheKey) {
    try {
      const cachedData = await globalThis.incrementalCache.get(cacheKey);
      debug("cached data in interceptor", cachedData);
      if (!cachedData?.value) {
        return event;
      }
      const tags = getTagsFromValue(cachedData.value);
      if (cachedData.value?.type === "app" || cachedData.value?.type === "route") {
        const _hasBeenRevalidated = cachedData.shouldBypassTagCache ? false : await hasBeenRevalidated(cacheKey, tags, cachedData);
        if (_hasBeenRevalidated) {
          return event;
        }
      }
      const _isStale = cachedData.shouldBypassTagCache ? false : await isStale(cacheKey, tags, cachedData.lastModified ?? Date.now());
      const host = event.headers.host;
      switch (cachedData?.value?.type) {
        case "app":
        case "page": {
          const result = await generateResult(event, localizedPath, cachedData.value, cachedData.lastModified, _isStale, cacheKey, revalidationPath);
          return result ?? event;
        }
        case "redirect": {
          const cacheControl = await computeCacheControl(localizedPath, "", host, cachedData.value.revalidate, cachedData.lastModified, _isStale, revalidationPath, cacheKey);
          return {
            type: "core",
            statusCode: cachedData.value.meta?.status ?? 307,
            body: emptyReadableStream(),
            headers: {
              ...cachedData.value.meta?.headers ?? {},
              ...cacheControl
            },
            isBase64Encoded: false
          };
        }
        case "route": {
          const cacheControl = await computeCacheControl(localizedPath, cachedData.value.body, host, cachedData.value.revalidate, cachedData.lastModified, _isStale, revalidationPath, cacheKey);
          const isBinary = isBinaryContentType(String(cachedData.value.meta?.headers?.["content-type"]));
          const statusCode = computeStatusCode(event.rewriteStatusCode, cachedData.value.meta?.status);
          const headers = {
            ...cacheControl,
            ...cachedData.value.meta?.headers,
            vary: VARY_HEADER
          };
          fixCacheControlForError(headers, statusCode);
          return {
            type: "core",
            statusCode,
            body: toReadableStream(cachedData.value.body, isBinary),
            headers,
            isBase64Encoded: isBinary
          };
        }
        default:
          return event;
      }
    } catch (e) {
      debug("Error while fetching cache", e);
      return event;
    }
  }
  return event;
}

// node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
function parse2(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path3 = "";
  var tryConsume = function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  };
  var mustConsume = function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  };
  var consumeText = function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  };
  var isSafe = function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  };
  var safePattern = function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  };
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path3 += prefix;
        prefix = "";
      }
      if (path3) {
        result.push(path3);
        path3 = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path3 += value;
      continue;
    }
    if (path3) {
      result.push(path3);
      path3 = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
function compile(str, options) {
  return tokensToFunction(parse2(str, options), options);
}
function tokensToFunction(tokens, options) {
  if (options === void 0) {
    options = {};
  }
  var reFlags = flags(options);
  var _a = options.encode, encode = _a === void 0 ? function(x) {
    return x;
  } : _a, _b = options.validate, validate = _b === void 0 ? true : _b;
  var matches = tokens.map(function(token) {
    if (typeof token === "object") {
      return new RegExp("^(?:".concat(token.pattern, ")$"), reFlags);
    }
  });
  return function(data) {
    var path3 = "";
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (typeof token === "string") {
        path3 += token;
        continue;
      }
      var value = data ? data[token.name] : void 0;
      var optional = token.modifier === "?" || token.modifier === "*";
      var repeat = token.modifier === "*" || token.modifier === "+";
      if (Array.isArray(value)) {
        if (!repeat) {
          throw new TypeError('Expected "'.concat(token.name, '" to not repeat, but got an array'));
        }
        if (value.length === 0) {
          if (optional)
            continue;
          throw new TypeError('Expected "'.concat(token.name, '" to not be empty'));
        }
        for (var j = 0; j < value.length; j++) {
          var segment = encode(value[j], token);
          if (validate && !matches[i].test(segment)) {
            throw new TypeError('Expected all "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
          }
          path3 += token.prefix + segment + token.suffix;
        }
        continue;
      }
      if (typeof value === "string" || typeof value === "number") {
        var segment = encode(String(value), token);
        if (validate && !matches[i].test(segment)) {
          throw new TypeError('Expected "'.concat(token.name, '" to match "').concat(token.pattern, '", but got "').concat(segment, '"'));
        }
        path3 += token.prefix + segment + token.suffix;
        continue;
      }
      if (optional)
        continue;
      var typeOfMessage = repeat ? "an array" : "a string";
      throw new TypeError('Expected "'.concat(token.name, '" to be ').concat(typeOfMessage));
    }
    return path3;
  };
}
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path3 = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    };
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path: path3, index, params };
  };
}
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
function regexpToRegexp(path3, keys) {
  if (!keys)
    return path3;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path3.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path3.source);
  }
  return path3;
}
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path3) {
    return pathToRegexp(path3, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
function stringToRegexp(path3, keys, options) {
  return tokensToRegexp(parse2(path3, options), keys, options);
}
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
function pathToRegexp(path3, keys, options) {
  if (path3 instanceof RegExp)
    return regexpToRegexp(path3, keys);
  if (Array.isArray(path3))
    return arrayToRegexp(path3, keys, options);
  return stringToRegexp(path3, keys, options);
}

// node_modules/@opennextjs/aws/dist/utils/normalize-path.js
import path2 from "node:path";
function normalizeRepeatedSlashes(url) {
  const urlNoQuery = url.host + url.pathname;
  return `${url.protocol}//${urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/")}${url.search}`;
}

// node_modules/@opennextjs/aws/dist/core/routing/matcher.js
init_stream();
init_logger();
var routeHasMatcher = (headers, cookies, query) => (redirect) => {
  switch (redirect.type) {
    case "header":
      return !!headers?.[redirect.key.toLowerCase()] && new RegExp(redirect.value ?? "").test(headers[redirect.key.toLowerCase()] ?? "");
    case "cookie":
      return !!cookies?.[redirect.key] && new RegExp(redirect.value ?? "").test(cookies[redirect.key] ?? "");
    case "query":
      return query[redirect.key] && Array.isArray(redirect.value) ? redirect.value.reduce((prev, current) => prev || new RegExp(current).test(query[redirect.key]), false) : new RegExp(redirect.value ?? "").test(query[redirect.key] ?? "");
    case "host":
      return headers?.host !== "" && new RegExp(redirect.value ?? "").test(headers.host);
    default:
      return false;
  }
};
function checkHas(matcher, has, inverted = false) {
  return has ? has.reduce((acc, cur) => {
    if (acc === false)
      return false;
    return inverted ? !matcher(cur) : matcher(cur);
  }, true) : true;
}
var getParamsFromSource = (source) => (value) => {
  debug("value", value);
  const _match = source(value);
  return _match ? _match.params : {};
};
var computeParamHas = (headers, cookies, query) => (has) => {
  if (!has.value)
    return {};
  const matcher = new RegExp(`^${has.value}$`);
  const fromSource = (value) => {
    const matches = value.match(matcher);
    return matches?.groups ?? {};
  };
  switch (has.type) {
    case "header":
      return fromSource(headers[has.key.toLowerCase()] ?? "");
    case "cookie":
      return fromSource(cookies[has.key] ?? "");
    case "query":
      return Array.isArray(query[has.key]) ? fromSource(query[has.key].join(",")) : fromSource(query[has.key] ?? "");
    case "host":
      return fromSource(headers.host ?? "");
  }
};
function convertMatch(match2, toDestination, destination) {
  if (!match2) {
    return destination;
  }
  const { params } = match2;
  const isUsingParams = Object.keys(params).length > 0;
  return isUsingParams ? toDestination(params) : destination;
}
function getNextConfigHeaders(event, configHeaders) {
  if (!configHeaders) {
    return {};
  }
  const matcher = routeHasMatcher(event.headers, event.cookies, event.query);
  const requestHeaders = {};
  const localizedRawPath = localizePath(event);
  for (const { headers, has, missing, regex, source, locale } of configHeaders) {
    const path3 = locale === false ? event.rawPath : localizedRawPath;
    if (new RegExp(regex).test(path3) && checkHas(matcher, has) && checkHas(matcher, missing, true)) {
      const fromSource = match(source);
      const _match = fromSource(path3);
      headers.forEach((h) => {
        try {
          const key = convertMatch(_match, compile(h.key), h.key);
          const value = convertMatch(_match, compile(h.value), h.value);
          requestHeaders[key] = value;
        } catch {
          debug(`Error matching header ${h.key} with value ${h.value}`);
          requestHeaders[h.key] = h.value;
        }
      });
    }
  }
  return requestHeaders;
}
function handleRewrites(event, rewrites) {
  const { rawPath, headers, query, cookies, url } = event;
  const localizedRawPath = localizePath(event);
  const matcher = routeHasMatcher(headers, cookies, query);
  const computeHas = computeParamHas(headers, cookies, query);
  const rewrite = rewrites.find((route) => {
    const path3 = route.locale === false ? rawPath : localizedRawPath;
    return new RegExp(route.regex).test(path3) && checkHas(matcher, route.has) && checkHas(matcher, route.missing, true);
  });
  let finalQuery = query;
  let rewrittenUrl = url;
  const isExternalRewrite = isExternal(rewrite?.destination);
  debug("isExternalRewrite", isExternalRewrite);
  if (rewrite) {
    const { pathname, protocol, hostname, queryString } = getUrlParts(rewrite.destination, isExternalRewrite);
    const pathToUse = rewrite.locale === false ? rawPath : localizedRawPath;
    debug("urlParts", { pathname, protocol, hostname, queryString });
    const toDestinationPath = compile(escapeRegex(pathname, { isPath: true }));
    const toDestinationHost = compile(escapeRegex(hostname).replace(/:(\d+)$/, "\\:$1"));
    const toDestinationQuery = compile(escapeRegex(queryString));
    const params = {
      // params for the source
      ...getParamsFromSource(match(escapeRegex(rewrite.source, { isPath: true })))(pathToUse),
      // params for the has
      ...rewrite.has?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {}),
      // params for the missing
      ...rewrite.missing?.reduce((acc, cur) => {
        return Object.assign(acc, computeHas(cur));
      }, {})
    };
    const isUsingParams = Object.keys(params).length > 0;
    let rewrittenQuery = queryString;
    let rewrittenHost = hostname;
    let rewrittenPath = pathname;
    if (isUsingParams) {
      rewrittenPath = unescapeRegex(toDestinationPath(params));
      rewrittenHost = unescapeRegex(toDestinationHost(params));
      rewrittenQuery = unescapeRegex(toDestinationQuery(params));
    }
    if (NextConfig.i18n && !isExternalRewrite) {
      const strippedPathLocale = rewrittenPath.replace(new RegExp(`^/(${NextConfig.i18n.locales.join("|")})`), "");
      if (strippedPathLocale.startsWith("/api/")) {
        rewrittenPath = strippedPathLocale;
      }
    }
    rewrittenUrl = isExternalRewrite ? `${protocol}//${rewrittenHost}${rewrittenPath}` : new URL(rewrittenPath, event.url).href;
    finalQuery = {
      ...query,
      ...convertFromQueryString(rewrittenQuery)
    };
    rewrittenUrl += convertToQueryString(finalQuery);
    debug("rewrittenUrl", { rewrittenUrl, finalQuery, isUsingParams });
  }
  return {
    internalEvent: {
      ...event,
      query: finalQuery,
      rawPath: new URL(rewrittenUrl).pathname,
      url: rewrittenUrl
    },
    __rewrite: rewrite,
    isExternalRewrite
  };
}
function handleRepeatedSlashRedirect(event) {
  if (event.rawPath.match(/(\\|\/\/)/)) {
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: normalizeRepeatedSlashes(new URL(event.url))
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
  return false;
}
function handleTrailingSlashRedirect(event) {
  const url = new URL(event.rawPath, "http://localhost");
  if (
    // Someone is trying to redirect to a different origin, let's not do that
    url.host !== "localhost" || NextConfig.skipTrailingSlashRedirect || // We should not apply trailing slash redirect to API routes
    event.rawPath.startsWith("/api/")
  ) {
    return false;
  }
  const emptyBody = emptyReadableStream();
  if (NextConfig.trailingSlash && !(event.query.__nextDataReq === "1") && !event.rawPath.endsWith("/") && !event.rawPath.match(/[\w-]+\.[\w]+$/g)) {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0]}/${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  if (!NextConfig.trailingSlash && event.rawPath.endsWith("/") && event.rawPath !== "/") {
    const headersLocation = event.url.split("?");
    return {
      type: event.type,
      statusCode: 308,
      headers: {
        Location: `${headersLocation[0].replace(/\/$/, "")}${headersLocation[1] ? `?${headersLocation[1]}` : ""}`
      },
      body: emptyBody,
      isBase64Encoded: false
    };
  }
  return false;
}
function handleRedirects(event, redirects) {
  const repeatedSlashRedirect = handleRepeatedSlashRedirect(event);
  if (repeatedSlashRedirect)
    return repeatedSlashRedirect;
  const trailingSlashRedirect = handleTrailingSlashRedirect(event);
  if (trailingSlashRedirect)
    return trailingSlashRedirect;
  const localeRedirect = handleLocaleRedirect(event);
  if (localeRedirect)
    return localeRedirect;
  const { internalEvent, __rewrite } = handleRewrites(event, redirects.filter((r) => !r.internal));
  if (__rewrite && !__rewrite.internal) {
    return {
      type: event.type,
      statusCode: __rewrite.statusCode ?? 308,
      headers: {
        Location: internalEvent.url
      },
      body: emptyReadableStream(),
      isBase64Encoded: false
    };
  }
}
function fixDataPage(internalEvent, buildId) {
  const { rawPath, query } = internalEvent;
  const basePath = NextConfig.basePath ?? "";
  const dataPattern = `${basePath}/_next/data/${buildId}`;
  if (rawPath.startsWith("/_next/data") && !rawPath.startsWith(dataPattern)) {
    return {
      type: internalEvent.type,
      statusCode: 404,
      body: toReadableStream("{}"),
      headers: {
        "Content-Type": "application/json"
      },
      isBase64Encoded: false
    };
  }
  if (rawPath.startsWith(dataPattern) && rawPath.endsWith(".json")) {
    const newPath = `${basePath}${rawPath.slice(dataPattern.length, -".json".length).replace(/^\/index$/, "/")}`;
    query.__nextDataReq = "1";
    return {
      ...internalEvent,
      rawPath: newPath,
      query,
      headers: {
        ...internalEvent.headers,
        "x-nextjs-data": "1"
      },
      url: new URL(`${newPath}${convertToQueryString(query)}`, internalEvent.url).href
    };
  }
  return internalEvent;
}
function handleFallbackFalse(internalEvent, prerenderManifest) {
  const { rawPath } = internalEvent;
  const { dynamicRoutes = {}, routes = {} } = prerenderManifest ?? {};
  const prerenderedFallbackRoutes = Object.entries(dynamicRoutes).filter(([, { fallback }]) => fallback === false);
  const routeFallback = prerenderedFallbackRoutes.some(([, { routeRegex }]) => {
    const routeRegexExp = new RegExp(routeRegex);
    return routeRegexExp.test(rawPath);
  });
  const locales = NextConfig.i18n?.locales;
  const routesAlreadyHaveLocale = locales?.includes(rawPath.split("/")[1]) || // If we don't use locales, we don't need to add the default locale
  locales === void 0;
  let localizedPath = routesAlreadyHaveLocale ? rawPath : `/${NextConfig.i18n?.defaultLocale}${rawPath}`;
  if (
    // Not if localizedPath is "/" tho, because that would not make it find `isPregenerated` below since it would be try to match an empty string.
    localizedPath !== "/" && NextConfig.trailingSlash && localizedPath.endsWith("/")
  ) {
    localizedPath = localizedPath.slice(0, -1);
  }
  const matchedStaticRoute = staticRouteMatcher(localizedPath);
  const prerenderedFallbackRoutesName = prerenderedFallbackRoutes.map(([name]) => name);
  const matchedDynamicRoute = dynamicRouteMatcher(localizedPath).filter(({ route }) => !prerenderedFallbackRoutesName.includes(route));
  const isPregenerated = Object.keys(routes).includes(localizedPath);
  if (routeFallback && !isPregenerated && matchedStaticRoute.length === 0 && matchedDynamicRoute.length === 0) {
    return {
      event: {
        ...internalEvent,
        rawPath: "/404",
        url: constructNextUrl(internalEvent.url, "/404"),
        headers: {
          ...internalEvent.headers,
          "x-invoke-status": "404"
        }
      },
      isISR: false
    };
  }
  return {
    event: internalEvent,
    isISR: routeFallback || isPregenerated
  };
}

// node_modules/@opennextjs/aws/dist/core/routing/middleware.js
init_util();
init_stream();
init_utils();
var middlewareManifest = MiddlewareManifest;
var functionsConfigManifest = FunctionsConfigManifest;
var middleMatch = getMiddlewareMatch(middlewareManifest, functionsConfigManifest);
var REDIRECTS = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
function defaultMiddlewareLoader() {
  return Promise.resolve().then(() => (init_edgeFunctionHandler(), edgeFunctionHandler_exports));
}
async function handleMiddleware(internalEvent, initialSearch, middlewareLoader = defaultMiddlewareLoader) {
  const headers = internalEvent.headers;
  if (headers[ISR_HEADER] && headers[PRERENDER_REVALIDATE_HEADER] === PrerenderManifest?.preview?.previewModeId)
    return internalEvent;
  const normalizedPath = localizePath(internalEvent);
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(normalizedPath);
  } catch {
  }
  const hasMatch = middleMatch.some((r) => r.test(normalizedPath) || decodedPath !== void 0 && r.test(decodedPath));
  if (!hasMatch)
    return internalEvent;
  const initialUrl = new URL(normalizedPath, internalEvent.url);
  initialUrl.search = initialSearch;
  const url = initialUrl.href;
  const middleware = await middlewareLoader();
  const result = await middleware.default({
    // `geo` is pre Next 15.
    geo: {
      // The city name is percent-encoded.
      // See https://github.com/vercel/vercel/blob/4cb6143/packages/functions/src/headers.ts#L94C19-L94C37
      city: decodeURIComponent(headers["x-open-next-city"]),
      country: headers["x-open-next-country"],
      region: headers["x-open-next-region"],
      latitude: headers["x-open-next-latitude"],
      longitude: headers["x-open-next-longitude"]
    },
    headers,
    method: internalEvent.method || "GET",
    nextConfig: {
      basePath: NextConfig.basePath,
      i18n: NextConfig.i18n,
      trailingSlash: NextConfig.trailingSlash
    },
    url,
    body: convertBodyToReadableStream(internalEvent.method, internalEvent.body)
  });
  const statusCode = result.status;
  const responseHeaders = result.headers;
  const reqHeaders = {};
  const resHeaders = {};
  const filteredHeaders = [
    "x-middleware-override-headers",
    "x-middleware-next",
    "x-middleware-rewrite",
    // We need to drop `content-encoding` because it will be decoded
    "content-encoding"
  ];
  const xMiddlewareKey = "x-middleware-request-";
  responseHeaders.forEach((value, key) => {
    if (key.startsWith(xMiddlewareKey)) {
      const k = key.substring(xMiddlewareKey.length);
      reqHeaders[k] = value;
    } else {
      if (filteredHeaders.includes(key.toLowerCase()))
        return;
      if (key.toLowerCase() === "set-cookie")
        return;
      if (REDIRECTS.has(statusCode) && key.toLowerCase() === "location") {
        resHeaders[key] = normalizeLocationHeader(value, internalEvent.url);
      } else {
        resHeaders[key] = value;
      }
    }
  });
  const setCookies = responseHeaders.getSetCookie().flatMap((maybeCompoundCookie) => parseSetCookieHeader(maybeCompoundCookie));
  if (setCookies.length > 0) {
    resHeaders["set-cookie"] = setCookies;
  }
  const rewriteUrl = responseHeaders.get("x-middleware-rewrite");
  let isExternalRewrite = false;
  let middlewareQuery = internalEvent.query;
  let newUrl = internalEvent.url;
  if (rewriteUrl) {
    newUrl = rewriteUrl;
    if (isExternal(newUrl, internalEvent.headers.host)) {
      isExternalRewrite = true;
    } else {
      const rewriteUrlObject = new URL(rewriteUrl);
      middlewareQuery = getQueryFromSearchParams(rewriteUrlObject.searchParams);
      if ("__nextDataReq" in internalEvent.query) {
        middlewareQuery.__nextDataReq = internalEvent.query.__nextDataReq;
      }
    }
  }
  if (!rewriteUrl && !responseHeaders.get("x-middleware-next")) {
    const body = result.body ?? emptyReadableStream();
    return {
      type: internalEvent.type,
      statusCode,
      headers: resHeaders,
      body,
      isBase64Encoded: false
    };
  }
  return {
    responseHeaders: resHeaders,
    url: newUrl,
    rawPath: new URL(newUrl).pathname,
    type: internalEvent.type,
    headers: { ...internalEvent.headers, ...reqHeaders },
    body: internalEvent.body,
    method: internalEvent.method,
    query: middlewareQuery,
    cookies: internalEvent.cookies,
    remoteAddress: internalEvent.remoteAddress,
    isExternalRewrite,
    rewriteStatusCode: rewriteUrl && !isExternalRewrite ? statusCode : void 0
  };
}

// node_modules/@opennextjs/aws/dist/core/routingHandler.js
var MIDDLEWARE_HEADER_PREFIX = "x-middleware-response-";
var MIDDLEWARE_HEADER_PREFIX_LEN = MIDDLEWARE_HEADER_PREFIX.length;
var INTERNAL_HEADER_PREFIX = "x-opennext-";
var INTERNAL_HEADER_INITIAL_URL = `${INTERNAL_HEADER_PREFIX}initial-url`;
var INTERNAL_HEADER_LOCALE = `${INTERNAL_HEADER_PREFIX}locale`;
var INTERNAL_HEADER_RESOLVED_ROUTES = `${INTERNAL_HEADER_PREFIX}resolved-routes`;
var INTERNAL_HEADER_REWRITE_STATUS_CODE = `${INTERNAL_HEADER_PREFIX}rewrite-status-code`;
var INTERNAL_EVENT_REQUEST_ID = `${INTERNAL_HEADER_PREFIX}request-id`;
var geoHeaderToNextHeader = {
  "x-open-next-city": "x-vercel-ip-city",
  "x-open-next-country": "x-vercel-ip-country",
  "x-open-next-region": "x-vercel-ip-country-region",
  "x-open-next-latitude": "x-vercel-ip-latitude",
  "x-open-next-longitude": "x-vercel-ip-longitude"
};
var NEXT_INTERNAL_HEADERS = [
  "x-middleware-rewrite",
  "x-middleware-redirect",
  "x-middleware-set-cookie",
  "x-middleware-skip",
  "x-middleware-override-headers",
  "x-middleware-next",
  "x-now-route-matches",
  "x-matched-path",
  "x-nextjs-data",
  "x-next-resume-state-length"
];
function applyMiddlewareHeaders(eventOrResult, middlewareHeaders) {
  const isResult = isInternalResult(eventOrResult);
  const headers = eventOrResult.headers;
  const keyPrefix = isResult ? "" : MIDDLEWARE_HEADER_PREFIX;
  Object.entries(middlewareHeaders).forEach(([key, value]) => {
    if (value) {
      headers[keyPrefix + key] = Array.isArray(value) ? value.join(",") : value;
    }
  });
}
async function routingHandler(event, { assetResolver }) {
  try {
    for (const [openNextGeoName, nextGeoName] of Object.entries(geoHeaderToNextHeader)) {
      const value = event.headers[openNextGeoName];
      if (value) {
        event.headers[nextGeoName] = value;
      }
    }
    for (const key of Object.keys(event.headers)) {
      const lowerCaseKey = key.toLowerCase();
      if (lowerCaseKey.startsWith(INTERNAL_HEADER_PREFIX) || lowerCaseKey.startsWith(MIDDLEWARE_HEADER_PREFIX) || NEXT_INTERNAL_HEADERS.includes(lowerCaseKey)) {
        delete event.headers[key];
      }
    }
    let headers = getNextConfigHeaders(event, ConfigHeaders);
    let eventOrResult = fixDataPage(event, BuildId);
    if (isInternalResult(eventOrResult)) {
      return eventOrResult;
    }
    const redirect = handleRedirects(eventOrResult, RoutesManifest.redirects);
    if (redirect) {
      redirect.headers.Location = normalizeLocationHeader(redirect.headers.Location, event.url, true);
      debug("redirect", redirect);
      return redirect;
    }
    const middlewareEventOrResult = await handleMiddleware(
      eventOrResult,
      // We need to pass the initial search without any decoding
      // TODO: we'd need to refactor InternalEvent to include the initial querystring directly
      // Should be done in another PR because it is a breaking change
      new URL(event.url).search
    );
    if (isInternalResult(middlewareEventOrResult)) {
      return middlewareEventOrResult;
    }
    const middlewareHeadersPrioritized = globalThis.openNextConfig.dangerous?.middlewareHeadersOverrideNextConfigHeaders ?? false;
    if (middlewareHeadersPrioritized) {
      headers = {
        ...headers,
        ...middlewareEventOrResult.responseHeaders
      };
    } else {
      headers = {
        ...middlewareEventOrResult.responseHeaders,
        ...headers
      };
    }
    let isExternalRewrite = middlewareEventOrResult.isExternalRewrite ?? false;
    eventOrResult = middlewareEventOrResult;
    if (!isExternalRewrite) {
      const beforeRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.beforeFiles);
      eventOrResult = beforeRewrite.internalEvent;
      isExternalRewrite = beforeRewrite.isExternalRewrite;
      if (!isExternalRewrite) {
        const assetResult = await assetResolver?.maybeGetAssetResult?.(eventOrResult);
        if (assetResult) {
          applyMiddlewareHeaders(assetResult, headers);
          return assetResult;
        }
      }
    }
    const foundStaticRoute = staticRouteMatcher(eventOrResult.rawPath);
    const isStaticRoute = !isExternalRewrite && foundStaticRoute.length > 0;
    if (!(isStaticRoute || isExternalRewrite)) {
      const afterRewrite = handleRewrites(eventOrResult, RoutesManifest.rewrites.afterFiles);
      eventOrResult = afterRewrite.internalEvent;
      isExternalRewrite = afterRewrite.isExternalRewrite;
    }
    let isISR = false;
    if (!isExternalRewrite) {
      const fallbackResult = handleFallbackFalse(eventOrResult, PrerenderManifest);
      eventOrResult = fallbackResult.event;
      isISR = fallbackResult.isISR;
    }
    const foundDynamicRoute = dynamicRouteMatcher(eventOrResult.rawPath);
    const isDynamicRoute = !isExternalRewrite && foundDynamicRoute.length > 0;
    if (!(isDynamicRoute || isStaticRoute || isExternalRewrite)) {
      const fallbackRewrites = handleRewrites(eventOrResult, RoutesManifest.rewrites.fallback);
      eventOrResult = fallbackRewrites.internalEvent;
      isExternalRewrite = fallbackRewrites.isExternalRewrite;
    }
    const isNextImageRoute = eventOrResult.rawPath.startsWith("/_next/image");
    const isRouteFoundBeforeAllRewrites = isStaticRoute || isDynamicRoute || isExternalRewrite;
    const resolvedRoutes = [
      ...staticRouteMatcher(eventOrResult.rawPath),
      ...dynamicRouteMatcher(eventOrResult.rawPath)
    ];
    if (!(isRouteFoundBeforeAllRewrites || isNextImageRoute || // We need to check again once all rewrites have been applied
    staticRouteMatcher(eventOrResult.rawPath).length > 0 || dynamicRouteMatcher(eventOrResult.rawPath).length > 0)) {
      eventOrResult = {
        ...eventOrResult,
        rawPath: "/404",
        url: constructNextUrl(eventOrResult.url, "/404"),
        headers: {
          ...eventOrResult.headers,
          "x-middleware-response-cache-control": NO_STORE_CACHE_CONTROL
        }
      };
    }
    if (globalThis.openNextConfig.dangerous?.enableCacheInterception && !isExternalRewrite && !isInternalResult(eventOrResult)) {
      debug("Cache interception enabled");
      eventOrResult = await cacheInterceptor(eventOrResult, resolvedRoutes);
      if (isInternalResult(eventOrResult)) {
        applyMiddlewareHeaders(eventOrResult, headers);
        return eventOrResult;
      }
    }
    applyMiddlewareHeaders(eventOrResult, headers);
    debug("resolvedRoutes", resolvedRoutes);
    return {
      internalEvent: eventOrResult,
      isExternalRewrite,
      origin: false,
      isISR,
      resolvedRoutes,
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(eventOrResult, NextConfig.i18n) : void 0,
      rewriteStatusCode: middlewareEventOrResult.rewriteStatusCode
    };
  } catch (e) {
    error("Error in routingHandler", e);
    return {
      internalEvent: {
        type: "core",
        method: "GET",
        rawPath: "/500",
        url: constructNextUrl(event.url, "/500"),
        headers: {
          ...event.headers
        },
        query: event.query,
        cookies: event.cookies,
        remoteAddress: event.remoteAddress
      },
      isExternalRewrite: false,
      origin: false,
      isISR: false,
      resolvedRoutes: [],
      initialURL: event.url,
      locale: NextConfig.i18n ? detectLocale(event, NextConfig.i18n) : void 0
    };
  }
}
function isInternalResult(eventOrResult) {
  return eventOrResult != null && "statusCode" in eventOrResult;
}

// node_modules/@opennextjs/aws/dist/adapters/middleware.js
globalThis.internalFetch = fetch;
globalThis.__openNextAls = new AsyncLocalStorage();
var defaultHandler = async (internalEvent, options) => {
  const middlewareConfig = globalThis.openNextConfig.middleware;
  const originResolver = await resolveOriginResolver(middlewareConfig?.originResolver);
  const externalRequestProxy = await resolveProxyRequest(middlewareConfig?.override?.proxyExternalRequest);
  const assetResolver = await resolveAssetResolver(middlewareConfig?.assetResolver);
  const requestId = Math.random().toString(36);
  return runWithOpenNextRequestContext({
    isISRRevalidation: internalEvent.headers[ISR_HEADER] === "1",
    waitUntil: options?.waitUntil,
    requestId
  }, async () => {
    const result = await routingHandler(internalEvent, { assetResolver });
    if ("internalEvent" in result) {
      debug("Middleware intercepted event", internalEvent);
      if (!result.isExternalRewrite) {
        const origin = await originResolver.resolve(result.internalEvent.rawPath);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_HEADER_INITIAL_URL]: internalEvent.url,
              [INTERNAL_HEADER_RESOLVED_ROUTES]: JSON.stringify(result.resolvedRoutes),
              [INTERNAL_EVENT_REQUEST_ID]: requestId,
              [INTERNAL_HEADER_REWRITE_STATUS_CODE]: String(result.rewriteStatusCode)
            }
          },
          isExternalRewrite: result.isExternalRewrite,
          origin,
          isISR: result.isISR,
          initialURL: result.initialURL,
          resolvedRoutes: result.resolvedRoutes
        };
      }
      try {
        return externalRequestProxy.proxy(result.internalEvent);
      } catch (e) {
        error("External request failed.", e);
        return {
          type: "middleware",
          internalEvent: {
            ...result.internalEvent,
            headers: {
              ...result.internalEvent.headers,
              [INTERNAL_EVENT_REQUEST_ID]: requestId
            },
            rawPath: "/500",
            url: constructNextUrl(result.internalEvent.url, "/500"),
            method: "GET"
          },
          // On error we need to rewrite to the 500 page which is an internal rewrite
          isExternalRewrite: false,
          origin: false,
          isISR: result.isISR,
          initialURL: result.internalEvent.url,
          resolvedRoutes: [{ route: "/500", type: "page" }]
        };
      }
    }
    if (process.env.OPEN_NEXT_REQUEST_ID_HEADER || globalThis.openNextDebug) {
      result.headers[INTERNAL_EVENT_REQUEST_ID] = requestId;
    }
    debug("Middleware response", result);
    return result;
  });
};
var handler2 = await createGenericHandler({
  handler: defaultHandler,
  type: "middleware"
});
var middleware_default = {
  fetch: handler2
};
export {
  middleware_default as default,
  handler2 as handler
};
