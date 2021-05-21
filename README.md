
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

This plugin provides a single switch that can be turned on and off, a readonly 'Status Active' boolean that can be used in automations, and a 'Set Duration' variable to set the time (in seconds) between flips of the boolean 'Status Active' flag.
