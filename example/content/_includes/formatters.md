---
title: Format Examples
group: Component Gallery
---

## PreviewFormat

Useful for rendering Table Cell data into different customizable formats, e.g:

### Currency

```html
<PreviewFormat :value="50" :format="Formats.currency" />
```

### Bytes

```html
<PreviewFormat :value="10000000" :format="Formats.bytes" />
```

### Icon

```html
<PreviewFormat value="/pages/vue/1.jpg" :format="Formats.icon" />
```

:::include example.md:::