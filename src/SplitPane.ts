import './style.css';

export type SplitPaneOrientationType = 'horizontal' | 'vertical';

class Splitter extends HTMLDivElement {
  constructor() {
    super();
    this.classList.add('sp-splitter');
  }
}

class GridTemplate {
  private splitter = '';
  private parsedTemplate: Array<string> = [];

  constructor(template = '', splitter = 'min-content') {
    this.splitter = splitter;
    if (template.trim().length) {
      this.parsedTemplate = template.split(splitter);
    }
  }

  add(idx: number, value = '1fr') {
    if (idx < 0) {
      this.parsedTemplate.unshift(value);
    } else {
      this.parsedTemplate.splice(idx, 0, value);
    }
  }

  remove(idx: number): boolean {
    if (this.parsedTemplate[idx]) {
      this.parsedTemplate.splice(idx, 1);
      return true;
    }
    return false;
  }

  get(idx: number): string | undefined {
    return this.parsedTemplate[idx];
  }

  set(idx: number, value = '1fr'): boolean {
    if (this.parsedTemplate[idx]) {
      this.parsedTemplate[idx] = value;
      return true;
    }
    return false;
  }

  parse(template: string, splitter = this.splitter) {
    if (template.trim().length) {
      this.parsedTemplate = template.split(splitter);
    }
  }

  build(splitter = this.splitter): string {
    return this.parsedTemplate.join(` ${splitter} `);
  }
}

export default class SplitPane extends HTMLElement {
  type: SplitPaneOrientationType | null = null;
  private gridTemplate: GridTemplate;
  private rAf: number = 0;
  private currentSplitter: Splitter | null = null;
  private currentSplitterIdx: number = Infinity;
  private currentResizeEvent: PointerEvent = new PointerEvent('move');
  private cursorCorrection: number = 0;

  private resizeRAF = () => {
    const splitter = this.currentSplitter;

    if (splitter) {
      const idx = this.currentSplitterIdx;
      const prevPane = splitter.previousElementSibling as HTMLElement;
      const nextPane = splitter.nextElementSibling as HTMLElement;

      let prevPaneSize = 0;
      let nextPaneSize = 0;
      let bothPaneSize = 0;
      let wholeSize = 0;

      if (this.type === 'horizontal') {
        prevPaneSize = Math.round(
          this.currentResizeEvent.offsetX -
            prevPane.offsetLeft -
            this.cursorCorrection,
        );
        nextPaneSize = Math.round(
          nextPane.offsetWidth - (prevPaneSize - prevPane.offsetWidth),
        );
        bothPaneSize = Math.round(prevPane.offsetWidth + nextPane.offsetWidth);
        wholeSize = this.clientWidth;
      } else if (this.type === 'vertical') {
        prevPaneSize = Math.round(
          this.currentResizeEvent.offsetY -
            prevPane.offsetTop -
            this.cursorCorrection,
        );
        nextPaneSize = Math.round(
          nextPane.offsetHeight - (prevPaneSize - prevPane.offsetHeight),
        );
        bothPaneSize = Math.round(
          prevPane.offsetHeight + nextPane.offsetHeight,
        );
        wholeSize = this.clientHeight;
      }

      if (prevPaneSize < 0) {
        prevPaneSize = 0;
        nextPaneSize = bothPaneSize;
      }

      if (nextPaneSize < 0) {
        nextPaneSize = 0;
        prevPaneSize = bothPaneSize;
      }

      const prevPanePercentage = (prevPaneSize / wholeSize) * 100;
      const nextPanePercentage = (nextPaneSize / wholeSize) * 100;

      this.gridTemplate.set(idx, `${prevPanePercentage}%`);
      this.gridTemplate.set(idx + 1, `${nextPanePercentage}%`);

      this.style.setProperty('--grid-template', this.gridTemplate.build());
    }
  };

  private resize(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    this.currentResizeEvent = e;

    cancelAnimationFrame(this.rAf);
    this.rAf = requestAnimationFrame(this.resizeRAF);
  }

  connectedCallback() {
    this.type = this.getAttribute('type') as SplitPaneOrientationType | null;

    if (this.type !== 'horizontal' && this.type !== 'vertical') {
      throw new Error(
        'SplitPane: type must be specified: horizontal or vertical',
      );
    }

    const childrenLength = this.children.length;
    const property = this.style.getPropertyValue('--grid-template');

    this.gridTemplate.parse(property);

    [...this.children].forEach((childElement, idx) => {
      if (!this.gridTemplate.get(idx)) {
        this.gridTemplate.add(idx);
      }

      if (idx + 1 < childrenLength) {
        const splitter = new Splitter();
        childElement.insertAdjacentElement('afterend', splitter);
      }
    });

    this.style.setProperty('--grid-template', this.gridTemplate.build());

    this.addEventListener('pointerdown', (e) => {
      if (e.target instanceof Splitter) {
        e.preventDefault();
        e.stopPropagation();
        this.setPointerCapture(e.pointerId);

        this.currentSplitter = e.target;
        this.currentSplitterIdx = Array.prototype.indexOf.call(
          this.querySelectorAll('.sp-splitter'),
          this.currentSplitter,
        );
        this.cursorCorrection =
          this.type === 'horizontal' ? e.offsetX : e.offsetY;

        this.addEventListener('pointermove', this.resize);
        this.classList.add('resizing');
      }
    });

    this.addEventListener('pointerup', (e) => {
      if (this.hasPointerCapture(e.pointerId)) {
        e.preventDefault();
        e.stopPropagation();
        this.releasePointerCapture(e.pointerId);

        this.currentSplitter = null;
        this.currentSplitterIdx = Infinity;
        this.cursorCorrection = 0;

        this.removeEventListener('pointermove', this.resize);
        this.classList.remove('resizing');
      }
    });
  }

  constructor(type: SplitPaneOrientationType | null, template = '') {
    super();
    this.gridTemplate = new GridTemplate(template);

    if (type) {
      this.type = type;
      this.setAttribute('type', type);
    }
  }

  get length(): number {
    return this.getAllPanes().length;
  }

  getPane(idx: number): HTMLElement | null {
    return this.getAllPanes().item(idx);
  }

  getAllPanes(): NodeListOf<HTMLElement> {
    return this.querySelectorAll(':not(.sp-splitter)');
  }

  removePane(idx: number): boolean {
    const panes = this.getAllPanes();
    const prevPane = panes.item(idx - 1);
    const pane = panes.item(idx);
    const nextPane = panes.item(idx + 1);

    if (pane) {
      const prevSplitter = pane.previousElementSibling as Splitter | null;

      if (prevSplitter) {
        prevSplitter.remove();
      } else {
        const nextSplitter = pane.nextElementSibling as Splitter | null;

        if (nextSplitter) {
          nextSplitter.remove();
        }
      }

      this.gridTemplate.remove(idx);

      if (nextPane) {
        this.gridTemplate.set(idx);
      } else if (prevPane) {
        this.gridTemplate.set(idx - 1);
      }

      this.style.setProperty('--grid-template', this.gridTemplate.build());

      pane.remove();
      return true;
    }

    return false;
  }
}

customElements.define('sp-splitter', Splitter, { extends: 'div' });
customElements.define('split-pane', SplitPane);
