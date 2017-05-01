# idyll-fixed-feature

> [fixed-feature](http://rickyreusser.com/idyll-experiments/fixed-feature/)

```
[var name:"position" value:0 /]

[Feature value:position]
  [FeatureContent]
    [Regl var:position/]
  [/FeatureContent]

  [Screen]Screen 1, position: [DisplayVar var:position /][/Screen]
  [Screen]Screen 2, Position: [DisplayVar var:position /][/Screen]
  [Screen]Screen 3, Position: [DisplayVar var:position /][/Screen]
[/Feature]
```
