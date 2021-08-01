"use strict";

var Service, Characteristic, HomebridgeAPI;

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-blinking-switch", "BlinkingSwitch", BlinkingSwitch);
}

function BlinkingSwitch(log, config) {
  this.log = log;
  this.name = config.name;
  this.secondsRemaining = 300;
  this.timer = null;
  this._service = new Service.Switch(this.name);

  this.cacheDirectory = HomebridgeAPI.user.persistPath();
  this.storage = require('node-persist');
  this.storage.initSync({dir:this.cacheDirectory, forgiveParseErrors: true});
  
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));

  this._service.addCharacteristic(Characteristic.StatusActive);

  this._service.addCharacteristic(Characteristic.SetDuration);
  this._service.getCharacteristic('Set Duration').setProps({
    minValue: 10
  });

  var cachedDuration = this.storage.getItemSync(this.name);
  if ((cachedDuration === undefined) || (cachedDuration === false)) {
	this._service.setCharacteristic('Set Duration', this.secondsRemaining);
  } else {
	this._service.setCharacteristic('Set Duration', cachedDuration);
  }
  this._service.getCharacteristic('Set Duration')
    .on('set', this._setDuration.bind(this));

  this._service.addCharacteristic(Characteristic.RemainingDuration);
}

BlinkingSwitch.prototype.getServices = function() {
  return [this._service];
}

BlinkingSwitch.prototype._setOn = function(on, callback) {
  this.log("Setting switch to " + on);
  if (on) {
    // seconds remaining is our setDuration
    this.secondsRemaining = this._service.getCharacteristic('Set Duration').value;
    this._service.setCharacteristic('Status Active', true);
    this.timer = setInterval(function() {
      this.secondsRemaining -= 1;
      if (this.secondsRemaining < 0) {
        // flip and reset
        this.log("Inverting Status Active characteristic");
        this._service.setCharacteristic('Status Active', !this._service.getCharacteristic('Status Active').value);
        this.secondsRemaining = this._service.getCharacteristic('Set Duration').value;
      }
      this._service.setCharacteristic('Remaining Duration', this.secondsRemaining);
    }.bind(this), 1000);
  } else {
    clearInterval(this.timer);
    this.timer = null;
    this._service.setCharacteristic('Status Active', false);
    this.secondsRemaining = this._service.getCharacteristic('Set Duration').value;
    this._service.setCharacteristic('Remaining Duration', this.secondsRemaining);
  }
  callback();
}

BlinkingSwitch.prototype._setDuration = function(duration, callback) {
  this.log("Setting duration to " + duration);
  this.secondsRemaining = duration;
  this._service.setCharacteristic('Remaining Duration', this.secondsRemaining);
  this.storage.setItemSync(this.name, duration);
  callback();
}
