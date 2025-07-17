import SplitPane from '../../src/index';
import type { SplitPaneOrientationType } from '../../src/SplitPane';

const visitLocalhost = () => {
  cy.visit('localhost:5173');
};

function createSplitPane(direction: SplitPaneOrientationType, panesCount: number):SplitPane {

  const splitPane = new SplitPane(direction);

  splitPane.append(
    ...Array
      .from({ length: panesCount })
      .map(() => document.createElement('div'))
      .map((div, idx) => (div.append(`Content area ${idx + 1}`), div))
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

  });

});