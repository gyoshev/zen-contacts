// This application is using EQATEC Analytics
// Insert this script snippet in an appropriate place in your code and
// call Start and Stop when your application starts and ends.
// See the documentation at http://www.telerik.com/analytics/resources/documentation
//
(function(g) {
  // Make analytics available via the window.analytics variable
  // Start analytics by calling window.analytics.Start()
  var analytics = g.analytics = g.analytics || {};

  analytics.Start = function()
  {
    // Handy shortcuts to the analytics api
    var factory = window.plugins.EqatecAnalytics.Factory;

    factory.IsMonitorCreated(function(result) {
      if (result.IsCreated == "true")
        return;
      // Create the monitor instance using the unique product key for Zen contacts
      var productId = "9b452bf012824167a240167c7d1807fa";
      var version = "1.2.3";
      var settings = factory.CreateSettings(productId, version);
      settings.LoggingInterface = factory.CreateTraceLogger();
      factory.CreateMonitorWithSettings(settings,
        function() {
          console.log("Monitor created");
          // Start the monitor
          window.plugins.EqatecAnalytics.Monitor.Start(function() {
            console.log("Monitor started");
          });
        },
        function(msg) {
          console.log("Error creating monitor: " + msg);
        });
    });
  }

  analytics.Stop = function()
  {
    var mon = window.plugins.EqatecAnalytics.Monitor;
    mon.Stop();
  }

  analytics.Monitor = function()
  {
    return window.plugins.EqatecAnalytics.Monitor;
  }    
})(window);