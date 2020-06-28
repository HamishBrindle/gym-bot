<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import { VNode, RenderContext } from 'vue';

/**
 * The Iffy component serves as a conditional wrapper where,
 * if a condition is met, the wrapper will render itself and
 * it's nested children. However, if the condition is NOT met,
 * the wrapper will pass on it's children and cease to exist.
 */
@Component({
  name: 'Iffy',
})
export class Iffy extends Vue {
  /**
   * Component is functional
   */
  functional = true;

  /**
   * Condition to be met which determines if wrapper is
   * rendered
   */
  @Prop({ required: true })
  show!: boolean;

  /**
   * Render function
   */
  render(h: Function, context: RenderContext) {
    const { children, props } = context;

    if (props.show) {
      return children;
    } else {
      return children
        .map((child: VNode) => child.children ?? child.componentOptions?.children ?? null)
        .filter(Boolean);
    }
  }
}
</script>
