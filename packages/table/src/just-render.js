export default {
  props: {
    renderFunction: Function,
    required: true
  },
  render(h) {
    return this.renderFunction(h);
  }
};
