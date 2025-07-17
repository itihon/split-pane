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
    
  });

});