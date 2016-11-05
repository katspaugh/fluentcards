import { FluentcardsPage } from './app.po';

describe('fluentcards App', function() {
  let page: FluentcardsPage;

  beforeEach(() => {
    page = new FluentcardsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
