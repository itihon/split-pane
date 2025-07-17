import SplitPane from '../../src/index';

const visitLocalhost = () => {
  cy.visit('localhost:5173');
};

describe('split-pane component', () => {

  describe('API', () => {
    before(() => {
      visitLocalhost();

      cy.document().then(document => {
        const splitPaneH = new SplitPane('horizontal');
        const splitPaneV = new SplitPane('vertical');
        const div1 = document.createElement('div');
        const div2 = document.createElement('div');
        const div3 = document.createElement('div');
        const div4 = document.createElement('div');
        const div5 = document.createElement('div');
        const div6 = document.createElement('div');

        div1.append('Content area 1');
        div2.append('Content area 2');
        div3.append('Content area 3');
        div4.append('Content area 4');
        div5.append('Content area 5');
        div6.append('Content area 6');

        splitPaneH.append(div1, div2, div3);
        splitPaneV.append(div4, div5, div6);

        document.body.append(splitPaneH, splitPaneV);
      });
    })

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