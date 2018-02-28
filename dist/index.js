// Generated by CoffeeScript 1.11.1
(function() {
  var ConfigReader, CucumberResultReader, OptionsReader, TestRailService, co;

  co = require('co');

  ConfigReader = require('./config_reader');

  CucumberResultReader = require('./cucumber_result_reader');

  OptionsReader = require('./options_reader');

  TestRailService = require('./testrail_service');

  co(function*() {
    var config, config_reader, cucumber_reader, e, options_reader, opts, suite_config, testrail_metrics, testrail_service;
    try {
      opts = {};
      config = [];
      testrail_metrics = [];
      options_reader = new OptionsReader();
      opts = options_reader.parse();
      config_reader = new ConfigReader(opts.config);
      config = config_reader.parse();
      if (opts.write) {
        suite_config = config.suites.filter((function(_this) {
          return function(arg) {
            var project_symbol;
            project_symbol = arg.project_symbol;
            return project_symbol === opts.write;
          };
        })(this));
        if (!suite_config.length) {
          throw new Error("project symbol " + opts.write + " not found in cucumber_testrail.yml");
        }
        testrail_service = new TestRailService(config, suite_config[0], opts, {});
        return testrail_service.fetchScenarios();
      }
      cucumber_reader = new CucumberResultReader(config, opts.result);
      testrail_metrics = (yield cucumber_reader.parse());
      return (yield Promise.all(config.suites.map((function(_this) {
        return function(suite_config) {
          testrail_service = new TestRailService(config, suite_config, opts, testrail_metrics);
          return testrail_service.sendTestResults();
        };
      })(this))));
    } catch (error) {
      e = error;
      return console.log("" + e);
    }
  });

}).call(this);