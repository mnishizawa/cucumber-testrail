// Generated by CoffeeScript 1.11.1
(function() {
  var TestRailApi, TestRailService, co;

  co = require('co');

  TestRailApi = require('./testrail_api');

  TestRailService = (function() {
    function TestRailService(config, suite_config, opts, testrail_metrics) {
      this.config = config;
      this.suite_config = suite_config;
      this.opts = opts;
      this.testrail_metrics = testrail_metrics;
      this.api = new TestRailApi(this.config, this.opts, this.suite_config, this.testrail_metrics[this.suite_config.project_symbol] || []);
    }

    TestRailService.prototype.fetchScenarios = co.wrap(function*() {
      return (yield this.api.fetchCaseDescriptions());
    });

    TestRailService.prototype.sendTestResults = co.wrap(function*() {
      var case_ids, testrun_id;
      case_ids = (yield this.api.fetchCases());
      testrun_id = (yield this.api.generateTestRun(case_ids));
      return (yield this.api.addResults(testrun_id));
    });

    return TestRailService;

  })();

  module.exports = TestRailService;

}).call(this);