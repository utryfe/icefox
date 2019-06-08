<script>
import { getDefaultRouteComponent } from '../../utils/route'

function getTabLabelVNodes(createElement, labelProp, route) {
  const component = getDefaultRouteComponent(route)

  let label
  if (typeof labelProp === 'string') {
    label = route[labelProp]
  } else if (typeof labelProp === 'function') {
    label = labelProp(createElement, route, component)
    if (label !== null && typeof label === 'object') {
      return [label]
    }

    if (typeof label === 'number') {
      label = `${label}`
    }
  }

  if (typeof label !== 'string' && labelProp !== 'title') {
    label = route['title']
  }

  if (component && typeof label !== 'string') {
    label = component['title']
  }

  if (typeof label !== 'string') {
    label = ''
  }
  return [label]
}

export default {
  name: 'TabLabel',
  functional: true,

  props: {
    route: Object,

    prop: {
      type: [String, Function],
      default: 'title',
    },
  },

  render(createElement, context) {
    const { props } = context
    const { route, prop } = Object.assign({}, props)
    return createElement(
      'span',
      {
        class: 'ice-tabs-label',
      },
      getTabLabelVNodes(createElement, prop, route)
    )
  },
}
</script>

<style lang="less">
.ice-tabs-label {
  font-weight: normal;
}
</style>
