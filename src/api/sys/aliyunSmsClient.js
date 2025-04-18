'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
// This file is auto-generated, don't edit it
// 依赖的模块可通过下载工程中的模块依赖文件或右上角的获取 SDK 依赖信息查看
var dysmsapi20170525_1 = require('@alicloud/dysmsapi20170525'),
  $Dysmsapi20170525 = dysmsapi20170525_1;
var $OpenApi = require('@alicloud/openapi-client');
var tea_console_1 = require('@alicloud/tea-console');
var tea_util_1 = require('@alicloud/tea-util'),
  $Util = tea_util_1;

var Client = /** @class */ (function () {
  function Client() {}
  /**
   * @remarks
   * 使用AK&SK初始化账号Client
   * @returns Client
   *
   * @throws Exception
   */
  Client.createClient = function () {
    var config = new $OpenApi.Config({
      accessKeyId: process.env['ALIBABA_CLOUD_ACCESS_KEY_ID'],
      accessKeySecret: process.env['ALIBABA_CLOUD_ACCESS_KEY_SECRET'],
    });
    config.endpoint = 'dysmsapi.aliyuncs.com';
    return new dysmsapi20170525_1['default'](config);
  };

  Client.sendSms = function (phoneNumber) {
    return __awaiter(this, void 0, void 0, function () {
      var client, sendSmsRequest, runtime, resp, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            client = Client.createClient();
            sendSmsRequest = new $Dysmsapi20170525.SendSmsRequest({
              signName: '阿里云短信测试',
              templateCode: 'SMS_154950909',
              phoneNumbers: phoneNumber,
              templateParam: '{"code":"1234"}',
            });
            runtime = new $Util.RuntimeOptions({});
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [4 /*yield*/, client.sendSmsWithOptions(sendSmsRequest, runtime)];
          case 2:
            resp = _a.sent();
            tea_console_1['default'].log(tea_util_1['default'].toJSONString(resp));
            return [3 /*break*/, 4];
          case 3:
            error_1 = _a.sent();
            console.log(error_1.message);
            console.log(error_1.data['Recommend']);
            tea_util_1['default'].assertAsString(error_1.message);
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return Client;
})();
// exports['default'] = Client;
export default Client;
