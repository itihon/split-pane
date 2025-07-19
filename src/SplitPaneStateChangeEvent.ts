export type SplitPaneState = {
  gridTemplate: string;
  panes: NodeListOf<HTMLElement>;
};

type SplitPaneStateChangeKind = 'addpane' | 'removepane' | 'resizepane';

export default class SplitPaneStateChangeEvent extends Event {
  public oldState: SplitPaneState;
  public newState: SplitPaneState;
  public kind: SplitPaneStateChangeKind;
  static eventInit: EventInit = { bubbles: true, composed: true };

  constructor(
    kind: SplitPaneStateChangeKind,
    oldState: SplitPaneState,
    newState: SplitPaneState,
  ) {
    super('statechange', SplitPaneStateChangeEvent.eventInit);
    this.oldState = oldState;
    this.newState = newState;
    this.kind = kind;
  }
}
