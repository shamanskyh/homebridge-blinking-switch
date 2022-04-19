
# "Blinking Switch" Plugin

Example config.json:

```
    "accessories": [
        {
          "accessory": "BlinkingSwitch",
          "name": "My Switch 1"
        }   
    ]

```

This plugin provides a single switch that can be turned on and off, a readonly `Status Active` boolean that can be used in automations, and a `Set Duration` variable to set the time (in seconds) between flips of the boolean `Status Active` flag.

The configuration above creates a single switch. Turning this switch `ON` causes the `Status Active` boolean to flip from `TRUE` to `FALSE `on an interval. Turning this switch `OFF` causes the `Status Active` boolean to turn `FALSE` immediately if it isn't already.

## How to Control Other Accessories
If you wanted to make your lights blink, for instance, you would set up *two* automations: one that causes lights to turn on when this switch's `Status Active` property becomes `TRUE` and another that causes lights to turn off when this switch's `Status Active` property becomes `FALSE`. Note that these automations cannot currently be set up in the Apple Home app and require an app like Home+ or the Eve app that integrate with HomeKit at a lower level.

Here's an example of two automations in the Home+ app that cause a light to blink:

![Automation triggered when Status Active becomes true](https://github.com/shamanskyh/homebridge-blinking-switch/blob/main/images/automation-on.png?raw=true)
![Automation triggered when Status Active becomes false](https://github.com/shamanskyh/homebridge-blinking-switch/blob/main/images/automation-off.png?raw=true)

## Timing
Adjust the switch's `Set Duration` property in a HomeKit app to adjust the frequency at which the `Status Active` property toggles. Note that these automations cannot currently be set up in the Apple Home app and require an app like Home+ or the Eve app that integrate with HomeKit at a lower level.

Here's how this appears in the Home+ app:

![Set Duration property in the Home+ app](https://github.com/shamanskyh/homebridge-blinking-switch/blob/main/images/set-duration-property.png?raw=true)