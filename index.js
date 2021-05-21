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
  this.secondsRemaining = 0;
  this.timer = null;
  this._service = new Service.Switch(this.name);
  
  this._service.getCharacteristic(Characteristic.On)
    .on('set', this._setOn.bind(this));

  this._service.addCharacteristic(Characteristic.StatusActive);

  this._service.addCharacteristic(Characteristic.SetDuration);
  this._service.getCharacteristic('Set Duration').setProps({
    minValue: 1
  });
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
    this.timer = setInterval(function() {
      this.secondsRemaining -= 1;
      if (this.secondsRemaining < 0) {
        // flip and reset
        this._service.setCharacteristic('Status Active', !this._service.getCharacteristic('Status Active').value);
        this.secondsRemaining = this._service.getCharacteristic('Set Duration').value;
      }
      this._service.setCharacteristic('Remaining Duration', this.secondsRemaining);
    }.bind(this), 1000);
  } else {
    clearInterval(this.timer);
    this._service.setCharacteristic('Status Active', false);
    this.secondsRemaining = this._service.getCharacteristic('Set Duration').value;
    this._service.setCharacteristic('Remaining Duration', this.secondsRemaining);
  }
  callback();
}

BlinkingSwitch.prototype._setDuration = function(duration, callback) {
  this.log("Setting duration to " + duration);
  this.secondsRemaining = duration;
  callback();
}
