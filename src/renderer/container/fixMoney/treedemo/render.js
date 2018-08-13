export default {
  name: 'RenderTreeNode',
  functional: true,
  props: {
    render: Function,
    node: {
      type: Object,
      default: function () {
        return {}
      }
    },
    parentNode: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  render: (h, ctx) => {
    return ctx.props.render(h, ctx.props.node, ctx.props.parentNode)
  }
}
