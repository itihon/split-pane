import './style.css';

type SplitPaneOrientationType = 'horizontal' | 'vertical';

class Splitter extends HTMLDivElement {
  constructor() {
    super();
    this.classList.add('sp-splitter');
  }
}

const types = {
  horizontal: '--columns',
  vertical: '--rows',
};

export default class SplitPane extends HTMLElement {
  type: SplitPaneOrientationType | null = null;
  rAf: number = 0;
  private currentSplitter: Splitter | null = null;
  private currentSplitterIdx: number = Infinity;
  private currentResizeEvent: PointerEvent = new PointerEvent('move');
  private cursorCorrection: number = 0;

  private resizeRAF = () => {
    const property = this.style.getPropertyValue(types[this.type!]);
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

      const newProperty = property
        .split(' min-content ')
        .map((value, index) => {
          if (index === idx) {
            return `${prevPanePercentage}%`;
          } else if (index === idx + 1) {
            return `${nextPanePercentage}%`;
          }

          return value;
        })
        .join(' min-content ');

      this.style.setProperty(types[this.type!], newProperty);
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

    [...this.children].forEach((childElement, idx) => {
      const property = this.style.getPropertyValue(types[this.type!]);

      if (idx + 1 < childrenLength) {
        const splitter = new Splitter();
        childElement.insertAdjacentElement('afterend', splitter);
        this.style.setProperty(
          types[this.type!],
          `${property} 1fr min-content`,
        );
      } else {
        this.style.setProperty(types[this.type!], `${property} 1fr`);
      }
    });

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

  constructor(type: SplitPaneOrientationType | null) {
    super();

    if (type) {
      this.type = type;
      this.setAttribute('type', type);
    }
  }
}

customElements.define('sp-splitter', Splitter, { extends: 'div' });
customElements.define('split-pane', SplitPane);
