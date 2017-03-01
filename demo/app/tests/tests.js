var Sonos = require("nativescript-sonos").Sonos;
var sonos = new Sonos();

// TODO replace 'functionname' with an acual function name of your plugin class and run with 'npm test <platform>'
describe("functionname", function() {
  it("exists", function() {
    expect(sonos.functionname).toBeDefined();
  });

  it("returns a promise", function() {
    expect(sonos.functionname()).toEqual(jasmine.any(Promise));
  });
});