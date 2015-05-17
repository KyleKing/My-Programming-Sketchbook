(function(){__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.publish("bikesData", function() {
  return Bikes.find();
});

})();

//# sourceMappingURL=server.coffee.js.map
