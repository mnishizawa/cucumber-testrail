// Generated by CoffeeScript 1.11.1
(function() {
  var FILTERS, PARAMS, REQUESTS, RequestManager, Table, TestRailApi;

  Table = require('cli-table');

  PARAMS = ['project_id', 'suite_id', 'section_id', 'testrun_id', 'testplan_id'];

  FILTERS = ['section_id', 'suite_id'];

  REQUESTS = {
    addPlanEntry: 'add_plan_entry/{{testplan_id}}',
    getCases: 'get_cases/{{project_id}}&suite_id={{suite_id}}&section_id={{section_id}}',
    addResults: 'add_results_for_cases/{{testrun_id}}'
  };

  RequestManager = require('./request_manager');

  TestRailApi = (function() {
    function TestRailApi(config, opts1, suite_config, metrics) {
      this.config = config != null ? config : {};
      this.opts = opts1 != null ? opts1 : {};
      this.suite_config = suite_config != null ? suite_config : {};
      this.metrics = metrics != null ? metrics : [];
      this.request_manager = new RequestManager(this.opts);
    }

    TestRailApi.prototype.addResults = function*(testrun_id) {
      var testrun_url, url;
      url = this._generateUrl('addResults', {
        testrun_id: testrun_id
      });
      yield this.request_manager.send('post', {
        url: url,
        body: {
          results: this.metrics
        }
      });
      testrun_url = this.config.testrail_url + "/runs/view/" + testrun_id;
      return console.log("Successfully added the following results for project symbol " + this.suite_config.project_symbol + " to TestRail. Visit " + testrun_url + " to access.");
    };

    TestRailApi.prototype.fetchCaseDescriptions = function*() {
      var resp, table;
      this.suite_config.section_id = void 0;
      resp = (yield this.request_manager.send('get', {
        url: this._generateUrl('getCases')
      }));
      table = new Table({
        head: ['Case ID', 'Section ID', 'Title']
      });
      resp.forEach(function(arg) {
        var id, section_id, title;
        section_id = arg.section_id, title = arg.title, id = arg.id;
        return table.push([id, section_id, title]);
      });
      return console.log(table.toString());
    };

    TestRailApi.prototype.fetchCases = function*() {
      var resp;
      resp = (yield this.request_manager.send('get', {
        url: this._generateUrl('getCases')
      }));
      return resp.map(function(arg) {
        var id;
        id = arg.id;
        return id;
      });
    };

    TestRailApi.prototype.generateTestRun = function*(case_ids) {
      var body, resp, url;
      url = this._generateUrl('addPlanEntry');
      body = {
        suite_id: this.suite_config.suite_id,
        name: "Automated Test Run " + this.opts.runid + " - " + ((new Date()).toLocaleDateString()),
        include_all: false,
        case_ids: case_ids
      };
      resp = (yield this.request_manager.send('post', {
        url: url,
        body: body
      }));
      return resp.runs[resp.runs.length - 1].id;
    };

    TestRailApi.prototype._generateUrl = function(type, opts) {
      var action;
      if (opts == null) {
        opts = {};
      }
      action = REQUESTS[type] || '';
      PARAMS.forEach((function(_this) {
        return function(key) {
          if (_this.suite_config[key] !== void 0 && opts[key] === void 0) {
            action = action.replace("{{" + key + "}}", _this.suite_config[key]);
          }
          if (!(_this.suite_config[key] !== void 0 && FILTERS.indexOf(key) !== -1)) {
            action = action.replace("&" + key + "={{" + key + "}}", '');
          }
          if (opts[key] !== void 0) {
            return action = action.replace("{{" + key + "}}", opts[key]);
          }
        };
      })(this));
      return this.config.testrail_url + "/api/v2/" + action;
    };

    return TestRailApi;

  })();

  module.exports = TestRailApi;

}).call(this);
