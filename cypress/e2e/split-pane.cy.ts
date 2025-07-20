import SplitPane from '../../src/index';
import type { SplitPaneOrientationType } from '../../src/SplitPane';
import SplitPaneStateChangeEvent from '../../src/SplitPaneStateChangeEvent';

const visitLocalhost = () => {
  cy.visit('localhost:5173');
};

function createSplitPane(direction: SplitPaneOrientationType, panesCount: number, options = { width: '900px', height: '600px' }):SplitPane {

  const splitPane = new SplitPane(direction);

  splitPane.style.width = options.width;
  splitPane.style.height = options.height;

  splitPane.append(
    ...Array
      .from({ length: panesCount })
      .map(() => document.createElement('div'))
      .map((div, idx) => (div.append(`Content area ${idx + 1}`), div))
      .map(div => { 
        div.style.width = '100%';
        div.style.height = '100%';
        return div;
      })
  );
  
  return splitPane;
}

const removeAllSplitPanes = (document: Document) =>
  document
    .querySelectorAll('split-pane')
    .forEach(splitPane => splitPane.remove());

describe('split-pane component', () => {

  describe('API', () => {
    before(() => {
      visitLocalhost();

      cy.document().then(document => {
        document.body.appendChild(createSplitPane('horizontal', 3));
      });
    });

    it('tests getPane method', () => {
      cy
        .get('split-pane')
        .then((res) => {
          const splitPane = res[0] as SplitPane;

          expect(splitPane.getPane(0)!.textContent).eq('Content area 1');
          expect(splitPane.getPane(1)!.textContent).eq('Content area 2');
          expect(splitPane.getPane(2)!.textContent).eq('Content area 3');
          expect(splitPane.getPane(3)).eq(null);
        });
    });
    
    it('tests getAllPanes method', () => {
      cy
        .get('split-pane')
        .then((res) => {
          const splitPane = res[0] as SplitPane;
          const panes = splitPane.getAllPanes();

          expect(panes[0].textContent).eq('Content area 1');
          expect(panes[1].textContent).eq('Content area 2');
          expect(panes[2].textContent).eq('Content area 3');
          expect(panes[3]).eq(undefined);
        });
    });
    
    it('tests length property', () => {
      cy
        .get('split-pane')
        .then(({ 0: splitPane }) => {
          expect((splitPane as SplitPane).length).eq(3);
        });
    });
    
    it('tests removePane method', () => {

      const testRemovePanesFromEnd = (direction: SplitPaneOrientationType ) => (document: Document) => {
        let panes;
        let splitters;
        const panesCount = 3;
        const splitPane = createSplitPane(direction, panesCount);
        document.body.appendChild(splitPane);

        expect(splitPane.removePane(splitPane.length)).eq(false);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 1);
        expect(splitPane.length).eq(panesCount);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1].textContent).eq('Content area 2');
        expect(panes[2].textContent).eq('Content area 3');
        expect(panes[3]).eq(undefined);

        expect(splitPane.removePane(splitPane.length - 1)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 2);
        expect(splitPane.length).eq(panesCount - 1);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1].textContent).eq('Content area 2');
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(splitPane.length - 1)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 2);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(splitPane.length - 1)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 3);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('');
        expect(panes[-1]).eq(undefined);
        expect(panes[0]).eq(undefined);
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(splitPane.length - 1)).eq(false);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 3);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('');
        expect(panes[-1]).eq(undefined);
        expect(panes[0]).eq(undefined);
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
      };
      
      const testRemovePanesFromStart = (direction: SplitPaneOrientationType ) => (document: Document) => {
        let panes;
        let splitters;
        const panesCount = 3;
        const splitPane = createSplitPane(direction, panesCount);
        document.body.appendChild(splitPane);

        expect(splitPane.removePane(-1)).eq(false);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 1);
        expect(splitPane.length).eq(panesCount);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1].textContent).eq('Content area 2');
        expect(panes[2].textContent).eq('Content area 3');
        expect(panes[3]).eq(undefined);

        expect(splitPane.removePane(0)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 2);
        expect(splitPane.length).eq(panesCount - 1);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 2');
        expect(panes[1].textContent).eq('Content area 3');
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(0)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 2);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 3');
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(0)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 3);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('');
        expect(panes[-1]).eq(undefined);
        expect(panes[0]).eq(undefined);
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
        
        expect(splitPane.removePane(0)).eq(false);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 3);
        expect(splitPane.length).eq(panesCount - 3);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('');
        expect(panes[-1]).eq(undefined);
        expect(panes[0]).eq(undefined);
        expect(panes[1]).eq(undefined);
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
      };
      
      const testRemovePanesMiddle = (direction: SplitPaneOrientationType ) => (document: Document) => {
        let panes;
        let splitters;
        const panesCount = 3;
        const splitPane = createSplitPane(direction, panesCount);
        document.body.appendChild(splitPane);

        expect(splitPane.removePane(-1)).eq(false);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 1);
        expect(splitPane.length).eq(panesCount);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1].textContent).eq('Content area 2');
        expect(panes[2].textContent).eq('Content area 3');
        expect(panes[3]).eq(undefined);

        expect(splitPane.removePane(1)).eq(true);
        panes = splitPane.getAllPanes();
        splitters = splitPane.querySelectorAll('.sp-splitter');
        expect(splitters.length).eq(panesCount - 2);
        expect(splitPane.length).eq(panesCount - 1);
        expect(splitPane.style.getPropertyValue('--grid-template'))
          .eq('1fr min-content 1fr');
        expect(panes[-1]).eq(undefined);
        expect(panes[0].textContent).eq('Content area 1');
        expect(panes[1].textContent).eq('Content area 3');
        expect(panes[2]).eq(undefined);
        expect(panes[3]).eq(undefined);
      };

      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesFromEnd('horizontal'));
      
      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesFromEnd('vertical'));
      
      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesFromStart('horizontal'));
      
      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesFromStart('vertical'));
      
      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesMiddle('horizontal'));
      
      cy.document().then(removeAllSplitPanes);
      cy.document().then(testRemovePanesMiddle('vertical'));
    });

    it('tests addPane method', () => {
      cy.document().then(removeAllSplitPanes);

      cy.document().then(document => {
        let splitPane;
        
        // length 0: no idx, idx < 0, idx === 0, idx > 0
        splitPane = new SplitPane('horizontal');
        document.body.appendChild(splitPane);

        const div = document.createElement('div');
        div.append('Inserted pane');

        expect(splitPane.style.getPropertyValue('--grid-template')).eq('');
        splitPane.addPane(div);
        expect(splitPane.length).eq(1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(0);
        expect(splitPane.getPane(0)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr');
        splitPane.removePane(0);

        expect(splitPane.style.getPropertyValue('--grid-template')).eq('');
        splitPane.addPane(div, -1);
        expect(splitPane.length).eq(1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(0);
        expect(splitPane.getPane(0)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr');
        splitPane.removePane(0);
        
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('');
        splitPane.addPane(div, 0);
        expect(splitPane.length).eq(1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(0);
        expect(splitPane.getPane(0)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr');
        splitPane.removePane(0);
        
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('');
        splitPane.addPane(div, 10);
        expect(splitPane.length).eq(1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(0);
        expect(splitPane.getPane(0)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr');
        splitPane.removePane(0);

        removeAllSplitPanes(document);

        // length > 0: no idx, idx < 0, idx < length, idx >= length 
        const count = 3;
        splitPane = createSplitPane('horizontal', count);
        document.body.appendChild(splitPane);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(count - 1);
        
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr');
        splitPane.addPane(div);
        expect(splitPane.length).eq(count + 1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(count);
        expect(splitPane.getPane(splitPane.length - 1)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr min-content 1fr');
        splitPane.removePane(splitPane.length - 1);

        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr');
        splitPane.addPane(div, -1);
        expect(splitPane.length).eq(count + 1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(count);
        expect(splitPane.getPane(0)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr min-content 1fr');
        splitPane.removePane(0);
        
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr');
        splitPane.addPane(div, count - 1);
        expect(splitPane.length).eq(count + 1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(count);
        expect(splitPane.getPane(count - 1)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr min-content 1fr');
        splitPane.removePane(count - 1);
        
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr');
        splitPane.addPane(div, count);
        expect(splitPane.length).eq(count + 1);
        expect(splitPane.querySelectorAll('.sp-splitter').length).eq(count);
        expect(splitPane.getPane(splitPane.length - 1)).eq(div);
        expect(splitPane.style.getPropertyValue('--grid-template')).eq('1fr min-content 1fr min-content 1fr min-content 1fr');
        splitPane.removePane(splitPane.length - 1);
      });
    });
    
    it('inserts splitters', () => {
      cy
        .document().then(removeAllSplitPanes)
        .document().then(document => {

          let splitPaneH;
          let splitPaneV; 
          
          splitPaneH = createSplitPane('horizontal', 2)
          splitPaneV = createSplitPane('vertical', 3);

          // adding pane before mounting
          splitPaneH.addPane(splitPaneV, 1);
          document.body.appendChild(splitPaneH);

          expect(
            Array
              .from(splitPaneH.children)
              .filter(el => el.classList.contains('sp-splitter')).length,
          ).eq(2);
          
          expect(
            Array
              .from(splitPaneV.children)
              .filter(el => el.classList.contains('sp-splitter')).length,
          ).eq(2);

          removeAllSplitPanes(document);
          
          splitPaneH = createSplitPane('horizontal', 2)
          splitPaneV = createSplitPane('vertical', 3);

          // adding pane after mounting
          document.body.appendChild(splitPaneH);
          splitPaneH.addPane(splitPaneV, 1);

          expect(
            Array
              .from(splitPaneH.children)
              .filter(el => el.classList.contains('sp-splitter')).length,
          ).eq(2);
          
          expect(
            Array
              .from(splitPaneV.children)
              .filter(el => el.classList.contains('sp-splitter')).length,
          ).eq(2);

          removeAllSplitPanes(document);
        });
    });

  });

  describe('events', () => {
    it('should fire state change event on add pane', () => {
      cy.document().then(removeAllSplitPanes);

      cy.document().then(document => {
        const splitPane = createSplitPane('horizontal', 2);
        document.body.appendChild(splitPane);
      });

      cy.get('split-pane').then(res => {
        const splitPane = res[0] as SplitPane;
        const div = document.createElement('div');
        const panes = splitPane.getAllPanes();

        splitPane.addEventListener('statechange', (event) => {
          const { oldState, newState, kind } = event as SplitPaneStateChangeEvent;

          expect(kind).eq('addpane');

          expect(oldState.gridTemplate).eq('1fr min-content 1fr');
          expect(newState.gridTemplate).eq('1fr min-content 1fr min-content 1fr');

          expect([...oldState.panes]).deep.eq([...panes]);
          expect([...newState.panes]).deep.eq([panes[0], div, panes[1]]);
        });

        splitPane.addPane(div, 1);
      });
    });
    
    it('should fire state change event on remove pane', () => {
      cy.document().then(removeAllSplitPanes);

      cy.document().then(document => {
        const splitPane = createSplitPane('horizontal', 3);
        document.body.appendChild(splitPane);
      });

      cy.get('split-pane').then(res => {
        const splitPane = res[0] as SplitPane;
        const panes = splitPane.getAllPanes();

        splitPane.addEventListener('statechange', (event) => {
          const { oldState, newState, kind } = event as SplitPaneStateChangeEvent;

          expect(kind).eq('removepane');

          expect(oldState.gridTemplate).eq('1fr min-content 1fr min-content 1fr');
          expect(newState.gridTemplate).eq('1fr min-content 1fr');

          expect([...oldState.panes]).deep.eq([...panes]);
          expect([...newState.panes]).deep.eq([panes[0], panes[2]]);
        });

        splitPane.removePane(1);
      });
    });
    
    it('should fire state change event on resize', () => {
      cy.document().then(removeAllSplitPanes);

      cy.document().then(document => {
        const splitPane = createSplitPane('horizontal', 3);
        document.body.appendChild(splitPane);
      });

      cy.get('split-pane').then(res => {
        const splitPane = res[0] as SplitPane;
        const panes = splitPane.getAllPanes();

        splitPane.addEventListener('statechange', (event) => {
          const { oldState, newState, kind } = event as SplitPaneStateChangeEvent;
          
          const wholeWidth = splitPane.offsetWidth;
          const firstPaneWidth = panes[0].offsetWidth;
          const secondPaneWidth = panes[1].offsetWidth;

          const firstPanePercentage = firstPaneWidth / wholeWidth * 100;
          const secondPanePercentage = secondPaneWidth / wholeWidth * 100;

          expect(kind).eq('resizepane');

          expect(oldState.gridTemplate).eq('1fr min-content 1fr min-content 1fr');
          expect(newState.gridTemplate).eq(`${firstPanePercentage}% min-content ${secondPanePercentage}% min-content 1fr`);

          expect([...oldState.panes]).deep.eq([...panes]);
          expect([...newState.panes]).deep.eq([...panes]);
        });

        cy
        .get('split-pane')
        .get('.sp-splitter')
        .first()
        .trigger('pointerdown', { pointerId: 1, offsetX: 0, force: true })
        .trigger('pointermove', { pointerId:1, offsetX: 150, force: true })
        .trigger('pointerup', { pointerId: 1, offsetX: 150, force: true });
      });
    });
  });
  
  describe('user interaction', () => {
    function getDimension(element: HTMLElement, type: SplitPaneOrientationType) {
      return type === 'horizontal' ? element.offsetWidth : element.offsetHeight;
    }

    function moveSplitter(splitterIndex:number, distance: number, type: SplitPaneOrientationType) {
      const pointerId = 1;
      const offsetX = type === 'horizontal' ? distance : 0;
      const offsetY = type === 'vertical' ? distance : 0;

      cy
        .get('split-pane')
        .find('.sp-splitter')
        .eq(splitterIndex)
        .as('splitter');

      return cy
        .get('@splitter')
        .trigger('pointerdown', { pointerId, offsetX: 0, offsetY: 0, force: true })
        .trigger('pointermove', { pointerId, offsetX, offsetY, force: true })
        .trigger('pointerup', { pointerId, force: true })
        .then(() => splitterIndex);
    }

    const ensurePanesAreResized = (
      splitPane: SplitPane, 
      type: SplitPaneOrientationType, 
    ) => (splitterIndex: number) => {
      const panes = splitPane.getAllPanes();
      const prevPaneSize = getDimension(panes[splitterIndex], type);
      const nextPaneSize = getDimension(panes[splitterIndex + 1], type);
      const wholeSize = getDimension(splitPane, type);
      // const pane2newSize = getDimension(panes[2], type);
      const prevPanePercentage = prevPaneSize / wholeSize * 100;
      const nextPanePercentage = nextPaneSize / wholeSize * 100;
      const template = splitPane.style.getPropertyValue('--grid-template');

      const newTemplate = template
        .split(' min-content ')
        .map((paneSize, idx) => {
          if (idx === splitterIndex) {
            return `${prevPanePercentage}%`;
          }
          if (idx === splitterIndex + 1) {
            return `${nextPanePercentage}%`;
          }
          return paneSize;
        })
        .join(' min-content ');

      // expect(pane2newSize).eq(pane2size); !!! gets 1px larger
      expect(template).eq(newTemplate);
    };

    const testResize = (type: SplitPaneOrientationType, size: number) => 
      (document: Document) => {
        const splitPane = createSplitPane(type, 3);
        document.body.appendChild(splitPane);

        const panes = splitPane.getAllPanes();

        const pane0size = getDimension(panes[0], type);
        const pane1size = getDimension(panes[1], type);
        const pane2size = getDimension(panes[2], type);
        const wholeInitialSize = getDimension(splitPane, type);

        expect(pane0size)
          .eq(pane1size)
          .eq(pane2size)
          .greaterThan(0)
          .lessThan(wholeInitialSize);

        return moveSplitter(0, size, type)
          .wait(10)
          .then(ensurePanesAreResized(splitPane, type))
          .then(() => {
            const wholeNewSize = getDimension(splitPane, type);
            expect(wholeNewSize).eq(wholeInitialSize);
          })
          .then(() => {
            moveSplitter(1, size * 2, type)
              .wait(10)
              .then(ensurePanesAreResized(splitPane, type))
              .then(() => {
                const wholeNewSize = getDimension(splitPane, type);
                expect(wholeNewSize).eq(wholeInitialSize);
              });
          });
      };

    it('resizes panes', () => {
      cy
        .document()
        .then(removeAllSplitPanes)
        .document().then(testResize('horizontal', 100))
        .document().then(removeAllSplitPanes)
        .document().then(testResize('horizontal', 420))
        .document().then(removeAllSplitPanes)
        .document().then(testResize('vertical', 50))
        .document().then(removeAllSplitPanes)
        .document().then(testResize('vertical', 250));
    });

    it('does not set pane size < 0', () => {
      cy
        .document().then(removeAllSplitPanes)
        .document().then(testResize('horizontal', -100))
        .get('split-pane')
        .first()
        .should('have.attr', 'style')
        .and('include', '--grid-template: 0% min-content 0% min-content 99.77777777777777%;')
        .document().then(removeAllSplitPanes)
        .document().then(testResize('horizontal', 3000))
        .get('split-pane')
        .first()
        .should('have.attr', 'style')
        .and('include', '--grid-template: 66.44444444444444% min-content 33.33333333333333% min-content 0%;')
        .document().then(removeAllSplitPanes)
        .document().then(testResize('vertical', -100))
        .get('split-pane')
        .first()
        .should('have.attr', 'style')
        .and('include', '--grid-template: 0% min-content 0% min-content 99.66666666666667%;')
        .document().then(removeAllSplitPanes)
        .document().then(testResize('vertical', 3000))
        .get('split-pane')
        .first()
        .should('have.attr', 'style')
        .and('include', '--grid-template: 66.33333333333333% min-content 33.33333333333333% min-content 0%;')
    });

    it('resizes panes with nested split pane components', () => {
      cy
        .document().then(removeAllSplitPanes)
        .document().then(document => {
          const splitPaneH = createSplitPane('horizontal', 2);
          const splitPaneV = createSplitPane('vertical', 3 , { width: '100%', height: '100%' });

          document.body.appendChild(splitPaneH);
          splitPaneH.addPane(splitPaneV, 1);

          cy  
            .then(() => moveSplitter(splitPaneH, 0, 500, 'horizontal')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneH, 'horizontal'))
            )
            .then(() => moveSplitter(splitPaneH, 0, 100, 'horizontal')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneH, 'horizontal'))
            )
            .then(() => moveSplitter(splitPaneH, 1, 200, 'horizontal')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneH, 'horizontal'))
            )
            .then(() => moveSplitter(splitPaneH, 1, 700, 'horizontal')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneH, 'horizontal'))
            )
            .then(() => moveSplitter(splitPaneV, 0, 370, 'vertical')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneV, 'vertical'))
            )
            .then(() => moveSplitter(splitPaneV, 0, 30, 'vertical')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneV, 'vertical'))
            )
            .then(() => moveSplitter(splitPaneV, 1, 50, 'vertical')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneV, 'vertical'))
            )
            .then(() => moveSplitter(splitPaneV, 1, 500, 'vertical')
              .wait(10)
              .then(ensurePanesAreResized(splitPaneV, 'vertical'))
            );
        });

    });
  });
});