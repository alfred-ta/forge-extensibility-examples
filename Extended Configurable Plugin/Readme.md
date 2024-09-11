## Vulcan Chart embed

This is the simplest extension, just show the VulcanChart in Tab Panel with the following code

```
forgeSDK.register.siteTab({
  component: 'https://app.vulcanapp.com/widget/XXXXX-XXXX',
  name: "vulcan-chart",
  label: "Vulcan Chart",
  height: "500",
});
```

- `forgeSDK` is the namespace of the SDK, you can name the SDK as you want, for example, it may after your organization name, like `vulcanSDK`, `muralSDK` and here it's `forgeSDK`.
- `register.siteTab`: Register to tab panel
- `component`: URL of the target iframe to embed

For any more questions, please check more information here.