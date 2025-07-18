import SplitPane from '../../src/index';
import type { SplitPaneOrientationType } from '../../src/SplitPane';
import SplitPaneStateChangeEvent from '../../src/SplitPaneStateChangeEvent';

const visitLocalhost = () => {
  cy.visit('localhost:5173');
};

function createSplitPane(direction: SplitPaneOrientationType, panesCount: number):SplitPane {

  const splitPane = new SplitPane(direction);

  splitPane.style.width = '900px';
  splitPane.style.height = '600px';

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
        .trigger('pointerdown', { pointerId: 1, offsetX: 0 })
        .trigger('pointermove', { pointerId:1, offsetX: 150 })
        .trigger('pointerup', { pointerId: 1, offsetX: 150})
      });


    });
  });
  
});